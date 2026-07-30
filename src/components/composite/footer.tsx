import Image from 'next/image'
import Link from 'next/link'
import type {ComponentProps} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: shadcn 에 Footer primitive 가 없어 Select·Link·Image 를 조합한
// 전 페이지 하단 contentinfo 합성 컴포넌트. 시안(type A_01)의 푸터 구조를 옮긴다.
// 색은 표준 시맨틱 토큰(bg-background·text-foreground·text-muted-foreground·border …)만 써서 페이지 테마를
// 그대로 따른다 — 메인페이지는 mainpage(다크) 스킨, 서브페이지는 light/dark 모드로 자동 반사된다([PB-06]).
// 로고만 어두운/밝은 표면에 맞춰 light 테마엔 컬러 로고, dark·mainpage 엔 화이트 로고로 교체한다.

type FooterLink = {label: string; href: string; external?: boolean}

// 하단 유틸 링크 — 개인정보처리방침은 시안에서 굵게 강조한다.
// 메인·서브 두 시안이 같은 네 항목이라 목록을 나누지 않는다(서브에 있던 '플랫폼 소개'는 시안에서 빠졌다).
const UTILITY_LINKS: (FooterLink & {emphasized?: boolean})[] = [
    {label: '이용약관', href: '#'},
    {label: '가격 정책', href: '#'},
    {label: '개인정보처리방침', href: '#', emphasized: true},
    {label: '공지사항', href: '#'},
]

// 관련사이트 목록 — 이동 대상 확정 전 목업 값.
const FAMILY_SITES = [
    {value: 'kibo', label: '기술보증기금'},
    {value: 'mss', label: '중소벤처기업부'},
    {value: 'smes', label: '중소벤처24'},
]

const CONTACT = {
    number: '1544-1120',
    hours: '평일 09시 ~ 18시 (토요일 및 공휴일 휴무)',
    address: '48400 부산광역시 남구 문현금융로 33 기술보증기금',
    copyright: 'ⓒ The Government of the Republic of Korea. All rights reserved.',
}

// 포커스 링 — 프로젝트 공통 패턴(outline-none + focus-visible:outline-2/offset-2/solid)을 따른다.
// outline-solid 가 없으면 outline-none 이 남긴 --tw-outline-style:none 때문에 선이 그려지지 않는다. [KWCAG 6.1.2]
const linkFocusClassName =
    'outline-ring focus-visible:outline-ring outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid'

export type FooterVariant = 'mainpage' | 'subpage'
type FooterTheme = 'light' | 'dark' | 'mainpage'

// 두 시안(메인 footer_area 325px · 서브 316px)은 구성·문구·간격이 거의 같고, 남는 차이는
// 상단 블록↔카피라이트 줄 간격(메인 40 / 서브 32)·본문 글자 톤·관련사이트 셀렉트 외형뿐이다.
const FOOTER_STYLE = {
    mainpage: {
        root: 'gap-10 pt-10 pb-10',
        topBlock: 'gap-8',
        contactBlock: 'gap-2',
        phoneBlock: 'gap-0',
        phoneRow: 'gap-2',
        // 메인 시안은 어두운 면 위에 모든 글자가 흰색 한 톤이다.
        bodyTone: 'text-foreground',
        // 메인 시안의 관련사이트는 어두운 푸터 위 solid 면(gray.700)이고 테두리를 끈 상태다.
        // muted 가 mainpage·dark 에서 gray.700 으로 반사되므로 dark: 분기 없이 시안값이 그대로 나온다([PB-06]).
        // 테두리는 지우지 않고 투명으로 둬 포커스·열림 상태의 border-primary 표시를 그대로 살린다. [KWCAG 6.1.2]
        familySite: 'bg-muted border-transparent w-70',
    },
    subpage: {
        root: 'gap-8 pt-10 pb-10',
        topBlock: 'gap-8',
        contactBlock: 'gap-2',
        phoneBlock: 'gap-0',
        phoneRow: 'gap-2',
        // 서브 시안은 유틸 링크·운영시간·주소·저작권·셀렉트를 gray.700 으로 한 단계 낮추고,
        // 대표전화 줄만 gray.900 으로 남긴다(그 줄은 아래에서 따로 지정한다).
        bodyTone: 'text-label-foreground',
        // 서브 시안은 흰 면 + 회색 테두리(gray.200)라 Select 기본(bg-surface·border-control)을 그대로 쓴다.
        familySite: 'w-70',
    },
} satisfies Record<FooterVariant, Record<string, string>>

// mainpage 는 메인페이지 푸터, subpage 는 서브페이지의 정보형 푸터다. 구성·문구·유틸 링크는 같고
// 표면색과 FOOTER_STYLE(간격·글자 톤·셀렉트 외형)만 다르다.
type FooterProps = ComponentProps<'footer'> & {
    variant?: FooterVariant
}

type FooterContentProps = FooterProps & {
    portalTheme?: FooterTheme
}

const FooterContent = ({variant = 'mainpage', portalTheme, className, ...props}: FooterContentProps) => {
    const style = FOOTER_STYLE[variant]

    return (
        <footer
            {...props}
            className={cn(
                'border-subtle-3 border-t',
                style.bodyTone,
                variant === 'subpage' ? 'bg-card' : 'bg-background',
                className,
            )}
            aria-label="사이트 정보"
        >
            <div className={cn('content-layout flex flex-col', style.root)}>
                <div className={cn('flex flex-col', style.topBlock)}>
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        {/* KIBO 로고(시안 240×32) — 두 장을 두고 --logo-on-*(globals.css) 로 배경 명도에 맞는 쪽만 표시한다.
                        dark: 변형은 중첩 고정한 테마 미리보기에서 틀린 쪽을 고른다 — Header 와 같은 방식. */}
                        <Link href="#" className={cn('flex w-fit items-center', linkFocusClassName)}>
                            <Image
                                src="/images/logo-kibo.svg"
                                alt="기술보증기금"
                                draggable={false}
                                width={240}
                                height={32}
                                className="[display:var(--logo-on-light)] h-auto w-45 md:w-60"
                            />
                            <Image
                                src="/images/logo-kibo-white.svg"
                                alt="기술보증기금"
                                draggable={false}
                                width={240}
                                height={32}
                                className="[display:var(--logo-on-dark)] h-auto w-45 md:w-60"
                            />
                        </Link>
                        <nav aria-label="푸터 유틸 메뉴">
                            <ul className="flex flex-wrap items-center gap-6">
                                {UTILITY_LINKS.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                link.emphasized ? 'typo-body-xl-bold' : 'typo-body-xl-regular',
                                                linkFocusClassName,
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className={cn('flex flex-col', style.contactBlock)}>
                        <div className={cn('flex flex-col', style.phoneBlock)}>
                            {/* 대표전화 줄만 본문보다 진한 톤이다 — 서브 시안은 본문 gray.700 · 이 줄 gray.900,
                            메인 시안은 두 값이 같은 흰색이라 어느 쪽에서도 시안과 어긋나지 않는다. */}
                            <p className={cn('text-foreground flex flex-wrap items-baseline', style.phoneRow)}>
                                <span className="typo-title-m-bold">대표전화</span>
                                <a href={`tel:${CONTACT.number}`} className={cn('typo-h4-bold', linkFocusClassName)}>
                                    {CONTACT.number}
                                </a>
                            </p>
                            <p className="typo-body-xl-regular">{CONTACT.hours}</p>
                        </div>
                        <p className="typo-body-xl-regular">{CONTACT.address}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <p className="typo-body-l-regular">{CONTACT.copyright}</p>
                    {/* 관련 사이트 — 가이드의 Select 를 그대로 쓴다. 폭과 면 처리는 시안이 variant 별로 달라
                    FOOTER_STYLE.familySite 에서 넘기고, 그 밖의 색은 Select 기본 시맨틱 토큰이 페이지 테마를 따른다. */}
                    <Select>
                        <SelectTrigger aria-label="관련 사이트" className={style.familySite}>
                            <SelectValue placeholder="관련사이트" />
                        </SelectTrigger>
                        {/* Dropdown은 body Portal에 렌더링되므로 가이드의 로컬 테마 스코프를 직접 전달한다.
                        실제 화면은 html의 ThemeProvider 테마를 상속하며 mainpage만 스킨을 명시한다. */}
                        <SelectContent className={portalTheme}>
                            {FAMILY_SITES.map((site) => (
                                <SelectItem key={site.value} value={site.value}>
                                    {site.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </footer>
    )
}

const Footer = ({variant = 'mainpage', ...props}: FooterProps) => (
    <FooterContent variant={variant} portalTheme={variant === 'mainpage' ? 'mainpage' : undefined} {...props} />
)

// 가이드 프리뷰 — Portal로 분리되는 Dropdown까지 고정한 테마로 확인한다.
export const FooterDemo = ({variant = 'mainpage', theme}: {variant?: FooterVariant; theme?: FooterTheme}) => (
    <div className="border-border overflow-hidden rounded-lg border">
        <FooterContent variant={variant} portalTheme={theme ?? (variant === 'mainpage' ? 'mainpage' : undefined)} />
    </div>
)

export default Footer
