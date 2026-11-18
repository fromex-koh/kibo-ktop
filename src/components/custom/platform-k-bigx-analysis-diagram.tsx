import type {ReactNode} from 'react'
import {Database} from 'lucide-react'
import Image from 'next/image'
import {PlatformReveal} from '@/components/custom/platform-reveal'
import {ThemeImage} from '@/components/custom/theme-image'
import {platformFlowToneClassName} from '@/components/theme/platform-intro.variants'
import {cn} from '@/lib/utils'
import applicantWhiteIcon from '@public/images/platform-k-bigx-report/applicant-white.webp'
import companyInfoDarkIcon from '@public/images/platform-k-bigx-report/company-info-dark.webp'
import companyInfoIcon from '@public/images/platform-k-bigx-report/company-info.webp'
import kBigxReportDarkIcon from '@public/images/platform-k-bigx-report/k-bigx-report-dark.webp'
import kBigxReportIcon from '@public/images/platform-k-bigx-report/k-bigx-report.webp'
import llmDarkIcon from '@public/images/platform-k-bigx-report/llm-dark.webp'
import llmIcon from '@public/images/platform-k-bigx-report/llm.webp'
import patentInfoDarkIcon from '@public/images/platform-k-bigx-report/patent-info-dark.webp'
import patentInfoIcon from '@public/images/platform-k-bigx-report/patent-info.webp'

// K-BIGx 분석 구조 도식 — 신청기업 → [DB 구축 판: 기업정보DB · Tech-Index DB | (특허(기술)정보 + 기업정보) + LLM → 기술혁신정보 DB] → 기업 맞춤형 보고서.
//   · PC(1280↑): 가로 흐름(신청기업 150 · 판 · 보고서 200, 사이 가로 화살표 — 보고서 칸 200 은 이름이 한 줄에 드는 폭). 그 아래: 세로로 쌓고 화살표가 아래를 향한다.
//   · 모바일(768 미만): DB 두 칸 · 재료 줄(묶음 + LLM)이 한 열로 쌓이고, 묶음 → LLM 을 잇는 꺾은선 대신 가운데 화살표 하나만 남는다.
//   · 색 = 화면 <main> 의 --platform-flow-*(흐름 도식과 같은 변수 — flow-a 진한 색 · flow-b 밝은 색 · flow-f 강조 글자).
//   · 판 · 칸이 화면에 들어오면 차례로 떠오른다(PlatformReveal). 아이콘 · 화살표 · 선은 꾸밈이라 읽지 않는다.
//   · 목록이 아닌 개념도라 role="group" + aria-label 로 묶는다(label). DB 칸 이름(기업정보DB · Tech-Index DB · 기술혁신정보 DB)은
//     칸의 제목이라 h3 로 둔다(굵은 <p> 는 WAVE 'Possible heading').
//   · 그림자 = 강조색으로 물든 번짐(shadow-tint-* — 색은 도식이 넘기는 --shadow-tint = flow-f, 시작 칸만 flow-a). 문구는 content/service/platform-k-bigx-report.ts 의 analysis.
// 쓰는 곳: custom/platform-k-bigx-report.tsx(분석 구조).

type PlatformKBigxDatabase = {title: string; items: readonly string[]}

type PlatformKBigxAnalysis = {
    label: string
    /** 시작 칸 — 줄마다 한 줄씩(예: 신청기업 / (보유기술)). */
    startLines: readonly string[]
    databases: readonly PlatformKBigxDatabase[]
    sources: {patent: string; company: string; llm: string}
    techDatabase: {title: string; classes: readonly string[]; description: string}
    /** 기술혁신정보 DB 아래 설명 — 줄마다 한 줄씩. */
    noteLines: readonly string[]
    /** 이름 = titleLead + titleKeep(한 덩어리로 묶여 줄이 바뀌지 않는 끝부분). */
    result: {titleLead: string; titleKeep: string; tagsLabel: string; tags: readonly string[]}
}

// 칸 사이 화살표 — PC(1280↑) 가로(폭 40) · 그 아래 세로(높이 28). 선 · 꺾쇠 색 = 강조색 45% + 테두리색.
const FlowArrow = () => (
    <span
        aria-hidden="true"
        className="relative h-7 w-0.5 shrink-0 rounded-full bg-[color-mix(in_srgb,var(--flow-f)_45%,var(--color-platform-panel-border))] after:absolute after:-bottom-px after:left-1/2 after:size-2 after:-translate-x-1/2 after:rotate-45 after:border-r-2 after:border-b-2 after:border-[color-mix(in_srgb,var(--flow-f)_45%,var(--color-platform-panel-border))] xl:mx-1.5 xl:h-0.5 xl:w-10 xl:after:top-1/2 xl:after:right-0 xl:after:bottom-auto xl:after:left-auto xl:after:translate-x-0 xl:after:-translate-y-1/2 xl:after:-rotate-45"
    />
)

// 재료 칸(특허정보 · 기업정보 · LLM) — 동그란 아이콘 자리(72 · 모바일 60) + 굵은 이름.
const SourceNode = ({icon, label}: {icon: ReactNode; label: string}) => (
    <div className="typo-platform-diagram-item-bold text-foreground grid justify-items-center gap-2">
        <span
            aria-hidden="true"
            className="bg-platform-panel shadow-tint-node grid size-15 place-items-center rounded-full ring-1 ring-[color-mix(in_srgb,var(--flow-f)_16%,var(--color-platform-panel-border))] md:size-18 [&_img]:size-8.5 md:[&_img]:size-10"
        >
            {icon}
        </span>
        {label}
    </div>
)

const Plus = () => (
    <span aria-hidden="true" className="typo-title-l-bold text-center text-(--flow-f)">
        +
    </span>
)

// 카드 칸 공통 — 흰 면 · 강조색 12% 테두리 링 · 강조색 45% 로 물든 번짐 · 둥근 16.
const CELL_CLASS =
    'bg-platform-panel rounded-lg shadow-tint-cell ring-1 ring-[color-mix(in_srgb,var(--flow-f)_12%,var(--color-platform-panel-border))]'

const PlatformKBigxAnalysisDiagram = ({analysis, className}: {analysis: PlatformKBigxAnalysis; className?: string}) => (
    <div
        role="group"
        aria-label={analysis.label}
        className={cn(
            platformFlowToneClassName,
            'mx-auto flex w-full max-w-190 flex-col items-center [--shadow-tint:var(--flow-f)] xl:max-w-none xl:flex-row',
            className,
        )}
    >
        {/* 시작 칸 — 밝은 끝 → 진한 끝 그라데이션 위 흰 글자 · 아이콘. */}
        <PlatformReveal className="shadow-tint-lift grid min-w-57 justify-items-center gap-2 rounded-xl bg-[radial-gradient(120%_90%_at_85%_0%,var(--flow-b),transparent_60%),linear-gradient(135deg,var(--flow-b),var(--flow-a))] px-7 py-5.5 text-center text-white [--shadow-tint:var(--flow-a)] xl:w-37.5 xl:min-w-0 xl:shrink-0 xl:px-3.5">
            <span
                aria-hidden="true"
                className="grid size-11.5 place-items-center rounded-md bg-white/16 ring-1 ring-white/28 ring-inset"
            >
                <Image src={applicantWhiteIcon} alt="" className="size-6.5" />
            </span>
            <strong className="typo-platform-diagram-start-bold">
                {analysis.startLines.map((line) => (
                    <span key={line} className="block">
                        {line}
                    </span>
                ))}
            </strong>
        </PlatformReveal>
        <FlowArrow />

        {/* DB 구축 판 */}
        <PlatformReveal
            // 판 — 강조 글자색(flow-f) 6% 면에서 40% 지점까지 카드 면으로 옅어지는 바탕 · 16% 테두리(흐름 도식 판은 진한 색 기준이라 따로 둔다).
            className="to-platform-panel shadow-tint-panel grid w-full gap-3.5 rounded-xl border border-[color-mix(in_srgb,var(--flow-f)_16%,var(--color-platform-panel-border))] bg-linear-to-b from-[color-mix(in_srgb,var(--flow-f)_6%,var(--color-platform-panel))] to-40% p-3.5 md:gap-5 md:p-5.5 xl:min-w-0 xl:flex-1"
        >
            <div className="grid gap-3 md:grid-cols-2 md:gap-5">
                {analysis.databases.map((database) => (
                    <div key={database.title} className={cn(CELL_CLASS, 'px-4 pt-4 pb-4.5 text-center')}>
                        <h3 className="typo-platform-diagram-db-extrabold mb-3 flex items-center justify-center gap-2 rounded-md bg-[color-mix(in_srgb,var(--flow-f)_9%,var(--color-platform-panel))] p-2.75 text-(--flow-f)">
                            <Database aria-hidden="true" className="size-4.5" />
                            {database.title}
                        </h3>
                        <ul className="typo-platform-diagram-item-regular text-label-foreground grid gap-1">
                            {database.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className={cn(CELL_CLASS, 'grid justify-items-center px-3 pt-4 pb-4.5 md:px-5.5 md:pt-5.5 md:pb-6')}>
                {/* 재료 줄 — 묶음(특허정보 + 기업정보) 62% · + 40 · LLM 나머지. 모바일은 한 열. */}
                <div className="grid w-full items-center justify-items-center gap-1.5 md:grid-cols-[62%_--spacing(10)_minmax(0,1fr)] md:gap-0">
                    <div className="flex w-full items-center justify-around rounded-lg border-2 border-dashed border-[color-mix(in_srgb,var(--flow-f)_35%,var(--color-platform-panel-border))] bg-[color-mix(in_srgb,var(--flow-f)_4%,var(--color-platform-panel))] px-2.5 py-3.5">
                        <SourceNode
                            label={analysis.sources.patent}
                            icon={<ThemeImage light={patentInfoIcon} dark={patentInfoDarkIcon} />}
                        />
                        <Plus />
                        <SourceNode
                            label={analysis.sources.company}
                            icon={<ThemeImage light={companyInfoIcon} dark={companyInfoDarkIcon} />}
                        />
                    </div>
                    <Plus />
                    <SourceNode label={analysis.sources.llm} icon={<ThemeImage light={llmIcon} dark={llmDarkIcon} />} />
                </div>

                {/* 모이는 선 — 묶음 가운데와 LLM 가운데를 잇는 ㄷ자(아래가 둥근 16 높이) → 가운데에서 아래 화살표.
                    ㄷ자 양 끝 = 묶음 폭(62%)의 절반 · LLM 칸(나머지 - 40)의 절반. 모바일은 ㄷ자 없이 화살표만. */}
                <div aria-hidden="true" className="relative h-9 w-full md:h-11">
                    <span className="absolute top-0 right-[calc((100%-62%-var(--spacing)*10)/2)] left-[31%] hidden h-4 rounded-b-sm border-2 border-t-0 border-[color-mix(in_srgb,var(--flow-f)_45%,var(--color-platform-panel-border))] md:block" />
                    <span className="absolute top-1 left-1/2 h-6 w-0.5 -translate-x-1/2 bg-[color-mix(in_srgb,var(--flow-f)_45%,var(--color-platform-panel-border))] after:absolute after:-bottom-px after:left-1/2 after:size-2 after:-translate-x-1/2 after:rotate-45 after:border-r-2 after:border-b-2 after:border-[color-mix(in_srgb,var(--flow-f)_45%,var(--color-platform-panel-border))] md:top-4 md:h-5" />
                </div>

                <div className="bg-platform-panel shadow-tint-raised w-full max-w-105 overflow-hidden rounded-lg ring-1 ring-[color-mix(in_srgb,var(--flow-f)_14%,var(--color-platform-panel-border))]">
                    <h3 className="typo-platform-diagram-tdb-extrabold bg-linear-135 from-(--flow-b) to-[var(--platform-tone-fill,var(--flow-a))] p-3.25 text-center text-white">
                        {analysis.techDatabase.title}
                    </h3>
                    <ul className="grid grid-cols-3 gap-2 px-3.5 pt-3.5 pb-2">
                        {analysis.techDatabase.classes.map((techClass) => (
                            <li
                                key={techClass}
                                className="typo-platform-diagram-cell-semibold text-foreground rounded-paper bg-[color-mix(in_srgb,var(--flow-f)_8%,var(--color-platform-panel))] px-1 py-2.25 text-center"
                            >
                                {techClass}
                            </li>
                        ))}
                    </ul>
                    <p className="typo-platform-diagram-small-regular text-label-foreground px-3.5 pb-3.5">
                        {analysis.techDatabase.description}
                    </p>
                </div>
                {/* 굵은 짧은 문장이라 <p> 면 WAVE 'Possible heading' 으로 잡혀 div 로 둔다(제목이 아니라 DB 설명). */}
                <div className="typo-platform-diagram-note-bold text-foreground mt-4 text-center text-balance">
                    {analysis.noteLines.map((line) => (
                        <span key={line} className="block">
                            {line}
                        </span>
                    ))}
                </div>
            </div>
        </PlatformReveal>
        <FlowArrow />

        {/* 결과 — 보고서 아이콘 상자 · 이름 · 제공 정보 태그(PC 는 세로로 꽉 찬 태그). */}
        <PlatformReveal className="grid justify-items-center gap-2 text-center xl:w-50 xl:shrink-0">
            <span
                aria-hidden="true"
                className="shadow-tint-raised mb-1.5 grid size-27 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--flow-f)_10%,var(--color-platform-panel))] ring-1 ring-[color-mix(in_srgb,var(--flow-f)_16%,var(--color-platform-panel-border))] xl:size-24 [&_img]:size-15 xl:[&_img]:size-13.5"
            >
                <ThemeImage light={kBigxReportIcon} dark={kBigxReportDarkIcon} />
            </span>
            <strong className="typo-platform-diagram-end-extrabold text-foreground break-keep">
                {analysis.result.titleLead} <span className="whitespace-nowrap">{analysis.result.titleKeep}</span>
            </strong>
            <ul
                aria-label={analysis.result.tagsLabel}
                className="flex max-w-130 flex-wrap justify-center gap-1.5 xl:flex-col xl:items-stretch"
            >
                {analysis.result.tags.map((tag) => (
                    <li
                        key={tag}
                        className="typo-platform-diagram-small-bold inline-flex h-7.5 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--flow-f)_28%,var(--color-platform-panel-border))] bg-[color-mix(in_srgb,var(--flow-f)_10%,var(--color-platform-panel))] px-3 whitespace-nowrap text-(--flow-f)"
                    >
                        {tag}
                    </li>
                ))}
            </ul>
        </PlatformReveal>
    </div>
)

export {PlatformKBigxAnalysisDiagram}
export type {PlatformKBigxAnalysis, PlatformKBigxDatabase}
