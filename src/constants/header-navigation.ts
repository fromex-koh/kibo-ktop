import {KIBO_SITE_URL} from '@/constants/site'

// Header에서 사용하는 사용자 유형과 메뉴 데이터의 단일 원본.
//
// [프론트엔드 연동] 이 파일의 경로는 퍼블리싱 화면 기준이다. 실제 라우트로 바꿀 때:
// - 메뉴 데이터(label · href · items)만 실제 경로로 바꾸면 된다 — 이 파일을 고치거나, SubPageLayout · Header 의
//   navigationByUserType 으로 같은 모양(HeaderNavigationByUserType)의 데이터를 넘긴다(API 로 받은 메뉴도 가능).
// - 현재 메뉴 표시(GNB 강조선 · 드롭다운 굵은 글씨 · 전체 메뉴 강조)는 Header 가 현재 경로와 href 를 비교해
//   자동으로 한다. 스타일 · 판별 코드는 손대지 않는다.
// - href 아래 화면은 자동 포함된다(/notice/faq → /notice/faq/detail). 그 밖에 필요한 것만 추가한다:
//   · matchPaths — 시작 화면(href)과 경로가 다른 단계 화면까지 묶을 때(예: tech-index/selection → tech-index/…)
//   · isExactMatch — href 가 다른 메뉴의 상위 경로일 때(예: /platform 과 /platform/technology-evaluation)
// - 경로 맨 앞의 /corp · /org 는 비교에서 뺀다. 실제 라우트에 이 구간이 없어도 현재 메뉴 표시는 그대로 동작한다.
//   단 로그인 전 토글의 처음 값(getUserTypeFromPath)은 이 구간으로 정하므로, 없으면 기업으로 시작한다.
// - 경로(pathname)만 비교하므로 쿼리(?model=…)로만 구분되는 화면은 구분하지 못한다.
export type UserType = 'corp' | 'org'

export type HeaderNavLink = {
    label: string
    href: string
    external?: boolean
    // 하위 항목 — GNB 드롭다운과 전체 메뉴(☰)에 함께 나온다.
    items?: readonly HeaderNavLink[]
    // href 외에 현재 위치로 볼 경로(앞부분 일치). 단계 화면이 href 아래에 있지 않을 때만 묶음의 상위 경로를 적는다.
    // 예: href '…/tech-index/selection' + matchPaths ['…/tech-index'] → '…/tech-index/general/final-review' 도 현재 위치.
    matchPaths?: readonly string[]
    // href 와 정확히 같을 때만 현재 위치. href 가 다른 메뉴의 상위 경로일 때 쓴다(예: '/platform' 과 '/platform/…').
    isExactMatch?: boolean
}

export type HeaderNavigationByUserType = Record<UserType, readonly HeaderNavLink[]>

type MenuServiceItem = string | Pick<HeaderNavLink, 'label' | 'href' | 'external'>
type MenuServiceGroup = {label: string; items: readonly MenuServiceItem[]}
type MenuServiceConfig = {
    groups: readonly MenuServiceGroup[]
    utilityLinks: readonly Pick<HeaderNavLink, 'label' | 'href' | 'external'>[]
}

// K-BIGx 보고서 하위 메뉴. 기관은 대량정보조회를 추가로 제공한다(GNB 드롭다운 · 전체메뉴 공통).
// 보고서 이력 조회는 기업·기관 모두 마이페이지 K-BIGx 보고서 이력 화면으로 간다.
const CORP_REPORT_ITEMS: readonly HeaderNavLink[] = [
    {label: '기업혁신성장보고서 조회', href: '/corp/k-bigx-report/innovation-growth-report'},
    {label: '보고서 이력 조회', href: '/corp/mypage/k-bigx-report-history'},
]

const ORG_REPORT_ITEMS: readonly HeaderNavLink[] = [
    {label: '기업혁신성장보고서 조회', href: '/org/k-bigx-report/innovation-growth-report'},
    {label: '대량정보조회', href: '/org/k-bigx-report/bulk-data-search'},
    {label: '보고서 이력 조회', href: '/org/mypage/k-bigx-report-history'},
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

// 평가모형별 matchPaths — 시작 화면 뒤 신청 단계(체크리스트 · 최종확인 등)까지 묶는다(퍼블리싱 라우트 값).
// 기관 KTRS-FM 은 평가진행방식 선택 화면에서 시작해 ktrs-fm 묶음으로 이어진다.
const EVALUATION_MODEL_MATCH_PATHS: Record<UserType, Readonly<Record<string, readonly string[]>>> = {
    corp: {
        'KTRS-FM': ['/corp/technology-evaluation/ktrs-fm'],
        'Tech-Index': ['/corp/technology-evaluation/tech-index'],
        투자모형: ['/corp/technology-evaluation/investment-model'],
    },
    org: {
        'KTRS-FM': ['/org/individual-evaluation/verification-progress', '/org/individual-evaluation/ktrs-fm'],
        'Tech-Index': ['/org/individual-evaluation/tech-index'],
        투자모형: ['/org/individual-evaluation/investment-model'],
    },
}

const createEvaluationModelItems = (userType: UserType): readonly HeaderNavLink[] =>
    EVALUATION_MODEL_ITEMS.map((item) => {
        const startPath = EVALUATION_MODEL_START_PATHS[userType][item.label]
        const matchPaths = EVALUATION_MODEL_MATCH_PATHS[userType][item.label]

        return {...item, ...(startPath ? {href: startPath} : {}), ...(matchPaths ? {matchPaths} : {})}
    })

// 플랫폼 소개 하위 메뉴 — 기업 · 기관이 같은 다섯 화면이고 /corp · /org 만 다르다.
// 첫 항목의 경로가 나머지의 상위 경로라 isExactMatch 를 둔다.
const createPlatformIntroLink = (userType: UserType): HeaderNavLink => ({
    label: '플랫폼 소개',
    href: '#',
    items: [
        {label: '플랫폼 소개', href: `/${userType}/platform`, isExactMatch: true},
        {label: '기술평가', href: `/${userType}/platform/technology-evaluation`},
        {label: '특허평가', href: `/${userType}/platform/patent-evaluation`},
        {label: 'K-BIGx 보고서', href: `/${userType}/platform/k-bigx-report`},
        {label: '탄소중립', href: `/${userType}/platform/carbon-neutrality`},
    ],
})
// 특허평가 — 하위 메뉴 없이 특허 등급조회(조회 화면)로 바로 간다(GNB · 전체메뉴 공통).
const createPatentEvaluationLink = (userType: UserType): HeaderNavLink => ({
    label: '특허평가',
    href: `/${userType}/patent-evaluation/patent-grade-list`,
})
// 탄소중립 플랫폼(외부) 홈 주소 — 헤더 메뉴가 쓴다(플랫폼 소개 > 탄소중립의 '진단 시작하기'는 진단 화면 주소를 따로 둔다).
export const CARBON_NEUTRAL_HOME_URL = 'https://www.kibo.or.kr/carbon/home'
const CARBON_NEUTRAL_LINK: HeaderNavLink = {
    label: '탄소중립',
    href: CARBON_NEUTRAL_HOME_URL,
    external: true,
}

// 로그인 전 화면에서 사용하는 기본 메뉴. 로그인 후에는 navigationByUserType로 유형별 메뉴를 주입한다.
export const DEFAULT_HEADER_NAVIGATION: HeaderNavigationByUserType = {
    corp: [
        createPlatformIntroLink('corp'),
        {label: '기술평가', href: '#', items: createEvaluationModelItems('corp')},
        createPatentEvaluationLink('corp'),
        {label: 'K-BIGx 보고서', href: '#', items: CORP_REPORT_ITEMS, matchPaths: ['/corp/k-bigx-report']},
        CARBON_NEUTRAL_LINK,
    ],
    org: [
        createPlatformIntroLink('org'),
        {label: '개별평가', href: '#', items: createEvaluationModelItems('org')},
        {label: '일괄평가', href: '#', matchPaths: ['/org/batch-evaluation']},
        {label: 'K-BIGx 보고서', href: '#', items: ORG_REPORT_ITEMS, matchPaths: ['/org/k-bigx-report']},
        createPatentEvaluationLink('org'),
        CARBON_NEUTRAL_LINK,
    ],
}

const USER_TYPES: readonly UserType[] = ['corp', 'org']

const isPathWithin = (pathname: string, basePath: string) =>
    pathname === basePath || pathname.startsWith(`${basePath}/`)

// 경로 맨 앞(/corp · /org)의 사용자 유형. 유형 경로가 아니면(메인 등) undefined. 로그인 전 헤더 토글의 처음 값이다.
// [프론트엔드 연동] 실제 라우트가 다른 방식으로 유형을 나누면 이 함수만 그 규칙에 맞게 고친다.
export const getUserTypeFromPath = (pathname: string): UserType | undefined =>
    USER_TYPES.find((userType) => isPathWithin(pathname, `/${userType}`))

// 유형 구간을 뗀 경로(/org/notice/faq → /notice/faq). 끝의 / 도 뗀다.
const toSharedPath = (pathname: string) => {
    const path = pathname.replace(/\/$/, '')
    const userType = getUserTypeFromPath(path)

    // '/corp' 처럼 유형만 있으면 '/' 로 둔다 — 빈 문자열이면 모든 경로가 그 아래로 판별된다.
    return (userType ? path.slice(userType.length + 1) : path) || '/'
}

// 메뉴가 현재 위치인지 — Header 의 GNB · 전체 메뉴가 쓴다(사용법은 파일 맨 위 [프론트엔드 연동]).
// - 경로가 href · matchPaths 와 같거나 그 아래면 현재 위치('#' · 외부 링크 href 는 제외).
// - /corp · /org 를 떼고 비교 — 토글을 바꿔도 공통 메뉴(알림마당 등)의 현재 위치가 유지된다.
// - 하위 항목이 현재 위치면 상위 메뉴도 현재 위치다(예: 마이페이지 평가결과 조회 → 기술평가 · 개별평가).
export const isHeaderNavLinkActive = (link: HeaderNavLink, pathname: string): boolean => {
    const currentPath = toSharedPath(pathname)
    const hasOwnHref = !link.external && link.href !== '#'
    if (link.isExactMatch) return hasOwnHref && currentPath === toSharedPath(link.href)

    const ownPaths = [...(hasOwnHref ? [link.href] : []), ...(link.matchPaths ?? [])]

    return (
        ownPaths.some((basePath) => isPathWithin(currentPath, toSharedPath(basePath))) ||
        (link.items ?? []).some((item) => isHeaderNavLinkActive(item, pathname))
    )
}

// 마이페이지 첫 화면(내 정보) — 헤더의 회원 이름 · 전체 메뉴의 "내 정보"가 여기로 간다.
// 기관은 회원 유형마다 내 정보 화면이 달라 대표로 협약은행 화면을 둔다.
// [프론트엔드 연동] 기관은 HeaderUser.mypageHref 로 로그인 회원 유형의 경로를 넘긴다(이 값은 기본값).
export const MYPAGE_HOME_HREF: Record<UserType, string> = {
    corp: '/corp/mypage/profile',
    org: '/org/mypage/profile-edit/partner-bank',
}

// 화면이 있는 항목은 경로를 걸고, 아직 없는 항목은 이름만 둔다(경로 없이 '#').
const MY_PAGE_ITEMS: Record<UserType, readonly MenuServiceItem[]> = {
    // 기업은 여섯 항목 모두 화면이 있어 경로를 건다. 이용권 관리는 결제내역이 첫 화면이다.
    corp: [
        {label: '내 정보', href: MYPAGE_HOME_HREF.corp},
        {label: '대표자 이력', href: '/corp/mypage/representative-history'},
        {label: '평가결과 조회', href: '/corp/mypage/evaluation-results'},
        {label: 'K-BIGx 보고서 이력', href: '/corp/mypage/k-bigx-report-history'},
        {label: '이용권 관리', href: '/corp/mypage/paid-services/payment-history'},
        {label: '1:1문의', href: '/corp/mypage/inquiry-history'},
    ],
    // 기관 "내 정보"는 회원 유형마다 화면이 갈린다 — MYPAGE_HOME_HREF 설명 참고.
    org: [
        {label: '내 정보', href: MYPAGE_HOME_HREF.org},
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
    [
        {label: '로그아웃', href: '#'},
        {label: '가격정책', href: `/${userType}/pricing`},
        {label: '이용안내', href: `/${userType}/guide`},
        KIBO_EXTERNAL_LINK,
    ] as const

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
    {label: '가격정책', href: '#'},
    {label: '이용안내', href: '#'},
    KIBO_EXTERNAL_LINK,
]
