import type {Metadata} from 'next'
import {CancelConfirmDialog} from '@/components/composite/cancel-confirm-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '작성 취소'}

// 신속표준모형 3단계 체크리스트의 [작성 취소] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 체크리스트 화면에서 진행을 중단하려 할 때 여는 모달이라 아직 여는 버튼과는 잇지 않았다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKtrsFmCancelConfirmPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="작성 취소">
                작성 중 화면 이탈 시 호출되는 화면 (계속 작성, 나가기 버튼)
            </PopupPreviewNote>
        </main>
        <CancelConfirmDialog defaultOpen />
    </>
)

export default CorpKtrsFmCancelConfirmPage
