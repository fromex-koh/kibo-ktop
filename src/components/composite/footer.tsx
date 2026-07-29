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
const UTILITY_LINKS: (FooterLink & {emphasized?: boolean})[] = [
    {label: '이용약관', href: '#'},
    {label: '가격 정책', href: '#'},
    {label: '개인정보처리방침', href: '#', emphasized: true},
    {label: '공지사항', href: '#'},
]

const SUBPAGE_UTILITY_LINKS: (FooterLink & {emphasized?: boolean})[] = [
    {label: '플랫폼 소개', href: '#'},
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

export type FooterVariant = 'default' | 'subpage'

// default 는 메인페이지 푸터, subpage 는 모형선택 화면의 정보형 푸터다. 구성은 거의 같고
// 유틸 링크 목록(default 4개 / subpage 는 '플랫폼 소개' 추가)과 표면색만 다르다.
type FooterProps = ComponentProps<'footer'> & {
    variant?: FooterVariant
}

const Footer = ({variant = 'default', className, ...props}: FooterProps) => {
    const utilityLinks = variant === 'subpage' ? SUBPAGE_UTILITY_LINKS : UTILITY_LINKS

    return (
        <footer
            {...props}
            className={cn(
                'border-subtle-3 text-foreground border-t',
                variant === 'subpage' ? 'bg-card' : 'bg-background',
                className,
            )}
            aria-label="사이트 정보"
        >
            <div className="content-layout flex flex-col gap-16 pt-14 pb-10">
                <div className="flex flex-col gap-12">
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
                                {utilityLinks.map((link) => (
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

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <p className="flex flex-wrap items-baseline gap-4">
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
                    {/* 관련 사이트 — 가이드의 Select 를 그대로 쓴다. 색은 Select 기본 시맨틱 토큰이 페이지 테마를
                    따르므로 별도 색 오버라이드 없이 폭(layout)만 지정한다. */}
                    <Select>
                        <SelectTrigger aria-label="관련 사이트" className="w-47">
                            <SelectValue placeholder="관련사이트" />
                        </SelectTrigger>
                        <SelectContent>
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

// 가이드 프리뷰 — 실제 Footer를 카드 안에서 테마별로 확인한다.
export const FooterDemo = ({variant = 'default'}: {variant?: FooterVariant}) => (
    <div className="border-border overflow-hidden rounded-lg border">
        <Footer variant={variant} />
    </div>
)

export default Footer
