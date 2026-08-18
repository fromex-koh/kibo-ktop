import type {Metadata} from 'next'
import {TechnologyCategoryDialog} from '@/components/composite/technology-category-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {FIRST_TECHNOLOGY_CATEGORY_ITEM} from '@/content/service/technology-categories'

export const metadata: Metadata = {title: '품목설명'}

// 기관 개별평가 Tech-Index 기업정보의 [품목설명] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 모달은 [기술분류] 표의 줄마다 붙는 [품목설명]이 여는 것이라 혼자 뜨는 법이 없다. 그래서 이 화면은
// 기술분류 모달을 열고 그 위에 첫 줄 품목의 설명 모달까지 겹쳐 둔다 — 실제로 보게 되는 모습 그대로다.
// 내용은 기업 화면과 같다(composite/technology-category-dialog · composite/item-description-dialog).
// 투자모형도 같은 모달이라 그 경로는 이 화면을 다시 내보낸다.
const OrgTechIndexItemDescriptionPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="품목설명">기술분류 표의 [품목설명]에서 호출되는 팝업</PopupPreviewNote>
        </main>
        {/* 이 화면에는 고른 값을 담을 폼이 없어 onSelect 를 넘기지 않는다 — 누르면 창만 닫힌다. */}
        <TechnologyCategoryDialog defaultOpen defaultOpenItemNo={FIRST_TECHNOLOGY_CATEGORY_ITEM.no}>
            <span className="sr-only">기술분류 조회</span>
        </TechnologyCategoryDialog>
    </>
)

export default OrgTechIndexItemDescriptionPage
