import type {Metadata} from 'next'
import {LoginScreen} from '@/components/custom/login-screen'

export const metadata: Metadata = {title: '로그인'}

// 로그인 (corp-auth) — 기업회원 · 기관회원을 한 화면에서 탭으로 오간다.
// 화면 구성과 연동 안내는 LoginScreen 머리 주석을 본다.
const CorpLoginPage = () => <LoginScreen userType="corp" />

export default CorpLoginPage
