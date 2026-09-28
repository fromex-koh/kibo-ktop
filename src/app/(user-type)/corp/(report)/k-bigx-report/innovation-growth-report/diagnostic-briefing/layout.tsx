import type {ReactNode} from 'react'

// 보고서 문서의 본문 상자 — main 을 이 자리에서 하나만 그린다.
// 문서(page)와 스켈레톤(loading)이 각자 main 을 그리면, 스트리밍으로 보내는 HTML 한 벌에 스켈레톤과 문서가
// 함께 담기면서 main 이 여러 개가 된다(id "main" 중복 · 보이는 main 둘 이상)[8.1.1]. 둘 다 안쪽만 그리게 두고
// 바깥 상자는 여기서 공유한다.
const DiagnosticBriefingLayout = ({children}: {children: ReactNode}) => (
    <main id="main" tabIndex={-1} className="bg-background text-foreground min-h-dvh">
        {children}
    </main>
)

export default DiagnosticBriefingLayout
