import type {Metadata} from 'next'
import {BankBranchSearchDialog} from '@/components/composite/bank-branch-search-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '은행 영업점 조회'}

// 보증추천 모달의 [은행]·[영업점명] 두 칸이 함께 여는 검색 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 은행과 영업점을 한 모달에서 고른다(시안) — 예전에는 은행 검색·영업점 검색으로 나뉘어 있었다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다(다른 모달 단독 화면과 같은 방식).
const OrgMypageBankBranchSearchPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="은행 영업점 조회">
                보증추천 모달의 [은행]·[영업점명] 칸이 호출하는 팝업
            </PopupPreviewNote>
        </main>
        <BankBranchSearchDialog defaultOpen />
    </>
)

export default OrgMypageBankBranchSearchPage
