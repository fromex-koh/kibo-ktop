import type {Metadata} from 'next'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {CareerInputHelpDialog} from '@/components/composite/career-input-help-dialog'

export const metadata: Metadata = {title: '입력 도움말'}

// Tech-Index 2단계 · 대표자 역량 및 경력사항의 [입력 도움말] 모달 — 화면정의서의 하위 화면이라
// 경로를 따로 둔다. 실제 흐름에서는 그 탭의 [입력 도움말] 버튼이 이 모달을 연다(career-form.tsx).
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
//
// 창업기업용·투자모형의 같은 모달은 이 화면을 다시 내보낸다 — 내용이 같아 한 벌만 둔다.
const CorpTechIndexCareerInputHelperPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="입력 도움말">
                대표자 역량 및 경력사항의 [입력 도움말]이 호출하는 팝업
            </PopupPreviewNote>
        </main>
        <CareerInputHelpDialog defaultOpen />
    </>
)

export default CorpTechIndexCareerInputHelperPage
