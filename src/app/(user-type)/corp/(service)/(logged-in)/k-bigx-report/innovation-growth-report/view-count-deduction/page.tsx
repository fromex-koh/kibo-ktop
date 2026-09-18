import type {Metadata} from 'next'
import {KbigxViewCountDeductionDialog} from '@/components/composite/k-bigx-view-count-deduction-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {MOCK_VIEW_COUNT_DEDUCTION} from '@/content/service/k-bigx-view-count-deduction'

export const metadata: Metadata = {title: '조회횟수 차감안내'}

// K-BIGx 보고서 기업혁신성장에서 이용권으로 다른 기업의 보고서를 조회할 때 뜨는 [조회횟수 차감안내] 모달 — 화면정의서의
// 하위 화면이라 경로를 따로 둔다. 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달
// 단독 화면과 같은 방식이다.
const CorpKbigxViewCountDeductionPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="조회횟수 차감안내">
                이용권으로 다른 기업의 보고서를 조회할 때 호출되는 화면
            </PopupPreviewNote>
        </main>
        <KbigxViewCountDeductionDialog {...MOCK_VIEW_COUNT_DEDUCTION} defaultOpen />
    </>
)

export default CorpKbigxViewCountDeductionPage
