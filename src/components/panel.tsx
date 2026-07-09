import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// shadcn Card 와 구조·스타일이 동일한 합성(compound) 컴포넌트 — Panel/PanelHeader/PanelTitle/
// PanelDescription/PanelAction/PanelContent/PanelFooter. shadcn CLI 로 설치되는 실제 프리미티브가
// 아니므로 src/components/ui/** 가 아니라 여기(PageHeader 와 동일한 위치)에 둔다. 클래스는
// src/components/ui/card.tsx 를 그대로 옮기되 슬롯 이름(--card-spacing → --panel-spacing 등)만 바꿨다.

const Panel = ({
    className,
    size = 'default',
    ...props
}: ComponentPropsWithoutRef<'div'> & {size?: 'default' | 'sm'}) => (
    <div
        data-slot="panel"
        data-size={size}
        className={cn(
            'group/panel bg-card text-card-foreground flex flex-col gap-(--panel-spacing) overflow-hidden rounded-xl py-10 text-sm [--panel-spacing:--spacing(4)] has-data-[slot=panel-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--panel-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=panel-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
            className,
        )}
        {...props}
    />
)

const PanelHeader = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="panel-header"
        className={cn(
            'group/panel-header @container/panel-header grid auto-rows-min items-start gap-1 rounded-t-xl px-25.5 has-data-[slot=panel-action]:grid-cols-[1fr_auto] has-data-[slot=panel-description]:grid-rows-[auto_auto] [.border-b]:pb-(--panel-spacing)',
            className,
        )}
        {...props}
    />
)

const PanelTitle = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="panel-title"
        className={cn('text-base leading-snug font-medium group-data-[size=sm]/panel:text-sm', className)}
        {...props}
    />
)

const PanelDescription = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div data-slot="panel-description" className={cn('text-muted-foreground text-sm', className)} {...props} />
)

const PanelAction = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="panel-action"
        className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
        {...props}
    />
)

const PanelContent = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div data-slot="panel-content" className={cn('px-25.5', className)} {...props} />
)

const PanelFooter = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div
        data-slot="panel-footer"
        className={cn('bg-muted/50 flex items-center rounded-b-xl border-t px-25.5 py-10', className)}
        {...props}
    />
)

export {Panel, PanelHeader, PanelFooter, PanelTitle, PanelAction, PanelDescription, PanelContent}
