import type {ComponentPropsWithoutRef, ReactNode} from 'react'
import {
    questionBodyClassName,
    questionBadgeClassName,
    questionBadgeControlLineClassName,
    questionContentClassName,
    questionControlClassName,
    questionControlLineClassName,
    questionDescriptionClassName,
    questionHelperClassName,
    questionItemClassName,
    questionListClassName,
    questionOptionClassName,
    questionOptionContentClassName,
    questionOptionListClassName,
} from '@/components/theme/question-list.variants'
import {cn} from '@/lib/utils'

// 문항 목록(QuestionList) — 체크리스트 한 문항이 [체크박스][배지][본문] 순서로 놓인다(시안).
// 문항 앞에 번호를 찍지 않는다 — 순서는 목록 마크업(ol)이 갖고, 화면에는 시안대로 표식을 두지 않는다.
// 문항 안에서 다시 갈라지는 보기(예: "(1) …", "(2) …")는 QuestionOptionList 로 감싼다. 그 표기는
// 문항 글의 일부이므로 컴포넌트가 만들어 붙이지 않고 사용처의 글에 그대로 적는다.

type QuestionItemAlign = 'start' | 'control'

type QuestionItemProps = Omit<ComponentPropsWithoutRef<'li'>, 'children'> & {
    children: ReactNode
    badge?: ReactNode
    control?: ReactNode
    // 체크박스·본문 아래에서 문항 전체 너비를 쓰는 추가 영역(예: 조건부 선택 칩).
    below?: ReactNode
    description?: ReactNode
    helper?: ReactNode
    align?: QuestionItemAlign
    contentClassName?: string
}

type QuestionListProps = ComponentPropsWithoutRef<'ol'>

type QuestionOptionProps = Omit<ComponentPropsWithoutRef<'li'>, 'children'> & {
    children: ReactNode
    control?: ReactNode
    // 본문 앞에 붙는 표식(제조·서비스 배지 등).
    badge?: ReactNode
    // 본문 첫 줄이 40px 컨트롤(칩·Select)인 행은 'control' — 배지·체크박스를 그 줄에 맞춘다.
    align?: QuestionItemAlign
}

type QuestionOptionListProps = ComponentPropsWithoutRef<'ol'>

const QuestionItem = ({
    children,
    badge,
    control,
    below,
    description,
    helper,
    align = 'start',
    className,
    contentClassName,
    ...props
}: QuestionItemProps) => {
    const isControlLine = align === 'control'

    return (
        <li data-slot="question-item" className={cn(questionItemClassName, below && 'flex-wrap', className)} {...props}>
            {control ? (
                <div
                    data-slot="question-control"
                    className={cn(questionControlClassName, isControlLine && questionControlLineClassName)}
                >
                    {control}
                </div>
            ) : null}
            {badge ? (
                <span
                    data-slot="question-badge"
                    className={cn(questionBadgeClassName, isControlLine && questionBadgeControlLineClassName)}
                >
                    {badge}
                </span>
            ) : null}
            <div data-slot="question-content" className={cn(questionContentClassName, contentClassName)}>
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
            {below ? (
                <div data-slot="question-below" className="w-full basis-full">
                    {below}
                </div>
            ) : null}
        </li>
    )
}

const QuestionList = ({className, ...props}: QuestionListProps) => (
    <ol data-slot="question-list" className={cn(questionListClassName, className)} {...props} />
)

const QuestionOption = ({children, control, badge, align = 'start', className, ...props}: QuestionOptionProps) => {
    const isControlLine = align === 'control'

    return (
        <li data-slot="question-option" className={cn(questionOptionClassName, className)} {...props}>
            {control ? (
                <span className={cn(questionControlClassName, isControlLine && questionControlLineClassName)}>
                    {control}
                </span>
            ) : null}
            {badge ? (
                <span
                    data-slot="question-option-badge"
                    className={cn(questionBadgeClassName, isControlLine && questionBadgeControlLineClassName)}
                >
                    {badge}
                </span>
            ) : null}
            {/* div 인 이유 — 선택 내용으로 ChipCheckboxGroup 같은 블록 요소가 올 수 있는데, span 안의 div 는
                마크업 오류다. 부모가 li 라 흐름 콘텐츠를 받을 수 있고, 표시도 그대로다. [KWCAG 8.1.1] */}
            <div className={questionOptionContentClassName}>{children}</div>
        </li>
    )
}

const QuestionOptionList = ({className, ...props}: QuestionOptionListProps) => (
    <ol data-slot="question-option-list" className={cn(questionOptionListClassName, className)} {...props} />
)

export {QuestionList, QuestionItem, QuestionOptionList, QuestionOption}
export type {QuestionListProps, QuestionItemProps, QuestionItemAlign, QuestionOptionListProps, QuestionOptionProps}
