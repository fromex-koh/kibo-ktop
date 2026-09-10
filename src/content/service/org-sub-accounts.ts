import {
    SUB_ACCOUNT_AGREEMENT_CASES,
    type SubAccountAgreement,
    type SubAccountAgreementCase,
    type SubAccountDetail,
    type SubAccountItem,
    type SubAccountService,
    type SubAccountServiceUsage,
    type SubAccountSummary,
} from '@/constants/sub-account'

// 기관 하위계정 현황 데이터.
//
// [프론트엔드 연동] 화면(page.tsx)은 getOrgSubAccountOverview() 하나만 부른다 — 목업을 실제 조회 API 로
// 바꿀 때 고칠 파일은 여기뿐이고 화면·목록 컴포넌트는 건드리지 않는다.
//   1) 아래 MOCK_* 를 지우고
//   2) getOrgSubAccountOverview 안에서 조회 API 를 부른 뒤
//   3) 협약 정보·계정 수 요약·계정 목록을 그대로 돌려준다.
// 케이스(협약 여부·기술평가부 여부)는 지금 화면이 인자로 정하지만, 연동 후에는 로그인한 기관의 속성이라
// 서버가 정한다 — 그때는 caseKey 인자를 지우고 응답의 이용서비스를 그대로 쓰면 된다.
// 계정 목록이 빈 배열이면 목록 자리에 "검색내역이 없습니다." 안내가 나온다.
//
// 조회 조건(상태·검색 대상·검색어)과 정렬은 지금 목록 컴포넌트가 화면 안에서 처리한다. 서버로 넘길 때는
// 이 함수에 조건을 받는 인자를 열고 목록의 [프론트엔드 연동] 주석 자리에서 부른다.

// 아직 화면이 없는 버튼은 자리를 비워 둔다.
const NOT_READY_PATH = '#'

// 상세정보 모달이 보여 주는 값 — 시안 "하위 계정 상세정보" 그대로다.
// 서비스별 배분 이용건수는 그 기관이 쓰는 이용서비스에서 나온다 — 협약 정보의 [이용서비스] 와 같은
// 목록이라, K-BIGx 만 쓰는 기관은 칸도 하나만 선다.
// 내역이 비어 있는 계정도 있다 — 방금 만든 계정은 접속·활동 기록이 없다. 그때 모달은 같은 자리에
// "…이 없습니다." 안내를 보여 준다. hasLogs 를 false 로 두면 그 모습을 화면에서 볼 수 있다.
// 이용서비스 한 가지가 상세정보 모달에서 차지하는 칸 — 화면에 쓰는 이름이 협약 정보의 이름과 조금 다르고
// (KTRS-FM → "KTRS-FM 평가") 건수도 서비스마다 다르다. 이용서비스에 없는 서비스는 칸도 생기지 않는다.
const SERVICE_USAGE = {
    'K-BIGx': {service: 'K-BIGx 보고서', count: 38},
    'KTRS-FM': {service: 'KTRS-FM 평가', count: 20},
    'Tech-Index': {service: '혁신성장지수 평가 (Tech-Index)', count: 10},
    '창업용 Tech-Index': {service: '창업용 Tech-Index', count: 5},
    투자모형: {service: '투자 모형', count: 3},
} as const satisfies Record<SubAccountService, SubAccountServiceUsage>

const mockDetail = (services: readonly SubAccountService[], memo: string, hasLogs = true): SubAccountDetail => ({
    createdAt: '2024-04-20',
    memo,
    serviceUsages: services.map((service) => SERVICE_USAGE[service]),
    accessLogs: hasLogs
        ? [
              {id: 'access-1', accessedAt: '2026-05-20', ip: '192.168.1.101'},
              {id: 'access-2', accessedAt: '2026-05-20', ip: '192.168.1.101'},
          ]
        : [],
    activityLogs: hasLogs
        ? [
              {
                  id: 'activity-1',
                  actedAt: '2026-05-20',
                  category: '평가 신청',
                  detail: 'KTRS-FM 개별평가 신청 (삼성전자)',
                  result: '성공',
              },
              {
                  id: 'activity-2',
                  actedAt: '2026-05-20',
                  category: '평가 신청',
                  detail: 'KTRS-FM 개별평가 신청 (삼성전자)',
                  result: '성공',
              },
              {
                  id: 'activity-3',
                  actedAt: '2026-05-20',
                  category: '평가 신청',
                  detail: 'KTRS-FM 개별평가 신청 (삼성전자)',
                  result: '성공',
              },
          ]
        : [],
})

// 협약 한 건 — 시안 값 그대로다. 협약을 맺은 케이스에만 붙는다.
const MOCK_AGREEMENT = {
    projectName: '서울형 기술기업 성장지원 사업',
    period: '2026-01-01 ~ 2026-12-31',
} as const

// 협약 정보 — 이용서비스는 케이스가 정하고, 매칭 사업·사업기간은 협약을 맺은 케이스에만 있다.
// 비협약 기관은 두 값을 넘기지 않아 화면에서도 그 줄이 그려지지 않는다.
const getAgreement = (caseKey: SubAccountAgreementCase): SubAccountAgreement => {
    const {isPartner, services} = SUB_ACCOUNT_AGREEMENT_CASES[caseKey]

    return isPartner ? {...MOCK_AGREEMENT, services} : {services}
}

// 계정 수 요약 — 세 칸이 나란히 놓인다(시안).
const MOCK_SUMMARIES: readonly SubAccountSummary[] = [
    {icon: 'total', label: '전체 하위 계정', count: 12},
    {icon: 'active', label: '사용 계정', count: 7},
    {icon: 'usage', label: '이용횟수', count: 91},
]

// 계정 목록 — 시안의 카드 세 장에 길이 확인용 한 장을 더한 것이다. 상세값은 케이스의 이용서비스를 받는다.
// 보고서 출력 횟수만 시안 값(모두 15건)과 달리 15·32·8 로 두었다 — 모두 같으면 [보고서 출력순 정렬] 이
// 도는지 화면에서 확인할 수 없다. 실제 데이터로 바꾸면 이 값도 함께 바뀐다.
//
// 마지막 한 장(sub-account-4)은 시안에 없다 — 계정 ID 와 담당자 이름이 칸을 넘는 경우를 화면에서 바로 볼 수
// 있게 둔 것이다(카드의 상세 줄 · 상세정보 모달의 요약 · 삭제 확인 모달의 물음이 함께 길어진다).
// 실제 데이터로 바꿀 때는 지운다.
const getSubAccounts = (services: readonly SubAccountService[]): readonly SubAccountItem[] => [
    {
        id: 'sub-account-1',
        name: '울산지점',
        status: 'active',
        accountId: 'sub_002',
        managerName: '이영희',
        email: 'ulsan@bb-bank.com',
        reportCount: 15,
        detail: mockDetail(services, '메모내용이 들어갑니다'),
    },
    {
        id: 'sub-account-2',
        name: '서울지점',
        status: 'suspended',
        accountId: 'sub_002',
        managerName: '이영희',
        email: 'seoul@bb-bank.com',
        reportCount: 32,
        detail: mockDetail(services, '메모내용이 들어갑니다'),
    },
    {
        id: 'sub-account-3',
        name: '대전지점',
        status: 'active',
        accountId: 'sub_002',
        managerName: '이영희',
        email: 'daejeon@bb-bank.com',
        reportCount: 8,
        detail: mockDetail(services, '', false),
    },
    {
        id: 'sub-account-4',
        name: '광주지점',
        status: 'active',
        accountId: 'sub_gwangju_branch_manager_00042',
        managerName: '알렉산드라크리스티나요한손',
        email: 'gwangju.branch.manager@bb-bank.co.kr',
        reportCount: 24,
        detail: mockDetail(services, '계정 ID·담당자 이름이 긴 경우를 보는 계정입니다'),
    },
]

type OrgSubAccountOverview = {
    agreement: SubAccountAgreement
    summaries: readonly SubAccountSummary[]
    accounts: readonly SubAccountItem[]
}

// 기본값은 이 화면의 기본 경로가 보여 주는 케이스다([기술평가부] 비협약 은행/기관 — 시안 화면).
const getOrgSubAccountOverview = async (
    caseKey: SubAccountAgreementCase = 'tech-non-partner',
): Promise<OrgSubAccountOverview> => {
    const agreement = getAgreement(caseKey)

    return {agreement, summaries: MOCK_SUMMARIES, accounts: getSubAccounts(agreement.services)}
}

// 카드의 [⋮] 메뉴가 가는 화면. 아직 만들지 않은 화면은 자리만 비워 둔다.
// 등록·비밀번호 초기화·상태 변경·삭제는 여기 없다 — 화면으로 가지 않고 이 화면에서 뜨는 모달이다.
const SUB_ACCOUNT_ROUTES = {
    edit: NOT_READY_PATH,
} as const

export {getOrgSubAccountOverview, SUB_ACCOUNT_ROUTES}
export type {OrgSubAccountOverview}
