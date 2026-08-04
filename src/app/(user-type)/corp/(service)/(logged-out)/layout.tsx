import type {ReactNode} from 'react'
import {SubPageLayout} from '@/components/composite/page-layout'

const CORP_PREVIEW_USER_TYPE = undefined
const CORP_PREVIEW_USER = undefined

// 일반 corp 서비스 화면은 로그아웃 상태 Header를 표시한다.
const CorpLoggedOutServiceLayout = ({children}: {children: ReactNode}) => (
    <SubPageLayout
        userType={CORP_PREVIEW_USER_TYPE}
        user={CORP_PREVIEW_USER}
        showUserTypeToggle={CORP_PREVIEW_USER_TYPE === undefined}
    >
        {children}
    </SubPageLayout>
)

export default CorpLoggedOutServiceLayout
