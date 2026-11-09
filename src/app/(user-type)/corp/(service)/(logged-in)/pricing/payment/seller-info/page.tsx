import type {Metadata} from 'next'
import {SellerInfoDialog} from '@/components/composite/seller-info-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '판매자 정보'}

// 결제하기의 [판매자 정보] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpPricingPaymentSellerInfoPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="판매자 정보">
                결제하기에서 [판매자 정보]를 눌렀을 때 호출되는 화면
            </PopupPreviewNote>
        </main>
        <SellerInfoDialog defaultOpen />
    </>
)

export default CorpPricingPaymentSellerInfoPage
