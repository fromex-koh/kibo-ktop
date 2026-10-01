import {Fragment} from 'react'
import {PrintButton} from '@/components/composite/print-button'
import {ComparisonRadarChart, type ComparisonRadarItem} from '@/components/custom/comparison-radar-chart'
import {
    GroupedColumnChart,
    type GroupedColumnItem,
    type GroupedColumnSeries,
} from '@/components/custom/grouped-column-chart'
import {ListMarker} from '@/components/custom/list-marker'
import {
    LabelValueTable,
    ReportDocument,
    ReportPageStyle,
    ReportSection,
    cellShapeClassName,
    headCellClassName,
    headCellShapeClassName,
    tableClassName,
} from '@/components/custom/report-document'
import {
    EVALUATION_LEVEL_STEP_CLASSNAMES,
    EVALUATION_LEVEL_STEPS,
    EVALUATION_RATINGS,
    isGuaranteeGradeVisible,
    TECH_BUSINESS_GRADE_STEPS,
    TECH_BUSINESS_GROWTH_STEPS,
    TECH_BUSINESS_RISK_STEPS,
    TRL_STAGE_GROUPS,
    TRL_STEPS,
    type EvaluationReport,
    type EvaluationReportBenchmark,
    type EvaluationReportCount,
    type EvaluationReportScore,
} from '@/constants/evaluation-report'
import {cn} from '@/lib/utils'

// KTRS-FM 평가결과 리포트 — 새 창으로 여는 인쇄용 문서(A4 폭).
//
// 화면 이름(일반분석 · 심층분석)과 문서 제목('자가진단 평가결과')은 다르다 — 제목은 문서가 늘 같은 말을
// 쓰고, 어느 자리에서 연 문서인지는 제목 위 꼬리표(report.label)가 알린다.
//
// 심층분석은 A4 네 장이다 — 1쪽 자가진단 평가결과 · 2~3쪽 기술평가서 · 4쪽 기술사업평가 세부내역.
// 일반분석은 1쪽 하나로 끝난다(hasTechnicalReport=false). 폭은 A4 794(w-report)다.
//
// 쪽은 ReportDocument 단위로 갈린다 — 두 번째 문서부터 startsNewPage 를 주면 종이에서 새 장에서 시작한다.
// 화면에서는 이어져 보이고, 쪽마다 문서 머리(꼬리표 · 제목 · 인쇄)가 다시 선다.
// 한 쪽에 들어갈 양은 A4 높이 1122 가 한계다 — 구획을 더하면 그 쪽 높이를 재서 넘치지 않는지 확인한다.
// 글자는 일반 화면보다 한 단계 작다 — 표는 12, 4쪽 세부내역만 14, 차트 눈금·이름표가 11 이다.
//
// [프론트엔드 연동] 이 파일은 받은 값을 그리기만 한다 — 목업과 조회 API 의 교체 지점은
// content/service/evaluation-report.ts 이고, 응답 모양은 constants/evaluation-report.ts 에 적혀 있다.
// 차트는 프로젝트 공통 컴포넌트(ComparisonRadarChart·GroupedColumnChart)를 그대로 쓰고, 문서 크기에 맞춰
// 축·범례를 끄고 높이만 정한다 — 높이는 안쪽 차트와 바깥을 같은 값으로 두어야 불러오는 중의 스켈레톤이
// 같은 자리에 선다. 기술성숙도만 좌표가 정해진 그림이라 직접 그린다.

const numberFormatter = new Intl.NumberFormat('ko-KR')

// 표 칸의 두 벌 — 칸이 많은 표(dense 12: TRL · 동사수준)와 이 문서에서 가장 큰 표(detail 14: 세부내역)다.
// 글자(typo)와 칸 모양을 갈라 두는 이유는 TRL 표의 현재 단계 칸처럼 글자만 바꿔 끼울 때가 있어서다 —
// typo-* 는 twMerge 가 모르는 우리 유틸리티라 한 요소에 두 개를 겹쳐 쓰면 나중 것이 이긴다[PB-08].
// 칸 사이는 세로선으로 가르지만 표의 바깥 좌우에는 선이 없다(시안) — first/last 로 양 끝만 지운다.
const denseCellClassName = 'border-subtle-3 border-x border-b px-1 py-2 text-center first:border-l-0 last:border-r-0'
const denseHeadCellClassName = `bg-primary-subtle typo-caption-bold text-foreground ${denseCellClassName}`
const denseBodyCellClassName = `typo-caption-regular text-label-foreground ${denseCellClassName}`
const detailCellClassName = 'border-subtle-3 border-r border-b px-2 py-3'
const detailHeadCellClassName = `bg-primary-subtle typo-body-l-bold text-foreground ${detailCellClassName}`
const detailBodyCellClassName = `typo-body-l-regular text-label-foreground ${detailCellClassName}`

// ── 문서 머리 ────────────────────────────────────────────────────────────────────

// ── 등급 ────────────────────────────────────────────────────────────────────────

// 등급 눈금 한 줄 — 일곱 칸 중 받은 등급의 칸만 채워진다.
//
// 채우는 색은 자리마다 다르다 — 아래 수준 범례(매우높음~매우낮음)와 같은 색을 그 자리에서 가져오므로,
// 왼쪽 칸이 걸리면 진하고 오른쪽 칸이 걸리면 옅다. 그래서 색 자체가 몇 번째 자리인지를 말해 준다.
// 색만으로는 어느 칸인지 전해지지 않으므로 그 칸에 읽어 줄 말을 함께 둔다[5.3.1].
// 등급 칸의 글자는 글줄 높이를 칸 높이(24)에 맞춘 상자에 담는다.
// typo-* 의 글줄(16.5)을 24 칸 가운데 놓으면 위아래로 3.75 씩 남는데, 이 소수점 여백을 인쇄
// 레이아웃이 정수로 깎으면서 글자가 위로 붙는다 — 화면은 멀쩡한데 인쇄 미리보기만 어긋나던 이유다.
// 글줄을 칸 높이와 같게 하면 남는 여백이 0 이라 화면과 인쇄가 같은 자리에 글자를 놓는다.
// 글자 크기·굵기는 그대로 칸의 typo-* 를 따르고, 이 상자는 글줄 높이만 바꾼다(같은 요소에
// typo-* 와 leading-* 을 겹쳐 쓰지 않는다[PB-08] — 겹쳐 쓰면 typo-* 가 이겨 먹히지도 않는다).
const gradeStepLabelClassName = 'leading-8'

const GradeScaleRow = ({
    label,
    steps,
    activeIndex,
    isMuted = false,
}: {
    label: string
    steps: readonly string[]
    activeIndex: number
    /** 받지 않은 칸을 한 단계 작고 옅게 둘지. 위험등급 줄만 그렇다. */
    isMuted?: boolean
}) => (
    <div className="flex items-center justify-between gap-4">
        <p className="typo-body-l-medium text-foreground">{label}</p>
        <ul className="flex w-146 items-center gap-1">
            {steps.map((step, index) => (
                <li key={step} className="flex-1">
                    <p
                        // 테두리는 두 상태 모두 두고 색만 바꾼다 — 해당 등급 칸만 테두리를 빼면 글자가 놓이는
                        // 안쪽 높이가 1px 달라져, 가운데 정렬을 그대로 따르지 않는 인쇄·PDF 에서 그 칸 글자만
                        // 위로 뜬다(사파리 PDF). 투명 테두리는 배경이 그 자리까지 칠해져 보이는 모습은 같다.
                        className={cn(
                            'flex items-center justify-center rounded-xs border px-0.5 text-center',
                            index === activeIndex
                                ? cn('typo-body-m-bold h-8 border-transparent', EVALUATION_LEVEL_STEP_CLASSNAMES[index])
                                : cn(
                                      'bg-surface border-subtle-3 text-foreground',
                                      isMuted
                                          ? 'typo-caption-regular text-muted-foreground h-6'
                                          : 'typo-body-m-medium h-8',
                                  ),
                        )}
                    >
                        <span className={index === activeIndex || !isMuted ? gradeStepLabelClassName : 'leading-6'}>
                            {step}
                        </span>
                    </p>
                    {/* 받은 칸이라는 말은 색 칸 밖에 둔다 — 칸 안에 숨긴 글자를 두면 검사 도구가
                        보이지도 않는 그 글자와 칸 배경의 대비를 재서 경고를 낸다. */}
                    {index === activeIndex ? <span className="sr-only"> (해당 등급)</span> : null}
                </li>
            ))}
        </ul>
    </div>
)

// 눈금 칸의 자리가 뜻하는 수준 — 왼쪽이 높고 오른쪽이 낮다. 위험등급 줄 바로 아래에 글자로만 둔다.
// 받은 등급의 자리만 굵게 세워, 색이 아니라 굵기와 말로 어느 칸인지 전한다[5.3.1].
const EvaluationLevelLegend = ({activeIndex}: {activeIndex: number}) => (
    <div className="flex justify-end">
        <ul className="flex w-146 gap-1">
            {EVALUATION_LEVEL_STEPS.map((level, index) => (
                <li key={level} className="flex-1">
                    <p
                        className={cn(
                            'text-label-foreground text-center',
                            index === activeIndex ? 'typo-micro-bold' : 'typo-micro-regular',
                        )}
                    >
                        {level}
                    </p>
                </li>
            ))}
        </ul>
    </div>
)

// 점수 가로 표 — 머리 줄에 이름, 그 아래 줄에 점수를 둔다(평가부문별 점수 3칸 · 5대 역량 5칸).
// 칸 수는 넘긴 항목 수가 정하고, 칸 폭은 고르게 나뉜다. 바깥 좌우에는 선을 두지 않는다.
const ScoreTable = ({caption, scores}: {caption: string; scores: readonly EvaluationReportScore[]}) => (
    <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        <colgroup>
            {scores.map((score) => (
                <col key={score.label} />
            ))}
        </colgroup>
        <thead>
            <tr>
                {scores.map((score) => (
                    <th
                        key={score.label}
                        scope="col"
                        className={cn(
                            headCellShapeClassName,
                            'border-subtle-3 typo-body-l-bold border-r text-center last:border-r-0',
                        )}
                    >
                        {score.label}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            <tr>
                {scores.map((score) => (
                    <td
                        key={score.label}
                        className={cn(cellShapeClassName, 'border-subtle-3 border-r text-center last:border-r-0')}
                    >
                        <span className="typo-body-xl-bold text-foreground">{score.score.toFixed(1)}</span>
                        <span className="typo-body-m-regular text-label-foreground">점 / 100점</span>
                    </td>
                ))}
            </tr>
        </tbody>
    </table>
)

// ── 표 ──────────────────────────────────────────────────────────────────────────

// ── 점수 ────────────────────────────────────────────────────────────────────────

// 기술사업 평점 배너 — 문서 머리 아래에 홀로 서는 카드다(시안 714×86).
// 막대가 아니라 숫자 하나를 크게 보이는 자리라, 왼쪽에 이름 오른쪽에 점수를 둔다.
const ScoreBanner = ({
    label,
    score,
    fractionDigits = 2,
    unit = '점',
}: {
    label: string
    score: number
    fractionDigits?: number
    unit?: string
}) => (
    // 이름과 점수는 값 한 쌍이다 — 목록(dl)으로 두어 '기술사업 평점 87.80점' 으로 읽힌다.
    // 큰 글자를 그냥 문단으로 두면 검사 도구가 '제목일 수 있음'으로 잡는다.
    <dl className="border-navy-200 bg-navy-100 flex items-center justify-between rounded-lg border px-6 py-7">
        <dt className="typo-title-l-bold text-foreground">{label}</dt>
        {/* 점수와 단위는 한 덩어리다 — 숫자는 24 Bold, 단위는 16 Medium 으로 한 단계 작다(시안). */}
        <dd className="text-navy-600 flex items-baseline gap-1">
            <span className="typo-h4-bold">{score.toFixed(fractionDigits)}</span>
            <span className="typo-body-xl-medium">{unit}</span>
        </dd>
    </dl>
)

// 개수 표(동사 기술인력 현황 · 동사 보유 지식재산권) — 이름 줄과 개수 줄이 짝을 이루고, 정해진 칸 수씩
// 끊어 아래로 쌓는다. 칸 수는 묶음마다 다르다(기술인력 2열 · 지식재산권 3열).
const CountTable = ({
    caption,
    items,
    columns,
}: {
    caption: string
    items: readonly EvaluationReportCount[]
    columns: number
}) => {
    // 칸 수만큼 끊어 줄을 만든다 — 나누어떨어지지 않으면 마지막 줄만 칸이 적다.
    const rows = items.reduce<EvaluationReportCount[][]>((acc, item, index) => {
        if (index % columns === 0) acc.push([])
        acc[acc.length - 1].push(item)

        return acc
    }, [])

    return (
        <table className={tableClassName}>
            <caption className="sr-only">{caption}</caption>
            <colgroup>
                {Array.from({length: columns}, (unused, index) => (
                    <col key={index} />
                ))}
            </colgroup>
            <tbody>
                {rows.map((row) => (
                    <Fragment key={row.map((item) => item.label).join('-')}>
                        <tr>
                            {row.map((item) => (
                                <th
                                    key={item.label}
                                    scope="col"
                                    className={cn(
                                        headCellShapeClassName,
                                        // 머리 글자는 12 다 — '전문학사/산업기사/기능사' 처럼 긴 이름이
                                        // 나란히 놓인 좁은 칸에서 두 줄로 접히지 않게 한다(nowrap).
                                        'border-subtle-3 typo-caption-bold border-r text-center whitespace-nowrap last:border-r-0',
                                    )}
                                >
                                    {item.label}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            {row.map((item) => (
                                <td
                                    key={item.label}
                                    className={cn(
                                        cellShapeClassName,
                                        'border-subtle-3 border-r text-center last:border-r-0',
                                    )}
                                >
                                    <span className="typo-body-xl-bold text-foreground">
                                        {numberFormatter.format(item.count)}
                                    </span>
                                    <span className="typo-body-m-regular text-label-foreground">{item.unit}</span>
                                </td>
                            ))}
                        </tr>
                    </Fragment>
                ))}
            </tbody>
        </table>
    )
}

// ── 기술성숙도(TRL) ──────────────────────────────────────────────────────────────

// 기술성숙도 그림 — 714×120 상자의 좌표를 그대로 옮겼다. 아홉 칸의 가운데에 점이 서고 단계가 오를수록
// 위로 올라간다. 점을 잇는 선이나 색 면은 없다(시안). 실제 값은 지금 어느 단계인지(trlStep) 하나뿐이고,
// 그 단계는 채워진 점 · 이름표(TRL8) · 아래 표의 강조 칸이 함께 알린다.
//
// 값이 바뀌는 그래프가 아니라 자리가 정해진 그림이라 차트 라이브러리를 쓰지 않는다 — 좌표를 그대로 두면
// 인쇄물에서도 아래 표의 칸 경계와 세로줄이 어긋나지 않는다.
const TRL_CHART_WIDTH = 714
const TRL_CHART_HEIGHT = 120
const TRL_STEP_COUNT = 9
const TRL_COLUMN_WIDTH = TRL_CHART_WIDTH / TRL_STEP_COUNT
const TRL_DOT_RADIUS = 4
// 이름표 글자 밑선은 점 중심에서 21 아래다(시안 점 중심 y 22 · 글자 밑선 43).
const TRL_LABEL_GAP = 21
// 아홉 점의 높이 — 칸 가운데에 서고 단계가 오를수록 위로 간다. 시안 Ellipse 의 중심 y 다.
const TRL_DOT_Y = [113, 89, 70, 55, 43, 33, 27, 22, 20]
const TRL_DOT_POINTS = TRL_DOT_Y.map((y, index) => ({x: TRL_COLUMN_WIDTH * (index + 0.5), y}))

// 곡선은 점을 지나 양 끝(0 · 714)까지 이어진다 — 양 끝의 꼬리는 곧은 선이다(시안).

// 점들을 부드럽게 잇는 선 — 이웃한 점의 기울기로 조절점을 잡는다(Catmull-Rom → 3차 베지에).
const toSmoothPath = (points: readonly {x: number; y: number}[]) =>
    points.reduce((path, point, index) => {
        if (index === 0) return `M${point.x},${point.y}`
        const previous = points[index - 1]
        const before = points[index - 2] ?? previous
        const next = points[index + 1] ?? point
        const control1 = {x: previous.x + (point.x - before.x) / 6, y: previous.y + (point.y - before.y) / 6}
        const control2 = {x: point.x - (next.x - previous.x) / 6, y: point.y - (next.y - previous.y) / 6}

        return `${path} C${control1.x},${control1.y} ${control2.x},${control2.y} ${point.x},${point.y}`
    }, '')

// 왼쪽 꼬리는 첫 두 점의 기울기를 그대로 이어 내려가다 상자 바닥(120)에 닿는 곳에서 끝난다(시안) —
// 왼쪽 가장자리(0)까지 끌고 가면 바닥에 눌려 평평해진다. 오른쪽 꼬리는 마지막 두 점의 기울기로
// 가장자리까지 뻗는다.
const trlTail = (from: {x: number; y: number}, to: {x: number; y: number}, x: number) => ({
    x,
    y: from.y + ((to.y - from.y) / (to.x - from.x)) * (x - from.x),
})
const TRL_CURVE_END = trlTail(TRL_DOT_POINTS[7], TRL_DOT_POINTS[8], TRL_CHART_WIDTH)
const TRL_LEFT_SLOPE = (TRL_DOT_POINTS[1].y - TRL_DOT_POINTS[0].y) / (TRL_DOT_POINTS[1].x - TRL_DOT_POINTS[0].x)
const TRL_CURVE_START = trlTail(
    TRL_DOT_POINTS[0],
    TRL_DOT_POINTS[1],
    TRL_DOT_POINTS[0].x - (TRL_CHART_HEIGHT - TRL_DOT_POINTS[0].y) / -TRL_LEFT_SLOPE,
)
// 점 사이만 부드럽게 잇고, 첫 점 왼쪽과 마지막 점 오른쪽의 꼬리는 곧은 선으로 뺀다(시안).
// 끝 자리를 점 목록에 함께 넣어 곡선으로 만들면, 그 짧은 구간이 다음 점의 기울기까지 받아 휘어 버린다.
const TRL_CURVE_PATH = [
    `M${TRL_CURVE_START.x},${TRL_CURVE_START.y}`,
    `L${toSmoothPath(TRL_DOT_POINTS).slice(1)}`,
    `L${TRL_CURVE_END.x},${TRL_CURVE_END.y}`,
].join(' ')
const TRL_AREA_PATH = `${TRL_CURVE_PATH} L${TRL_CHART_WIDTH},${TRL_CHART_HEIGHT} L0,${TRL_CHART_HEIGHT} Z`
// 선 아래 면은 파랑에서 흰색으로 옅어진다(시안) — 선에 붙은 위쪽이 가장 진하고 바닥에서 흰색이 된다.
// 그라데이션 기준은 면의 상자라, 왼쪽처럼 면이 얇은 곳은 거의 비고 오른쪽만 선 아래가 물든다.
// 문서에 이 그래프가 하나뿐이라 id 를 고정값으로 둔다.
const TRL_AREA_GRADIENT_ID = 'trl-area-gradient'

// TRL 표의 줄 높이는 글자에서 나온다 — 묶음 머리·단계 34, 이름 52(두 줄 칸이 있는 줄).
// TRL 표의 아래 두 줄(단계·내용) — 현재 단계 칸만 시안대로 굵은 글씨에 강조색·연한 바탕이다.
const trlCellClassName = (isCurrent: boolean) =>
    cn(
        denseCellClassName,
        isCurrent
            ? 'bg-primary-subtle typo-caption-bold text-primary-strong'
            : 'typo-caption-regular text-label-foreground',
    )

const TrlChart = ({currentStep}: {currentStep: number}) => {
    // 응답이 1~9 밖의 값을 주면 어느 단계도 강조하지 않는다 — 엉뚱한 자리를 짚는 것보다 비워 두는 편이 낫다.
    // 점·이름표·표 강조가 모두 이 값 하나를 보므로, 없으면 셋 다 함께 사라진다.
    const currentIndex = TRL_STEPS.findIndex((step) => step.step === currentStep)
    const activeStep = currentIndex === -1 ? undefined : TRL_STEPS[currentIndex].step
    const currentPoint = currentIndex === -1 ? undefined : TRL_DOT_POINTS[currentIndex]

    return (
        // 그림과 표는 따로 선다(시안) — 그림이 위에, 묶음 머리(기초연구…)부터가 표다.
        // 그림 위에는 진한 선, 표 위에는 연한 선이 있고 둘 사이는 20 이 벌어진다.
        <div className="flex flex-col gap-5">
            <div className="border-t-foreground-subtle border-t">
                <svg
                    viewBox={`0 0 ${TRL_CHART_WIDTH} ${TRL_CHART_HEIGHT}`}
                    className="h-30 w-full"
                    role="img"
                    aria-label={`기술성숙도 단계별 성숙 흐름${activeStep === undefined ? '' : ` — 현재 ${activeStep}단계`}`}
                >
                    <defs>
                        {/*
                         * 옅은 색을 투명도(stop-opacity)로 만들지 않는다 — 사파리에서 PDF 로 내보내면 이 값이
                         * 사라져 면 전체가 진한 파랑으로 찍힌다. 문서 바탕색과 미리 섞은 불투명한 색을 쓰면
                         * 화면과 인쇄물이 같은 색으로 남는다.
                         */}
                        <linearGradient id={TRL_AREA_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="0%"
                                stopColor="color-mix(in srgb, var(--ds-primary) 14%, var(--ds-surface))"
                            />
                            <stop
                                offset="55%"
                                stopColor="color-mix(in srgb, var(--ds-primary) 6%, var(--ds-surface))"
                            />
                            <stop offset="100%" stopColor="var(--ds-surface)" />
                        </linearGradient>
                    </defs>
                    <path d={TRL_AREA_PATH} fill={`url(#${TRL_AREA_GRADIENT_ID})`} />
                    {/* 단계 경계마다 세로 점선 — 아래 표의 칸 경계와 같은 자리다(시안). */}
                    {Array.from({length: TRL_STEP_COUNT - 1}, (unused, index) => (
                        <line
                            key={TRL_STEPS[index].step}
                            x1={TRL_COLUMN_WIDTH * (index + 1)}
                            x2={TRL_COLUMN_WIDTH * (index + 1)}
                            y1={0}
                            y2={TRL_CHART_HEIGHT}
                            stroke="var(--ds-subtle-3)"
                            strokeDasharray="4 4"
                        />
                    ))}
                    {/* 점을 잇는 점선 — 격자 위, 점 아래에 그린다. */}
                    <path
                        d={TRL_CURVE_PATH}
                        fill="none"
                        stroke="var(--ds-primary)"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                    />
                    {TRL_DOT_POINTS.map((point, index) => (
                        <circle
                            key={TRL_STEPS[index].step}
                            cx={point.x}
                            cy={point.y}
                            r={TRL_DOT_RADIUS}
                            fill={index === currentIndex ? 'var(--ds-primary)' : 'var(--ds-surface)'}
                            stroke="var(--ds-primary)"
                        />
                    ))}
                    {/* 지금 자리 이름표 — 점 아래에 붙는다. 범위 밖 값이면 그리지 않는다. */}
                    {currentPoint ? (
                        <text
                            x={currentPoint.x}
                            y={currentPoint.y + TRL_LABEL_GAP}
                            textAnchor="middle"
                            className="typo-micro-bold fill-primary"
                        >
                            TRL{activeStep}
                        </text>
                    ) : null}
                </svg>
            </div>
            {/* 표 위 선은 연한 선이다 — 진한 선은 그림 위에만 있다(시안). */}
            <table className={cn(tableClassName, 'before:bg-subtle-3')}>
                <caption className="sr-only">
                    신청기술의 기술성숙도(TRL) 단계{activeStep === undefined ? '' : ` — 현재 ${activeStep}단계`}
                </caption>
                <thead>
                    <tr>
                        {TRL_STAGE_GROUPS.map((group) => (
                            <th
                                key={group.label}
                                scope="colgroup"
                                colSpan={group.steps.length}
                                className={denseHeadCellClassName}
                            >
                                {group.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {TRL_STEPS.map((step) => (
                            <td key={step.step} className={trlCellClassName(step.step === activeStep)}>
                                {step.step}단계
                            </td>
                        ))}
                    </tr>
                    <tr>
                        {TRL_STEPS.map((step) => (
                            <td
                                key={step.step}
                                className={cn(
                                    trlCellClassName(step.step === activeStep),
                                    // 줄바꿈은 이름에 적힌 자리(\n)에서만 한다 — 자동으로 접히면 '시제품
                                    // 신뢰성 평가' 처럼 긴 이름이 세 줄이 되어 줄 높이(52)가 늘어난다.
                                    'align-middle whitespace-pre',
                                )}
                            >
                                {step.label}
                                {step.step === activeStep ? <span className="sr-only"> (현재 단계)</span> : null}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

// ── 유사업종·유사기술 대비 동사수준 ────────────────────────────────────────────────

const BENCHMARK_SERIES: GroupedColumnSeries[] = [
    {key: 'company', label: '동사', color: 'var(--ds-primary)'},
    {key: 'average', label: '평균', color: 'var(--ds-navy-200)'},
]

// 항목마다 단위가 달라(년·명·백만원) 한 눈금으로는 견줄 수 없다 — 그 항목의 Max 를 100 으로 본
// 비율로 막대를 그리고, 실제 값은 아래 표가 그대로 보여 준다.
const toRatio = (value: number, maximum: number) => (maximum > 0 ? Math.min(100, (value / maximum) * 100) : 0)

const BenchmarkBlock = ({benchmark}: {benchmark: EvaluationReportBenchmark}) => {
    const chartData: GroupedColumnItem[] = benchmark.columns.map((column, index) => ({
        id: `${benchmark.id}-${index}`,
        label: column.label.replace('\n', ' '),
        values: {
            company: toRatio(benchmark.applicant[index], benchmark.maximum[index]),
            average: toRatio(benchmark.average[index], benchmark.maximum[index]),
        },
    }))
    const statisticRows = [
        {label: 'Max', values: benchmark.maximum},
        {label: '평균', values: benchmark.average},
        {label: 'Min', values: benchmark.minimum},
    ]

    return (
        <ReportSection
            title={benchmark.title}
            // 범례는 시안 그대로다 — 견본 16 정사각 · 견본과 글자 사이 8 · 두 범례 사이 24 · 글자 12 Regular.
            aside={
                <ul className="typo-caption-regular text-label-foreground flex gap-6">
                    {BENCHMARK_SERIES.map((series) => (
                        <li key={series.key} className="flex items-center gap-2">
                            <span aria-hidden="true" className="size-4" style={{backgroundColor: series.color}} />
                            {series.label}
                        </li>
                    ))}
                </ul>
            }
        >
            <table className={tableClassName}>
                <caption className="sr-only">{benchmark.title}</caption>
                {/* 앞 두 칸(비교집단·구분)만 폭을 정하고 나머지는 고르게 나눈다. col 은 실제 열 수만큼 둔다.
                    두 칸을 합쳐 92 라 '신청기업' · '유사업종' · 'Max' 가 모두 한 줄로 들어간다(시안). */}
                <colgroup>
                    <col className="w-12" />
                    <col className="w-11" />
                    {benchmark.columns.map((column) => (
                        <col key={column.label} />
                    ))}
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col" colSpan={2} className={denseHeadCellClassName}>
                            평가항목
                        </th>
                        {benchmark.columns.map((column) => (
                            <th
                                key={column.label}
                                scope="col"
                                className={cn(denseHeadCellClassName, 'align-middle whitespace-pre-line')}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td
                            colSpan={2}
                            className="border-subtle-3 border-x border-b p-1 first:border-l-0 last:border-r-0"
                        >
                            <p className="typo-micro-regular text-label-foreground flex h-40 flex-col justify-between text-right">
                                <span>Max</span>
                                <span>Min</span>
                            </p>
                        </td>
                        {/* 막대는 항목 칸과 세로줄을 맞춰야 해서 일곱 칸을 통째로 쓴다. */}
                        <td
                            colSpan={benchmark.columns.length}
                            className="border-subtle-3 border-x border-b p-0 first:border-l-0 last:border-r-0"
                        >
                            <GroupedColumnChart
                                animate={false}
                                ariaLabel={`${benchmark.title} 막대그래프`}
                                data={chartData}
                                series={BENCHMARK_SERIES}
                                showAxes={false}
                                showLegend={false}
                                showTooltip={false}
                                showTrack
                                barGap={4}
                                barRadius={0}
                                maxBarSize={18}
                                className="gap-0 [&_[data-slot=chart]]:h-40 [&_[data-slot=chart]]:min-w-0 [&>div]:overflow-visible"
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" colSpan={2} className={cn(denseHeadCellClassName, 'align-middle')}>
                            신청기업
                        </th>
                        {benchmark.applicant.map((value, index) => (
                            <td key={benchmark.columns[index].label} className={denseBodyCellClassName}>
                                {value.toFixed(benchmark.columns[index].fractionDigits)}
                            </td>
                        ))}
                    </tr>
                    {statisticRows.map((row, rowIndex) => (
                        <tr key={row.label}>
                            {rowIndex === 0 ? (
                                <th
                                    scope="rowgroup"
                                    rowSpan={statisticRows.length}
                                    // 좌우 여백을 넓혀 두 글자씩 끊는다(시안 '유사 / 업종') —
                                    // 12 한글의 실제 폭이 10.4 라 여백이 8 이면 석 자가 들어가 버린다.
                                    className={cn(denseHeadCellClassName, 'px-2.5 align-middle')}
                                >
                                    {benchmark.comparisonLabel}
                                </th>
                            ) : null}
                            <th scope="row" className={cn(denseHeadCellClassName, 'align-middle')}>
                                {row.label}
                            </th>
                            {row.values.map((value, index) => (
                                <td key={benchmark.columns[index].label} className={denseBodyCellClassName}>
                                    {value.toFixed(1)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="typo-caption-regular text-label-foreground">{benchmark.note}</p>
        </ReportSection>
    )
}

// ── 기술사업평가 세부내역 ────────────────────────────────────────────────────────

// 기술사업 평점 세부내역 표 — 대항목 · 소항목과 다섯 판정(우수 A ~ 취약 E)이다.
// 이 쪽에는 이 표 하나뿐이라 글자가 14 로 가장 크다. 받은 판정 칸은 파란 바탕에 흰 점으로 찍는다(시안).
const DetailTable = ({groups}: {groups: EvaluationReport['detailGroups']}) => (
    <table className={tableClassName}>
        <caption className="sr-only">기술사업 평점 세부내역</caption>
        <colgroup>
            <col className="w-30" />
            <col />
            {EVALUATION_RATINGS.map((rating) => (
                <col key={rating.code} className="w-11" />
            ))}
        </colgroup>
        <thead>
            <tr>
                <th
                    scope="col"
                    rowSpan={2}
                    className={cn(detailHeadCellClassName, 'border-l-0 text-center align-middle')}
                >
                    대항목
                </th>
                <th scope="col" rowSpan={2} className={cn(detailHeadCellClassName, 'text-center align-middle')}>
                    소항목(평가항목)
                </th>
                {EVALUATION_RATINGS.map((rating) => (
                    <th key={rating.code} scope="col" className={cn(detailHeadCellClassName, 'last:border-r-0')}>
                        {rating.label}
                    </th>
                ))}
            </tr>
            <tr>
                {EVALUATION_RATINGS.map((rating) => (
                    <th key={rating.code} scope="col" className={cn(detailHeadCellClassName, 'last:border-r-0')}>
                        {rating.code}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {groups.map((group) =>
                group.items.map((item, itemIndex) => (
                    // 표는 쪽 경계에서 나뉘어도 되지만 줄 하나가 반으로 갈라지지는 않게 한다.
                    // 머리 줄(thead)은 브라우저가 다음 쪽에도 다시 그려 준다.
                    <tr key={item.label} className="break-inside-avoid">
                        {itemIndex === 0 ? (
                            <th
                                scope="rowgroup"
                                rowSpan={group.items.length}
                                className={cn(detailHeadCellClassName, 'border-l-0 text-center align-middle')}
                            >
                                {group.label}
                            </th>
                        ) : null}
                        <th scope="row" className={cn(detailBodyCellClassName, 'text-left')}>
                            {item.label}
                            {/* 받은 판정은 이름 옆에서 한 번만 읽어 준다 — 파란 칸 안에 숨긴 글자를 두면
                                검사 도구가 그 칸 배경과의 대비를 잰다(보이지 않는 글자인데도 경고가 난다). */}
                            <span className="sr-only">
                                {` 판정 ${EVALUATION_RATINGS.find((rating) => rating.code === item.rating)?.label ?? ''}`}
                            </span>
                        </th>
                        {EVALUATION_RATINGS.map((rating) =>
                            item.rating === rating.code ? (
                                <td
                                    key={rating.code}
                                    className={cn(detailBodyCellClassName, 'bg-primary last:border-r-0')}
                                >
                                    {/* 시안의 ● 글리프와 같은 지름 12 다. */}
                                    <span aria-hidden="true" className="bg-surface mx-auto block size-3 rounded-full" />
                                </td>
                            ) : (
                                <td key={rating.code} className={cn(detailBodyCellClassName, 'last:border-r-0')} />
                            ),
                        )}
                    </tr>
                )),
            )}
        </tbody>
    </table>
)

// ── 문서 전체 ────────────────────────────────────────────────────────────────────

// 문서는 최대 세 벌이다 — 자가진단 평가결과 · 기술평가서 · 기술사업평가 세부내역.
// 뒤의 두 벌은 기관 화면에만 있고 기업 화면은 자가진단 평가결과 한 벌로 끝난다(시안).
type EvaluationReportViewProps = {
    /** 기술평가서와 기술사업평가 세부내역을 함께 보일지. 기업 화면에서는 끈다. */
    hasTechnicalReport?: boolean
    report: EvaluationReport
}

const EvaluationReportView = ({hasTechnicalReport = true, report}: EvaluationReportViewProps) => {
    // 레이더는 첫 항목을 맨 위 꼭짓점에 놓고 시계 방향으로 돈다. 시안은 표의 마지막 항목(지속가능성)이
    // 맨 위라, 표 차례를 한 칸 돌려 꼭짓점에 얹는다.
    const radarOrder = [...report.competencies.slice(-1), ...report.competencies.slice(0, -1)]
    const radarData: ComparisonRadarItem[] = radarOrder.map((item) => ({
        id: item.label,
        label: item.label,
        primaryValue: item.score,
    }))

    return (
        // print:pb-0 — 종이에서는 문서 끝 여백이 필요 없다. 그 여백까지 세면 A4 한 장을 넘겨 빈 장이 붙는다.
        <div className="bg-surface w-report print-exact mx-auto flex shrink-0 flex-col gap-12 pb-9 print:block print:space-y-12 print:pb-0">
            <ReportDocument label={report.label} title="자가진단 평가결과" action={<PrintButton />}>
                <section className="flex break-inside-avoid flex-col print:block">
                    <div className="flex items-baseline justify-between gap-4">
                        <h3 id="tech-business-grade" className="typo-title-l-bold text-foreground">
                            기술사업평가등급
                        </h3>
                        {/* 등급은 옆 제목의 값이다 — 목록(dl)으로 두어야 큰 글자가 또 하나의 제목으로
                            읽히지 않는다. 이름은 제목이 이미 보이므로 목록에서는 감춘다. */}
                        <dl>
                            <dt className="sr-only" aria-labelledby="tech-business-grade" />
                            <dd className="flex items-baseline gap-1">
                                <span className="typo-h4-bold text-navy-600">{report.grade.value}</span>
                                {/* 보증가능등급은 일정 등급(CCC) 이하에서는 내보내지 않는다. */}
                                {isGuaranteeGradeVisible(report.grade.gradeStepIndex) ? (
                                    <span className="typo-micro-bold text-navy-600">보증가능등급</span>
                                ) : null}
                            </dd>
                        </dl>
                    </div>
                    {/* 눈금 세 줄은 8 씩 띄우고, 수준 범례는 위험등급 줄 바로 아래(4)에 붙인다. */}
                    <div className="flex flex-col gap-1 pt-4">
                        <div className="flex flex-col gap-2">
                            <GradeScaleRow
                                label="기술사업평가등급"
                                steps={TECH_BUSINESS_GRADE_STEPS}
                                activeIndex={report.grade.gradeStepIndex}
                            />
                            <GradeScaleRow
                                label="기술사업성장등급"
                                steps={TECH_BUSINESS_GROWTH_STEPS}
                                activeIndex={report.grade.growthStepIndex}
                            />
                            <GradeScaleRow
                                label="기술사업위험등급"
                                steps={TECH_BUSINESS_RISK_STEPS}
                                activeIndex={report.grade.riskStepIndex}
                                isMuted
                            />
                        </div>
                        <EvaluationLevelLegend activeIndex={report.grade.riskStepIndex} />
                    </div>
                </section>

                <ReportSection title="평가기업">
                    <LabelValueTable caption="평가기업 정보" rows={report.company} />
                </ReportSection>

                <ReportSection title="평가의견">
                    <LabelValueTable caption="평가의견" rows={report.opinion} />
                </ReportSection>

                <ReportSection title="등급설명">
                    {/* 점은 상자 왼쪽 여백(16) 자리에서 시작하고 글은 그 12 뒤(28)에서 선다 —
                        ::marker 는 자리를 정확히 잡을 수 없어 공통 마커(ListMarker)를 쓴다. */}
                    <ul className="border-subtle-3 flex list-none flex-col gap-2 rounded-sm border px-4 py-3">
                        {report.gradeDescriptions.map((description) => (
                            <li key={description} className="typo-body-l-regular text-label-foreground flex">
                                <ListMarker type="unordered-small" />
                                <span className="min-w-0">{description}</span>
                            </li>
                        ))}
                    </ul>
                </ReportSection>

                <ReportSection title="유의사항">
                    <p className="typo-body-m-regular text-label-foreground border-subtle-3 rounded-sm border px-4 py-3">
                        {report.disclaimer}
                    </p>
                </ReportSection>
            </ReportDocument>

            {hasTechnicalReport ? (
                <>
                    {/* 2쪽 — 기술평가서의 앞부분. 쪽마다 문서 머리가 서고 종이에서 장이 갈린다. */}
                    <ReportDocument label={report.label} title="기술평가서" startsNewPage>
                        <ReportSection title="평가부문별 점수">
                            <ScoreTable caption="평가부문별 점수" scores={report.sectionScores} />
                        </ReportSection>

                        <ReportSection title="기업 대표 5대 역량 환산 점수">
                            {/* 오각형 크기·중심·격자 겹수는 시안 좌표 그대로다 — 반지름 79, 중심 y 114,
                            격자 4겹, 축 이름 12 regular. 반지름을 이보다 키우면 아래 두 축 이름(원천성 ·
                            생산성)이 차트 상자(200) 밖으로 나가 잘린다.
                            꼭짓점에는 흰 속을 둔 점을 찍는다(시안) — 값 자체는 아래 표가 말한다.
                            격자선 색만 recharts 가 그리는 요소라 여기서 덮어쓴다. */}
                            <ComparisonRadarChart
                                animate={false}
                                ariaLabel="기업 대표 5대 역량 환산 점수"
                                data={radarData}
                                primaryLabel="환산 점수"
                                centerY={114}
                                margin={{top: 0, right: 0, bottom: 0, left: 0}}
                                outerRadius={79}
                                ringCount={4}
                                tickFontSize={12}
                                tickFontWeight={400}
                                dotAppearance="hollow"
                                // 문서용 오각 레이더는 크기가 따로 정해져 있어 스켈레톤도 같은 모양으로 고른다.
                                skeletonType="pentagon-radar"
                                showLegend={false}
                                showTooltip={false}
                                // 바깥 높이(h-50)도 같은 값으로 못박는다 — 화면이 붙기 전에는 같은 자리에
                                // 스켈레톤이 서는데, 안쪽 차트에만 높이를 주면 스켈레톤은 제 기본 높이로 서다가
                                // 차트가 들어오는 순간 200 으로 줄어 화면이 덜컹인다. 스켈레톤 기본값이 넓은
                                // 폭에서 한 번 더 커지므로(sm:h-96) 같은 값으로 그 자리도 함께 덮는다.
                                // 높이를 max-h 로 누르지 않고 값으로 정한다 — 차트 상자는 정사각 비율이라 폭(531)
                                // 만큼 높아지려 하는데, 사파리는 쪽을 나눌 때 그 비율 높이를 먼저 잡아 한 쪽에 못 넣고
                                // 다음 쪽으로 통째로 넘긴다(크롬은 눌린 높이를 쓴다). 높이를 정해 두면 두 브라우저가
                                // 같은 자리에 그린다.
                                className="[&_.recharts-polar-grid_line]:stroke-subtle-3 [&_.recharts-polar-grid_path]:stroke-subtle-3 h-50 gap-2 sm:h-50 [&_[data-slot=chart]]:h-50 [&_[data-slot=chart]]:min-h-0 [&_[data-slot=chart]]:max-w-none"
                            />
                            <ScoreTable caption="기업 대표 5대 역량 환산 점수" scores={report.competencies} />
                        </ReportSection>

                        <ReportSection title="신청기술의 기술성숙도(TRL)">
                            <TrlChart currentStep={report.trlStep} />
                        </ReportSection>

                        {/* 두 구획은 좌우로 나란히 선다(시안) — 쪽 높이를 아끼려고 한 줄에 둘을 둔다. */}
                        <div className="grid grid-cols-2 gap-6">
                            <ReportSection title="동사 기술인력 현황">
                                <CountTable caption="동사 기술인력 현황" items={report.engineers} columns={2} />
                            </ReportSection>

                            <ReportSection title="동사 보유 지식재산권">
                                <CountTable
                                    caption="동사 보유 지식재산권"
                                    items={report.intellectualProperties}
                                    columns={3}
                                />
                            </ReportSection>
                        </div>
                    </ReportDocument>

                    {/* 3쪽 — 기술평가서의 뒷부분(비교 자료). 제목은 앞 쪽과 같다. */}
                    <ReportDocument label={report.label} title="기술평가서" startsNewPage>
                        {report.benchmarks.map((benchmark) => (
                            <BenchmarkBlock key={benchmark.id} benchmark={benchmark} />
                        ))}

                        <ReportSection
                            title="동업종 시장규모"
                            aside={
                                <p className="typo-caption-regular text-label-foreground">
                                    업종코드({report.marketSize.industryCode}. 단위:{report.marketSize.unit})
                                </p>
                            }
                        >
                            {/* 글자는 14 다 — 이 쪽에서 가장 큰 표라 시안이 한 단계 키워 두었다.
                                이 표는 시안에서 칸 사이에 세로줄이 있다 — 가로줄만 있는 다른 표와 달리 border-x 를 더하되,
                                표 바깥 좌우에는 선이 없어 양 끝(first/last)만 지운다. */}
                            <table className={tableClassName}>
                                <caption className="sr-only">동업종 시장규모</caption>
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className={cn(
                                                headCellShapeClassName,
                                                'typo-body-l-bold border-x text-center first:border-l-0 last:border-r-0',
                                            )}
                                        >
                                            년도
                                        </th>
                                        {report.marketSize.years.map((year) => (
                                            <th
                                                key={year.year}
                                                scope="col"
                                                className={cn(
                                                    headCellClassName,
                                                    'border-x text-center first:border-l-0 last:border-r-0',
                                                )}
                                            >
                                                {year.year}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th
                                            scope="row"
                                            className={cn(
                                                cellShapeClassName,
                                                'typo-body-l-regular text-label-foreground border-x text-center first:border-l-0 last:border-r-0',
                                            )}
                                        >
                                            {report.marketSize.rowLabel}
                                        </th>
                                        {report.marketSize.years.map((year) => (
                                            <td
                                                key={year.year}
                                                className={cn(
                                                    cellShapeClassName,
                                                    'typo-body-l-regular text-label-foreground border-x text-center first:border-l-0 last:border-r-0',
                                                )}
                                            >
                                                {numberFormatter.format(year.value)}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </ReportSection>
                    </ReportDocument>

                    {/* 4쪽 — 기술사업평가 세부내역. */}
                    <ReportDocument label={report.label} title="기술사업평가 세부내역" startsNewPage>
                        <ScoreBanner
                            label={report.totalScore.label}
                            score={report.totalScore.score}
                            fractionDigits={2}
                            unit="점"
                        />

                        {/* 줄만 이어지는 표라 쪽이 나뉘어도 읽는 데 지장이 없다 — 통째로 묶으면 앞 쪽이 비어 버린다. */}
                        <ReportSection title="기술사업 평점" canSplit>
                            <DetailTable groups={report.detailGroups} />
                        </ReportSection>
                    </ReportDocument>
                </>
            ) : null}
        </div>
    )
}

// 새 창으로 여는 리포트 화면의 겉 — 모형별 화면(page)이 이 틀에 자기 리포트만 끼워 넣는다.
// 헤더·푸터 없는 (report) 레이아웃에 놓이므로 반복 영역이 없어 본문 바로가기는 두지 않는다.
const EvaluationReportScreen = ({
    title,
    report,
    hasTechnicalReport = true,
}: {
    title: string
    report: EvaluationReport
} & Pick<EvaluationReportViewProps, 'hasTechnicalReport'>) => (
    // 시안 폭이 정해진 문서라 창이 좁아져도 줄이지 않는다 — 줄이면 표·그래프가 찌그러진다.
    // 대신 가로 스크롤로 넘긴다(w-fit min-w-full: 스크롤한 자리까지 바탕색이 이어지게 한다).
    <main id="main" tabIndex={-1} className="bg-background min-h-dvh w-fit min-w-full">
        <ReportPageStyle />
        {/* 문서마다 제 제목이 있어(자가진단 평가결과 등) 화면 전체의 제목은 따로 둔다 —
            제목 단계를 건너뛰지 않게 하려는 것이고 화면에는 보이지 않는다[6.4.2]. */}
        <h1 className="sr-only">{title}</h1>
        <EvaluationReportView hasTechnicalReport={hasTechnicalReport} report={report} />
    </main>
)

export {EvaluationReportScreen, EvaluationReportView}
export type {EvaluationReportViewProps}
