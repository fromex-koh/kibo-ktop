import type {Metadata} from 'next'
import {NoticeDialog} from '@/components/composite/notice-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {SUSPEND_UNAVAILABLE_MESSAGE} from '@/content/service/paid-service-suspend'

export const metadata: Metadata = {title: '이용중지불가(무료이용권)'}

// 미리보기 전용 화면(서비스 동선 아님) — 연동 시 필요 없다. 무료 지급 이용권(케이스 5)에서 [이용중지] 를 누르면 신청 팝업 대신 뜨는 불가 안내.
const CorpPaidServiceSuspendUnavailableFreePassPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="이용중지불가(무료이용권)">
                현재 사용중인 이용권의 [이용중지] 버튼을 눌렀을 때 호출되는 팝업 — 무료로 지급된 이용권일 때
            </PopupPreviewNote>
        </main>
        <NoticeDialog defaultOpen title="이용중지 불가 안내" message={SUSPEND_UNAVAILABLE_MESSAGE.freePass} />
    </>
)

export default CorpPaidServiceSuspendUnavailableFreePassPage
