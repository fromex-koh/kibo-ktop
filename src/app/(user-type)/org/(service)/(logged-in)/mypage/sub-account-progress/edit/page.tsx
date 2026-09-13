import type {Metadata} from 'next'
import {SubAccountEditDialog} from '@/components/composite/sub-account-edit-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {getOrgSubAccountOverview} from '@/content/service/org-sub-accounts'

export const metadata: Metadata = {title: '하위계정 수정'}

// 하위계정 현황의 [⋮] > [수정] 이 여는 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다(다른 모달 단독 화면과 같은 방식).
// 시안의 계정이 [기술평가부] 협약 은행/기관이라(KTRS-FM 평가·투자 모형) 그 케이스의 값으로 연다.
const OrgMypageSubAccountEditPage = async () => {
    const {accounts} = await getOrgSubAccountOverview('tech-partner')

    return (
        <>
            <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
                <PopupPreviewNote title="하위 계정 수정">
                    하위계정 카드의 [⋮] &gt; [수정] 이 호출하는 팝업
                </PopupPreviewNote>
            </main>
            <SubAccountEditDialog defaultOpen item={accounts[0]} />
        </>
    )
}

export default OrgMypageSubAccountEditPage
