'use client'

import {useEffect, useState} from 'react'
import {Compass} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {cn} from '@/lib/utils'

// 화면 우측 하단에 떠 있는 퀵메뉴 — 검수자가 화면별 기록과 원인 절을 오갈 때 어디서든 연다.
// 가이드 레이아웃의 "맨 위로" 버튼(right-6 bottom-6)이 보이는 동안에는 그 위에 쌓이고,
// 맨 위로 버튼이 사라지면 그 자리로 내려온다.
// 맨 위로 버튼이 나타나는 기준(scroll-to-top-button.tsx 의 SCROLL_THRESHOLD_PX)과 같은 값이어야 한다.
const SCROLL_TO_TOP_THRESHOLD_PX = 400
type QuickMenuGroup = {label: string; links: readonly {href: string; label: string}[]}

type QuickMenuProps = {
    /** 검사 도구 이름 — 메뉴 머리말과 버튼의 읽어 줄 이름에 쓴다. */
    title: string
    groups: readonly QuickMenuGroup[]
}

const QuickMenu = ({title, groups}: QuickMenuProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrollToTopVisible(window.scrollY > SCROLL_TO_TOP_THRESHOLD_PX)

        handleScroll()
        window.addEventListener('scroll', handleScroll, {passive: true})
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-label={`${title} 바로가기 메뉴`}
                    className={cn(
                        'group z-sticky shadow-1 border-foreground bg-foreground text-background interactive:hover:bg-foreground/85 aria-expanded:bg-foreground outline-ring fixed right-6 min-w-11 gap-0 rounded-full px-3 motion-safe:transition-[bottom] motion-safe:duration-300',
                        isScrollToTopVisible ? 'bottom-20' : 'bottom-6',
                    )}
                >
                    <Compass aria-hidden="true" />
                    {/* 평소에는 아이콘만 보이는 원형 버튼이고, 올리거나 초점을 주거나 메뉴가 열리면 글자가 옆으로 펼쳐진다.
                        버튼 이름은 aria-label 이 읽어 주므로 글자가 접혀 있어도 무엇인지 전달된다. */}
                    <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:ml-2 group-hover:max-w-24 group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-24 group-focus-visible:opacity-100 group-data-[state=open]:ml-2 group-data-[state=open]:max-w-24 group-data-[state=open]:opacity-100 motion-safe:transition-all motion-safe:duration-300">
                        바로가기
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="top"
                align="end"
                sideOffset={8}
                className="z-popover max-h-(--radix-popover-content-available-height) w-80 gap-4 overflow-y-auto p-4"
            >
                <p className="typo-body-m-bold">{title} 바로가기</p>
                <nav aria-label={`${title} 바로가기`} className="flex flex-col gap-4">
                    {groups.map((group) => (
                        <div key={group.label} className="flex flex-col gap-1">
                            <p className="typo-caption-bold text-foreground-subtle">{group.label}</p>
                            <ul className="flex flex-col">
                                {group.links.map((link) => (
                                    <li key={link.href}>
                                        {/* 화면 안 앵커는 a 로 둔다 — 같은 항목을 다시 눌러도 매번 이동한다. */}
                                        <a
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="typo-body-s-medium hover:bg-muted/50 focus-visible:ring-ring block rounded-xs px-2 py-1.5 focus-visible:ring-2 focus-visible:outline-none"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </PopoverContent>
        </Popover>
    )
}

export default QuickMenu
