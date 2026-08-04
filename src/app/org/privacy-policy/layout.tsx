import type {ReactNode} from 'react'
import {SubPageLayout} from '@/components/composite/page-layout'

// 서버 세션·인증 API에서 조회한 user의 userType을 SubPageLayout의 userType prop으로 전달한다.
// userType이 없으면 showUserTypeToggle=true로 기업/기관 토글을 표시하고, 있으면 Header의 GNB·전체 메뉴를 해당 유형으로 고정한다.
// 예: <SubPageLayout userType={user?.userType} showUserTypeToggle={user?.userType === undefined}>{children}</SubPageLayout>
// 자세한 Props와 사용 예시는 /component-guide/sub-page-layout에서 확인한다.
const OrgPrivacyPolicyLayout = ({children}: {children: ReactNode}) => <SubPageLayout>{children}</SubPageLayout>

export default OrgPrivacyPolicyLayout
