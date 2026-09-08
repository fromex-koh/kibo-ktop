import type {Metadata} from 'next'
import {GuaranteeRecommendationCompleteDialog} from '@/components/composite/guarantee-recommendation-dialog'
import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'

export const metadata: Metadata = {title: '보증추천완료'}

// 보증추천 모달에서 [보증 추천] 을 누르면 이어서 뜨는 완료 알림 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다(다른 모달 단독 화면과 같은 방식).
const OrgMypageGuaranteeRecommendationCompletePage = () => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="보증추천완료">보증추천 모달의 [보증 추천]이 호출하는 팝업</PopupPreviewNote>
        </main>
        <GuaranteeRecommendationCompleteDialog defaultOpen />
    </>
)

export default OrgMypageGuaranteeRecommendationCompletePage
