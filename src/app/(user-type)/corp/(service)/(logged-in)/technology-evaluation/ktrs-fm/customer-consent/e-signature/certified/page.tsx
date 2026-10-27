import type {Metadata} from 'next'
import {ESignatureDialog, PREVIEW_BUSINESS_NUMBER} from '@/components/composite/e-signature-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '전자서명 (인증 완료)'}

// 약정서 전자서명 · 인증 성공 케이스 — 두 인증을 모두 마친 상태(칩마다 [인증완료] 배지 · 완료 안내 · [제출하기]).
// 기술평가 네 모형이 같은 모달을 쓴다(그 화면들은 이 page 를 재수출한다). 모달만 열어 두는 확인 화면이다.
const CorpKtrsFmESignatureCertifiedPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="전자서명 (인증 완료)">
                인증서 선택에서 인증에 성공하면 인증서 선택이 닫히고 보이는 전자서명 모달
            </PopupPreviewNote>
        </main>
        <ESignatureDialog
            businessNumber={PREVIEW_BUSINESS_NUMBER}
            defaultOpen
            previewResult={{status: 'success', residentNumber: {front: '800101', back: '1234567'}}}
        />
    </>
)

export default CorpKtrsFmESignatureCertifiedPage
