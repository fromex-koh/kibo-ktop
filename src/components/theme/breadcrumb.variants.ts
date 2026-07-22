// PROJECT-STYLE: Figma "브레드크럼"은 브레드크럼을 알약 컨테이너에 담는다 — bg-surface·rounded-full·
// 좌우 40px(px-10)·상하 16px(py-4)·shadow-1. PageTitleBar 와 컴포넌트 가이드가 같은 외형을 써야 하므로
// 클래스 문자열을 여기 한 곳에서 관리한다(각 사용처에 복제하면 디자인 변경 시 어긋난다).
export const breadcrumbPillClassName = 'inline-flex items-center rounded-full bg-surface px-10 py-4 shadow-1'

export const breadcrumbListClassName =
    'typo-body-xl-regular text-label-foreground flex flex-wrap items-center gap-3 wrap-break-word'
export const breadcrumbItemClassName = 'inline-flex items-center gap-1'
export const breadcrumbLinkClassName = 'hover:text-foreground transition-colors'
export const breadcrumbPageClassName = 'typo-body-xl-bold text-foreground'
export const breadcrumbSeparatorClassName = '[&>svg]:size-3.5'
export const breadcrumbEllipsisClassName = 'flex size-5 items-center justify-center [&>svg]:size-4'
