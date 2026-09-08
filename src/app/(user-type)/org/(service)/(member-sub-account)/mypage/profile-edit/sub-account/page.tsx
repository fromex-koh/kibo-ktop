import type {Metadata} from 'next'
import OrgMypageProfileForm from '@/components/composite/org-mypage-profile-form'
import {OrgMypageProfileScreen} from '@/components/composite/org-mypage-profile-screen'
import {ORG_MEMBER_ACCOUNTS, ORG_MEMBER_VOUCHERS, ORG_MYPAGE_MEMBERS} from '@/constants/mypage-profile'

export const metadata: Metadata = {title: '내 정보'}

// 기관 마이페이지 내 정보 — 기관회원(하위 계정)으로 로그인했을 때.
// 상위 마스터 기관이 만들어 준 계정이라 보여 주는 칸이 다르고, [이용권 정보] 구획이 더 있다.
//
// [프론트엔드 연동] 계정 정보(account)와 배분받은 이용권(vouchers)을 이 화면이 읽어 폼에 내려 준다 —
// 조회 코드를 폼 안에서 찾아다닐 필요가 없다.
const OrgMypageProfileSubAccountPage = () => (
    <OrgMypageProfileScreen
        member={ORG_MYPAGE_MEMBERS.subAccount}
        // 하위 계정은 상위 마스터 기관이 만들어 준 계정이라 안내가 다르다 — 다른 기관 화면과 같은
        // 자리(제목 아래)에 두고, 카드 안에 같은 말을 한 번 더 두지 않는다.
        description="하위 계정 정보는 상위 마스터 기관의 담당자가 등록·관리합니다. 이용권·사업기간은 상위 마스터 기관을 따르며, 회원이 직접 수정할 수 있는 항목은 담당자 · 전화번호 · 비밀번호(PW)입니다."
        form={
            <OrgMypageProfileForm
                account={ORG_MEMBER_ACCOUNTS.subAccount}
                variant="sub-account"
                vouchers={ORG_MEMBER_VOUCHERS}
            />
        }
    />
)

export default OrgMypageProfileSubAccountPage
