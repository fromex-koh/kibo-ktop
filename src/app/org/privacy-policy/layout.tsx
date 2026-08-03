import type {ReactNode} from 'react'
import {SubPageLayout} from '@/components/composite/page-layout'

// /org/privacy-policy와 하위 화면의 기관 userType을 공통 Shell에 전달한다.
const OrgPrivacyPolicyLayout = ({children}: {children: ReactNode}) => (
    <SubPageLayout userType="org">{children}</SubPageLayout>
)

export default OrgPrivacyPolicyLayout
