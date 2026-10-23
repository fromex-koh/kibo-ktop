import type {Metadata} from 'next'
import {ServiceUnavailableDialog} from '@/components/composite/service-unavailable-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: 'K-BIGx 서비스 불가 안내'}

// K-BIGx 서비스 이용 안내 모달 단독 화면 — 기술평가 기관회원이 K-BIGx GNB 메뉴에 들어올 때 뜨는
// 모달(ServiceUnavailableDialog · K-BIGx)을 따로 확인하는 자리다. 뒤 배경을 비우고 모달을 열어 둔다.
const OrgKbigxReportServiceUnavailablePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="K-BIGx 서비스 불가 안내">
                기관 회원은 서비스별로 계정 각각 생성, 할당 서비스 외 다른 서비스 접근시 노출되는 모달
            </PopupPreviewNote>
        </main>
        <ServiceUnavailableDialog service="k-bigx" defaultOpen />
    </>
)

export default OrgKbigxReportServiceUnavailablePage
