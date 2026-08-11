import type {Metadata} from 'next'
import {SubmitConfirmDialog} from '@/components/composite/submit-confirm-dialog'

export const metadata: Metadata = {title: '최종 확인'}

// 신속표준모형 4단계 최종 확인 — 화면 본문(입력 내용 요약)은 아직 시안이 없어 비워 둔다.
// 지금은 제출 전 최종 확인 모달만 확인하는 자리라 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
// 본문이 만들어지면 이 자리에 요약을 채우고, 화면 맨 아래 [제출] 이 모달을 열도록 잇는다.
const CorpKtrsFmFinalReviewPage = () => (
    <>
        <main id="main" tabIndex={-1} className="bg-background flex-1" />
        <SubmitConfirmDialog defaultOpen />
    </>
)

export default CorpKtrsFmFinalReviewPage
