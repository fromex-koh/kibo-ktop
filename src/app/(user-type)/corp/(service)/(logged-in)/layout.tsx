import type {ReactNode} from 'react'
import {SubPageLayout} from '@/components/composite/page-layout'

const CORP_PREVIEW_USER_TYPE = 'corp' as const
const CORP_PREVIEW_USER = {name: '한국미래기술혁신성장기업(주)', sessionRemaining: '30:00'} as const

// 로그인 연장·로그아웃 종료 화면만 로그인 상태 Header로 미리보기한다.
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
