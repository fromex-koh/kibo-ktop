import type {Metadata} from 'next'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {SubmitConfirmDialog} from '@/components/composite/submit-confirm-dialog'

export const metadata: Metadata = {title: '제출 전 최종 확인'}

// 기관 일괄평가 대량정보 조회 신청의 [제출 전 최종 확인] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 실제 흐름에서는 신청 화면의 [신청]이 검사를 통과했을 때 그 화면 위에서 열린다(bulk-data-request-form).
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const OrgBulkDataRequestFinalReviewPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="제출 전 최종 확인">
                대량정보 조회 신청의 [신청]이 검사를 통과하면 호출되는 확인 팝업
            </PopupPreviewNote>
        </main>
        <SubmitConfirmDialog defaultOpen />
    </>
)

export default OrgBulkDataRequestFinalReviewPage
