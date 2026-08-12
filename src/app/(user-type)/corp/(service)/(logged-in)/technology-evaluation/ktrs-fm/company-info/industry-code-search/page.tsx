import type {Metadata} from 'next'
import {IndustryCodeDialog} from '@/components/composite/industry-code-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '업종코드 조회'}

// 신속표준모형 2단계 · 기업정보의 [업종코드 조회] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 실제 흐름에서는 기업정보 탭 업종코드 칸의 [조회] 버튼이 이 모달을 연다(company-info-form.tsx).
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKtrsFmIndustryCodeSearchPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="업종코드 조회">기업정보의 업종코드 [조회] 버튼이 호출하는 팝업</PopupPreviewNote>
        </main>
        <IndustryCodeDialog defaultOpen />
    </>
)

export default CorpKtrsFmIndustryCodeSearchPage
