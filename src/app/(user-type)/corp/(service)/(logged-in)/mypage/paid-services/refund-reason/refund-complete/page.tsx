import type {Metadata} from 'next'
import {PaidServiceRefundCompleteDialog} from '@/components/composite/paid-service-refund-complete-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '환불 및 결제 취소 완료'}

const CorpPaidServiceRefundCompletePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="환불 및 결제 취소 완료">
                이용권 환불 처리가 완료된 뒤 표시되는 팝업
            </PopupPreviewNote>
        </main>
        <PaidServiceRefundCompleteDialog defaultOpen />
    </>
)

export default CorpPaidServiceRefundCompletePage
