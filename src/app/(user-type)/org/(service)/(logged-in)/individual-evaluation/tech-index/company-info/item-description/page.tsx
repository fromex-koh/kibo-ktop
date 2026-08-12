import type {Metadata} from 'next'
import {ItemDescriptionDialogContent} from '@/components/composite/item-description-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {Dialog} from '@/components/ui/dialog'

export const metadata: Metadata = {title: '품목설명'}

// 기관 개별평가 Tech-Index 기업정보의 [품목설명] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 품목 입력란 옆 안내에서 여는 모달이라 아직 여는 버튼과는 잇지 않았다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
// 내용은 기업 화면과 같은 240개 품목 목록이다(composite/item-description-dialog).
// 투자모형도 같은 모달이라 그 경로는 이 화면을 다시 내보낸다.
const OrgTechIndexItemDescriptionPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="품목설명">기업정보의 품목 입력에서 호출되는 팝업</PopupPreviewNote>
        </main>
        <Dialog defaultOpen>
            <ItemDescriptionDialogContent />
        </Dialog>
    </>
)

export default OrgTechIndexItemDescriptionPage
