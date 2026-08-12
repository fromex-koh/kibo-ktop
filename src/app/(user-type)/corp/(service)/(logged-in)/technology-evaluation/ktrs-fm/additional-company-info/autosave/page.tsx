import type {Metadata} from 'next'
import AutosaveToast from '@/components/custom/autosave-toast'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '자동저장'}

// 신속표준모형 2단계 기업기타정보의 [자동저장] 토스트 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 실제 화면(2단계 기업·기술정보 입력)에서는 저장이 끝날 때마다 showAutosaveToast(new Date()) 를 부른다.
//
// 이 화면은 토스트만 확인하는 자리라 뒤 배경을 비우고 토스트를 띄워 둔다 — 모달 단독 화면과 같은 방식이다.
// 4초 뒤 사라지면 확인할 수 없으므로 노출 시간을 무한으로 두어 화면에 남긴다(이 화면에서만).
const CorpKtrsFmAutosavePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote popup="toast" title="자동저장">
                자동 저장 토스트 메시지 팝업 (HH:MM 자동 저장되었습니다)
            </PopupPreviewNote>
        </main>
        <AutosaveToast duration={Number.POSITIVE_INFINITY} />
    </>
)

export default CorpKtrsFmAutosavePage
