import type {Metadata} from 'next'
import {OrgSubAccountProgressScreen} from '@/components/custom/org-sub-account-progress-screen'

export const metadata: Metadata = {title: '하위계정 현황'}

// 기관 마이페이지 · 하위계정 현황 — 시안 화면 그대로의 케이스다([기술평가부] 비협약 은행/기관).
// 이용서비스에 평가 모형 넷이 모두 온다. 다른 세 케이스는 이 경로 아래 형제 화면으로 둔다.
const OrgMypageSubAccountProgressPage = () => <OrgSubAccountProgressScreen caseKey="tech-non-partner" />

export default OrgMypageSubAccountProgressPage
