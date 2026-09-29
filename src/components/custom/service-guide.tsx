import type {ReactNode} from 'react'
import Image, {type StaticImageData} from 'next/image'
import Link from 'next/link'
import chromeLogo from '@public/images/browser/chrome.webp'
import chromeZoomMenu from '@public/images/browser/zoom-menu-chrome.webp'
import microsoftEdgeLogo from '@public/images/browser/microsoft-edge.webp'
import naverWhaleLogo from '@public/images/browser/naver-whale.webp'
import edgeZoomMenu from '@public/images/browser/zoom-menu-edge.webp'
import safariLogo from '@public/images/browser/safari.webp'
import {InlineSeparator} from '@/components/composite/inline-separator'
import {ListMarker} from '@/components/custom/list-marker'
import {
    GUIDE_ACCESSIBILITY_TITLE,
    GUIDE_ASSISTIVE_DEVICE,
    GUIDE_BASIC_TITLE,
    GUIDE_BROWSER_TYPES_TEXT,
    GUIDE_BROWSER_TYPES_TITLE,
    GUIDE_BROWSERS,
    GUIDE_CONTACT_ITEMS,
    GUIDE_CONTACT_TITLE,
    GUIDE_KEYBOARD_ITEMS,
    GUIDE_KEYBOARD_TITLE,
    GUIDE_NOTICE,
    GUIDE_RESOLUTION_TEXT,
    GUIDE_RESOLUTION_TITLE,
    GUIDE_SCREEN_READER_ITEMS,
    GUIDE_SCREEN_READER_TITLE,
    GUIDE_ZOOM_EXAMPLES,
    GUIDE_ZOOM_ITEMS,
    GUIDE_ZOOM_LEAD,
    GUIDE_ZOOM_TITLE,
} from '@/content/service/guide'
import {cn} from '@/lib/utils'

// 이용안내 — 기업·기관이 같은 화면이다. 문구는 전부 content/service/guide.ts 에 있고 이 파일은 짜임만 갖는다.
// 제목 단계: 페이지 h1(이용안내) → 구획 h2 → 소제목 h3.

// 브라우저 이름과 로고를 잇는다. 로고 옆 카드 글자가 이름을 읽어 주므로 alt 는 비운다[5.1.1].
const GUIDE_BROWSER_LOGOS: Record<(typeof GUIDE_BROWSERS)[number], StaticImageData> = {
    'Microsoft Edge': microsoftEdgeLogo,
    Chrome: chromeLogo,
    'Naver Whale': naverWhaleLogo,
    Safari: safariLogo,
}

// 확대/축소 메뉴를 찍은 예시 그림 — 원본 1764×2016(7:8)이다.
const GUIDE_ZOOM_SCREENSHOTS: Record<(typeof GUIDE_ZOOM_EXAMPLES)[number]['label'], StaticImageData> = {
    'Microsoft Edge': edgeZoomMenu,
    Chrome: chromeZoomMenu,
}

const GuideSection = ({id, title, children}: {id: string; title: string; children: ReactNode}) => (
    <section aria-labelledby={id} className="flex flex-col gap-2">
        <h2 id={id} className="typo-title-m-bold text-foreground break-keep">
            {title}
        </h2>
        {children}
    </section>
)

const GuideBlock = ({title, className, children}: {title: string; className?: string; children: ReactNode}) => (
    <div className={cn('flex flex-col gap-2', className)}>
        <h3 className="typo-body-xl-medium text-foreground break-keep">{title}</h3>
        {children}
    </div>
)

// '- ' 로 시작하는 줄 목록 — 대시는 눈에만 보이고 스크린리더는 읽지 않는다.
const GuideDashList = ({items}: {items: readonly ReactNode[]}) => (
    <ul className="typo-body-xl-regular text-label-foreground flex list-none flex-col gap-2">
        {items.map((item, index) => (
            <li key={index} className="break-keep">
                <span aria-hidden="true">- </span>
                {item}
            </li>
        ))}
    </ul>
)

// 글 중간에 끼는 링크 — 외부 사이트라 새 창으로 열고, 주소만 읽히지 않게 기관명을 aria-label 에 함께 담는다.
const GuideInlineLink = ({href, name, children}: {href: string; name: string; children: ReactNode}) => (
    <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} ${children} (새 창)`}
        className="text-label-foreground outline-ring rounded-2xs underline decoration-1 underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid"
    >
        {children}
    </Link>
)

const ServiceGuide = () => (
    <div className="flex flex-col gap-10">
        <div className="bg-surface-subtle rounded-sm p-5">
            <ul className="flex list-none flex-col gap-2">
                <li className="flex">
                    <ListMarker type="unordered-small" />
                    <span className="typo-body-l-regular text-foreground-subtle min-w-0 break-keep">
                        {GUIDE_NOTICE}
                    </span>
                </li>
            </ul>
        </div>

        <GuideSection id="guide-basic" title={GUIDE_BASIC_TITLE}>
            <GuideBlock title={GUIDE_BROWSER_TYPES_TITLE}>
                <GuideDashList items={[GUIDE_BROWSER_TYPES_TEXT]} />
                <ul className="grid list-none grid-cols-2 gap-6 md:grid-cols-4">
                    {GUIDE_BROWSERS.map((browser) => (
                        <li
                            key={browser}
                            className="border-subtle-3 flex flex-col items-center gap-4 rounded-lg border p-6"
                        >
                            <Image src={GUIDE_BROWSER_LOGOS[browser]} alt="" className="size-20 object-contain" />
                            <span className="typo-body-l-bold text-foreground text-center break-keep">{browser}</span>
                        </li>
                    ))}
                </ul>
            </GuideBlock>
            {/* 카드 다음에 오는 묶음만 8 더 띄운다(16). */}
            <GuideBlock title={GUIDE_RESOLUTION_TITLE} className="pt-2">
                <GuideDashList items={[GUIDE_RESOLUTION_TEXT]} />
            </GuideBlock>
        </GuideSection>

        <GuideSection id="guide-zoom" title={GUIDE_ZOOM_TITLE}>
            <GuideBlock title={GUIDE_ZOOM_LEAD}>
                <GuideDashList items={GUIDE_ZOOM_ITEMS} />
            </GuideBlock>
            <ul className="grid list-none gap-6 md:grid-cols-2">
                {GUIDE_ZOOM_EXAMPLES.map((example) => (
                    <li key={example.label} className="flex flex-col items-center gap-4">
                        {/* 높이를 고정하지 않고 7:8 비율로 폭을 따라가게 한다[ST-004]. */}
                        <Image
                            src={GUIDE_ZOOM_SCREENSHOTS[example.label]}
                            alt={example.caption}
                            className="border-subtle-3 aspect-[7/8] w-full rounded-lg border object-cover"
                        />
                        <span className="bg-badge-solid-navy text-badge-solid-fg typo-body-xl-bold rounded-sm px-4 py-1">
                            {example.label}
                        </span>
                    </li>
                ))}
            </ul>
        </GuideSection>

        <GuideSection id="guide-accessibility" title={GUIDE_ACCESSIBILITY_TITLE}>
            <GuideBlock title={GUIDE_SCREEN_READER_TITLE}>
                <GuideDashList
                    items={[
                        ...GUIDE_SCREEN_READER_ITEMS,
                        <>
                            {GUIDE_ASSISTIVE_DEVICE.lead}
                            <GuideInlineLink
                                href={GUIDE_ASSISTIVE_DEVICE.links[0].href}
                                name={GUIDE_ASSISTIVE_DEVICE.links[0].name}
                            >
                                {GUIDE_ASSISTIVE_DEVICE.links[0].label}
                            </GuideInlineLink>
                            {GUIDE_ASSISTIVE_DEVICE.middle}
                            <GuideInlineLink
                                href={GUIDE_ASSISTIVE_DEVICE.links[1].href}
                                name={GUIDE_ASSISTIVE_DEVICE.links[1].name}
                            >
                                {GUIDE_ASSISTIVE_DEVICE.links[1].label}
                            </GuideInlineLink>
                            {GUIDE_ASSISTIVE_DEVICE.tail}
                        </>,
                    ]}
                />
            </GuideBlock>
            <GuideBlock title={GUIDE_KEYBOARD_TITLE}>
                <GuideDashList items={GUIDE_KEYBOARD_ITEMS} />
            </GuideBlock>
        </GuideSection>

        <section aria-labelledby="guide-contact" className="border-subtle-3 bg-card rounded-lg border px-10 py-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 id="guide-contact" className="typo-title-l-bold text-foreground">
                    {GUIDE_CONTACT_TITLE}
                </h2>
                <dl className="typo-body-l-regular flex flex-wrap items-center">
                    {GUIDE_CONTACT_ITEMS.map((item, index) => (
                        // dl 안의 div 는 dt · dd 만 담을 수 있다 — 구분선은 이름(dt) 안에 글 흐름으로 둔다[8.1.1].
                        <div key={item.label} className="flex items-center">
                            <dt className="text-foreground-subtle">
                                {index > 0 ? <InlineSeparator inline /> : null}
                                {item.label}
                            </dt>
                            <dd className="text-foreground ms-1">{item.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    </div>
)

export {ServiceGuide}
