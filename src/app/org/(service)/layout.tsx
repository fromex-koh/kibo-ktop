import type {ReactNode} from 'react'
import {SubPageLayout} from '@/components/composite/page-layout'

// /org 일반 서비스 화면의 공통 Shell. (service)는 URL에 포함되지 않는다.
// 실제 인증 연동 시 이 서버 레이아웃에서 세션 user·userType을 조회해 SubPageLayout에 전달한다.
// userType이 없으면 기업/기관 토글을 표시하고, 있으면 해당 유형의 GNB·전체 메뉴를 고정한다.
// 예: <SubPageLayout userType={user?.userType} user={user} showUserTypeToggle={user?.userType === undefined}>{children}</SubPageLayout>
// /org/not-found·/org/server-error·/org/maintenance는 이 레이아웃 밖에 두어 풀페이지로 유지한다.
const OrgServiceLayout = ({children}: {children: ReactNode}) => <SubPageLayout>{children}</SubPageLayout>

export default OrgServiceLayout
