import type {Metadata} from 'next'
import {PlatformPatentEvaluation} from '@/components/custom/platform-patent-evaluation'

export const metadata: Metadata = {title: '특허평가 소개'}

// 플랫폼 소개 > 특허평가 — 본문은 기업 · 기관 공용(custom/platform-patent-evaluation.tsx).
// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
const CorpPlatformPatentEvaluationPage = () => <PlatformPatentEvaluation userType="corp" />

export default CorpPlatformPatentEvaluationPage
