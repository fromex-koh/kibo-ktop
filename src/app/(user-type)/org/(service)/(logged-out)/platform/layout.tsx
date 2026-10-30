import type {ReactNode} from 'react'
import {ScrollToTopButton} from '@/components/composite/scroll-to-top-button'

// 플랫폼 소개 화면 묶음(소개 · 기술평가 · 특허평가 · K-BIGx 보고서 · 탄소중립) — 내용이 긴 화면이라 맨 위로 버튼을 한 번만 둔다.
// 일정 높이 이상 스크롤했을 때만 나타나고(기술평가는 탭을 눌러 길어지면 그때부터), 푸터가 보이면 사라진다.
const OrgPlatformLayout = ({children}: {children: ReactNode}) => (
    <>
        {children}
        <ScrollToTopButton className="print:hidden" />
    </>
)

export default OrgPlatformLayout
