import type {Metadata} from 'next'
import {CheckToastOnMount} from '@/components/custom/check-toast'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {SUB_ACCOUNT_TOAST, nextSubAccountStatus} from '@/constants/sub-account'
import {getOrgSubAccountOverview} from '@/content/service/org-sub-accounts'

export const metadata: Metadata = {title: '상태 변경 완료 토스트'}

// 하위계정 카드의 [⋮] > [사용정지로 변경] 확인 모달에서 [확인] 을 눌렀을 때 뜨는 완료 토스트 —
// 화면정의서의 하위 화면이라 경로를 따로 둔다.
//
// 문구에는 바뀐 뒤의 상태가 들어간다("사용정지로 변경되었습니다."). 확인 모달 단독 화면과 같은 계정을
// 쓰므로, 그 화면에서 묻는 상태와 이 화면이 알리는 상태가 서로 맞는다.
//
// 이 화면은 토스트만 확인하는 자리라 뒤 배경을 비우고 토스트를 띄워 둔다 — 모달 단독 화면과 같은 방식이다.
// 4초 뒤 사라지면 확인할 수 없으므로 노출 시간을 무한으로 두어 화면에 남긴다(이 화면에서만).
const OrgMypageSubAccountStatusChangeCompleteToastPage = async () => {
    const {accounts} = await getOrgSubAccountOverview()
    const changedStatus = nextSubAccountStatus(accounts[0].status)

    return (
        <>
            <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
                <PopupPreviewNote popup="toast" title="상태 변경 완료 토스트">
                    상태 변경 확인 모달의 [확인] 이 띄우는 토스트
                </PopupPreviewNote>
            </main>
            <CheckToastOnMount
                message={SUB_ACCOUNT_TOAST.statusChange.message(changedStatus)}
                id={SUB_ACCOUNT_TOAST.statusChange.id}
                duration={Number.POSITIVE_INFINITY}
            />
        </>
    )
}

export default OrgMypageSubAccountStatusChangeCompleteToastPage
