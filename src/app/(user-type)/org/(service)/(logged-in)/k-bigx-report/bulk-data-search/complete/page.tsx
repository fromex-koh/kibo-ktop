import type {Metadata} from 'next'
import {KbigxReportIntro} from '@/components/custom/k-bigx-report-sections'
import {BulkDataSearchForm} from '../bulk-data-search-form'

export const metadata: Metadata = {title: '대량정보조회 완료'}

// K-BIGx 보고서 · 대량정보조회 완료 (org-k-bigx-report-bulk-data-search-complete ·
// /org/k-bigx-report/bulk-data-search/complete) — 기관 전용.
// 대량정보조회에서 [조회 실행]이 성공하면 넘어오는 화면이다. 같은 본문(BulkDataSearchForm)을 ④ 완료 상태로 연다 —
// 완료 패널(총 건수 · 성공 · 실패 + [새 조회]) · [결과 파일 다운로드]. [새 조회]는 대량정보조회 화면으로 돌아간다.
// [프론트엔드 연동] 완료 패널의 건수(MOCK_BULK_DATA_SEARCH_COMPLETE)는 조회 실행 API 응답으로 바꾸고,
// [결과 파일 다운로드]에 결과 파일 경로를 건다.
type OrgBulkDataSearchCompletePageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

// ?from=run — [조회 실행] 뒤 도착한 경우라 결과 패널로 내려간다(주소로 바로 연 확인용 방문은 위에서 시작).
const OrgBulkDataSearchCompletePage = async ({searchParams}: OrgBulkDataSearchCompletePageProps) => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="grid-layout gap-y-10 pt-10 pb-15 *:col-span-full">
            <KbigxReportIntro title="대량정보조회" homeHref="/org/home" />
            <BulkDataSearchForm initialStatus="complete" shouldScrollToResult={(await searchParams).from === 'run'} />
        </div>
    </main>
)

export default OrgBulkDataSearchCompletePage
