import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {cn} from '@/lib/utils'

// 한 화면 안에서 완결되는 완료·결과·안내 화면용 셸.
// 뷰포트가 충분하면 Header·본문·하단 액션을 한 화면에 배치하고, 낮은 화면에서는 dvh 기반으로
// 본문 밀도와 장식 크기를 줄인다. 콘텐츠가 최소 크기보다 커지면 min-h-dvh 가 자연스럽게 늘어나므로
// 잘리거나 축소되지 않고 문서 스크롤로 전환된다.
type ViewportFitLayoutProps = ComponentPropsWithoutRef<'div'> & {
    header?: ReactNode
    footer?: ReactNode
    contentAs?: 'main' | 'div'
    mainProps?: ComponentPropsWithoutRef<'main'>
}

const ViewportFitLayout = ({
    header,
    footer,
    contentAs = 'main',
    mainProps,
    className,
    children,
    ...props
}: ViewportFitLayoutProps) => {
    const {className: mainClassName, ...resolvedMainProps} = mainProps ?? {}
    const Content = contentAs

    return (
        <div
            data-slot="viewport-fit-layout"
            className={cn(
                'bg-background flex min-h-dvh flex-col',
                '[--viewport-fit-decorative-size:clamp(var(--spacing-viewport-fit-decorative-min),14dvh,var(--spacing-action-check))]',
                className,
            )}
            {...props}
        >
            {header}
            <Content
                data-slot="viewport-fit-content"
                className={cn(
                    'content-layout flex min-h-0 flex-1 flex-col',
                    'gap-[clamp(--spacing(4),2dvh,--spacing(15))]',
                    'pt-[clamp(--spacing(4),2dvh,--spacing(10))]',
                    'pb-[clamp(--spacing(6),3.5dvh,--spacing(25))]',
                    mainClassName,
                )}
                {...resolvedMainProps}
            >
                {children}
            </Content>
            {footer}
        </div>
    )
}

export {ViewportFitLayout}
export type {ViewportFitLayoutProps}
