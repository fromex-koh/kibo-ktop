import type {Metadata} from 'next'
import {PostcodeSearchPage} from '@/components/custom/auth-flow-page'

export const metadata: Metadata = {title: '주소 찾기'}

// 신속표준모형 2단계 · 기업정보의 [주소 검색] 모달 — 화면정의서의 하위 화면이라 경로를 따로 둔다.
// 기관의 우편번호 검색 화면을 그대로 쓴다(뒤 배경 안내까지 같다). 제목만 이 화면의 버튼과 같은
// "주소 검색" 으로 바꾼다 — 눌러서 무엇이 나오는지 그대로 읽힌다[6.4.3].
const CorpKtrsFmAddressSearchPage = () => <PostcodeSearchPage title="주소 검색" />

export default CorpKtrsFmAddressSearchPage
