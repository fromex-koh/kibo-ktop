import type {Metadata} from 'next'
import {GuaranteeRecommendationDialog} from '@/components/composite/guarantee-recommendation-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {GUARANTEE_RECOMMENDATION_DEFAULTS} from '@/content/service/org-evaluation-history'

export const metadata: Metadata = {title: '보증추천'}

// 기관 평가결과 조회 카드의 [보증추천] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다(다른 모달 단독 화면과 같은 방식).
const OrgMypageGuaranteeRecommendationPage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="보증추천">평가결과 카드의 [보증추천]이 호출하는 팝업</PopupPreviewNote>
        </main>
        <GuaranteeRecommendationDialog defaultOpen defaultValues={GUARANTEE_RECOMMENDATION_DEFAULTS} />
    </>
)

export default OrgMypageGuaranteeRecommendationPage
