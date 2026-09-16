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

// 평가모형의 시작 화면은 유형마다 다르다 — KTRS-FM 은 기업이 신청 첫 단계인 고객정보활용동의, 기관은
// 평가검증과 개별평가 중 어느 쪽으로 갈지 고르는 평가진행방식 선택이고, Tech-Index 는 양쪽 모두 평가모형
// 선택이다. 헤더의 기업·기관 토글이 가리키는 유형의 메뉴가 그대로 GNB 드롭다운과 전체 메뉴에 쓰이므로,
// 토글을 바꾸면 이 링크도 그 유형의 화면으로 바뀐다. 아직 화면이 없는 모형은 '#' 으로 남겨 둔다.
const EVALUATION_MODEL_START_PATHS: Record<UserType, Readonly<Record<string, string>>> = {
    corp: {
        'KTRS-FM': '/corp/technology-evaluation/ktrs-fm/customer-consent',
        'Tech-Index': '/corp/technology-evaluation/tech-index/selection',
        투자모형: '/corp/technology-evaluation/investment-model/customer-consent',
        '평가결과 조회': '/corp/mypage/evaluation-results',
    },
    org: {
        'KTRS-FM': '/org/individual-evaluation/verification-progress',
        'Tech-Index': '/org/individual-evaluation/tech-index/selection',
        투자모형: '/org/individual-evaluation/investment-model/customer-consent',
        '평가결과 조회': '/org/mypage/evaluation-history',
    },
}

const createEvaluationModelItems = (userType: UserType): readonly HeaderNavLink[] =>
    EVALUATION_MODEL_ITEMS.map((item) => {
        const startPath = EVALUATION_MODEL_START_PATHS[userType][item.label]

        return startPath ? {...item, href: startPath} : item
    })

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
        {label: '기술평가', href: '#', items: createEvaluationModelItems('corp')},
        PATENT_EVALUATION_LINK,
        {label: 'K-BIGx 보고서', href: '#', items: CORP_REPORT_ITEMS},
        CARBON_NEUTRAL_LINK,
    ],
    org: [
        PLATFORM_INTRO_LINK,
        {label: '개별평가', href: '#', items: createEvaluationModelItems('org')},
        {label: '일괄평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#', items: ORG_REPORT_ITEMS},
        PATENT_EVALUATION_LINK,
        CARBON_NEUTRAL_LINK,
    ],
}

// 화면이 있는 항목은 경로를 걸고, 아직 없는 항목은 이름만 둔다(경로 없이 '#').
const MY_PAGE_ITEMS: Record<UserType, readonly MenuServiceItem[]> = {
    // 기업은 여섯 항목 모두 화면이 있어 경로를 건다. 유료 서비스 관리는 결제내역이 첫 화면이다.
    corp: [
        {label: '내 정보', href: '/corp/mypage/profile'},
        {label: '대표자 이력', href: '/corp/mypage/representative-history'},
        {label: '평가결과 조회', href: '/corp/mypage/evaluation-results'},
        {label: 'K-BIGx 보고서 이력', href: '/corp/mypage/k-bigx-report-history'},
        {label: '유료 서비스 관리', href: '/corp/mypage/paid-services/payment-history'},
        {label: '1:1문의', href: '/corp/mypage/inquiry-history'},
    ],
    // 기관 "내 정보"는 회원 유형(협약·비협약 은행/기관·하위계정)마다 화면이 갈리므로 대표로 협약은행
    // 화면을 건다 — 서비스에서는 로그인한 회원의 유형에 맞는 화면으로 바꿔 연결한다.
    org: [
        {label: '내 정보', href: '/org/mypage/profile-edit/partner-bank'},
        {label: '평가결과 조회', href: '/org/mypage/evaluation-history'},
        {label: '평가검증 신청 조회', href: '/org/mypage/verification-application'},
        {label: '하위 계정 현황', href: '/org/mypage/sub-account-progress'},
        {label: '1:1문의', href: '/org/mypage/inquiry-history'},
    ],
}

// 알림마당의 공통 메뉴는 userType에 따라 경로만 바뀐다.
const createNoticeServiceGroup = (userType: UserType): MenuServiceGroup => ({
    label: '알림마당',
    items: [
        {label: '공지사항', href: `/${userType}/notice/announcements`},
        {label: '자주 묻는 질문', href: `/${userType}/notice/faq`},
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
