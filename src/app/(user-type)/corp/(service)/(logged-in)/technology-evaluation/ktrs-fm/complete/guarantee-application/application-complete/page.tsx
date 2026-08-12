import type {Metadata} from 'next'
import {GUARANTEE_DONE_MESSAGE, GUARANTEE_TOAST_ID} from '@/components/composite/guarantee-application-dialog'
import {CheckToastOnMount} from '@/components/custom/check-toast'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '보증신청 완료'}

// 신속표준모형 5단계 완료 화면의 [보증신청 완료] 알림 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 완료 알림은 모달이 아니라 완료 토스트다 — 보증신청 모달에서 [예] 를 누르면 모달이 닫히고
// 화면 위(헤더 아래)에 체크 동그라미 토스트가 뜬다(guarantee-application-dialog.tsx).
//
// 이 화면은 그 토스트만 확인하는 자리라 뒤 배경을 비우고 띄워 둔다 — 자동저장 토스트 화면과 같은 방식이다.
// 4초 뒤 사라지면 확인할 수 없으므로 노출 시간을 무한으로 두어 화면에 남긴다(이 화면에서만).
const CorpKtrsFmGuaranteeApplicationCompletePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote popup="toast" title="보증신청 완료">
                보증신청 모달에서 [예]를 선택하면 호출되는 완료 토스트 메시지
            </PopupPreviewNote>
        </main>
        <CheckToastOnMount
            message={GUARANTEE_DONE_MESSAGE}
            id={GUARANTEE_TOAST_ID}
            duration={Number.POSITIVE_INFINITY}
        />
    </>
)

export default CorpKtrsFmGuaranteeApplicationCompletePage
