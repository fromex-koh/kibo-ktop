import type {ReactNode} from 'react'
import {
    SectionHeader,
    SectionHeaderAction,
    SectionHeaderDescription,
    SectionHeaderTitle,
} from '@/components/composite/section-header'
import {Card, CardContent} from '@/components/ui/card'
import {cn} from '@/lib/utils'

// 폼 섹션의 제목·설명·액션과 본문을 하나의 카드로 묶는다.
// SectionHeader와 CardContent 간격은 --card-spacing으로 공유하며, 내부 여백은 화면 폭에 따라 조정한다.
type FormCardProps = {
    title?: ReactNode
    subtitle?: ReactNode
    action?: ReactNode
    children: ReactNode
    className?: string
}

const FormCard = ({title, subtitle, action, children, className}: FormCardProps) => (
    <Card className={cn('py-6 [--card-spacing:--spacing(10)] md:py-10', className)}>
        {title || subtitle || action ? (
            <SectionHeader className="px-4 md:px-10 xl:px-25.5">
                {title ? <SectionHeaderTitle>{title}</SectionHeaderTitle> : null}
                {subtitle ? <SectionHeaderDescription>{subtitle}</SectionHeaderDescription> : null}
                {/* 액션이 없으면 자리를 만들지 않는다 — SectionHeader 가 이 슬롯의 유무로 2열 여부를 정한다. */}
                {action ? (
                    <SectionHeaderAction className="flex items-center gap-4">{action}</SectionHeaderAction>
                ) : null}
            </SectionHeader>
        ) : null}
        <CardContent className="px-4 md:px-10 xl:px-25.5">{children}</CardContent>
    </Card>
)

export {FormCard}
export type {FormCardProps}
