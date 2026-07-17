'use client'

import {useSearchParams} from 'next/navigation'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'

type Audience = 'corp' | 'org'
const AUDIENCES = ['corp', 'org'] satisfies readonly Audience[]

const AUDIENCE_CONTENT: Record<Audience, {title: string; description: string}> = {
    corp: {
        title: '기업용 서비스',
        description: '기업 고객에게 필요한 보증·지원 서비스를 확인합니다.',
    },
    org: {
        title: '기관용 서비스',
        description: '협약 기관과 담당자를 위한 업무 서비스를 확인합니다.',
    },
}

const isAudience = (value: string | null): value is Audience => value === 'corp' || value === 'org'

const AudienceSwitchDemo = () => {
    const searchParams = useSearchParams()
    const audienceParam = searchParams.get('audience')
    const audience = isAudience(audienceParam) ? audienceParam : 'corp'
    const content = AUDIENCE_CONTENT[audience]

    const getHref = (nextAudience: Audience) => {
        const nextParams = new URLSearchParams(searchParams.toString())
        nextParams.set('audience', nextAudience)
        return `?${nextParams.toString()}`
    }

    return (
        <div className="border-border flex flex-col gap-6 rounded-md border p-6">
            <SegmentedControl type="link" aria-label="화면 유형">
                {AUDIENCES.map((value) => {
                    const isCurrent = audience === value
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

            <section aria-live="polite" aria-atomic="true" className="bg-surface border-border rounded-md border p-6">
                <h3 className="typo-title-m-bold text-foreground">{content.title}</h3>
                <p className="typo-body-l-regular text-muted-foreground mt-2">{content.description}</p>
            </section>
        </div>
    )
}

export default AudienceSwitchDemo
