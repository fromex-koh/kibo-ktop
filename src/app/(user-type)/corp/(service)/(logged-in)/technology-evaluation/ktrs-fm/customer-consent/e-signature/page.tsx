import type {Metadata} from 'next'
import {ESignatureDialog} from '@/components/composite/e-signature-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '전자서명'}

// (1) 고객정보활용동의의 [약정서 전자서명] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 기술평가 네 모형과 마이페이지 대표자 이력이 같은 모달을 쓴다(그 화면들은 이 page 를 재수출한다).
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKtrsFmESignaturePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="약정서 전자서명">
                고객정보활용동의의 [동의 후 인증서명]에서 호출하는 팝업
            </PopupPreviewNote>
        </main>
        <ESignatureDialog defaultOpen />
    </>
)

export default CorpKtrsFmESignaturePage
