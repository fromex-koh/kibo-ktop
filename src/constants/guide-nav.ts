// 컴포넌트 가이드(/component-guide)의 사이드 내비게이션 = 화면 내 섹션(#s-*) 목차.
// 사이드바 레이아웃을 쓰는 가이드 페이지와 레이아웃 데모가 같은 목차를 공유하도록 한 곳에 둔다.
// 섹션을 추가·리네임하면 여기 href(#s-*)와 페이지의 aria-labelledby id 를 함께 맞춘다.

// external: true 면 새 창(target=_blank)으로 여는 링크(사이드바 콘텐츠 밖에서 봐야 하는 독립 화면).
export type GuideNavItem = {label: string; href: string; external?: boolean}
export type GuideNavItemGroup = {title: string; items: GuideNavItem[]}
// icon: 사이드 상위 메뉴(섹션) 아이콘의 '키'. 실제 lucide 컴포넌트는 클라이언트(sidebar-layout)에서
// 매핑한다 — 컴포넌트(메서드 있는 객체)는 서버→클라이언트 prop 경계를 못 넘으므로 직렬화 가능한 문자열로 둔다.
export type GuideNavIconKey = 'primitive' | 'semantic' | 'effect' | 'layout' | 'component'
export type GuideNavSection = {
    title: string
    icon: GuideNavIconKey
    items?: GuideNavItem[]
    groups?: GuideNavItemGroup[]
}

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
        title: 'Semantic (의미)',
        icon: 'semantic',
        items: [
            {label: '색상 (Color)', href: '/component-guide/semantic-color'},
            {label: '타이포그래피 (Typography)', href: '/component-guide/typography'},
        ],
    },
    {
        title: '형태·효과',
        icon: 'effect',
        items: [
            {label: '모서리 반경 (Radius)', href: '/component-guide/radius'},
            {label: '그림자 (Shadow)', href: '/component-guide/shadow'},
            {label: '흐림 (Blur)', href: '/component-guide/blur'},
            {label: '오버레이 (Overlay)', href: '/component-guide/overlay'},
        ],
    },
    {
        title: '레이아웃',
        icon: 'layout',
        items: [
            {label: '브레이크포인트 (Breakpoint)', href: '/component-guide/breakpoint'},
            {label: '레이아웃 그리드 (Grid)', href: '/component-guide/grid', external: true},
            {label: '간격 (Spacing)', href: '/component-guide/spacing'},
            {label: '쌓임 순서 (Z-index)', href: '/component-guide/z-index'},
        ],
    },
    {
        title: '컴포넌트',
        icon: 'component',
        groups: [
            {
                title: '폼 요소',
                items: [
                    {label: 'Label', href: '/component-guide/label'},
                    {label: 'FieldLabel', href: '/component-guide/field-label'},
                    {label: 'Button', href: '/component-guide/button'},
                    {label: 'Input', href: '/component-guide/input'},
                    {label: 'Textarea', href: '/component-guide/textarea'},
                    {label: 'Select', href: '/component-guide/select'},
                    {label: 'Combobox', href: '/component-guide/combobox'},
                    {label: 'DatePicker', href: '/component-guide/date-picker'},
                    {label: 'Checkbox', href: '/component-guide/checkbox'},
                    {label: 'Radio', href: '/component-guide/radio'},
                    {label: 'Chip', href: '/component-guide/chip'},
                    {label: 'QuestionGroupHeader', href: '/component-guide/question-group-header'},
                    {label: 'QuestionList', href: '/component-guide/question-list'},
                    {label: 'SelectableCard', href: '/component-guide/selectable-card'},
                    {label: 'Segmented Control', href: '/component-guide/segmented-control'},
                    {label: 'SearchBar', href: '/component-guide/search-bar'},
                    {label: 'Switch', href: '/component-guide/switch'},
                ],
            },
            {
                title: '페이지 구조',
                items: [
                    {label: 'Header', href: '/component-guide/header'},
                    {label: 'PageTitleBar', href: '/component-guide/page-title-bar'},
                    {label: 'Breadcrumb', href: '/component-guide/breadcrumb'},
                    {label: 'SkipNav', href: '/component-guide/skip-nav'},
                    {label: 'ScrollToTopButton', href: '/component-guide/scroll-to-top-button'},
                ],
            },
            {
                title: '섹션 구조',
                items: [
                    {label: 'SectionHeader', href: '/component-guide/section-header'},
                    {label: 'SubSectionHeader', href: '/component-guide/sub-section-header'},
                    {label: 'StepHeader', href: '/component-guide/step-header'},
                    {label: 'Stepper', href: '/component-guide/stepper'},
                    {label: 'ActionBar', href: '/component-guide/action-bar'},
                ],
            },
            {
                title: '컨테이너',
                items: [
                    {label: 'BaseCard', href: '/component-guide/base-card'},
                    {label: 'FormCard', href: '/component-guide/form-card'},
                    {label: 'Separator', href: '/component-guide/separator'},
                ],
            },
            {
                title: '탭',
                items: [
                    {label: 'TabCard', href: '/component-guide/tab-card'},
                    {label: 'Tabs', href: '/component-guide/tabs'},
                ],
            },
            {
                title: '데이터 표시',
                items: [
                    {label: 'ReviewList', href: '/component-guide/review-list'},
                    {label: 'SummaryList', href: '/component-guide/summary-list'},
                    {label: 'SelectableSummaryList', href: '/component-guide/selectable-summary-list'},
                ],
            },
            {
                title: '디자인 요소',
                items: [
                    {label: 'Icon', href: '/component-guide/icon'},
                    {label: 'ListMarker', href: '/component-guide/list-marker'},
                    {label: 'Badge', href: '/component-guide/badge'},
                ],
            },
            {
                title: '피드백 / 오버레이',
                items: [
                    {label: 'Alert', href: '/component-guide/alert'},
                    {label: 'Dialog', href: '/component-guide/dialog'},
                ],
            },
        ],
    },
]
