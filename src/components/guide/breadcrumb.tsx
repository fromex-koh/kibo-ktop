import {ChevronRight} from 'lucide-react'

type BreadcrumbProps = {
    category: string
    current: string
}

// 브레드크럼 — 사이드 메뉴 계층(카테고리 → 현재 페이지)을 그대로 반영한다. 사이드 내비가 이미
// 같은 이동 경로를 제공하므로 중복 링크를 두지 않고 텍스트로만 표시한다. 마지막 항목만
// aria-current(현재 위치).
const Breadcrumb = ({category, current}: BreadcrumbProps) => (
    <nav aria-label="브레드크럼">
        <ol className="typo-caption-regular text-muted-foreground flex flex-wrap items-center gap-1.5">
            <li>{category}</li>
            <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="text-foreground font-semibold">
                {current}
            </li>
        </ol>
    </nav>
)

export default Breadcrumb
