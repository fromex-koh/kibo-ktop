import type {ReactNode} from 'react'
import Image, {type StaticImageData} from 'next/image'
import {type VariantProps} from 'class-variance-authority'
import {PlatformReveal} from '@/components/custom/platform-reveal'
import {
    platformCardClassName,
    platformFeatureCardClassName,
    platformHeroClassName,
    platformSectionVariants,
    platformToneBackgroundVariants,
} from '@/components/theme/platform-intro.variants'
import {cn} from '@/lib/utils'

// 플랫폼 소개 화면 블록 — 히어로 · 섹션(제목 포함) · 기능 카드 · 이용 대상 패널 · 마무리 배너.
// 플랫폼 소개 5화면(플랫폼 · 기술평가 · 특허평가 · K-BIGx 보고서 · 탄소중립)이 같은 틀로 쓰도록 만든다. 스타일은 theme/platform-intro.variants.ts.
// 서버 컴포넌트다 — 움직이는 조각(섹션 탭 · 지표 · 절차 · 서비스 카드 · 질문 탭)은 각자 파일에 있다.

type PlatformTone = NonNullable<VariantProps<typeof platformToneBackgroundVariants>['tone']>

// ─── 히어로 ─────────────────────────────────────────────────────────────────────────────────────

type PlatformHeroProps = {
    /** 제목(h2)의 id — section 이름(aria-labelledby)이 된다. */
    headingId: string
    /** 제목 위 한 줄(영문 이름 등). */
    eyebrow?: ReactNode
    /** 제목. 강조할 낱말은 <PlatformHeroEmphasis> 로 감싼다. */
    title: ReactNode
    /** 제목 크기 — default(PC 50) · compact(PC 40, 문구가 긴 화면). */
    titleSize?: keyof typeof HERO_TITLE_SIZE_CLASS
    /** 제목 아래 설명. */
    lead?: ReactNode
    /** 설명 아래 버튼 줄(Button asChild + Link). 모바일은 버튼이 한 줄씩 꽉 찬다. */
    actions?: ReactNode
    /** 버튼 아래 작은 안내(로그인 필요 등). */
    note?: ReactNode
    /** 오른쪽 그림. 1024 미만에서는 숨는다(꾸밈이라 aria-hidden 또는 role="img" + aria-label 로 넘긴다). */
    visual?: ReactNode
    tone?: PlatformTone
    className?: string
}

// 히어로 제목 크기 — typo-* 는 한 요소에 하나만 둔다(PB-08).
const HERO_TITLE_SIZE_CLASS = {
    default: 'typo-platform-hero-bold',
    compact: 'typo-platform-hero-compact-bold',
} as const

const PlatformHero = ({
    headingId,
    eyebrow,
    title,
    titleSize = 'default',
    lead,
    actions,
    note,
    visual,
    tone,
    className,
}: PlatformHeroProps) => (
    <section
        aria-labelledby={headingId}
        className={cn(platformHeroClassName, platformToneBackgroundVariants({tone}), className)}
    >
        <div className="flex flex-col items-start">
            {eyebrow ? (
                <p className="typo-platform-eyebrow-extrabold mb-3.5 break-keep text-(--platform-tone-emphasis)">
                    {eyebrow}
                </p>
            ) : null}
            <h2 id={headingId} className={cn(HERO_TITLE_SIZE_CLASS[titleSize], 'text-foreground break-keep')}>
                {title}
            </h2>
            {lead ? (
                // 설명 최대 폭 612(34em · 18px — 시안). 더 작은 글자의 둘째 문단은 사용처가 폭을 따로 준다.
                // w-full 은 지우지 말 것 — 없으면 Safari 가 <br> 이 든 break-keep 글의 폭을 첫 줄 폭으로 잘못 재 한 줄 더 꺾는다.
                <div className="typo-platform-lead-regular text-label-foreground mt-5 w-full max-w-153 break-keep">
                    {lead}
                </div>
            ) : null}
            {actions ? (
                <div className="mt-7 flex w-full flex-wrap gap-3 *:max-md:flex-1 *:max-md:basis-full">{actions}</div>
            ) : null}
            {note ? (
                <div className="typo-body-m-medium text-label-foreground mt-3 flex items-center gap-1">{note}</div>
            ) : null}
        </div>
        {visual ? <div className="hidden min-h-75 place-items-center lg:grid">{visual}</div> : null}
    </section>
)

/** 히어로 제목 안 강조 낱말 — 히어로 tone 의 강조색(--platform-tone-emphasis, 기본 platform-accent-foreground). */
const PlatformHeroEmphasis = ({children}: {children: ReactNode}) => (
    <em className="whitespace-nowrap text-(--platform-tone-emphasis) not-italic">{children}</em>
)

// ─── 섹션 ───────────────────────────────────────────────────────────────────────────────────────

type PlatformSectionProps = {
    /** section id — 섹션 이동 탭의 도착 지점. 제목 id 는 `${id}-title` 이다. */
    id: string
    /** 제목(h2). 배열이면 모든 폭에서 줄마다 끊는다(모바일에서 "평가·" 처럼 어색한 자리에서 끊기지 않게).
     *  없으면 제목 줄 없이 섹션만 그린다 — 제목이 서비스 패널마다 다를 때(PlatformSectionHeading 을 패널 안에 둔다). */
    title?: ReactNode | readonly string[]
    /** 제목 위 작은 머리글(서비스 이름 등). */
    eyebrow?: ReactNode
    description?: ReactNode
    /** 제목이 없을 때 섹션 이름(낭독기). */
    label?: string
    tone?: VariantProps<typeof platformSectionVariants>['tone']
    children: ReactNode
    className?: string
}

const isTitleLines = (title: ReactNode | readonly string[]): title is readonly string[] =>
    Array.isArray(title) && title.every((line) => typeof line === 'string')

/** 섹션 제목 묶음 — 머리글(선택) · 제목(h2) · 설명(선택)이 차례로 나타난다(PlatformReveal — 같이 들어오면 0.14초 간격).
 *  PlatformSection 이 그리고, 서비스 패널마다 제목이 다를 때는 패널 안에서 직접 쓴다(titleId 는 화면에서 하나만). */
const PlatformSectionHeading = ({
    titleId,
    eyebrow,
    title,
    description,
}: {
    titleId: string
    eyebrow?: ReactNode
    title: ReactNode | readonly string[]
    description?: ReactNode
}) => (
    <div className="mb-8 flex max-w-190 flex-col gap-4 md:mb-12">
        {eyebrow ? (
            <PlatformReveal as="p" className="typo-body-l-bold text-platform-accent-foreground -mb-1 break-keep">
                {eyebrow}
            </PlatformReveal>
        ) : null}
        <PlatformReveal as="h2" id={titleId} className="typo-platform-section-bold text-foreground break-keep">
            {isTitleLines(title)
                ? title.map((line) => (
                      <span key={line} className="block">
                          {line}{' '}
                      </span>
                  ))
                : title}
        </PlatformReveal>
        {description ? (
            <PlatformReveal as="p" className="typo-platform-lead-regular text-label-foreground break-keep">
                {description}
            </PlatformReveal>
        ) : null}
    </div>
)

const PlatformSection = ({id, title, eyebrow, description, label, tone, children, className}: PlatformSectionProps) => {
    const titleId = `${id}-title`
    return (
        <section
            id={id}
            aria-labelledby={title ? titleId : undefined}
            aria-label={title ? undefined : label}
            className={cn(platformSectionVariants({tone}), className)}
        >
            <div className="grid-layout *:col-span-full">
                {title ? (
                    <PlatformSectionHeading
                        titleId={titleId}
                        eyebrow={eyebrow}
                        title={title}
                        description={description}
                    />
                ) : null}
                {children}
            </div>
        </section>
    )
}

// ─── 기능 카드 그림 ─────────────────────────────────────────────────────────────────────────────

/** 기능 카드 위쪽 3D 그림(꾸밈, alt="") — 높이 88 칸을 채우고 폭은 그림 비율대로(정사각 · 105×88 등).
 *  폭을 w-auto 로 두면 width · height 속성이 덮여 Chrome 이 지연 로딩 그림을 '크기 없음'(Lazy-loaded images should have
 *  explicit dimensions)으로 잡는다 — 원본 비율(aspect-ratio)을 CSS 로도 둔다. 그림마다 비율이 달라 값은 그림에서 읽는다. */
const PlatformFeatureImage = ({src}: {src: StaticImageData}) => (
    <Image
        src={src}
        alt=""
        sizes="105px"
        className="h-full w-auto"
        style={{aspectRatio: `${src.width} / ${src.height}`}}
    />
)

// ─── 기능 카드(아이콘 위 · 제목 · 설명) ─────────────────────────────────────────────────────────

type PlatformFeatureCard = {
    id: string
    title: string
    description: ReactNode
    /** 위쪽 그림 — PlatformFeatureImage 로 넘긴다(높이 88 · 폭은 그림 비율대로). 모바일(768 미만)에서는 숨는다. */
    image?: ReactNode
}

/** 기능 카드 3장 — 강조색이 위에서 옅어지는 면 · 옅은 테두리(theme platformFeatureCardClassName). 카드마다 화면에 들어오면 차례로 떠오른다.
 *  태블릿(768~1023) 2열에서 개수가 홀수면 마지막 카드가 한 줄을 다 쓴다(혼자 반쪽에 남지 않게). */
const PlatformFeatureCards = ({items, className}: {items: readonly PlatformFeatureCard[]; className?: string}) => (
    <ul className={cn('grid gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
        {items.map((item) => (
            <li key={item.id} className="flex md:max-lg:last:odd:col-span-2">
                <PlatformReveal className={platformFeatureCardClassName}>
                    {item.image ? (
                        <span aria-hidden="true" className="mb-2 hidden h-22 md:flex">
                            {item.image}
                        </span>
                    ) : null}
                    <h3 className="typo-title-l-bold text-foreground break-keep">{item.title}</h3>
                    {/* 설명이 목록 등 요소이면 <p> 안에 둘 수 없어 <div> 로 감싼다. */}
                    {/* w-full 은 지우지 말 것 — 없으면 Safari 가 <br> 이 든 break-keep 글의 폭을 첫 줄 폭으로 잘못 재 한 줄 더 꺾는다. */}
                    {typeof item.description === 'string' ? (
                        <p className="typo-body-xl-regular text-label-foreground w-full break-keep">
                            {item.description}
                        </p>
                    ) : (
                        <div className="typo-body-xl-regular text-label-foreground w-full break-keep">
                            {item.description}
                        </div>
                    )}
                </PlatformReveal>
            </li>
        ))}
    </ul>
)

// ─── 이용 대상 패널(흰 패널 + 위쪽 짧은 파랑 막대) ──────────────────────────────────────────────

type PlatformAudiencePanel = {
    id: string
    icon: ReactNode
    title: string
    subtitle?: string
    description: string
    users: readonly {name: string; uses: string}[]
}

const PlatformAudiencePanels = ({items, className}: {items: readonly PlatformAudiencePanel[]; className?: string}) => (
    <ul className={cn('grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3', className)}>
        {items.map((item) => (
            <li key={item.id} className="flex md:max-lg:last:odd:col-span-2">
                <PlatformReveal
                    className={cn(
                        platformCardClassName,
                        'before:bg-platform-accent relative flex w-full flex-col gap-4 px-6 py-6 shadow-sm before:absolute before:-top-px before:left-6 before:h-1 before:w-10 before:rounded-b-xs md:px-7 md:py-8',
                    )}
                >
                    <div className="flex items-center gap-3.5">
                        {item.icon}
                        <h3 className="typo-title-l-bold text-foreground break-keep">
                            {item.title}
                            {item.subtitle ? (
                                <span className="typo-body-l-medium text-foreground-subtle block">{item.subtitle}</span>
                            ) : null}
                        </h3>
                    </div>
                    <p className="typo-body-xl-medium text-foreground break-keep">{item.description}</p>
                    <dl className="border-platform-panel-border flex flex-col gap-3.5 border-t pt-4">
                        {item.users.map((user) => (
                            <div key={user.name} className="flex flex-col gap-1">
                                <dt className="typo-body-l-bold text-platform-accent-foreground">{user.name}</dt>
                                <dd className="typo-body-xl-regular text-label-foreground break-keep">{user.uses}</dd>
                            </div>
                        ))}
                    </dl>
                </PlatformReveal>
            </li>
        ))}
    </ul>
)

// ─── 아이콘 패널(흰 패널 + 위쪽 짧은 서비스 색 막대 · 아이콘 옆 제목) ──────────────────────────

type PlatformIconPanel = {
    id: string
    /** 제목 옆 아이콘 그림(라이트 · 다크 ThemeImage 등, 꾸밈). 56 칸(옅은 강조 면) 안에 28 크기로 놓인다. */
    icon: ReactNode
    title: string
    /** 설명 — 원고가 정한 자리에서 끊어야 하면 <br> 을 넣은 노드로 넘긴다. */
    description: ReactNode
}

// 아이콘 칸 — 옅은 서비스 면(--platform-icon-surface, 화면 <main> 이 정한다 · 없으면 옅은 파랑) · 아이콘 색(--platform-icon-color,
// lucide 아이콘에 적용 · 그림 아이콘은 자체 색). 아이콘 패널 · 아이콘 타일 · 아이콘 줄 목록이 함께 쓴다.
const PLATFORM_ICON_BOX_CLASS =
    'grid shrink-0 place-items-center bg-[var(--platform-icon-surface,var(--color-platform-accent-subtle))] text-[var(--platform-icon-color,var(--color-platform-accent-foreground))]'

// 위쪽 짧은 막대 — 서비스 채움색(--platform-tone-fill · 없으면 platform-accent). 왼쪽 자리 · 폭은 사용처가 정한다.
const PLATFORM_TOP_BAR_CLASS =
    'before:absolute before:-top-px before:h-1 before:rounded-b-xs before:bg-[var(--platform-tone-fill,var(--color-platform-accent))]'

/** 아이콘 패널 — 회색 섹션 위에서 칸이 잘 보이는 흰 패널. 위쪽 막대 색 = 서비스 채움색(--platform-tone-fill, 화면 <main> 이 정한다 · 없으면 platform-accent).
 *  열 수는 columns(3 · 4). 패널마다 화면에 들어오면 차례로 떠오른다. */
// 열 수 — 4: 태블릿 2열 · PC(1280↑) 4열(K-BIGx 분석 기능). 3: 태블릿 2열(홀수 마지막 칸은 한 줄) · 1024↑ 3열(탄소중립 주요 기능).
//   4열(PC)은 칸 사이 16 · 좌우 안쪽 여백 16 — 글 폭 256 을 확보해 원고 줄('기업에 기술혁신 인사이트를 제공합니다.' 약 252)이 한 줄에 든다.
const ICON_PANEL_COLUMNS = {
    3: {list: 'lg:grid-cols-3', item: 'md:max-lg:last:odd:col-span-2', panel: ''},
    4: {list: 'xl:grid-cols-4 xl:gap-4', item: '', panel: 'xl:px-4 xl:before:left-4'},
} as const

const PlatformIconPanels = ({
    items,
    columns = 4,
    className,
}: {
    items: readonly PlatformIconPanel[]
    columns?: keyof typeof ICON_PANEL_COLUMNS
    className?: string
}) => (
    <ul className={cn('grid gap-3.5 md:grid-cols-2 md:gap-6', ICON_PANEL_COLUMNS[columns].list, className)}>
        {items.map((item) => (
            <li key={item.id} className={cn('flex', ICON_PANEL_COLUMNS[columns].item)}>
                <PlatformReveal
                    className={cn(
                        platformCardClassName,
                        'relative grid w-full content-start items-center gap-x-3.5 gap-y-4.5 px-5.5 py-6 shadow-sm md:px-7 md:py-7.5',
                        PLATFORM_TOP_BAR_CLASS,
                        'grid-cols-[auto_minmax(0,1fr)] before:left-5.5 before:w-10 md:before:left-7',
                        ICON_PANEL_COLUMNS[columns].panel,
                    )}
                >
                    <span
                        aria-hidden="true"
                        className={cn(PLATFORM_ICON_BOX_CLASS, 'size-14 rounded-md [&_img]:size-7')}
                    >
                        {item.icon}
                    </span>
                    <h3 className="typo-title-l-bold text-foreground break-keep">{item.title}</h3>
                    <p className="typo-body-xl-regular text-label-foreground col-span-full break-keep">
                        {item.description}
                    </p>
                </PlatformReveal>
            </li>
        ))}
    </ul>
)

// ─── 아이콘 타일(한 줄 이름 칸 — 흰 칸 + 위쪽 서비스 색 막대) ──────────────────────────────────

type PlatformIconTile = {id: string; icon: ReactNode; label: string}

/** 아이콘 타일 — 아이콘 칸(44) + 굵은 이름 한 줄. 모바일 1열 · 태블릿 2열 · 1024↑ 3열. 칸마다 화면에 들어오면 차례로 떠오른다.
 *  쓰는 곳: 탄소중립 이용 대상. */
const PlatformIconTiles = ({
    items,
    label,
    className,
}: {
    items: readonly PlatformIconTile[]
    /** 목록 이름(낭독기). */
    label?: string
    className?: string
}) => (
    <ul aria-label={label} className={cn('grid gap-2.5 md:grid-cols-2 md:gap-4 lg:grid-cols-3', className)}>
        {items.map((item) => (
            <li key={item.id} className="flex">
                <PlatformReveal
                    className={cn(
                        platformCardClassName,
                        PLATFORM_TOP_BAR_CLASS,
                        'typo-title-m-bold text-foreground relative flex w-full items-center gap-3.5 px-4.5 py-4 break-keep shadow-sm before:left-4.5 before:w-8 md:px-5.5 md:py-5 md:before:left-5.5',
                    )}
                >
                    <span
                        aria-hidden="true"
                        className={cn(PLATFORM_ICON_BOX_CLASS, 'size-11 rounded-md [&_svg]:size-6')}
                    >
                        {item.icon}
                    </span>
                    {item.label}
                </PlatformReveal>
            </li>
        ))}
    </ul>
)

// ─── 아이콘 줄 목록(위 굵은 선 + 아이콘 · 제목 · 설명) ────────────────────────────────────────────

type PlatformRuleItem = {id: string; icon: ReactNode; title: string; description: string}

/** 아이콘 줄 목록 — 순서가 없는 기능 나열. 칸마다 위에 굵은 선(본문색 2px) · 아이콘 칸(48) 옆 제목(h3) · 아래 설명.
 *  모바일 1열 · 태블릿 이상 3열. 쓰는 곳: 탄소중립 K-택소노미 이용 절차(기능별 활용). */
const PlatformRuleList = ({items, className}: {items: readonly PlatformRuleItem[]; className?: string}) => (
    <ul className={cn('grid gap-8 md:grid-cols-3 md:gap-10', className)}>
        {items.map((item) => (
            <li key={item.id} className="flex">
                <PlatformReveal className="border-foreground grid w-full grid-cols-[auto_minmax(0,1fr)] content-start items-center gap-x-3.5 gap-y-3 border-t-2 pt-6">
                    <span
                        aria-hidden="true"
                        className={cn(PLATFORM_ICON_BOX_CLASS, 'size-12 rounded-md [&_svg]:size-6')}
                    >
                        {item.icon}
                    </span>
                    <h3 className="typo-title-m-bold text-foreground break-keep">{item.title}</h3>
                    <p className="typo-body-xl-regular text-label-foreground col-span-full break-keep">
                        {item.description}
                    </p>
                </PlatformReveal>
            </li>
        ))}
    </ul>
)

// ─── 마무리 배너 ────────────────────────────────────────────────────────────────────────────────

type PlatformCtaBannerProps = {
    headingId: string
    title: ReactNode
    description?: ReactNode
    /** 오른쪽 버튼 줄. 모바일은 버튼이 한 줄을 꽉 채운다. */
    actions: ReactNode
    tone?: PlatformTone
    className?: string
}

/** 화면 끝 행동 유도 띠 — 히어로와 같은 서비스 색 바탕. 오른쪽 위에 큰 반투명 고리 장식이 걸린다. */
const PlatformCtaBanner = ({headingId, title, description, actions, tone, className}: PlatformCtaBannerProps) => (
    <section
        aria-labelledby={headingId}
        className={cn(
            platformToneBackgroundVariants({tone}),
            'relative isolate flex flex-col items-start justify-between gap-8 overflow-hidden rounded-xl px-6 py-9 md:flex-row md:flex-wrap md:items-center md:rounded-2xl md:p-14',
            className,
        )}
    >
        {/* 장식 고리 — 글 뒤(-z-10)에 깔려 좁은 폭에서도 글을 가리지 않는다. */}
        <span
            aria-hidden="true"
            className="border-cta-surface absolute -top-30 -right-30 -z-10 size-90 rounded-full border-60"
        />
        <div className="flex flex-col gap-2">
            <h2 id={headingId} className="typo-platform-cta-bold text-foreground break-keep">
                {title}
            </h2>
            {description ? (
                <p className="typo-body-xl-regular text-label-foreground break-keep">{description}</p>
            ) : null}
        </div>
        <div className="flex w-full flex-wrap gap-3 *:max-md:flex-1 *:max-md:basis-full md:w-auto">{actions}</div>
    </section>
)

export {
    PlatformAudiencePanels,
    PlatformCtaBanner,
    PlatformFeatureCards,
    PlatformFeatureImage,
    PlatformIconPanels,
    PlatformIconTiles,
    PlatformHero,
    PlatformHeroEmphasis,
    PlatformRuleList,
    PlatformSection,
    PlatformSectionHeading,
}
export type {
    PlatformAudiencePanel,
    PlatformCtaBannerProps,
    PlatformFeatureCard,
    PlatformHeroProps,
    PlatformIconPanel,
    PlatformIconTile,
    PlatformRuleItem,
    PlatformSectionProps,
    PlatformTone,
}
