import type {ReactNode} from 'react'
import {PageHeader, PageHeaderDescription, PageHeaderTitle} from '@/components/composite/page-header'

// 컴포넌트 가이드 각 섹션 페이지의 공용 틀 — 타이틀 영역(PageHeader)을 통일하고 본문을 감싼다.
// 사이드바 셸(헤더·네비)은 상위 layout.tsx 가 담당하므로 여기선 콘텐츠 컨테이너만 책임진다.
// 브레드크럼은 셸 상단 앱바(sidebar-layout)에 있으므로 페이지 안에서는 중복으로 띄우지 않는다.
type GuidePageProps = {
    title: string
    description: ReactNode
    children: ReactNode
}

const GuidePage = ({title, description, children}: GuidePageProps) => (
    <div className="max-w-content mx-auto flex w-full flex-col gap-10 px-6 py-12 md:py-16">
        <PageHeader>
            <PageHeaderTitle variant="compact">{title}</PageHeaderTitle>
            <PageHeaderDescription variant="compact">{description}</PageHeaderDescription>
        </PageHeader>
        {children}
    </div>
)

export default GuidePage
