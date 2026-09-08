import type {ReactNode} from 'react'
import {CircleCheckBig} from 'lucide-react'
import {PrintButton} from '@/components/composite/print-button'
import {ComparisonRadarChart, type ComparisonRadarItem} from '@/components/custom/comparison-radar-chart'
import {
    GroupedColumnChart,
    type GroupedColumnItem,
    type GroupedColumnSeries,
} from '@/components/custom/grouped-column-chart'
import {ProgressBar} from '@/components/custom/progress-bar'
import {
    EVALUATION_LEVEL_STEP_CLASSNAMES,
    EVALUATION_LEVEL_STEPS,
    EVALUATION_RATINGS,
    GUARANTEE_GRADE_RULE_NOTE,
    isGuaranteeGradeVisible,
    TECH_BUSINESS_GRADE_STEPS,
    TECH_BUSINESS_GROWTH_STEPS,
    TECH_BUSINESS_RISK_STEPS,
    TRL_STAGE_GROUPS,
    TRL_STEPS,
    type EvaluationReport,
    type EvaluationReportBenchmark,
    type EvaluationReportCount,
    type EvaluationReportRow,
} from '@/constants/evaluation-report'
import {cn} from '@/lib/utils'

// 평가결과 리포트(자가진단 결과) — 새 창으로 여는 인쇄용 문서. Figma "[KTRS-FM · 개별평가 · 심층분석]".
//
// 세 개의 문서(자가진단 평가결과 · 기술평가서 · 기술사업평가 세부내역)가 한 장으로 이어져 있고, 폭은
// 시안 그대로 595(max-w-report)다. 일반 화면보다 글자·컨트롤이 한 단계 작아 이 문서에서만 쓰는
// 가장 작은 글자는 11(micro)이다 — 시안의 눈금 9~10 보다 키워 문서 전체를 한 크기로 맞췄다.
//
// 데이터는 받아서 그리기만 한다 — 목업과 조회 API 의 교체 지점은 content/service/evaluation-report.ts 다.
// 차트는 프로젝트 공통 차트 컴포넌트(ComparisonRadarChart·GroupedColumnChart·ProgressBar)를 그대로 쓰고,
// 문서 크기에 맞춰 축·범례를 끄고 높이만 줄인다. 기술성숙도 곡선만 좌표가 정해진 그림이라 직접 그린다.

const numberFormatter = new Intl.NumberFormat('ko-KR')

// 표 칸 — 이름 칸은 옅은 파란 면, 값 칸은 흰 면이다(시안). 위쪽 굵은 선은 표가 갖는다.
// 표 위의 진한 가로줄. 칸 테두리와 굵기가 같아 border 로 그리면 규칙상 칸의 세로 테두리가 이겨
// 교차점마다 회색 점이 찍힌다(테두리 우선순위: 칸 > 줄 > 열 > 표). 시안도 표와 별개인 선 하나라,
// 같은 방식으로 표 위에 얹어 가로줄이 끊기지 않게 한다.
const tableClassName =
    'relative w-full table-fixed border-collapse before:bg-foreground-subtle before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[""]'
const headCellClassName = 'bg-primary-subtle typo-caption-bold text-foreground border-subtle-3 border-b px-4 py-2'
const bodyCellClassName = 'typo-caption-regular text-label-foreground border-subtle-3 border-b px-4 py-2'
// 항목이 많은 표(TRL·동사수준·세부내역)는 한 단계 더 작은 글자에 칸도 좁다.
// 글자(typo)와 나머지를 갈라 두는 이유는 TRL 표의 현재 단계 칸처럼 글자만 바꿔 끼울 때가 있어서다 —
// typo-* 는 twMerge 가 모르는 우리 유틸리티라 두 개를 겹쳐 쓰면 나중에 정의된 쪽이 이긴다[PB-08].
const denseCellClassName = 'border-subtle-3 border-x border-b px-1 py-2 text-center'
const denseHeadCellClassName = `bg-primary-subtle typo-micro-bold text-foreground ${denseCellClassName}`
const denseBodyCellClassName = `typo-micro-regular text-label-foreground ${denseCellClassName}`

// ── 문서 머리 ────────────────────────────────────────────────────────────────────

// 머리 위의 장식 띠 — 시안 "Group 2085663940"(595×4). 사선 틈으로 나뉜 조각 셋이고 왼쪽에서
// 오른쪽으로 갈수록 색이 밝아진다(남색 → 청색 → 파랑). 조각이 끝나는 자리도 시안 좌표 그대로다 —
// 남색 ~32 · 틈 4 · 청색 36~176 · 틈 4 · 파랑 180~595.
// 틈으로는 머리 상자의 면 색이 그대로 비친다. 띠는 문서 폭을 꽉 채우므로 양 끝을 둥글리지 않는다.
// 뜻을 담지 않는 그림이라 읽어 주지 않는다[5.1.1].
const ReportHeaderStripe = () => (
    <div aria-hidden="true" className="bg-primary-subtle flex h-1 gap-1 overflow-hidden">
        {/* 바깥쪽 조각의 -ml-1·-mr-1 — 기울인 만큼 위아래가 어긋나 생기는 양 끝 빈틈을 덮는다. */}
        <span className="bg-navy-600 -ml-1 w-9 shrink-0 -skew-x-55" />
        <span className="w-35 shrink-0 -skew-x-55 bg-blue-700" />
        <span className="bg-primary -mr-1 flex-1 -skew-x-55" />
    </div>
)

const ReportDocument = ({
    label,
    title,
    action,
    note,
    children,
}: {
    label: string
    title: string
    action?: ReactNode
    /** 문서 머리 아래 오른쪽에 붙는 시안 안내 문구. 없으면 그 자리를 비워 둔다. */
    note?: ReactNode
    children: ReactNode
}) => (
    <section className="flex flex-col print:block">
        {/* 문서 머리는 뒤따르는 내용과 떨어뜨리지 않는다 — 머리만 쪽 아래에 남으면 읽을 수 없다. */}
        <header className="bg-primary-subtle break-after-avoid">
            <ReportHeaderStripe />
            <div className="flex items-center justify-between gap-4 px-8 pt-3 pb-4">
                <div className="flex flex-col">
                    <p className="typo-micro-medium text-label-foreground">{label}</p>
                    <h2 className="typo-title-l-bold text-foreground">{title}</h2>
                </div>
                {action}
            </div>
        </header>
        {note}
        <div className={cn('flex flex-col gap-8 px-8 print:block print:space-y-8', note ? 'pt-0' : 'pt-6')}>
            {children}
        </div>
    </section>
)

// 인쇄할 때 구획이 쪽 경계에 걸치면 그래프가 반씩 잘려 다음 장에서 다시 그려진다(recharts 는 화면에서
// 잰 크기로 그려 두 번째 조각이 찌그러진다). 그래서 구획 하나는 한 쪽 안에 통째로 들어가게 둔다 —
// 한 쪽보다 큰 구획은 브라우저가 이 지시를 무시하고 원래대로 나눈다.
//
// canSplit 은 그 예외다. 줄만 이어지는 긴 표는 나뉘어도 읽는 데 지장이 없고, 오히려 통째로 묶으면
// 앞 쪽에 큰 빈 자리가 남는다. 표는 나뉘되 줄 하나가 반으로 갈라지지는 않게 한다(아래 DetailTable).
const ReportSection = ({
    title,
    aside,
    canSplit = false,
    children,
}: {
    title: string
    aside?: ReactNode
    /** 쪽 경계에서 나뉘어도 되는 구획인지. 그래프가 든 구획은 나뉘면 찌그러지므로 기본은 나누지 않는다. */
    canSplit?: boolean
    children: ReactNode
}) => (
    <section className={cn('flex flex-col gap-2 print:block print:space-y-2', !canSplit && 'break-inside-avoid')}>
        {/* 제목만 쪽 아래에 남으면 무엇에 대한 표인지 알 수 없다 — 뒤따르는 내용과 떨어뜨리지 않는다. */}
        <div className="flex break-after-avoid items-baseline justify-between gap-4">
            <h3 className="typo-body-l-bold text-foreground">{title}</h3>
            {aside}
        </div>
        {children}
    </section>
)

// ── 등급 ────────────────────────────────────────────────────────────────────────

// 등급 눈금 한 줄 — 일곱 칸 중 받은 등급의 칸만 채워진다.
//
// 채우는 색은 자리마다 다르다 — 아래 수준 범례(매우높음~매우낮음)와 같은 색을 그 자리에서 가져오므로,
// 왼쪽 칸이 걸리면 진하고 오른쪽 칸이 걸리면 옅다(시안). 그래서 색 자체가 몇 번째 자리인지를 말해 준다.
// 색만으로는 어느 칸인지 전해지지 않으므로 그 칸에 읽어 줄 말을 함께 둔다[5.3.1].
// 등급 칸의 글자는 글줄 높이를 칸 높이(24)에 맞춘 상자에 담는다.
// typo-* 의 글줄(16.5)을 24 칸 가운데 놓으면 위아래로 3.75 씩 남는데, 이 소수점 여백을 인쇄
// 레이아웃이 정수로 깎으면서 글자가 위로 붙는다 — 화면은 멀쩡한데 인쇄 미리보기만 어긋나던 이유다.
// 글줄을 칸 높이와 같게 하면 남는 여백이 0 이라 화면과 인쇄가 같은 자리에 글자를 놓는다.
// 글자 크기·굵기는 그대로 칸의 typo-* 를 따르고, 이 상자는 글줄 높이만 바꾼다(같은 요소에
// typo-* 와 leading-* 을 겹쳐 쓰지 않는다[PB-08] — 겹쳐 쓰면 typo-* 가 이겨 먹히지도 않는다).
const gradeStepLabelClassName = 'leading-6'

const GradeScaleRow = ({label, steps, activeIndex}: {label: string; steps: readonly string[]; activeIndex: number}) => (
    <div className="flex items-center justify-between gap-4">
        <p className="typo-caption-bold text-foreground">{label}</p>
        <ul className="flex w-111 gap-1">
            {steps.map((step, index) => (
                <li key={step} className="flex-1">
                    <p
                        // 테두리는 두 상태 모두 두고 색만 바꾼다 — 해당 등급 칸만 테두리를 빼면 글자가 놓이는
                        // 안쪽 높이가 1px 달라져, 가운데 정렬을 그대로 따르지 않는 인쇄·PDF 에서 그 칸 글자만
                        // 위로 뜬다(사파리 PDF). 투명 테두리는 배경이 그 자리까지 칠해져 보이는 모습은 같다.
                        className={cn(
                            'rounded-2xs flex h-6 items-center justify-center border px-0.5 text-center',
                            index === activeIndex
                                ? cn('typo-micro-bold border-transparent', EVALUATION_LEVEL_STEP_CLASSNAMES[index])
                                : 'bg-surface border-subtle-3 text-foreground typo-micro-medium',
                        )}
                    >
                        <span className={gradeStepLabelClassName}>{step}</span>
                        {index === activeIndex ? <span className="sr-only"> (해당 등급)</span> : null}
                    </p>
                </li>
            ))}
        </ul>
    </div>
)

// 눈금 칸의 자리가 뜻하는 수준 — 왼쪽이 높고 오른쪽이 낮다.
const EvaluationLevelLegend = () => (
    <div className="flex justify-end">
        <ul className="flex w-111 gap-1">
            {EVALUATION_LEVEL_STEPS.map((level, index) => (
                <li key={level} className="flex-1">
                    <p
                        className={cn(
                            'typo-micro-bold rounded-2xs flex h-6 items-center justify-center px-1 text-center',
                            EVALUATION_LEVEL_STEP_CLASSNAMES[index],
                        )}
                    >
                        <span className={gradeStepLabelClassName}>{level}</span>
                    </p>
                </li>
            ))}
        </ul>
    </div>
)

// ── 표 ──────────────────────────────────────────────────────────────────────────

const LabelValueTable = ({caption, rows}: {caption: string; rows: readonly EvaluationReportRow[]}) => (
    <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        {/* 이름 칸의 폭은 col 이 정한다 — 감춘 caption(position:absolute)이 있으면 칸에 직접 준 폭이
            table-fixed 계산에서 무시된다. col 은 실제 열 수만큼 둔다 — 모자라면 마크업 오류다[8.1.1]. */}
        <colgroup>
            <col className="w-30" />
            <col />
        </colgroup>
        <tbody>
            {rows.map((row) => (
                <tr key={row.label}>
                    <th
                        scope="row"
                        className={cn(headCellClassName, 'border-subtle-3 border-r text-center align-middle')}
                    >
                        {row.label}
                    </th>
                    <td className={cn(bodyCellClassName, 'align-middle')}>{row.value}</td>
                </tr>
            ))}
        </tbody>
    </table>
)

// ── 점수 ────────────────────────────────────────────────────────────────────────

const ScoreBar = ({
    label,
    score,
    fractionDigits = 1,
    unit = '점 / 100점',
}: {
    label: string
    score: number
    fractionDigits?: number
    unit?: string
}) => (
    <div className="flex flex-col gap-2">
        <p className="typo-caption-regular text-label-foreground">{label}</p>
        <div className="flex flex-col gap-1">
            <ProgressBar label={`${label} 점수`} value={score} showValue={false} trackClassName="bg-accent-subtle" />
            {/* 값 줄에도 글자 크기를 정한다 — 없으면 화면 기본(16/24)이 줄 상자를 잡아 시안(18)보다 높아진다. */}
            <p className="typo-caption-regular text-right">
                <span className="typo-caption-bold text-foreground">{score.toFixed(fractionDigits)}</span>
                <span className="typo-micro-regular text-label-foreground">{unit}</span>
            </p>
        </div>
    </div>
)

// 개수 목록(동사 기술인력 현황·동사 보유 지식재산권) — 이름과 개수가 두 칸씩 짝을 이룬다.
// 두 칸 사이는 40, 칸 하나는 245.5 다(시안 li 245.5 · 사이 40).
const CountList = ({items}: {items: readonly EvaluationReportCount[]}) => (
    <dl className="grid grid-cols-2 gap-x-10 gap-y-2">
        {items.map((item, index) => (
            <div key={`${item.label}-${index}`} className="flex items-baseline justify-between gap-2">
                <dt className="typo-caption-regular text-label-foreground">{item.label}</dt>
                <dd className="typo-caption-regular">
                    <span className="typo-caption-bold text-foreground">{numberFormatter.format(item.count)}</span>
                    <span className="typo-micro-regular text-label-foreground">{item.unit}</span>
                </dd>
            </div>
        ))}
    </dl>
)

// ── 기술성숙도(TRL) ──────────────────────────────────────────────────────────────

// 기술성숙도 곡선 — 시안 "그래프"(531×140)의 좌표를 그대로 옮겼다. 곡선의 높이는 단계가 오를수록
// 성숙해진다는 것을 보이는 그림이고, 실제 값은 지금 어느 단계인지(trlStep) 하나뿐이다. 그 단계는 점과
// 아래 표가 함께 알린다.
//
// 곡선은 양 끝(0·531)까지 이어지고 점은 아홉 칸의 가운데에 선다 — 차트 라이브러리로는 둘을 함께 만들 수
// 없어(점을 그리는 자리의 양 끝에 놓는다) 여기서는 좌표를 그대로 그린다. 값이 바뀌는 그래프가 아니라
// 자리가 정해진 그림이라 이 편이 시안과 어긋나지 않는다.
const TRL_CHART_WIDTH = 531
const TRL_CHART_HEIGHT = 140
const TRL_DOT_RADIUS = 4
// 이름표는 점 중심에서 8 아래에 선다(시안 점 중심 y 23 · 이름표 위 31).
const TRL_LABEL_GAP = 8
// 아홉 점(칸 가운데)과 양 끝 꼬리. 시안 Ellipse·Vector 의 좌표다.
const TRL_CURVE_START = {x: 0, y: 140}
const TRL_CURVE_END = {x: TRL_CHART_WIDTH, y: 20}
const TRL_DOT_POINTS = [
    {x: 30, y: 124},
    {x: 89, y: 98},
    {x: 148, y: 78},
    {x: 207, y: 61},
    {x: 266, y: 47},
    {x: 325, y: 36},
    {x: 384, y: 28},
    {x: 443, y: 23},
    {x: 503, y: 21},
]

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

const TRL_CURVE_POINTS = [TRL_CURVE_START, ...TRL_DOT_POINTS, TRL_CURVE_END]
const TRL_CURVE_PATH = toSmoothPath(TRL_CURVE_POINTS)
const TRL_AREA_PATH = `${TRL_CURVE_PATH} L${TRL_CHART_WIDTH},${TRL_CHART_HEIGHT} L0,${TRL_CHART_HEIGHT} Z`
// 선 아래 면은 파랑에서 흰색으로 옅어진다(시안) — 선에 붙은 위쪽이 가장 진하고 아래로 내려가며 빠르게
// 사라진다. 그라데이션 기준은 면의 상자라, 왼쪽처럼 면이 얇은 곳은 거의 비고 오른쪽만 선 아래가 물든다.
// 시안 벡터의 정확한 정지점은 플러그인이 읽어 주지 못해 렌더를 보고 맞춘 값이다.
// 문서에 이 그래프가 하나뿐이라 id 를 고정값으로 둔다.
const TRL_AREA_GRADIENT_ID = 'trl-area-gradient'

// TRL 표의 아래 두 줄(단계·내용) — 현재 단계 칸만 시안대로 굵은 글씨에 강조색·연한 바탕이다.
const trlCellClassName = (isCurrent: boolean) =>
    cn(
        denseCellClassName,
        isCurrent
            ? 'bg-primary-subtle typo-micro-bold text-primary-strong'
            : 'typo-micro-regular text-label-foreground',
    )

const TrlChart = ({currentStep}: {currentStep: number}) => {
    // 응답이 1~9 밖의 값을 주면 어느 단계도 강조하지 않는다 — 엉뚱한 자리를 짚는 것보다 비워 두는 편이 낫다.
    // 점·이름표·표 강조가 모두 이 값 하나를 보므로, 없으면 셋 다 함께 사라진다.
    const currentIndex = TRL_STEPS.findIndex((step) => step.step === currentStep)
    const activeStep = currentIndex === -1 ? undefined : TRL_STEPS[currentIndex].step
    const currentPoint = currentIndex === -1 ? undefined : TRL_DOT_POINTS[currentIndex]

    return (
        <table className={tableClassName}>
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
                    {/* 곡선은 아래 단계 칸과 세로줄을 맞춰야 해서, 같은 9열 격자 위에 겹쳐 그린다. */}
                    <td colSpan={TRL_STEPS.length} className="border-b-foreground-subtle border-b p-0">
                        <svg
                            viewBox={`0 0 ${TRL_CHART_WIDTH} ${TRL_CHART_HEIGHT}`}
                            className="h-35 w-full"
                            role="img"
                            aria-label={`기술성숙도 단계별 성숙 흐름${activeStep === undefined ? '' : ` — 현재 ${activeStep}단계`}`}
                        >
                            <defs>
                                {/*
                                 * 옅은 색을 투명도(stop-opacity)로 만들지 않는다 — 사파리에서 PDF 로
                                 * 내보내면 이 값이 사라져 면 전체가 진한 파랑으로 찍힌다. 문서 바탕색과
                                 * 미리 섞은 불투명한 색을 쓰면 화면과 인쇄물이 같은 색으로 남는다.
                                 */}
                                <linearGradient id={TRL_AREA_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="0%"
                                        stopColor="color-mix(in srgb, var(--ds-primary) 12%, var(--ds-surface))"
                                    />
                                    <stop
                                        offset="45%"
                                        stopColor="color-mix(in srgb, var(--ds-primary) 3%, var(--ds-surface))"
                                    />
                                    <stop offset="100%" stopColor="var(--ds-surface)" />
                                </linearGradient>
                            </defs>
                            <path d={TRL_AREA_PATH} fill={`url(#${TRL_AREA_GRADIENT_ID})`} />
                            {/*
                             * 단계 경계마다 세로 점선 — 아래 표의 칸 경계와 같은 자리다.
                             * 면을 칠한 다음에 그린다. 시안에서는 면이 비쳐 점선이 그대로 보이는데,
                             * 지금 면은 사파리 인쇄 때문에 불투명한 색이라 먼저 그리면 가려진다.
                             */}
                            {TRL_DOT_POINTS.slice(1).map((point, index) => (
                                <line
                                    key={TRL_STEPS[index].step}
                                    x1={point.x - (point.x - TRL_DOT_POINTS[index].x) / 2}
                                    x2={point.x - (point.x - TRL_DOT_POINTS[index].x) / 2}
                                    y1={0}
                                    y2={TRL_CHART_HEIGHT}
                                    stroke="var(--ds-subtle-3)"
                                    strokeDasharray="4 4"
                                />
                            ))}
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
                                    strokeWidth={2}
                                />
                            ))}
                            {/* 지금 자리 이름표 — 점 아래에 붙는다. 범위 밖 값이면 그리지 않는다. */}
                            {currentPoint ? (
                                <text
                                    x={currentPoint.x}
                                    y={currentPoint.y + TRL_LABEL_GAP}
                                    textAnchor="middle"
                                    dominantBaseline="hanging"
                                    className="typo-micro-bold fill-primary"
                                >
                                    TRL{activeStep}
                                </text>
                            ) : null}
                        </svg>
                    </td>
                </tr>
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
                                'align-middle whitespace-pre-line',
                            )}
                        >
                            {step.label}
                            {step.step === activeStep ? <span className="sr-only"> (현재 단계)</span> : null}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    )
}

// ── 유사업종·유사기술 대비 동사수준 ────────────────────────────────────────────────

// 표 왼쪽 머리의 세로쓰기(시안 '유/사/업/종' · 'M/a/x' · 'M/i/n').
// 폭을 좁혀 줄을 접는 방법은 글자 너비에 기대는 터라 'in' 처럼 좁은 글자가 한 줄에 붙어 버린다 —
// 글줄 방향을 세로로 돌리고(writing-mode) 글자는 눕히지 않아(text-orientation) 너비와 무관하게
// 한 글자씩 쌓는다. 글자 자체에 줄바꿈을 심지 않아 읽어 주는 기계에는 '유사업종' 한 낱말로 남는다.
// Tailwind 에 이 두 속성의 유틸리티가 없어 임의 속성으로 적는다[SC-01 예외]. 세로 글줄은 칸 높이만큼만
// 이어지고 넘치면 옆으로 새 줄이 서므로(유/사 · 업/종) 줄을 접지 않게 nowrap 을 함께 둔다.
// 가로 가운데 정렬은 칸의 text-align 에 맡긴다 — 글줄이 세로면 좌우가 글의 흐름 축이 아니라서
// mx-auto(좌우 auto 여백)가 가운데로 밀어 주지 못한다. inline 상자로 두면 칸의 text-align 이 먹는다.
const verticalLabelClassName =
    'inline-block align-middle [text-orientation:upright] [writing-mode:vertical-rl] whitespace-nowrap'

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
            aside={
                <ul className="typo-caption-regular text-label-foreground flex gap-3">
                    {BENCHMARK_SERIES.map((series) => (
                        <li key={series.key} className="flex items-center gap-1">
                            <span aria-hidden="true" className="size-2" style={{backgroundColor: series.color}} />
                            {series.label}
                        </li>
                    ))}
                </ul>
            }
        >
            <table className={tableClassName}>
                <caption className="sr-only">{benchmark.title}</caption>
                {/* 앞 두 칸(비교집단·구분)만 폭을 정하고 나머지는 고르게 나눈다. col 은 실제 열 수만큼 둔다. */}
                <colgroup>
                    <col className="w-8" />
                    <col className="w-8" />
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
                        <td colSpan={2} className="border-subtle-3 border-x border-b p-1">
                            <p className="typo-micro-regular text-label-foreground flex h-35 flex-col justify-between text-right">
                                <span>Max</span>
                                <span>Min</span>
                            </p>
                        </td>
                        {/* 막대는 항목 칸과 세로줄을 맞춰야 해서 일곱 칸을 통째로 쓴다. */}
                        <td colSpan={benchmark.columns.length} className="border-subtle-3 border-x border-b p-0 pb-1">
                            <GroupedColumnChart
                                animate={false}
                                ariaLabel={`${benchmark.title} 막대그래프`}
                                data={chartData}
                                series={BENCHMARK_SERIES}
                                showAxes={false}
                                showLegend={false}
                                showTooltip={false}
                                showTrack
                                barGap={12}
                                barRadius={0}
                                maxBarSize={12}
                                className="gap-0 [&_[data-slot=chart]]:h-35 [&_[data-slot=chart]]:min-w-0 [&>div]:overflow-visible"
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" colSpan={2} className={cn(denseHeadCellClassName, 'align-middle')}>
                            {/* 시안은 두 줄로 끊는다. */}
                            <span className="whitespace-pre-line">{'신청\n기업'}</span>
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
                                    className={cn(denseHeadCellClassName, 'align-middle')}
                                >
                                    <span className={verticalLabelClassName}>{benchmark.comparisonLabel}</span>
                                </th>
                            ) : null}
                            <th scope="row" className={cn(denseHeadCellClassName, 'align-middle')}>
                                <span className={verticalLabelClassName}>{row.label}</span>
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

const DetailTable = ({groups}: {groups: EvaluationReport['detailGroups']}) => (
    <table className={tableClassName}>
        <caption className="sr-only">기술사업 평점 세부내역</caption>
        <colgroup>
            <col className="w-30" />
            <col />
            {EVALUATION_RATINGS.map((rating) => (
                <col key={rating.code} className="w-10" />
            ))}
        </colgroup>
        <thead>
            <tr>
                <th scope="col" rowSpan={2} className={cn(denseHeadCellClassName, 'align-middle')}>
                    대항목
                </th>
                <th scope="col" rowSpan={2} className={cn(denseHeadCellClassName, 'align-middle')}>
                    소항목(평가항목)
                </th>
                {EVALUATION_RATINGS.map((rating) => (
                    <th key={rating.code} scope="col" className={denseHeadCellClassName}>
                        {rating.label}
                    </th>
                ))}
            </tr>
            <tr>
                {EVALUATION_RATINGS.map((rating) => (
                    <th key={rating.code} scope="col" className={denseHeadCellClassName}>
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
                                className={cn(denseHeadCellClassName, 'align-middle')}
                            >
                                {group.label}
                            </th>
                        ) : null}
                        <th scope="row" className={cn(denseBodyCellClassName, 'typo-micro-regular px-2 text-left')}>
                            {item.label}
                        </th>
                        {EVALUATION_RATINGS.map((rating) => (
                            <td key={rating.code} className={denseBodyCellClassName}>
                                {item.rating === rating.code ? (
                                    <>
                                        <CircleCheckBig aria-hidden="true" className="text-foreground mx-auto size-3" />
                                        <span className="sr-only">{rating.label}</span>
                                    </>
                                ) : null}
                            </td>
                        ))}
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
        <div className="bg-surface w-report print-exact mx-auto flex shrink-0 flex-col gap-12 pb-8 print:block print:space-y-12">
            <ReportDocument
                label={report.label}
                title="자가진단 평가결과"
                action={<PrintButton />}
                note={
                    // 시안이 빨간 글씨로 적어 둔 규칙 안내다(화면 문구가 아니라 읽는 사람에게 주는 말이라
                    // 종이에는 남기지 않는다). 규칙 자체는 아래 isGuaranteeGradeVisible 이 지킨다.
                    <p className="typo-micro-medium text-error-500 px-8 pt-2 text-right print:hidden">
                        {GUARANTEE_GRADE_RULE_NOTE}
                    </p>
                }
            >
                <section className="flex break-inside-avoid flex-col gap-2 print:block print:space-y-2">
                    <div className="flex items-baseline justify-between gap-4">
                        <h3 className="typo-body-xl-bold text-foreground">기술사업평가등급</h3>
                        <p className="flex items-baseline gap-1">
                            <span className="typo-h4-bold text-navy-600">{report.grade.value}</span>
                            {/* 보증가능등급은 일정 등급(CCC) 이하에서는 내보내지 않는다(시안). */}
                            {isGuaranteeGradeVisible(report.grade.gradeStepIndex) ? (
                                <span className="typo-micro-bold text-navy-600">보증가능등급</span>
                            ) : null}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 pt-4">
                        <div className="flex flex-col gap-4">
                            <GradeScaleRow
                                label="평가등급"
                                steps={TECH_BUSINESS_GRADE_STEPS}
                                activeIndex={report.grade.gradeStepIndex}
                            />
                            <GradeScaleRow
                                label="성장등급"
                                steps={TECH_BUSINESS_GROWTH_STEPS}
                                activeIndex={report.grade.growthStepIndex}
                            />
                            <GradeScaleRow
                                label="위험등급"
                                steps={TECH_BUSINESS_RISK_STEPS}
                                activeIndex={report.grade.riskStepIndex}
                            />
                        </div>
                        <EvaluationLevelLegend />
                    </div>
                </section>

                <ReportSection title="평가기업">
                    <LabelValueTable caption="평가기업 정보" rows={report.company} />
                </ReportSection>

                <ReportSection title="평가의견">
                    <LabelValueTable caption="평가의견" rows={report.opinion} />
                </ReportSection>

                <ReportSection title="등급설명">
                    <ul className="flex list-disc flex-col gap-1 pl-4">
                        {report.gradeDescriptions.map((description) => (
                            <li key={description} className="typo-caption-regular text-label-foreground">
                                {description}
                            </li>
                        ))}
                    </ul>
                </ReportSection>

                <div className="bg-surface-subtle border-subtle-3 break-inside-avoid rounded-sm border px-6 py-4">
                    <h3 className="typo-caption-bold text-foreground">유의사항</h3>
                    <p className="typo-micro-regular text-foreground-subtle mt-2">{report.disclaimer}</p>
                </div>
            </ReportDocument>

            {hasTechnicalReport ? (
                <>
                    <ReportDocument label={report.label} title="기술평가서">
                        <ReportSection title="평가부문별 점수">
                            <div className="grid grid-cols-3 gap-8">
                                {report.sectionScores.map((score) => (
                                    <ScoreBar key={score.label} label={score.label} score={score.score} />
                                ))}
                            </div>
                        </ReportSection>

                        <ReportSection title="기업 대표 5대 역량 환산 점수">
                            {/* 오각형 크기·중심·격자 겹수는 시안 좌표 그대로다 — 반지름 94, 중심이 세로 가운데보다
                            조금 아래(중심 y 115), 격자 4겹, 축 이름 11 regular. 꼭짓점의 점은 시안에 없다 —
                            값은 아래 표가 말한다. 격자선 색만 recharts 가 그리는 요소라 여기서 덮어쓴다. */}
                            <ComparisonRadarChart
                                animate={false}
                                ariaLabel="기업 대표 5대 역량 환산 점수"
                                data={radarData}
                                primaryLabel="환산 점수"
                                centerY={115}
                                margin={{top: 0, right: 0, bottom: 0, left: 0}}
                                outerRadius={94}
                                ringCount={4}
                                tickFontSize={11}
                                tickFontWeight={400}
                                showDots={false}
                                showLegend={false}
                                showTooltip={false}
                                // 높이를 max-h 로 누르지 않고 값으로 정한다 — 차트 상자는 정사각 비율이라 폭(531)
                                // 만큼 높아지려 하는데, 사파리는 쪽을 나눌 때 그 비율 높이를 먼저 잡아 한 쪽에 못 넣고
                                // 다음 쪽으로 통째로 넘긴다(크롬은 눌린 높이를 쓴다). 높이를 정해 두면 두 브라우저가
                                // 같은 자리에 그린다.
                                className="[&_.recharts-polar-grid_line]:stroke-subtle-3 [&_.recharts-polar-grid_path]:stroke-subtle-3 gap-2 [&_[data-slot=chart]]:h-53 [&_[data-slot=chart]]:min-h-0 [&_[data-slot=chart]]:max-w-none"
                            />
                            <dl className="border-subtle-3 flex flex-col gap-2 border px-6 py-4">
                                {report.competencies.map((item) => (
                                    <div key={item.label} className="flex items-baseline justify-between gap-4">
                                        <dt className="typo-caption-regular text-label-foreground">{item.label}</dt>
                                        <dd className="typo-caption-regular">
                                            <span className="typo-caption-medium text-foreground">
                                                {item.score.toFixed(1)}
                                            </span>
                                            <span className="typo-micro-regular text-label-foreground">점 / 100점</span>
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </ReportSection>

                        <ReportSection title="신청기술의 기술성숙도(TRL)">
                            <TrlChart currentStep={report.trlStep} />
                        </ReportSection>

                        <ReportSection title="동사 기술인력 현황">
                            <CountList items={report.engineers} />
                        </ReportSection>

                        <ReportSection title="동사 보유 지식재산권">
                            <CountList items={report.intellectualProperties} />
                        </ReportSection>

                        {report.benchmarks.map((benchmark) => (
                            <BenchmarkBlock key={benchmark.id} benchmark={benchmark} />
                        ))}

                        <ReportSection
                            title="동업종 시장규모"
                            aside={
                                <p className="typo-caption-regular text-label-foreground">
                                    (단위: {report.marketSize.unit})
                                </p>
                            }
                        >
                            {/* 이 표는 시안에서 칸마다 세로줄이 있다 — 가로줄만 있는 다른 표와 달리 border-x 를 더한다. */}
                            <table className={tableClassName}>
                                <caption className="sr-only">동업종 시장규모</caption>
                                <thead>
                                    <tr>
                                        <th scope="col" className={cn(headCellClassName, 'border-x text-center')}>
                                            년도
                                        </th>
                                        {report.marketSize.years.map((year) => (
                                            <th
                                                key={year.year}
                                                scope="col"
                                                className={cn(headCellClassName, 'border-x text-center')}
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
                                                bodyCellClassName,
                                                'typo-caption-regular border-x text-center',
                                            )}
                                        >
                                            {report.marketSize.rowLabel}
                                        </th>
                                        {report.marketSize.years.map((year) => (
                                            <td
                                                key={year.year}
                                                className={cn(bodyCellClassName, 'border-x text-center')}
                                            >
                                                {numberFormatter.format(year.value)}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </ReportSection>
                    </ReportDocument>

                    <ReportDocument label={report.label} title="기술사업평가 세부내역">
                        <ReportSection title="기술사업 평점">
                            <ScoreBar
                                label={report.totalScore.label}
                                score={report.totalScore.score}
                                fractionDigits={2}
                                unit="점"
                            />
                        </ReportSection>

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
        {/* 문서마다 제 제목이 있어(자가진단 평가결과 등) 화면 전체의 제목은 따로 둔다 —
            제목 단계를 건너뛰지 않게 하려는 것이고 화면에는 보이지 않는다[6.4.2]. */}
        <h1 className="sr-only">{title}</h1>
        <EvaluationReportView hasTechnicalReport={hasTechnicalReport} report={report} />
    </main>
)

export {EvaluationReportScreen, EvaluationReportView}
export type {EvaluationReportViewProps}
