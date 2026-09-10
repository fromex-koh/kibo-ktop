import type {Metadata} from 'next'
import {SubAccountDetailDialog} from '@/components/composite/sub-account-detail-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {getOrgSubAccountOverview} from '@/content/service/org-sub-accounts'

export const metadata: Metadata = {title: '하위계정 상세'}

// 하위계정 현황의 [상세정보] 가 여는 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다(다른 모달 단독 화면과 같은 방식).
const OrgMypageSubAccountDetailPage = async () => {
    const {accounts} = await getOrgSubAccountOverview()

    return (
        <>
            <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
                <PopupPreviewNote title="하위 계정 상세정보">
                    하위계정 카드의 [상세정보] 가 호출하는 팝업
                </PopupPreviewNote>
            </main>
            <SubAccountDetailDialog defaultOpen item={accounts[0]} />
        </>
    )
}

export default OrgMypageSubAccountDetailPage
