'use client'

import Image from 'next/image'
import Link from 'next/link'
import type {ComponentProps} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {cn} from '@/lib/utils'

// Footer 합성 컴포넌트. mainpage/subpage variant와 현재 테마를 따른다.
// 로고는 light/dark 테마에 맞춰 교체한다.

type FooterLink = {label: string; href: string; external?: boolean}

// 푸터 하단 유틸 링크. 개인정보처리방침만 강조한다.
const UTILITY_LINKS: (FooterLink & {emphasized?: boolean})[] = [
    {label: '이용약관', href: '#'},
    {label: '가격 정책', href: '#'},
    {label: '개인정보처리방침', href: '#', emphasized: true},
    {label: '공지사항', href: '#'},
]

// 관련사이트 목록. 선택하면 해당 외부 사이트를 새 창으로 연다.
const FAMILY_SITES = [
    {value: 'cyber-helpdesk', label: '사이버 헬프데스크', href: 'https://www.kibo.or.kr/HELP0101/helpDesk'},
    {value: 'tcb-evaluation', label: 'TCB 평가서', href: 'https://cyber.kibo.or.kr/org/kibo/cbr/mp/main/index.jsp'},
    {
        value: 'non-executive-director',
        label: '비상임이사 전용공간',
        href: 'https://www.kibo.or.kr/dbranch/loginView?referer=/main/board/boardType40?auty=2',
    },
    {value: 'venture-in', label: '벤처공시확인사이트', href: 'http://www.venturein.or.kr/'},
    {value: 'kibo-alumni', label: '기보동우회', href: 'https://www.kibo.or.kr/dongwoo/index'},
    {value: 'kibo-union', label: '노동조합', href: 'http://www.imkibonojo.or.kr/'},
    {value: 'innobiz', label: '이노비즈넷', href: 'https://www.innobiz.net/index.asp'},
    {value: 'ntb', label: 'NTB 기술은행', href: 'http://www.ntb.or.kr/'},
    {value: 'bizinfo', label: '기업마당', href: 'https://www.bizinfo.go.kr/web/index'},
    {value: 'kipa', label: '한국발명진흥회', href: 'http://www.kipa.org/'},
    {value: 'kosbi', label: '중소기업연구원', href: 'https://www.kosbi.re.kr/'},
    {value: 'kocca', label: '한국콘텐츠진흥원', href: 'http://www.kocca.or.kr/'},
    {value: 'kodata', label: '한국기업데이터', href: 'http://www.kodata.co.kr/ci/CIINT01R0'},
    {value: 'nipa', label: '정보통신산업진흥원', href: 'https://www.nipa.kr/index.jsp'},
    {
        value: 'acrc-report',
        label: '국민권익위원회 부패신고',
        href: 'https://www.acrc.go.kr/acrc/board?command=searchDetail&menuId=050201',
    },
]

const handleFamilySiteChange = (value: string) => {
    const site = FAMILY_SITES.find((item) => item.value === value)
    if (site) window.open(site.href, '_blank', 'noopener,noreferrer')
}

const CONTACT = {
    number: '1544-1120',
    hours: '평일 09시 ~ 18시 (토요일 및 공휴일 휴무)',
    address: '48400 부산광역시 남구 문현금융로 33 기술보증기금',
    copyright: 'ⓒ The Government of the Republic of Korea. All rights reserved.',
}

// 링크와 전화번호에 공통 키보드 포커스 스타일을 적용한다.
const linkFocusClassName =
    'outline-ring focus-visible:outline-ring outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid'

export type FooterVariant = 'mainpage' | 'subpage'
type FooterTheme = 'light' | 'dark' | 'mainpage'

// variant별 간격·본문 색상·관련 사이트 Select 스타일.
const FOOTER_STYLE = {
    mainpage: {
        root: 'gap-10 pt-10 pb-10',
        topBlock: 'gap-8',
        contactBlock: 'gap-2',
        phoneBlock: 'gap-0',
        phoneRow: 'gap-2',
        bodyTone: 'text-foreground',
        // mainpage는 어두운 푸터에 맞춘 solid Select를 사용한다.
        familySite: 'bg-muted border-transparent w-70',
    },
    subpage: {
        root: 'gap-8 pt-10 pb-10',
        topBlock: 'gap-8',
        contactBlock: 'gap-2',
        phoneBlock: 'gap-0',
        phoneRow: 'gap-2',
        bodyTone: 'text-label-foreground',
        // subpage는 Select 기본 배경과 테두리를 사용한다.
        familySite: 'w-70',
    },
} satisfies Record<FooterVariant, Record<string, string>>

// mainpage는 메인 푸터, subpage는 서비스 푸터다.
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
                        {/* 현재 테마에 맞는 KIBO 로고만 표시한다. */}
                        <div className="flex w-fit items-center">
                            <span className="sr-only">기술보증기금</span>
                            <Image
                                src="/images/logo-kibo.svg"
                                alt=""
                                draggable={false}
                                width={240}
                                height={32}
                                loading="eager"
                                className="[display:var(--logo-on-light)] h-auto w-45 md:w-60"
                            />
                            <Image
                                src="/images/logo-kibo-white.svg"
                                alt=""
                                draggable={false}
                                width={240}
                                height={32}
                                loading="eager"
                                className="[display:var(--logo-on-dark)] h-auto w-45 md:w-60"
                            />
                        </div>
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
                            {/* 대표전화는 본문보다 진한 톤으로 표시한다. */}
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
                    {/* 관련 사이트를 선택하면 해당 외부 URL을 새 창으로 연다. */}
                    <Select name="familySite" onValueChange={handleFamilySiteChange}>
                        <SelectTrigger aria-label="관련 사이트" className={style.familySite}>
                            <SelectValue placeholder="관련사이트" />
                        </SelectTrigger>
                        {/* Portal로 렌더링되는 드롭다운에 가이드 테마를 전달한다. */}
                        {/* 옵션이 많아도 화면을 넘지 않도록 최대 높이와 내부 스크롤을 적용한다. */}
                        <SelectContent className={cn(portalTheme, 'max-h-[min(60vh,--spacing(120))]')}>
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

// 컴포넌트 가이드에서 드롭다운까지 지정 테마로 확인한다.
export const FooterDemo = ({variant = 'mainpage', theme}: {variant?: FooterVariant; theme?: FooterTheme}) => (
    <div className="border-border overflow-hidden rounded-lg border">
        <FooterContent variant={variant} portalTheme={theme ?? (variant === 'mainpage' ? 'mainpage' : undefined)} />
    </div>
)

export default Footer
