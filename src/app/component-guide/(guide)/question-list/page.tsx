import type {Metadata} from 'next'
import Link from 'next/link'
import {ChevronRight} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {ChipCheckbox, ChipCheckboxGroup, ChipRadio, ChipRadioGroup} from '@/components/composite/chip'
import {
    QuestionGroupHeader,
    QuestionGroupHeaderDescription,
    QuestionGroupHeaderTitle,
} from '@/components/composite/question-group-header'
import {QuestionItem, QuestionList, QuestionOption, QuestionOptionList} from '@/components/composite/question-list'
import {QuestionSelect} from '@/components/composite/question-select'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {Badge} from '@/components/ui/badge'
import QuestionListFormDemo from './question-list-form-demo'

export const metadata: Metadata = {title: '문항 목록 (QuestionList)'}

const BADGE_CODE = `{/* 문장+칩을 ChipCheckboxGroup 하나로 감싸 두 번째 줄이 배지 뒤부터 정렬(hanging indent)됩니다. */}
<QuestionList start={17}>
  <QuestionItem
    align="control"
    badge={<Badge variant="solid-pastel" color="secondary-green" shape="round">제조</Badge>}
  >
    <ChipCheckboxGroup aria-label="생산과정 방식 선택" className="flex-1 items-center">
      신청기술이 적용된 제품 생산 시, 생산과정이
      <ChipCheckbox size="md" name="prod-1" value="outsourced" defaultChecked>외주가공</ChipCheckbox>
      또는
      <ChipCheckbox size="md" name="prod-1" value="inhouse">자체제작</ChipCheckbox>
      을 통해 이루어진다.
    </ChipCheckboxGroup>
  </QuestionItem>
  <QuestionItem
    align="control"
    badge={<Badge variant="solid-pastel" color="secondary-purple" shape="round">서비스</Badge>}
  >
    <ChipCheckboxGroup aria-label="제작과정 방식 선택" className="flex-1 items-center">
      신청기술이 적용된 제품/서비스 제작 시, 제작과정이
      <ChipCheckbox size="md" name="prod-2" value="outsourced">외주인력</ChipCheckbox>
      또는
      <ChipCheckbox size="md" name="prod-2" value="inhouse">자체인력</ChipCheckbox>
      을 통해 이루어진다.
    </ChipCheckboxGroup>
  </QuestionItem>
</QuestionList>`

const BASIC_CODE = `<QuestionList start={11}>
  <QuestionItem align="control">
    신청기술은
    <Select>
      <SelectTrigger size="md" aria-label="기술 유형"><SelectValue placeholder="선택" /></SelectTrigger>
      <SelectContent>{/* SelectItem */}</SelectContent>
    </Select>
    기술이다.
  </QuestionItem>
  <QuestionItem
    description="타 분야의 제품·서비스·산업에 적용 또는 글로벌 시장으로의 확장"
    control={<Checkbox aria-label="12번 문항 선택" />}
  >
    신청기술은 확장성이 구체적으로 존재한다.
  </QuestionItem>
</QuestionList>`

const SELECT_ANSWER_CODE = `{/* 문장 안 [ ] 에 현재 선택값이 primary 색으로 표시되고, 값이 바뀌면 함께 바뀐다 */}
<QuestionList start={8}>
  <QuestionItem helper={<Button variant="text-underline" size="md">TRL 확인 <ChevronRight /></Button>}>
    <QuestionSelect
      name="trl"
      label="기술성숙도(TRL) 단계"
      before="신청기술의 기술성숙도(TRL)는"
      after="단계에 해당한다"
      defaultValue="3"
      options={[{value: '3', label: '3단계', token: '3'} /* … */]}
    />
  </QuestionItem>
</QuestionList>

{/* 미선택이면 placeholder(기본 "선택")가 [ ] 안에 들어간다 */}
<QuestionSelect
  name="technologyType"
  label="신청기술 유형"
  before="신청기술은"
  after="기술이다."
  options={[{value: 'product', label: '제품'}, {value: 'service', label: '서비스'}]}
/>`

const OPTION_CODE = `<QuestionList start={8}>
  <QuestionItem align="control" helper={<Button variant="text-underline" size="md" asChild><Link href="#trl-help">TRL 확인 <ChevronRight /></Link></Button>}>
    신청기술의 기술성숙도(TRL)는 <Select>{/* ... */}</Select> 단계에 해당한다.
  </QuestionItem>
  <QuestionItem>
    <QuestionOptionList>
      <QuestionOption control={<Checkbox aria-label="9번 첫 번째 항목 선택" />}>
        신청기술은 동사가 지식재산권을 등록한 기술
      </QuestionOption>
      <QuestionOption control={<Checkbox aria-label="9번 두 번째 항목 선택" />}>
        또는 정부 R&amp;D 과제를 수행한(중인) 기술에 해당한다.
      </QuestionOption>
    </QuestionOptionList>
  </QuestionItem>
</QuestionList>`

const BRANCH_CODE = `<div className="flex flex-col gap-6">
  <QuestionGroupHeader>
    <QuestionGroupHeaderTitle>신청기술의 기술 구분을 선택해 주세요.</QuestionGroupHeaderTitle>
    <QuestionGroupHeaderDescription>선택에 따라 아래 기술의 차별성 문항이 분기 노출됩니다</QuestionGroupHeaderDescription>
  </QuestionGroupHeader>
  <ChipRadioGroup aria-label="신청기술 기술 구분" defaultValue="expert">
    <ChipRadio size="md" value="expert">전문기술 (R&D·지식재산권·기술성숙도(TRL) 기반)</ChipRadio>
    <ChipRadio size="md" value="skilled">숙련기술 (생산·품질 등 숙련 노하우 기반)</ChipRadio>
  </ChipRadioGroup>
  <QuestionList start={8}>
    <QuestionItem align="control">
      신청기술의 기술성숙도(TRL)는 <Select>{/* ... */}</Select> 단계에 해당한다.
    </QuestionItem>
  </QuestionList>
</div>`

const BLOCK_CODE = `<div className="flex flex-col gap-6">
  <QuestionGroupHeader>
    <QuestionGroupHeaderTitle>아래 중 동사에 해당하는 항목을 선택해 주세요. (택1)</QuestionGroupHeaderTitle>
    <QuestionGroupHeaderDescription>기술구분(전문/숙련)·[10]·[11] 응답에 따라 위 보기가 자동으로 달라집니다.</QuestionGroupHeaderDescription>
  </QuestionGroupHeader>
  <QuestionList start={23}>
    <QuestionItem align="control" contentClassName="w-full">
      <Select>
        <SelectTrigger size="md" className="w-full" aria-label="평가 항목 선택">
          <SelectValue placeholder="선택해 주세요" />
        </SelectTrigger>
        <SelectContent>{/* SelectItem */}</SelectContent>
      </Select>
    </QuestionItem>
  </QuestionList>
</div>`

const FORM_CODE = `<form onSubmit={handleSubmit}>
  <QuestionList start={11}>
    <QuestionItem align="control">
      신청기술은
      <Select name="technologyType" defaultValue="product">{/* ... */}</Select>
      기술이다.
    </QuestionItem>
    <QuestionItem
      control={
        <Checkbox
          name="hasScalability"
          value="yes"
          aria-label="12번 문항 선택"
        />
      }
    >
      신청기술은 확장성이 구체적으로 존재한다.
    </QuestionItem>
  </QuestionList>

  <ChipRadioGroup
    name="technologyCategory"
    aria-label="신청기술 기술 구분"
    defaultValue="expert"
  >
    <ChipRadio value="expert">전문기술</ChipRadio>
    <ChipRadio value="skilled">숙련기술</ChipRadio>
  </ChipRadioGroup>

  <Button type="submit" variant="default" size="sm">선택 내용 확인</Button>
</form>`

// 문장 속 선택값 데모 — 목록 문구(label)와 문장 표기(token)가 다른 경우와 같은 경우를 함께 보여준다.
const GUIDE_TRL_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((level) => ({
    value: level,
    label: `${level}단계`,
    token: level,
}))

const GUIDE_TECHNOLOGY_TYPE_OPTIONS = [
    {value: 'product', label: '제품'},
    {value: 'service', label: '서비스'},
    {value: 'process', label: '공정'},
] as const

const PROPS_ITEMS = [
    ['QuestionList', 'start', '첫 문항 번호이며 이후 QuestionItem 번호를 자동으로 계산합니다.', '1', 'number'],
    ['QuestionList', 'children', 'QuestionItem 목록입니다.', '-', 'ReactNode'],
    [
        'QuestionList',
        'className · ol props',
        '목록 스타일과 네이티브 ol 속성을 전달합니다.',
        'undefined',
        'OlHTMLAttributes',
    ],
    ['QuestionItem', 'children', '문항 본문과 인라인 입력 컴포넌트를 조합합니다.', '-', 'ReactNode'],
    ['QuestionItem', 'badge', '번호 다음 열에 배치할 분류 Badge입니다.', 'undefined', 'ReactNode'],
    ['QuestionItem', 'control', '문항 우측에 배치할 Checkbox 등의 컨트롤입니다.', 'undefined', 'ReactNode'],
    ['QuestionItem', 'description', '본문 아래 부가 설명입니다.', 'undefined', 'ReactNode'],
    ['QuestionItem', 'helper', '본문 아래 도움말 링크 또는 보조 액션입니다.', 'undefined', 'ReactNode'],
    ['QuestionItem', 'number', '자동 번호 대신 표시할 문항 번호입니다.', 'undefined', 'number | string'],
    [
        'QuestionItem',
        'align',
        "본문 첫 줄 기준 번호·컨트롤 세로 정렬입니다. 'control'은 인라인 Select 등 40px 컨트롤 라인 중앙에 맞춥니다.",
        "'start'",
        "'start' | 'control'",
    ],
    ['QuestionItem', 'contentClassName', '본문 열에 추가할 레이아웃 클래스입니다.', 'undefined', 'string'],
    [
        'QuestionItem',
        'className · li props',
        '문항 스타일과 네이티브 li 속성을 전달합니다.',
        'undefined',
        'LiHTMLAttributes',
    ],
    ['QuestionOptionList', 'start', '첫 하위 항목 번호입니다.', '1', 'number'],
    ['QuestionOptionList', 'children', 'QuestionOption 목록입니다.', '-', 'ReactNode'],
    ['QuestionOptionList', 'className · ol props', '하위 목록 속성을 전달합니다.', 'undefined', 'OlHTMLAttributes'],
    ['QuestionOption', 'children', '하위 선택 항목 내용입니다.', '-', 'ReactNode'],
    ['QuestionOption', 'control', '항목 우측의 Checkbox 등의 컨트롤입니다.', 'undefined', 'ReactNode'],
    ['QuestionOption', 'className · li props', '하위 항목 속성을 전달합니다.', 'undefined', 'LiHTMLAttributes'],
] as const

const QuestionListGuidePage = () => (
    <GuidePageShell
        title="문항 목록 (QuestionList)"
        description="번호·본문·설명·도움말·우측 컨트롤을 정렬하는 문항용 compound component입니다. Select와 Checkbox의 기능은 기존 컴포넌트를 조합해 사용합니다."
    >
        <BaseCard>
            <section aria-labelledby="question-badge" className="flex flex-col gap-4">
                <div>
                    <h2 id="question-badge" className="typo-h4-bold">
                        분류 Badge와 문장형 선택
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Badge가 있는 문항은 목록 전체에서 같은 열을 공유하므로 본문 시작점이 동일하게 정렬됩니다. 함께
                        고를 수 있는 문장 속 선택은 ChipCheckbox를 쓰고, 문장 전체를 ChipCheckboxGroup으로 감싸 줄바꿈
                        시 두 번째 줄이 배지 뒤부터 정렬되게 합니다.
                    </p>
                </div>
                <div className="border-subtle-3 rounded-md border p-6">
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
                                <ChipCheckbox size="md" name="prod-1" value="outsourced" defaultChecked>
                                    외주가공
                                </ChipCheckbox>
                                또는
                                <ChipCheckbox size="md" name="prod-1" value="inhouse">
                                    자체제작
                                </ChipCheckbox>
                                을 통해 이루어진다.
                            </ChipCheckboxGroup>
                        </QuestionItem>
                        <QuestionItem
                            align="control"
                            badge={
                                <Badge variant="solid-pastel" color="secondary-purple" shape="round">
                                    서비스
                                </Badge>
                            }
                        >
                            <ChipCheckboxGroup aria-label="제작과정 방식 선택" className="flex-1 items-center">
                                신청기술이 적용된 제품/서비스 제작 시, 제작과정이
                                <ChipCheckbox size="md" name="prod-2" value="outsourced">
                                    외주인력
                                </ChipCheckbox>
                                또는
                                <ChipCheckbox size="md" name="prod-2" value="inhouse">
                                    자체인력
                                </ChipCheckbox>
                                을 통해 이루어진다.
                            </ChipCheckboxGroup>
                        </QuestionItem>
                    </QuestionList>
                </div>
                <CodeBlock code={BADGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="question-basic" className="flex flex-col gap-4">
                <div>
                    <h2 id="question-basic" className="typo-h4-bold">
                        인라인 입력과 부가 설명
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        문장 안 Select, 부가 설명과 우측 Checkbox를 같은 문항 구조로 조합합니다.
                    </p>
                </div>
                <div className="border-subtle-3 rounded-md border p-6">
                    <QuestionList start={11}>
                        <QuestionItem align="control">
                            신청기술은
                            <Select>
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
                            control={<Checkbox aria-label="12번 문항 선택" />}
                        >
                            신청기술은 확장성이 구체적으로 존재한다.
                        </QuestionItem>
                        <QuestionItem control={<Checkbox aria-label="13번 문항 선택" />}>
                            동사의 매출·매입채권 및 현금수지를 한눈에 파악할 수 있는 자금일보를 체계적으로 관리하고
                            있다.
                        </QuestionItem>
                    </QuestionList>
                </div>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="question-select" className="flex flex-col gap-4">
                <div>
                    <h2 id="question-select" className="typo-h4-bold">
                        문장 속 선택값
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        문장이 답과 함께 읽히는 문항입니다. <code className="font-mono">QuestionSelect</code> 는 문장
                        안의 <code className="font-mono">[ ]</code> 에 현재 선택값을 primary 색으로 보여주고, 그 아래
                        줄에 선택 컨트롤(폭 180px)을 둡니다. 값을 바꾸면 문장 속 값도 즉시 따라 바뀝니다. 목록 문구와
                        문장 속 표기가 다를 때는 <code className="font-mono">token</code> 으로 짧은 표기를 지정합니다(
                        <code className="font-mono">3단계</code> → <code className="font-mono">[3]</code>).
                    </p>
                </div>
                <div className="border-subtle-3 rounded-md border p-6">
                    <QuestionList start={8}>
                        <QuestionItem
                            helper={
                                <Button variant="text-underline" size="md" className="gap-1">
                                    TRL 확인
                                    <ChevronRight aria-hidden="true" />
                                </Button>
                            }
                        >
                            <QuestionSelect
                                name="guide-trl"
                                label="기술성숙도(TRL) 단계"
                                before="신청기술의 기술성숙도(TRL)는"
                                after="단계에 해당한다"
                                defaultValue="3"
                                options={GUIDE_TRL_OPTIONS}
                            />
                        </QuestionItem>
                    </QuestionList>
                    <QuestionList start={11} className="mt-6">
                        <QuestionItem>
                            <QuestionSelect
                                name="guide-technology-type"
                                label="신청기술 유형"
                                before="신청기술은"
                                after="기술이다."
                                options={GUIDE_TECHNOLOGY_TYPE_OPTIONS}
                            />
                        </QuestionItem>
                    </QuestionList>
                </div>
                <CodeBlock code={SELECT_ANSWER_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="question-options" className="flex flex-col gap-4">
                <div>
                    <h2 id="question-options" className="typo-h4-bold">
                        도움말과 복수 하위 항목
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        helper에는 안내 링크를, 여러 세부 문장은 QuestionOptionList로 구성합니다.
                    </p>
                </div>
                <div className="border-subtle-3 rounded-md border p-6">
                    <QuestionList start={8}>
                        <QuestionItem
                            align="control"
                            helper={
                                <Button variant="text-underline" size="md" asChild>
                                    <Link href="#question-props">
                                        TRL 확인
                                        <ChevronRight aria-hidden="true" />
                                    </Link>
                                </Button>
                            }
                        >
                            신청기술의 기술성숙도(TRL)는
                            <Select>
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
                                <QuestionOption control={<Checkbox aria-label="9번 첫 번째 항목 선택" />}>
                                    신청기술은 동사가 지식재산권을 등록한 기술
                                </QuestionOption>
                                <QuestionOption control={<Checkbox aria-label="9번 두 번째 항목 선택" />}>
                                    또는 정부 R&amp;D 과제를 수행한(중인) 기술에 해당한다.
                                </QuestionOption>
                            </QuestionOptionList>
                        </QuestionItem>
                    </QuestionList>
                </div>
                <CodeBlock code={OPTION_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="question-helper" className="flex flex-col gap-4">
                <div>
                    <h2 id="question-helper" className="typo-h4-bold">
                        하단 도움말
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        입력 없이 확인 항목과 관련 매뉴얼 링크만 제공할 수도 있습니다.
                    </p>
                </div>
                <div className="border-subtle-3 rounded-md border p-6">
                    <QuestionList start={7}>
                        <QuestionItem
                            helper={
                                <Link
                                    href="#question-props"
                                    className="inline-flex items-center gap-0.5 hover:underline"
                                >
                                    피인용 확인 매뉴얼 <ChevronRight aria-hidden="true" className="size-icon-xs" />
                                </Link>
                            }
                            control={<Checkbox aria-label="7번 문항 선택" />}
                        >
                            보유 특허 중 피인용 횟수가 2회 이상인 특허가 존재한다.
                        </QuestionItem>
                    </QuestionList>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="question-branch" className="flex flex-col gap-4">
                <div>
                    <h2 id="question-branch" className="typo-h4-bold">
                        선택 안내와 분기 문항
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        번호 없는 안내 제목·캡션과 ChipRadio 선택을 목록 위에 두고, 선택에 따라 노출되는 문항을
                        QuestionList로 이어 구성합니다.
                    </p>
                </div>
                <div className="border-subtle-3 rounded-md border p-6">
                    <div className="flex flex-col gap-6">
                        <QuestionGroupHeader>
                            <QuestionGroupHeaderTitle>신청기술의 기술 구분을 선택해 주세요.</QuestionGroupHeaderTitle>
                            <QuestionGroupHeaderDescription>
                                선택에 따라 아래 기술의 차별성 문항이 분기 노출됩니다
                            </QuestionGroupHeaderDescription>
                        </QuestionGroupHeader>
                        <ChipRadioGroup aria-label="신청기술 기술 구분" defaultValue="expert">
                            <ChipRadio size="md" value="expert">
                                전문기술 (R&amp;D·지식재산권·기술성숙도(TRL) 기반)
                            </ChipRadio>
                            <ChipRadio size="md" value="skilled">
                                숙련기술 (생산·품질 등 숙련 노하우 기반)
                            </ChipRadio>
                        </ChipRadioGroup>
                        <QuestionList start={8}>
                            <QuestionItem align="control">
                                신청기술의 기술성숙도(TRL)는
                                <Select>
                                    <SelectTrigger size="md" aria-label="TRL 단계 선택" className="w-36">
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
                        </QuestionList>
                    </div>
                </div>
                <CodeBlock code={BRANCH_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="question-block" className="flex flex-col gap-4">
                <div>
                    <h2 id="question-block" className="typo-h4-bold">
                        전체 너비 입력
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        문장 대신 입력 컴포넌트만 두면 본문 열의 전체 너비를 사용합니다. 번호 없는 안내 제목·캡션은 목록
                        위에 함께 배치할 수 있습니다.
                    </p>
                </div>
                <div className="border-subtle-3 rounded-md border p-6">
                    <div className="flex flex-col gap-6">
                        <QuestionGroupHeader>
                            <QuestionGroupHeaderTitle>
                                아래 중 동사에 해당하는 항목을 선택해 주세요. (택1)
                            </QuestionGroupHeaderTitle>
                            <QuestionGroupHeaderDescription>
                                기술구분(전문/숙련)·[10]·[11] 응답에 따라 위 보기가 자동으로 달라집니다.
                            </QuestionGroupHeaderDescription>
                        </QuestionGroupHeader>
                        <QuestionList start={23}>
                            <QuestionItem align="control" contentClassName="w-full">
                                <Select>
                                    <SelectTrigger size="md" aria-label="평가 항목" className="w-full">
                                        <SelectValue placeholder="선택해 주세요" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="technology">기술성</SelectItem>
                                        <SelectItem value="business">사업성</SelectItem>
                                    </SelectContent>
                                </Select>
                            </QuestionItem>
                        </QuestionList>
                    </div>
                </div>
                <CodeBlock code={BLOCK_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section id="question-form" aria-labelledby="question-form-title" className="flex flex-col gap-4">
                <div>
                    <h2 id="question-form-title" className="typo-h4-bold">
                        Form 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        앞에서 확인한 Badge·인라인 Select·Checkbox·하위 항목·분기 선택·전체 너비 입력을 하나의 form으로
                        조합했습니다. 실제 값은 각 입력 컴포넌트에 <code className="font-mono">name</code>과{' '}
                        <code className="font-mono">value</code>를 지정해 제출하며, 같은 name을 가진 복수 선택값도{' '}
                        <code className="font-mono">FormData</code>에 모두 포함됩니다.
                    </p>
                </div>
                <div className="border-subtle-3 rounded-md border p-6">
                    <QuestionListFormDemo />
                </div>
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section id="question-props" aria-labelledby="question-props-title" className="flex flex-col gap-4">
                <div>
                    <h2 id="question-props-title" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        레이아웃만 제공하며 입력 컴포넌트의 props와 상태는 변경하지 않습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="QuestionList compound component Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default QuestionListGuidePage
