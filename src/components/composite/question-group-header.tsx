import type {ComponentPropsWithoutRef} from 'react'
import {
    questionGroupHeaderClassName,
    questionGroupHeaderDescriptionClassName,
    questionGroupHeaderTitleClassName,
} from '@/components/theme/question-group-header.variants'
import {cn} from '@/lib/utils'

const QuestionGroupHeader = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => (
    <div data-slot="question-group-header" className={cn(questionGroupHeaderClassName, className)} {...props} />
)

const QuestionGroupHeaderTitle = ({className, ...props}: ComponentPropsWithoutRef<'p'>) => (
    <p
        data-slot="question-group-header-title"
        className={cn(questionGroupHeaderTitleClassName, className)}
        {...props}
    />
)

const QuestionGroupHeaderDescription = ({className, ...props}: ComponentPropsWithoutRef<'p'>) => (
    <p
        data-slot="question-group-header-description"
        className={cn(questionGroupHeaderDescriptionClassName, className)}
        {...props}
    />
)

export {QuestionGroupHeader, QuestionGroupHeaderTitle, QuestionGroupHeaderDescription}
