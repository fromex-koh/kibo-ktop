import type {Metadata} from 'next'
import {PlatformTechnologyEvaluation} from '@/components/custom/platform-technology-evaluation'

export const metadata: Metadata = {title: '기술평가 소개'}

// 플랫폼 소개 > 기술평가 — 본문은 기업 · 기관 공용(custom/platform-technology-evaluation.tsx).
// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
const CorpPlatformTechnologyEvaluationPage = () => <PlatformTechnologyEvaluation userType="corp" />

export default CorpPlatformTechnologyEvaluationPage
