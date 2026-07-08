import type {ReactNode} from 'react'
import Breadcrumb from '@/components/guide/breadcrumb'
import {PageHeader, PageHeaderDescription, PageHeaderTitle} from '@/components/page-header'

// 컴포넌트 가이드 각 섹션 페이지의 공용 틀 — 타이틀 영역(PageHeader)을 통일하고 본문을 감싼다.
// 사이드바 셸(헤더·네비)은 상위 layout.tsx 가 담당하므로 여기선 콘텐츠 컨테이너만 책임진다.
type GuidePageProps = {
    title: string
    description: ReactNode
    // 사이드 내비 카테고리명(예: GUIDE_NAV_SECTIONS 의 title) — 있으면 "카테고리 → title" 브레드크럼을 띄운다.
    category?: string
    children: ReactNode
}

const GuidePage = ({title, description, category, children}: GuidePageProps) => (
    <div className="max-w-content wide:py-16 mx-auto flex w-full flex-col gap-10 px-6 py-12">
        <div className="flex flex-col gap-3">
            {category && <Breadcrumb category={category} current={title} />}
            <PageHeader>
                <PageHeaderTitle variant="compact">{title}</PageHeaderTitle>
                <PageHeaderDescription variant="compact">{description}</PageHeaderDescription>
            </PageHeader>
        </div>
        {children}
    </div>
)

export default GuidePage
