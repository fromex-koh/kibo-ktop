import type {Metadata} from 'next'
import {ESignatureDialog} from '@/components/composite/e-signature-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '전자서명 (개인기업)'}

// (1) 고객정보활용동의의 [약정서 전자서명] 모달 · 개인기업 케이스 — 대표자 개인인증만 받는다(businessType="individual").
// 기술평가 네 모형이 같은 모달을 쓴다(그 화면들은 이 page 를 재수출한다).
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다.
const CorpKtrsFmESignatureIndividualPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="전자서명 (개인기업)">
                개인기업이 고객정보활용동의의 [동의 후 인증서명]을 누르면 호출하는 팝업 — 대표자 개인인증만 진행
                <br />
                확인용: 인증서 선택에서 공동인증서는 인증 성공, 금융인증서는 인증 실패로 보입니다.
            </PopupPreviewNote>
        </main>
        <ESignatureDialog businessType="individual" defaultOpen previewFailCertificate="financial" />
    </>
)

export default CorpKtrsFmESignatureIndividualPage
