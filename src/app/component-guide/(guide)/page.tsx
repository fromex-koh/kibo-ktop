import type {Metadata} from 'next'
import {PageHeader, PageHeaderTitle} from '@/components/composite/page-header'

export const metadata: Metadata = {
    // layout 의 template('%s · 컴포넌트 가이드')과 겹치지 않도록 개요는 단독 제목을 쓴다.
    title: {absolute: '컴포넌트 가이드'},
}

// 개요(랜딩) — 안내 문구만 둔다. 실제 섹션은 사이드 네비로 이동한다.
const ComponentGuidePage = () => (
    <div className="max-w-content mx-auto flex w-full flex-col px-6 py-12 md:py-16">
        <PageHeader>
            <PageHeaderTitle variant="compact">컴포넌트 가이드 시작 페이지</PageHeaderTitle>
        </PageHeader>
    </div>
)

export default ComponentGuidePage
