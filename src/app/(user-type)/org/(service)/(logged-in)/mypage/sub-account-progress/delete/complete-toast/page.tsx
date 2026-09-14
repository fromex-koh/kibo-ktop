import type {Metadata} from 'next'
import {CheckToastOnMount} from '@/components/custom/check-toast'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {SUB_ACCOUNT_TOAST} from '@/constants/sub-account'

export const metadata: Metadata = {title: '하위계정 삭제 완료 토스트'}

// 하위계정 카드의 [⋮] > [삭제] 확인 모달에서 [확인] 을 눌렀을 때 뜨는 완료 토스트입니다.
// 토스트만 확인하는 화면이므로 공통 팝업 미리보기 배경과 토스트 컴포넌트를 그대로 사용합니다.
const OrgMypageSubAccountDeleteCompleteToastPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote popup="toast" title="하위계정 삭제 완료 토스트">
                하위계정 삭제 확인 모달의 [확인]이 띄우는 토스트
            </PopupPreviewNote>
        </main>
        <CheckToastOnMount
            message={SUB_ACCOUNT_TOAST.delete.message}
            id={SUB_ACCOUNT_TOAST.delete.id}
            duration={Number.POSITIVE_INFINITY}
        />
    </>
)

export default OrgMypageSubAccountDeleteCompleteToastPage
