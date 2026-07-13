import type {ReactNode} from 'react'
import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/kit/card'

// 베이스 카드 — kit Card(패딩 24px)를 감싼 도메인 카드(L2 composite). 제목(+서브텍스트·액션) 헤더는
// 선택이고 본문(children)은 필수다. 헤더에 title 을 주면 좌측 제목/서브텍스트, action 은 우측에 자동 배치된다.
// 좌우 패딩이 큰 넓은 폼 섹션에는 FormCard 를 쓴다.
type BaseCardProps = {
    title?: ReactNode
    subtitle?: ReactNode
    action?: ReactNode
    children: ReactNode
    className?: string
}

const BaseCard = ({title, subtitle, action, children, className}: BaseCardProps) => (
    <Card className={className}>
        {title ? (
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
                {action ? <CardAction>{action}</CardAction> : null}
            </CardHeader>
        ) : null}
        <CardContent>{children}</CardContent>
    </Card>
)

export {BaseCard}
export type {BaseCardProps}
