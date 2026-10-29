import Image, {type StaticImageData} from 'next/image'
import {Plus} from 'lucide-react'
import applicantIcon from '@public/images/platform-k-bigx-report/applicant.webp'
import companyInfoIcon from '@public/images/platform-k-bigx-report/company-info.webp'
import kBigxReportIcon from '@public/images/platform-k-bigx-report/k-bigx-report.webp'
import llmIcon from '@public/images/platform-k-bigx-report/llm.webp'
import patentInfoIcon from '@public/images/platform-k-bigx-report/patent-info.webp'
import {ScrollReveal} from '@/components/custom/scroll-reveal'
import {PLATFORM_K_BIGX_REPORT} from '@/content/service/platform-k-bigx-report'
import {cn} from '@/lib/utils'

// KBigxReportFlowDiagram — K-BIGx 보고서 생성 흐름도(신청기업 → DB · 기술혁신정보 → 보고서)를 글 · 도형으로 그린다.
// 쓰는 곳: 플랫폼 소개 > K-BIGx 보고서. 문구는 content/service/platform-k-bigx-report.ts 의 flow.
//
// 알아둘 점
//   · 그림이 아니라 글이라 화면 낭독기가 읽고[5.1.1] 모바일에서 글자가 줄지 않는다.
//   · 모이는 연결선(MergeConnector)은 SVG 좌표가 점선 묶음 · LLM 의 가로 위치에 맞춰져 있다 — 그 칸 폭을 바꾸면 좌표도 고친다.
//     모바일은 연결선 대신 가운데 화살표 하나로 잇는다.
//   · 아이콘은 꾸밈(alt="") 그림이라 색을 못 바꾼다 — 바탕은 다크에서도 밝게 유지되는 토큰
//     (brand-solid · model-icon-surface · icon-surface-raised)을 쓴다.
//   · 덩어리마다 화면에 들어오면 떠오르고 연결선이 그려진다. 동작 줄이기면 없다[6.3.1].

const {flow} = PLATFORM_K_BIGX_REPORT

// 선 · 화살촉 — Tech-Index 구조도와 같다(gray.500 50% 두께 2 · gray.500 화살촉 폭 6 · 높이 5).
const LINE_CLASS_NAME =
    'stroke-foreground-subtle/50 motion-safe:group-data-[revealed=true]/reveal:animate-chart-draw fill-none'
const ARROW_CLASS_NAME = 'fill-foreground-subtle motion-safe:group-data-[revealed=true]/reveal:animate-chart-label'

// 아래로 향하는 화살표(폭 12) — 높이 24(덩어리 사이 · h-6) · 16(모바일 묶음 안 · h-4).
const ARROW_HEIGHT_CLASS = {24: 'h-6', 16: 'h-4'} as const
const DownArrow = ({height = 24, className}: {height?: keyof typeof ARROW_HEIGHT_CLASS; className?: string}) => (
    <svg
        aria-hidden="true"
        viewBox={`0 0 12 ${height}`}
        className={cn('block w-3 shrink-0', ARROW_HEIGHT_CLASS[height], className)}
    >
        <path
            d={`M 6 0 V ${height - 5}`}
            strokeWidth={2}
            pathLength={1}
            strokeDasharray="1 2"
            className={LINE_CLASS_NAME}
        />
        <polygon points={`3,${height - 5} 9,${height - 5} 6,${height}`} className={ARROW_CLASS_NAME} />
    </svg>
)

// 모이는 연결선(시안 좌표 · 묶음 폭 664) — 점선 묶음 가운데(179) · LLM 가운데(485)에서 내려와 묶음 가운데(332)로.
const MERGE_VIEW = {width: 664, height: 32}
const MergeConnector = () => (
    <svg
        aria-hidden="true"
        viewBox={`0 0 ${MERGE_VIEW.width} ${MERGE_VIEW.height}`}
        className="hidden h-auto w-full md:block"
    >
        {['M 179 0 V 16 H 332', 'M 485 0 V 16 H 332', 'M 332 16 V 27'].map((line) => (
            <path
                key={line}
                d={line}
                strokeWidth={2}
                pathLength={1}
                strokeDasharray="1 2"
                className={LINE_CLASS_NAME}
            />
        ))}
        <polygon points="329,27 335,27 332,32" className={ARROW_CLASS_NAME} />
    </svg>
)

// 원 아이콘(40).
const SOURCE_ICONS: Record<'patent-info' | 'company-info' | 'llm', StaticImageData> = {
    'patent-info': patentInfoIcon,
    'company-info': companyInfoIcon,
    llm: llmIcon,
}

// 원 아이콘 + 이름(특허정보 · 기업정보 · LLM).
// 이름 색 — 특허정보 · 기업정보는 foreground, LLM 만 label-foreground(isSubtle).
const SourceItem = ({icon, label, isSubtle}: {icon: keyof typeof SOURCE_ICONS; label: string; isSubtle?: boolean}) => (
    <span className="flex w-16 flex-col items-center gap-2 md:w-20">
        <span className="bg-icon-surface-raised flex size-16 items-center justify-center rounded-full md:size-20">
            <Image src={SOURCE_ICONS[icon]} alt="" className="size-8 md:size-10" />
        </span>
        <span className={cn('typo-body-l-bold text-center', isSubtle ? 'text-label-foreground' : 'text-foreground')}>
            {label}
        </span>
    </span>
)

const KBigxReportFlowDiagram = () => (
    <div className="bg-panel-subtle flex flex-col items-center px-4 py-12 md:px-6">
        {/* 신청기업 */}
        <ScrollReveal className="flex w-full flex-col items-center">
            <p className="bg-brand-solid text-brand-solid-foreground typo-body-xl-bold flex w-full max-w-57 flex-col items-center gap-2 rounded-lg py-8 text-center">
                <Image src={applicantIcon} alt="" className="size-8" />
                <span>
                    {flow.applicantLines.map((line) => (
                        <span key={line} className="block">
                            {line}
                        </span>
                    ))}
                </span>
            </p>
            <DownArrow />
        </ScrollReveal>

        {/* 흰 판 */}
        <div className="bg-panel-raised flex w-full max-w-186 flex-col items-center gap-6 px-4 py-6 md:px-10">
            <ScrollReveal className="w-full">
                <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
                    {flow.databases.map((database) => (
                        <li key={database.title} className="bg-primary-subtle flex flex-col gap-3 rounded-lg p-4">
                            <h4 className="border-primary bg-panel-raised typo-body-xl-bold text-primary-strong rounded-sm border py-3 text-center">
                                {database.title}
                            </h4>
                            <ul className="typo-body-l-regular text-label-foreground flex flex-col gap-1 text-center">
                                {database.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </ScrollReveal>

            <ScrollReveal className="bg-primary-subtle flex w-full flex-col items-center rounded-lg px-4 py-6 md:px-0">
                <div className="grid w-full justify-items-center gap-4 md:grid-cols-[38fr_282fr_125fr_80fr_139fr] md:items-start md:gap-0">
                    {/* 점선 묶음 — 특허정보 + 기업정보(여백 위아래 16 · 좌우 36 + 테두리 1 = 시안 282). */}
                    <ul className="bg-panel-subtle border-foreground-subtle flex w-full items-start justify-center gap-2 rounded-sm border border-dashed px-3 py-4 md:col-start-2 md:gap-4 md:px-9">
                        {flow.sources.map((source, index) => (
                            <li key={source.label} className="flex items-start gap-2 md:gap-4">
                                {index > 0 ? (
                                    <Plus
                                        aria-hidden="true"
                                        className="text-foreground-subtle size-icon-sm mt-6 shrink-0 md:mt-8"
                                    />
                                ) : null}
                                <SourceItem icon={source.icon} label={source.label} />
                            </li>
                        ))}
                    </ul>
                    <Plus
                        aria-hidden="true"
                        className="text-foreground-subtle size-icon-sm shrink-0 md:col-start-3 md:mt-12"
                    />
                    <p className="md:col-start-4 md:pt-4">
                        <SourceItem icon={flow.llm.icon} label={flow.llm.label} isSubtle />
                    </p>
                </div>
                <MergeConnector />
                <DownArrow height={16} className="my-2 md:hidden" />
                <div className="flex w-full max-w-96 flex-col">
                    <h4 className="typo-body-l-bold text-primary-foreground bg-navy-500 px-2 py-4 text-center">
                        {flow.innovationDb.title}
                    </h4>
                    <div className="bg-panel-raised flex flex-col gap-2 p-4">
                        <ul className="grid grid-cols-3 gap-2">
                            {flow.innovationDb.categories.map((category) => (
                                <li
                                    key={category}
                                    className="bg-primary-subtle typo-body-l-medium text-label-foreground flex min-h-10 items-center justify-center px-1 text-center break-keep"
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                        <p className="typo-body-l-regular text-foreground-subtle break-keep">
                            {flow.innovationDb.note}
                        </p>
                    </div>
                </div>
                <p className="typo-body-l-bold text-label-foreground mt-6 text-center break-keep">
                    {flow.buildLines.map((line) => (
                        <span key={line} className="block">
                            {line}
                        </span>
                    ))}
                </p>
            </ScrollReveal>

            {/* 화살표가 덩어리 사이(24)를 채운다 — 그래서 위 간격을 지우고 화살표 바로 아래에 아이콘 칸이 붙는다. */}
            <ScrollReveal className="-mt-6 flex w-full flex-col items-center text-center">
                <DownArrow />
                <span className="bg-model-icon-surface flex size-30 items-center justify-center rounded-3xl">
                    <Image src={kBigxReportIcon} alt="" className="size-15" />
                </span>
                <div className="mt-2 flex flex-col gap-1">
                    <h4 className="typo-title-m-bold text-foreground">{flow.report.title}</h4>
                    <p className="typo-body-l-regular text-label-foreground break-keep">{flow.report.description}</p>
                </div>
            </ScrollReveal>
        </div>
    </div>
)

export {KBigxReportFlowDiagram}
