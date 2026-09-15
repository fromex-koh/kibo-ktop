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
    /** 안내가 목록일 때 켠다 — subtitle 을 <p> 로 감싸지 않고 넘긴 엘리먼트 그대로 그린다.
        <p> 안에는 <ul> 을 넣을 수 없어(HTML 규칙[8.1.1]) 그대로 두면 하이드레이션이 깨진다. */
    subtitleAsChild?: boolean
    action?: ReactNode
    /** 좁은 화면(md 미만)에서 액션을 제목·설명 아래 줄로 내린다. 버튼이 여럿이거나 이름이 길어 오른쪽 칸이
        넓어지면 제목 칸이 눌려 글자가 한 자씩 세로로 쌓이는데, 그런 카드에서만 켠다. */
    stackActionOnMobile?: boolean
    children: ReactNode
    className?: string
}

const FormCard = ({
    title,
    subtitle,
    subtitleAsChild,
    action,
    stackActionOnMobile = false,
    children,
    className,
}: FormCardProps) => (
    <Card className={cn('py-6 [--card-spacing:--spacing(10)] md:py-10', className)}>
        {title || subtitle || action ? (
            <SectionHeader
                className={cn(
                    'px-4 md:px-10 xl:px-25.5',
                    // md 미만에서는 2열(제목 | 액션)을 풀어 한 열로 쌓는다.
                    stackActionOnMobile && 'max-md:has-data-[slot=section-header-action]:grid-cols-1',
                )}
            >
                {title ? <SectionHeaderTitle>{title}</SectionHeaderTitle> : null}
                {subtitle ? (
                    <SectionHeaderDescription asChild={subtitleAsChild}>{subtitle}</SectionHeaderDescription>
                ) : null}
                {/* 액션이 없으면 자리를 만들지 않는다 — SectionHeader 가 이 슬롯의 유무로 2열 여부를 정한다. */}
                {action ? (
                    <SectionHeaderAction
                        className={cn(
                            'flex items-center gap-4',
                            // 쌓일 때는 오른쪽 칸 자리(col-start-2 · row-span-2)를 풀고 설명 아래 새 줄에 둔다.
                            stackActionOnMobile &&
                                'max-md:col-start-1 max-md:row-span-1 max-md:row-start-auto max-md:mt-2 max-md:justify-self-stretch',
                        )}
                    >
                        {action}
                    </SectionHeaderAction>
                ) : null}
            </SectionHeader>
        ) : null}
        <CardContent className="px-4 md:px-10 xl:px-25.5">{children}</CardContent>
    </Card>
)

export {FormCard}
export type {FormCardProps}
