import type {Metadata} from 'next'
import {TechnologyCategoryDialog} from '@/components/composite/technology-category-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '기술분류'}

// Tech-Index 일반용 기업정보의 [기술분류] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 기업 상세 정보의 기술분류 칸 옆 [조회]에서 여는 모달이고, 그 자리에도 이미 연결되어 있다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpTechIndexTechnologyCategoryPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="기술분류">기업 상세 정보의 기술분류 [조회]에서 호출되는 팝업</PopupPreviewNote>
        </main>
        {/* 이 화면에서는 고른 값을 담을 폼이 없어 onSelect 를 넘기지 않는다 — 누르면 창만 닫힌다. */}
        <TechnologyCategoryDialog defaultOpen>
            <span className="sr-only">기술분류 조회</span>
        </TechnologyCategoryDialog>
    </>
)

export default CorpTechIndexTechnologyCategoryPage
