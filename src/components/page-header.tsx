import type {ComponentPropsWithoutRef} from 'react'
import {cva, type VariantProps} from 'class-variance-authority'
import {cn} from '@/lib/utils'

// 페이지·섹션 최상단의 제목+설명 묶음 — shadcn 의 Card*/CardHeader·CardTitle·CardDescription 과 같은
// 합성(compound) 컴포넌트 API. shadcn 의 최신 컴포넌트 관례를 그대로 따른다:
//   1) cn() 로 className 병합(twMerge·undefined 안전), 2) 모든 요소에 data-slot 부여(슬롯 타깃팅),
//   3) 변형은 cva() 로 정의(button/badge 의 *Variants 패턴).
// 다만 타이포 '값'은 프로젝트 토큰 시스템(typo-*)을 유지한다 — shadcn 은 타이포 컴포넌트를 제공하지
// 않고("We do not ship any typography styles by default") text-4xl·font-extrabold 같은 하드코딩 유틸
// 예시만 주므로, 그걸 도입하면 토큰 단일소스·대비검증·반응형([PB-01/07/08])을 오히려 깬다.
// shadcn 권고 중 토큰과 무관한 부분(제목 text-balance = 줄바꿈 균형)만 취한다.

// default — 일반 페이지: Display/L/bold + Title/L/Regular.
// compact — 밀도 높은 페이지(폼 많은 페이지): 반응형 전환(모바일 Heading/H4·Body/XL → wide↑ Display/M·Title/L).
//   전환은 globals.css 의 typo-page-header-*-compact 합성 유틸이 담당한다(typo-* 는 순수 클래스라
//   wide: 프리픽스를 못 받아, 서로 다른 typo 조합 사이의 브레이크포인트 전환을 전용 유틸로 뺐다).
const pageHeaderTitleVariants = cva('text-foreground text-balance', {
    variants: {
        variant: {
            default: 'typo-display-l-bold',
            compact: 'typo-page-header-title-compact',
        },
    },
    defaultVariants: {variant: 'default'},
})

const pageHeaderDescriptionVariants = cva('text-foreground-subtle', {
    variants: {
        variant: {
            default: 'typo-title-l-regular',
            compact: 'typo-page-header-description-compact',
        },
    },
    defaultVariants: {variant: 'default'},
})

type PageHeaderVariant = NonNullable<VariantProps<typeof pageHeaderTitleVariants>['variant']>

const PageHeader = ({className, ...props}: ComponentPropsWithoutRef<'header'>) => (
    <header data-slot="page-header" className={cn('flex flex-col gap-y-1', className)} {...props} />
)

type PageHeaderTitleProps = ComponentPropsWithoutRef<'h1'> & VariantProps<typeof pageHeaderTitleVariants>

const PageHeaderTitle = ({variant, className, children, ...props}: PageHeaderTitleProps) => (
    <h1 data-slot="page-header-title" className={cn(pageHeaderTitleVariants({variant}), className)} {...props}>
        {children}
    </h1>
)

type PageHeaderDescriptionProps = ComponentPropsWithoutRef<'p'> & VariantProps<typeof pageHeaderDescriptionVariants>

const PageHeaderDescription = ({variant, className, ...props}: PageHeaderDescriptionProps) => (
    <p
        data-slot="page-header-description"
        className={cn(pageHeaderDescriptionVariants({variant}), className)}
        {...props}
    />
)

export {PageHeader, PageHeaderTitle, PageHeaderDescription, pageHeaderTitleVariants}
export type {PageHeaderVariant}
