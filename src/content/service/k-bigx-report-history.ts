import type {KBigxReportHistoryItem} from '@/constants/k-bigx-report-history'

// 기업 K-BIGx 보고서 이력 데이터.
//
// [프론트엔드 연동] 화면(page.tsx)은 getKBigxReportHistory() 하나만 부른다 — 목업을 실제 조회 API 로 바꿀 때
// 고칠 파일은 여기뿐이고 화면·목록 컴포넌트는 건드리지 않는다. 빈 배열이면 목록 자리에 안내가 나온다.
//
// 조회 조건(조회기간·조회유형·기업명)과 정렬은 지금 목록 컴포넌트가 화면 안에서 처리한다. 서버로 넘길 때는
// 이 함수에 조건을 받는 인자를 열고 목록의 [프론트엔드 연동] 주석 자리에서 부른다.

// UX 시안 사이트(https://1-fo.vercel.app/bigx-history)의 카드 여덟 장 값을 순서 그대로 옮긴 것이다 —
// 기업명·조회일시·특허명·조회유형·이용권 차감. 그 사이트는 화면 모양의 기준이 아니고 데이터 예시로만 쓴다.
// 한 장에 두 건씩 보이므로 1~4페이지에 나뉜다. 실제 데이터로 바꿀 때는 이 목록을 통째로 지운다.
const MOCK_K_BIGX_REPORT_HISTORY: readonly KBigxReportHistoryItem[] = [
    {
        id: 'k-bigx-report-001',
        companyName: '㈜테크놀로지',
        isTicketDeducted: true,
        inquiryType: 'own',
        inquiredAt: '2026-05-18',
        patentName: '인공지능 기반 데이터 분석 시스템',
    },
    {
        id: 'k-bigx-report-002',
        companyName: '스마트산업㈜',
        isTicketDeducted: false,
        inquiryType: 'other',
        inquiredAt: '2026-05-16',
        patentName: '사물인터넷 연동 제어 장치',
    },
    {
        id: 'k-bigx-report-003',
        companyName: '㈜바이오랩',
        isTicketDeducted: false,
        inquiryType: 'other',
        inquiredAt: '2026-05-14',
        patentName: '바이오 센서를 활용한 진단 키트',
    },
    {
        id: 'k-bigx-report-004',
        companyName: '딥마인드테크',
        isTicketDeducted: true,
        inquiryType: 'own',
        inquiredAt: '2026-05-12',
        patentName: '딥러닝 기반 이미지 분류 시스템',
    },
    {
        id: 'k-bigx-report-005',
        companyName: '나노헬스㈜',
        isTicketDeducted: true,
        inquiryType: 'own',
        inquiredAt: '2026-05-10',
        patentName: '나노입자 기반 약물전달 시스템',
    },
    {
        id: 'k-bigx-report-006',
        companyName: '케이에이아이㈜',
        isTicketDeducted: false,
        inquiryType: 'other',
        inquiredAt: '2026-05-08',
        patentName: '자연어처리 기반 문서 분류 시스템',
    },
    {
        id: 'k-bigx-report-007',
        companyName: '스페이스테크',
        isTicketDeducted: true,
        inquiryType: 'own',
        inquiredAt: '2026-05-06',
        patentName: '위성 데이터 분석 플랫폼',
    },
    {
        id: 'k-bigx-report-008',
        companyName: '㈜디지털팜',
        isTicketDeducted: true,
        inquiryType: 'own',
        inquiredAt: '2026-05-04',
        patentName: '스마트팜 통합 관제 솔루션',
    },
]

// 아직 화면이 없는 버튼은 자리를 비워 둔다.
const NOT_READY_PATH = '#'

const getKBigxReportHistory = async (): Promise<readonly KBigxReportHistoryItem[]> => MOCK_K_BIGX_REPORT_HISTORY

// 카드 버튼이 가는 곳 — [보고서 다운로드] 가 받는 보고서 파일과, 기관 대량정보조회의 [엑셀 결과]·[HTML 압축파일]
// 결과 파일. 기업·기관 화면이 함께 쓴다. 주소가 정해지면 여기만 채운다.
const K_BIGX_REPORT_ROUTES = {
    download: NOT_READY_PATH,
    excel: NOT_READY_PATH,
    htmlArchive: NOT_READY_PATH,
} as const

export {getKBigxReportHistory, K_BIGX_REPORT_ROUTES}
