import type {Metadata} from 'next'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import SuspendChangePreview from './suspend-change-preview'

export const metadata: Metadata = {title: '이용중지 변경'}

// 미리보기 전용 화면(서비스 동선 아님) — 연동 시 필요 없다. 이용중지 변경 입력 팝업 단독 표시. 서비스에서는 케이스 2의 [이용중지 변경] 으로 열린다.
const CorpPaidServiceSuspendChangePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="이용중지 변경">
                결제정보에서 이용중지를 신청한 이용권의 이용중지 기간을 바꿀 때 호출되는 팝업
            </PopupPreviewNote>
        </main>
        <SuspendChangePreview />
    </>
)

export default CorpPaidServiceSuspendChangePage
