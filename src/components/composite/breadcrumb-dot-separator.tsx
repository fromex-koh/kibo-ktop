import type {ComponentProps} from 'react'
import {BreadcrumbSeparator} from '@/components/kit/breadcrumb'

// 프로젝트 표준 브레드크럼 구분자 — 4px 회색 점(·). (L2 composite)
// kit/breadcrumb 는 원본 바닐라라 기본 구분자가 chevron 이다. 프로젝트 표준인 점 구분자는 kit 의 기본값을
// 바꾸지 않고(=셸 바닐라 유지, [SC-02]/[SC-04]) 여기서 children 으로 주입해 조합한다.
// li 를 inline-flex items-center 로 둬 4px 점을 인접 텍스트와 세로 중앙 정렬한다(순수 스타일).
const BreadcrumbDotSeparator = (props: ComponentProps<typeof BreadcrumbSeparator>) => (
    <BreadcrumbSeparator className="inline-flex items-center" {...props}>
        <span className="bg-separator-dot size-1 shrink-0 rounded-full" />
    </BreadcrumbSeparator>
)

export {BreadcrumbDotSeparator}
