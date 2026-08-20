import type {ReactNode} from 'react'
import {SubPageLayout} from '@/components/composite/page-layout'
import {ORG_PREVIEW_USER} from '@/constants/preview-user'

const ORG_PREVIEW_USER_TYPE = 'org' as const

// 로그인 필요 서비스 화면에 기관 로그인 상태 Header를 표시한다.
const OrgLoggedInPreviewLayout = ({children}: {children: ReactNode}) => (
    <SubPageLayout
        userType={ORG_PREVIEW_USER_TYPE}
        user={ORG_PREVIEW_USER}
        showUserTypeToggle={ORG_PREVIEW_USER_TYPE === undefined}
    >
        {children}
    </SubPageLayout>
)

export default OrgLoggedInPreviewLayout
