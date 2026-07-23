'use client'

import {useSearchParams} from 'next/navigation'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import {cn} from '@/lib/utils'

type UserType = 'corp' | 'org'
const USER_TYPES = ['corp', 'org'] satisfies readonly UserType[]

type UserTypeSwitchDemoProps = {
    variant?: 'subtle' | 'solid'
    size?: 'sm' | 'md' | 'lg'
    ariaLabel?: string
    controlClassName?: string
    wrapperClassName?: string
    showContent?: boolean
}

const USER_TYPE_CONTENT: Record<UserType, {title: string; description: string}> = {
    corp: {
        title: '기업용 서비스',
        description: '기업 고객에게 필요한 보증·지원 서비스를 확인합니다.',
    },
    org: {
        title: '기관용 서비스',
        description: '협약 기관과 담당자를 위한 업무 서비스를 확인합니다.',
    },
}

const isUserType = (value: string | null): value is UserType => value === 'corp' || value === 'org'

const UserTypeSwitchDemo = ({
    variant = 'subtle',
    size = 'sm',
    ariaLabel = '화면 유형',
    controlClassName,
    wrapperClassName,
    showContent = true,
}: UserTypeSwitchDemoProps) => {
    const searchParams = useSearchParams()
    const userTypeParam = searchParams.get('userType')
    const userType = isUserType(userTypeParam) ? userTypeParam : 'corp'
    const content = USER_TYPE_CONTENT[userType]

    const getHref = (nextUserType: UserType) => {
        const nextParams = new URLSearchParams(searchParams.toString())
        nextParams.set('userType', nextUserType)
        return `?${nextParams.toString()}`
    }

    return (
        <div className={cn('border-border flex flex-col gap-6 rounded-md border p-6', wrapperClassName)}>
            <SegmentedControl
                type="link"
                variant={variant}
                size={size}
                aria-label={ariaLabel}
                className={controlClassName}
            >
                {USER_TYPES.map((value) => {
                    const isCurrent = userType === value
                    return (
                        <SegmentedControlItem
                            key={value}
                            href={getHref(value)}
                            replace
                            scroll={false}
                            aria-current={isCurrent ? 'page' : undefined}
                        >
                            {value === 'corp' ? '기업' : '기관'}
                        </SegmentedControlItem>
                    )
                })}
            </SegmentedControl>

            {showContent ? (
                <section
                    aria-live="polite"
                    aria-atomic="true"
                    className="bg-surface border-border rounded-md border p-6"
                >
                    <h3 className="typo-title-m-bold text-foreground">{content.title}</h3>
                    <p className="typo-body-l-regular text-muted-foreground mt-2">{content.description}</p>
                </section>
            ) : null}
        </div>
    )
}

export default UserTypeSwitchDemo
