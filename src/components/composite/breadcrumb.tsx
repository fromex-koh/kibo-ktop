import type {ComponentProps} from 'react'
import {
    Breadcrumb as BreadcrumbPrimitive,
    BreadcrumbEllipsis as BreadcrumbEllipsisPrimitive,
    BreadcrumbItem as BreadcrumbItemPrimitive,
    BreadcrumbLink as BreadcrumbLinkPrimitive,
    BreadcrumbList as BreadcrumbListPrimitive,
    BreadcrumbPage as BreadcrumbPagePrimitive,
    BreadcrumbSeparator as BreadcrumbSeparatorPrimitive,
} from '@/components/ui/breadcrumb'
import {
    breadcrumbEllipsisClassName,
    breadcrumbItemClassName,
    breadcrumbLinkClassName,
    breadcrumbListClassName,
    breadcrumbPageClassName,
    breadcrumbSeparatorClassName,
} from '@/components/theme/breadcrumb.variants'
import {cn} from '@/lib/utils'

const Breadcrumb = BreadcrumbPrimitive

const BreadcrumbList = ({className, ...props}: ComponentProps<typeof BreadcrumbListPrimitive>) => (
    <BreadcrumbListPrimitive className={cn(breadcrumbListClassName, className)} {...props} />
)

const BreadcrumbItem = ({className, ...props}: ComponentProps<typeof BreadcrumbItemPrimitive>) => (
    <BreadcrumbItemPrimitive className={cn(breadcrumbItemClassName, className)} {...props} />
)

const BreadcrumbLink = ({className, href, children, ...props}: ComponentProps<typeof BreadcrumbLinkPrimitive>) => {
    // 전역 Header·Sidebar가 이미 / 홈 링크를 제공하므로 루트 링크는 중복 링크를 만들지 않도록 텍스트로 표시한다.
    if (href === '/') {
        return <span className={cn(breadcrumbLinkClassName, className)}>{children}</span>
    }

    return (
        <BreadcrumbLinkPrimitive className={cn(breadcrumbLinkClassName, className)} href={href} {...props}>
            {children}
        </BreadcrumbLinkPrimitive>
    )
}

const BreadcrumbPage = ({className, ...props}: ComponentProps<typeof BreadcrumbPagePrimitive>) => (
    <BreadcrumbPagePrimitive className={cn(breadcrumbPageClassName, className)} {...props} />
)

// role={undefined} — 셸은 구분자 li 에 role="presentation" 을 넣는데, ol/ul 의 자식 li 는 listitem 외의
// role 을 가질 수 없어 마크업 검사(validator.w3.org)가 오류로 잡는다. [KWCAG 8.1.1]
// 이미 aria-hidden="true" 라 접근성 트리에서 빠지므로 role 을 지워도 보조기기 동작은 그대로다.
// 셸을 고치지 않고 여기서 덮는다 — role 은 스프레드 앞에 둬 사용처가 필요하면 다시 지정할 수 있다. [SC-02]
const BreadcrumbSeparator = ({className, ...props}: ComponentProps<typeof BreadcrumbSeparatorPrimitive>) => (
    <BreadcrumbSeparatorPrimitive className={cn(breadcrumbSeparatorClassName, className)} role={undefined} {...props} />
)

const BreadcrumbEllipsis = ({className, ...props}: ComponentProps<typeof BreadcrumbEllipsisPrimitive>) => (
    <BreadcrumbEllipsisPrimitive className={cn(breadcrumbEllipsisClassName, className)} {...props} />
)

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
}
