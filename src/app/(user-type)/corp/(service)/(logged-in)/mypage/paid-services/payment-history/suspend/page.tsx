import type {Metadata} from 'next'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import SuspendPreview from './suspend-preview'

export const metadata: Metadata = {title: '이용중지 신청'}

// 미리보기 전용 화면(서비스 동선 아님) — 연동 시 필요 없다. 이용중지 신청 입력 팝업 단독 표시. 서비스에서는 결제정보 케이스 1의 [이용중지] 로 열린다.
const CorpPaidServiceSuspendPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="이용중지 신청">
                결제정보의 현재 이용권에서 이용중지를 신청할 때 호출되는 팝업
            </PopupPreviewNote>
        </main>
        <SuspendPreview />
    </>
)

export default CorpPaidServiceSuspendPage
