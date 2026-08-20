import type {Metadata} from 'next'
import {EditCancelConfirmDialog} from '@/components/composite/edit-cancel-confirm-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '수정 취소'}

// 마이페이지 내 정보의 [취소] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpMypageProfileCancelConfirmPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="수정 취소">
                내 정보에서 [취소]를 눌렀을 때 호출되는 화면 (되돌리기 전 확인)
            </PopupPreviewNote>
        </main>
        <EditCancelConfirmDialog defaultOpen />
    </>
)

export default CorpMypageProfileCancelConfirmPage
