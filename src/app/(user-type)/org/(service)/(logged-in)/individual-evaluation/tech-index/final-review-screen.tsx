import {PopupPreviewNote, popupPreviewMainClassName} from '@/components/custom/popup-preview-note'
import {FinalReviewConfirm} from './final-review-confirm'
import {TECH_INDEX_MODEL_META, type TechIndexModel} from './model-meta'

// 기관 개별평가 Tech-Index (4) 최종 확인 — KTRS-FM 최종 확인과 같은 구성이다.
// 화면 본문(입력 내용 요약)은 아직 시안이 없어 비워 두고, 제출 전 최종 확인 모달만 열어 둔다 —
// 다른 모달 단독 화면과 같은 방식이다. 본문이 만들어지면 이 자리에 요약을 채우고,
// 화면 맨 아래 [제출] 이 모달을 열도록 잇는다.
// 모달의 [제출] 은 (5) 완료 화면으로 이어진다(FinalReviewConfirm).
const TechIndexFinalReviewScreen = ({model}: {model: TechIndexModel}) => (
    <>
        <main id="main" tabIndex={-1} className={popupPreviewMainClassName}>
            <PopupPreviewNote title="최종 확인">화면 맨 아래 [제출]이 호출하는 확인 팝업</PopupPreviewNote>
        </main>
        <FinalReviewConfirm completePath={`${TECH_INDEX_MODEL_META[model].base}/complete`} />
    </>
)

export {TechIndexFinalReviewScreen}
