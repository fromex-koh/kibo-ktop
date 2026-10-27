import type {Metadata} from 'next'
import {ESignatureDialog, PREVIEW_BUSINESS_NUMBER} from '@/components/composite/e-signature-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '전자서명 (인증 실패)'}

// 약정서 전자서명 · 인증 실패 케이스 — 인증서 정보가 다르면 칸이 빨간 테두리가 되고 오류 문구가 보인다.
// 법인인증은 사업자등록번호 칸, 개인인증은 대표자 주민등록번호 칸 — 두 인증 모두 실패 상태라 칩을 오가며 본다.
// 기술평가 네 모형이 같은 모달을 쓴다(그 화면들은 이 page 를 재수출한다). 모달만 열어 두는 확인 화면이다.
const CorpKtrsFmESignatureCertifyErrorPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="전자서명 (인증 실패)">
                인증서 선택에서 인증에 실패하면 인증서 선택이 닫히고 보이는 전자서명 모달 — 법인인증 · 개인인증 칩을
                눌러 각 실패 화면 확인
            </PopupPreviewNote>
        </main>
        <ESignatureDialog
            businessNumber={PREVIEW_BUSINESS_NUMBER}
            defaultOpen
            previewResult={{status: 'failure', residentNumber: {front: '800101', back: '1234567'}}}
        />
    </>
)

export default CorpKtrsFmESignatureCertifyErrorPage
