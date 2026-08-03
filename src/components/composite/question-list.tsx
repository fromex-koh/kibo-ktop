import {Children, cloneElement, isValidElement} from 'react'
import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {
    questionBodyClassName,
    questionBadgeClassName,
    questionBadgeControlLineClassName,
    questionContentClassName,
    questionContentFillClassName,
    questionControlClassName,
    questionControlLineClassName,
    questionDescriptionClassName,
    questionHelperClassName,
    questionItemClassName,
    questionListClassName,
    questionNumberClassName,
    questionOptionClassName,
    questionOptionContentClassName,
    questionOptionListClassName,
    questionOptionNumberClassName,
} from '@/components/theme/question-list.variants'
import {cn} from '@/lib/utils'

type QuestionItemAlign = 'start' | 'control'

type QuestionItemProps = Omit<ComponentPropsWithoutRef<'li'>, 'children'> & {
    children: ReactNode
    badge?: ReactNode
    control?: ReactNode
    description?: ReactNode
    helper?: ReactNode
    number?: number | string
    align?: QuestionItemAlign
    contentClassName?: string
    index?: number
}

type QuestionListProps = ComponentPropsWithoutRef<'ol'> & {
    start?: number
}

type QuestionOptionProps = Omit<ComponentPropsWithoutRef<'li'>, 'children'> & {
    children: ReactNode
    control?: ReactNode
    // 순번 대신 앞에 붙이는 표식(제조·서비스 배지 등). 넘기면 (1)(2) 순번 자리를 대신한다.
    badge?: ReactNode
    // 본문 첫 줄이 40px 컨트롤(칩·Select)인 행은 'control' — 배지·우측 컨트롤을 그 줄에 맞춘다.
    align?: QuestionItemAlign
    index?: number
}

type QuestionOptionListProps = ComponentPropsWithoutRef<'ol'> & {
    start?: number
}

const QuestionItem = ({
    children,
    badge,
    control,
    description,
    helper,
    number,
    align = 'start',
    index = 1,
    className,
    contentClassName,
    ...props
}: QuestionItemProps) => {
    const displayNumber = number ?? index
    const isControlLine = align === 'control'

    return (
        <li data-slot="question-item" className={cn(questionItemClassName, className)} {...props}>
            <span
                aria-hidden="true"
                data-slot="question-number"
                className={cn(questionNumberClassName, isControlLine && questionControlLineClassName)}
            >
                {`${String(displayNumber).padStart(2, '0')}.`}
            </span>
            <span
                data-slot="question-badge"
                className={cn(questionBadgeClassName, isControlLine && questionBadgeControlLineClassName)}
            >
                {badge}
            </span>
            <div
                data-slot="question-content"
                className={cn(questionContentClassName, !control && questionContentFillClassName, contentClassName)}
            >
                <div data-slot="question-body" className={questionBodyClassName}>
                    {children}
                </div>
                {description ? (
                    <div data-slot="question-description" className={questionDescriptionClassName}>
                        {description}
                    </div>
                ) : null}
                {helper ? (
                    <div data-slot="question-helper" className={questionHelperClassName}>
                        {helper}
                    </div>
                ) : null}
            </div>
            {control ? (
                <div
                    data-slot="question-control"
                    className={cn(questionControlClassName, isControlLine && questionControlLineClassName)}
                >
                    {control}
                </div>
            ) : null}
        </li>
    )
}

const QuestionList = ({start = 1, className, children, ...props}: QuestionListProps) => (
    <ol start={start} data-slot="question-list" className={cn(questionListClassName, className)} {...props}>
        {Children.map(children, (child, itemIndex) =>
            isValidElement<QuestionItemProps>(child) ? cloneElement(child, {index: start + itemIndex}) : child,
        )}
    </ol>
)

const QuestionOption = ({
    children,
    control,
    badge,
    align = 'start',
    index = 1,
    className,
    ...props
}: QuestionOptionProps) => {
    const isControlLine = align === 'control'

    return (
        <li data-slot="question-option" className={cn(questionOptionClassName, className)} {...props}>
            {badge ? (
                <span
                    data-slot="question-option-badge"
                    className={cn(questionBadgeClassName, isControlLine && questionBadgeControlLineClassName)}
                >
                    {badge}
                </span>
            ) : (
                <span aria-hidden="true" className={questionOptionNumberClassName}>{`(${index})`}</span>
            )}
            {/* div 인 이유 — 선택 내용으로 ChipCheckboxGroup 같은 블록 요소가 올 수 있는데, span 안의 div 는
                마크업 오류다. 부모가 li 라 흐름 콘텐츠를 받을 수 있고, 그리드 아이템이라 표시도 그대로다. [KWCAG 8.1.1] */}
            <div className={questionOptionContentClassName}>{children}</div>
            {control ? (
                <span className={cn(questionControlClassName, isControlLine && questionControlLineClassName)}>
                    {control}
                </span>
            ) : null}
        </li>
    )
}

const QuestionOptionList = ({start = 1, className, children, ...props}: QuestionOptionListProps) => (
    <ol
        start={start}
        data-slot="question-option-list"
        className={cn(questionOptionListClassName, className)}
        {...props}
    >
        {Children.map(children, (child, itemIndex) =>
            isValidElement<QuestionOptionProps>(child) ? cloneElement(child, {index: start + itemIndex}) : child,
        )}
    </ol>
)

export {QuestionList, QuestionItem, QuestionOptionList, QuestionOption}
export type {QuestionListProps, QuestionItemProps, QuestionItemAlign, QuestionOptionListProps, QuestionOptionProps}
