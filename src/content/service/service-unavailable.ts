// 서비스 이용 불가 안내 모달(ServiceUnavailableDialog)의 문구 — 제목 · 첫 문장은 서비스 이름만 다르고,
// 둘째 문장(이용 조건) · 문의전화는 서비스마다 따로 둔다.
//
// [프론트엔드 연동] 기술평가 문의전화는 확정된 번호로 바꾼다(임시 번호 — 결제 불가 안내와 같다).

type UnavailableService = 'technology-evaluation' | 'k-bigx'

const SERVICE_NAMES: Record<UnavailableService, string> = {
    'technology-evaluation': '기술평가',
    'k-bigx': 'K-BIGx',
}

// 둘째 문장 — 그 서비스를 쓰려면 무엇이 필요한지.
const SERVICE_REQUIREMENTS: Record<UnavailableService, string> = {
    'technology-evaluation': '기술평가 서비스 이용을 위해서는 별도의 기관회원 계정이 필요합니다.',
    'k-bigx': 'K-BIGx 서비스 이용을 위해서는 별도 협약이 필요합니다.',
}

const SERVICE_CONTACTS: Record<UnavailableService, string> = {
    'technology-evaluation': '문의전화: 111-1111-1111',
    'k-bigx': '문의전화: 1544-1120',
}

// 제목 · 안내 두 문장 — 넓은 화면에서는 문장마다 줄을 바꾸고, 좁은 화면에서는 폭에 맞게 이어서 접힌다.
const getServiceUnavailableTitle = (service: UnavailableService) => `${SERVICE_NAMES[service]} 서비스 이용 안내`

const getServiceUnavailableMessages = (service: UnavailableService) =>
    [
        `현재 로그인된 계정은 ${SERVICE_NAMES[service]} 서비스를 이용하실 수 없습니다.`,
        SERVICE_REQUIREMENTS[service],
    ] as const

const getServiceUnavailableContact = (service: UnavailableService) => SERVICE_CONTACTS[service]

export {getServiceUnavailableContact, getServiceUnavailableMessages, getServiceUnavailableTitle}
export type {UnavailableService}
