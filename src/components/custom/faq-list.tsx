import {ChevronDown} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {SectionHeader, SectionHeaderTitle} from '@/components/composite/section-header'

type FaqItem = {
    id: string
    question: string
    answer: string
}

type FaqListProps = {
    items: readonly FaqItem[]
}

// FAQ 목록. 현재는 화면 확인용 목업이며 실제 연동 시 API 조회 결과로 교체한다.
const FaqList = ({items}: FaqListProps) => (
    <section aria-labelledby="faq-list-title" className="flex flex-col gap-6">
        <SectionHeader>
            <SectionHeaderTitle id="faq-list-title">자주 묻는 질문</SectionHeaderTitle>
        </SectionHeader>
        <BaseCard className="py-0">
            <div className="flex flex-col">
                {items.map((item) => (
                    <details key={item.id} className="group border-border border-b last:border-b-0">
                        <summary className="focus-visible:outline-ring flex cursor-pointer list-none items-center gap-4 px-6 py-6 outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] [&::-webkit-details-marker]:hidden">
                            <span className="typo-title-m-bold text-primary shrink-0">Q</span>
                            <span className="typo-title-m-medium text-foreground min-w-0 flex-1 text-balance">
                                {item.question}
                            </span>
                            <ChevronDown
                                aria-hidden="true"
                                className="text-foreground size-icon-md shrink-0 transition-transform group-open:rotate-180"
                            />
                        </summary>
                        <div className="bg-muted/40 flex gap-4 px-6 py-6">
                            <span className="typo-title-m-bold text-primary shrink-0">A</span>
                            <p className="typo-body-l-regular text-foreground min-w-0 whitespace-pre-line">
                                {item.answer}
                            </p>
                        </div>
                    </details>
                ))}
            </div>
        </BaseCard>
    </section>
)

export {FaqList}
export type {FaqItem, FaqListProps}
