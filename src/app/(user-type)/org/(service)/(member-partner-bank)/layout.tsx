import type {ReactNode} from 'react'
import {SubPageLayout} from '@/components/composite/page-layout'
import {ORG_PREVIEW_USERS} from '@/constants/preview-user'

// 기관 회원 유형별 화면이 쓰는 레이아웃 — 헤더에 그 유형의 기관명을 넣는다.
// 기본 기관 레이아웃((logged-in))과 나란히 두는 이유는, 헤더의 회원 정보를 화면마다 달리해야 하는데
// 레이아웃은 자식이 값을 올려 줄 수 없기 때문이다. 경로 그룹은 주소에 드러나지 않아 URL 은 그대로다.
const OrgLoggedInPreviewLayout = ({children}: {children: ReactNode}) => (
    <SubPageLayout userType="org" user={ORG_PREVIEW_USERS.partnerBank} showUserTypeToggle={false}>
        {children}
    </SubPageLayout>
)

export default OrgLoggedInPreviewLayout
