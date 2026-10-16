import type {Metadata} from 'next'
import {OrgKbigxReportScreen} from '@/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/org-kbigx-report-screen'

export const metadata: Metadata = {title: '대량정보조회 실패'}

// K-BIGx 보고서 · 대량정보조회 실패 (org-k-bigx-report-bulk-data-search-failure ·
// /org/k-bigx-report/bulk-data-search/failure) — 기관 전용.
// [조회 실행] 결과 표준양식 검증에 실패한 모습이다.
// 기업혁신성장과 한 화면의 [대량정보조회] 탭(OrgKbigxReportScreen)이 켜진 채로, 같은 본문(BulkDataSearchForm)을 ⑤ 오류 상태로 연다 —
// 오류 패널(파일 · 행/열 오류 목록 + [다시 업로드]) · [결과 파일 다운로드].
// [퍼블리싱 확인용] 실제 흐름에서는 주소가 바뀌지 않고 대량정보조회 화면 안에서 오류 패널로 바뀐다(?error=1 로 재현).
// [프론트엔드 연동] 오류 목록(MOCK_BULK_DATA_SEARCH_ERROR)은 조회 실행 API 의 검증 결과로 바꾼다.
type OrgBulkDataSearchFailurePageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

// ?from=run — [조회 실행] 뒤 도착한 경우라 결과 패널로 내려간다(주소로 바로 연 확인용 방문은 위에서 시작).
const OrgBulkDataSearchFailurePage = async ({searchParams}: OrgBulkDataSearchFailurePageProps) => (
    <OrgKbigxReportScreen bulk={{initialStatus: 'error', shouldScrollToResult: (await searchParams).from === 'run'}} />
)

export default OrgBulkDataSearchFailurePage
