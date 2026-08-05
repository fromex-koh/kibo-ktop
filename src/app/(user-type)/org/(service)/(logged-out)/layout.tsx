import type {ReactNode} from 'react'
import {SubPageLayout} from '@/components/composite/page-layout'

const ORG_PREVIEW_USER_TYPE = undefined
const ORG_PREVIEW_USER = undefined

// 일반 org 서비스 화면은 로그아웃 상태 Header를 표시한다.
// footerUserType은 퍼블리싱 인덱스 화면 확인용이다. 실 서비스에서는 공지사항·개인정보처리방침 실제 링크를 연결한다.
const OrgLoggedOutServiceLayout = ({children}: {children: ReactNode}) => (
    <SubPageLayout
        userType={ORG_PREVIEW_USER_TYPE}
        user={ORG_PREVIEW_USER}
        footerUserType="org"
        showUserTypeToggle={ORG_PREVIEW_USER_TYPE === undefined}
    >
        {children}
    </SubPageLayout>
)

export default OrgLoggedOutServiceLayout
