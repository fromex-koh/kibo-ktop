import type {Metadata} from 'next'
import {KbigxPassPurchaseGuideDialog} from '@/components/composite/k-bigx-pass-purchase-guide-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '이용권 구매 안내'}

// K-BIGx 보고서 기업혁신성장에서 이용권 없이 다른 기업을 조회할 때 뜨는 [이용권 구매 안내] 모달 — 화면정의서의
// 하위 화면이라 경로를 따로 둔다. 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달
// 단독 화면과 같은 방식이다.
const OrgKbigxPassPurchaseGuidePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="이용권 구매 안내">
                보유 이용권 없이 다른 기업의 보고서를 조회하려 할 때 호출되는 화면
            </PopupPreviewNote>
        </main>
        <KbigxPassPurchaseGuideDialog purchaseHref="/org/pricing" defaultOpen />
    </>
)

export default OrgKbigxPassPurchaseGuidePage
