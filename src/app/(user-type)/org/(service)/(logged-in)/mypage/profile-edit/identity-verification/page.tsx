import type {Metadata} from 'next'
import {
    IdentityVerificationDialog,
    type IdentityVerificationItem,
} from '@/components/composite/identity-verification-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {ORG_MYPAGE_MEMBERS} from '@/constants/mypage-profile'

export const metadata: Metadata = {title: '본인 확인'}

// API 연동 전 화면 확인용 값 — 기관은 이름 칸을 [기관명] 으로 부른다(내 정보 수정 폼과 같은 이름).
const MOCK_ITEMS: readonly IdentityVerificationItem[] = [
    {term: '기관명', value: ORG_MYPAGE_MEMBERS.default.companyName},
    {term: '아이디', value: 'kmiraebank2024'},
]

// 마이페이지 내 정보 수정의 [본인 확인] 모달 — 기업 화면과 같은 모달이고 보여 주는 값만 기관의 것이다.
const OrgMypageProfileEditIdentityVerificationPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="본인 확인">내 정보 수정에 들어갈 때 호출되는 본인 확인 팝업</PopupPreviewNote>
        </main>
        <IdentityVerificationDialog items={MOCK_ITEMS} defaultOpen />
    </>
)

export default OrgMypageProfileEditIdentityVerificationPage
