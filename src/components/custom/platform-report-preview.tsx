'use client'

import {useEffect, useId, useRef, useState} from 'react'
import {MoveVertical} from 'lucide-react'
import Image, {getImageProps, type StaticImageData} from 'next/image'
import {PlatformTabsList, PlatformTabsTrigger} from '@/components/composite/platform-tabs'
import {
    platformCardClassName,
    platformTabsListVariants,
    platformTabsTriggerVariants,
} from '@/components/theme/platform-intro.variants'
import {Tabs, TabsContent} from '@/components/ui/tabs'
import {cn} from '@/lib/utils'

// 보고서 미리보기 — 모형 탭 · 보고서 유형(일반 · 심층)을 고르면 아래에 그 보고서 화면과 구성 목록이 나온다.
//   · 왼쪽(1024 미만은 위): 보고서 화면 캡처를 고정 높이 틀 안에서 세로로 스크롤해 끝까지 본다. 틀은 키보드로 포커스해
//     방향키로 스크롤할 수 있다(tabIndex 0 · role=region)[6.1.1]. 오른쪽 위에 '샘플 화면' 배지.
//   · 오른쪽(1024 미만은 아래): "<보고서 이름> 구성" 제목 · 안내 · 번호 목록. 심층은 일반 목록 뒤에 심층 항목이 이어진다.
//   · 모형은 플랫폼 탭(PlatformTabs), 유형은 같은 모양(작은 크기)의 눌림 단추(aria-pressed) 묶음 — 모형 탭 패널 안의 내용만
//     바꾸는 선택이라 탭을 겹치지 않는다. 고른 유형은 모형을 바꿔도 유지된다.
// 배지 바탕 = 서비스 채움색(--platform-tone-fill, 화면 <main> 이 정한다 · 없으면 platform-accent).
// 그림은 정적 import(next/image) — 화면 아래쪽이라 미리 받지 않는다.

type PlatformReportItem = {title: string; description: string}

type PlatformReportType = {id: string; label: string; note: string}

type PlatformReportModel = {
    value: string
    /** 탭 이름 · 보고서 이름 앞부분(예: KTRS-FM). */
    name: string
    /** 유형별 화면 캡처 · 구성 목록. 키는 types 의 id. */
    images: Record<string, StaticImageData>
    items: Record<string, readonly PlatformReportItem[]>
}

type PlatformReportPreviewProps = {
    models: readonly PlatformReportModel[]
    types: readonly PlatformReportType[]
    /** 모형 탭 목록 이름 · 유형 선택 이름(낭독기). */
    modelListLabel: string
    typeLabel: string
    sampleBadge: string
    scrollCaption: string
    /** 그림 설명 끝 안내(예시 데이터). */
    sampleNote: string
    className?: string
}

// 불러오는 동안 자리 — 제목 · 글줄 · 큰 칸 모양의 회색 막대 위로 빛 띠가 1.4초마다 지나간다(동작 줄이기면 멈춘다).
// 바탕(옅은 회색)은 틀이 늘 깔고 있어, 이 자리는 막대 · 빛 띠만 그린다.
// 그림 뒤(먼저 그린 absolute)에 깔려, 그림이 뜨면 그 아래로 가려진다 — 그림은 relative 라 같은 층에서 나중에 그려져 위에 온다.
const SKELETON_BARS = [
    'top-18 w-[46%] h-5.5',
    'top-29.5 w-[86%] h-3',
    'top-35.5 w-[78%] h-3',
    'top-45 w-[86%] h-30',
    'top-81 w-[64%] h-3',
] as const

// 0.3초 안에 그림이 뜨면(캐시 · 미리 받은 그림 — 탭 전환 대부분) 보이지 않고, 그보다 늦을 때만 0.3초에 걸쳐 나타난다 —
// 곧바로 뜨는 그림 앞에서 회색 막대가 번쩍였다 사라지지 않게 한다. 동작 줄이기면 늦춤 없이 막대만 보인다.
const ReportSkeleton = () => (
    <span
        aria-hidden="true"
        className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:fill-mode-both absolute inset-0 overflow-hidden motion-safe:delay-300 motion-safe:duration-300"
    >
        {SKELETON_BARS.map((bar) => (
            <span key={bar} className={cn('bg-platform-panel-border rounded-2xs absolute left-[7%]', bar)} />
        ))}
        <span className="motion-safe:animate-platform-skeleton via-skeleton-shine absolute inset-0 bg-linear-100 from-transparent from-30% to-transparent to-70% bg-size-[200%_100%]" />
    </span>
)

// 화면 캡처 표시 폭 — PC 두 칸의 왼쪽 칸(약 640) · 그 아래는 화면 폭.
const IMAGE_SIZES = '(min-width: 1024px) 640px, 100vw'
// 불러오기 끝 신호를 끝내 못 받았을 때 그림을 그냥 보이는 시간(ms) — 불러오는 중 자리가 계속 남지 않게 한다.
const REPORT_IMAGE_REVEAL_MS = 4000

// 보고서 그림 — 다 불러오면 0.4초에 걸쳐 스르르 나타난다(그 전에는 불러오는 중 자리 — 늦을 때만 보인다). 탭을 옮길 때 그림이
// 갑자기 바뀌며 번쩍이지 않게 한다. 동작 줄이기면 바로 보인다[6.3.1].
//   · 캐시에서 바로 뜬 그림은 React 가 onLoad 를 잡기 전에 끝났을 수 있어, 처음에 complete 를 한 번 확인한다.
//   · 원본 비율을 CSS 로도 둔다 — h-auto 가 width · height 속성의 크기를 덮어써 Chrome 이 지연 로딩 이미지를
//     '크기 없음'(Lazy-loaded images should have explicit dimensions)으로 잡는다. 캡처마다 비율이 달라 값은 그림에서 읽는다.
//   · className 은 그림 · 불러오는 중 자리를 함께 감싼 칸에 붙는다 — 라이트 · 다크 그림을 dark:hidden 등으로 갈라 둘 때, 숨은 쪽
//     (불러오지 않는 지연 그림)의 자리 막대가 보이는 쪽을 덮지 않게 함께 숨긴다.
const ReportImage = ({
    src,
    alt,
    onLoaded,
    className,
}: {
    src: StaticImageData
    alt: string
    onLoaded?: () => void
    className?: string
}) => {
    const ref = useRef<HTMLImageElement>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const handleLoaded = () => setIsLoaded(true)

    // 불러오기 끝 신호를 놓치지 않게 세 겹으로 확인한다 — onLoad 하나에만 기대면, 숨어 있던 쪽(라이트 · 다크 중 안 보이던 그림)이
    // 캐시에서 뜨거나 테마가 바뀐 뒤 늦게 뜰 때 신호를 놓쳐 그림이 투명한 채 불러오는 중 자리만 남을 수 있다(모바일에서 확인).
    //   ① 처음에 이미 끝났는지(complete) ② 그림의 load 이벤트를 직접 듣기 ③ 그래도 못 받으면 REPORT_IMAGE_REVEAL_MS 뒤에 그냥 보인다.
    //   이 확인은 그림이 처음 놓일 때 한 번 건다(탭을 바꾸면 패널이 새로 그려져 다시 건다).
    useEffect(() => {
        const image = ref.current
        if (!image) return undefined
        const markLoaded = () => setIsLoaded(true)
        // 지금 보이는 그림(고른 탭 · 지금 테마 쪽)은 바로 받는다 — 지연 로딩(lazy)은 브라우저가 '보인다'고 판단할 때까지
        // 받기를 미뤄 탭을 바꾼 뒤 그림이 늦게 뜨거나 안 뜰 수 있다. 숨은 테마 쪽(display:none)은 그대로 미뤄 두 벌을 받지 않는다.
        const isVisible = () => image.getClientRects().length > 0
        if (isVisible()) image.loading = 'eager'
        if (image.complete && image.naturalWidth > 0) markLoaded()
        image.addEventListener('load', markLoaded)
        // 테마가 바뀌어 숨어 있던 그림이 보이게 되면(크기가 생기면) 그때 바로 받는다.
        const visibilityObserver = new ResizeObserver(() => {
            if (isVisible()) image.loading = 'eager'
        })
        visibilityObserver.observe(image)
        const revealTimer = window.setTimeout(() => {
            if (isVisible()) image.loading = 'eager'
            markLoaded()
        }, REPORT_IMAGE_REVEAL_MS)
        return () => {
            image.removeEventListener('load', markLoaded)
            visibilityObserver.disconnect()
            window.clearTimeout(revealTimer)
        }
    }, [])

    // 다 불러오면 한 번 알린다(첫 그림이 뜨면 나머지 미리 받기).
    useEffect(() => {
        if (isLoaded) onLoaded?.()
        // 뜬 순간에만 — onLoaded 가 바뀌어도 다시 알리지 않는다.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])

    return (
        <span className={cn('block', className)}>
            {/* 불러오는 동안만 자리 막대를 둔다 — 그림이 뜨면 지운다. */}
            {isLoaded ? null : <ReportSkeleton />}
            <Image
                ref={ref}
                src={src}
                alt={alt}
                sizes={IMAGE_SIZES}
                onLoad={handleLoaded}
                // 불러오기에 실패해도 감춘 채 남지 않게 한다(대체 텍스트가 보이도록).
                onError={() => setIsLoaded(true)}
                // 다 불러오면 0.4초 페이드인 — transition 이 아닌 animation 이라 캐시에서 바로 뜬 그림(감춘 상태가 그려지기 전)도 매번 스르르 나타난다.
                className={cn(
                    'relative block h-auto w-full',
                    isLoaded
                        ? 'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-400 motion-safe:ease-out'
                        : 'opacity-0',
                )}
                style={{aspectRatio: `${src.width} / ${src.height}`}}
            />
        </span>
    )
}

// 나머지 보고서 미리 받기 — 처음 보이는 그림이 뜬 뒤, 다른 모형 · 유형 그림을 화면과 같은 크기 후보(srcSet · sizes)로
// 미리 받아 둔다. 탭을 옮기면 기다림 없이 바로 스르르 나타난다. 한 번만 한다.
const preloadReportImages = (images: readonly StaticImageData[]) => {
    images.forEach((image) => {
        const {props} = getImageProps({src: image, alt: '', sizes: IMAGE_SIZES})
        const preload = new window.Image()
        preload.sizes = props.sizes ?? IMAGE_SIZES
        if (props.srcSet) preload.srcset = props.srcSet
        preload.src = props.src
    })
}

// 보고서 미리보기 틀 — 고정 높이(PC 560 · 그 아래 440) 회색 틀 안에서 보고서 캡처를 세로로 스크롤해 본다.
//   · 틀은 키보드로 포커스해 방향키로 스크롤한다(tabIndex 0 · role=region)[6.1.1]. 오른쪽 위 '샘플 화면' 배지 · 아래 안내.
//   · regionKey 가 바뀌면 틀을 새로 그려 스크롤을 맨 위로 되돌린다(탭 전환). 배지 색은 --platform-tone-fill.
// 쓰는 곳: PlatformReportPreview(탭 — custom/platform-technology-evaluation.tsx) · custom/platform-patent-evaluation.tsx(보고서 1장)
//   · custom/platform-report-viewer.tsx(카드 없이 · 라이트/다크 캡처).
type PlatformReportFrameProps = {
    label: string
    image?: StaticImageData
    /** 다크 화면용 캡처 — 있으면 라이트에는 image, 다크에는 이 그림을 보인다. */
    darkImage?: StaticImageData
    /** 대체 텍스트 — 짧게(100자 안, WAVE Long alternative text). 쪽마다의 내용은 description 으로 넘긴다. */
    alt: string
    /** 그림을 길게 설명하는 글(낭독기 전용) — 틀에 aria-describedby 로 잇는다. */
    description?: string
    sampleBadge: string
    scrollCaption: string
    regionKey?: string
    onLoaded?: () => void
    /** 카드 테두리 · 여백 없이 틀 · 안내만 그린다(다른 카드 안에 넣을 때). */
    isBare?: boolean
    /** 틀 높이(기본 PC 560 · 그 아래 440). */
    frameHeightClassName?: string
    className?: string
}

const PlatformReportFrame = ({
    label,
    image,
    alt,
    sampleBadge,
    scrollCaption,
    description,
    regionKey,
    onLoaded,
    darkImage,
    isBare = false,
    frameHeightClassName = 'h-110 lg:h-140',
    className,
}: PlatformReportFrameProps) => {
    const descriptionId = useId()
    return (
        <div className={cn(!isBare && platformCardClassName, !isBare && 'p-4 md:p-5', className)}>
            <div className={cn('bg-platform-panel-inset relative overflow-hidden rounded-md', frameHeightClassName)}>
                <div
                    key={regionKey}
                    // 그림이 틀보다 길어 키보드로도 스크롤할 수 있게 포커스를 받는다[6.1.1].
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                    tabIndex={0}
                    role="region"
                    aria-label={`${label} 미리보기 (${scrollCaption})`}
                    aria-describedby={description ? descriptionId : undefined}
                    className="outline-ring focus-visible:outline-ring absolute inset-0 overflow-y-auto rounded-md focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-solid"
                >
                    {image && darkImage ? (
                        <>
                            <ReportImage src={image} alt={alt} onLoaded={onLoaded} className="dark:hidden" />
                            <ReportImage src={darkImage} alt={alt} onLoaded={onLoaded} className="hidden dark:block" />
                        </>
                    ) : null}
                    {image && !darkImage ? <ReportImage src={image} alt={alt} onLoaded={onLoaded} /> : null}
                </div>
                {/* 배지는 스크롤 틀 뒤에 그려 틀 위에 보이게 한다(z-index 없이 DOM 순서로). */}
                <span className="typo-body-m-bold pointer-events-none absolute top-3.5 right-5.5 rounded-full bg-[var(--platform-tone-fill,var(--color-platform-accent))] px-2.5 py-1 text-white shadow-sm">
                    {sampleBadge}
                </span>
            </div>
            <p className="typo-body-l-regular text-foreground-subtle mt-3.5 flex items-center gap-1">
                <MoveVertical aria-hidden="true" className="size-icon-sm" />
                {scrollCaption}
            </p>
            {description ? (
                <p id={descriptionId} className="sr-only">
                    {description}
                </p>
            ) : null}
        </div>
    )
}

// 보고서 구성 번호 목록 — 칸마다 번호(서비스 색 12% 면 · 서비스 색 글자, --platform-tone-step · 없으면 강조 파랑) · 굵은 제목 · 설명.
const PlatformReportItemList = ({items, className}: {items: readonly PlatformReportItem[]; className?: string}) => (
    <ol className={cn('flex flex-col gap-2.5', className)}>
        {items.map((item, index) => (
            <li key={item.title} className={cn(platformCardClassName, 'flex items-start gap-3 rounded-md px-4 py-3.5')}>
                <span
                    aria-hidden="true"
                    className="typo-body-m-bold grid size-6.5 shrink-0 place-items-center rounded-xs bg-[color-mix(in_srgb,var(--platform-tone-step,var(--color-platform-accent-foreground))_12%,var(--color-platform-panel))] text-[var(--platform-tone-step,var(--color-platform-accent-foreground))]"
                >
                    {index + 1}
                </span>
                <div className="typo-body-xl-regular text-label-foreground break-keep">
                    <strong className="typo-body-xl-bold text-foreground block">{item.title}</strong>
                    {item.description}
                </div>
            </li>
        ))}
    </ol>
)

const PlatformReportPreview = ({
    models,
    types,
    modelListLabel,
    typeLabel,
    sampleBadge,
    scrollCaption,
    sampleNote,
    className,
}: PlatformReportPreviewProps) => {
    const [typeId, setTypeId] = useState(types[0]?.id ?? '')
    const type = types.find((candidate) => candidate.id === typeId) ?? types[0]
    const hasPreloadedRef = useRef(false)

    // 첫 그림이 뜨면 나머지 그림을 한 번 미리 받는다.
    const handleImageLoaded = () => {
        if (hasPreloadedRef.current) return
        hasPreloadedRef.current = true
        preloadReportImages(models.flatMap((model) => Object.values(model.images)))
    }

    return (
        <Tabs defaultValue={models[0]?.value} className={cn('flex flex-col gap-6', className)}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <PlatformTabsList aria-label={modelListLabel}>
                    {models.map((model) => (
                        <PlatformTabsTrigger key={model.value} value={model.value}>
                            {model.name}
                        </PlatformTabsTrigger>
                    ))}
                </PlatformTabsList>
                {/* 유형 — 탭 모양(작은 크기)의 눌림 단추 묶음. 모형 탭 패널 안의 내용만 바꾸므로 탭을 겹치지 않는다. */}
                <div role="group" aria-label={typeLabel} className={platformTabsListVariants({size: 'sm'})}>
                    {types.map((candidate) => {
                        const isSelected = candidate.id === typeId
                        return (
                            <button
                                key={candidate.id}
                                type="button"
                                aria-pressed={isSelected}
                                data-active={isSelected ? '' : undefined}
                                onClick={() => setTypeId(candidate.id)}
                                className={cn(
                                    platformTabsTriggerVariants({size: 'sm'}),
                                    'outline-ring focus-visible:outline-ring inline-flex items-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-solid',
                                )}
                            >
                                {candidate.label}
                            </button>
                        )
                    })}
                </div>
            </div>
            {models.map((model) => {
                const label = `${model.name} ${type?.label ?? ''}`
                const items = model.items[typeId] ?? []
                const image = model.images[typeId]
                // 대체 텍스트는 짧게 — 보고서 구성은 바로 옆 목록이 글로 보여 준다(WAVE Long alternative text).
                const alt = `${label} 화면 예시 — ${sampleNote}`
                return (
                    <TabsContent
                        key={model.value}
                        value={model.value}
                        className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
                    >
                        <PlatformReportFrame
                            regionKey={`${model.value}-${typeId}`}
                            label={label}
                            image={image}
                            alt={alt}
                            sampleBadge={sampleBadge}
                            scrollCaption={scrollCaption}
                            onLoaded={handleImageLoaded}
                        />
                        {/* 보고서가 바뀌면 구성 목록도 새로 그려 그림과 함께 스르르 나타난다(0.4초). */}
                        <div
                            key={typeId}
                            className="motion-safe:animate-in motion-safe:fade-in-0 flex flex-col gap-4 motion-safe:duration-400"
                        >
                            <h3 className="typo-title-l-bold text-foreground">{label} 구성</h3>
                            <p className="typo-body-xl-regular text-label-foreground">{type?.note}</p>
                            <PlatformReportItemList items={items} />
                        </div>
                    </TabsContent>
                )
            })}
        </Tabs>
    )
}

export {PlatformReportFrame, PlatformReportItemList, PlatformReportPreview, preloadReportImages}
export type {
    PlatformReportFrameProps,
    PlatformReportItem,
    PlatformReportModel,
    PlatformReportPreviewProps,
    PlatformReportType,
}
