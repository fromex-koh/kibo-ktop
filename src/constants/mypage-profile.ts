// 마이페이지 내 정보 — 칸 이름과 화면에 꽂는 회원정보를 한곳에 둔다.
//
// 서버 컴포넌트(page)가 읽어야 하므로 'use client' 파일이 아니라 이 자리에 둔다 — 클라이언트 파일의
// 상수를 서버에서 import 하면 실제 값이 아니라 빈 참조가 넘어온다(technology-evaluation.ts 와 같은 이유).
//
// [프론트엔드 연동] 회원정보 조회는 한 번이다. 그 응답을 MYPAGE_MEMBER_PROFILE 자리에 넣으면
// 사이드바(이름·회원 구분)와 폼(입력 칸)이 같은 값을 함께 받는다 — 화면이 값을 두 경로로 받지 않는다.

import {
    CORPORATION_PREFIX,
    CORP_PREVIEW_COMPANY,
    CORP_PREVIEW_USER,
    ORG_PREVIEW_USER,
    ORG_PREVIEW_USERS,
} from '@/constants/preview-user'

// 값의 이름 — 폼의 입력 name·id 와 제출 데이터의 키가 같은 글자를 쓴다.
export const CORP_TYPE_FIELD = 'corpType'
export const COMPANY_NAME_FIELD = 'companyName'
export const COMPANY_NAME_MARK_FIELD = 'companyNameMark'
export const CORP_NO_FIELD = 'corpNo'
export const INDUSTRY_CODE_FIELD = 'industry-code'
export const ADDRESS_FIELD = 'address'
export const ADDRESS_DETAIL_FIELD = 'address-detail'

export const CORP_TYPE_CORPORATION = 'corporation'

export const CORP_TYPES = [
    {value: 'individual', label: '개인'},
    {value: CORP_TYPE_CORPORATION, label: '법인'},
    {value: 'etc', label: '기타'},
] as const

// 법인 전용 칸 — 개인·기타로 되돌릴 때 이 이름들의 값을 지운다. 화면에서 사라진 칸의 값이 그대로
// 제출되면 개인사업자인데 법인번호가 담기는 일이 생긴다.
export const CORPORATION_ONLY_FIELDS = [COMPANY_NAME_MARK_FIELD, CORP_NO_FIELD] as const

// 기업명 표기 — 법인 표기를 기업명 앞에 붙일지 뒤에 붙일지 고른다.
export const COMPANY_NAME_MARKS = [
    {value: 'prefix', label: '앞'},
    {value: 'suffix', label: '뒤'},
] as const
export const DEFAULT_COMPANY_NAME_MARK = COMPANY_NAME_MARKS[0].value

// 기업명을 아직 적지 않았을 때 미리보기에 대신 넣는 말.
export const COMPANY_NAME_PLACEHOLDER = '기업명'

export {CORPORATION_PREFIX}

// 사이드바에 보이는 회원 — 이름은 헤더가 쓰는 값과 같다.
export const MYPAGE_MEMBER = {
    companyName: CORP_PREVIEW_USER.name,
    memberType: '기업회원',
} as const

// 화면을 열 때 이미 들어 있는 값 — 가입할 때 받은 회원정보다.
export const MYPAGE_MEMBER_PROFILE: Record<string, string> = {
    [CORP_TYPE_FIELD]: CORP_TYPE_CORPORATION,
    [COMPANY_NAME_MARK_FIELD]: CORP_PREVIEW_COMPANY.mark,
    // 시안 예시는 11222-1234567 이지만 법인번호는 6-7(13자리)이라 그대로 두면 형식 검사에 걸려
    // [저장] 이 영영 열리지 않는다 — 자릿수를 맞춘 값으로 둔다.
    [CORP_NO_FIELD]: '110111-1234567',
    // 법인 표기를 뺀 원본 이름이다 — 표기 위치와 합쳐 헤더·사이드바의 이름과 같은 글자가 된다.
    [COMPANY_NAME_FIELD]: CORP_PREVIEW_COMPANY.name,
    bizNo: '123-45-67890',
    foundDate: '2015-03-12',
    ceoName: '홍길동',
    companyTel: '02-1234-0000',
    // 조회·검색으로 채우는 칸도 이미 가입할 때 받아 둔 값이라 처음부터 들어 있다.
    [INDUSTRY_CODE_FIELD]: '26299 그 외 기타 전자부품 제조업',
    [ADDRESS_FIELD]: '(48400) 부산광역시 남구 문현금융로 33',
    addressDetail: '기술보증기금 5층',
    // 담당자 정보도 가입할 때 받아 둔 값이라 처음부터 들어 있다.
    // 시안의 예시 글자(담당자명·직위·example@email.com)를 값으로 쓰지 않는다 — 같은 칸의 안내 문구
    // (placeholder)와 글자가 같아, 채워진 칸인지 빈 칸인지 화면에서 구별되지 않는다.
    managerName: '이수현',
    managerPosition: '기술기획팀 팀장',
    managerTel: '010-1234-5678',
    managerEmail: 'sh.lee@kmirae.co.kr',
}

// 기관 회원 유형 — 사이드바에 보이는 이름과 배지. 이름은 각 화면의 헤더와 같은 값이다.
export const ORG_MYPAGE_MEMBERS = {
    // 배지는 회원 구분(기관회원)이다 — 협약 형태(협약은행·협약기관)는 폼의 [기관구분] 칸이 알린다.
    // default 는 유형을 가르지 않는 기관 마이페이지 화면이 쓴다 — 이름은 (logged-in) 레이아웃이
    // 헤더에 넣는 계정과 같아야 한다.
    default: {companyName: ORG_PREVIEW_USER.name, memberType: '기관회원'},
    partnerBank: {companyName: ORG_PREVIEW_USERS.partnerBank.name, memberType: '기관회원'},
    partnerAgency: {companyName: ORG_PREVIEW_USERS.partnerAgency.name, memberType: '기관회원'},
    subAccount: {companyName: ORG_PREVIEW_USERS.subAccount.name, memberType: '기관회원'},
} as const

// 기관 회원정보 — 칸 구성은 기업과 같고 값만 그 기관의 것이다. 유형마다 다른 기관이라 값도 다르다.
//
// [기업명] 은 법인·기관의 이름이고, 헤더·사이드바에 보이는 이름은 로그인한 계정이다.
// 협약은행은 지점, 하위계정은 부서 단위로 계정이 나뉘므로 둘이 같지 않다.
const ORG_MEMBER_PROFILE_BASE: Record<string, string> = {
    ...MYPAGE_MEMBER_PROFILE,
    [COMPANY_NAME_MARK_FIELD]: 'suffix',
}

export const ORG_MYPAGE_MEMBER_PROFILES: Record<string, Record<string, string>> = {
    partnerBank: {
        ...ORG_MEMBER_PROFILE_BASE,
        [CORP_NO_FIELD]: '180111-0001234',
        [COMPANY_NAME_FIELD]: '부산은행',
        bizNo: '605-81-00001',
        foundDate: '1967-10-10',
        ceoName: '방성빈',
        companyTel: '051-309-7000',
        [INDUSTRY_CODE_FIELD]: '64121 일반 은행업',
        [ADDRESS_FIELD]: '(47225) 부산광역시 부산진구 중앙대로 691',
        addressDetail: '부산은행 서면지점 2층',
        managerName: '정민아',
        managerPosition: '기업금융팀 과장',
        managerTel: '010-9876-5432',
        managerEmail: 'ma.jung@bnk.co.kr',
    },
    partnerAgency: {
        ...ORG_MEMBER_PROFILE_BASE,
        // 재단법인이라 법인 표기를 쓰지 않는다 — 기업형태를 기타로 두면 법인번호·기업명 표기 칸이 빠진다.
        [CORP_TYPE_FIELD]: 'etc',
        [COMPANY_NAME_FIELD]: '서울산업진흥원',
        bizNo: '110-82-00123',
        foundDate: '1998-06-15',
        ceoName: '김현우',
        companyTel: '02-2222-3000',
        [INDUSTRY_CODE_FIELD]: '84122 산업 진흥 행정',
        [ADDRESS_FIELD]: '(04512) 서울특별시 중구 을지로 65',
        addressDetail: 'SK텔레콤빌딩 3층',
        managerName: '한지수',
        managerPosition: '기업지원본부 책임',
        managerTel: '010-2345-6789',
        managerEmail: 'js.han@sba.kr',
    },
    subAccount: {
        ...ORG_MEMBER_PROFILE_BASE,
        [CORP_TYPE_FIELD]: 'etc',
        [COMPANY_NAME_FIELD]: '서울산업진흥원',
        bizNo: '110-82-00123',
        foundDate: '1998-06-15',
        ceoName: '김현우',
        companyTel: '02-2222-3100',
        [INDUSTRY_CODE_FIELD]: '84122 산업 진흥 행정',
        [ADDRESS_FIELD]: '(04512) 서울특별시 중구 을지로 65',
        addressDetail: 'SK텔레콤빌딩 4층 창업지원팀',
        managerName: '오세진',
        managerPosition: '창업지원팀 매니저',
        managerTel: '010-3456-7890',
        managerEmail: 'sj.oh@sba.kr',
    },
}

// 기관 회원 계정 정보 — 칸 이름.
// 기업 회원정보(위)와 전혀 다른 화면이다. 기관은 가입 시 담당자가 계정을 만들어 주고, 회원이 직접
// 고칠 수 있는 것은 담당자·전화번호·비밀번호뿐이다. 나머지는 보여 주기만 한다.
export const ORG_MEMBER_NAME_FIELD = 'orgName'
export const ORG_MEMBER_BIZ_NO_FIELD = 'orgBizNo'
export const ORG_MEMBER_MANAGER_FIELD = 'orgManager'
export const ORG_MEMBER_TEL_FIELD = 'orgTel'
export const ORG_MEMBER_KIND_FIELD = 'orgKind'
export const ORG_MEMBER_STATUS_FIELD = 'orgStatus'
export const ORG_MEMBER_ID_FIELD = 'orgId'
export const ORG_MEMBER_PASSWORD_FIELD = 'orgPassword'
// 협약기관에만 있는 칸 — 그 기관이 맡은 평가사업이다. 값이 있는 유형에서만 화면에 나온다.
export const ORG_MEMBER_PROGRAM_FIELD = 'orgProgram'

// 하위 계정에만 있는 칸 — 상위 마스터 기관이 정해 주는 값이다.
export const ORG_MEMBER_MASTER_FIELD = 'orgMaster'
export const ORG_MEMBER_PERIOD_FIELD = 'orgPeriod'
export const ORG_MEMBER_JOINED_AT_FIELD = 'orgJoinedAt'

// 기관구분·상태는 회원이 고르는 값이 아니라 보여 주는 값이다 — 목록은 어떤 값이 올 수 있는지 알리는 용도다.
export const ORG_MEMBER_KINDS = [
    {value: 'partner-bank', label: '협약은행'},
    {value: 'partner-agency', label: '협약기관'},
    {value: 'sub-account', label: '기관회원 (하위계정)'},
] as const

// 평가사업 — 기관이 고르는 값이 아니라 협약할 때 정해져 오는 값이다.
export const ORG_MEMBER_PROGRAMS = [
    {value: 'seoul-growth', label: '서울형 기술기업 성장지원 사업'},
    {value: 'seoul-startup', label: '서울 창업기업 기술평가 지원사업'},
] as const

export const ORG_MEMBER_STATUSES = [
    {value: 'active', label: '정상'},
    {value: 'suspended', label: '정지'},
    {value: 'withdrawn', label: '탈퇴'},
] as const

// 회원 계정 목업 — 화면을 열 때 꽂히는 값이다.
export const ORG_MEMBER_ACCOUNTS: Record<string, Record<string, string>> = {
    partnerBank: {
        // 헤더에 보이는 계정 이름과 같은 값이다 — 한 화면에서 다른 기관명이 보이면 안 된다.
        [ORG_MEMBER_NAME_FIELD]: ORG_PREVIEW_USERS.partnerBank.name,
        [ORG_MEMBER_BIZ_NO_FIELD]: '621-81-00417',
        [ORG_MEMBER_MANAGER_FIELD]: '김서연',
        // 지점 대표번호 — 지역번호가 기관명(부산)과 맞는다.
        [ORG_MEMBER_TEL_FIELD]: '051-663-3120',
        [ORG_MEMBER_KIND_FIELD]: 'partner-bank',
        [ORG_MEMBER_STATUS_FIELD]: 'active',
        [ORG_MEMBER_ID_FIELD]: 'bnk_seomyeon',
        // 실제 비밀번호는 조회로 내려오지 않는다 — 화면에는 자릿수만 채운 가림표가 보인다.
        [ORG_MEMBER_PASSWORD_FIELD]: 'Bnk#2026seo',
    },
    partnerAgency: {
        [ORG_MEMBER_NAME_FIELD]: ORG_PREVIEW_USERS.partnerAgency.name,
        [ORG_MEMBER_BIZ_NO_FIELD]: '110-82-33440',
        [ORG_MEMBER_MANAGER_FIELD]: '박산업',
        [ORG_MEMBER_TEL_FIELD]: '02-333-4400',
        [ORG_MEMBER_KIND_FIELD]: 'partner-agency',
        [ORG_MEMBER_STATUS_FIELD]: 'active',
        [ORG_MEMBER_ID_FIELD]: 'sba_master01',
        [ORG_MEMBER_PASSWORD_FIELD]: 'Sba#2026mst',
        [ORG_MEMBER_PROGRAM_FIELD]: 'seoul-growth',
    },
    subAccount: {
        [ORG_MEMBER_NAME_FIELD]: ORG_PREVIEW_USERS.subAccount.name,
        // 하위 계정은 상위 기관의 협약 형태를 그대로 따른다 — 고를 수 있는 값이 아니라 글자로만 보여 준다.
        [ORG_MEMBER_KIND_FIELD]: '협약기관',
        [ORG_MEMBER_ID_FIELD]: 'sba_user01',
        [ORG_MEMBER_MASTER_FIELD]: ORG_PREVIEW_USERS.partnerAgency.name,
        [ORG_MEMBER_PERIOD_FIELD]: '2026-01-01 ~ 2026-12-31',
        [ORG_MEMBER_JOINED_AT_FIELD]: '2026-05-17',
        [ORG_MEMBER_MANAGER_FIELD]: '이창업',
        [ORG_MEMBER_TEL_FIELD]: '02-333-4455',
        [ORG_MEMBER_PASSWORD_FIELD]: 'Sba#2026usr',
    },
}

// 하위 계정이 상위 마스터 기관에게서 배분받은 모형별 이용건 — 보여 주기만 하는 값이다.
export type OrgMemberVoucher = {model: string; count: number}

export const ORG_MEMBER_VOUCHERS: readonly OrgMemberVoucher[] = [
    {model: 'KTRS-FM', count: 30},
    {model: 'Tech-Index', count: 20},
]
