import type {ReactNode} from 'react'
import {ArrowRight} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/composite/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'
import {CardCarousel} from '@/components/custom/card-carousel'
import {PlatformIntroMotion} from '@/components/custom/platform-intro-motion'
import {breadcrumbPillClassName} from '@/components/theme/breadcrumb.variants'
import {
    PLATFORM_BANNER_LINES,
    PLATFORM_INTRO_DESCRIPTIONS,
    PLATFORM_INTRO_OPENING,
    PLATFORM_INTRO_TITLE,
    PLATFORM_OVERVIEW_ITEMS,
    PLATFORM_OVERVIEW_TITLE,
    PLATFORM_SHORTCUTS,
    PLATFORM_USAGE_DESCRIPTION,
    PLATFORM_USAGE_GROUPS,
    PLATFORM_USAGE_TITLE,
    platformShortcutHref,
    type PlatformIntroUserType,
} from '@/content/service/platform-intro'
import documentChartMagnifier from '@public/images/option-card/document-chart-magnifier.webp'
import speedGauge from '@public/images/option-card/speed-gauge.webp'
import aiChipCircuit from '@public/images/platform-intro/ai-chip-circuit.webp'
import aiDatabaseServer from '@public/images/platform-intro/ai-database-server.webp'
import aiDonutChart from '@public/images/platform-intro/ai-donut-chart.webp'
import chartReviewMeeting from '@public/images/platform-intro/chart-review-meeting.webp'
import lightbulbLeaf from '@public/images/platform-intro/lightbulb-leaf.webp'
import officeBankBuildings from '@public/images/platform-intro/office-bank-buildings.webp'

// 플랫폼 소개(오픈 플랫폼 소개) 화면 본문 — 기업 · 기관 /platform/page.tsx 가 함께 쓴다. 문구는 content/service/platform-intro.ts.
//
// 짜임(위에서 아래로): 브레드크럼(오른쪽) → 대표 사진(위에 제목 · 소개) → K-TOP 플랫폼 개요(가로 카드)
//   → 기술혁신 지원(왼쪽 제목 | 오른쪽 활용 분야별 표) → 소개 배너(화면 전체 폭) → 서비스 바로가기(3칸).
//
// 화면 전체 폭으로 뻗는 구간(개요 카드 줄 · 기술혁신 지원의 구분선 · 배너)이 있어 본문을 grid-layout 하나로 감싸지 않는다.
// 대신 --platform-inset(콘텐츠 왼쪽 끝까지의 거리 = grid-layout 과 같은 계산)을 <main> 에 두고, 각 구간이 그 거리만큼
// 안쪽에서 시작한다. 거리는 <main> 폭 기준(@container · cqw)이다 — % 로 두면 쓰는 자리(그리드 칸 등)의 폭으로 풀려
// 어긋난다. 오른쪽으로 뻗는 구간은 화면 끝까지 가고, 넘치는 부분은 <main> 의 overflow-x-clip 이 자른다.

type PlatformIntroProps = {
    userType: PlatformIntroUserType
}

const TITLE_ID = 'platform-intro-title'
const USAGE_TITLE_ID = 'platform-usage-title'
const SHORTCUT_TITLE = '서비스 바로가기'
// 대표 사진 표시 폭 — PC 1200 · 태블릿 792(md 그리드 콘텐츠 폭) · 모바일 화면 폭 − 좌우 여백 32.
const HERO_IMAGE_SIZES = '(min-width: 1280px) 1200px, (min-width: 768px) 792px, calc(100vw - 32px)'

// 개요 카드 그림(100 × 100 자리) — 꾸밈 그림이라 읽지 않는다(alt="")[5.1.1]. 원본은 표시 크기의 3배(300 × 300).
// 02 · 05 는 선택 카드 그림과 같은 그림이라 그 파일을 같이 쓴다 — 게이지는 시안에서도 자리보다 넓게(144 × 96) 놓여 양옆으로 나온다.
const OVERVIEW_IMAGES: Record<string, ReactNode> = {
    what: <Image src={aiDonutChart} alt="" sizes="100px" className="size-25" />,
    why: <Image src={documentChartMagnifier} alt="" sizes="100px" className="h-auto w-25" />,
    'made-of': <Image src={aiDatabaseServer} alt="" sizes="100px" className="size-25" />,
    who: <Image src={officeBankBuildings} alt="" sizes="100px" className="size-25" />,
    open: <Image src={speedGauge} alt="" sizes="144px" className="h-24 w-auto max-w-none" />,
    how: <Image src={lightbulbLeaf} alt="" sizes="100px" className="size-25" />,
}

const OVERVIEW_ITEMS = PLATFORM_OVERVIEW_ITEMS.map((item) => ({
    ...item,
    image: OVERVIEW_IMAGES[item.id],
}))

const PlatformIntro = ({userType}: PlatformIntroProps) => (
    <main
        id="main"
        tabIndex={-1}
        aria-labelledby={TITLE_ID}
        className="bg-page @container flex-1 overflow-x-clip [--platform-inset:calc((100cqw-min(100cqw-2*var(--ds-grid-margin),var(--ds-grid-container)))/2)]"
    >
        {/* 상단 등장 연출 — 1단계(옛 제목 → 영문 설명 → 사진)는 화면을 열면, 2단계(사진 제자리 · 막 · 흰 제목 · 개요)는 첫
            스크롤 때 재생한다. 단계는 PlatformIntroMotion, 움직임은 src/styles/platform-intro.css(page.tsx 가 import). */}
        <PlatformIntroMotion>
            <div className="grid-layout pt-10 *:col-span-full">
                {/* 브레드크럼 — 모바일은 왼쪽, md 부터 오른쪽(시안). */}
                <div className="flex md:justify-end">
                    <div className={breadcrumbPillClassName}>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={`/${userType}/home`}>홈</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <span>플랫폼 소개</span>
                                </BreadcrumbItem>
                                <BreadcrumbDotSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>오픈 플랫폼 소개</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                {/* 상단 — 대표 사진(PC 1200 × 400 · 태블릿 792 × 264 = 3:1, 모바일 328 × 180 = 82:45 · 라운드 20) 위에 어두운 막(60%)을 덮고 가운데에 흰 제목 · 소개를 둔다.
                사진 · 막 · 글을 한 칸에 겹친다(grid). 막은 다크 모드에서도 어두운 값이다(platform-hero-overlay).
                사진 칸은 시안 비율 그대로라 글이 칸을 넘지 않게 모바일 글자를 줄인다 — typo-hero-title-bold(모바일 18 · md↑ 40)
                · typo-hero-description-medium(모바일 13 · md↑ 18), 모바일 안쪽 여백 좌우 16 · 위아래 12(320 폭에서도 넘치지 않음). 모바일 82:45 는 시안의 실제 사진 비율이다.
                옛 제목(개방형 기술평가 플랫폼 K-TOP)은 연출 1단계에만 보이고 2단계에서 사라진다 — 같은 내용을 흰 제목 · 소개가
                다시 말하므로 낭독기에서는 감춘다. 사진보다 앞에 두어(DOM 순서) 올라오는 사진이 옛 제목을 덮는다. */}
                <div className="relative mt-15">
                    <div
                        aria-hidden="true"
                        className="platform-intro-legacy absolute inset-x-0 top-0 flex flex-col items-center gap-2 text-center md:top-10"
                    >
                        {/* 회색 글자 위로 같은 글자를 왼쪽부터 진하게 채운다(platform-intro-title-fill). 연출용 꾸밈 글이라 문단(p)이 아니라
                        div 로 둔다 — 짧고 큰 굵은 p 는 WAVE 가 '제목 같은 문단(Possible heading)'으로 본다. */}
                        <div className="platform-intro-title typo-display-m-bold grid break-keep *:col-start-1 *:row-start-1">
                            <span className="text-disabled-subtle">
                                {PLATFORM_INTRO_OPENING.title} {PLATFORM_INTRO_OPENING.brand}
                            </span>
                            <span className="platform-intro-title-fill text-foreground">
                                {PLATFORM_INTRO_OPENING.title}{' '}
                                <span className="text-primary-strong">{PLATFORM_INTRO_OPENING.brand}</span>
                            </span>
                        </div>
                        <p className="platform-intro-subtitle typo-title-m-medium text-label-foreground break-keep">
                            {PLATFORM_INTRO_OPENING.description}
                        </p>
                    </div>
                    {/* 칸 바탕은 막과 같은 짙은 단색 — 사진이 덮어 보이지 않지만, 사진을 못 불러와도 흰 글자가 읽히고 WAVE 같은 대비 검사도
                        흰 글자 / 짙은 바탕으로 계산한다(검사기는 사진 · 겹친 막을 보지 않고 가장 가까운 배경색만 본다)[5.3.3]. */}
                    <header className="platform-intro-hero bg-platform-hero-overlay grid aspect-[82/45] overflow-hidden rounded-xl *:col-start-1 *:row-start-1 md:aspect-3/1">
                        {/* 대표 사진 — 칸 비율에 맞춰 잘린다(object-cover). 꾸밈 사진이라 읽지 않는다[5.1.1]. 화면 첫 큰 그림(LCP)이라
                            미리 받는다(preload — Next 16 에서 priority 대신). 원본 3600×1200 = PC 표시 크기의 3배(이미지 규칙). */}
                        <Image
                            src={chartReviewMeeting}
                            alt=""
                            preload
                            sizes={HERO_IMAGE_SIZES}
                            className="size-full object-cover"
                        />
                        <div aria-hidden="true" className="platform-intro-hero-overlay bg-platform-hero-overlay/60" />
                        <div className="flex flex-col items-center justify-center gap-1 px-4 py-3 text-center text-white md:gap-2 md:px-6 md:py-10">
                            <h1 id={TITLE_ID} className="platform-intro-hero-title typo-hero-title-bold break-keep">
                                {PLATFORM_INTRO_TITLE}
                            </h1>
                            <p className="platform-intro-hero-description typo-hero-description-medium max-w-159 break-keep">
                                {/* 항목마다 새 줄은 md 부터 — 모바일은 좁은 사진 칸에 맞춰 이어서 흐른다. */}
                                {PLATFORM_INTRO_DESCRIPTIONS.map((description) => (
                                    <span key={description} className="md:block">
                                        {description}{' '}
                                    </span>
                                ))}
                            </p>
                        </div>
                    </header>
                </div>
            </div>

            {/* 카드 줄은 콘텐츠 왼쪽 선에서 시작해 화면 오른쪽 끝까지 이어진다(--card-carousel-inset). */}
            <CardCarousel
                className="platform-intro-overview mt-15 [--card-carousel-inset:var(--platform-inset)] md:mt-20 xl:mt-25"
                title={PLATFORM_OVERVIEW_TITLE}
                items={OVERVIEW_ITEMS}
            />
        </PlatformIntroMotion>

        {/* 기술혁신 지원 — md 부터 왼쪽 제목 칸 | 오른쪽 표(화면 오른쪽 끝까지, 왼쪽 세로선). 제목 칸 폭은 콘텐츠 왼쪽 끝에서
            태블릿 304 · PC 512. 모바일은 제목 아래로 표가 이어지고(사이 구분선 없음) 활용 주체 아래에 활용 내용이 온다.
            구분선은 모두 화면 오른쪽 끝까지 닿는다(모바일은 콘텐츠 왼쪽 선에서 시작).
            제목 · 설명 줄바꿈 — 태블릿 · 모바일은 칸 폭(304)에서 3줄 · '상생 / 기술평가생태계', PC 는 2줄 · '기술평가 / 생태계'(시안). */}
        <section
            aria-labelledby={USAGE_TITLE_ID}
            className="border-subtle-3 mt-15 border-t md:mt-30 md:grid md:grid-cols-[calc(var(--platform-inset)+var(--spacing)*76)_minmax(0,1fr)] xl:grid-cols-[calc(var(--platform-inset)+var(--spacing)*128)_minmax(0,1fr)]"
        >
            {/* 왼쪽 제목 · 설명은 태블릿부터 화면에 고정(sticky)되고 오른쪽 활용 분야 목록만 스크롤된다 — 목록이 끝나면 함께 올라간다.
                고정 위치는 사이트 헤더(sticky top-0) 바로 아래다 — 헤더 높이 태블릿 100 · PC 112. 위 여백(pt-12)이 헤더와의 간격이 된다.
                self-start 로 칸 높이를 내용만큼 줄여야 고정된 채 움직일 여유가 생긴다. 모바일은 위아래로 쌓여 고정하지 않는다.
                아래 여백(pb-12)은 오른쪽 목록의 마지막 여백(48)과 같다 — 목록 끝에서 함께 올라갈 때 설명이 영역 바닥에 붙지 않는다. */}
            <div className="flex flex-col gap-6 ps-(--platform-inset) pe-(--ds-grid-margin) pt-12 md:sticky md:top-25 md:self-start md:pe-0 md:pb-12 xl:top-28 xl:pe-10">
                <h2 id={USAGE_TITLE_ID} className="typo-display-s-bold text-foreground break-keep">
                    {PLATFORM_USAGE_TITLE[0]}
                    <br className="xl:hidden" />
                    <span className="max-xl:hidden"> </span>
                    {PLATFORM_USAGE_TITLE[1]}
                    <br className="max-xl:hidden" />
                    <span className="xl:hidden"> </span>
                    {PLATFORM_USAGE_TITLE[2]}
                    <br className="xl:hidden" />
                    <span className="max-xl:hidden"> </span>
                    {PLATFORM_USAGE_TITLE[3]}
                </h2>
                <p className="typo-title-l-medium text-foreground break-keep">
                    {PLATFORM_USAGE_DESCRIPTION.lead}
                    <br className="xl:hidden" />
                    <span className="max-xl:hidden"> </span>
                    {PLATFORM_USAGE_DESCRIPTION.middle}
                    <br className="max-xl:hidden" />
                    {PLATFORM_USAGE_DESCRIPTION.tail}
                </p>
            </div>
            <ul className="border-subtle-3 flex flex-col md:border-l">
                {PLATFORM_USAGE_GROUPS.map((group) => (
                    <li
                        key={group.title}
                        className="border-subtle-3 ms-(--platform-inset) flex flex-col gap-6 border-t py-8 pe-(--ds-grid-margin) first:border-t-0 first:pt-12 last:pb-12 md:ms-0 md:ps-20"
                    >
                        <h3 className="typo-title-l-bold text-foreground break-keep">{group.title}</h3>
                        {/* md 부터 대상 | 항목 두 칸. 대상 칸은 최대 204px 이고, 좁은 태블릿에서 항목 칸이 가장 긴 항목
                            (성장·고용 등 정책연구, 약 137px)보다 좁아지면 대상 칸이 대신 줄어든다 — 항목이 한 글자씩 꺾이지 않는다.
                            칸 너비가 모든 묶음에서 같아 항목 시작선이 묶음끼리 맞는다. 각 줄은 subgrid 로 이 두 칸을 따른다. */}
                        <dl className="flex max-w-153 flex-col gap-8 md:grid md:grid-cols-[minmax(0,--spacing(51))_minmax(--spacing(36),1fr)] md:gap-x-6">
                            {group.users.map((user) => (
                                <div
                                    key={user.name}
                                    className="flex flex-col gap-6 md:col-span-full md:grid md:grid-cols-subgrid"
                                >
                                    <dt className="typo-body-xl-medium text-platform-audience break-keep">
                                        {user.name}
                                    </dt>
                                    <dd>
                                        <ul className="flex flex-col gap-2">
                                            {user.uses.map((use) => (
                                                <li
                                                    key={use}
                                                    className="typo-body-xl-regular text-label-foreground break-keep"
                                                >
                                                    {use}
                                                </li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </li>
                ))}
            </ul>
        </section>

        {/* 소개 배너 — 화면 전체 폭 남색 띠(라이트 · 다크 같은 색). 사진(회로망 AI 칩)에 남색 바탕 · 왼쪽으로 옅어지는 효과까지
            들어 있다. 시안 1920 × 280 기준으로 가운데를 맞춰 잘린다(좁으면 양옆이 잘림). 화면 전체 폭 배경이라 원본은 2배(3840 × 560).
            꾸밈 사진이라 읽지 않는다(alt="")[5.1.1]. 칸 바탕은 사진과 같은 남색이라 사진을 못 불러와도 흰 글자가 읽힌다[5.3.3]. */}
        <section className="bg-platform-banner text-platform-banner-foreground grid min-h-70 overflow-hidden *:col-start-1 *:row-start-1">
            {/* 높이 280 칸을 덮으므로 화면이 1920 보다 좁아도 사진은 1920 폭으로 그려진다(양옆이 잘림) — sizes 도 그 폭으로 준다. */}
            <Image
                src={aiChipCircuit}
                alt=""
                sizes="(min-width: 1920px) 100vw, 1920px"
                className="size-full object-cover"
            />
            {/* 줄마다 새 줄은 md 부터 — 모바일은 좁은 폭에 맞춰 이어서 흐른다. */}
            <p className="typo-callout-medium self-center px-(--ds-grid-margin) py-12 text-center text-balance break-keep">
                {PLATFORM_BANNER_LINES.map((line) => (
                    <span key={line} className="md:block">
                        {line}{' '}
                    </span>
                ))}
            </p>
        </section>

        <nav aria-label={SHORTCUT_TITLE} className="grid-layout *:col-span-full">
            {/* 모바일은 칸이 한 줄씩 화면 끝까지 뻗는다(가장자리 여백만큼 밖으로) — md 부터 본문 폭 3칸. */}
            <ul className="border-subtle-3 divide-subtle-3 -mx-(--ds-grid-margin) grid divide-y md:mx-0 md:grid-cols-3 md:divide-x md:divide-y-0 md:border-x">
                {PLATFORM_SHORTCUTS.map((shortcut) => (
                    <li key={shortcut.segment}>
                        <Link
                            href={platformShortcutHref(userType, shortcut.segment)}
                            className="typo-callout-bold text-foreground hover:text-primary-strong outline-ring focus-visible:outline-ring flex min-h-14 items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid md:min-h-25"
                        >
                            {shortcut.label}
                            <ArrowRight aria-hidden="true" className="size-icon-lg" />
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    </main>
)

export {PlatformIntro}
export type {PlatformIntroProps}
