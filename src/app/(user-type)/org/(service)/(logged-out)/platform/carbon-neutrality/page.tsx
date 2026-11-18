import type {Metadata} from 'next'
import {PlatformCarbonNeutrality} from '@/components/custom/platform-carbon-neutrality'

export const metadata: Metadata = {title: '탄소중립 소개'}

// 플랫폼 소개 > 탄소중립 — 본문은 기업 · 기관 공용(custom/platform-carbon-neutrality.tsx).
// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
const OrgPlatformCarbonNeutralityPage = () => <PlatformCarbonNeutrality userType="org" />

export default OrgPlatformCarbonNeutralityPage
