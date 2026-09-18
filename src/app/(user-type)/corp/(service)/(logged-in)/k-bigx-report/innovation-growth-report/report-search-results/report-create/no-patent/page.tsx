import type {Metadata} from 'next'
import {KbigxReportCreateDialog} from '@/components/composite/k-bigx-report-create-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {MOCK_REPORT_CREATE_COMPANY} from '@/content/service/k-bigx-report-create'

export const metadata: Metadata = {title: '보고서 생성(특허수 없음)'}

// K-BIGx 보고서 검색 결과의 [보고서 생성] 모달 중 특허수가 없는 기업의 경우 — 특허 정보를 넘기지 않으면
// 특허 정보 상자 대신 '보유 특허 정보가 확인되지 않습니다' 안내가 보인다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKbigxReportCreateNoPatentPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="보고서 생성(특허수 없음)">
                K-BIGx 보고서 검색 결과에서 특허수가 없는 기업의 보고서 생성을 눌렀을 때 호출되는 화면
            </PopupPreviewNote>
        </main>
        <KbigxReportCreateDialog companyName={MOCK_REPORT_CREATE_COMPANY} defaultOpen />
    </>
)

export default CorpKbigxReportCreateNoPatentPage
