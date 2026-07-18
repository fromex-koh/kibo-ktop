'use client'

import {useState} from 'react'
import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import {ChipCheckbox, ChipCheckboxGroup, ChipRadio, ChipRadioGroup} from '@/components/composite/chip'
import {
    QuestionGroupHeader,
    QuestionGroupHeaderDescription,
    QuestionGroupHeaderTitle,
} from '@/components/composite/question-group-header'
import {QuestionItem, QuestionList, QuestionOption, QuestionOptionList} from '@/components/composite/question-list'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'

const QuestionListFormDemo = () => {
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')

    return (
        <form
            className="flex flex-col gap-8"
            onSubmit={(event) => {
                event.preventDefault()
                const entries = Array.from(new FormData(event.currentTarget).entries())
                setSubmittedData(JSON.stringify(entries))
            }}
        >
            <fieldset className="flex flex-col gap-4">
                <legend className="sr-only">생산 및 제작 방식 문항</legend>
                <QuestionList start={17}>
                    <QuestionItem
                        align="control"
                        badge={
                            <Badge variant="solid-pastel" color="secondary-green" shape="round">
                                제조
                            </Badge>
                        }
                    >
                        <ChipCheckboxGroup aria-label="생산과정 방식 선택" className="flex-1 items-center">
                            신청기술이 적용된 제품 생산 시, 생산과정이
                            <ChipCheckbox size="md" name="productionMethod" value="outsourced" defaultChecked>
                                외주가공
                            </ChipCheckbox>
                            또는
                            <ChipCheckbox size="md" name="productionMethod" value="inhouse">
                                자체제작
                            </ChipCheckbox>
                            을 통해 이루어진다.
                        </ChipCheckboxGroup>
                    </QuestionItem>
                    <QuestionItem
                        align="control"
                        badge={
                            <Badge variant="solid-pastel" color="secondary-grape" shape="round">
                                서비스
                            </Badge>
                        }
                    >
                        <ChipCheckboxGroup aria-label="제작과정 방식 선택" className="flex-1 items-center">
                            신청기술이 적용된 제품/서비스 제작 시, 제작과정이
                            <ChipCheckbox size="md" name="serviceMethod" value="outsourced">
                                외주인력
                            </ChipCheckbox>
                            또는
                            <ChipCheckbox size="md" name="serviceMethod" value="inhouse" defaultChecked>
                                자체인력
                            </ChipCheckbox>
                            을 통해 이루어진다.
                        </ChipCheckboxGroup>
                    </QuestionItem>
                </QuestionList>
            </fieldset>

            <fieldset>
                <legend className="sr-only">기술 유형 및 확장성 문항</legend>
                <QuestionList start={11}>
                    <QuestionItem align="control">
                        신청기술은
                        <Select name="technologyType" defaultValue="product">
                            <SelectTrigger size="md" aria-label="기술 유형" className="w-36">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="product">제품 기술</SelectItem>
                                <SelectItem value="service">서비스 기술</SelectItem>
                            </SelectContent>
                        </Select>
                        기술이다.
                    </QuestionItem>
                    <QuestionItem
                        description="타 분야의 제품·서비스·산업에 적용 또는 글로벌 시장으로의 확장"
                        control={
                            <Checkbox name="hasScalability" value="yes" defaultChecked aria-label="12번 문항 선택" />
                        }
                    >
                        신청기술은 확장성이 구체적으로 존재한다.
                    </QuestionItem>
                </QuestionList>
            </fieldset>

            <fieldset>
                <legend className="sr-only">기술성숙도 및 지식재산권 문항</legend>
                <QuestionList start={8}>
                    <QuestionItem
                        align="control"
                        helper={
                            <Link href="#question-form" className="inline-flex items-center gap-0.5 hover:underline">
                                TRL 확인 <ChevronRight aria-hidden="true" className="size-icon-xs" />
                            </Link>
                        }
                    >
                        신청기술의 기술성숙도(TRL)는
                        <Select name="trl" defaultValue="growth">
                            <SelectTrigger size="md" aria-label="TRL 단계" className="w-36">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="early">초기 단계</SelectItem>
                                <SelectItem value="growth">성장 단계</SelectItem>
                                <SelectItem value="mature">성숙 단계</SelectItem>
                            </SelectContent>
                        </Select>
                        단계에 해당한다.
                    </QuestionItem>
                    <QuestionItem>
                        <QuestionOptionList>
                            <QuestionOption
                                control={
                                    <Checkbox
                                        name="technologyEvidence"
                                        value="intellectual-property"
                                        defaultChecked
                                        aria-label="9번 첫 번째 항목 선택"
                                    />
                                }
                            >
                                신청기술은 동사가 지식재산권을 등록한 기술
                            </QuestionOption>
                            <QuestionOption
                                control={
                                    <Checkbox
                                        name="technologyEvidence"
                                        value="government-rnd"
                                        aria-label="9번 두 번째 항목 선택"
                                    />
                                }
                            >
                                또는 정부 R&amp;D 과제를 수행한(중인) 기술에 해당한다.
                            </QuestionOption>
                        </QuestionOptionList>
                    </QuestionItem>
                </QuestionList>
            </fieldset>

            <fieldset className="flex flex-col gap-6">
                <legend className="sr-only">기술 구분과 분기 문항</legend>
                <QuestionGroupHeader>
                    <QuestionGroupHeaderTitle>신청기술의 기술 구분을 선택해 주세요.</QuestionGroupHeaderTitle>
                    <QuestionGroupHeaderDescription>
                        선택에 따라 아래 기술의 차별성 문항이 분기 노출됩니다
                    </QuestionGroupHeaderDescription>
                </QuestionGroupHeader>
                <ChipRadioGroup aria-label="신청기술 기술 구분" name="technologyCategory" defaultValue="expert">
                    <ChipRadio size="md" value="expert">
                        전문기술 (R&amp;D·지식재산권·기술성숙도(TRL) 기반)
                    </ChipRadio>
                    <ChipRadio size="md" value="skilled">
                        숙련기술 (생산·품질 등 숙련 노하우 기반)
                    </ChipRadio>
                </ChipRadioGroup>
                <QuestionList start={23}>
                    <QuestionItem align="control" contentClassName="w-full">
                        <Select name="evaluationItem" defaultValue="technology">
                            <SelectTrigger size="md" className="w-full" aria-label="평가 항목 선택">
                                <SelectValue placeholder="선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="technology">기술성</SelectItem>
                                <SelectItem value="business">사업성</SelectItem>
                            </SelectContent>
                        </Select>
                    </QuestionItem>
                </QuestionList>
            </fieldset>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="md">
                        선택 내용 확인
                    </Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        각 입력 컴포넌트의 name과 선택값이 하나의 FormData로 제출됩니다.
                    </span>
                </div>
                <output
                    className="typo-body-l-regular bg-surface border-border text-muted-foreground min-h-10 rounded-md border px-3 py-2 break-all"
                    aria-live="polite"
                >
                    {submittedData}
                </output>
            </div>
        </form>
    )
}

export default QuestionListFormDemo
