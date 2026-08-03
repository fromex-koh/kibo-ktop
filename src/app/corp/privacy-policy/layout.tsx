import type {ReactNode} from 'react'
import {SubPageLayout} from '@/components/composite/page-layout'

// /corp/privacy-policy와 하위 화면의 기업 userType을 공통 Shell에 전달한다.
const CorpPrivacyPolicyLayout = ({children}: {children: ReactNode}) => (
    <SubPageLayout userType="corp">{children}</SubPageLayout>
)

export default CorpPrivacyPolicyLayout
