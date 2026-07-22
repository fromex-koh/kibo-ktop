import type {ReactNode} from 'react'

// 컴포넌트 가이드 각 섹션 페이지의 공용 틀(래퍼 컴포넌트) — 타이틀 영역과 본문 간격을 통일한다.
// 라우트 특수파일 page.tsx 와 헷갈리지 않도록 컴포넌트임을 드러내는 'Shell' 이름을 쓴다.
// 사이드바 셸(헤더·네비)은 상위 layout.tsx 가 담당하므로 여기선 콘텐츠 컨테이너만 책임진다.
// 브레드크럼은 셸 상단 앱바(sidebar-layout)에 있으므로 페이지 안에서는 중복으로 띄우지 않는다.
type GuidePageShellProps = {
    title: string
    description: ReactNode
    children: ReactNode
}

const GuidePageShell = ({title, description, children}: GuidePageShellProps) => (
    <div className="max-w-content mx-auto flex w-full flex-col gap-10 px-6 py-12 md:py-16">
        <header className="flex flex-col gap-y-1">
            <h1 className="typo-display-m-bold text-foreground text-balance">{title}</h1>
            <p className="typo-title-l-regular text-foreground-subtle">{description}</p>
        </header>
        {children}
    </div>
)

export default GuidePageShell
