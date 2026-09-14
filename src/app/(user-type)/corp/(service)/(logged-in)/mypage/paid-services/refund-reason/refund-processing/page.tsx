import type {Metadata} from 'next'
import {ProcessingDialog} from '@/components/composite/processing-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '환불 진행중'}

const CorpPaidServiceRefundProcessingPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="환불 진행중">이용권 환불 요청을 처리하는 동안 표시되는 팝업</PopupPreviewNote>
        </main>
        <ProcessingDialog defaultOpen title="이용권 환불 진행중입니다." />
    </>
)

export default CorpPaidServiceRefundProcessingPage
