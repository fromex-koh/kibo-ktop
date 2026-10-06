import type {Metadata} from 'next'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import SuspendConfirmPreview from '../suspend-confirm-preview'

export const metadata: Metadata = {title: '이용중지 변경 확인'}

// 미리보기 전용 화면(서비스 동선 아님) — 연동 시 필요 없다. 변경 확인 팝업 단독 표시. 서비스에서는 입력 팝업의 [변경] 뒤에 이어 뜬다.
const CorpPaidServiceSuspendChangeConfirmPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="이용중지 변경 확인">
                이용중지 변경 팝업에서 [변경] 버튼을 눌렀을 때 호출되는 팝업
            </PopupPreviewNote>
        </main>
        <SuspendConfirmPreview mode="change" />
    </>
)

export default CorpPaidServiceSuspendChangeConfirmPage
