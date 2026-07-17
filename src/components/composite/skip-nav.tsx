import type {MouseEvent} from 'react'
import {buttonVariants} from '@/components/ui/button'
import {cn} from '@/lib/utils'

export type SkipLinkItem = {
    href: string
    label: string
    onSelect?: (event: MouseEvent<HTMLAnchorElement>) => void
}

// PROJECT-COMPOSITE: 반복 영역 건너뛰기 링크(KWCAG 6.4.1). 페이지 내부 이동이라 anchor를 유지하고,
// Button default/medium 스타일을 재사용하되 고대비 색은 foreground/background 표준 슬롯으로 반전한다.
const SkipNav = ({links}: {links: readonly SkipLinkItem[]}) => (
    <nav aria-label="바로가기">
        {links.map((link) => (
            <a
                key={link.href}
                href={link.href}
                onClick={link.onSelect}
                className={cn(
                    buttonVariants({variant: 'default', size: 'lg'}),
                    'z-skiplink border-foreground bg-foreground text-background hover:bg-foreground active:bg-foreground fixed top-3 left-3 -translate-y-20 transition-transform duration-200 ease-out focus:translate-y-0 motion-reduce:transition-none',
                )}
            >
                {link.label}
            </a>
        ))}
    </nav>
)

export default SkipNav
