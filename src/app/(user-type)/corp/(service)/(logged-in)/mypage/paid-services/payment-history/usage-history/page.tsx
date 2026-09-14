import type {Metadata} from 'next'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {PaidServiceUsageHistoryPreview} from '@/components/custom/paid-service-history'

export const metadata: Metadata = {title: '이용내역'}

const CorpPaidServiceUsageHistoryPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="이용내역">유료 서비스 관리의 [이용내역] 버튼이 호출하는 팝업</PopupPreviewNote>
        </main>
        <PaidServiceUsageHistoryPreview />
    </>
)

export default CorpPaidServiceUsageHistoryPage
