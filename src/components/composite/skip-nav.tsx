import type {MouseEvent} from 'react'

// 반복 영역(헤더·사이드 내비)을 건너뛰는 스킵 링크. [KWCAG 6.4.1]
// 평소엔 화면 위(top 밖)로 숨어 있다가, 키보드 Tab 으로 포커스되면 위→아래로 슬라이드해 나타난다.
// flow 에 끼어들지 않는 오버레이(fixed)라 헤더를 밀지 않고, sticky 헤더 위에 그리기 위해
// z-skiplink 토큰(레이어 최상단)을 쓴다 — z-index 하드코딩 아님. [CD-002]
// onSelect: 기본 앵커 이동 외 추가 처리가 필요할 때(예: 닫힌 드로어를 열고 포커스 이동).
export type SkipLinkItem = {
    href: string
    label: string
    onSelect?: (event: MouseEvent<HTMLAnchorElement>) => void
}

const SkipNav = ({links}: {links: readonly SkipLinkItem[]}) => (
    <nav aria-label="바로가기">
        {links.map((link) => (
            <a
                key={link.href}
                href={link.href}
                onClick={link.onSelect}
                className="bg-foreground text-background focus-visible:ring-ring focus-visible:ring-offset-background z-skiplink fixed top-3 left-3 -translate-y-20 rounded-md px-4 py-2 font-semibold transition-transform duration-200 ease-out focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
                {link.label}
            </a>
        ))}
    </nav>
)

export default SkipNav
