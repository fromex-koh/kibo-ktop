import type {Metadata} from 'next'
import {NoticeDialog} from '@/components/composite/notice-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {SUSPEND_COMPLETE_MESSAGE, SUSPEND_COMPLETE_TITLE} from '@/content/service/paid-service-suspend'

export const metadata: Metadata = {title: '이용중지 신청 완료'}

// 미리보기 전용 화면(서비스 동선 아님) — 연동 시 필요 없다. 신청 완료 알림 단독 표시. 서비스에서는 확인 팝업의 [확인] 뒤 PaidServiceHistory 가 띄운다.
const CorpPaidServiceSuspendCompletePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="이용중지 신청 완료">
                이용중지 신청 확인 팝업에서 [확인] 버튼을 눌렀을 때 호출되는 팝업
            </PopupPreviewNote>
        </main>
        <NoticeDialog defaultOpen title={SUSPEND_COMPLETE_TITLE} message={SUSPEND_COMPLETE_MESSAGE.apply} />
    </>
)

export default CorpPaidServiceSuspendCompletePage
