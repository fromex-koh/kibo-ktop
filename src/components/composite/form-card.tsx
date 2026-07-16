import type {ReactNode} from 'react'
import {
    SectionHeader,
    SectionHeaderAction,
    SectionHeaderDescription,
    SectionHeaderTitle,
} from '@/components/composite/section-header'
import {Card, CardContent} from '@/components/ui/card'
import {cn} from '@/lib/utils'

// 폼 카드 — kit Card 를 감싼 넓은 폼 섹션 카드(L2 composite). 패딩이 24px 인 일반 카드는 BaseCard 를 쓴다.
// PROJECT-STYLE: shadcn Card의 로컬 spacing 변수(--card-spacing)를 사용해
// Header/Content/Footer 간격과 상하 패딩을 FormCard 사양(40px)으로 맞춘다.
// 좌우 102px 패딩은 FormCard 전용 레이아웃 사양이라 SectionHeader/CardContent 에서 별도로 확장한다.
// 헤더는 SectionHeader 를 재사용해 타이포·색·액션 배치를 동일하게 유지한다.
type FormCardProps = {
    title?: ReactNode
    subtitle?: ReactNode
    action?: ReactNode
    children: ReactNode
    className?: string
}

const FormCard = ({title, subtitle, action, children, className}: FormCardProps) => (
    <Card className={cn('[--card-spacing:--spacing(10)]', className)}>
        {title || subtitle || action ? (
            <SectionHeader className="px-25.5">
                {title ? <SectionHeaderTitle>{title}</SectionHeaderTitle> : null}
                {subtitle ? <SectionHeaderDescription>{subtitle}</SectionHeaderDescription> : null}
                {action ? <SectionHeaderAction>{action}</SectionHeaderAction> : null}
            </SectionHeader>
        ) : null}
        <CardContent className="px-25.5">{children}</CardContent>
    </Card>
)

export {FormCard}
export type {FormCardProps}
