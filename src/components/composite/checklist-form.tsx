'use client'

import {Fragment, useId, useRef, useState, type ComponentProps, type ReactNode, type SubmitEvent} from 'react'
import {useRouter} from 'next/navigation'
import {ChevronRight} from 'lucide-react'
import {ChipCheckbox, ChipCheckboxGroup, ChipRadio, ChipRadioGroup} from '@/components/composite/chip'
import {CitationManualDialog} from '@/components/composite/citation-manual-dialog'
import {FormCard} from '@/components/composite/form-card'
import {
    QuestionGroupHeader,
    QuestionGroupHeaderDescription,
    QuestionGroupHeaderTitle,
} from '@/components/composite/question-group-header'
import {QuestionItem, QuestionList, QuestionOption, QuestionOptionList} from '@/components/composite/question-list'
import {QuestionSelect} from '@/components/composite/question-select'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {SubmitConfirmDialog} from '@/components/composite/submit-confirm-dialog'
import {TrlGuideDialog} from '@/components/composite/trl-guide-dialog'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {FieldError} from '@/components/ui/field'
import {cn} from '@/lib/utils'

// 체크리스트 카드 — Figma "[신속표준모형 KTRS-FM] 3단계_체크리스트 입력".
//
// 문항·보기는 이 파일이 갖지 않는다. 화면(page)이 데이터(ChecklistData)를 내려 주고 이 컴포넌트는 그리기만
// 한다 — 연동하면 같은 모양의 응답을 그대로 넣으면 된다.
//
// 가운데 문항은 기술 구분(전문기술·숙련기술) 선택에 따라 갈리고, 그 앞뒤 문항은 두 갈래가 함께 쓴다.
// 수익창출역량처럼 보기까지 갈리는 선택 상자는 데이터의 optionsByBranch 로 갈래별 보기를 받는다.
//
// 화면에는 문항 번호를 찍지 않는다(시안) — 순서는 목록 마크업(ol)이 갖는다. 보기 표기 "(1)"·"(2)" 는
// 문항 글에 포함돼 있다. 체크박스의 이름도 번호가 아니라 문항 글 자체다[7.4.1].

// 안내 버튼이 여는 모달 — 데이터에는 이름만 담고, 실제 모달은 여기서 잇는다.
type ChecklistGuide = 'citation-manual' | 'trl'

// 제조·서비스 배지가 붙는 행.
type ChecklistSector = 'manufacturing' | 'service'

type ChecklistOption = {
    value: string
    label: string
    // 문장 안 [ ] 에 넣을 짧은 표기(예: "3"). 생략하면 label 을 쓴다.
    token?: string
}

// 문항 앞에 놓이는 안내 묶음(제목 + 설명).
type ChecklistGroupHeader = {
    title: string
    description?: string
}

type ChecklistItemBase = {
    id: string
    header?: ChecklistGroupHeader
}

type ChecklistItem = ChecklistItemBase &
    (
        | {
              // 체크박스 한 줄.
              type: 'check'
              name: string
              text: string
              // 본문 아래 작은 보조 문구.
              note?: string
              // 문장 안에 붉은 별표를 넣을 때 — 별표 앞뒤 글을 나눠 준다(접근 이름은 text 를 쓴다).
              mark?: {before: string; after: string}
              guide?: ChecklistGuide
          }
        | {
              // 한 문항이 여러 줄로 갈리는 경우((1)(2) 또는 제조·서비스).
              type: 'check-list'
              options: {name: string; text: string; sector?: ChecklistSector}[]
          }
        | {
              // 문장 안에 칩을 끼워 고르는 행(제조·서비스).
              type: 'chip-rows'
              rows: {
                  sector: ChecklistSector
                  name: string
                  before: string
                  between: string
                  after: string
                  chips: ChecklistOption[]
              }[]
          }
        | {
              // 문장 안에 선택값을 [ ] 로 보여 주고 아래 줄에 선택 상자를 두는 문항.
              type: 'sentence-select'
              name: string
              label: string
              before: string
              after: string
              placeholder?: string
              options: ChecklistOption[]
              guide?: ChecklistGuide
              requiredMessage: string
          }
        | {
              // 선택 상자만 있는 문항. 갈래별로 보기가 다르면 optionsByBranch 를 쓴다.
              type: 'select'
              name: string
              label: string
              placeholder: string
              options?: ChecklistOption[]
              optionsByBranch?: Record<string, ChecklistOption[]>
              requiredMessage: string
          }
    )

// 기술 구분 — 이 값에 따라 가운데 문항과 일부 보기가 갈린다.
type ChecklistBranch = {
    header: ChecklistGroupHeader
    name: string
    label: string
    defaultValue: string
    options: ChecklistOption[]
    requiredMessage: string
    // 갈래 값별 문항.
    items: Record<string, ChecklistItem[]>
}

type ChecklistData = {
    // 기술 구분 앞의 공통 문항.
    lead: ChecklistItem[]
    branch: ChecklistBranch
    // 기술 구분 뒤의 공통 문항.
    common: ChecklistItem[]
}

const SECTOR_BADGE: Record<ChecklistSector, ReactNode> = {
    manufacturing: (
        <Badge variant="solid-pastel" color="secondary-green" shape="round">
            제조
        </Badge>
    ),
    service: (
        <Badge variant="solid-pastel" color="secondary-purple" shape="round">
            서비스
        </Badge>
    ),
}

// 문장 끝에 붙는 안내 버튼(피인용 확인 메뉴얼·TRL 확인) — 시안 button_text 사양:
// 1px 밑줄(text-underline) · 14px 텍스트 · 16px 아이콘 · 높이 21px(= 텍스트 버튼 size sm).
// 모달을 여는 버튼이라 각 모달 컴포넌트의 트리거로 넘긴다 — 열기 동작과 aria 는 radix 가 얹는다.
// 그래서 받은 props 를 반드시 Button 까지 넘겨야 한다(DialogTrigger asChild 가 이 자리에 얹는다).
const GuideButton = ({children, className, ...props}: ComponentProps<typeof Button>) => (
    <Button variant="text-underline" size="sm" className={cn('gap-1', className)} {...props}>
        {children}
        <ChevronRight aria-hidden="true" />
    </Button>
)

const GUIDE_LABEL: Record<ChecklistGuide, string> = {
    'citation-manual': '피인용 확인 메뉴얼',
    trl: 'TRL 확인',
}

const renderGuide = (guide: ChecklistGuide) =>
    guide === 'citation-manual' ? (
        <CitationManualDialog>
            <GuideButton>{GUIDE_LABEL[guide]}</GuideButton>
        </CitationManualDialog>
    ) : (
        <TrlGuideDialog>
            <GuideButton>{GUIDE_LABEL[guide]}</GuideButton>
        </TrlGuideDialog>
    )

// 문항 체크박스 — 접근 가능한 이름은 문항 글 그대로다(화면에 번호가 없어 "n번 문항"으로 부를 수 없다).
const QuestionCheckbox = ({name, label}: {name: string; label: string}) => (
    <Checkbox name={name} value="yes" aria-label={label} />
)

const ChecklistGroupHeaderBlock = ({header, className}: {header: ChecklistGroupHeader; className?: string}) => (
    <QuestionGroupHeader className={className}>
        <QuestionGroupHeaderTitle>{header.title}</QuestionGroupHeaderTitle>
        {header.description ? (
            <QuestionGroupHeaderDescription>{header.description}</QuestionGroupHeaderDescription>
        ) : null}
    </QuestionGroupHeader>
)

// 문항 하나 — 종류에 따라 그리는 모양만 다르고, 값과 오류는 모두 바깥에서 받는다.
const ChecklistQuestion = ({
    item,
    branchValue,
    value,
    error,
    onValueChange,
}: {
    item: ChecklistItem
    branchValue: string
    value: string
    error?: string
    onValueChange: (next: string) => void
}) => {
    const errorId = useId()

    if (item.type === 'check') {
        return (
            <QuestionItem
                description={item.note}
                helper={undefined}
                control={<QuestionCheckbox name={item.name} label={item.text} />}
            >
                {item.mark ? (
                    // 별표는 아래 보조 문구가 무엇을 풀어 쓴 것인지 가리키는 표식이라 시안대로 붉은색이고,
                    // 장식이므로 읽어 주지 않는다 — 보조 문구가 바로 아래에 글로 있다[5.3.1].
                    <span>
                        {item.mark.before}
                        <span aria-hidden="true" className="text-error-500">
                            *
                        </span>
                        {item.mark.after}
                    </span>
                ) : (
                    <span>{item.text}</span>
                )}
                {item.guide ? renderGuide(item.guide) : null}
            </QuestionItem>
        )
    }

    if (item.type === 'check-list') {
        return (
            <QuestionItem>
                <QuestionOptionList>
                    {item.options.map((option) => (
                        <QuestionOption
                            key={option.name}
                            badge={option.sector ? SECTOR_BADGE[option.sector] : undefined}
                            control={<QuestionCheckbox name={option.name} label={option.text} />}
                        >
                            {option.text}
                        </QuestionOption>
                    ))}
                </QuestionOptionList>
            </QuestionItem>
        )
    }

    if (item.type === 'chip-rows') {
        return (
            <QuestionItem align="control">
                <QuestionOptionList>
                    {item.rows.map((row) => (
                        <QuestionOption key={row.name} align="control" badge={SECTOR_BADGE[row.sector]}>
                            <ChipCheckboxGroup aria-label={`${row.before} ${row.after}`} className="items-center">
                                {row.before}
                                {row.chips.map((chip, chipIndex) => (
                                    <Fragment key={chip.value}>
                                        {chipIndex > 0 ? row.between : null}
                                        <ChipCheckbox size="md" name={row.name} value={chip.value}>
                                            {chip.label}
                                        </ChipCheckbox>
                                    </Fragment>
                                ))}
                                {row.after}
                            </ChipCheckboxGroup>
                        </QuestionOption>
                    ))}
                </QuestionOptionList>
            </QuestionItem>
        )
    }

    if (item.type === 'sentence-select') {
        return (
            <QuestionItem>
                <QuestionSelect
                    name={item.name}
                    label={item.label}
                    before={item.before}
                    after={item.after}
                    placeholder={item.placeholder}
                    value={value}
                    onValueChange={onValueChange}
                    error={error}
                    options={item.options}
                    triggerClassName="w-full"
                    action={item.guide ? renderGuide(item.guide) : undefined}
                />
            </QuestionItem>
        )
    }

    const options = item.optionsByBranch?.[branchValue] ?? item.options ?? []

    return (
        <QuestionItem align="control" contentClassName="w-full">
            <Select name={item.name} value={value} onValueChange={onValueChange}>
                <SelectTrigger
                    size="md"
                    aria-label={item.label}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className="w-full"
                >
                    <SelectValue placeholder={item.placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error ? (
                <FieldError id={errorId} className="mt-2">
                    {error}
                </FieldError>
            ) : null}
        </QuestionItem>
    )
}

// 반드시 골라야 하는 문항 — 선택 상자만 해당한다(체크박스는 "해당 없음"도 답이라 검사하지 않는다).
// 값을 담는 이름과 안내 문구도 그 두 종류에만 있다.
const getRequiredField = (item: ChecklistItem) =>
    item.type === 'sentence-select' || item.type === 'select'
        ? {name: item.name, message: item.requiredMessage}
        : undefined

// 안내 묶음(header)이 있는 문항에서 목록을 끊는다 — 묶음이 목록(ol) 안에 들어가면 안 된다.
type ChecklistSection = {
    header?: ChecklistGroupHeader
    items: ChecklistItem[]
}

const toSections = (items: readonly ChecklistItem[]) =>
    items.reduce<ChecklistSection[]>((sections, item) => {
        const current = sections.at(-1)
        if (!current || item.header) return [...sections, {header: item.header, items: [item]}]
        return [...sections.slice(0, -1), {...current, items: [...current.items, item]}]
    }, [])

type ChecklistFormProps = {
    // 문항·보기 데이터 — 화면(page)이 내려 준다.
    data: ChecklistData
    // 카드 본문에 붙는 id — 바로가기(SkipNav) 대상으로 쓴다.
    id?: string
    // 화면 아래 [다음] 버튼과 이어지는 이름 — 버튼이 폼 바깥에 있어 form 속성으로 연결한다.
    formId?: string
    // [제출] 을 누른 뒤 갈 화면(완료). 넘기지 않으면 모달만 닫힌다.
    completeHref?: string
}

// 제출 값 — 체크박스·칩처럼 같은 name 이 여러 개면 배열로, 하나면 값 그대로 담는다.
const toSubmitValues = (form: HTMLFormElement) => {
    const formData = new FormData(form)

    return Object.fromEntries(
        [...new Set(formData.keys())].map((key) => {
            const all = formData.getAll(key)
            return [key, all.length > 1 ? all : (all[0] ?? '')]
        }),
    )
}

const ChecklistForm = ({data, id, formId, completeHref}: ChecklistFormProps) => {
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)
    // 기술 구분만 데이터의 기본값으로 시작하고, 나머지 선택 상자는 비어 있다.
    const [branchValue, setBranchValue] = useState(data.branch.defaultValue)
    const [values, setValues] = useState<Record<string, string>>({})
    // 제출을 눌러 검사가 한 번 돈 뒤부터 안내 문구를 보여 준다 — 화면에 들어오자마자 빨간 글씨를 띄우지 않는다.
    const [isSubmitted, setIsSubmitted] = useState(false)
    // 검사를 통과하면 바로 넘어가지 않고 최종 확인 모달을 먼저 띄운다.
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    const branchItems = data.branch.items[branchValue] ?? []
    // 기술 구분 안내 묶음은 갈래 첫 문항 앞에 붙는다 — 갈래가 바뀌어도 자리는 그대로다.
    const items = [...data.lead, ...branchItems, ...data.common]
    const requiredFields = items.map(getRequiredField).filter((field) => !!field)
    const missingBranch = !branchValue
    const isComplete = !missingBranch && requiredFields.every((field) => values[field.name])

    // 오류 안내가 그려진 다음 프레임에 첫 오류로 이동한다 — 라디오 묶음처럼 상자 자체가 포커스를 못 받으면
    // 그 안의 컨트롤로 간다[7.4.2].
    const focusFirstInvalid = () => {
        requestAnimationFrame(() => {
            const invalid = formRef.current?.querySelector('[aria-invalid="true"]')
            if (!(invalid instanceof HTMLElement)) return
            const focusable = invalid.matches('button, input, select, textarea, [tabindex]')
                ? invalid
                : invalid.querySelector('button, input, select, textarea, [tabindex]')
            if (focusable instanceof HTMLElement) focusable.focus()
        })
    }

    // [다음] 은 이 폼의 제출 버튼이다. 고르지 않은 컨트롤이 있으면 넘어가지 않고 그 자리에 안내 문구를 띄운다.
    // 통과하면 모은 값을 콘솔에 찍고(연동 전 확인용) 최종 확인 모달을 띄운다.
    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitted(true)
        if (!isComplete) {
            focusFirstInvalid()
            return
        }
        // [프론트엔드 연동] 이 줄을 저장 API 호출로 바꾼다 — 값은 폼 요소(name)에서 그대로 모은다.
        console.log('[체크리스트 입력] 제출 데이터', toSubmitValues(event.currentTarget))
        setIsConfirmOpen(true)
    }

    const branchError = isSubmitted && missingBranch ? data.branch.requiredMessage : undefined
    const errorOf = (item: ChecklistItem) => {
        const field = getRequiredField(item)
        return isSubmitted && field && !values[field.name] ? field.message : undefined
    }

    const renderSections = (sectionItems: ChecklistItem[]) =>
        toSections(sectionItems).map((section) => (
            <div key={section.items[0]?.id} className="flex flex-col">
                {section.header ? <ChecklistGroupHeaderBlock header={section.header} className="mb-4" /> : null}
                <QuestionList>
                    {section.items.map((item) => (
                        <ChecklistQuestion
                            key={item.id}
                            item={item}
                            branchValue={branchValue}
                            value={values[getRequiredField(item)?.name ?? ''] ?? ''}
                            error={errorOf(item)}
                            onValueChange={(next) => {
                                const field = getRequiredField(item)
                                if (field) setValues((current) => ({...current, [field.name]: next}))
                            }}
                        />
                    ))}
                </QuestionList>
            </div>
        ))

    return (
        <FormCard title="체크리스트">
            <form id={formId} ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* 바로가기(SkipNav)가 가리키는 자리 — 폼 자체가 대상이 되면 포커스 관리가 꼬인다. */}
                <span id={id} aria-hidden="true" className="sr-only" />
                {renderSections(data.lead)}

                {/* 기술 구분 — 아래 문항의 분기 조건이라 문항 목록 사이에 들어간다. */}
                <div className="flex flex-col gap-2">
                    <ChecklistGroupHeaderBlock header={data.branch.header} />
                    <ChipRadioGroup
                        name={data.branch.name}
                        value={branchValue}
                        onValueChange={setBranchValue}
                        aria-label={data.branch.label}
                        aria-invalid={branchError ? true : undefined}
                        aria-describedby={branchError ? `${data.branch.name}-error` : undefined}
                        className="grid w-full grid-cols-1 gap-2 md:grid-cols-2"
                    >
                        {data.branch.options.map((option) => (
                            <ChipRadio key={option.value} size="md" value={option.value} className="w-full">
                                {option.label}
                            </ChipRadio>
                        ))}
                    </ChipRadioGroup>
                    {branchError ? <FieldError id={`${data.branch.name}-error`}>{branchError}</FieldError> : null}
                </div>

                {renderSections(branchItems)}
                {renderSections(data.common)}
            </form>
            {/* 최종 확인 — [제출] 을 누르면 도는 흐름: ① 제출 요청 ② 모달 닫기 ③ 완료 화면 이동.
                [프론트엔드 연동] 아래 console.log 자리를 제출 API 호출로 바꾸고, 성공했을 때만 ②③ 을 실행한다. */}
            <SubmitConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                onSubmit={() => {
                    console.log('[체크리스트 입력] 제출 요청', {completeHref})
                    setIsConfirmOpen(false)
                    if (completeHref) router.push(completeHref)
                }}
            />
        </FormCard>
    )
}

export {ChecklistForm}
export type {
    ChecklistData,
    ChecklistBranch,
    ChecklistFormProps,
    ChecklistGroupHeader,
    ChecklistGuide,
    ChecklistItem,
    ChecklistOption,
    ChecklistSector,
}
