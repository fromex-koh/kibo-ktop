import type {KBigxReportHistoryItem} from '@/constants/k-bigx-report-history'

// 기관 K-BIGx 보고서 이력 데이터.
//
// [프론트엔드 연동] 화면(page.tsx)은 getOrgKBigxReportHistory() 하나만 부른다 — 목업을 실제 조회 API 로 바꿀 때
// 고칠 파일은 여기뿐이고 화면·목록 컴포넌트는 건드리지 않는다. 빈 배열이면 목록 자리에 안내가 나온다.
// 기업 화면과 카드 모양이 같고, 보고서 유형(reportType)·조회 기관(inquiryOrganization)이 더 온다.

// UX 시안 사이트 기관 화면의 카드 열한 장 값을 순서 그대로 옮긴 것이다 — 기업명·보고서 유형·조회일시·특허명·
// 조회유형·조회 기관·이용권 차감. 그 사이트는 화면 모양의 기준이 아니고 데이터 예시로만 쓴다.
// 대량정보조회 세 장은 기업 한 곳이 아니라 조회 묶음이라, 기업명 자리에 묶음 이름이, 특허명 자리에 조회 결과
// 요약(총 건수·성공·실패)이 온다(예시 그대로).
// 한 장에 두 건씩 보이므로 1~6페이지에 나뉜다. 실제 데이터로 바꿀 때는 이 목록을 통째로 지운다.
const MOCK_ORG_K_BIGX_REPORT_HISTORY: readonly KBigxReportHistoryItem[] = [
    {
        id: 'org-k-bigx-report-001',
        reportType: 'innovation-growth',
        companyName: '㈜테크놀로지',
        isTicketDeducted: true,
        inquiryType: 'own',
        inquiredAt: '2026-05-18',
        patentName: '인공지능 기반 데이터 분석 시스템',
        inquiryOrganization: '부산은행 부산지점',
    },
    {
        id: 'org-k-bigx-report-002',
        reportType: 'innovation-growth',
        companyName: '스마트산업㈜',
        isTicketDeducted: false,
        inquiryType: 'other',
        inquiredAt: '2026-05-16',
        patentName: '사물인터넷 연동 제어 장치',
        inquiryOrganization: '부산은행 서울지점',
    },
    {
        id: 'org-k-bigx-report-003',
        reportType: 'innovation-growth',
        companyName: '㈜바이오랩',
        isTicketDeducted: false,
        inquiryType: 'other',
        inquiredAt: '2026-05-14',
        patentName: '바이오 센서를 활용한 진단 키트',
        inquiryOrganization: '부산은행 재무팀',
    },
    {
        id: 'org-k-bigx-report-004',
        reportType: 'innovation-growth',
        companyName: '딥마인드테크',
        isTicketDeducted: true,
        inquiryType: 'own',
        inquiredAt: '2026-05-12',
        patentName: '딥러닝 기반 이미지 분류 시스템',
        inquiryOrganization: '부산은행 심사팀',
    },
    {
        id: 'org-k-bigx-report-005',
        reportType: 'innovation-growth',
        companyName: '나노헬스㈜',
        isTicketDeducted: true,
        inquiryType: 'own',
        inquiredAt: '2026-05-10',
        patentName: '나노입자 기반 약물전달 시스템',
        inquiryOrganization: '부산은행 울산지점',
    },
    {
        id: 'org-k-bigx-report-006',
        reportType: 'innovation-growth',
        companyName: '케이에이아이㈜',
        isTicketDeducted: false,
        inquiryType: 'other',
        inquiredAt: '2026-05-08',
        patentName: '자연어처리 기반 문서 분류 시스템',
        inquiryOrganization: '부산은행',
    },
    {
        id: 'org-k-bigx-report-007',
        reportType: 'innovation-growth',
        companyName: '스페이스테크',
        isTicketDeducted: true,
        inquiryType: 'own',
        inquiredAt: '2026-05-06',
        patentName: '위성 데이터 분석 플랫폼',
        inquiryOrganization: '부산은행 부산지점',
    },
    {
        id: 'org-k-bigx-report-008',
        reportType: 'innovation-growth',
        companyName: '㈜디지털팜',
        isTicketDeducted: true,
        inquiryType: 'own',
        inquiredAt: '2026-05-04',
        patentName: '스마트팜 통합 관제 솔루션',
        inquiryOrganization: '부산은행 서울지점',
    },
    {
        id: 'org-k-bigx-report-009',
        reportType: 'bulk-info',
        companyName: '2026 상반기 정기 대량조회',
        isTicketDeducted: true,
        inquiryType: 'other',
        inquiredAt: '2026-05-17',
        patentName: '총 25건 · 성공 23 · 실패 2',
        inquiryOrganization: '부산은행 울산지점',
    },
    {
        id: 'org-k-bigx-report-010',
        reportType: 'bulk-info',
        companyName: '신규 거래처 일괄조회',
        isTicketDeducted: true,
        inquiryType: 'other',
        inquiredAt: '2026-05-11',
        patentName: '총 48건 · 성공 45 · 실패 3',
        inquiryOrganization: '부산은행',
    },
    {
        id: 'org-k-bigx-report-011',
        reportType: 'bulk-info',
        companyName: '투자심사 대상기업 대량조회',
        isTicketDeducted: true,
        inquiryType: 'other',
        inquiredAt: '2026-05-05',
        patentName: '총 12건 · 성공 12 · 실패 0',
        inquiryOrganization: '부산은행 부산지점',
    },
]

const getOrgKBigxReportHistory = async (): Promise<readonly KBigxReportHistoryItem[]> => MOCK_ORG_K_BIGX_REPORT_HISTORY

export {getOrgKBigxReportHistory}
