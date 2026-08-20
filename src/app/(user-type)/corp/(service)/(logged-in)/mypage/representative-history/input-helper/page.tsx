import type {Metadata} from 'next'
import {CareerInputHelpDialog} from '@/components/composite/career-input-help-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '입력 도움말'}

// 마이페이지 대표자 이력의 [입력 도움말] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 실제 흐름에서는 [대표자 경력사항] 제목 옆의 물음표가 이 모달을 연다.
// 신청 화면의 [입력 도움말]과 같은 내용이다 — 경력을 어떤 순서·형식으로 적는지는 화면이 달라도 같다.
const CorpMypageRepresentativeHistoryInputHelperPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="입력 도움말">
                대표자(경영자) 역량 및 경력에서 [대표자 경력사항] 옆 물음표를 눌렀을 때 호출되는 화면
            </PopupPreviewNote>
        </main>
        <CareerInputHelpDialog defaultOpen />
    </>
)

export default CorpMypageRepresentativeHistoryInputHelperPage
