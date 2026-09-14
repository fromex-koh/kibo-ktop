import type {Metadata} from 'next'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {PaidServiceRefundPreview} from '@/components/custom/paid-service-history'

export const metadata: Metadata = {title: '환불하기'}

const CorpPaidServiceRefundReasonPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="환불하기">유료 서비스 관리의 [환불하기] 버튼이 호출하는 팝업</PopupPreviewNote>
        </main>
        <PaidServiceRefundPreview />
    </>
)

export default CorpPaidServiceRefundReasonPage
