import type {Metadata} from 'next'
import {OrgKbigxReportScreen} from '@/app/(user-type)/org/(service)/(logged-in)/k-bigx-report/org-kbigx-report-screen'

export const metadata: Metadata = {title: '기업혁신성장'}

// K-BIGx 보고서 · 기업혁신성장보고서 조회 — 조회 화면 (org-k-bigx-report-innovation-growth-report).
// 검색 전 상태로 시작한다. 검색하면 같은 자리에서 결과로 바뀐다.
// 대량정보조회와 한 화면의 탭이다 — 이 주소는 [기업혁신성장] 탭이 켜진 채로 연다(OrgKbigxReportScreen 머리 주석).
// 케이스별 결과 화면은 search-result/ 아래에 있다 — 목록과 설명은 InnovationGrowthReportScreen 머리 주석을 본다.
const OrgInnovationGrowthReportPage = () => <OrgKbigxReportScreen />

export default OrgInnovationGrowthReportPage
