import type {Metadata} from 'next'
import {CitationManualDialog} from '@/components/composite/citation-manual-dialog'

export const metadata: Metadata = {title: '피인용 확인 메뉴얼'}

// 신속표준모형 3단계 체크리스트의 [피인용 확인 메뉴얼] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 체크리스트 화면이 아직 없어 여는 버튼과는 잇지 않았다.
// 이 화면은 모달만 확인하는 자리라 뒤 배경을 비우고 모달을 열어 둔다 — 다른 모달 단독 화면과 같은 방식이다.
const CorpKtrsFmCitationManualPage = () => (
    <>
        <main id="main" tabIndex={-1} className="bg-background flex-1" />
        <CitationManualDialog defaultOpen />
    </>
)

export default CorpKtrsFmCitationManualPage
