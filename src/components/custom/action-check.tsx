'use client'

import {useEffect, useRef, type ComponentPropsWithoutRef} from 'react'
import {useTheme} from 'next-themes'
import {cn} from '@/lib/utils'

const ACTION_CHECK_PATH = '/animations/action-check.json'
const ACTION_CHECK_LAST_FRAME = 65

type LottieColor = {a: number; k: number[]}
type LottieShape = {nm?: string; c?: LottieColor; it?: LottieShape[]}
type LottieLayer = {nm?: string; sc?: string; shapes?: LottieShape[]}
type ActionCheckAnimationData = {layers: LottieLayer[]}

const isActionCheckAnimationData = (value: unknown): value is ActionCheckAnimationData =>
    typeof value === 'object' && value !== null && 'layers' in value && Array.isArray(value.layers)

const readSemanticColor = (token: string, probe: HTMLElement) => {
    probe.style.color = `var(${token})`
    const channels = getComputedStyle(probe)
        .color.match(/[\d.]+/g)
        ?.slice(0, 3)
        .map(Number)

    if (!channels || channels.length !== 3) return undefined
    return channels.map((channel) => channel / 255)
}

const toHex = (color: number[]) =>
    `#${color
        .map((channel) =>
            Math.round(channel * 255)
                .toString(16)
                .padStart(2, '0'),
        )
        .join('')}`

const applyThemeColors = (data: ActionCheckAnimationData, container: HTMLElement) => {
    const probe = document.createElement('span')
    container.appendChild(probe)

    const background = readSemanticColor('--ds-background', probe)
    const primary = readSemanticColor('--ds-primary', probe)
    const primaryForeground = readSemanticColor('--ds-primary-foreground', probe)
    const halo = readSemanticColor('--ds-action-check-halo', probe)
    probe.remove()

    for (const layer of data.layers) {
        if (layer.nm === 'Background' && background) layer.sc = toHex(background)

        for (const group of layer.shapes ?? []) {
            for (const shape of group.it ?? []) {
                if (shape.nm === 'Blue Fill' && primary && shape.c) shape.c.k = [...primary, 1]
                if (shape.nm === 'White Stroke' && primaryForeground && shape.c) {
                    shape.c.k = [...primaryForeground, 1]
                }
                if (shape.nm === 'Halo Fill' && halo && shape.c) shape.c.k = [...halo, 1]
            }
        }
    }
}

type ActionCheckProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role'> & {
    size?: number
    decorative?: boolean
    onAnimationComplete?: () => void
}

// 완료 애니메이션 — 화면 진입 시 한 번 재생하고 마지막 체크 프레임에서 멈춘다.
// 브라우저 전용 lottie-web은 effect 안에서 동적으로 불러 Server Component 번들 경계를 좁게 유지한다.
// 모션 감소 사용자는 중간 움직임 없이 완료 프레임을 바로 보며, 장식용이면 접근성 트리에서 제외한다.
const ActionCheck = ({
    size = 150,
    'aria-label': ariaLabel = '작업이 완료되었습니다',
    decorative = false,
    onAnimationComplete,
    className,
    style,
    ...props
}: ActionCheckProps) => {
    const {resolvedTheme} = useTheme()
    const containerRef = useRef<HTMLDivElement>(null)
    const completeCallbackRef = useRef(onAnimationComplete)

    useEffect(() => {
        completeCallbackRef.current = onAnimationComplete
    }, [onAnimationComplete])

    useEffect(() => {
        const container = containerRef.current
        if (!container || !resolvedTheme) return

        const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
        let cancelled = false
        let hasCompleted = false
        let destroyAnimation: (() => void) | undefined

        const notifyComplete = () => {
            if (hasCompleted) return
            hasCompleted = true
            completeCallbackRef.current?.()
        }

        const loadAnimation = async () => {
            const [{default: lottie}, response] = await Promise.all([import('lottie-web'), fetch(ACTION_CHECK_PATH)])
            if (cancelled || !containerRef.current) return

            if (!response.ok) throw new Error(`ActionCheck animation load failed: ${response.status}`)
            const animationData: unknown = await response.json()
            if (!isActionCheckAnimationData(animationData)) {
                throw new Error('ActionCheck animation data is invalid')
            }
            if (cancelled || !containerRef.current) return
            applyThemeColors(animationData, containerRef.current)

            const animation = lottie.loadAnimation({
                container: containerRef.current,
                renderer: 'svg',
                loop: false,
                autoplay: !motionPreference.matches,
                animationData,
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid meet',
                    focusable: false,
                },
            })

            const holdFinalFrame = () => {
                animation.goToAndStop(ACTION_CHECK_LAST_FRAME, true)
                notifyComplete()
            }

            const handleComplete = () => holdFinalFrame()
            const handleDomLoaded = () => {
                if (motionPreference.matches) holdFinalFrame()
            }
            const handleMotionChange = () => {
                if (motionPreference.matches) {
                    holdFinalFrame()
                    return
                }

                hasCompleted = false
                animation.goToAndPlay(0, true)
            }

            const removeCompleteListener = animation.addEventListener('complete', handleComplete)
            const removeDomLoadedListener = animation.addEventListener('DOMLoaded', handleDomLoaded)
            motionPreference.addEventListener('change', handleMotionChange)

            destroyAnimation = () => {
                removeCompleteListener()
                removeDomLoadedListener()
                motionPreference.removeEventListener('change', handleMotionChange)
                animation.destroy()
            }
        }

        void loadAnimation()

        return () => {
            cancelled = true
            destroyAnimation?.()
        }
    }, [resolvedTheme])

    return (
        <div
            {...props}
            ref={containerRef}
            data-slot="action-check"
            role={decorative ? undefined : 'img'}
            aria-label={decorative ? undefined : ariaLabel}
            aria-hidden={decorative ? true : undefined}
            className={cn('shrink-0 overflow-hidden', className)}
            style={{...style, width: size, height: size}}
        />
    )
}

export {ActionCheck}
export type {ActionCheckProps}
