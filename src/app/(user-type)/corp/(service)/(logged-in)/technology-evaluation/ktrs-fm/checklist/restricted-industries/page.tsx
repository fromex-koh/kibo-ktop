import type {Metadata} from 'next'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {RestrictedIndustriesDialog} from '@/components/composite/restricted-industries-dialog'

export const metadata: Metadata = {title: '보증제한 업종'}

// 신속표준모형 3단계 체크리스트의 [보증제한 업종] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 체크리스트 화면이 아직 없어 여는 버튼과는 잇지 않았다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKtrsFmRestrictedIndustriesPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="보증제한 업종">체크리스트의 보증제한 업종 문항에서 호출하는 팝업</PopupPreviewNote>
        </main>
        <RestrictedIndustriesDialog defaultOpen />
    </>
)

export default CorpKtrsFmRestrictedIndustriesPage
