import type {Metadata} from 'next'
import {SubAccountCreateDialog} from '@/components/composite/sub-account-create-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '하위 계정 등록'}

// 하위계정 현황의 [하위계정 등록] 이 여는 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다(다른 모달 단독 화면과 같은 방식).
const OrgMypageSubAccountCreatePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="하위 계정 등록">목록 위 [하위계정 등록] 이 호출하는 팝업</PopupPreviewNote>
        </main>
        <SubAccountCreateDialog defaultOpen />
    </>
)

export default OrgMypageSubAccountCreatePage
