import type {ReactNode} from 'react'
import {SubPageLayout} from '@/components/composite/page-layout'

// 실제 인증 연동 시 서버 세션·인증 API에서 조회한 userType을 SubPageLayout에 전달한다.
// user는 서버 세션·인증 API에서 조회한 로그인 사용자 정보다.
// userType이 없으면 기업/기관 토글을 노출하고, 있으면 해당 유형으로 Header를 고정한다.
// SubPageLayout 사용법과 Props는 /component-guide/sub-page-layout 가이드에서 확인한다.
// 예:
// const userType = user?.userType
// <SubPageLayout userType={userType} showUserTypeToggle={userType === undefined}>{children}</SubPageLayout>
// 값은 PageLayoutBase를 거쳐 Header의 유형별 메뉴·배지·토글 상태를 결정한다.
// 로그인 전에는 userType을 전달하지 않아 기업/기관 토글을 노출하고, 로그인 후에는 확정 유형으로 고정한다.
const OrgTermsLayout = ({children}: {children: ReactNode}) => <SubPageLayout>{children}</SubPageLayout>

export default OrgTermsLayout
