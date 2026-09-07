import type {Metadata} from 'next'
import {
    IdentityVerificationDialog,
    type IdentityVerificationItem,
} from '@/components/composite/identity-verification-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {MYPAGE_MEMBER} from '@/constants/mypage-profile'

export const metadata: Metadata = {title: '본인 확인'}

// API 연동 전 화면 확인용 값 — 실제로는 로그인한 회원의 가입 정보가 들어온다.
const MOCK_ITEMS: readonly IdentityVerificationItem[] = [
    {term: '기업명', value: MYPAGE_MEMBER.companyName},
    {term: '아이디', value: 'ktoptech2024'},
]

// 마이페이지 내 정보의 [본인 확인] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다.
const CorpMypageProfileIdentityVerificationPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="본인 확인">내 정보에 들어갈 때 호출되는 본인 확인 팝업</PopupPreviewNote>
        </main>
        <IdentityVerificationDialog items={MOCK_ITEMS} defaultOpen />
    </>
)

export default CorpMypageProfileIdentityVerificationPage
