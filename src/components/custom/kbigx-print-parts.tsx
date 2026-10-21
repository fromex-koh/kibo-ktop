import type {ReactNode} from 'react'
import {KbxFitValue} from '@/components/custom/kbigx-print-fit-value'
import {KbigxPrintPageBody} from '@/components/custom/kbigx-print-page-body'
import {
    formatKbigxPageNumber,
    getKbigxPrintSectionLabel,
    getKbigxPrintSectionSubtitle,
    KBIGX_PRINT_BRAND,
    KBIGX_PRINT_REPORT_NAME,
    type KbigxPrintPage,
} from '@/content/service/k-bigx-print-report'
import {cn} from '@/lib/utils'
import {PRIVATE_CARD_LABEL, PRIVATE_SHORT_LABEL} from '@/components/composite/private-content'
import {isKbxNumber, KBX_EMPTY_VALUE, kbxFixed1Format} from '@/components/custom/kbigx-print-format'
import {estimateTextEm} from '@/content/service/k-bigx-print-measure'

// K-BIGx 보고서 인쇄본 — 쪽 공통 부품. 모든 쪽이 이 부품을 조합해 그린다.
// 치수 · 색은 kbx 토큰(tokens.json kbigxPrint)이라 .kbigx-print 안에서만 값이 있다.
//
// 쪽 짜임(1360 × 1924 용지, 좌우 여백 96)
//   장 첫 쪽: 장 제목 박스(위 96) → 본문
//   이어지는 쪽: 머리말(위 36 · 장 이름 + 기업명) → 본문
//   바닥글(아래 36): K-BIGx · 기업혁신성장 보고서 · 쪽 번호
// 본문 안: 중제목 블록(KbxBlock) 사이 80 · 중제목 → 내용 24 · 내용끼리 32 · 소제목 → 내용 16.

// ── 쪽 틀 ──

// 장 제목 박스 — 장의 첫 쪽 맨 위. 쪽마다 제목(h2)이 된다[6.4.2].
// subtitle 은 장 이름 옆 작은 글자(34px — 예: Tech-Index (혁신성장 역량지수)).
const KbxChapterTitle = ({children, subtitle}: {children: ReactNode; subtitle?: ReactNode}) => (
    <h2 className="bg-kbx-surface border-kbx-border kbx-border-hairline rounded-kbx-16 gap-kbx-26 flex items-center px-9 py-6">
        <span aria-hidden="true" className="bg-kbx-primary w-kbx-9 rounded-kbx-5 shrink-0 self-stretch" />
        <span className="kbx-text-50 leading-kbx-120 tracking-kbx-tight text-kbx-primary font-kbx-extrabold">
            {children}
            {subtitle ? <span className="kbx-text-34 font-kbx-bold"> {subtitle}</span> : null}
        </span>
    </h2>
)

// ── 길이가 바뀌는 이름 맞추기(기업명 · 대표자 등) ──
type KbxFitStep = {
    /** 글자 크기 클래스(예: kbx-text-35). */
    className: string
    /** 그 클래스의 글자 크기(px) — 폭 어림에 쓴다. */
    size: number
}

// 칸 폭(px)에 맞는 글자 크기 고르기 — 큰 단계부터 한 줄에 들어가는 가장 큰 크기를 쓴다.
// 가장 작은 크기로도 넘치면 그 크기로 줄을 접는다(말줄임 없음 — 내용은 잘리지 않는다).
// 돌려주는 className(글자 크기 + 한 줄 고정 또는 줄 접기)을 글자 요소에 그대로 붙인다.
const fitKbxText = (text: string, widthPx: number, steps: readonly KbxFitStep[]) => {
    const em = estimateTextEm(text)
    const fit = steps.find((step) => em * step.size <= widthPx)
    if (fit) return cn(fit.className, 'whitespace-nowrap')
    const smallest = steps[steps.length - 1]
    // 줄 접기는 글자 단위로 — 이름은 띄어쓰기가 없거나 적어(예: (주)프롬엑스테크놀로지…) 낱말 단위로 접으면 '(주)' 뒤에서
    // 한 번에 끊겨 첫 줄이 비어 보인다. 한 줄을 채운 뒤 자연스럽게 다음 줄로 넘긴다.
    return cn(smallest.className, 'break-normal wrap-anywhere')
}

// 회사 이름 앞 '(주)' 같은 법인 표기 뒤에서 줄이 바뀌지 않게 붙인다 — 띄어 썼으면 줄 안 바뀌는 빈칸(U+00A0)으로,
// 붙여 썼으면 낱말 잇기 문자(U+2060, 폭 없음)를 넣는다. 보이는 글자는 그대로다. 기업명을 그릴 때 감싸서 쓴다.
const CORPORATE_PREFIX = /^(\([^)]{1,2}\))(\s*)/
const NO_BREAK_SPACE = '\u00a0'
const WORD_JOINER = '\u2060'
const keepCorporatePrefix = (name: string) =>
    name.replace(
        CORPORATE_PREFIX,
        (_, prefix: string, space: string) => prefix + (space ? NO_BREAK_SPACE : WORD_JOINER),
    )

// 표 칸 이름(성명 · 기업명 · 주주명 등) — 칸 폭에 맞춰 20 → 18 → 16 으로 줄이고, 그래도 길면 잘리지 않게 줄을 접는다.
// widthPx 는 칸 폭에서 좌우 여백을 뺀 글자 폭(용지 px).
const KBX_CELL_NAME_STEPS = [
    {className: 'kbx-text-20', size: 20},
    {className: 'kbx-text-18', size: 18},
    {className: 'kbx-text-16', size: 16},
] as const
const KbxFitName = ({text, widthPx}: {text: string; widthPx: number}) => (
    <span className={fitKbxText(text, widthPx, KBX_CELL_NAME_STEPS)}>{text}</span>
)

// 머리말 기업명 칸 — 본문 폭 1168 의 절반.
const HEADER_NAME_WIDTH = 584
const HEADER_NAME_STEPS = [
    {className: 'kbx-text-21', size: 21},
    {className: 'kbx-text-19', size: 19},
    {className: 'kbx-text-17', size: 17},
] as const

// 머리말 — 장의 둘째 쪽부터. 장 이름은 쪽마다 반복되는 표식이라 제목이 아닌 문단이다.
const KbxPageHeader = ({label, companyName}: {label: ReactNode; companyName: string}) => (
    <div className="border-kbx-border h-kbx-61 pb-kbx-18 kbx-border-b-regular flex items-center justify-between">
        <div className="gap-kbx-18 flex items-center">
            <span aria-hidden="true" className="bg-kbx-primary h-kbx-34 w-2" />
            <span className="kbx-text-30 tracking-kbx-tight text-kbx-primary font-kbx-extrabold">{label}</span>
        </div>
        {/* 기업명 — 길면 글자를 줄이고(21 → 17), 그래도 길면 줄을 접는다(잘리지 않음). 장 이름 쪽을 밀지 않도록 폭 절반까지만. */}
        <div
            className={cn(
                'text-kbx-foreground-subtle leading-kbx-130 max-w-1/2 min-w-0 text-right',
                fitKbxText(companyName, HEADER_NAME_WIDTH, HEADER_NAME_STEPS),
            )}
        >
            {companyName}
        </div>
    </div>
)

// 바닥글 — 세 칸을 같은 폭으로 나눠 가운데 글자가 쪽 가운데에 온다.
const KbxPageFooter = ({pageNumber}: {pageNumber: number}) => (
    <div className="border-kbx-border pt-kbx-22 kbx-border-t-regular grid grid-cols-3 items-center gap-8 pb-9">
        <div className="kbx-text-24 tracking-kbx-wide text-kbx-primary font-kbx-extrabold">{KBIGX_PRINT_BRAND}</div>
        <div className="kbx-text-20 text-kbx-foreground-subtle font-kbx-semibold text-center">
            {KBIGX_PRINT_REPORT_NAME}
        </div>
        <div className="kbx-text-26 text-kbx-primary font-kbx-extrabold justify-self-end tabular-nums">
            {formatKbigxPageNumber(pageNumber)}
        </div>
    </div>
)

type KbxPageProps = {
    page: KbigxPrintPage
    companyName: string
    children: ReactNode
}

// 본문이 있는 쪽 — 장 첫 쪽이면 장 제목 박스, 아니면 머리말을 위에 두고 바닥글에 쪽 번호를 찍는다.
// 본문이 한 쪽을 넘으면 잘린다(다음 쪽으로 흐르지 않는다). 넘치면 확인 화면에 넘침 표시가 뜬다(KbigxPrintPageBody).
// 목록 표의 행 수는 k-bigx-print-report.ts 가 한 쪽에 맞춰 정한다.
const KbxPage = ({page, companyName, children}: KbxPageProps) => {
    const sectionLabel = getKbigxPrintSectionLabel(page.section)

    return (
        <div className="text-kbx-foreground leading-kbx-normal flex h-full flex-col px-24">
            {page.isSectionStart ? (
                <div className="pt-24">
                    <KbxChapterTitle subtitle={getKbigxPrintSectionSubtitle(page.section)}>
                        {sectionLabel}
                    </KbxChapterTitle>
                </div>
            ) : (
                <div className="pt-9">
                    <KbxPageHeader label={sectionLabel} companyName={companyName} />
                </div>
            )}
            <KbigxPrintPageBody
                boxClassName={page.isSectionStart ? 'mt-kbx-45' : 'mt-kbx-39'}
                className="flex h-full flex-col gap-20"
            >
                {children}
            </KbigxPrintPageBody>
            {page.pageNumber ? <KbxPageFooter pageNumber={page.pageNumber} /> : null}
        </div>
    )
}

// ── 본문 ──

// 단위 표기 — 중제목 · 소제목 오른쪽 끝(20px — 기준일자 · 안내 글). 범례 목록(ul)이 들어오기도 해 p 가 아니라 div 다[8.1.1].
// '단위: …' 글은 18px — 제목 아래 줄은 KbxUnitBelow · KbxBlock unitPosition="below", 제목 줄 오른쪽에 둘 때는
// 안에 kbx-text-18 글자로 넘긴다.
const KbxUnit = ({children, className}: {children: ReactNode; className?: string}) => (
    <div className={cn('kbx-text-20 text-kbx-foreground-subtle shrink-0', className)}>{children}</div>
)

type KbxBlockProps = {
    title: ReactNode
    /** 제목 오른쪽 단위 표기(예: '단위: 백만원'). */
    unit?: ReactNode
    /** 소제목 줄(KbxSubBlock) 폭 등 — 단위를 아래 표 오른쪽 끝에 맞출 때(차입금 현황 기관별 비중). */
    headerClassName?: string
    children: ReactNode
    /** 바깥 상자 클래스 — 나란히 놓을 때 폭 비율(grow-*) 등. */
    className?: string
    /** 중제목 줄 오른쪽 끝 알약 꼬리표(예: 대표 기술분야). */
    tag?: ReactNode
    /**
     * 단위 자리 — 'title'(기본)은 제목 줄 오른쪽, 'below' 는 제목 아래 줄 오른쪽(관계기업 현황처럼 표가 곧바로 오는 블록).
     * 'below' 는 제목 → 단위 24(제목 → 내용 간격) · 단위 → 내용 8 로, 단위 줄만큼 내용이 내려간다.
     */
    unitPosition?: 'title' | 'below'
}

// 중제목 블록 — 밑줄 + 왼쪽 남색 포인트. 안의 내용끼리는 32 간격이다.
// className="flex-1" 을 주면 쪽의 남은 높이까지 늘어난다 — 안쪽 줄에 my-auto 를 걸어 남는 높이를 나눠 쓸 때 쓴다.
const KbxBlock = ({title, unit, tag, children, className, unitPosition = 'title'}: KbxBlockProps) => (
    <section className={cn('flex flex-col gap-6', className)}>
        <div className="border-kbx-border kbx-border-b-regular relative flex items-baseline justify-between gap-5 pb-4">
            <h3 className="kbx-text-36 tracking-kbx-tight font-kbx-extrabold shrink-0">{title}</h3>
            {unit && unitPosition === 'title' ? <KbxUnit>{unit}</KbxUnit> : null}
            {/* 꼬리표 — 제목 줄 오른쪽 끝, 제목과 세로 가운데. 길면 제목을 밀지 않게 폭 절반까지에서 줄을 접는다. */}
            {tag ? (
                <div className="bg-kbx-surface text-kbx-primary kbx-text-21 font-kbx-bold px-kbx-18 py-kbx-6 max-w-1/2 self-center rounded-full text-center break-keep">
                    {tag}
                </div>
            ) : null}
            <span aria-hidden="true" className="bg-kbx-primary absolute -bottom-0.5 left-0 h-1 w-30" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-8">
            {/* 단위 → 내용 8 — 내용 간격(32)에서 24 를 뺀다. */}
            {unit && unitPosition === 'below' ? (
                <div className="kbx-text-18 text-kbx-foreground-subtle -mb-6 self-end">{unit}</div>
            ) : null}
            {children}
        </div>
    </section>
)

// 소제목 블록 — 남색 네모 + 제목(26px · 굵기 700). 제목 → 내용 16.
const KbxSubBlock = ({title, unit, headerClassName, children, className}: KbxBlockProps) => (
    <div className={cn('flex min-w-0 flex-col gap-4', className)}>
        <div className={cn('flex items-end justify-between gap-4', headerClassName)}>
            <h4 className="kbx-text-26 text-kbx-primary font-kbx-bold flex items-center gap-3">
                <span aria-hidden="true" className="bg-kbx-primary size-kbx-10 shrink-0" />
                {title}
            </h4>
            {unit ? <KbxUnit>{unit}</KbxUnit> : null}
        </div>
        {children}
    </div>
)

// 소제목 아래 단위 — 소제목 → 단위 12 · 단위(18px, 오른쪽 끝) → 내용 8(소제목 아래 간격 16 에서 4 를 당긴다).
// 진단브리핑(최근 3개년 재무 현황 · 활동성 정보) · 기업현황(재무현황 · 거래처현황). className 은 남는 높이를 채울 때(flex-1).
const KbxUnitBelow = ({unit, className, children}: {unit: string; className?: string; children: ReactNode}) => (
    <div className={cn('-mt-1 flex flex-col gap-2', className)}>
        <div className="kbx-text-18 leading-kbx-130 text-kbx-foreground-subtle self-end">{unit}</div>
        {children}
    </div>
)

// 이름 값 — 띄어쓰기가 없거나 적은 고유 이름이라 글자 단위로 접는다('(주)' 뒤에서 먼저 끊기지 않게). 그 밖의 값은 낱말 단위.
const NAME_VALUE_LABELS = new Set(['기업명', '대표자'])

// 이름: 값 목록 — 두 열로 흐른다(기업현황 개요 · 진단브리핑 기업 정보). 값이 비면 '-'.
//   default: 이름 칸 196 · 줄 위아래 12(기업현황 개요) / compact: 이름 칸 164 + 간격 12 · 줄 위아래 14(진단브리핑).
// [주의] 기업현황 개요의 치수 · 글자 크기를 바꾸면 k-bigx-print-report.ts 의 COMPANY_FIRST_PAGE 도 같이 고친다.

const KbxLabelValueGrid = ({
    items,
    density = 'default',
    fitLabels,
}: {
    items: readonly {label: string; value: ReactNode}[]
    density?: 'default' | 'compact'
    /** 이 이름의 값만 글자를 줄여 2줄에 맞추고 줄인 글자로도 넘치면 2줄에서 말줄임한다. 나머지 값은 기본 크기 한 줄 말줄임. */
    fitLabels: ReadonlySet<string>
}) => (
    <dl className="kbx-text-24 grid grid-cols-2 gap-x-14">
        {items.map((item) => (
            <div
                key={item.label}
                className={cn(
                    'border-kbx-border kbx-border-b-regular flex items-baseline',
                    density === 'compact' ? 'py-kbx-14' : 'py-3',
                )}
            >
                <dt
                    className={cn(
                        'text-kbx-foreground-subtle shrink-0 whitespace-nowrap',
                        density === 'compact' ? 'w-41 pr-3' : 'w-49',
                    )}
                >
                    {item.label}
                </dt>
                {/* fitLabels 값: 2줄까지 그대로 → 넘치면 글자를 줄여 2줄에 맞춤 → 그래도 넘치면 2줄 말줄임(KbxFitValue).
                    나머지 값: 한 줄 말줄임. key 는 값이 바뀌면 글자 줄임을 처음부터 다시 하려고 준다. */}
                {!fitLabels.has(item.label) ? (
                    <dd className="font-kbx-bold m-0 min-w-0 flex-1 truncate">{item.value || KBX_EMPTY_VALUE}</dd>
                ) : (
                    <KbxFitValue
                        key={typeof item.value === 'string' ? item.value : undefined}
                        className={cn(
                            'font-kbx-bold m-0 min-w-0 flex-1',
                            NAME_VALUE_LABELS.has(item.label) ? 'break-normal wrap-anywhere' : 'break-keep',
                        )}
                    >
                        {item.value || KBX_EMPTY_VALUE}
                    </KbxFitValue>
                )}
            </div>
        ))}
    </dl>
)

// 숫자 카드 — 옅은 면에 이름 · 큰 숫자 · 단위.
//   lg: 기본(진단브리핑 관련 기업 및 특허현황 · 정부 R&D사업 접수현황) · xl: 큰 카드(특허 및 인증현황)
// 숫자가 길면(예: 9,999,999) 숫자 글자를 단계(values)대로 줄인다 — 숫자 + 단위는 늘 한 줄.
// 줄이는 판단은 value · unit 이 글자(string)일 때만 한다 — 포맷한 문자열로 넘긴다.
//   width 는 카드 안쪽 폭(용지 px), unitSize 는 단위 글자 크기(px) — 폭 어림에 쓴다. 카드 폭을 바꾸면 width 도 고친다.
const STAT_CARD_SIZES = {
    // xl — 높이 80 고정 · 세로 가운데(기업현황 특허 및 인증현황 건수 카드). 제목 22 · 숫자 40 · 단위 24.
    xl: {
        box: 'h-20 justify-center gap-0.5 px-6',
        label: 'kbx-text-22 leading-kbx-110 font-kbx-semibold',
        value: 'leading-kbx-100',
        values: [
            {className: 'kbx-text-40', size: 40},
            {className: 'kbx-text-34', size: 34},
            {className: 'kbx-text-28', size: 28},
        ],
        unit: 'kbx-text-24 ml-1.5',
        unitSize: 24,
        width: 233,
    },
    lg: {
        box: 'gap-2 px-6 py-5',
        label: 'kbx-text-20 font-kbx-semibold',
        value: 'leading-kbx-110',
        values: [
            {className: 'kbx-text-40', size: 40},
            {className: 'kbx-text-34', size: 34},
            {className: 'kbx-text-28', size: 28},
        ],
        unit: 'kbx-text-22 ml-1',
        unitSize: 22,
        width: 223,
    },
} as const
// 단위 앞 여백(ml-1 · ml-1.5)을 어림에 더한다.
const STAT_UNIT_GAP = 6

const KbxStatCard = ({
    label,
    value,
    unit,
    size = 'lg',
}: {
    label: ReactNode
    value: ReactNode
    unit?: ReactNode
    size?: keyof typeof STAT_CARD_SIZES
}) => {
    const sizeClass = STAT_CARD_SIZES[size]
    // 숫자 + 단위 폭 어림 — 글자로 받은 값만 맞춘다(그 밖의 노드는 가장 큰 단계).
    const unitWidth = typeof unit === 'string' ? estimateTextEm(unit) * sizeClass.unitSize + STAT_UNIT_GAP : 0
    const valueStep =
        typeof value === 'string'
            ? (sizeClass.values.find((step) => estimateTextEm(value) * step.size + unitWidth <= sizeClass.width) ??
              sizeClass.values[sizeClass.values.length - 1])
            : sizeClass.values[0]

    return (
        <div className={cn('bg-kbx-surface flex flex-col', sizeClass.box)}>
            <div className={cn('text-kbx-foreground-subtle', sizeClass.label)}>{label}</div>
            <div
                className={cn(
                    'font-kbx-black text-kbx-primary whitespace-nowrap tabular-nums',
                    valueStep.className,
                    sizeClass.value,
                )}
            >
                {value}
                {unit ? <span className={cn('font-kbx-bold', sizeClass.unit)}>{unit}</span> : null}
            </div>
        </div>
    )
}

// 이름 · 값 줄 목록 — 위아래 선, 오른쪽 값. 모든 줄이 남색 굵게(이름 700 · 값 800), 28px(진단브리핑 평균 특허수).
const KbxKeyValueList = ({rows}: {rows: readonly {key: string; label: ReactNode; value: ReactNode}[]}) => (
    <dl className="border-kbx-border kbx-border-t-regular kbx-text-28 text-kbx-primary flex flex-col">
        {rows.map((row) => (
            <div
                key={row.key}
                className="border-kbx-border kbx-border-b-regular py-kbx-9 flex items-baseline justify-between"
            >
                <dt className="font-kbx-bold">{row.label}</dt>
                <dd className="font-kbx-extrabold m-0 tabular-nums">{row.value}</dd>
            </div>
        ))}
    </dl>
)

// 등급 꼬리표 — 알약(양호 · 우수 …). tone 이 없으면 남색 테두리, 있으면 그 단계 색 바탕 + 흰 글자(웹 점수 게이지와 같은 단계).
// 보통(주황)은 흰 글자 대비를 위해 한 단계 진한 색이다(tokens.json kbigxPrint grade-tag-*)[5.3.3].
const GRADE_TAG_TONE_CLASS = {
    weak: 'bg-kbx-grade-tag-weak border-kbx-grade-tag-weak text-kbx-paper',
    poor: 'bg-kbx-grade-tag-poor border-kbx-grade-tag-poor text-kbx-paper',
    normal: 'bg-kbx-grade-tag-normal border-kbx-grade-tag-normal text-kbx-paper',
    good: 'bg-kbx-grade-tag-good border-kbx-grade-tag-good text-kbx-paper',
    excellent: 'bg-kbx-grade-tag-excellent border-kbx-grade-tag-excellent text-kbx-paper',
} as const
type KbxGradeTone = keyof typeof GRADE_TAG_TONE_CLASS

const KbxGradeTag = ({children, tone, className}: {children: ReactNode; tone?: KbxGradeTone; className?: string}) => (
    <span
        className={cn(
            'kbx-border-regular kbx-text-22 font-kbx-extrabold px-kbx-18 py-kbx-5 rounded-full',
            tone ? GRADE_TAG_TONE_CLASS[tone] : 'border-kbx-primary text-kbx-primary',
            className,
        )}
    >
        {children}
    </span>
)

// 현금흐름등급 알약 색 — 웹 보고서 cash-flow-cf-<n>(n = 등급 숫자 1 ~ 6)과 같은 단계(인쇄본 kbx 색).
// 진단브리핑 · 신용/재무정보 현금흐름등급이 같이 쓴다. 키는 cashFlowLevel(cash-flow-grades.ts)로 구한다 — 범위 밖이면 undefined.
const KBX_CASH_FLOW_TAG_CLASS: Record<number, string> = {
    6: 'bg-kbx-grade-weak border-kbx-grade-weak text-kbx-paper',
    5: 'bg-kbx-gray border-kbx-gray text-kbx-ink',
    4: 'bg-kbx-red border-kbx-red text-kbx-paper',
    3: 'bg-kbx-orange border-kbx-orange text-kbx-ink',
    2: 'bg-kbx-green border-kbx-green text-kbx-paper',
    1: 'bg-kbx-blue border-kbx-blue text-kbx-paper',
}

// 안내 문구 — 표 · 그래프 아래 작은 글(18px · 행간 1.5).
const KbxNote = ({children}: {children: ReactNode}) => (
    <p className="kbx-text-18 leading-kbx-150 text-kbx-foreground-subtle break-keep">{children}</p>
)

// 분류 비중 차트(원형 · 도넛)의 조각 색 — 큰 분류부터 진한 남색 → 옅은 파랑, '기타'는 회색. 7개를 넘으면 처음 색부터 되풀이.
// 진단브리핑 기업 보유기술 · 기술혁신정보 기술 보유현황이 같이 쓴다. 색 값(CSS 변수)이라 SVG fill 에 넘긴다.
// 색은 받은 순서(index)대로 매긴다 — 여기서 정렬하지 않는다.
const KBX_CATEGORY_COLORS = [
    'var(--kbx-color-navy-deep)',
    'var(--kbx-color-navy)',
    'var(--kbx-color-blue-strong)',
    'var(--kbx-color-blue)',
    'var(--kbx-color-blue-light)',
    'var(--kbx-color-blue-lighter)',
    'var(--kbx-color-blue-faint)',
] as const
const KBX_OTHERS_LABEL = '기타'
const KBX_OTHERS_COLOR = 'var(--kbx-color-gray)'
// 분류 항목 → 조각 색('기타'는 회색, 그 밖은 순서대로).
const kbxCategoryColor = (label: string, index: number) =>
    label === KBX_OTHERS_LABEL ? KBX_OTHERS_COLOR : KBX_CATEGORY_COLORS[index % KBX_CATEGORY_COLORS.length]

// 차트 빈 상태 — 그릴 데이터가 없을 때 차트 자리에 두는 옅은 면 + 가운데 '데이터가 없습니다.'. 인쇄본 차트는 모두 이 모양으로 맞춘다.
// 높이는 차트 자리와 같게 className(h-* · flex-1 등)으로 준다 — 비어도 쪽 배치가 흔들리지 않는다.
// 빈 상태를 안에서 그리는 차트(RankBarList · DonutListChart · InsideLabelPieChart)에는 emptyText={KBX_CHART_EMPTY_TEXT} 와
// emptyClassName={cn(KBX_CHART_EMPTY_CLASS, 높이)} 를 넘겨 같은 모양으로 맞춘다.
// (숫자 · 표 칸처럼 값 자리가 비면 '-' 로 적어 실제 0 과 구분하고, 차트 자리는 문구로 알린다.)
const KBX_CHART_EMPTY_TEXT = '데이터가 없습니다.'
const KBX_CHART_EMPTY_CLASS =
    'bg-kbx-surface-subtle kbx-text-20 text-kbx-foreground-subtle flex items-center justify-center'
const KbxChartEmpty = ({className}: {className?: string}) => (
    <div className={cn(KBX_CHART_EMPTY_CLASS, className)}>{KBX_CHART_EMPTY_TEXT}</div>
)

// 차트 자리 — 데이터가 있으면 차트(children)를 그대로 그리고, 없으면(isEmpty) 그 자리에 빈 상태(KbxChartEmpty)를 그린다.
// emptyClassName 은 빈 상태의 크기(예: h-75)다 — 차트가 있을 때와 쪽 배치가 크게 흔들리지 않게 자리 높이를 준다.
// 차트 쪽에는 아무것도 덧씌우지 않으므로 차트 모양 · 크기는 차트 props 그대로다.
// [주의] emptyClassName 은 차트 높이와 자동으로 맞춰지지 않는다 — 차트 크기를 바꾸면 이 값도 같이 확인한다.
const KbxChartBox = ({
    isEmpty,
    emptyClassName,
    children,
}: {
    isEmpty: boolean
    emptyClassName: string
    children: ReactNode
}) => (isEmpty ? <KbxChartEmpty className={emptyClassName} /> : children)

// 비공개 — 웹 보고서의 PrivateContent · PrivateCell(composite/private-content.tsx)과 같은 모양을 인쇄본 값으로 그린다.
// 흐린 자리 표시(가짜 값) 위에 흰 면 80% 를 덮고 가운데에 안내를 둔다. 자리 표시는 낭독기 · 키보드에서 빠진다.
// [프론트엔드 연동] children 에는 실제 값이 아니라 모양이 비슷한 가짜 값을 넣는다 — 흐려도 실제 값이 문서에 남으면 읽힌다.
//   KbxPrivateContent — 표 · 차트 덩어리 하나를 통째로 가린다(안내 기본 '정책에 따라 비공개 처리된 정보입니다.').
//   KbxPrivateCell    — 표의 한 칸만 가린다(열 하나를 가릴 때 그 열의 머리 · 값 칸마다). 안내는 label 을 준 칸에만.
const KbxPrivateContent = ({
    children,
    label = PRIVATE_CARD_LABEL,
    className,
}: {
    children: ReactNode
    label?: string
    className?: string
}) => (
    <div className={cn('relative isolate', className)}>
        <div aria-hidden="true" inert className="pointer-events-none blur-sm select-none">
            {children}
        </div>
        {/* 안내는 제목이 아니라 상태 글이라 단락(p)이 아닌 div 로 둔다 — 큰 글자 p 는 접근성 검사에서 '제목일 수 있음'으로 잡힌다. */}
        <div className="bg-kbx-paper/80 absolute inset-0 flex items-center justify-center p-4">
            <div className="kbx-text-24 font-kbx-medium text-kbx-foreground text-center break-keep">{label}</div>
        </div>
    </div>
)

const KbxPrivateCell = ({children, label}: {children: ReactNode; label?: string}) => (
    <span className="relative isolate block">
        <span aria-hidden="true" inert className="pointer-events-none block blur-sm select-none">
            {children}
        </span>
        {/* 칸 여백까지 덮는다(KbxTable 칸 좌우 14 · 위아래 10). */}
        <span className="bg-kbx-paper/80 -inset-x-kbx-14 -inset-y-kbx-10 absolute flex items-center justify-center">
            {label ? (
                <span className="kbx-text-22 font-kbx-medium text-kbx-foreground whitespace-nowrap">{label}</span>
            ) : (
                <span className="sr-only">{PRIVATE_SHORT_LABEL}</span>
            )}
        </span>
    </span>
)

// 장 첫머리 안내문 — 위아래 선 사이 22px 글(기술혁신정보 등).
const KbxChapterNotice = ({children}: {children: ReactNode}) => (
    <p className="border-kbx-border kbx-border-t-regular kbx-border-b-regular kbx-text-22 leading-kbx-165 text-kbx-label py-5 break-keep">
        {children}
    </p>
)

// 범례 — 색 칸 + 이름. 색은 kbx 배경 클래스(bg-kbx-*)로 넘긴다. 색 칸은 꾸밈이라 숨기고 이름이 읽힌다.
const KbxLegend = ({
    items,
    density = 'default',
    className,
}: {
    items: readonly {label: string; swatchClassName: string}[]
    /**
     * default: 18px · 항목 사이 24 / compact: 항목 사이 18 · 색 칸과 이름 사이 7 · 줄 높이 26(재무현황처럼 좁은 칸)
     * / unit: 소제목 오른쪽 단위 자리 20px · 항목 사이 22(기업 · 특허 현황).
     */
    density?: 'default' | 'compact' | 'unit'
    /** 항목 사이 간격 등 — 재무비율진단 소제목 오른쪽 범례는 gap-4(16). */
    className?: string
}) => (
    <ul
        className={cn(
            'text-kbx-foreground-subtle flex justify-end whitespace-nowrap',
            density === 'unit' ? 'kbx-text-20' : 'kbx-text-18',
            density === 'compact' ? 'gap-kbx-18 h-kbx-26 items-center' : density === 'unit' ? 'gap-kbx-22' : 'gap-6',
            className,
        )}
    >
        {items.map((item) => (
            <li key={item.label} className={cn('flex items-center', density === 'compact' ? 'gap-kbx-7' : 'gap-2')}>
                <span aria-hidden="true" className={cn('size-kbx-14 shrink-0', item.swatchClassName)} />
                {item.label}
            </li>
        ))}
    </ul>
)

type KbxTableColumn = {
    key: string
    header: ReactNode
    /** 행을 대표하는 열(굵게 · 행 머리 th). */
    isRowHeader?: boolean
    /** 열 폭 등 — 머리 칸에 붙인다(table-fixed 라 머리 칸 폭이 열 폭이 된다). */
    className?: string
    /** 값 칸 정렬. 기본은 가운데, 'start' 는 긴 문장 열(정의 등)에 — 왼쪽 정렬 · 왼쪽 여백 24. */
    align?: 'center' | 'start'
    /** 두 단 머리의 윗단 이름 — 같은 group 이 이어진 열은 윗단에서 한 칸으로 합쳐진다(예: 매출비중 아래 연도). */
    group?: string
    /** 머리 칸에만 더할 클래스(예: 줄바꿈 막기). */
    headerClassName?: string
    /** 좁은 열 — 좌우 여백을 표 밀도와 관계없이 4 로(이머징 기술 기간 · 합계 칸). */
    isNarrow?: boolean
    /** 머리 칸 왼쪽 세로 구분선 — 두 묶음이 나란한 표에서 둘째 묶음 첫 열에(R&D 전문기관 현황). 값 칸에는 긋지 않는다. */
    hasHeaderDivider?: boolean
}

type KbxTableRow = {
    key: string
    cells: readonly ReactNode[]
    /** 합계 줄 — 옅은 면 · 굵게 · 위 짙은 선(이머징 기술 · R&D 전문기관 · 에너지 사용량 합계). */
    isTotal?: boolean
}

type KbxTableProps = {
    /** 표 이름(화면에 보이지 않는 caption)[7.3.2]. */
    caption: string
    columns: readonly KbxTableColumn[]
    rows: readonly KbxTableRow[]
    /**
     * 칸 여백 · 글자(언급 없는 값은 기본과 같다).
     *   default  위아래 10 · 좌우 14 · 글자 20
     *   compact  위아래 5 — 행이 많은 표 · 참고자료
     *   dense    위아래 7 — 행이 많은 요약 표(진단브리핑 재무 현황 · 기업현황 경영진 · 주주 · 관계기업)
     *   narrow   좌우 4 — 열이 많고 좁은 표
     *   snug     위아래 · 좌우 8 · 글자 18 · 행간 1.3 — 기업현황 재무현황(반쪽 폭 표 넷)
     *   list     좌우 12 — 거래처현황
     *   stacked  좌우 10 · 행간 1.45 — 값 + 옅은 둘째 줄이 쌓이는 표(정부 R&D 과제)
     * [주의] dense · stacked 는 k-bigx-print-report.ts 의 행 높이 어림(COMPANY_FIRST_PAGE · RND_PROJECT_AREA)과,
     * list 는 거래처현황 10행 × 2 가 한 쪽에 들어가는 높이와 맞물린다. 여백을 바꾸면 같이 확인한다.
     */
    density?: 'default' | 'compact' | 'dense' | 'narrow' | 'snug' | 'list' | 'stacked'
    /** 행이 없을 때 머리 아래 한 줄 문구. 없으면 빈 표(머리만)다. */
    emptyText?: string
    /** 빈 줄의 여백 · 바탕. 기본 py-10(바탕 없음). 신용/재무정보는 옅은 면 · 보통 줄 높이. */
    emptyClassName?: string
    /** 표 자체에 덧붙일 클래스 — 옆 표와 높이를 맞출 때 flex-1(남는 높이를 행이 나눠 가진다). */
    className?: string
}

// density 별 칸 여백 · 글자 — 값은 KbxTableProps.density 설명과 같다.
const KBX_TABLE_TEXT = 'kbx-text-20 leading-kbx-140'
const KBX_TABLE_DENSITY: Record<
    NonNullable<KbxTableProps['density']>,
    {paddingX: string; paddingY: string; text: string}
> = {
    default: {paddingX: 'px-kbx-14', paddingY: 'py-kbx-10', text: KBX_TABLE_TEXT},
    compact: {paddingX: 'px-kbx-14', paddingY: 'py-kbx-5', text: KBX_TABLE_TEXT},
    dense: {paddingX: 'px-kbx-14', paddingY: 'py-kbx-7', text: KBX_TABLE_TEXT},
    narrow: {paddingX: 'px-1', paddingY: 'py-kbx-10', text: KBX_TABLE_TEXT},
    snug: {paddingX: 'px-2', paddingY: 'py-2', text: 'kbx-text-18 leading-kbx-130'},
    list: {paddingX: 'px-3', paddingY: 'py-kbx-10', text: KBX_TABLE_TEXT},
    stacked: {paddingX: 'px-2.5', paddingY: 'py-kbx-10', text: KBX_TABLE_TEXT},
}

// 표 — 위 남색 굵은 선 · 머리 옅은 면 · 칸 가운데 정렬 · 숫자 고정폭. columns 에 group 이 있으면 두 단 머리가 된다.
// rows[].cells 는 columns 순서와 같아야 한다. 빈 값('-' 등)은 사용처에서 채워 넘긴다.
const KbxTable = ({
    caption,
    columns,
    rows,
    density = 'default',
    emptyText,
    emptyClassName,
    className,
}: KbxTableProps) => {
    // 좌우 여백은 열마다 고른다 — kbx 여백 클래스는 cn 이 겹침을 몰라 나중에 덮어쓸 수 없다.
    const {paddingX, paddingY, text} = KBX_TABLE_DENSITY[density]
    const cellPadding = (column?: KbxTableColumn) => (column?.isNarrow ? 'px-1' : paddingX)
    const cellClassName = cn('text-center', paddingY, density === 'stacked' && 'leading-kbx-145')
    const headClassName = 'bg-kbx-surface border-kbx-border kbx-border-b-regular font-kbx-bold'
    const headerDivider = (column: KbxTableColumn) => column.hasHeaderDivider && 'kbx-border-l-hairline'
    const hasGroup = columns.some((column) => column.group)

    return (
        <table
            className={cn('border-kbx-primary kbx-border-t-strong w-full table-fixed tabular-nums', text, className)}
        >
            <caption className="sr-only">{caption}</caption>
            {/* 두 단 머리는 첫 줄이 합친 칸이라 머리 칸 폭으로 열 폭이 정해지지 않는다 — col 에 폭을 준다. */}
            {hasGroup ? (
                <colgroup>
                    {columns.map((column) => (
                        <col key={column.key} className={column.className} />
                    ))}
                </colgroup>
            ) : null}
            <thead className="text-kbx-primary">
                {hasGroup ? (
                    <>
                        {/* 윗단 — 묶이지 않은 열은 두 단을 합치고(rowSpan 2), 묶인 열은 처음 열에서 한 칸으로 합친다. */}
                        <tr>
                            {columns.map((column, index) => {
                                if (!column.group) {
                                    return (
                                        <th
                                            key={column.key}
                                            scope="col"
                                            rowSpan={2}
                                            className={cn(
                                                cellClassName,
                                                cellPadding(column),
                                                headClassName,
                                                headerDivider(column),
                                                column.className,
                                                column.headerClassName,
                                            )}
                                        >
                                            {column.header}
                                        </th>
                                    )
                                }
                                if (columns[index - 1]?.group === column.group) return null
                                const span = columns.slice(index).findIndex((item) => item.group !== column.group)

                                return (
                                    <th
                                        key={`group-${column.key}`}
                                        scope="colgroup"
                                        colSpan={span < 0 ? columns.length - index : span}
                                        className={cn(cellClassName, paddingX, headClassName, headerDivider(column))}
                                    >
                                        {column.group}
                                    </th>
                                )
                            })}
                        </tr>
                        {/* 아랫단 — 묶인 열의 이름. 윗단과 구분되게 더 옅은 면이다. */}
                        <tr>
                            {columns
                                .filter((column) => column.group)
                                .map((column) => (
                                    <th
                                        key={column.key}
                                        scope="col"
                                        className={cn(
                                            cellClassName,
                                            cellPadding(column),
                                            headClassName,
                                            headerDivider(column),
                                            'bg-kbx-surface-subtle',
                                            column.className,
                                            column.headerClassName,
                                        )}
                                    >
                                        {column.header}
                                    </th>
                                ))}
                        </tr>
                    </>
                ) : (
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className={cn(
                                    cellClassName,
                                    cellPadding(column),
                                    headClassName,
                                    column.className,
                                    column.headerClassName,
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                )}
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={row.key} className={cn(row.isTotal && 'bg-kbx-surface-subtle')}>
                        {row.cells.map((cell, index) => {
                            const column = columns[index]
                            const className = cn(
                                cellClassName,
                                cellPadding(column),
                                'border-kbx-border kbx-border-b-hairline',
                                column?.isRowHeader || row.isTotal ? 'font-kbx-bold' : 'font-kbx-regular',
                                row.isTotal && 'border-t-kbx-foreground kbx-border-t-regular',
                                column?.align === 'start' && 'pl-6 text-left',
                            )

                            return column?.isRowHeader ? (
                                <th key={column.key} scope="row" className={className}>
                                    {cell}
                                </th>
                            ) : (
                                <td key={column?.key ?? index} className={className}>
                                    {cell}
                                </td>
                            )
                        })}
                    </tr>
                ))}
                {!rows.length && emptyText ? (
                    <tr>
                        <td
                            colSpan={columns.length}
                            className={cn(
                                'border-kbx-border kbx-border-b-hairline text-kbx-foreground-subtle text-center',
                                emptyClassName ?? 'py-10',
                            )}
                        >
                            {emptyText}
                        </td>
                    </tr>
                ) : null}
            </tbody>
        </table>
    )
}

// 인당 매출액 막대 목록(활동성정보) — 줄마다 연도 · 막대 · 값. items 는 연도 오름차순, 마지막 줄(최근 연도)을 강조한다.
// 막대 최대 눈금 = 가장 큰 값을 100 단위로 올린 값(466.5 → 500). 음수는 막대 0. 막대 폭은 데이터 값이라 style 로 넘긴다.
// 막대는 꾸밈이라 숨기고, 연도 · 값 글자가 읽힌다.
const SALES_SCALE_STEP = 100
const SALES_PERCENT = 100

const KbxSalesBarList = ({items}: {items: readonly {label: string; value: number}[]}) => {
    const scale = Math.ceil(Math.max(...items.map((item) => item.value), 1) / SALES_SCALE_STEP) * SALES_SCALE_STEP

    return (
        <ul className="border-kbx-border kbx-border-t-regular kbx-text-22 flex flex-col">
            {items.map((item, index) => {
                const isLatest = index === items.length - 1

                return (
                    <li
                        key={item.label}
                        className={cn(
                            'border-kbx-border kbx-border-b-regular flex items-center gap-5',
                            'py-kbx-18',
                            isLatest ? 'text-kbx-primary font-kbx-extrabold' : 'font-kbx-bold',
                        )}
                    >
                        <span className="w-35 shrink-0">{item.label}</span>
                        <span aria-hidden="true" className="bg-kbx-surface h-11 min-w-0 flex-1">
                            <span
                                className="bg-kbx-blue block h-full"
                                style={{width: `${(Math.max(item.value, 0) / scale) * SALES_PERCENT}%`}}
                            />
                        </span>
                        {/* 값 칸 — 기본 110, 값이 길면(466,500.0) 그만큼 늘고 막대가 짧아진다. */}
                        <span className="min-w-kbx-110 shrink-0 text-right whitespace-nowrap tabular-nums">
                            {kbxFixed1Format.format(item.value)}
                        </span>
                    </li>
                )
            })}
        </ul>
    )
}

type KbxStairTableColumn = {
    key: string
    header: ReactNode
    /** 열 폭(w-*) — col 에 붙인다(첫 줄이 합친 칸이라 머리 칸 폭으로는 열 폭이 정해지지 않는다). */
    className?: string
}

type KbxStairTableRow = {
    key: string
    /** 1행 — 열 전체를 합친 이름 칸(굵게 · 왼쪽 정렬). */
    title: ReactNode
    /** 1행 글자 색 등(예: '기타' 줄은 옅게). */
    titleClassName?: string
    /** 2행 — 들여쓰기 빈칸 뒤 columns 순서대로. */
    cells: readonly ReactNode[]
}

type KbxStairTableProps = {
    /** 표 이름(화면에 보이지 않는 caption)[7.3.2]. */
    caption: string
    /** 1행 머리 이름(예: '특허명'). */
    titleHeader: ReactNode
    columns: readonly KbxStairTableColumn[]
    rows: readonly KbxStairTableRow[]
    /** 들여쓰기 빈칸 폭(w-*). 기본 w-1/12. */
    indentClassName?: string
    /** 행이 없을 때 문구. */
    emptyText?: string
}

// 2단 계단식 표(특허 보유현황 · 우수특허) — 항목마다 1행(이름, 열 전체 병합) · 2행(들여쓰기 빈칸 + 세부 값).
// 항목 하나가 tbody 하나 — 이름 칸이 그 묶음의 행 머리(scope="rowgroup")다[7.3.2].
// [주의] 칸 여백 · 글자 크기 · 행간 · 선 두께를 바꾸면 행 높이 어림값(k-bigx-print-report.ts 의 PATENT_PAGE ·
// EXCELLENT_PATENT_PAGE)도 같이 고친다 — 안 고치면 쪽이 넘칠 수 있다.
const KbxStairTable = ({
    caption,
    titleHeader,
    columns,
    rows,
    indentClassName = 'w-1/12',
    emptyText = '표시할 내용이 없습니다.',
}: KbxStairTableProps) => {
    const columnCount = columns.length + 1
    const titleCellClassName = 'pt-3 pb-2.5 text-left font-kbx-bold'
    const lineClassName = 'border-kbx-border kbx-border-t-hairline kbx-border-l-hairline'

    return (
        <table className="border-kbx-primary kbx-text-20 leading-kbx-145 kbx-border-t-strong w-full table-fixed tabular-nums">
            <caption className="sr-only">{caption}</caption>
            <colgroup>
                <col className={indentClassName} />
                {columns.map((column) => (
                    <col key={column.key} className={column.className} />
                ))}
            </colgroup>
            <thead className="text-kbx-primary">
                <tr>
                    <th scope="col" colSpan={columnCount} className={cn(titleCellClassName, 'bg-kbx-surface px-3')}>
                        {titleHeader}
                    </th>
                </tr>
                <tr>
                    <td aria-hidden="true" className="bg-kbx-surface border-kbx-border kbx-border-b-regular p-0" />
                    {columns.map((column) => (
                        <th
                            key={column.key}
                            scope="col"
                            className={cn(
                                lineClassName,
                                'bg-kbx-surface kbx-border-b-regular font-kbx-bold px-3 py-2.5 text-center',
                            )}
                        >
                            {column.header}
                        </th>
                    ))}
                </tr>
            </thead>
            {rows.length ? (
                rows.map((row) => (
                    <tbody key={row.key} className="break-inside-avoid">
                        <tr>
                            <th
                                scope="rowgroup"
                                colSpan={columnCount}
                                className={cn(
                                    titleCellClassName,
                                    'px-2.5 wrap-anywhere break-keep',
                                    row.titleClassName,
                                )}
                            >
                                {row.title}
                            </th>
                        </tr>
                        <tr>
                            <td aria-hidden="true" className="border-kbx-border kbx-border-b-hairline p-0" />
                            {row.cells.map((cell, index) => (
                                <td
                                    key={columns[index]?.key ?? index}
                                    className={cn(
                                        lineClassName,
                                        'kbx-border-b-hairline py-kbx-7 px-2.5 text-center wrap-anywhere break-keep',
                                    )}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                ))
            ) : (
                <tbody>
                    <tr>
                        <td
                            colSpan={columnCount}
                            className="border-kbx-border kbx-border-b-hairline text-kbx-foreground-subtle py-10 text-center"
                        >
                            {emptyText}
                        </td>
                    </tr>
                </tbody>
            )}
        </table>
    )
}

// 워드클라우드에 넘길 키워드 — 글자가 비었거나 중요도가 0 이하 · 숫자가 아니면 뺀다(그대로 넘기면 그리기가 끝나지 않아
// 자동 인쇄가 제한 시간까지 기다린다). 남는 키워드가 없으면 사용처가 빈 상태를 그린다.
const getKbxIssueWords = <T extends {text: string; weight: number}>(issues: readonly T[]): T[] =>
    issues.filter((word) => word.text.trim() && isKbxNumber(word.weight) && word.weight > 0)

// 칸 안 둘째 줄 — 괄호 값(등록번호 · 등록일 · 권리자 등). 19px 옅은 글자.
const KbxSubText = ({children, className}: {children: ReactNode; className?: string}) => (
    <div className={cn('kbx-text-19 text-kbx-foreground-subtle', className)}>{children}</div>
)

export {
    fitKbxText,
    getKbxIssueWords,
    KBX_CASH_FLOW_TAG_CLASS,
    KBX_CATEGORY_COLORS,
    KBX_CHART_EMPTY_CLASS,
    KBX_CHART_EMPTY_TEXT,
    KBX_OTHERS_LABEL,
    KbxBlock,
    kbxCategoryColor,
    KbxChapterNotice,
    KbxChapterTitle,
    KbxChartBox,
    KbxChartEmpty,
    KbxFitName,
    KbxGradeTag,
    KbxKeyValueList,
    KbxLabelValueGrid,
    KbxLegend,
    KbxNote,
    KbxPage,
    KbxPageFooter,
    KbxPageHeader,
    KbxPrivateCell,
    KbxPrivateContent,
    KbxSalesBarList,
    KbxStairTable,
    KbxStatCard,
    KbxSubBlock,
    KbxSubText,
    KbxTable,
    KbxUnit,
    KbxUnitBelow,
    keepCorporatePrefix,
}
export type {KbxStairTableColumn, KbxStairTableRow, KbxTableColumn, KbxTableRow}
