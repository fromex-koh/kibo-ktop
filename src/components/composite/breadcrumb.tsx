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

const BreadcrumbLink = ({className, ...props}: ComponentProps<typeof BreadcrumbLinkPrimitive>) => (
    <BreadcrumbLinkPrimitive className={cn(breadcrumbLinkClassName, className)} {...props} />
)

const BreadcrumbPage = ({className, ...props}: ComponentProps<typeof BreadcrumbPagePrimitive>) => (
    <BreadcrumbPagePrimitive className={cn(breadcrumbPageClassName, className)} {...props} />
)

const BreadcrumbSeparator = ({className, ...props}: ComponentProps<typeof BreadcrumbSeparatorPrimitive>) => (
    <BreadcrumbSeparatorPrimitive className={cn(breadcrumbSeparatorClassName, className)} {...props} />
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
