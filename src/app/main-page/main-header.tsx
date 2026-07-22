'use client'

import Image from 'next/image'
import Link from 'next/link'
import {ExternalLink, Menu} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import {Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet'
import {cn} from '@/lib/utils'

// 메인페이지 목업 전용 헤더 — composite/header 패턴을 따르되, 어두운 히어로 비주얼 위에
// 투명 배경으로 얹히는 시안이라 공용 Header(bg-card)와 분리해 페이지 안에 둔다.
// 텍스트 색은 mainpage 스킨(다크 기반, html 클래스로 강제)이 시맨틱 토큰으로 밝게 뒤집는다 —
// body로 포털되는 Sheet 콘텐츠도 html 하위라 같은 스킨을 따른다.
// 스크롤 스택 전환 동안 항상 보여야 하므로 뷰포트에 fixed로 고정한다(시안 1·2 프레임 모두 헤더 노출).
const NAV_LINKS: {label: string; external?: boolean}[] = [
    {label: '플랫폼 소개'},
    {label: '기술평가'},
    {label: '특허평가'},
    {label: 'K-BIGx 보고서'},
    {label: '탄소중립', external: true},
]

const UTILITY_LINKS: {label: string; external?: boolean}[] = [
    {label: '로그인/회원가입'},
    {label: '이용안내'},
    {label: '기술보증기금', external: true},
]

// 목업 고정 상태 — 화면 유형 전환 동작은 실제 헤더(composite/header)의 MemberTypeNavigation이 담당.
const MemberTypeToggle = () => (
    <SegmentedControl type="link" aria-label="화면 유형">
        <SegmentedControlItem href="?audience=corp" replace scroll={false} aria-current="page">
            기업
        </SegmentedControlItem>
        <SegmentedControlItem href="?audience=org" replace scroll={false}>
            기관
        </SegmentedControlItem>
    </SegmentedControl>
)

const UtilityLink = ({label, external, className}: {label: string; external?: boolean; className?: string}) => (
    <Button
        variant="text"
        size="lg"
        asChild
        className={cn('tracking-control-label font-medium', external ? 'gap-0.5' : undefined, className)}
    >
        <Link href="#" {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
            {label}
            {external ? <ExternalLink aria-hidden="true" className="size-icon-sm" /> : null}
        </Link>
    </Button>
)

// 어두운 비주얼 위 고정 헤더라 로고는 테마와 무관하게 다크용(흰색) 에셋만 쓴다.
const Logo = () => (
    <h1>
        <Link href="#" className="flex items-center">
            <Image
                src="/images/logo-dark.svg"
                alt="기술보증기금"
                width={140}
                height={32}
                priority
                className="h-auto w-30"
            />
        </Link>
    </h1>
)

const MainHeader = () => (
    <header className="z-header fixed inset-x-0 top-0">
        {/* content-layout: 넓은 화면에선 섹션(grid-layout)의 1200 콘텐츠 라인과 정확히 정렬되고,
            뷰포트가 그보다 줄면 그리드 가장자리 여백이 좌우 똑같이 남는다. grid-layout 을 그대로
            쓰지 않는 이유: md 티어의 좁은 컨테이너(792)가 적용되면 GNB 가 줄바꿈된다.
            box-content + px-2: 아이콘 버튼의 내부 여백(8px) 시각 보정을 위해 셸 양옆에 8px 패딩 존을
            둔다 — 콘텐츠 박스(정렬선)는 그대로 두고 테두리 박스만 넓혀, 버튼이 부모 밖으로 삐져나가지
            않으면서 글리프가 콘텐츠 라인에 정렬된다. */}
        <div className="content-layout box-content px-2">
            <div className="-mx-2 flex flex-col">
                {/* 행 px-2: 셸 패딩 존을 행 안쪽 패딩으로 되돌려, 일반 요소는 콘텐츠 라인에 정렬되고
                    음수 마진 요소(메뉴 버튼)만 패딩 존을 쓴다 */}
                <div className="hidden justify-end px-2 md:flex">
                    <div className="flex items-center gap-4 py-2">
                        <MemberTypeToggle />
                        {UTILITY_LINKS.map((link) => (
                            <UtilityLink key={link.label} {...link} />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-10 px-2 py-3">
                    <Logo />

                    <nav aria-label="주 메뉴" className="hidden md:block">
                        <ul className="flex items-center gap-10">
                            {NAV_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href="#"
                                        {...(link.external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                                        className="typo-title-xl-bold focus-visible:ring-ring text-foreground flex min-h-11 items-center gap-1 whitespace-nowrap focus:outline-none focus-visible:ring-2"
                                    >
                                        {link.label}
                                        {link.external ? (
                                            <ExternalLink aria-hidden="true" className="size-icon-lg" />
                                        ) : null}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* 메인페이지는 mainpage 스킨이 강제되는 화면이라 라이트/다크 토글을 두지 않는다.
                        Sheet 루트는 DOM을 만들지 않으므로 버튼이 행의 직접 flex 아이템이다 —
                        icon-sm 버튼(36px 박스·20px 아이콘)의 내부 여백 8px를 음수 마진으로 상쇄해
                        글리프를 콘텐츠 라인에 정렬하되, 버튼 박스는 행의 px-2 패딩 존 안에 머문다 */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="전체 메뉴 열기"
                                className="-mr-2 ml-auto"
                            >
                                <Menu aria-hidden="true" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="gap-0 data-[side=left]:w-fit data-[side=right]:w-fit">
                            <SheetHeader>
                                <SheetTitle>전체 메뉴</SheetTitle>
                            </SheetHeader>

                            <div className="px-4 pb-2">
                                <MemberTypeToggle />
                            </div>

                            <nav aria-label="전체 메뉴" className="flex flex-col gap-1 px-4">
                                {NAV_LINKS.map((link) => (
                                    <SheetClose asChild key={link.label}>
                                        <Link
                                            href="#"
                                            className="typo-title-m-semibold hover:bg-muted focus-visible:ring-ring flex min-h-11 items-center gap-1 rounded-md px-3 focus:outline-none focus-visible:ring-2"
                                        >
                                            {link.label}
                                            {link.external ? (
                                                <ExternalLink aria-hidden="true" className="size-icon-sm" />
                                            ) : null}
                                        </Link>
                                    </SheetClose>
                                ))}
                            </nav>

                            <div className="border-border mt-4 flex flex-col gap-1 border-t px-4 pt-4">
                                {UTILITY_LINKS.map((link) => (
                                    <SheetClose asChild key={link.label}>
                                        <UtilityLink
                                            {...link}
                                            className="not-disabled:hover:bg-navy-50 not-disabled:hover:text-navy-600 min-h-11 w-full justify-start rounded-md px-3"
                                        />
                                    </SheetClose>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    </header>
)

export default MainHeader
