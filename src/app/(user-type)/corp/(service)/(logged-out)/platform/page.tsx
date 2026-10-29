import type {Metadata} from 'next'
import {PlatformIntro} from '@/components/custom/platform-intro'
// 이 화면 전용 CSS — 상단 등장 연출(PB-18: 화면 CSS 는 그 화면의 page.tsx 에서 import).
import '@/styles/platform-intro.css'

export const metadata: Metadata = {title: '플랫폼 소개'}

// 플랫폼 소개(오픈 플랫폼 소개) — 본문은 기업 · 기관이 같은 PlatformIntro 를 쓰고, 링크 경로만 사용자 유형으로 나뉜다.
// <main id="main"> 은 PlatformIntro 가 그린다(SkipNav 도착 대상).
const CorpPlatformPage = () => <PlatformIntro userType="corp" />

export default CorpPlatformPage
