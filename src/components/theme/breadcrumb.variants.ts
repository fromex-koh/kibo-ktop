// PROJECT-STYLE: 브레드크럼의 외형은 프로젝트 전체에서 이 파일의 값 하나뿐이다. size variant 를 두거나
// 사용처에서 크기를 덮어쓰지 않는다 — 화면마다 다른 크기가 생기면 같은 내비게이션이 두 종류로 보인다.
// 기준 시안은 "[공통] 이용약관"(40006716:25655)이다. 알약은 bg-surface·rounded-full·shadow-1 에
// 좌우 24px(px-6)·상하 12px(py-3)이고, 높이 45px = 글자 행간 21 + 상하 여백 24 로 떨어진다.
// PageTitleBar·컴포넌트 가이드·사이드바 헤더가 모두 이 상수를 참조한다(사용처에 복제 금지).
export const breadcrumbPillClassName = 'inline-flex items-center rounded-full bg-surface px-6 py-3 shadow-1'

// 시안 글자는 14px·행간 21(=1.5)이라 typo-body-l 단계다. 항목 간격 12px 은 gap-3 이 그대로 맞는다.
export const breadcrumbListClassName =
    'typo-body-l-regular text-label-foreground flex flex-wrap items-center gap-3 wrap-break-word'
export const breadcrumbItemClassName = 'inline-flex items-center gap-1'
export const breadcrumbLinkClassName = 'hover:text-foreground transition-colors'
// PROJECT-STYLE: 시안 "마지막" 프레임에는 현재 페이지 뒤 16px chevron 이 있지만 쓰지 않기로 결정했다
// — 현재 위치는 굵은 글자와 aria-current 로 전달한다.
export const breadcrumbPageClassName = 'typo-body-l-bold text-foreground'
export const breadcrumbSeparatorClassName = '[&>svg]:size-3.5'
export const breadcrumbEllipsisClassName = 'flex size-5 items-center justify-center [&>svg]:size-4'
