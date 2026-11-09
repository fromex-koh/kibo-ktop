import type {Metadata} from 'next'
import {PaymentUnavailableDialog} from '@/components/composite/payment-unavailable-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '결제 불가 팝업'}

// 결제 불가 안내 모달 단독 화면 — 기관회원이 가격정책의 [구매하기]를 누르면 뜨는 모달(PaymentUnavailableDialog)을
// 따로 확인하는 자리다. 뒤 배경을 비우고 모달을 열어 둔다(다른 모달 단독 화면과 같은 방식).
const OrgPricingPaymentUnavailablePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="결제 불가 팝업">
                결제하기에서 기관회원이 이용권을 결제하려 할 때 호출되는 팝업
            </PopupPreviewNote>
        </main>
        <PaymentUnavailableDialog defaultOpen />
    </>
)

export default OrgPricingPaymentUnavailablePage
