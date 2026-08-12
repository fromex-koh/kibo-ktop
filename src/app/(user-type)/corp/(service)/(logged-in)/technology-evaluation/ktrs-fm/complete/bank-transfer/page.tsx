import type {Metadata} from 'next'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {BankTransferDialog} from '@/components/composite/bank-transfer-dialog'

export const metadata: Metadata = {title: '은행 전송'}

// 신속표준모형 5단계 완료 화면의 [은행전송] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
// 완료 화면의 [은행전송] 버튼과는 아직 잇지 않았다(전송 흐름 미정).
const CorpKtrsFmBankTransferPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="은행 전송">완료 화면의 [은행전송]이 호출하는 팝업</PopupPreviewNote>
        </main>
        <BankTransferDialog defaultOpen />
    </>
)

export default CorpKtrsFmBankTransferPage
