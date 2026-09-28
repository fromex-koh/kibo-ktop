import type {Metadata} from 'next'
import {LoginScreen} from '@/components/custom/login-screen'

export const metadata: Metadata = {title: '로그인'}

// 로그인 (org-auth) — 기업 화면과 같은 한 장이고 브레드크럼의 홈 주소만 다르다.
const OrgAuthPage = () => <LoginScreen userType="org" />

export default OrgAuthPage
