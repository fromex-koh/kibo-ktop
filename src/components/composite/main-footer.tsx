import Image from 'next/image'
import Link from 'next/link'
import type {ComponentProps} from 'react'
import {ArrowUpRight} from 'lucide-react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {Separator} from '@/components/ui/separator'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: shadcn 에 Footer primitive 가 없어 Select·Separator·Link·Image 를 조합한
// 메인페이지 하단 contentinfo 합성 컴포넌트. 시안(type A_01)의 다크 푸터를 그대로 옮긴다.
// 색은 테마(light·dark·mainpage)와 무관하게 고정된 표면이라 main-footer-* 역할 토큰만 사용한다.

const MARQUEE_TEXT = 'Korea Technology-rating Open platform'

type FooterLink = {label: string; href: string; external?: boolean}

type SitemapColumn = {title: string; href: string; external?: boolean; links: FooterLink[]}

// 사이트맵 — 헤더 주 메뉴와 같은 뎁스 구조. 이동 대상 확정 전이라 href 는 목업 값.
const SITEMAP: SitemapColumn[] = [
    {
        title: '플랫폼 소개',
        href: '#',
        links: [
            {label: '플랫폼 소개', href: '#'},
            {label: '기술평가', href: '#'},
            {label: '특허평가', href: '#'},
            {label: 'K-BIGx 보고서', href: '#'},
            {label: '탄소중립', href: '#'},
        ],
    },
    {
        title: '기술평가',
        href: '#',
        links: [
            {label: 'KTRS-FM', href: '#'},
            {label: 'Tech-Index', href: '#'},
            {label: '투자모형', href: '#'},
            {label: '평가결과 조회', href: '#'},
        ],
    },
    {
        title: '특허평가',
        href: '#',
        links: [{label: '특허 등급조회', href: '#'}],
    },
    {
        title: 'K-BIGx 보고서',
        href: '#',
        links: [
            {label: '기업혁신성장보고서 조회', href: '#'},
            {label: '보고서 이력 조회', href: '#'},
        ],
    },
    {
        title: '탄소중립',
        href: '#',
        external: true,
        links: [],
    },
]

// 하단 유틸 링크 — 개인정보처리방침은 시안에서 굵게 강조한다.
const UTILITY_LINKS: (FooterLink & {emphasized?: boolean})[] = [
    {label: '이용약관', href: '#'},
    {label: '가격 정책', href: '#'},
    {label: '개인정보처리방침', href: '#', emphasized: true},
    {label: '공지사항/FAQ', href: '#'},
]

// 관련사이트 목록 — 이동 대상 확정 전 목업 값.
const FAMILY_SITES = [
    {value: 'kibo', label: '기술보증기금'},
    {value: 'mss', label: '중소벤처기업부'},
    {value: 'smes', label: '중소벤처24'},
]

const CONTACT = {
    number: '1544-1120',
    hours: '평일 09시 ~ 18시',
    address: '48400 부산광역시 남구 문현금융로 33 기술보증기금',
    copyright: 'ⓒ The Government of the Republic of Korea. All rights reserved.',
}

// 포커스 링 — 프로젝트 공통 패턴(outline-none + focus-visible:outline-2/offset-2/solid)을 따른다.
// outline-solid 가 없으면 outline-none 이 남긴 --tw-outline-style:none 때문에 선이 그려지지 않는다. [KWCAG 6.1.2]
const linkFocusClassName =
    'focus-visible:outline-main-footer-focus rounded-2xs outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid'

// 마키 밴드 — 시안의 대형 장식 문구가 좌측으로 흐른다.
// 장식이라 접근성 트리에서 제외하고, 감속 모션 선호 시 정지한다. [KWCAG 6.3.1]
const MarqueeBand = () => (
    <div aria-hidden="true" className="overflow-hidden py-16">
        {/* PROJECT-STYLE: 140px 대형 장식 타이포는 typo 스케일 밖의 화면 고유 그래픽 요소라
            clamp arbitrary 값을 제한적으로 사용한다(다른 화면에서 재사용 시 토큰 승격). */}
        <div className="main-marquee flex w-max">
            <span className="text-main-footer-foreground/10 text-[clamp(4rem,7.3vw,8.75rem)] leading-[1.4] font-black whitespace-nowrap">
                {MARQUEE_TEXT}&nbsp;&nbsp;&nbsp;
            </span>
            <span className="text-main-footer-foreground/10 text-[clamp(4rem,7.3vw,8.75rem)] leading-[1.4] font-black whitespace-nowrap">
                {MARQUEE_TEXT}&nbsp;&nbsp;&nbsp;
            </span>
        </div>
    </div>
)

type MainFooterProps = ComponentProps<'footer'> & {showMarquee?: boolean}

const MainFooter = ({showMarquee = true, className, ...props}: MainFooterProps) => (
    <footer
        {...props}
        className={cn('bg-main-footer-background text-main-footer-foreground', className)}
        aria-label="사이트 정보"
    >
        {showMarquee && <MarqueeBand />}

        {/* 시안 간격 — 마키 아래 60px, 로고와 사이트맵 사이 80px, 구분선 위아래 32px, 하단 40px */}
        <div className="content-layout flex flex-col gap-8 pt-12 pb-10 md:pt-15">
            <div className="flex flex-col gap-10 md:gap-20">
                {/* 다크 표면 전용 KIBO 기술보증기금 로고(시안 240×32) */}
                <Link href="#" className={cn('flex w-fit items-center', linkFocusClassName)}>
                    <Image
                        src="/images/logo-white.svg"
                        alt="기술보증기금"
                        width={240}
                        height={32}
                        className="h-auto w-45 md:w-60"
                    />
                </Link>

                <div className="flex flex-col gap-10 xl:flex-row xl:justify-between">
                    <nav aria-label="사이트맵" className="flex flex-wrap gap-x-15 gap-y-8">
                        {SITEMAP.map((column) => (
                            <div key={column.title} className="flex flex-col gap-6">
                                <h2 className="typo-body-xl-bold">
                                    <Link
                                        href={column.href}
                                        className={cn('inline-flex items-center gap-1', linkFocusClassName)}
                                    >
                                        {column.title}
                                        {column.external && (
                                            <ArrowUpRight aria-hidden="true" className="size-icon-sm shrink-0" />
                                        )}
                                        {column.external && <span className="sr-only">새 창 열림</span>}
                                    </Link>
                                </h2>
                                {!!column.links.length && (
                                    <ul className="flex flex-col gap-4">
                                        {column.links.map((link) => (
                                            <li key={link.label}>
                                                <Link
                                                    href={link.href}
                                                    className={cn(
                                                        'typo-body-l-medium text-main-footer-muted hover:text-main-footer-foreground',
                                                        linkFocusClassName,
                                                    )}
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="flex flex-col gap-5">
                        <h2 className="typo-body-xl-bold">대표전화</h2>
                        <div className="flex flex-col gap-1">
                            <p className="typo-h1-bold">
                                <a href={`tel:${CONTACT.number}`} className={cn('inline-block', linkFocusClassName)}>
                                    {CONTACT.number}
                                </a>
                            </p>
                            <p className="typo-body-l-regular text-main-footer-muted">{CONTACT.hours}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="border-main-footer-border" />

            <div className="flex flex-col gap-5">
                <nav aria-label="이용 정보">
                    <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
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

                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="typo-body-l-regular flex flex-col">
                        <p>{CONTACT.address}</p>
                        <p>{CONTACT.copyright}</p>
                    </div>

                    {/* 관련 사이트 — 구조·크기는 가이드의 Select 를 그대로 쓰고, 다크 푸터 표면의 색상만
                        main-footer-* 시맨틱 토큰으로 연결한다. */}
                    <Select>
                        <SelectTrigger
                            aria-label="관련 사이트"
                            className="border-main-footer-control bg-main-footer-surface text-main-footer-foreground data-placeholder:text-main-footer-placeholder focus-visible:border-main-footer-focus focus-visible:outline-main-footer-focus data-[state=open]:border-main-footer-focus data-[state=open]:outline-main-footer-focus [&_svg]:text-main-footer-foreground w-full md:max-w-70"
                        >
                            <SelectValue placeholder="관련사이트" />
                        </SelectTrigger>
                        <SelectContent className="bg-main-footer-popover text-main-footer-popover-foreground ring-main-footer-control">
                            {FAMILY_SITES.map((site) => (
                                <SelectItem
                                    key={site.value}
                                    value={site.value}
                                    className="focus:bg-main-footer-accent focus:text-main-footer-accent-foreground not-data-[variant=destructive]:focus:**:text-main-footer-accent-foreground"
                                >
                                    {site.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    </footer>
)

// 가이드 프리뷰 — 마키는 화면 폭 전체를 흐르는 장식이라 데모에서는 감춘다.
export const MainFooterDemo = () => (
    <div className="border-border overflow-hidden rounded-lg border">
        <MainFooter showMarquee={false} />
    </div>
)

export default MainFooter
