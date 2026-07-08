import type {ComponentPropsWithoutRef} from 'react'

// 페이지·섹션 최상단의 제목+설명 묶음 — shadcn 의 CardHeader·CardTitle·CardDescription 과 같은
// 합성(compound) 컴포넌트 API 다. PageHeader 로 감싸고 안에 PageHeaderTitle·PageHeaderDescription
// 을 둔다. className 으로 자유롭게 확장한다([NA-007] 내부 수정 대신 className/props 로 확장).
const PageHeader = ({className = '', ...props}: ComponentPropsWithoutRef<'header'>) => (
    <header className={`flex flex-col gap-2 ${className}`.trim()} {...props} />
)

// default — 일반 페이지: Display/L/bold + Title/L/Regular.
// compact — 콘텐츠 밀도가 높은 페이지(폼 요소가 많은 페이지 등): Display/M/bold +
// Title/L/Regular(desktop·wide) / Heading/H4/bold + Body/XL/Regular(mobile). 반응형 전환은
// globals.css 의 typo-page-header-title-compact·typo-page-header-description-compact
// 합성 유틸이 담당한다(typo-* 는 순수 CSS 클래스라 wide: 프리픽스를 받지 못해, 이름이 다른 두
// typo 조합 사이의 브레이크포인트 전환은 그 전용 유틸로 뺐다).
type PageHeaderVariant = 'default' | 'compact'

const TITLE_VARIANT_CLASS: Record<PageHeaderVariant, string> = {
    default: 'typo-display-l-bold',
    compact: 'typo-page-header-title-compact',
}

const DESCRIPTION_VARIANT_CLASS: Record<PageHeaderVariant, string> = {
    default: 'typo-title-l-regular',
    compact: 'typo-page-header-description-compact',
}

type PageHeaderTitleProps = ComponentPropsWithoutRef<'h1'> & {variant?: PageHeaderVariant}

const PageHeaderTitle = ({variant = 'default', className = '', children, ...props}: PageHeaderTitleProps) => (
    <h1 className={`${TITLE_VARIANT_CLASS[variant]} ${className}`.trim()} {...props}>
        {children}
    </h1>
)

type PageHeaderDescriptionProps = ComponentPropsWithoutRef<'p'> & {variant?: PageHeaderVariant}

const PageHeaderDescription = ({variant = 'default', className = '', ...props}: PageHeaderDescriptionProps) => (
    <p className={`${DESCRIPTION_VARIANT_CLASS[variant]} text-muted-foreground ${className}`.trim()} {...props} />
)

export {PageHeader, PageHeaderTitle, PageHeaderDescription}
export type {PageHeaderVariant}
