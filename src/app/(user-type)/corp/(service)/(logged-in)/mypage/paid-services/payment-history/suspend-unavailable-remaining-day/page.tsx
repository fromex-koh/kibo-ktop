import type {Metadata} from 'next'
import {NoticeDialog} from '@/components/composite/notice-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {SUSPEND_UNAVAILABLE_MESSAGE} from '@/content/service/paid-service-suspend'

export const metadata: Metadata = {title: '이용중지불가(잔여기간 1일)'}

// 미리보기 전용 화면(서비스 동선 아님) — 연동 시 필요 없다. 잔여 1일 이용권(케이스 4)에서 [이용중지] 를 누르면 신청 팝업 대신 뜨는 불가 안내.
const CorpPaidServiceSuspendUnavailableRemainingDayPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="이용중지불가(잔여기간 1일)">
                현재 사용중인 이용권의 [이용중지] 버튼을 눌렀을 때 호출되는 팝업 — 잔여기간이 1일(만료일 = 오늘)인
                이용권일 때
            </PopupPreviewNote>
        </main>
        <NoticeDialog defaultOpen title="이용중지 불가 안내" message={SUSPEND_UNAVAILABLE_MESSAGE.remainingDay} />
    </>
)

export default CorpPaidServiceSuspendUnavailableRemainingDayPage
