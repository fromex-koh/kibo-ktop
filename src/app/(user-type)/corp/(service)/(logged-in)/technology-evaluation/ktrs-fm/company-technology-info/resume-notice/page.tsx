import type {Metadata} from 'next'
import {ResumeNoticeDialog} from '@/components/composite/resume-notice-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '이어서 작성 안내'}

// 신속표준모형 2단계 기업·기술정보 입력의 [이어서 작성 안내] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 자동 저장된 입력을 이어서 쓸지 묻는 팝업이라 입력 단계 아래에 둔다(전 모형 공통, 화면정의서 위치 이동).
// 시안(Figma "[신속표준모형 KTRS-FM] m_이어서 작성 안내")에는 앞에 "작성 중인 평가가 있습니다." 안내 모달이
// 하나 더 있으나 두지 않는다 — 뒤따르는 이 모달이 같은 사실을 이미 말하고 답까지 받는다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
// 자동 저장된 내용이 있는지 확인해 여는 흐름과는 아직 잇지 않았다.
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
