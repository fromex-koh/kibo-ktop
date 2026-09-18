import type {Metadata} from 'next'
import {KbigxTermsAgreementDialog} from '@/components/composite/k-bigx-terms-agreement-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '이용약관'}

// K-BIGx 보고서 기업혁신성장의 [이용약관 동의] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKbigxTermsOfServicePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="K-BIGx 보고서 이용약관 동의">
                K-BIGx 서비스를 처음 이용할 때 약관 동의를 받기 위해 호출되는 화면
            </PopupPreviewNote>
        </main>
        <KbigxTermsAgreementDialog defaultOpen />
    </>
)

export default CorpKbigxTermsOfServicePage
