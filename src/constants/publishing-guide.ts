import {Info, LayoutGrid, type LucideIcon} from 'lucide-react'

// [퍼블리싱 가이드 전용] 이 파일은 퍼블리싱 시작 페이지와 /component-guide 예시에서만 사용한다.
// 해당 페이지를 이식하지 않으면 파일 전체를 삭제할 수 있다.

// 컴포넌트 가이드(/component-guide)의 사이드 내비게이션 = 화면 내 섹션(#s-*) 목차.
// 사이드바 레이아웃을 쓰는 가이드 페이지와 레이아웃 데모가 같은 목차를 공유하도록 한 곳에 둔다.
// 섹션을 추가·리네임하면 여기 href(#s-*)와 페이지의 aria-labelledby id 를 함께 맞춘다.

// external: true 면 새 창(target=_blank)으로 여는 링크(사이드바 콘텐츠 밖에서 봐야 하는 독립 화면).
// layers: 그 가이드가 다루는 컴포넌트가 src/components 의 어느 폴더에 있는지. 가이드 화면 제목 옆 배지로 나온다.
// 컴포넌트 하나를 다루는 가이드에만 적는다(토큰 · 패턴 문서에는 적지 않는다).
// shadcn/ui 부품을 감싸거나 조합해 만든 컴포넌트는 composite 하나만 적는다 — composite 의 정의가 곧 '합성'이다.
// 두 개를 적는 것은 한 가이드가 서로 다른 폴더의 컴포넌트를 함께 다룰 때뿐이다(예: Input = ui 의 Input + composite 의 ClearableInput).
export type ComponentLayer = 'ui' | 'theme' | 'composite' | 'custom'
export type GuideNavItem = {
    label: string
    href: string
    external?: boolean
    assistiveSuffix?: string
    layers?: readonly ComponentLayer[]
}
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
            {label: '접근성 검사 예외사항', href: '/component-guide/accessibility-exceptions'},
            {label: '버전 업데이트 아카이브', href: '/component-guide/release-archive'},
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
                            {label: 'Label', href: '/component-guide/label', layers: ['ui']},
                            {label: 'FieldLabel', href: '/component-guide/field-label', layers: ['ui']},
                            {
                                label: 'Button',
                                href: '/component-guide/button',
                                assistiveSuffix: ' 컴포넌트 가이드',
                                layers: ['ui'],
                            },
                            {label: 'Input', href: '/component-guide/input', layers: ['ui', 'composite']},
                            {label: 'Textarea', href: '/component-guide/textarea', layers: ['ui']},
                            {label: 'Select', href: '/component-guide/select', layers: ['composite']},
                            {label: 'Combobox', href: '/component-guide/combobox', layers: ['composite']},
                            {label: 'DatePicker', href: '/component-guide/date-picker', layers: ['composite']},
                            {label: 'DateField', href: '/component-guide/date-field', layers: ['composite']},
                            {label: 'Checkbox', href: '/component-guide/checkbox', layers: ['ui']},
                            {label: 'Radio', href: '/component-guide/radio', layers: ['ui']},
                            {label: 'Switch', href: '/component-guide/switch', layers: ['composite']},
                        ],
                    },
                    {
                        title: '프로젝트 폼 패턴',
                        // 항목이 많아 비슷한 역할끼리 한 번 더 묶는다.
                        groups: [
                            {
                                title: '필드',
                                items: [
                                    {label: 'Field', href: '/component-guide/form-fields', layers: ['composite']},
                                    {label: 'EmailField', href: '/component-guide/email-field', layers: ['composite']},
                                ],
                            },
                            {
                                title: '파일 첨부',
                                items: [
                                    {label: 'FileUpload', href: '/component-guide/file-upload', layers: ['composite']},
                                    {
                                        label: 'AttachField',
                                        href: '/component-guide/attach-field',
                                        layers: ['composite'],
                                    },
                                ],
                            },
                            {
                                title: '선택',
                                items: [
                                    {label: 'Chip', href: '/component-guide/chip', layers: ['composite']},
                                    {
                                        label: 'SelectableCard',
                                        href: '/component-guide/selectable-card',
                                        layers: ['composite'],
                                    },
                                    {
                                        label: 'SelectableInfoCard',
                                        href: '/component-guide/selectable-info-card',
                                        layers: ['composite'],
                                    },
                                    {
                                        label: 'Segmented Control',
                                        href: '/component-guide/segmented-control',
                                        layers: ['composite'],
                                    },
                                    {
                                        label: 'ConsentList',
                                        href: '/component-guide/consent-list',
                                        layers: ['composite'],
                                    },
                                ],
                            },
                            {
                                title: '문항',
                                items: [
                                    {
                                        label: 'QuestionGroupHeader',
                                        href: '/component-guide/question-group-header',
                                        layers: ['composite'],
                                    },
                                    {
                                        label: 'QuestionList',
                                        href: '/component-guide/question-list',
                                        layers: ['composite'],
                                    },
                                ],
                            },
                            {
                                title: '검색 · 조회',
                                items: [
                                    {label: 'SearchBar', href: '/component-guide/search-bar', layers: ['composite']},
                                    {
                                        label: 'SearchFilterForm',
                                        href: '/component-guide/search-filter-form',
                                        layers: ['composite'],
                                    },
                                    {
                                        label: 'SelectSearchForm',
                                        href: '/component-guide/select-search-form',
                                        layers: ['composite'],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                title: '페이지 구조',
                // 항목이 많아 비슷한 역할끼리 한 번 더 묶는다.
                groups: [
                    {
                        title: '레이아웃',
                        items: [
                            {label: 'SubPageLayout', href: '/component-guide/sub-page-layout', layers: ['composite']},
                            {label: 'MainPageLayout', href: '/component-guide/main-page-layout', layers: ['composite']},
                            {
                                label: 'ViewportFitLayout',
                                href: '/component-guide/viewport-fit-layout',
                                layers: ['composite'],
                            },
                            {
                                label: 'FullPageServiceStatus',
                                href: '/component-guide/full-page-service-status',
                                layers: ['custom'],
                            },
                        ],
                    },
                    {
                        title: '헤더 · 푸터',
                        items: [
                            {label: 'Header', href: '/component-guide/header', layers: ['composite']},
                            {label: 'PageTitleBar', href: '/component-guide/page-title-bar', layers: ['composite']},
                            {label: 'Footer', href: '/component-guide/footer', layers: ['composite']},
                        ],
                    },
                    {
                        title: '사이드바',
                        items: [
                            {label: 'StickySidebar', href: '/component-guide/sticky-sidebar', layers: ['composite']},
                            {
                                label: 'MypageSidebar',
                                href: '/component-guide/mypage-shell',
                                layers: ['composite'],
                            },
                        ],
                    },
                    {
                        title: '내비게이션 · 링크',
                        items: [
                            {label: 'Breadcrumb', href: '/component-guide/breadcrumb', layers: ['composite']},
                            {label: 'Pagination', href: '/component-guide/pagination', layers: ['composite']},
                            {label: 'SkipNav', href: '/component-guide/skip-nav', layers: ['composite']},
                            {
                                label: 'ScrollToTopButton',
                                href: '/component-guide/scroll-to-top-button',
                                layers: ['composite'],
                            },
                            {
                                label: 'NewWindowLink',
                                href: '/component-guide/new-window-link',
                                layers: ['composite'],
                            },
                            {
                                label: 'PrintButton',
                                href: '/component-guide/print-button',
                                layers: ['composite'],
                            },
                        ],
                    },
                ],
            },
            {
                title: '섹션 구조',
                items: [
                    {label: 'SectionHeader', href: '/component-guide/section-header', layers: ['composite']},
                    {label: 'SubSectionHeader', href: '/component-guide/sub-section-header', layers: ['composite']},
                    {label: 'StepHeader', href: '/component-guide/step-header', layers: ['composite']},
                    {label: 'StepProgress', href: '/component-guide/step-progress', layers: ['composite']},
                    {label: 'ActionBar', href: '/component-guide/action-bar', layers: ['composite']},
                    {label: 'StepNavigation', href: '/component-guide/step-navigation', layers: ['composite']},
                ],
            },
            {
                title: '컨테이너',
                items: [
                    {label: 'BaseCard', href: '/component-guide/base-card', layers: ['composite']},
                    {label: 'ServiceIntroBanner', href: '/component-guide/service-intro-banner', layers: ['composite']},
                    {label: 'FormCard', href: '/component-guide/form-card', layers: ['composite']},
                    {label: 'RepeatCard', href: '/component-guide/repeat-card', layers: ['composite']},
                    {label: 'OptionCard', href: '/component-guide/option-card', layers: ['composite']},
                    {label: 'RadioCard', href: '/component-guide/radio-card', layers: ['composite']},
                    {label: 'RadioChip', href: '/component-guide/radio-chip', layers: ['composite']},
                    {label: 'Separator', href: '/component-guide/separator', layers: ['ui']},
                ],
            },
            {
                title: '탭',
                items: [
                    {label: 'FormTabs', href: '/component-guide/form-tabs', layers: ['composite']},
                    {label: 'Tabs', href: '/component-guide/tabs', layers: ['ui']},
                    {label: 'TextTabs', href: '/component-guide/text-tabs', layers: ['composite']},
                ],
            },
            {
                title: '펼침',
                items: [{label: 'Accordion', href: '/component-guide/accordion', layers: ['ui']}],
            },
            {
                title: '데이터 표시',
                groups: [
                    {
                        title: '차트',
                        // 항목이 많아 차트 종류별로 한 번 더 묶는다.
                        groups: [
                            {
                                title: '막대',
                                items: [
                                    {label: 'ColumnChart', href: '/component-guide/column-chart', layers: ['custom']},
                                    {
                                        label: 'GroupedColumnChart',
                                        href: '/component-guide/grouped-column-chart',
                                        layers: ['custom'],
                                    },
                                    {
                                        label: 'PeerColumnChart',
                                        href: '/component-guide/peer-column-chart',
                                        layers: ['custom'],
                                    },
                                    {
                                        label: 'OverlayColumnChart',
                                        href: '/component-guide/overlay-column-chart',
                                        layers: ['custom'],
                                    },
                                    {
                                        label: 'ComboBarLineChart',
                                        href: '/component-guide/combo-bar-line-chart',
                                        layers: ['custom'],
                                    },
                                    {
                                        label: 'ButterflyBarChart',
                                        href: '/component-guide/butterfly-bar-chart',
                                        layers: ['custom'],
                                    },
                                    {
                                        label: 'DivergingRankChart',
                                        href: '/component-guide/diverging-rank-chart',
                                        layers: ['custom'],
                                    },
                                    {
                                        label: 'RatioStackBar',
                                        href: '/component-guide/ratio-stack-bar',
                                        layers: ['custom'],
                                    },
                                ],
                            },
                            {
                                title: '선 · 추이',
                                items: [
                                    {label: 'LineChart', href: '/component-guide/line-chart', layers: ['custom']},
                                    {
                                        label: 'GradeTrendChart',
                                        href: '/component-guide/grade-trend-chart',
                                        layers: ['custom'],
                                    },
                                    {
                                        label: 'GradeHistoryChart',
                                        href: '/component-guide/grade-history-chart',
                                        layers: ['custom'],
                                    },
                                ],
                            },
                            {
                                title: '레이더',
                                items: [
                                    {
                                        label: 'GradeRadarChart',
                                        href: '/component-guide/grade-radar-chart',
                                        layers: ['custom'],
                                    },
                                    {
                                        label: 'ComparisonRadarChart',
                                        href: '/component-guide/comparison-radar-chart',
                                        layers: ['custom'],
                                    },
                                ],
                            },
                            {
                                title: '분포 · 위치',
                                items: [
                                    {
                                        label: 'DistributionCurveChart',
                                        href: '/component-guide/distribution-curve-chart',
                                        layers: ['custom'],
                                    },
                                    {
                                        label: 'GradeDistributionChart',
                                        href: '/component-guide/grade-distribution-chart',
                                        layers: ['custom'],
                                    },
                                    {
                                        label: 'PositioningScatterChart',
                                        href: '/component-guide/positioning-scatter-chart',
                                        layers: ['custom'],
                                    },
                                    {
                                        label: 'RankPyramidChart',
                                        href: '/component-guide/rank-pyramid-chart',
                                        layers: ['custom'],
                                    },
                                ],
                            },
                            {
                                title: '게이지 · 점수',
                                items: [
                                    {
                                        label: 'GradeArcGauge',
                                        href: '/component-guide/grade-arc-gauge',
                                        layers: ['custom'],
                                    },
                                    {
                                        label: 'GradeScaleGauge',
                                        href: '/component-guide/grade-scale-gauge',
                                        layers: ['custom'],
                                    },
                                    {label: 'ScoreGauge', href: '/component-guide/score-gauge', layers: ['custom']},
                                    {
                                        label: 'SemicircleRatingGauge',
                                        href: '/component-guide/semicircle-rating-gauge',
                                        layers: ['custom'],
                                    },
                                    {label: 'ScoreRing', href: '/component-guide/score-ring', layers: ['custom']},
                                    {label: 'SegmentMeter', href: '/component-guide/segment-meter', layers: ['custom']},
                                    {
                                        label: 'PercentageDonutChart',
                                        href: '/component-guide/percentage-donut-chart',
                                        layers: ['custom'],
                                    },
                                ],
                            },
                            {
                                title: '관계 · 흐름 · 표',
                                items: [
                                    {label: 'NetworkGraph', href: '/component-guide/network-graph', layers: ['custom']},
                                    {label: 'ProcessFlow', href: '/component-guide/process-flow', layers: ['custom']},
                                    {label: 'WordCloud', href: '/component-guide/word-cloud', layers: ['custom']},
                                    {label: 'RatingMatrix', href: '/component-guide/rating-matrix', layers: ['custom']},
                                ],
                            },
                            {
                                title: '로딩',
                                items: [
                                    {
                                        label: 'Skeleton / ChartSkeleton',
                                        href: '/component-guide/skeleton',
                                        layers: ['ui', 'composite'],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        title: '표 · 목록 · 상태',
                        items: [
                            {label: 'ProgressBar', href: '/component-guide/progress-bar', layers: ['custom']},
                            {label: 'Table', href: '/component-guide/table', layers: ['custom']},
                            {label: 'ReviewList', href: '/component-guide/review-list', layers: ['composite']},
                            {label: 'HistoryList', href: '/component-guide/history-list', layers: ['composite']},
                            {label: 'EvaluationCard', href: '/component-guide/evaluation-card', layers: ['custom']},
                            {label: 'SummaryList', href: '/component-guide/summary-list', layers: ['composite']},
                            {label: 'InfoTable', href: '/component-guide/info-table', layers: ['composite']},
                            {
                                label: 'SelectableSummaryList',
                                href: '/component-guide/selectable-summary-list',
                                layers: ['composite'],
                            },
                            {label: '목록 패턴 (List)', href: '/component-guide/list-patterns'},
                            {label: 'EmptyState', href: '/component-guide/empty-state', layers: ['composite']},
                            {label: 'PrivateContent', href: '/component-guide/private-content', layers: ['composite']},
                            {label: 'LoadingState', href: '/component-guide/loading-state', layers: ['composite']},
                        ],
                    },
                ],
            },
            {
                title: '디자인 요소',
                items: [
                    {label: 'Icon', href: '/component-guide/icon', layers: ['custom']},
                    {label: 'ListMarker', href: '/component-guide/list-marker', layers: ['custom']},
                    {label: 'Badge', href: '/component-guide/badge', layers: ['ui']},
                    {label: 'ThemeToggle', href: '/component-guide/theme-toggle', layers: ['composite']},
                ],
            },
            {
                title: '피드백 / 오버레이',
                items: [
                    {label: 'ActionCheck', href: '/component-guide/action-check', layers: ['custom']},
                    {label: 'Alert', href: '/component-guide/alert', layers: ['ui']},
                    {label: 'InfoBox', href: '/component-guide/info-box', layers: ['composite']},
                    {label: 'NoticeAccordion', href: '/component-guide/notice-accordion', layers: ['composite']},
                    {label: 'Toast', href: '/component-guide/toast', layers: ['ui', 'custom']},
                    {label: 'CheckToast', href: '/component-guide/check-toast', layers: ['custom']},
                    {label: 'Dialog', href: '/component-guide/dialog', layers: ['ui']},
                    {label: 'HomeNoticePopup', href: '/component-guide/home-notice-popup', layers: ['custom']},
                ],
            },
        ],
    },
]

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

export const MAIN_PAGE_PATH = '/component-guide/main-page'

// 컴포넌트 폴더 배지의 모양 — 가이드 홈의 폴더 카드와 각 가이드 화면의 제목 옆이 같은 배지를 쓴다.
// label 은 배지에 적는 글자다 — ui 폴더는 shadcn/ui 에서 받은 부품이라는 뜻이 드러나게 그 이름으로 적는다.
// description 은 배지에 마우스를 올리거나 초점을 주면 나오는 툴팁 문구다.
export const COMPONENT_LAYER_BADGE = {
    ui: {
        label: 'shadcn/ui',
        color: 'neutral',
        variant: 'solid',
        description: 'shadcn/ui 에서 받은 기본 부품입니다. 구조와 동작은 고치지 않습니다.',
    },
    theme: {
        label: 'theme',
        color: 'error',
        variant: 'solid-pastel',
        description: 'shadcn/ui 부품에 입히는 프로젝트 스타일입니다. 모양은 여기서만 고칩니다.',
    },
    composite: {
        label: 'composite',
        color: 'success',
        variant: 'solid',
        description: 'shadcn/ui 부품을 감싸거나 합쳐 만든 프로젝트 공통 컴포넌트입니다.',
    },
    custom: {
        label: 'custom',
        color: 'secondary-purple',
        variant: 'solid',
        description: '한 화면 · 한 업무를 위해 프로젝트에서 직접 만든 컴포넌트입니다.',
    },
} as const satisfies Record<ComponentLayer, {label: string; color: string; variant: string; description: string}>

const collectNavItems = (group: {items?: GuideNavItem[]; groups?: GuideNavItemGroup[]}): GuideNavItem[] => [
    ...(group.items ?? []),
    ...(group.groups ?? []).flatMap(collectNavItems),
]

// 가이드 주소 → 그 화면이 다루는 컴포넌트의 폴더. 메뉴 목록(GUIDE_NAV_SECTIONS)이 단일 소스다.
export const GUIDE_LAYERS_BY_HREF = new Map<string, readonly ComponentLayer[]>(
    GUIDE_NAV_SECTIONS.flatMap(collectNavItems).flatMap((item) => (item.layers ? [[item.href, item.layers]] : [])),
)
