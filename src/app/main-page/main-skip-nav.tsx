'use client'

import SkipNav, {type SkipLinkItem} from '@/components/composite/skip-nav'
import {useStackPagerGoToPage} from './stack-pager'

// 스택 페이지 순서 — 비활성 페이지는 데스크톱에서 inert 라 바로가기 시 해당 페이지를 먼저 활성화한다.
const HERO_PAGE = 0
const TECH_EVAL_PAGE = 1
const SITE_INFO_PAGE = 2

const SKIP_TARGETS = [
    {href: '#hero', label: '본문 바로가기', page: HERO_PAGE},
    {href: '#tech-eval', label: '기술평가 서비스 바로가기', page: TECH_EVAL_PAGE},
    {href: '#site-info', label: '사이트 정보 바로가기', page: SITE_INFO_PAGE},
] as const

// 메인페이지 바로가기 — 데스크톱에서는 문서 스크롤 대신 스택 전환이라 앵커 이동만으로는
// 다른 섹션에 도달할 수 없다. 링크를 누르면 대상 스택 페이지를 활성화한 뒤 기본 앵커 이동으로
// 포커스를 넘긴다(대상에는 tabIndex={-1}). [KWCAG 6.4.1 · 6.1.1]
const MainSkipNav = () => {
    const goToPage = useStackPagerGoToPage()

    const links: SkipLinkItem[] = SKIP_TARGETS.map((target) => ({
        href: target.href,
        label: target.label,
        onSelect: () => goToPage(target.page),
    }))

    return <SkipNav links={links} />
}

export default MainSkipNav
