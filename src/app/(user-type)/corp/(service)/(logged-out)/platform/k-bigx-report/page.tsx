import type {Metadata} from 'next'
import {PlatformKBigxReport} from '@/components/custom/platform-k-bigx-report'

export const metadata: Metadata = {title: 'K-BIGx 보고서 소개'}

// 플랫폼 소개 > K-BIGx 보고서 — 본문은 기업 · 기관 공용(custom/platform-k-bigx-report.tsx).
// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
const CorpPlatformKBigxReportPage = () => <PlatformKBigxReport userType="corp" />

export default CorpPlatformKBigxReportPage
