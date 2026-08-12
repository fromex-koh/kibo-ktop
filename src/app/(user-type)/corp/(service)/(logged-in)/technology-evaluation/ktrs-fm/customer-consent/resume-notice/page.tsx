import type {Metadata} from 'next'
import {ResumeNoticeDialog} from '@/components/composite/resume-notice-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '이어서 작성 안내'}

// 신속표준모형 1단계 고객정보활용동의의 [이어서 작성 안내] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 화면을 벗어나려는 순간 여는 모달이라 아직 이탈 감지와는 잇지 않았다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKtrsFmResumeNoticePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="이어서 작성 안내">
                기존에 자동저장되어 작성중이었던 것이 있으면 호출되는 팝업
            </PopupPreviewNote>
        </main>
        <ResumeNoticeDialog defaultOpen />
    </>
)

export default CorpKtrsFmResumeNoticePage
