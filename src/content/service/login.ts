// 로그인 화면의 모달 두 개가 쓰는 글.
//
// [프론트엔드 연동] 담당자 연락처(111-111-1111)는 시안에 적힌 임시 번호다 — 실제 번호로 바꾼다.
// 기관회원 대상 표와 절차 안내는 운영 기준이 바뀌면 이 파일만 고치면 된다.

const LOGIN_CONTACT_NUMBER = '111-111-1111'

// ── 아이디 · 비밀번호 찾기 ──
// 기관회원은 계정을 담당자가 발급하므로 찾기 화면 대신 연락처만 안내한다.
const FIND_ACCOUNT_TITLE = '아이디 · 비밀번호 찾기'
const FIND_ACCOUNT_MESSAGE = `아이디 비밀번호는 담당자 (${LOGIN_CONTACT_NUMBER})으로 문의하여주세요.`

// ── 기관회원 가입 안내 ──
const AGENCY_SIGN_UP_TITLE = '기관회원 가입 안내'
const AGENCY_SIGN_UP_NOTICE = [
    '기관회원 가입은 기술보증기금 담당자 확인 후 진행됩니다.',
    '아래 절차에 따라 진행해 주시기 바랍니다.',
    '아래 대상 해당하는 기관 회원 (회원가입 후 사용자 승인 필요)',
] as const

// 가입 대상 — 표의 첫 칸(기관회원)이 두 줄을 세로로 묶는다.
const AGENCY_SIGN_UP_TARGET_HEADER = '기관회원'
const AGENCY_SIGN_UP_TARGETS = [
    {
        label: '금융기관',
        items: ['기금법 제2조3에 의한 금융회사(은행법에 의한 은행 등)'],
    },
    {
        label: '지원기관',
        items: [
            '신용정보업 영위 기업 및 기술평가기관 지정 기업',
            '공공기관운영법 제4조에 따른 공공기관(공기업, 준정부기관, 기타공공기관)',
            '연구개발특구의 육성에 관한 특별법 시행령 제3조에 의한 공공연구기관',
            '벤처투자법에 의한 중소기업창업투자회사·조합 및 벤처투자회사·조합',
            '그 외 담당이사가 인정한 비영리법인(벤처기업협회, 중소기업기술혁신협회) 등',
        ],
    },
] as const

// 가입 절차 — 번호는 화면이 순서대로 붙인다(목록 순서가 곧 단계 번호다).
const AGENCY_SIGN_UP_STEPS = [
    {title: '담당자 문의', description: '기술보증기금 관계자와 통화 후 가입 의향을 전달해 주세요.'},
    {title: '필요서류 제출', description: '담당자 안내에 따라 필요 서류를 제출해 주세요.'},
    {title: '승인 검토', description: '기술보증기금 담당자가 제출 서류를 검토합니다.'},
    {title: '계정 발급', description: '승인 완료 후 기관회원 ID / PW를 생성하여 전달드립니다.'},
    {title: '로그인 및 이용', description: '전달받은 계정으로 로그인 후 서비스를 이용하실 수 있습니다.'},
] as const

const AGENCY_SIGN_UP_ALERT = `제한없는 사용을 위한 협약을 원하시는 은행회원 등은 담당자(${LOGIN_CONTACT_NUMBER})에게 연락주세요.`

const LOGIN_DIALOG_CLOSE_LABEL = '닫기'

export {
    AGENCY_SIGN_UP_ALERT,
    AGENCY_SIGN_UP_NOTICE,
    AGENCY_SIGN_UP_STEPS,
    AGENCY_SIGN_UP_TARGET_HEADER,
    AGENCY_SIGN_UP_TARGETS,
    AGENCY_SIGN_UP_TITLE,
    FIND_ACCOUNT_MESSAGE,
    FIND_ACCOUNT_TITLE,
    LOGIN_CONTACT_NUMBER,
    LOGIN_DIALOG_CLOSE_LABEL,
}
