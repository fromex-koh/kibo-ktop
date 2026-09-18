import type {Metadata} from 'next'
import {KbigxReportCreateDialog} from '@/components/composite/k-bigx-report-create-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {MOCK_REPORT_CREATE_COMPANY, MOCK_REPORT_CREATE_PATENT} from '@/content/service/k-bigx-report-create'

export const metadata: Metadata = {title: '보고서 생성(특허수 있음)'}

// K-BIGx 보고서 기업혁신성장 검색 결과의 [보고서 생성] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKbigxReportCreatePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="보고서 생성(특허수 있음)">
                K-BIGx 보고서 검색 결과에서 보고서 생성을 눌렀을 때 호출되는 화면
            </PopupPreviewNote>
        </main>
        <KbigxReportCreateDialog
            companyName={MOCK_REPORT_CREATE_COMPANY}
            patent={MOCK_REPORT_CREATE_PATENT}
            defaultOpen
        />
    </>
)

export default CorpKbigxReportCreatePage
