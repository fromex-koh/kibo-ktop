import type {ReactNode} from 'react'
import {SubPageLayout} from '@/components/composite/page-layout'
import {CORP_PREVIEW_USER} from '@/constants/preview-user'

const CORP_PREVIEW_USER_TYPE = 'corp' as const

// 로그인 필요 서비스 화면에 기업 로그인 상태 Header를 표시한다.
const CorpLoggedInPreviewLayout = ({children}: {children: ReactNode}) => (
    <SubPageLayout
        userType={CORP_PREVIEW_USER_TYPE}
        user={CORP_PREVIEW_USER}
        showUserTypeToggle={CORP_PREVIEW_USER_TYPE === undefined}
    >
        {children}
    </SubPageLayout>
)

export default CorpLoggedInPreviewLayout
