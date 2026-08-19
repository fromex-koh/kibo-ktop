import type {Metadata} from 'next'
import {SubmitConfirmDialog} from '@/components/composite/submit-confirm-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '제출전 최종확인'}

// 기관 일괄평가 진행 신청의 [제출전 최종확인] 모달 — 신청 검사를 통과했을 때 호출된다.
// 이 경로에서는 모달 단독 화면을 확인할 수 있도록 빈 배경 위에 다이얼로그를 열어 둔다.
const OrgBatchEvaluationRequestFinalReviewPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="제출전 최종확인">
                일괄평가 진행 신청의 [신청]이 검사를 통과하면 호출되는 확인 팝업
            </PopupPreviewNote>
        </main>
        <SubmitConfirmDialog defaultOpen />
    </>
)

export default OrgBatchEvaluationRequestFinalReviewPage
