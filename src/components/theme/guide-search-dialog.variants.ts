// 컴포넌트 가이드 전용 검색 — 공용 Dialog·Input primitive는 그대로 두고, 헤더 트리거와 검색 결과 스타일만 관리한다.
// 색상·크기·타이포는 프로젝트의 시멘틱 유틸리티와 토큰을 사용한다.
const guideSearchTriggerClassName =
    'border-control bg-surface text-placeholder hover:border-foreground-subtle hover:text-foreground focus-visible:border-primary outline-ring focus-visible:outline-ring flex size-11 items-center gap-2 rounded-sm border px-3 text-left transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid md:w-60'

const guideSearchTriggerTextClassName = 'typo-body-l-regular hidden flex-1 truncate md:block'

// h-100 — 검색 결과 수와 무관하게 본문 높이를 유지해 입력할 때 모달이 위아래로 흔들리지 않게 한다.
// Dialog 의 max-h 안에서는 grid 의 minmax(0, 1fr) 행과 min-h-0 조합으로 줄어든다.
const guideSearchBodyClassName = 'row-start-2 flex h-100 min-h-0 flex-col gap-3 overflow-hidden px-10 pb-10'

// p-1 — Input 의 2px outline + 2px offset 이 overflow 경계에 잘리지 않는 전용 여백이다.
const guideSearchInputWrapClassName = 'relative shrink-0 p-1'

const guideSearchInputIconClassName =
    'text-foreground-subtle pointer-events-none absolute top-1/2 left-5 size-icon-sm -translate-y-1/2'

const guideSearchInputClassName = 'pl-11'

// 스크롤 컨테이너 안쪽 여백 — 첫·마지막 결과의 포커스링이 overflow 경계에 잘리지 않게 하고,
// 결과 항목이 스크롤바와 목록의 위·아래 끝에 붙지 않도록 한다.
const guideSearchResultListClassName = 'flex min-h-0 flex-col gap-1 overflow-y-auto py-2 pr-3 pl-1 scroll-py-2'

const guideSearchResultLinkClassName =
    'hover:bg-accent focus-visible:bg-accent outline-ring focus-visible:outline-ring group flex min-h-11 items-center gap-3 rounded-sm px-3 py-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-solid'

const guideSearchResultTitleClassName = 'typo-body-l-medium text-foreground'
const guideSearchResultCategoryClassName = 'typo-caption-regular text-muted-foreground truncate'
const guideSearchResultIconClassName =
    'text-foreground-subtle group-hover:text-foreground group-focus-visible:text-foreground ml-auto size-icon-sm shrink-0'

const guideSearchEmptyClassName =
    'typo-body-l-regular text-muted-foreground flex flex-1 items-center justify-center text-center'

export {
    guideSearchTriggerClassName,
    guideSearchTriggerTextClassName,
    guideSearchBodyClassName,
    guideSearchInputWrapClassName,
    guideSearchInputIconClassName,
    guideSearchInputClassName,
    guideSearchResultListClassName,
    guideSearchResultLinkClassName,
    guideSearchResultTitleClassName,
    guideSearchResultCategoryClassName,
    guideSearchResultIconClassName,
    guideSearchEmptyClassName,
}
