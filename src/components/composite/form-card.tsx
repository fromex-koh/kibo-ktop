import type {ReactNode} from 'react'
import {
    SectionHeader,
    SectionHeaderAction,
    SectionHeaderDescription,
    SectionHeaderTitle,
} from '@/components/composite/section-header'
import {Card, CardContent} from '@/components/kit/card'
import {cn} from '@/lib/utils'

// 폼 카드 — kit Card 를 감싼 넓은 폼 섹션 카드(L2 composite). Figma "기업정보" 반영:
//   · 좌우 102px · 상하 40px 패딩(--card-spacing 40px + 좌우만 px-25.5 로 확장)
//   · 헤더는 SectionHeader 재사용 — 좌측 제목(H4/bold)+서브텍스트(Body/XL/Regular) / 우측 액션(자동 2열).
//     타이포·색·액션 배치가 SectionHeader 와 동일해 별도 카드 헤더를 만들지 않고 그대로 쓴다.
//   · 헤더 아래 본문(children)
// 패딩이 24px 인 일반 카드는 BaseCard 를 쓴다.
type FormCardProps = {
    title: ReactNode
    subtitle?: ReactNode
    action?: ReactNode
    children: ReactNode
    className?: string
}

const FormCard = ({title, subtitle, action, children, className}: FormCardProps) => (
    <Card className={cn('[--card-spacing:--spacing(10)]', className)}>
        <SectionHeader className="px-25.5">
            <SectionHeaderTitle>{title}</SectionHeaderTitle>
            {subtitle ? <SectionHeaderDescription>{subtitle}</SectionHeaderDescription> : null}
            {action ? <SectionHeaderAction>{action}</SectionHeaderAction> : null}
        </SectionHeader>
        <CardContent className="px-25.5">{children}</CardContent>
    </Card>
)

export {FormCard}
export type {FormCardProps}
