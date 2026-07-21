'use client'

import {useEffect, useRef, useState, type ComponentPropsWithoutRef} from 'react'
import {useTheme} from 'next-themes'
import type {Core, EdgeSingular, ElementDefinition, NodeSingular, StylesheetJson} from 'cytoscape'
import {cn} from '@/lib/utils'

type NetworkNodeStatus = 'closed' | 'danger' | 'interest' | 'normal'

type NetworkNode = {
    id: string
    label: string
    kind: 'analysis' | 'company' | 'industry'
    status: NetworkNodeStatus
    weight: number
    icon?: string
}

type NetworkLink = {
    id: string
    source: string
    target: string
    ratio: number
}

type NetworkGraphProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    nodes: NetworkNode[]
    links: NetworkLink[]
    ariaLabel: string
}

type TooltipState = {text: string; x: number; y: number}
type KeyboardTarget = TooltipState & {id: string; size: number}

const STATUS_LABELS: Record<NetworkNodeStatus, string> = {
    closed: '폐업',
    danger: '위험',
    interest: '관심',
    normal: '정상',
}

const NETWORK_ICON_MARKUP: Record<string, string> = {
    analysis:
        '<path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>',
    food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    information:
        '<path d="M16.247 7.761a6 6 0 0 1 0 8.478"/><path d="M19.075 4.933a10 10 0 0 1 0 14.134"/><path d="M4.925 19.067a10 10 0 0 1 0-14.134"/><path d="M7.753 16.239a6 6 0 0 1 0-8.478"/><circle cx="12" cy="12" r="2"/>',
    rental: '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    science:
        '<path d="M14.4 2 20 7.6"/><path d="m8.6 8.6 6.8 6.8"/><path d="m17 4 3-3"/><path d="M9.6 11.6 4 17.2"/><circle cx="5" cy="19" r="3"/><path d="m14 7 3-3"/>',
    construction:
        '<path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>',
    education:
        '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    finance:
        '<path d="M10 18v-7"/><path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>',
    manufacturing:
        '<path d="M12 16h.01"/><path d="M16 16h.01"/><path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M8 16h.01"/>',
    retail: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    transport:
        '<path d="M10 17h4V5H2v12h3"/><path d="M14 9h4l4 4v4h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>',
}

const createLucideDataUri = (icon: string, color: string) => {
    const markup = NETWORK_ICON_MARKUP[icon]
    if (!markup) return undefined
    return `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${markup}</svg>`,
    )}`
}

const CENTER = {x: 360, y: 250}
const BASE_INDUSTRY_RADIUS = 164
const INDUSTRY_ARC_GAP = 92
const DENSE_BAND_RADIUS_GAP = 48
const DENSE_COMPANY_RADIUS_GAP = 40
const COMPANY_RADIUS_GAP = 148
const COMPANY_BAND_GAP = 64
const COMPANIES_PER_BAND = 3

const positionAt = (angle: number, radius: number) => ({
    x: CENTER.x + Math.cos(angle) * radius,
    y: CENTER.y + Math.sin(angle) * radius,
})

const getIndustryRadius = (branchCount: number, maximumCompanyCount: number) => {
    const countBasedRadius = Math.max(BASE_INDUSTRY_RADIUS, Math.ceil((branchCount * INDUSTRY_ARC_GAP) / (Math.PI * 2)))
    const companyBandCount = Math.max(1, Math.ceil(maximumCompanyCount / COMPANIES_PER_BAND))
    const companyDensityRadius = Math.max(0, maximumCompanyCount - COMPANIES_PER_BAND) * DENSE_COMPANY_RADIUS_GAP
    return countBasedRadius + (companyBandCount - 1) * DENSE_BAND_RADIUS_GAP + companyDensityRadius
}

const getCompanyLabelRadiusExtension = (label: string) => {
    const characterCount = Array.from(label).length
    return Math.min(80, Math.max(0, characterCount - 5) * 10)
}

const truncateLabel = (label: string, maximumLength: number) => {
    const characters = Array.from(label)
    return characters.length > maximumLength ? `${characters.slice(0, maximumLength).join('')}…` : label
}

const getWeightedBranchLayout = (weights: number[]) => {
    const normalizedWeights = weights.map((weight) => Math.max(1, weight))
    const totalWeight = normalizedWeights.reduce((total, weight) => total + weight, 0)
    const spans = normalizedWeights.map((weight) => (Math.PI * 2 * weight) / Math.max(totalWeight, 1))
    let cursor = -Math.PI / 2 - (spans[0] ?? Math.PI * 2) / 2
    const angles = spans.map((span) => {
        const angle = cursor + span / 2
        cursor += span
        return angle
    })
    return {angles, spans}
}

const readColor = (token: string, probe: HTMLElement) => {
    probe.style.color = `var(${token})`
    return getComputedStyle(probe).color
}

const NetworkGraph = ({nodes, links, ariaLabel, className, ...props}: NetworkGraphProps) => {
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
            const [{default: cytoscape}, {default: fcose}] = await Promise.all([
                import('cytoscape'),
                import('cytoscape-fcose'),
            ])
            if (cancelled || !containerRef.current) return

            cytoscape.use(fcose)

            const probe = document.createElement('span')
            containerRef.current.appendChild(probe)
            const colors = {
                background: readColor('--ds-background', probe),
                foreground: readColor('--ds-foreground', probe),
                subtle: readColor('--ds-foreground-subtle', probe),
                border: readColor('--ds-border', probe),
                muted: readColor('--ds-muted', probe),
                primary: readColor('--ds-chart-4', probe),
                primaryForeground: readColor('--ds-primary-foreground', probe),
                closed: readColor('--ds-chart-5', probe),
                danger: readColor('--ds-error', probe),
                interest: readColor('--ds-chart-3', probe),
                normal: readColor('--ds-chart-1', probe),
            }
            const statusColors: Record<string, string> = {
                closed: colors.closed,
                danger: colors.danger,
                interest: colors.interest,
                normal: colors.normal,
            }
            probe.remove()

            const elements: ElementDefinition[] = [
                ...nodes.map((node) => ({
                    data: {
                        ...node,
                        displayLabel: truncateLabel(
                            node.label,
                            node.kind === 'analysis' ? 14 : node.kind === 'industry' ? 9 : 10,
                        ),
                        tooltip: (() => {
                            if (node.kind === 'analysis') return `${node.label} / 분석 대상 기업`
                            const incomingLink = links.find((link) => link.target === node.id)
                            if (node.kind === 'industry') {
                                const companyCount = links.filter((link) => link.source === node.id).length
                                return `${node.label}업종 / 비중 : ${incomingLink?.ratio.toFixed(2) ?? '0.00'}% / 거래기업 : ${companyCount}개`
                            }
                            return `${node.label} / 상태 : ${STATUS_LABELS[node.status]} / 매출비중: ${incomingLink?.ratio.toFixed(2) ?? '0.00'}%`
                        })(),
                        iconUrl: createLucideDataUri(
                            node.kind === 'analysis' ? 'analysis' : (node.icon ?? ''),
                            node.kind === 'analysis' ? colors.primaryForeground : colors.subtle,
                        ),
                    },
                    classes: node.kind,
                })),
                ...links.map((link) => {
                    const sourceKind = nodes.find((node) => node.id === link.source)?.kind ?? 'unknown'
                    const targetKind = nodes.find((node) => node.id === link.target)?.kind ?? 'unknown'
                    const siblingIndex =
                        sourceKind === 'industry' && targetKind === 'company'
                            ? links.filter(({source}) => source === link.source).findIndex(({id}) => id === link.id)
                            : 0

                    return {
                        data: {
                            ...link,
                            label: `${link.ratio.toFixed(2)}%`,
                            labelOffset: 38 + siblingIndex * 22,
                            labelMargin: ((siblingIndex % 3) - 1) * 8,
                        },
                        classes: `${sourceKind}-to-${targetKind}`,
                    }
                }),
            ]

            const stylesheet: StylesheetJson = [
                {
                    selector: 'node',
                    style: {
                        width: 'mapData(weight, 1, 100, 20, 48)',
                        height: 'mapData(weight, 1, 100, 20, 48)',
                        'background-color': (element: NodeSingular) =>
                            statusColors[element.data('status')] ?? colors.normal,
                        'border-color': colors.background,
                        'border-width': 3,
                        label: 'data(displayLabel)',
                        color: colors.foreground,
                        'font-size': 11,
                        'font-weight': 600,
                        'text-wrap': 'wrap',
                        'text-max-width': '92px',
                        'text-valign': 'bottom',
                        'text-margin-y': 8,
                        'text-outline-color': colors.background,
                        'text-outline-width': 3,
                        'overlay-opacity': 0,
                    },
                },
                {
                    selector: 'node.industry',
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
                        'text-valign': 'bottom',
                        'text-margin-y': 15,
                    },
                },
                {
                    selector: 'node.industry-above',
                    style: {
                        'text-valign': 'top',
                        'text-halign': 'center',
                        'text-margin-y': -9,
                    },
                },
                {
                    selector: 'node.industry-below',
                    style: {
                        'text-valign': 'bottom',
                        'text-halign': 'center',
                        'text-margin-y': 9,
                    },
                },
                {
                    selector: 'node.industry-left',
                    style: {
                        'text-valign': 'center',
                        'text-halign': 'left',
                        'text-margin-x': -9,
                        'text-margin-y': 0,
                    },
                },
                {
                    selector: 'node.industry-right',
                    style: {
                        'text-valign': 'center',
                        'text-halign': 'right',
                        'text-margin-x': 9,
                        'text-margin-y': 0,
                    },
                },
                {
                    selector: 'node.company-above',
                    style: {
                        'text-valign': 'top',
                        'text-margin-y': -8,
                    },
                },
                {
                    selector: 'node.company-below',
                    style: {
                        'text-valign': 'bottom',
                        'text-margin-y': 8,
                    },
                },
                {
                    selector: 'edge',
                    style: {
                        width: 1.5,
                        'line-color': colors.border,
                        'curve-style': 'bezier',
                        label: 'data(label)',
                        color: colors.subtle,
                        'font-size': 10,
                        'font-weight': 600,
                        'text-background-color': colors.background,
                        'text-background-opacity': 0.92,
                        'text-background-padding': '3px',
                        'text-rotation': 'none',
                        'text-margin-y': -7,
                        'overlay-opacity': 0,
                    },
                },
                {
                    selector: 'edge.analysis-to-industry',
                    style: {
                        'line-style': 'dashed',
                        label: '',
                        'source-label': 'data(label)',
                        'source-text-offset': 82,
                        'source-text-rotation': 'none',
                        'source-text-margin-y': -7,
                    },
                },
                {
                    selector: 'edge.industry-to-company',
                    style: {
                        label: '',
                        'source-label': 'data(label)',
                        'source-text-offset': (edge: EdgeSingular) => Number(edge.data('labelOffset')),
                        'source-text-rotation': 'autorotate',
                        'source-text-margin-y': (edge: EdgeSingular) => Number(edge.data('labelMargin')),
                    },
                },
                {
                    selector: 'node:selected',
                    style: {
                        'border-color': colors.foreground,
                        'border-width': 3,
                    },
                },
            ]

            graph = cytoscape({
                container: containerRef.current,
                elements,
                style: stylesheet,
                minZoom: 0.25,
                maxZoom: 2,
                boxSelectionEnabled: false,
            })

            const analysisNode = nodes.find((node) => node.kind === 'analysis')
            if (!analysisNode) {
                const fallbackLayout = {name: 'fcose', animate: false, fit: true, padding: 48}
                graph.layout(fallbackLayout).run()
                return
            }

            const firstLevelLinks = links.filter((link) => link.source === analysisNode.id)
            const branchCount = Math.max(1, firstLevelLinks.length)
            const baseIndustryRadius = getIndustryRadius(branchCount, 0)
            const baseCompanyRadius = baseIndustryRadius + COMPANY_RADIUS_GAP
            const branchWeights = firstLevelLinks.map((branchLink) => {
                const branchNode = nodes.find((node) => node.id === branchLink.target)
                if (branchNode?.kind !== 'industry') return 1
                const companyCount = links.filter((link) => link.source === branchNode.id).length
                return Math.max(1, Math.ceil(companyCount / COMPANIES_PER_BAND))
            })
            const {angles: branchAngles, spans: branchAngleSpans} = getWeightedBranchLayout(branchWeights)
            const positions = new Map<string, {x: number; y: number}>([[analysisNode.id, CENTER]])

            firstLevelLinks.forEach((branchLink, branchIndex) => {
                const branchNode = nodes.find((node) => node.id === branchLink.target)
                if (!branchNode) return

                const branchAngle = branchAngles[branchIndex] ?? -Math.PI / 2
                const branchAngleSpan = branchAngleSpans[branchIndex] ?? (Math.PI * 2) / branchCount
                const companyLinks =
                    branchNode.kind === 'industry' ? links.filter((link) => link.source === branchNode.id) : []
                const branchIndustryRadius = getIndustryRadius(branchCount, companyLinks.length)
                const branchCompanyRadius = branchIndustryRadius + COMPANY_RADIUS_GAP
                const branchRadius =
                    branchNode.kind === 'industry'
                        ? branchIndustryRadius
                        : baseCompanyRadius + getCompanyLabelRadiusExtension(branchNode.label)
                positions.set(branchNode.id, positionAt(branchAngle, branchRadius))

                if (branchNode.kind !== 'industry') return
                companyLinks.forEach((companyLink, companyIndex) => {
                    const bandIndex = Math.floor(companyIndex / COMPANIES_PER_BAND)
                    const indexInBand = companyIndex % COMPANIES_PER_BAND
                    const bandItemCount = Math.min(
                        COMPANIES_PER_BAND,
                        companyLinks.length - bandIndex * COMPANIES_PER_BAND,
                    )
                    const companyAngleStep = Math.min(0.4, (branchAngleSpan * 0.88) / Math.max(bandItemCount, 1))
                    const bandRotationDirection = branchIndex % 2 === 0 ? 1 : -1
                    const bandRotation = bandIndex % 2 === 0 ? 0 : companyAngleStep * 0.5 * bandRotationDirection
                    const offset = (indexInBand - (bandItemCount - 1) / 2) * companyAngleStep + bandRotation
                    const companyAngle = branchAngle + offset
                    const companyNode = nodes.find((node) => node.id === companyLink.target)
                    const labelRadiusExtension = companyNode ? getCompanyLabelRadiusExtension(companyNode.label) : 0
                    positions.set(
                        companyLink.target,
                        positionAt(
                            companyAngle,
                            branchCompanyRadius + bandIndex * COMPANY_BAND_GAP + labelRadiusExtension,
                        ),
                    )
                })
            })

            graph.nodes().positions((node) => positions.get(node.id()) ?? CENTER)
            graph.nodes('.industry').forEach((node) => {
                const position = positions.get(node.id()) ?? CENTER
                const horizontalDistance = position.x - CENTER.x
                const verticalDistance = position.y - CENTER.y
                if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
                    node.addClass(horizontalDistance < 0 ? 'industry-left' : 'industry-right')
                    return
                }
                node.addClass(verticalDistance < 0 ? 'industry-above' : 'industry-below')
            })
            graph.nodes('.company').forEach((node) => {
                const position = positions.get(node.id()) ?? CENTER
                const isAboveCenter = position.y < CENTER.y
                node.addClass(isAboveCenter ? 'company-above' : 'company-below')
            })
            const getFitPadding = () => (container.clientWidth < 640 ? 36 : 72)
            graph.layout({name: 'preset', animate: false, fit: true, padding: getFitPadding()}).run()
            graph.$id(analysisNode.id).lock()
            graph.nodes('.industry').lock()

            let positionFrame: number | undefined
            const hierarchicalNodeIds = [
                analysisNode.id,
                ...firstLevelLinks.flatMap((branchLink) => {
                    const branchNode = nodes.find((node) => node.id === branchLink.target)
                    if (branchNode?.kind !== 'industry') return [branchLink.target]
                    return [
                        branchLink.target,
                        ...links.filter((link) => link.source === branchLink.target).map((link) => link.target),
                    ]
                }),
            ]
            const hierarchicalNodeIdSet = new Set(hierarchicalNodeIds)
            hierarchicalNodeIds.push(...nodes.filter(({id}) => !hierarchicalNodeIdSet.has(id)).map(({id}) => id))
            const updateKeyboardTargets = () => {
                if (!graph || cancelled) return
                setKeyboardTargets(
                    hierarchicalNodeIds.flatMap((nodeId) => {
                        const node = graph?.$id(nodeId)
                        if (!node?.length) return []
                        const position = node.renderedPosition()
                        return [
                            {
                                id: node.id(),
                                text: String(node.data('tooltip')),
                                x: position.x,
                                y: position.y,
                                size: node.renderedWidth() + 12,
                            },
                        ]
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
            })
            graph.on('mouseout', 'node', () => setTooltip(undefined))

            resizeObserver = new ResizeObserver(() => {
                graph?.resize()
                graph?.fit(graph.elements(), getFitPadding())
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
    }, [ariaLabel, links, nodes, resolvedTheme])

    return (
        <div {...props} className={cn('relative min-w-0 overflow-hidden', className)}>
            <div ref={containerRef} role="img" aria-label={ariaLabel} className="h-120 w-full" />
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
                    className="border-border bg-popover text-popover-foreground pointer-events-none absolute z-10 max-w-72 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-md border px-3 py-2 text-xs font-medium shadow-md"
                    style={{left: tooltip.x, top: tooltip.y}}
                    role="tooltip"
                >
                    {tooltip.text}
                </div>
            ) : null}
            <div className="sr-only">
                <p>{ariaLabel}</p>
                <ul>
                    {links.map((link) => {
                        const source = nodes.find((node) => node.id === link.source)?.label ?? link.source
                        const target = nodes.find((node) => node.id === link.target)?.label ?? link.target
                        return (
                            <li key={link.id}>
                                {source}에서 {target} 연결 비중 {link.ratio.toFixed(2)}%
                            </li>
                        )
                    })}
                </ul>
                <p>
                    상태 범례:{' '}
                    {Object.entries(STATUS_LABELS)
                        .map(([status, label]) => `${label} ${nodes.filter((node) => node.status === status).length}개`)
                        .join(', ')}
                </p>
            </div>
        </div>
    )
}

export {NetworkGraph}
export type {NetworkGraphProps, NetworkLink, NetworkNode, NetworkNodeStatus}
