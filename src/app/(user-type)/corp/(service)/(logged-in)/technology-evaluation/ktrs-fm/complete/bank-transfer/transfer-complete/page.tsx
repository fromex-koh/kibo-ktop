import type {Metadata} from 'next'
import {BankTransferResultDialog, type BankTransferResult} from '@/components/composite/bank-transfer-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '은행 전송완료'}

// 화면 확인용 예시 값 — 실제로는 바로 앞 [은행 전송] 모달에서 고른 은행·지점이 그대로 들어온다
// (BankTransferDialog 가 전송 뒤 이 모달을 띄운다). 지점을 비우고 보내면 "-" 로 표시된다.
const SAMPLE_RESULT: BankTransferResult = {bank: '국민은행', branch: '강남지점'}

// 신속표준모형 5단계 완료 화면의 [은행 전송완료] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 전송 모달(complete/bank-transfer)에서 [전송하기] 를 누르면 이어서 뜨는 알림이다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKtrsFmBankTransferCompletePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="은행 전송완료">
                은행 전송 모달에서 [전송하기]를 선택하면 호출되는 완료 팝업
            </PopupPreviewNote>
        </main>
        <BankTransferResultDialog result={SAMPLE_RESULT} defaultOpen />
    </>
)

export default CorpKtrsFmBankTransferCompletePage
