// 로그인 상태 화면이 쓰는 회원 목업 — 헤더의 사용자 이름과 마이페이지의 회원 정보가 같은 값을 본다.
// 두 곳에 따로 적어 두면 한쪽만 고쳤을 때 같은 화면에서 다른 기업 이름이 보인다.
//
// [프론트엔드 연동] 로그인 세션(회원정보) 응답으로 바꾸는 자리다. 이름과 남은 시간 모두 서버가 준다.

// 법인 표기 — 기업명 앞이나 뒤에 붙는다(마이페이지 [기업명 표기]).
export const CORPORATION_PREFIX = '(주)'

// 법인 표기를 뺀 원본 기업명 — 마이페이지 [기업명] 칸에 들어가는 값이다.
// 화면에 보이는 이름(헤더·사이드바)은 여기에 표기를 붙인 완성형이라, 한 값에서 함께 만든다.
//
// 길이는 이 목업의 목적이다 — 이름이 가장 길 때 헤더가 잘라서 보여 주는지 확인하려고 둔 값이다.
// 헤더의 이름 칸은 글자수가 아니라 폭(184px)으로 자르므로, 표기까지 붙인 완성형이 그 폭을 넘어야 한다
// (이 이름은 194px 로, 이전 목업 "한국미래기술혁신성장기업주식회사" 와 같은 폭이다).
// "주식회사" 를 글자 그대로 적지 않는 이유는 화면 표기가 (주) 이기 때문이며, 그만큼 글자가 좁아져
// 같은 글자수로는 폭이 모자란다. 이름을 줄이려면 헤더에서 잘리는지 함께 확인한다.
const CORP_COMPANY_NAME = '한국미래기술혁신성장테크놀로지'

export const CORP_PREVIEW_COMPANY = {name: CORP_COMPANY_NAME, mark: 'prefix'} as const

export const CORP_PREVIEW_USER = {
    name: `${CORPORATION_PREFIX}${CORP_COMPANY_NAME}`,
    sessionRemaining: '30:00',
} as const

// 기관은 회원 유형이 셋이고 화면도 유형별로 나뉜다 — 헤더에 보이는 이름이 곧 그 유형의 표시다.
// 유형별 화면(마이페이지 내 정보)은 각자 이 값을 헤더에 넣는다.
export const ORG_PREVIEW_USERS = {
    partnerBank: {name: '부산은행 서면지점', sessionRemaining: '30:00'},
    partnerAgency: {name: '서울산업진흥원', sessionRemaining: '30:00'},
    subAccount: {name: '서울산업진흥원 창업지원팀', sessionRemaining: '30:00'},
} as const

// 유형이 정해지지 않은 기관 화면(그 밖의 모든 로그인 화면)이 쓰는 기본 회원.
export const ORG_PREVIEW_USER = {name: '한국미래은행서울강남중앙영업지점', sessionRemaining: '30:00'} as const
