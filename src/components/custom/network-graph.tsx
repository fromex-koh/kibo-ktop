'use client'

import {useEffect, useRef, type ComponentPropsWithoutRef} from 'react'
import {useTheme} from 'next-themes'
import type {Core, ElementDefinition, NodeSingular, StylesheetJson} from 'cytoscape'
import {cn} from '@/lib/utils'

type NetworkNodeStatus = 'closed' | 'danger' | 'interest' | 'normal'

type NetworkNode = {
    id: string
    label: string
    kind: 'company' | 'industry'
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

const STATUS_LABELS: Record<NetworkNodeStatus, string> = {
    closed: '폐업',
    danger: '위험',
    interest: '관심',
    normal: '정상',
}

const readColor = (token: string, probe: HTMLElement) => {
    probe.style.color = `var(${token})`
    return getComputedStyle(probe).color
}

const NetworkGraph = ({nodes, links, ariaLabel, className, ...props}: NetworkGraphProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const {resolvedTheme} = useTheme()

    useEffect(() => {
        const container = containerRef.current
        if (!container || !resolvedTheme) return

        let cancelled = false
        let graph: Core | undefined

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
                closed: readColor('--ds-chart-5', probe),
                danger: readColor('--ds-error', probe),
                interest: readColor('--ds-chart-3', probe),
                normal: readColor('--ds-chart-1', probe),
                industry: readColor('--ds-chart-3', probe),
                industryForeground: readColor('--ds-primary-foreground', probe),
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
                        displayLabel: node.kind === 'industry' ? `${node.icon ?? ''}\n${node.label}` : node.label,
                    },
                    classes: node.kind,
                })),
                ...links.map((link) => ({
                    data: {...link, label: `${link.ratio.toFixed(2)}%`},
                })),
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
                        'text-valign': 'top',
                        'text-margin-y': -12,
                        'text-outline-color': colors.background,
                        'text-outline-width': 3,
                        'overlay-opacity': 0,
                    },
                },
                {
                    selector: 'node.industry',
                    style: {
                        width: 64,
                        height: 64,
                        'background-color': colors.industry,
                        'border-color': colors.industry,
                        'border-width': 3,
                        'outline-color': colors.industry,
                        'outline-width': 2,
                        'outline-offset': 5,
                        color: colors.industryForeground,
                        'font-size': 12,
                        'font-weight': 700,
                        'text-valign': 'center',
                        'text-margin-y': 0,
                        'text-outline-width': 0,
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
                        'text-rotation': 'autorotate',
                        'overlay-opacity': 0,
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
                minZoom: 0.55,
                maxZoom: 2,
                boxSelectionEnabled: false,
            })

            const layoutOptions = {
                name: 'fcose',
                animate: false,
                randomize: true,
                quality: 'default',
                nodeRepulsion: 7200,
                idealEdgeLength: 105,
                nodeSeparation: 55,
                gravity: 0.4,
                fit: true,
                padding: 48,
            }
            graph.layout(layoutOptions).run()
        }

        void renderGraph()

        return () => {
            cancelled = true
            graph?.destroy()
        }
    }, [links, nodes, resolvedTheme])

    return (
        <div {...props} className={cn('relative', className)}>
            <div ref={containerRef} role="img" aria-label={ariaLabel} className="h-120 w-full" />
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
