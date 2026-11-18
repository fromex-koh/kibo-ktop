import {Fragment} from 'react'
import {Activity, ArrowDownToLine, Award, House, List} from 'lucide-react'
import {PlatformDiagramBadge} from '@/components/custom/platform-diagram-badge'
import {platformDiagramBoxClassName, platformDiagramSurfaceClassName} from '@/components/theme/platform-intro.variants'
import {TECH_INDEX_DIAGRAM} from '@/content/service/platform-technology-evaluation'
import {cn} from '@/lib/utils'

// TechIndexStructureDiagram — 혁신성장역량지수(Tech-Index) 산출 흐름을 글 · 도형으로 그린다(플랫폼 소개 > 기술평가 모형 상세 탭).
// 짜임: 흐름 카드(혁신성장 역량지표 → 4대 혁신역량 2 × 2 → 혁신성장역량지수) | 설명 2줄(태그형 상자).
//   · PC(1280↑) 두 칸 나란히, 1280 미만은 쌓는다.
//   · 흐름 카드는 한 장의 개념도라 role="img" + aria-label 로 한 번에 읽힌다(안쪽 글은 화면용).
// 문구는 content/service/platform-technology-evaluation.ts 의 TECH_INDEX_DIAGRAM.

// 4대 혁신역량 아이콘 — sectors 순서.
const SECTOR_ICONS = [House, ArrowDownToLine, Activity, Award] as const

// 연결선 — 2px 세로선(옅은 테두리 → 강조색 55%) 끝에 꺾쇠 화살촉.
const Connector = () => (
    <span
        aria-hidden="true"
        className="from-platform-panel-border to-platform-accent/55 after:border-platform-accent/55 relative my-1 h-7.5 w-0.5 rounded-xs bg-linear-to-b after:absolute after:bottom-0 after:left-1/2 after:size-2 after:-translate-x-1/2 after:translate-y-px after:rotate-45 after:border-r-2 after:border-b-2"
    />
)

const TechIndexStructureDiagram = () => (
    <div className={cn(platformDiagramSurfaceClassName, 'grid items-center gap-6 xl:grid-cols-2 xl:gap-10')}>
        <div
            role="img"
            aria-label={TECH_INDEX_DIAGRAM.label}
            className={cn(
                platformDiagramBoxClassName,
                'from-platform-accent/7 to-platform-panel grid w-full justify-items-center bg-linear-to-b to-55% px-6 pt-6.5 pb-7',
            )}
        >
            <span className="typo-body-xl-bold bg-platform-panel text-platform-accent-foreground border-platform-accent/22 inline-flex items-center gap-2.5 rounded-md border py-2.5 pr-4.5 pl-2.5 text-center shadow-sm">
                <PlatformDiagramBadge>
                    <List />
                </PlatformDiagramBadge>
                {TECH_INDEX_DIAGRAM.indicators}
            </span>
            <Connector />
            <span className="grid w-full grid-cols-2 gap-2.5">
                {TECH_INDEX_DIAGRAM.sectors.map((sector, index) => {
                    const Icon = SECTOR_ICONS[index] ?? Fragment
                    return (
                        <span
                            key={sector}
                            className="typo-body-l-bold bg-platform-accent/8 text-foreground flex items-center justify-center gap-1.75 rounded-md px-2.5 py-3"
                        >
                            <Icon aria-hidden="true" className="text-platform-accent-foreground size-4.25 shrink-0" />
                            {sector}
                        </span>
                    )
                })}
            </span>
            <Connector />
            <span className="typo-body-xl-bold from-platform-accent-bright to-platform-accent shadow-lift rounded-full bg-linear-135 px-8.5 py-3.25 text-white">
                {TECH_INDEX_DIAGRAM.result}
            </span>
        </div>
        <ul className="grid content-center gap-3">
            {TECH_INDEX_DIAGRAM.notes.map((note) => (
                <li
                    key={note}
                    className="typo-body-xl-medium bg-platform-accent/8 border-platform-accent/18 text-foreground rounded-md border px-4.5 py-3.5 break-keep"
                >
                    {note}
                </li>
            ))}
        </ul>
    </div>
)

export {TechIndexStructureDiagram}
