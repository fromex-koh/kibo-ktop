import type {Metadata} from 'next'
import {GuaranteeApplicationDialog} from '@/components/composite/guarantee-application-dialog'

export const metadata: Metadata = {title: '보증 신청'}

// 신속표준모형 5단계 완료 화면의 [보증신청] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
// 완료 화면의 [보증신청] 버튼과는 아직 잇지 않았다(보증신청 흐름 미정).
const CorpKtrsFmGuaranteeApplicationPage = () => (
    <>
        <main id="main" tabIndex={-1} className="bg-background flex-1" />
        <GuaranteeApplicationDialog defaultOpen />
    </>
)

export default CorpKtrsFmGuaranteeApplicationPage
