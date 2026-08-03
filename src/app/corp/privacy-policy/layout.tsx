import type {ReactNode} from 'react'
import {SubPageLayout} from '@/components/composite/page-layout'

// 이용약관·개인정보 처리방침은 기업·기관이 함께 쓰는 공통 화면이다. /corp와 /org 양쪽에 같은 화면을
// 두는 이유는 화면정의서 본수를 경로별로 세기 위해서일 뿐, 화면 내용은 유형에 따라 갈리지 않는다.
// 그래서 userType을 고정하지 않고 Header를 로그인 전 구성(기업·기관 토글 노출)으로 둔다 —
// userType을 넘기면 토글이 숨어 로그인 후 화면처럼 보인다.
const CorpPrivacyPolicyLayout = ({children}: {children: ReactNode}) => <SubPageLayout>{children}</SubPageLayout>

export default CorpPrivacyPolicyLayout
