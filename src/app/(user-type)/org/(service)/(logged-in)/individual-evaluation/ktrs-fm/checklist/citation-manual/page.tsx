import type {Metadata} from 'next'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {CitationManualDialog} from '@/components/composite/citation-manual-dialog'

export const metadata: Metadata = {title: '피인용 확인 메뉴얼'}

// 기관 개별평가 KTRS-FM 3단계 체크리스트의 [피인용 확인 메뉴얼] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 실제 흐름에서는 체크리스트 문항 끝의 [피인용 확인 메뉴얼] 버튼이 이 모달을 연다(checklist-form.tsx).
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const OrgKtrsFmCitationManualPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="피인용 확인 메뉴얼">
                체크리스트의 [피인용 확인 메뉴얼]이 호출하는 팝업
            </PopupPreviewNote>
        </main>
        <CitationManualDialog defaultOpen />
    </>
)

export default OrgKtrsFmCitationManualPage
