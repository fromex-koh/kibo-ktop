import type {Metadata} from 'next'
import {OrgKbigxReportScreen} from '@/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/org-kbigx-report-screen'
import {isBulkDataSearchStatus} from '@/content/service/bulk-data-search'

export const metadata: Metadata = {title: '대량정보조회'}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// K-BIGx 보고서 · 대량정보조회 (org-k-bigx-report-bulk-data-search ·
// /org/k-bigx-report/bulk-data-search) — 기관 전용.
// 기업혁신성장 조회와 한 화면의 탭이다 — 이 주소는 [대량정보조회] 탭이 켜진 채로 연다(OrgKbigxReportScreen 머리 주석).
// 탭 안은 대량정보조회 카드 → 버튼이다.
// 상태 흐름은 BulkDataSearchForm 머리 주석(① 업로드 전 → ② 업로드 후 → ③ 처리 중 → ④ 완료 / ⑤ 오류)을 본다.
//
// [퍼블리싱 확인용] 주소 값으로 케이스를 바로 볼 수 있다.
//   · (없음)            ① 업로드 전 — 파일을 고르면 ②, [조회 실행]을 누르면 ③ 뒤 결과 화면으로 이동
//                        성공 → ④ 완료(./complete) · 실패 → ⑤ 실패(./failure). 목업은 파일 이름에 '오류'·'error' 가 있으면 실패다.
//   · ?state=processing ③ 처리 중
//   · ?state=error      ⑤ 오류 (?error=1 이면 ① 에서 [조회 실행]했을 때 ⑤ 로 바뀐다 — 주소는 그대로)
//   ④ 완료는 별도 화면이다 — bulk-data-search/complete/page.tsx
//   ② 업로드 후는 실제 파일이 있어야 해서 주소로 열지 않는다 — ① 에서 파일을 골라 확인한다.
// [프론트엔드 연동] 실제 화면은 ① 로 시작하므로 아래 주소 값(searchParams) 읽기를 지운다.
// ─────────────────────────────────────────────────────────────────────────────────────────────

const PREVIEW_STATE_QUERY = 'state'
const PREVIEW_ERROR_QUERY = 'error'

type OrgBulkDataSearchPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

const OrgBulkDataSearchPage = async ({searchParams}: OrgBulkDataSearchPageProps) => {
    const params = await searchParams
    const previewState = params[PREVIEW_STATE_QUERY]
    const initialStatus =
        isBulkDataSearchStatus(previewState) && (previewState === 'processing' || previewState === 'error')
            ? previewState
            : undefined

    return <OrgKbigxReportScreen bulk={{initialStatus, isErrorPreview: params[PREVIEW_ERROR_QUERY] === '1'}} />
}

export default OrgBulkDataSearchPage
