'use client'

import {KbigxPrintOutputSelectionDialog} from '@/components/composite/k-bigx-print-output-selection-dialog'
import {Button} from '@/components/ui/button'
import {K_BIGX_REPORT_ACTION, type KBigxReportHistoryItem} from '@/constants/k-bigx-report-history'
import {getKbigxPrintHref} from '@/content/service/k-bigx-print-report'
import type {PrintOutputSectionId} from '@/content/service/k-bigx-print-output-selection'
import {openReportTab} from '@/lib/open-report-print-tab'

// K-BIGx 보고서 이력 카드의 [보고서 다운로드] — 웹 보고서의 [보고서 다운로드] 와 같은 흐름이다(모달 · 새 탭 · PDF 저장을 그대로 쓴다).
//   1. [보고서 다운로드] → 보고서 내용 선택 모달에서 넣을 장을 고른다
//   2. [보고서 미리보기] → 새 탭: report-print?reportId=<item.id>&sections=<고른 장>
//   3. 새 탭이 보고서를 다시 조회해 고른 장만 그린다 → 도구 막대 [PDF 다운로드] 로 받는다
//
// [프론트엔드 연동] 보통은 이 파일을 고치지 않는다. 아래만 확인한다.
//   · 보고서 데이터: 새 탭이 getInnovationGrowthReport(reportId) 로 받는다 → k-bigx-innovation-report.ts 머리 체크리스트대로 API 연결.
//   · reportId: item.id 하나만 넘긴다. 카드의 다른 값(기업명 등)은 모달 요약에만 쓰고 PDF 로 넘기지 않는다
//     — PDF 는 보고서 API 값으로만 그린다(카드 ↔ PDF 값의 짝은 constants/k-bigx-report-history.ts 의 KBigxReportHistoryItem).
//     이력 API 의 id 가 보고서 조회 id 와 다르면 보고서 id 를 받아 openPreview 에 넣는다.
//   · 신용/재무정보 가림(viewerCase): 백엔드가 보고서 데이터에 넣는다. 이 버튼은 관여하지 않는다.
//   · 모달의 조회기준일: 이력 카드에 없어 조회일시(inquiredAt)를 쓴다. 이력 API 가 조회기준일을 주면 그 값으로 바꾼다.

type KBigxReportDownloadButtonProps = {
    item: KBigxReportHistoryItem
    /** 보고서 문서 화면 주소 — 기업 KBIGX_PRINT_CORP_PATH · 기관 KBIGX_PRINT_ORG_PATH(k-bigx-print-report.ts). */
    printPath: string
    className?: string
}

const KBigxReportDownloadButton = ({item, printPath, className}: KBigxReportDownloadButtonProps) => {
    // 모달 위 대상 요약 — 웹 보고서(toPrintOutputSummary)와 같은 두 줄. 조회기준일 자리는 위 [프론트엔드 연동] 참고.
    const summary = [
        {label: '기업명', value: item.companyName},
        {label: '조회기준일', value: item.inquiredAt},
    ]
    const openPreview = (sections: PrintOutputSectionId[]) =>
        openReportTab(getKbigxPrintHref(printPath, {reportId: item.id, sections}))

    return (
        <KbigxPrintOutputSelectionDialog summary={summary} onPrint={openPreview}>
            {/* 어느 건의 보고서인지 이름에 담는다[6.4.3]. */}
            <Button type="button" variant="tertiary" size="sm" className={className}>
                {K_BIGX_REPORT_ACTION.download}
                <span className="sr-only">{` (${item.companyName})`}</span>
            </Button>
        </KbigxPrintOutputSelectionDialog>
    )
}

export {KBigxReportDownloadButton}
export type {KBigxReportDownloadButtonProps}
