'use client'

import {useEffect, useRef, useState, type ComponentPropsWithoutRef} from 'react'
import {useTheme} from 'next-themes'
import type {Core, ElementDefinition, NodeSingular, StylesheetJson} from 'cytoscape'
import {cn} from '@/lib/utils'

type CompanyRiskStatus = 'alert' | 'attention' | 'closed' | 'danger' | 'good' | 'high-risk' | 'normal' | 'poor'
type SectorIcon =
    'construction' | 'education' | 'finance' | 'food' | 'information' | 'management' | 'manufacturing' | 'retail'

type RelatedCompany = {
    id: string
    label: string
    businessNumber: string
    relationCode: string
    relationLabel: string
    status: CompanyRiskStatus
}

type CompanySector = {
    id: string
    label: string
    icon: SectorIcon
    companies: RelatedCompany[]
}

type CompanyRelationshipGraphProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    companyName: string
    sectors: CompanySector[]
    ariaLabel: string
}

type TooltipState = {text: string; x: number; y: number}
type KeyboardTarget = TooltipState & {id: string; size: number}

const LUCIDE_ICON_MARKUP: Record<SectorIcon | 'analysis', string> = {
    analysis:
        '<path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>',
    construction:
        '<path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>',
    education:
        '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    finance:
        '<path d="M10 18v-7"/><path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>',
    food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    information:
        '<path d="M16.247 7.761a6 6 0 0 1 0 8.478"/><path d="M19.075 4.933a10 10 0 0 1 0 14.134"/><path d="M4.925 19.067a10 10 0 0 1 0-14.134"/><path d="M7.753 16.239a6 6 0 0 1 0-8.478"/><circle cx="12" cy="12" r="2"/>',
    management:
        '<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>',
    manufacturing:
        '<path d="M12 16h.01"/><path d="M16 16h.01"/><path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M8 16h.01"/>',
    retail: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
}

const createLucideDataUri = (icon: SectorIcon | 'analysis', color: string) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${LUCIDE_ICON_MARKUP[icon]}</svg>`,
    )}`

const STATUS_LABELS: Record<CompanyRiskStatus, string> = {
    alert: '경보',
    attention: '관심',
    closed: '휴업/폐업/청산',
    danger: '위험',
    good: '유보',
    'high-risk': '고위험',
    normal: '정상',
    poor: '부도',
}

const CENTER = {x: 360, y: 250}
const SECTOR_RADIUS = 116
const COMPANY_RADIUS = 220

const positionAt = (angle: number, radius: number) => ({
    x: CENTER.x + Math.cos(angle) * radius,
    y: CENTER.y + Math.sin(angle) * radius,
})

const readColor = (token: string, probe: HTMLElement) => {
    probe.style.color = `var(${token})`
    return getComputedStyle(probe).color
}

const getStatusColor = (status: unknown, colors: Record<CompanyRiskStatus, string>, fallback: string) => {
    switch (status) {
        case 'alert':
        case 'attention':
        case 'closed':
        case 'danger':
        case 'good':
        case 'high-risk':
        case 'normal':
        case 'poor':
            return colors[status]
        default:
            return fallback
    }
}

const truncateLabel = (label: string, maximumLength: number) => {
    const characters = Array.from(label)
    return characters.length > maximumLength ? `${characters.slice(0, maximumLength).join('')}…` : label
}

const CompanyRelationshipGraph = ({
    companyName,
    sectors,
    ariaLabel,
    className,
    ...props
}: CompanyRelationshipGraphProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [tooltip, setTooltip] = useState<TooltipState>()
    const [keyboardTargets, setKeyboardTargets] = useState<KeyboardTarget[]>([])
    const {resolvedTheme} = useTheme()

    useEffect(() => {
        const container = containerRef.current
        if (!container || !resolvedTheme) return

        let cancelled = false
        let graph: Core | undefined
        let resizeObserver: ResizeObserver | undefined

        const renderGraph = async () => {
            const {default: cytoscape} = await import('cytoscape')
            if (cancelled || !containerRef.current) return

            const probe = document.createElement('span')
            containerRef.current.appendChild(probe)
            const colors = {
                background: readColor('--ds-background', probe),
                border: readColor('--ds-border', probe),
                foreground: readColor('--ds-foreground', probe),
                subtle: readColor('--ds-foreground-subtle', probe),
                muted: readColor('--ds-muted', probe),
                primary: readColor('--ds-chart-4', probe),
                primaryForeground: readColor('--ds-primary-foreground', probe),
                alert: readColor('--ds-warning', probe),
                attention: readColor('--ds-chart-3', probe),
                closed: readColor('--ds-chart-5', probe),
                danger: readColor('--ds-error', probe),
                good: readColor('--ds-success', probe),
                highRisk: readColor('--ds-destructive', probe),
                normal: readColor('--ds-chart-2', probe),
                poor: readColor('--ds-chart-1', probe),
            }
            probe.remove()

            const statusColors: Record<CompanyRiskStatus, string> = {
                alert: colors.alert,
                attention: colors.attention,
                closed: colors.closed,
                danger: colors.danger,
                good: colors.good,
                'high-risk': colors.highRisk,
                normal: colors.normal,
                poor: colors.poor,
            }
            const getFitPadding = () => (container.clientWidth < 640 ? 20 : 44)
            const elements: ElementDefinition[] = [
                {
                    data: {
                        id: 'analysis-company',
                        label: companyName,
                        displayLabel: truncateLabel(companyName, 14),
                        tooltip: `${companyName} - 분석 대상 기업`,
                        iconUrl: createLucideDataUri('analysis', colors.primaryForeground),
                    },
                    position: CENTER,
                    classes: 'analysis',
                },
            ]
            sectors.forEach((sector, sectorIndex) => {
                const sectorAngle = -Math.PI / 2 + (sectorIndex * Math.PI * 2) / Math.max(sectors.length, 1)
                const sectorPosition = positionAt(sectorAngle, SECTOR_RADIUS)
                const sectorNodeId = `sector-${sector.id}`
                const sectorGap = (Math.PI * 2) / Math.max(sectors.length, 1)

                elements.push(
                    {
                        data: {
                            id: sectorNodeId,
                            label: sector.label,
                            displayLabel: truncateLabel(sector.label, 9),
                            tooltip: `${sector.label} 섹터 - 연계기업 분포 섹터`,
                            iconUrl: createLucideDataUri(sector.icon, colors.subtle),
                        },
                        position: sectorPosition,
                        classes: 'sector',
                    },
                    {
                        data: {id: `analysis-${sector.id}`, source: 'analysis-company', target: sectorNodeId},
                        classes: 'sector-link',
                    },
                )

                sector.companies.forEach((company, companyIndex) => {
                    const companiesPerBand = 3
                    const bandIndex = Math.floor(companyIndex / companiesPerBand)
                    const indexInBand = companyIndex % companiesPerBand
                    const bandItemCount = Math.min(
                        companiesPerBand,
                        sector.companies.length - bandIndex * companiesPerBand,
                    )
                    const companyAngleStep = Math.min(0.32, (sectorGap * 0.75) / Math.max(bandItemCount, 1))
                    const offset = (indexInBand - (bandItemCount - 1) / 2) * companyAngleStep
                    const companyAngle = sectorAngle + offset
                    const companyPosition = positionAt(companyAngle, COMPANY_RADIUS + bandIndex * 64)

                    elements.push(
                        {
                            data: {
                                id: `company-${company.id}`,
                                label: company.label,
                                displayLabel: truncateLabel(company.label, 10),
                                status: company.status,
                                tooltip: `${company.label} - EW: ${STATUS_LABELS[company.status]} / 유형${company.relationCode} : ${company.relationLabel}`,
                            },
                            position: companyPosition,
                            classes: 'company',
                        },
                        {
                            data: {
                                id: `relationship-${sector.id}-${company.id}`,
                                source: sectorNodeId,
                                target: `company-${company.id}`,
                                label: company.relationCode,
                            },
                            classes: 'relationship',
                        },
                    )
                })
            })

            const stylesheet: StylesheetJson = [
                {
                    selector: 'node',
                    style: {
                        label: 'data(displayLabel)',
                        color: colors.foreground,
                        'font-size': 11,
                        'font-weight': 600,
                        'text-wrap': 'wrap',
                        'text-max-width': '88px',
                        'text-valign': 'bottom',
                        'text-margin-y': 8,
                        'text-outline-color': colors.background,
                        'text-outline-width': 3,
                        'overlay-opacity': 0,
                    },
                },
                {
                    selector: 'node.analysis',
                    style: {
                        width: 82,
                        height: 82,
                        'background-color': colors.primary,
                        'border-color': colors.background,
                        'border-width': 4,
                        'outline-color': colors.primary,
                        'outline-width': 5,
                        'outline-offset': 2,
                        'background-image': 'data(iconUrl)',
                        'background-width': '42%',
                        'background-height': '42%',
                        'background-fit': 'none',
                        'background-repeat': 'no-repeat',
                        'background-position-x': '50%',
                        'background-position-y': '50%',
                        color: colors.foreground,
                        'font-size': 12,
                        'font-weight': 700,
                        'text-margin-y': 15,
                    },
                },
                {
                    selector: 'node.sector',
                    style: {
                        width: 48,
                        height: 48,
                        'background-color': colors.muted,
                        'border-color': colors.border,
                        'border-width': 1.5,
                        'background-image': 'data(iconUrl)',
                        'background-width': '46%',
                        'background-height': '46%',
                        'background-fit': 'none',
                        'background-repeat': 'no-repeat',
                        'background-position-x': '50%',
                        'background-position-y': '50%',
                        color: colors.foreground,
                        'font-size': 10,
                        'font-weight': 700,
                        'text-valign': 'bottom',
                        'text-margin-y': 9,
                        'text-outline-width': 3,
                    },
                },
                {
                    selector: 'node.company',
                    style: {
                        width: 30,
                        height: 30,
                        'background-color': (element: NodeSingular) =>
                            getStatusColor(element.data('status'), statusColors, colors.normal),
                        'border-color': colors.background,
                        'border-width': 3,
                    },
                },
                {
                    selector: 'edge',
                    style: {
                        width: 1.3,
                        'line-color': colors.border,
                        'curve-style': 'straight',
                        'overlay-opacity': 0,
                    },
                },
                {
                    selector: 'edge.sector-link',
                    style: {
                        'line-color': colors.subtle,
                        'line-style': 'dashed',
                    },
                },
                {
                    selector: 'edge.relationship',
                    style: {
                        label: 'data(label)',
                        color: colors.subtle,
                        'font-size': 10,
                        'font-weight': 700,
                        'text-background-color': colors.background,
                        'text-background-opacity': 0.95,
                        'text-background-padding': '3px',
                        'text-rotation': 'none',
                    },
                },
                {
                    selector: 'node:active, node:selected',
                    style: {'border-color': colors.foreground, 'border-width': 3},
                },
            ]

            graph = cytoscape({
                container: containerRef.current,
                elements,
                style: stylesheet,
                minZoom: 0.35,
                maxZoom: 2,
                boxSelectionEnabled: false,
                autoungrabify: false,
                layout: {name: 'preset', fit: true, padding: getFitPadding()},
            })
            const analysisNode = graph.$id('analysis-company')
            graph.center(analysisNode)
            analysisNode.lock()
            graph.nodes('.sector').lock()

            let positionFrame: number | undefined
            const updateKeyboardTargets = () => {
                if (!graph || cancelled) return
                setKeyboardTargets(
                    graph.nodes().map((node) => {
                        const position = node.renderedPosition()
                        return {
                            id: node.id(),
                            text: String(node.data('tooltip')),
                            x: position.x,
                            y: position.y,
                            size: node.renderedWidth() + 12,
                        }
                    }),
                )
            }
            const scheduleKeyboardTargetUpdate = () => {
                if (positionFrame !== undefined) cancelAnimationFrame(positionFrame)
                positionFrame = requestAnimationFrame(updateKeyboardTargets)
            }
            graph.on('position pan zoom', scheduleKeyboardTargetUpdate)
            scheduleKeyboardTargetUpdate()

            graph.on('mouseover', 'node', (event) => {
                const node = event.target
                const position = node.renderedPosition()
                const tooltipText = node.data('tooltip')
                if (typeof tooltipText === 'string') setTooltip({text: tooltipText, x: position.x, y: position.y})
                if (!node.locked()) container.style.cursor = 'grab'
            })
            graph.on('mouseout', 'node', () => {
                setTooltip(undefined)
                container.style.cursor = ''
            })
            graph.on('grab', 'node', (event) => {
                if (!event.target.locked()) container.style.cursor = 'grabbing'
                setTooltip(undefined)
            })
            graph.on('free', 'node', () => {
                container.style.cursor = 'grab'
            })

            resizeObserver = new ResizeObserver(() => {
                graph?.resize()
                graph?.fit(undefined, getFitPadding())
                const centerNode = graph?.$id('analysis-company')
                if (centerNode?.length) graph?.center(centerNode)
                scheduleKeyboardTargetUpdate()
            })
            resizeObserver.observe(containerRef.current)

            return () => {
                if (positionFrame !== undefined) cancelAnimationFrame(positionFrame)
            }
        }

        let cleanupRenderedGraph: (() => void) | undefined
        void renderGraph().then((cleanup) => {
            cleanupRenderedGraph = cleanup
        })

        return () => {
            cancelled = true
            cleanupRenderedGraph?.()
            resizeObserver?.disconnect()
            graph?.destroy()
            setTooltip(undefined)
            setKeyboardTargets([])
        }
    }, [ariaLabel, companyName, resolvedTheme, sectors])

    return (
        <div {...props} className={cn('relative min-w-0 overflow-hidden', className)}>
            <div ref={containerRef} role="img" aria-label={ariaLabel} className="h-100 w-full sm:h-125" />
            {keyboardTargets.map((target) => (
                <button
                    key={target.id}
                    type="button"
                    className="focus-visible:outline-primary pointer-events-none absolute z-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-transparent bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{left: target.x, top: target.y, width: target.size, height: target.size}}
                    onFocus={() => setTooltip(target)}
                    onBlur={() => setTooltip(undefined)}
                    aria-label={target.text}
                >
                    <span className="sr-only">{target.text}</span>
                </button>
            ))}
            {tooltip ? (
                <div
                    className="border-border bg-popover text-popover-foreground pointer-events-none absolute z-10 max-w-60 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-md border px-3 py-2 text-xs font-medium shadow-md"
                    style={{left: tooltip.x, top: tooltip.y}}
                    role="tooltip"
                >
                    {tooltip.text}
                </div>
            ) : null}
            <div className="sr-only">
                <p>{ariaLabel}</p>
                <p>{companyName} - 분석 대상 기업</p>
                <ul>
                    {sectors.map((sector) => (
                        <li key={sector.id}>
                            {sector.label} 섹터 - 연계기업 분포 섹터
                            <ul>
                                {sector.companies.map((company) => (
                                    <li key={company.id}>
                                        {company.label}, 사업자번호 {company.businessNumber}, EW{' '}
                                        {STATUS_LABELS[company.status]}, 유형{company.relationCode}{' '}
                                        {company.relationLabel}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export {CompanyRelationshipGraph}
export type {CompanyRelationshipGraphProps, CompanyRiskStatus, CompanySector, RelatedCompany, SectorIcon}
