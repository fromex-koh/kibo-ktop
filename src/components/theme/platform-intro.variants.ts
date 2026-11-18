import {cva} from 'class-variance-authority'

// 플랫폼 소개 블록(PlatformHero · PlatformSection · 카드 · 패널 · 배너 · 절차 · 질문 탭)의 스타일.
// 사용처: 플랫폼 소개 5화면의 블록 — custom/platform-*.tsx(본문 · 블록 · 도식 · 표 · 뷰어 · 토글 등) · custom/*-structure-diagram.tsx
//         · composite/platform-tabs.tsx · composite/platform-question-tabs.tsx. 상수마다 바로 위 주석에 무엇이 쓰는지 적는다.
//
// 서비스 색(tone) — 히어로 · 마무리 배너 바탕(옅은 띠 + 왼쪽 위 · 오른쪽 아래로 번진 원 두 개)을 한 벌로 고른다.
//   blue = 플랫폼 소개(service-hero-blue-*) · teal = 기술평가(service-hero-teal-*) · violet = 특허평가(service-hero-violet-*) · navy = K-BIGx(service-hero-navy-*)
//   · green = 탄소중립(service-hero-green-*).
// 번진 원은 토큰 색 변수를 radial-gradient 에 넣어 그린다 — 토큰 유틸로 그라데이션 두 겹을 겹칠 수 없어서다(SC-01 CSS 변수 예외).
// 강조 글자색 — tone 마다 --platform-tone-emphasis 에 둔다. 히어로 영문 한 줄 · 제목 강조 낱말(PlatformHeroEmphasis)이 읽는다.

const platformToneBackgroundVariants = cva('[--platform-tone-emphasis:var(--color-platform-accent-foreground)]', {
    variants: {
        tone: {
            blue: 'bg-service-hero-blue-band bg-[radial-gradient(55%_90%_at_0%_0%,var(--color-service-hero-blue-glow-left)_0%,transparent_72%),radial-gradient(60%_100%_at_100%_100%,var(--color-service-hero-blue-glow-right)_0%,transparent_72%)]',
            teal: 'bg-service-hero-teal-band bg-[radial-gradient(55%_90%_at_0%_0%,var(--color-service-hero-teal-glow-left)_0%,transparent_72%),radial-gradient(60%_100%_at_100%_100%,var(--color-service-hero-teal-glow-right)_0%,transparent_72%)] [--platform-tone-emphasis:var(--color-service-hero-teal-emphasis)]',
            violet: 'bg-service-hero-violet-band bg-[radial-gradient(55%_90%_at_0%_0%,var(--color-service-hero-violet-glow-left)_0%,transparent_72%),radial-gradient(60%_100%_at_100%_100%,var(--color-service-hero-violet-glow-right)_0%,transparent_72%)] [--platform-tone-emphasis:var(--color-service-hero-violet-emphasis)]',
            navy: 'bg-service-hero-navy-band bg-[radial-gradient(55%_90%_at_0%_0%,var(--color-service-hero-navy-glow-left)_0%,transparent_72%),radial-gradient(60%_100%_at_100%_100%,var(--color-service-hero-navy-glow-right)_0%,transparent_72%)] [--platform-tone-emphasis:var(--color-service-hero-navy-emphasis)]',
            green: 'bg-service-hero-green-band bg-[radial-gradient(55%_90%_at_0%_0%,var(--color-service-hero-green-glow-left)_0%,transparent_72%),radial-gradient(60%_100%_at_100%_100%,var(--color-service-hero-green-glow-right)_0%,transparent_72%)] [--platform-tone-emphasis:var(--color-service-hero-green-emphasis)]',
        },
    },
    defaultVariants: {tone: 'blue'},
})

// 히어로 — 최소 높이: 태블릿(768↑) 440 · 1024~1279 540(두 칸이 좁아 글이 길어진다) · PC(1280↑) 504.
// 1024 이상: 글 | 그림 두 칸. 1024 미만: 그림을 숨기고 글만 가운데 정렬(세로). 모바일은 내용 높이.
const platformHeroClassName =
    'grid items-center gap-9 overflow-hidden rounded-xl px-6 py-8 md:rounded-2xl md:min-h-110 md:content-center md:px-9 md:py-11 lg:min-h-135 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:px-14 xl:min-h-126'

// 섹션 — 흰 바탕(default) · 옅은 회색 바탕(muted)이 번갈아 온다. 위아래 여백 모바일 56 · 태블릿 72 · PC 96.
// scroll-mt — 섹션 이동 탭으로 왔을 때 제목이 사이트 헤더 · 섹션 탭 밑에 가리지 않게 한다(두 높이는 PlatformSectionNav 가 잰다).
const platformSectionVariants = cva(
    'scroll-mt-[calc(var(--platform-header-h)+var(--platform-section-nav-h)+--spacing(4))] py-14 md:py-18 xl:py-24',
    {
        variants: {
            tone: {
                default: 'bg-page',
                muted: 'bg-platform-section-band',
            },
        },
        defaultVariants: {tone: 'default'},
    },
)

// 카드 공통 면 — 패널 면(platform-panel: 라이트 흰색 · 다크 남색 슬레이트) · 옅은 테두리 · 둥근 16.
const platformCardClassName = 'bg-platform-panel border-platform-panel-border rounded-lg border'

// 서비스 아이콘 칸 — 옅은 파랑 면(탄소중립만 옅은 초록) + 서비스 아이콘색(라이트 · 다크 토큰).
const platformServiceIconVariants = cva('grid shrink-0 place-items-center', {
    variants: {
        service: {
            tech: 'bg-platform-accent-subtle text-platform-accent-foreground',
            patent: 'bg-platform-accent-subtle text-platform-accent-patent',
            bigx: 'bg-platform-accent-subtle text-platform-accent-foreground',
            carbon: 'bg-platform-accent-carbon-surface text-service-accent-green',
            neutral: 'bg-platform-accent-subtle text-platform-accent-foreground',
        },
        size: {
            md: 'size-14 rounded-md [&_svg]:size-icon-lg',
            sm: 'size-9 rounded-xs [&_svg]:size-icon-md',
        },
    },
    defaultVariants: {service: 'neutral', size: 'md'},
})

// 서비스 칩 — 옅은 파랑 면 · 진한 파랑 글자.
const platformChipClassName =
    'typo-body-m-bold bg-platform-accent-subtle text-platform-accent-foreground rounded-xs px-3 py-1'

// 기능 카드(PlatformFeatureCards) — 카드 강조색(--platform-card-accent, 없으면 platform-accent) 9% 를 카드 면에 섞은 색에서
// 62% 지점까지 카드 면으로 옅어지는 바탕 · 강조색 18% 를 옅은 테두리색에 섞은 테두리 · 둥근 20 · 여백 32/30/34(모바일 24/22/26).
// 화면마다 강조색이 다르다 — 기술평가는 <main> 에서 --platform-card-accent 를 platform-accent-foreground(다크 밝은 파랑)로 둔다(시안 --card-acc).
// 섞은 색은 토큰 두 개를 color-mix 로 합쳐야 해 CSS 변수 arbitrary value 를 쓴다(SC-01 CSS 변수 예외).
const platformFeatureCardClassName =
    'flex w-full flex-col items-start gap-3 rounded-xl border bg-linear-to-b from-[color-mix(in_srgb,var(--platform-card-accent,var(--color-platform-accent))_9%,var(--color-platform-panel))] to-platform-panel to-62% border-[color-mix(in_srgb,var(--platform-card-accent,var(--color-platform-accent))_18%,var(--color-platform-panel-border))] shadow-1 px-5.5 pt-6 pb-6.5 md:px-7.5 md:pt-8 md:pb-8.5'

// 회색 태그 — 옅은 회색 면(platform-panel-inset) · 옅은 테두리 · 둥근 6 · 높이 28 · 보조 글자(모형 상세 키워드 등).
const platformTagClassName =
    'typo-body-m-bold bg-platform-panel-inset border-platform-panel-border text-label-foreground inline-flex h-7 items-center rounded-xs border px-2.5'

// 섹션 이동 탭 링크 — 현재 섹션(aria-current)은 옅은 파랑 면 + 파랑 글자.
const platformSectionNavLinkClassName =
    'typo-body-xl-medium text-label-foreground hover:bg-background hover:text-foreground aria-[current=true]:bg-platform-accent-subtle aria-[current=true]:text-platform-accent-foreground outline-ring focus-visible:outline-ring block rounded-sm px-4 py-2 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid'

// 질문 탭 — 고른 질문은 강조색 면(platform-accent) + 흰 글자, PC(1280↑)에서는 아래로 꼬리(마름모)가 답변 칸을 가리킨다.
const platformQuestionTriggerClassName =
    'bg-platform-panel border-platform-panel-border text-foreground hover:border-platform-accent data-active:bg-platform-accent data-active:border-platform-accent data-active:text-white relative flex min-h-0 flex-col items-start gap-3 rounded-lg border px-4 py-4 text-left whitespace-normal md:min-h-30 md:px-5 md:py-5 xl:data-active:before:bg-platform-accent xl:data-active:before:absolute xl:data-active:before:-bottom-2 xl:data-active:before:left-1/2 xl:data-active:before:size-4 xl:data-active:before:-translate-x-1/2 xl:data-active:before:rotate-45 xl:data-active:before:rounded-xs'

// 모형 구조도 — 바탕(옅은 회색 판 platform-panel-inset, 둥근 14 · 여백 모바일 18 · 그 위 28)과 그 위 흰 상자(강조색 16% 테두리 · 그림자 · 둥근 16).
const platformDiagramSurfaceClassName = 'bg-platform-panel-inset rounded-md p-4.5 md:p-7'
const platformDiagramBoxClassName = 'bg-platform-panel border-platform-accent/16 rounded-lg border shadow-sm'

// 구조도 아이콘 배지 — 밝은 끝 → 진한 끝 그라데이션(135°) 위 흰 아이콘. tone: accent(기본 파랑) · growth(투자모형 기술사업성장모형 남색).
const platformDiagramBadgeVariants = cva('grid shrink-0 place-items-center bg-linear-135 text-white shadow-sm', {
    variants: {
        tone: {
            accent: 'from-platform-accent-bright to-platform-accent',
            growth: 'from-platform-model-growth-bright to-platform-model-growth',
        },
        size: {
            sm: 'size-7.5 rounded-sm [&_svg]:size-4.25',
            md: 'size-8.5 rounded-sm [&_svg]:size-icon-md',
        },
    },
    defaultVariants: {tone: 'accent', size: 'sm'},
})

// 플랫폼 탭(PlatformTabsList · Trigger) — 회색 트랙(platform-panel-inset · 옅은 테두리 · 둥근 12 · 안쪽 4) 안 굵은 글 칸(사이 4).
// 고른 칸은 카드 면 + 강조 글자 + 그림자. 칸 폭은 글자 길이를 따른다. 넘치면 트랙 안에서 가로로 스크롤한다.
// 타이포는 목록에 둔다(트리거가 상속) — typo-* 는 상태 접두사를 받지 못한다.
const platformTabsListVariants = cva(
    'bg-platform-panel-inset border-platform-panel-border inline-flex w-fit max-w-full gap-1 overflow-x-auto rounded-md border p-1 [scrollbar-width:none]',
    {
        variants: {
            size: {
                md: 'typo-body-xl-bold',
                sm: 'typo-body-l-bold',
            },
        },
        defaultVariants: {size: 'md'},
    },
)
const platformTabsTriggerVariants = cva(
    'text-label-foreground hover:text-foreground data-active:bg-platform-panel data-active:text-platform-accent-foreground shrink-0 justify-center rounded-sm whitespace-nowrap transition-colors data-active:shadow-sm',
    {
        variants: {
            size: {
                md: 'min-h-10.5 px-4.5',
                sm: 'min-h-9 px-3.5',
            },
        },
        defaultVariants: {size: 'md'},
    },
)

// 서비스 토글(PlatformServiceSwitch) — 옅은 회색 알약 틀 안의 두 칸. 고른 칸 = 서비스 색(--platform-switch-accent, 화면 <main> 이 정한다 ·
// 없으면 platform-accent) 바탕 + 대비 글자(--platform-switch-on-accent) + 같은 색으로 물든 옅은 그림자(shadow-tint-pill).
// PC(1024↑): 글자 폭만큼(한 줄). 그 아래: 틀이 줄을 꽉 채우고 두 칸이 반씩 — 이름이 길면 칸 안에서 줄을 바꾼다.
const platformServiceSwitchListClassName =
    'bg-platform-panel-inset border-platform-panel-border grid w-full auto-cols-fr grid-flow-col gap-1 rounded-full border p-0.75 lg:inline-grid lg:w-auto lg:auto-cols-auto'
const platformServiceSwitchTabClassName =
    'typo-body-l-bold text-label-foreground hover:text-foreground aria-selected:bg-[var(--platform-switch-accent,var(--color-platform-accent))] aria-selected:text-[var(--platform-switch-on-accent,var(--color-white))] aria-selected:hover:text-[var(--platform-switch-on-accent,var(--color-white))] aria-selected:shadow-tint-pill outline-ring focus-visible:outline-ring min-h-10 rounded-full px-2.5 py-1.5 text-center break-keep transition-colors [--shadow-tint:var(--platform-switch-accent,var(--color-platform-accent))] focus-visible:outline-2 focus-visible:outline-offset-2 md:px-4.5 lg:whitespace-nowrap'

// 보고서 뷰어(PlatformReportViewer) 항목 메뉴 — 흰 패널 · 둥근 16 안의 격자. 항목이 늘 다 보이게 폭마다 열 수만 바꾼다
// (가로 스크롤은 숨은 항목을 알아채기 어렵고 고른 칸이 화면 밖으로 밀려 쓰지 않는다).
//   · 모바일: 2열(항목이 홀수면 마지막 칸이 한 줄을 다 쓴다) · 칸 높이 44 · 태블릿(768~1023): 4열(4 + 3 두 줄)
//   · PC(1024↑): 왼쪽 260 세로 메뉴(안쪽 10), 스크롤해도 섹션 탭 아래에 붙어 있다.
// 탭 목록 기본값(가운데 정렬 · 한 줄 flex)을 덮어 칸이 열 폭을 꽉 채운다. 타이포는 메뉴에 둔다(칸이 상속).
const platformViewerMenuClassName =
    'bg-platform-panel border-platform-panel-border typo-body-xl-bold grid grid-cols-2 justify-stretch gap-1.5 rounded-lg border p-1.5 md:grid-cols-4 lg:sticky lg:top-[calc(var(--platform-header-h)+var(--platform-section-nav-h)+--spacing(4))] lg:grid-cols-1 lg:p-2.5'
// 메뉴 칸 — 번호 상자(26) + 이름. 고른 칸 = 서비스 채움색(--platform-tone-fill) 바탕 + 흰 글자, 번호 상자는 흰 12%.
// 고르지 않은 칸의 번호 = 서비스 강조색(--platform-tone-step) 12% 면 + 강조 글자. 칸 안 번호는 group-data-active 로 바뀐다.
// 모바일은 두 칸이 한 줄에 들어가게 안쪽 · 사이를 줄인다(번호 ↔ 이름 8 · 좌우 10 · 높이 44 — 아주 좁은 폭에서 이름이 넘치면 줄을 바꾼다).
const platformViewerTabClassName =
    'group/viewer-tab text-foreground-subtle hover:bg-platform-panel-inset hover:text-foreground data-active:bg-[var(--platform-tone-fill,var(--color-platform-accent))] data-active:text-white data-active:hover:bg-[var(--platform-tone-fill,var(--color-platform-accent))] data-active:hover:text-white flex min-h-11 w-full min-w-0 items-center justify-start gap-2 rounded-paper px-2.5 py-2.5 text-left transition-colors max-md:last:odd:col-span-2 md:min-h-12 md:whitespace-nowrap md:gap-3 md:px-3.5 md:py-3'
const platformViewerTabNumberClassName =
    'typo-platform-viewer-number-extrabold grid size-6.5 shrink-0 place-items-center rounded-sm bg-[color-mix(in_srgb,var(--platform-tone-step,var(--color-platform-accent))_12%,var(--color-platform-panel))] text-[var(--platform-tone-step,var(--color-platform-accent-foreground))] group-data-active/viewer-tab:bg-white/12 group-data-active/viewer-tab:text-white'

// 흐름 도식 · 정의 패널(PlatformFlowDiagram · PlatformDefinitionPanel) 색 — 화면 <main> 이 --platform-flow-accent(진한 끝) ·
// --platform-flow-accent-bright(밝은 끝) · --platform-flow-foreground(강조 글자)를 정하면 그 색, 없으면 플랫폼 소개 파랑.
// 안쪽 요소는 줄인 이름(--flow-a · --flow-b · --flow-f)으로 읽는다. 사용처: custom/platform-flow-diagram.tsx · platform-definition-panel.tsx
const platformFlowToneClassName =
    '[--flow-a:var(--platform-flow-accent,var(--color-platform-accent))] [--flow-b:var(--platform-flow-accent-bright,var(--color-platform-accent-bright))] [--flow-f:var(--platform-flow-foreground,var(--color-platform-accent-foreground))]'

// 흐름 도식 칸 · 정의 패널 — 강조색 7% 를 섞은 면에서 45% 지점까지 카드 면으로 옅어지는 바탕 · 강조색 16% 를 섞은 테두리 ·
// 둥근 20 · 옅은 그림자. color-mix 로 토큰 두 개를 섞어야 해 CSS 변수 arbitrary value 를 쓴다(SC-01 CSS 변수 예외).
const platformFlowPanelClassName =
    'rounded-xl border border-[color-mix(in_srgb,var(--flow-a)_16%,var(--color-platform-panel-border))] bg-linear-to-b from-[color-mix(in_srgb,var(--flow-a)_7%,var(--color-platform-panel))] to-platform-panel to-45% shadow-sm'

// 흐름 도식 배지 · 아이콘 상자 — 밝은 끝 → 진한 끝 135° 그라데이션 위 흰 아이콘.
const platformFlowBadgeClassName =
    'grid shrink-0 place-items-center bg-linear-135 from-(--flow-b) to-(--flow-a) text-white shadow-sm'

export {
    platformCardClassName,
    platformChipClassName,
    platformDiagramBadgeVariants,
    platformDiagramBoxClassName,
    platformDiagramSurfaceClassName,
    platformFeatureCardClassName,
    platformFlowBadgeClassName,
    platformFlowPanelClassName,
    platformFlowToneClassName,
    platformHeroClassName,
    platformQuestionTriggerClassName,
    platformSectionNavLinkClassName,
    platformSectionVariants,
    platformServiceSwitchListClassName,
    platformServiceSwitchTabClassName,
    platformTabsListVariants,
    platformTabsTriggerVariants,
    platformTagClassName,
    platformViewerMenuClassName,
    platformViewerTabClassName,
    platformViewerTabNumberClassName,
    platformServiceIconVariants,
    platformToneBackgroundVariants,
}
