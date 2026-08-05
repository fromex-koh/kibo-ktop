import type {ReactNode} from 'react'
import {SubPageLayout} from '@/components/composite/page-layout'

const ORG_PREVIEW_USER_TYPE = 'org' as const
const ORG_PREVIEW_USER = {name: '한국미래은행서울강남중앙영업점', sessionRemaining: '30:00'} as const

// 로그인 연장·로그아웃 종료 화면만 로그인 상태 Header로 미리보기한다.
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
