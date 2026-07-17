'use client'

import Link from 'next/link'
import {useId, type ComponentProps} from 'react'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {
    segmentedControlClassName,
    segmentedControlItemClassName,
    segmentedControlLinkItemStateClassName,
    segmentedControlRadioClassName,
    segmentedControlRadioItemStateClassName,
} from '@/components/theme/segmented-control.variants'
import {cn} from '@/lib/utils'

// PROJECT-COMPOSITE: 동일한 세그먼트 외관으로 로컬 단일 선택(RadioGroup)과 화면 이동(Link)을 제공한다.
type SegmentedControlRadioProps = ComponentProps<typeof RadioGroup> & {type: 'radio'}
type SegmentedControlLinkProps = ComponentProps<'nav'> & {type: 'link'}
type SegmentedControlProps = SegmentedControlRadioProps | SegmentedControlLinkProps
type SegmentedControlRadioItemProps = ComponentProps<typeof RadioGroupItem>
type SegmentedControlLinkItemProps = ComponentProps<typeof Link>
type SegmentedControlItemProps = SegmentedControlRadioItemProps | SegmentedControlLinkItemProps

function SegmentedControl(props: SegmentedControlProps) {
    if (props.type === 'link') {
        const {type, className, ...navProps} = props
        return (
            <nav
                {...navProps}
                data-slot="segmented-control"
                data-type={type}
                className={cn(segmentedControlClassName, className)}
            />
        )
    }

    const {type, className, orientation = 'horizontal', ...radioProps} = props
    return (
        <RadioGroup
            {...radioProps}
            orientation={orientation}
            data-slot="segmented-control"
            data-type={type}
            className={cn(segmentedControlClassName, className)}
        />
    )
}

function SegmentedControlItem(props: SegmentedControlItemProps) {
    const radioLabelId = useId()

    if ('href' in props) {
        const {className, ...linkProps} = props
        return (
            <Link
                {...linkProps}
                data-slot="segmented-control-item"
                className={cn(segmentedControlItemClassName, segmentedControlLinkItemStateClassName, className)}
            />
        )
    }

    const {className, children, ...radioItemProps} = props
    const accessibleLabelId =
        radioItemProps['aria-labelledby'] ?? (radioItemProps['aria-label'] ? undefined : radioLabelId)

    return (
        <div className={cn(segmentedControlItemClassName, segmentedControlRadioItemStateClassName, className)}>
            <RadioGroupItem
                {...radioItemProps}
                aria-labelledby={accessibleLabelId}
                data-slot="segmented-control-radio"
                className={segmentedControlRadioClassName}
            />
            <span id={radioLabelId} className="pointer-events-none">
                {children}
            </span>
        </div>
    )
}

export {SegmentedControl, SegmentedControlItem}
export type {SegmentedControlProps, SegmentedControlItemProps}
