import {Info, LayoutGrid, type LucideIcon} from 'lucide-react'

// [퍼블리싱 가이드 전용] 이 파일은 퍼블리싱 시작 페이지와 /component-guide 예시에서만 사용한다.
// 해당 페이지를 이식하지 않으면 파일 전체를 삭제할 수 있다.

// 컴포넌트 가이드(/component-guide)의 사이드 내비게이션 = 화면 내 섹션(#s-*) 목차.
// 사이드바 레이아웃을 쓰는 가이드 페이지와 레이아웃 데모가 같은 목차를 공유하도록 한 곳에 둔다.
// 섹션을 추가·리네임하면 여기 href(#s-*)와 페이지의 aria-labelledby id 를 함께 맞춘다.

// external: true 면 새 창(target=_blank)으로 여는 링크(사이드바 콘텐츠 밖에서 봐야 하는 독립 화면).
export type GuideNavItem = {label: string; href: string; external?: boolean; assistiveSuffix?: string}
export type GuideNavItemGroup = {
    title: string
    items?: GuideNavItem[]
    groups?: GuideNavItemGroup[]
}
// icon: 사이드 상위 메뉴(섹션) 아이콘의 '키'. 실제 lucide 컴포넌트는 클라이언트(sidebar-layout)에서
// 매핑한다 — 컴포넌트(메서드 있는 객체)는 서버→클라이언트 prop 경계를 못 넘으므로 직렬화 가능한 문자열로 둔다.
export type GuideNavIconKey = 'project' | 'primitive' | 'semantic' | 'effect' | 'layout' | 'component'
export type GuideNavSection = {
    title: string
    icon: GuideNavIconKey
    items?: GuideNavItem[]
    groups?: GuideNavItemGroup[]
}

export const GUIDE_NAV_SECTIONS: readonly GuideNavSection[] = [
    {
        title: '프로젝트',
        icon: 'project',
        items: [
            {label: 'Open Graph', href: '/component-guide/open-graph'},
            {label: '명도 대비 확인', href: '/component-guide/contrast-check'},
        ],
    },
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
            {label: '모션 (Motion)', href: '/component-guide/motion'},
        ],
    },
    {
        title: '레이아웃',
        icon: 'layout',
        items: [
            {label: '브레이크포인트 (Breakpoint)', href: '/component-guide/breakpoint'},
            {label: '레이아웃 그리드 (Grid)', href: '/component-guide/grid'},
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
                groups: [
                    {
                        title: '공통 폼 컨트롤',
                        items: [
                            {label: 'Label', href: '/component-guide/label'},
                            {label: 'FieldLabel', href: '/component-guide/field-label'},
                            {label: 'Button', href: '/component-guide/button', assistiveSuffix: ' 컴포넌트 가이드'},
                            {label: 'Input', href: '/component-guide/input'},
                            {label: 'Textarea', href: '/component-guide/textarea'},
                            {label: 'Select', href: '/component-guide/select'},
                            {label: 'Combobox', href: '/component-guide/combobox'},
                            {label: 'DatePicker', href: '/component-guide/date-picker'},
                            {label: 'Checkbox', href: '/component-guide/checkbox'},
                            {label: 'Radio', href: '/component-guide/radio'},
                            {label: 'Switch', href: '/component-guide/switch'},
                        ],
                    },
                    {
                        title: '프로젝트 폼 패턴',
                        items: [
                            {label: 'Chip', href: '/component-guide/chip'},
                            {label: 'QuestionGroupHeader', href: '/component-guide/question-group-header'},
                            {label: 'QuestionList', href: '/component-guide/question-list'},
                            {label: 'SelectableCard', href: '/component-guide/selectable-card'},
                            {label: 'Segmented Control', href: '/component-guide/segmented-control'},
                            {label: 'ConsentList', href: '/component-guide/consent-list'},
                            {label: 'SearchBar', href: '/component-guide/search-bar'},
                            {label: 'SearchFilterForm', href: '/component-guide/search-filter-form'},
                        ],
                    },
                ],
            },
            {
                title: '페이지 구조',
                items: [
                    {label: 'SubPageLayout', href: '/component-guide/sub-page-layout'},
                    {label: 'MainPageLayout', href: '/component-guide/main-page-layout'},
                    {label: 'Header', href: '/component-guide/header'},
                    {label: 'FullPageServiceStatus', href: '/component-guide/full-page-service-status'},
                    {label: 'ViewportFitLayout', href: '/component-guide/viewport-fit-layout'},
                    {label: 'StickySidebar', href: '/component-guide/sticky-sidebar'},
                    {label: 'Footer', href: '/component-guide/footer'},
                    {label: 'PageTitleBar', href: '/component-guide/page-title-bar'},
                    {label: 'Breadcrumb', href: '/component-guide/breadcrumb'},
                    {label: 'Pagination', href: '/component-guide/pagination'},
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
                    {label: 'StepProgress', href: '/component-guide/step-progress'},
                    {label: 'ActionBar', href: '/component-guide/action-bar'},
                    {label: 'StepNavigation', href: '/component-guide/step-navigation'},
                ],
            },
            {
                title: '컨테이너',
                items: [
                    {label: 'BaseCard', href: '/component-guide/base-card'},
                    {label: 'FormCard', href: '/component-guide/form-card'},
                    {label: 'OptionCard', href: '/component-guide/option-card'},
                    {label: 'Separator', href: '/component-guide/separator'},
                ],
            },
            {
                title: '탭',
                items: [
                    {label: 'FormTabs', href: '/component-guide/form-tabs'},
                    {label: 'Tabs', href: '/component-guide/tabs'},
                ],
            },
            {
                title: '펼침',
                items: [{label: 'Accordion', href: '/component-guide/accordion'}],
            },
            {
                title: '데이터 표시',
                items: [
                    {label: 'ProgressBar', href: '/component-guide/progress-bar'},
                    {label: 'Chart', href: '/component-guide/chart'},
                    {label: 'Skeleton / ChartSkeleton', href: '/component-guide/skeleton'},
                    {label: 'Table', href: '/component-guide/table'},
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
                    {label: 'ActionCheck', href: '/component-guide/action-check'},
                    {label: 'Alert', href: '/component-guide/alert'},
                    {label: 'InfoBox', href: '/component-guide/info-box'},
                    {label: 'Toast', href: '/component-guide/toast'},
                    {label: 'Dialog', href: '/component-guide/dialog'},
                ],
            },
        ],
    },
]

// checkbox·radio·switch 등 horizontal Field 예시의 wrapper 포커스링.
export const FIELD_FOCUS_RING =
    'data-[orientation=horizontal]:has-[:focus-visible]:outline-2 data-[orientation=horizontal]:has-[:focus-visible]:outline-solid data-[orientation=horizontal]:has-[:focus-visible]:outline-ring data-[orientation=horizontal]:has-[:focus-visible]:outline-offset-2 data-[orientation=horizontal]:[&_:focus-visible]:outline-none has-[[data-slot=checkbox]]:rounded-2xs has-[[data-slot=radio-group-item]]:rounded-full has-[[data-slot=switch]]:rounded-full has-[[data-slot=field-content]]:rounded-sm'

export const SELF_DIAGNOSIS_STEPS = [
    '고객 정보 활용 동의',
    '기업·기술정보 입력',
    '체크리스트 입력',
    '제출 완료',
] as const

// 퍼블리싱 시작 페이지의 콘텐츠 JSON 아이콘 이름을 실제 lucide 컴포넌트로 연결한다.
export const ICON_REGISTRY = {
    Info,
    LayoutGrid,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICON_REGISTRY

export const isIconName = (value: string): value is IconName =>
    Object.keys(ICON_REGISTRY).some((name) => name === value)

// 기존 퍼블리싱 가이드 import 호환성을 위해 사이트 설정을 재-export한다.
export {
    REPOSITORY_URL,
    SITE_ALLOW_INDEXING,
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_OG_IMAGE,
    SITE_OG_IMAGE_ALT,
    SITE_SHORT_NAME,
    SITE_URL,
} from './site'

// /component-guide/main-page 예시에서 tokens.css 의 .mainpage 스킨을 강제 적용한다.
// 가이드 페이지를 이식하지 않으면 theme-provider.tsx 의 관련 분기와 함께 삭제한다.
export const MAIN_PAGE_THEME = 'mainpage'
export const MAIN_PAGE_PATH = '/component-guide/main-page'
