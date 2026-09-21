import type {Metadata} from 'next'
import {PaymentCompleteDialog} from '@/components/composite/payment-complete-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {DEFAULT_PAYMENT_PLAN_ID, findPlan, PAID_PLANS} from '@/content/service/pricing'

export const metadata: Metadata = {title: '결제 완료'}

// 결제하기의 [결제하기]가 끝났을 때 뜨는 결제 완료 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
// 이용권은 시안과 같은 프리미엄을 보여 준다.
const plan = findPlan(DEFAULT_PAYMENT_PLAN_ID) ?? PAID_PLANS[0]

const OrgPricingPaymentCompletePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="결제 완료">결제하기에서 결제가 끝났을 때 호출되는 화면</PopupPreviewNote>
        </main>
        <PaymentCompleteDialog plan={plan} defaultOpen />
    </>
)

export default OrgPricingPaymentCompletePage
