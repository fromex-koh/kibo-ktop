import type {ReactNode} from 'react'

// /org 공통 라우트 경계. 404·500·정기점검 미리보기 화면이 Header·Footer를 상속하지 않도록 UI Shell을 렌더링하지 않는다.
// 일반 서비스 화면의 Header·Footer는 각 플로우의 layout.tsx에서 구성한다.
const OrgLayout = ({children}: {children: ReactNode}) => children

export default OrgLayout
