import type {ReactNode} from 'react'
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'
import {FormSectionHeaderAction} from '@/components/composite/form-section-collapse'
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
                {/* 액션 자리 — 접히는 섹션(FormTabs 태블릿 목록) 안에서는 여기에 접기 버튼이 함께 붙는다. */}
                <FormSectionHeaderAction label={typeof title === 'string' ? title : undefined}>
                    {action}
                </FormSectionHeaderAction>
            </SectionHeader>
        ) : null}
        <CardContent className="px-4 md:px-10 xl:px-25.5">{children}</CardContent>
    </Card>
)

export {FormCard}
export type {FormCardProps}
