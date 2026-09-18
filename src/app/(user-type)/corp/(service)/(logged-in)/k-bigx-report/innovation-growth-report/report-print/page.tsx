import type {Metadata} from 'next'
import {KbigxReportPrintDialog} from '@/components/composite/k-bigx-report-print-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {MOCK_REPORT_PRINT_DEFAULT_SELECTED, MOCK_REPORT_PRINT_SUMMARY} from '@/content/service/k-bigx-report-print'

export const metadata: Metadata = {title: '보고서 출력'}

// K-BIGx 보고서 기업혁신성장의 [보고서 출력] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKbigxReportPrintPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="보고서 출력">
                K-BIGx 보고서 기업혁신성장에서 보고서 출력을 눌렀을 때 호출되는 화면
            </PopupPreviewNote>
        </main>
        <KbigxReportPrintDialog
            summary={MOCK_REPORT_PRINT_SUMMARY}
            defaultSelected={MOCK_REPORT_PRINT_DEFAULT_SELECTED}
            defaultOpen
        />
    </>
)

export default CorpKbigxReportPrintPage
