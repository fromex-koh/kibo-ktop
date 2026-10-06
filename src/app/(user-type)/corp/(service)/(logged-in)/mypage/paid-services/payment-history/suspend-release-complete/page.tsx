import type {Metadata} from 'next'
import {NoticeDialog} from '@/components/composite/notice-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {SUSPEND_COMPLETE_MESSAGE, SUSPEND_COMPLETE_TITLE} from '@/content/service/paid-service-suspend'

export const metadata: Metadata = {title: '이용중지 해제 완료'}

// 미리보기 전용 화면(서비스 동선 아님) — 연동 시 필요 없다. 즉시 해제 완료 알림 단독 표시. 서비스에서는 변경 확인 팝업에서 종료일을 오늘로 골라 [확인] 한 뒤 PaidServiceHistory 가 띄운다.
const CorpPaidServiceSuspendReleaseCompletePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="이용중지 해제 완료">
                이용중지 변경에서 종료일을 오늘로 골라 확인 팝업의 [확인] 버튼을 눌렀을 때 호출되는 팝업
            </PopupPreviewNote>
        </main>
        <NoticeDialog defaultOpen title={SUSPEND_COMPLETE_TITLE} message={SUSPEND_COMPLETE_MESSAGE.release} />
    </>
)

export default CorpPaidServiceSuspendReleaseCompletePage
