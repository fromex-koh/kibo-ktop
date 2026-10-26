import type {Metadata} from 'next'
import {CertificateSelectDialog} from '@/components/composite/certificate-select-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '인증서 선택'}

// 약정서 전자서명의 [인증서로 인증하기]를 누르면 뜨는 인증서 선택 모달 — 기술평가 네 모형이 같은 모달을 쓴다
// (그 화면들은 이 page 를 재수출한다). 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다.
// 맨 위 안내 줄은 법인인증 차례인 경우로 보인다(개인인증 차례면 개인인증 안내로 바뀐다).
const CorpKtrsFmCertificateSelectPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="인증서 선택">
                약정서 전자서명에서 [인증서로 인증하기] 버튼을 누르면 나오는 모달
            </PopupPreviewNote>
        </main>
        <CertificateSelectDialog defaultOpen target="법인인증 — 사업장(법인) 인증서로 인증합니다." />
    </>
)

export default CorpKtrsFmCertificateSelectPage
