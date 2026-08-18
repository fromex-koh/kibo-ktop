import type {Metadata} from 'next'
import {GuaranteeApplicationCompleteDialog} from '@/components/composite/guarantee-application-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '보증신청 완료'}

// 신속표준모형 5단계 완료 화면의 [보증신청 완료] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 보증신청 모달에서 [예] 를 누르면 이어서 뜨는 알림이다 — 은행 전송완료 모달과 같은 구성이다
// (원래는 완료 토스트였으나 모달로 바꾸기로 결정됨 — guarantee-application-dialog.tsx).
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKtrsFmGuaranteeApplicationCompletePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="보증신청 완료">
                보증신청 모달에서 [예]를 선택하면 호출되는 완료 팝업
            </PopupPreviewNote>
        </main>
        <GuaranteeApplicationCompleteDialog defaultOpen />
    </>
)

export default CorpKtrsFmGuaranteeApplicationCompletePage
