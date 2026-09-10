import type {Metadata} from 'next'
import {SubAccountStatusChangeDialog} from '@/components/composite/sub-account-status-change-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {getOrgSubAccountOverview} from '@/content/service/org-sub-accounts'

export const metadata: Metadata = {title: '하위계정 상태 변경'}

// 하위계정 현황의 [⋮] > [사용정지로 변경] 이 여는 확인 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다(다른 모달 단독 화면과 같은 방식).
// 물음에 적히는 상태는 고른 계정의 반대 상태다 — 첫 계정이 "사용" 이라 "사용정지(으)로" 가 된다.
const OrgMypageSubAccountStatusChangePage = async () => {
    const {accounts} = await getOrgSubAccountOverview()

    return (
        <>
            <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
                <PopupPreviewNote title="상태 변경">
                    하위계정 카드의 [⋮] &gt; [사용정지로 변경] 이 호출하는 팝업
                </PopupPreviewNote>
            </main>
            {/* 이 화면에는 바꿀 목록이 없어 onConfirm 을 넘기지 않는다 — 누르면 창만 닫힌다. */}
            <SubAccountStatusChangeDialog defaultOpen item={accounts[0]} />
        </>
    )
}

export default OrgMypageSubAccountStatusChangePage
