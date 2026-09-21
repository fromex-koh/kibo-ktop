import type {Metadata} from 'next'
import {InnovationGrowthReportScreen} from '@/components/custom/innovation-growth-report-screen'

export const metadata: Metadata = {title: '기업혁신성장 · 기업 검색 결과'}

// 기업혁신성장보고서 조회 결과 — 기업 검색 결과 (org-k-bigx-report-innovation-growth-report-search-result-company).
// [퍼블리싱 확인용] 조회 화면과 같은 화면의 '기업 검색 결과' 상태를 처음부터 보여 준다(목업).
// 케이스 목록과 연동 안내는 InnovationGrowthReportScreen 머리 주석을 본다.
const OrgInnovationGrowthReportCompanyPage = () => <InnovationGrowthReportScreen userType="org" preview="company" />

export default OrgInnovationGrowthReportCompanyPage
