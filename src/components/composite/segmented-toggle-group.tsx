'use client'

import type {ComponentProps, CSSProperties} from 'react'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {cn} from '@/lib/utils'

type SegmentedRadioGroupProps = Omit<ComponentProps<typeof RadioGroup>, 'orientation'> & {
    type?: 'single'
    variant?: 'segmented'
    size?: 'sm' | 'default' | 'lg'
    spacing?: number
    orientation?: 'horizontal' | 'vertical'
}
type SegmentedRadioGroupItemProps = ComponentProps<typeof RadioGroupItem>
type SegmentedRadioGroupStyle = CSSProperties & {'--gap'?: string}

function SegmentedRadioGroup({className, spacing = 0, orientation = 'horizontal', ...props}: SegmentedRadioGroupProps) {
    const style: SegmentedRadioGroupStyle = {...props.style, '--gap': `${spacing}px`}

    return (
        <RadioGroup
            {...props}
            orientation={orientation}
            data-slot="toggle-group"
            data-variant="segmented"
            data-spacing={spacing}
            style={style}
            className={cn(
                'group/toggle-group bg-muted flex w-fit items-center gap-0.5 rounded-xs p-0.5 data-vertical:flex-col',
                className,
            )}
        />
    )
}

function SegmentedRadioGroupItem({className, children, ...props}: SegmentedRadioGroupItemProps) {
    return (
        <label
            className={cn(
                'text-foreground has-[[data-state=checked]]:bg-surface has-[[data-state=checked]]:text-foreground has-[:focus-visible]:outline-ring h-control-h-sm relative flex flex-1 cursor-pointer items-center justify-center rounded-sm px-3 py-1 text-sm font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-solid has-[[data-state=checked]]:shadow-sm',
                className,
            )}
        >
            <RadioGroupItem {...props} data-slot="toggle-group-item" className="peer absolute size-px opacity-0" />
            <span>{children}</span>
        </label>
    )
}

export {SegmentedRadioGroup, SegmentedRadioGroupItem}
export type {SegmentedRadioGroupProps, SegmentedRadioGroupItemProps}
