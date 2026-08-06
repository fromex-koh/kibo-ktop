import {KIBO_SITE_URL} from '@/constants/site'

// Header에서 사용하는 사용자 유형과 메뉴 데이터의 단일 원본.
export type UserType = 'corp' | 'org'

export type HeaderNavLink = {
    label: string
    href: string
    external?: boolean
    // 데스크톱 GNB 드롭다운과 모바일 전체 메뉴에서 사용하는 하위 항목.
    items?: readonly HeaderNavLink[]
}

export type HeaderNavigationByUserType = Record<UserType, readonly HeaderNavLink[]>

type MenuServiceItem = string | Pick<HeaderNavLink, 'label' | 'href' | 'external'>
type MenuServiceGroup = {label: string; items: readonly MenuServiceItem[]}
type MenuServiceConfig = {
    groups: readonly MenuServiceGroup[]
    utilityLinks: readonly Pick<HeaderNavLink, 'label' | 'href' | 'external'>[]
}

// K-BIGx 보고서 하위 메뉴. 기관은 대량정보조회를 추가로 제공한다.
const CORP_REPORT_ITEMS: readonly HeaderNavLink[] = [
    {label: '기업혁신성장보고서 조회', href: '#'},
    {label: '보고서 이력 조회', href: '#'},
]

const ORG_REPORT_ITEMS: readonly HeaderNavLink[] = [
    {label: '기업혁신성장보고서 조회', href: '#'},
    {label: '대량정보조회', href: '#'},
    {label: '보고서 이력 조회', href: '#'},
]

// 기업 기술평가·기관 개별평가에서 공통으로 사용하는 하위 메뉴.
const EVALUATION_MODEL_ITEMS: readonly HeaderNavLink[] = [
    {label: 'KTRS-FM', href: '#'},
    {label: 'Tech-Index', href: '#'},
    {label: '투자모형', href: '#'},
    {label: '평가결과 조회', href: '#'},
]

// 기업·기관 공통 플랫폼 소개 하위 메뉴.
const PLATFORM_INTRO_ITEMS: readonly HeaderNavLink[] = [
    {label: '플랫폼 소개', href: '#'},
    {label: '기술평가', href: '#'},
    {label: '특허평가', href: '#'},
    {label: 'K-BIGx 보고서', href: '#'},
    {label: '탄소중립', href: '#'},
]

const PLATFORM_INTRO_LINK: HeaderNavLink = {label: '플랫폼 소개', href: '#', items: PLATFORM_INTRO_ITEMS}
const PATENT_EVALUATION_LINK: HeaderNavLink = {label: '특허평가', href: '#'}
const CARBON_NEUTRAL_LINK: HeaderNavLink = {
    label: '탄소중립',
    href: 'https://www.kibo.or.kr/carbon/home',
    external: true,
}

// 로그인 전 화면에서 사용하는 기본 메뉴. 로그인 후에는 navigationByUserType로 유형별 메뉴를 주입한다.
export const DEFAULT_HEADER_NAVIGATION: HeaderNavigationByUserType = {
    corp: [
        PLATFORM_INTRO_LINK,
        {label: '기술평가', href: '#', items: EVALUATION_MODEL_ITEMS},
        PATENT_EVALUATION_LINK,
        {label: 'K-BIGx 보고서', href: '#', items: CORP_REPORT_ITEMS},
        CARBON_NEUTRAL_LINK,
    ],
    org: [
        PLATFORM_INTRO_LINK,
        {label: '개별평가', href: '#', items: EVALUATION_MODEL_ITEMS},
        {label: '일괄평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#', items: ORG_REPORT_ITEMS},
        PATENT_EVALUATION_LINK,
        CARBON_NEUTRAL_LINK,
    ],
}

const MY_PAGE_ITEMS: Record<UserType, readonly string[]> = {
    corp: ['내 정보', '대표자 이력', '평가결과 조회', 'K-BIGx 보고서 이력', '유료 서비스 관리', '1:1문의내역'],
    org: ['내 정보 수정', '평가이력 조회', 'K-BIGx 보고서 이력', '하위 계정 진행 현황', '1:1 문의 내역'],
}

// 알림마당의 공통 메뉴는 userType에 따라 경로만 바뀐다.
const createNoticeServiceGroup = (userType: UserType): MenuServiceGroup => ({
    label: '알림마당',
    items: [
        {label: '공지사항', href: `/${userType}/notice/announcements`},
        {label: 'FAQ', href: `/${userType}/notice/faq`},
        {label: '문의하기', href: `/${userType}/notice/inquiry-create`},
        {label: '자료실', href: `/${userType}/notice/resources`},
    ],
})

// 추후 외부 URL만 교체할 수 있도록 기술보증기금 링크를 공통 원본으로 관리한다.
const KIBO_EXTERNAL_LINK: Pick<HeaderNavLink, 'label' | 'href' | 'external'> = {
    label: '기술보증기금',
    href: KIBO_SITE_URL,
    external: true,
}

const createAuthenticatedUtilityLinks = (userType: UserType) =>
    [{label: '로그아웃', href: '#'}, {label: '이용안내', href: `/${userType}/guide`}, KIBO_EXTERNAL_LINK] as const

const createMenuServiceConfig = (userType: UserType): MenuServiceConfig => ({
    groups: [{label: '마이페이지', items: MY_PAGE_ITEMS[userType]}, createNoticeServiceGroup(userType)],
    utilityLinks: createAuthenticatedUtilityLinks(userType),
})

// userType별 모바일 서비스 메뉴와 로그인 후 상단 유틸리티 링크.
export const MENU_SERVICE_GROUPS: Record<UserType, MenuServiceConfig> = {
    corp: createMenuServiceConfig('corp'),
    org: createMenuServiceConfig('org'),
}

// 로그인 전 상단 유틸리티 링크.
export const UTILITY_LINKS: readonly Pick<HeaderNavLink, 'label' | 'href' | 'external'>[] = [
    {label: '로그인/회원가입', href: '#'},
    {label: '이용안내', href: '#'},
    KIBO_EXTERNAL_LINK,
]
