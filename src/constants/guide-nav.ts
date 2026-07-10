// 컴포넌트 가이드(/component-guide)의 사이드 내비게이션 = 화면 내 섹션(#s-*) 목차.
// 사이드바 레이아웃을 쓰는 가이드 페이지와 레이아웃 데모가 같은 목차를 공유하도록 한 곳에 둔다.
// 섹션을 추가·리네임하면 여기 href(#s-*)와 페이지의 aria-labelledby id 를 함께 맞춘다.

// external: true 면 새 창(target=_blank)으로 여는 링크(사이드바 콘텐츠 밖에서 봐야 하는 독립 화면).
export type GuideNavItem = {label: string; href: string; external?: boolean}
// icon: 사이드 상위 메뉴(섹션) 아이콘의 '키'. 실제 lucide 컴포넌트는 클라이언트(sidebar-layout)에서
// 매핑한다 — 컴포넌트(메서드 있는 객체)는 서버→클라이언트 prop 경계를 못 넘으므로 직렬화 가능한 문자열로 둔다.
export type GuideNavIconKey = 'primitive' | 'semantic' | 'effect' | 'layout' | 'component'
export type GuideNavSection = {title: string; icon: GuideNavIconKey; items: GuideNavItem[]}

export const GUIDE_NAV_SECTIONS: readonly GuideNavSection[] = [
    {
        title: 'Primitive (원시)',
        icon: 'primitive',
        items: [
            {label: '색상 (Color)', href: '/component-guide/color'},
            {label: '폰트 (Font)', href: '/component-guide/font'},
        ],
    },
    {
        title: 'Semantic · 타이포',
        icon: 'semantic',
        items: [
            {label: '색상 (Color)', href: '/component-guide/semantic-color'},
            {label: '타이포그래피 (typo-*)', href: '/component-guide/typography'},
        ],
    },
    {
        title: '효과',
        icon: 'effect',
        items: [
            {label: '라운드', href: '/component-guide/radius'},
            {label: '그림자', href: '/component-guide/shadow'},
            {label: '흐림', href: '/component-guide/blur'},
            {label: '오버레이', href: '/component-guide/overlay'},
        ],
    },
    {
        title: '레이아웃',
        icon: 'layout',
        items: [
            {label: '브레이크포인트', href: '/component-guide/breakpoint'},
            {label: '레이아웃 그리드', href: '/publishing/grid', external: true},
            {label: '사이드 메뉴 레이아웃', href: '/publishing/sidebar-layout'},
            {label: '간격 (Spacing)', href: '/component-guide/spacing'},
            {label: '레이어 (Z-index)', href: '/component-guide/z-index'},
        ],
    },
    {
        title: '컴포넌트',
        icon: 'component',
        items: [
            {label: 'Icon', href: '/component-guide/icon'},
            {label: 'PageHeader', href: '/component-guide/page-header'},
            {label: 'SectionHeader', href: '/component-guide/section-header'},
            {label: 'SubSectionHeader', href: '/component-guide/sub-section-header'},
            {label: 'Button', href: '/component-guide/button'},
            {label: 'Checkbox', href: '/component-guide/checkbox'},
            {label: 'Radio', href: '/component-guide/radio'},
            {label: 'Card', href: '/component-guide/card'},
            {label: 'Panel', href: '/component-guide/panel'},
            {label: 'Separator', href: '/component-guide/separator'},
        ],
    },
]
