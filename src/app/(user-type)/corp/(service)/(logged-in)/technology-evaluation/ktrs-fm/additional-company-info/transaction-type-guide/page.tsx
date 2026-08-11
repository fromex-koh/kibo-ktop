import type {Metadata} from 'next'
import {TradeTypeGuideDialog} from '@/components/composite/trade-type-guide-dialog'

export const metadata: Metadata = {title: '거래유형 설명'}

// 신속표준모형 2단계 · 기업 기타 정보의 [거래유형 설명] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 실제 흐름에서는 기업 기타 정보 탭의 거래유형 및 매출처 구획 버튼이 이 모달을 연다(company-etc-form.tsx).
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKtrsFmTransactionTypeGuidePage = () => (
    <>
        <main id="main" tabIndex={-1} className="bg-background flex-1" />
        <TradeTypeGuideDialog defaultOpen />
    </>
)

export default CorpKtrsFmTransactionTypeGuidePage
