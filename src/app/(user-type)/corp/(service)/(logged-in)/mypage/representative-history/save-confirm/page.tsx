import type {Metadata} from 'next'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {SaveConfirmDialog} from '@/components/composite/save-confirm-dialog'

export const metadata: Metadata = {title: '저장 전 최종 확인'}

// 마이페이지 대표자 이력의 [저장] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 입력 검사를 모두 통과했을 때만 열리는 모달이며, 이 화면은 모달만 확인하는 자리라 열어 둔다.
const CorpMypageRepresentativeHistorySaveConfirmPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="저장 전 최종 확인">
                대표자(경영자) 역량 및 경력에서 [저장]이 검사를 통과했을 때 호출되는 화면
            </PopupPreviewNote>
        </main>
        <SaveConfirmDialog defaultOpen />
    </>
)

export default CorpMypageRepresentativeHistorySaveConfirmPage
