import type {Metadata} from 'next'
import {KbigxPrintPage, type KbigxPrintPageProps} from '@/components/custom/kbigx-print-page'
import {KBIGX_PRINT_REPORT_TITLE} from '@/content/service/k-bigx-print-report'
// 용지 규격과 인쇄 설정(@page) — 이 화면에서만 쓰므로 전역이 아니라 여기서 부른다.
import '@/styles/report-print.css'

export const metadata: Metadata = {title: KBIGX_PRINT_REPORT_TITLE}

// K-BIGx 보고서 · 보고서 출력(기업) (corp-k-bigx-report-innovation-growth-report-report-print · /corp/k-bigx-report/innovation-growth-report/report-print)
// 쿼리 · 인쇄 흐름 · 연동 지점은 components/custom/kbigx-print-page.tsx 참고. 기관 화면과 같은 인쇄본을 그린다.

const CorpKbigxReportPrintPage = ({searchParams}: KbigxPrintPageProps) => <KbigxPrintPage searchParams={searchParams} />

export default CorpKbigxReportPrintPage
