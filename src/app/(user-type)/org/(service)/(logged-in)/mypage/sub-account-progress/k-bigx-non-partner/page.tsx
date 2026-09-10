import type {Metadata} from 'next'
import {OrgSubAccountProgressScreen} from '@/components/custom/org-sub-account-progress-screen'

export const metadata: Metadata = {title: '하위계정 현황 ([K-BIGx] 비협약 은행/기관)'}

// 기관 마이페이지 · 하위계정 현황 — K-BIGx 보고서만 쓰는 비협약 은행/기관으로 로그인했을 때.
// 화면 구성은 기본 경로와 같고 협약 정보의 [이용서비스]만 다르다(K-BIGx).
const OrgMypageSubAccountProgressKBigxNonPartnerPage = () => (
    <OrgSubAccountProgressScreen caseKey="k-bigx-non-partner" />
)

export default OrgMypageSubAccountProgressKBigxNonPartnerPage
