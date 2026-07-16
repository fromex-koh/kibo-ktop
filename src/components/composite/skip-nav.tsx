import type {MouseEvent} from 'react'
import {buttonVariants} from '@/components/kit/button'
import {cn} from '@/lib/utils'

export type SkipLinkItem = {
    href: string
    label: string
    onSelect?: (event: MouseEvent<HTMLAnchorElement>) => void
}

// PROJECT-COMPOSITE: 반복 영역 건너뛰기 링크(KWCAG 6.4.1). 페이지 내부 이동이라 anchor를 유지하고,
// Button default/medium 스타일을 재사용하되 SkipNav 전용 배경은 black 유틸리티로 고정한다.
const SkipNav = ({links}: {links: readonly SkipLinkItem[]}) => (
    <nav aria-label="바로가기">
        {links.map((link) => (
            <a
                key={link.href}
                href={link.href}
                onClick={link.onSelect}
                className={cn(
                    buttonVariants({variant: 'default', size: 'medium'}),
                    'z-skiplink fixed top-3 left-3 -translate-y-20 border-black bg-black text-white transition-transform duration-200 ease-out hover:bg-black focus:translate-y-0 active:bg-black motion-reduce:transition-none',
                )}
            >
                {link.label}
            </a>
        ))}
    </nav>
)

export default SkipNav
