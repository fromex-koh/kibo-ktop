import type {Metadata} from 'next'
import {CheckToastOnMount} from '@/components/custom/check-toast'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {SUB_ACCOUNT_TOAST} from '@/constants/sub-account'

export const metadata: Metadata = {title: '비밀번호 초기화 완료 토스트'}

// 하위계정 카드의 [⋮] > [비밀번호 초기화] 확인 모달에서 [확인] 을 눌렀을 때 뜨는 완료 토스트 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
//
// 이 화면은 토스트만 확인하는 자리라 뒤 배경을 비우고 토스트를 띄워 둔다 — 모달 단독 화면과 같은 방식이다.
// 4초 뒤 사라지면 확인할 수 없으므로 노출 시간을 무한으로 두어 화면에 남긴다(이 화면에서만).
const OrgMypageSubAccountPasswordResetCompleteToastPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote popup="toast" title="비밀번호 초기화 완료 토스트">
                비밀번호 초기화 확인 모달의 [확인] 이 띄우는 토스트
            </PopupPreviewNote>
        </main>
        <CheckToastOnMount
            message={SUB_ACCOUNT_TOAST.passwordReset.message}
            id={SUB_ACCOUNT_TOAST.passwordReset.id}
            duration={Number.POSITIVE_INFINITY}
        />
    </>
)

export default OrgMypageSubAccountPasswordResetCompleteToastPage
