import type {Metadata} from 'next'
import {KbigxLoginGuideDialog} from '@/components/composite/k-bigx-login-guide-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '보고서 이용 안내'}

// K-BIGx 보고서 기업혁신성장에서 로그인하지 않은 채 기술혁신정보를 이용하려 할 때 뜨는 [보고서 이용 안내] 모달 —
// IA 에 없는 추가 화면이라 경로를 따로 둔다. 로그인 전에 뜨는 모달이라 로그인 전 화면 묶음에 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKbigxLoginGuidePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="보고서 이용 안내">
                로그인하지 않은 채 기술혁신정보를 이용하려 할 때 호출되는 화면
            </PopupPreviewNote>
        </main>
        <KbigxLoginGuideDialog loginHref="/corp/auth" defaultOpen />
    </>
)

export default CorpKbigxLoginGuidePage
