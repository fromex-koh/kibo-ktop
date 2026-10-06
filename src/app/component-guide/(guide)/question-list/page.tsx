// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

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

const BADGE_CODE = `{/* 문장과 칩을 ChipCheckboxGroup 하나로 감싼다 */}
<QuestionList>
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

const BASIC_CODE = `import {QuestionItem, QuestionList, QuestionOption, QuestionOptionList} from '@/components/composite/question-list'
import {QuestionSelect} from '@/components/composite/question-select'

<QuestionList>
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
<QuestionList>
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

const OPTION_CODE = `<QuestionList>
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
  <QuestionList>
    <QuestionItem align="control">
      신청기술의 기술성숙도(TRL)는 <Select>{/* ... */}</Select> 단계에 해당한다.
    </QuestionItem>
  </QuestionList>
</div>`

const FORM_CODE = `<form onSubmit={handleSubmit}>
  <QuestionList>
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
    ['QuestionList', 'children', 'QuestionItem 목록.', '-', 'ReactNode'],
    ['QuestionList', 'className · ol 속성', '목록 ol 에 그대로 전달됩니다.', 'undefined', "ComponentProps<'ol'>"],
    ['QuestionItem', 'children', '문항 본문. 문장과 인라인 입력을 함께 넣을 수 있습니다.', '-', 'ReactNode'],
    ['QuestionItem', 'control', '문항 맨 앞에 놓을 Checkbox 등의 컨트롤.', 'undefined', 'ReactNode'],
    ['QuestionItem', 'badge', '컨트롤 다음, 본문 앞에 놓을 분류 Badge.', 'undefined', 'ReactNode'],
    ['QuestionItem', 'description', '본문 아래 부가 설명.', 'undefined', 'ReactNode'],
    ['QuestionItem', 'helper', '설명 아래 도움말 링크나 보조 버튼.', 'undefined', 'ReactNode'],
    [
        'QuestionItem',
        'below',
        '컨트롤 · 본문 아래에서 문항 전체 너비를 쓰는 추가 영역(조건부 선택 칩 등). 지정하면 줄바꿈을 허용합니다.',
        'undefined',
        'ReactNode',
    ],
    [
        'QuestionItem',
        'align',
        "본문 첫 줄이 Select · Chip 이면 'control' 로 컨트롤 · 배지를 그 줄에 맞춥니다.",
        "'start'",
        "'start' | 'control'",
    ],
    [
        'QuestionItem',
        'contentClassName',
        '본문 열에 덧붙일 클래스. 본문에 입력만 둘 때 w-full 로 너비를 채웁니다.',
        'undefined',
        'string',
    ],
    ['QuestionItem', 'className · li 속성', '문항 li 에 그대로 전달됩니다.', 'undefined', "ComponentProps<'li'>"],
    ['QuestionOptionList', 'children', 'QuestionOption 목록.', '-', 'ReactNode'],
    [
        'QuestionOptionList',
        'className · ol 속성',
        '하위 목록 ol 에 그대로 전달됩니다.',
        'undefined',
        "ComponentProps<'ol'>",
    ],
    ['QuestionOption', 'children', '하위 항목 내용.', '-', 'ReactNode'],
    ['QuestionOption', 'control', '항목 맨 앞에 놓을 Checkbox 등의 컨트롤.', 'undefined', 'ReactNode'],
    ['QuestionOption', 'badge', '컨트롤 다음, 본문 앞에 놓을 분류 Badge.', 'undefined', 'ReactNode'],
    ['QuestionOption', 'align', 'QuestionItem 의 align 과 같습니다.', "'start'", "'start' | 'control'"],
    [
        'QuestionOption',
        'className · li 속성',
        '하위 항목 li 에 그대로 전달됩니다.',
        'undefined',
        "ComponentProps<'li'>",
    ],
    [
        'QuestionSelect',
        'options',
        '선택 목록. token 을 주면 문장 속 [ ] 에 label 대신 표시됩니다.',
        '-',
        '{value, label, token?}[]',
    ],
    ['QuestionSelect', 'label', '선택 컨트롤의 접근 가능한 이름.', '-', 'string'],
    ['QuestionSelect', 'before · after', '문장에서 선택값 앞 · 뒤에 오는 문구.', '-', 'string'],
    ['QuestionSelect', 'name', '폼 제출 시 필드 이름.', 'undefined', 'string'],
    [
        'QuestionSelect',
        'value · onValueChange',
        '선택값을 바깥에서 관리할 때 씁니다.',
        'undefined',
        'string · (value: string) => void',
    ],
    ['QuestionSelect', 'defaultValue', '초기 선택값.', "''", 'string'],
    ['QuestionSelect', 'placeholder', '미선택일 때 문장 속 [ ] 와 선택 컨트롤에 보이는 문구.', "'선택'", 'string'],
    ['QuestionSelect', 'action', '문장 끝 같은 줄에 붙는 버튼 등의 요소.', 'undefined', 'ReactNode'],
    ['QuestionSelect', 'error', '오류 문구. 선택 컨트롤 아래에 표시됩니다.', 'undefined', 'string'],
    [
        'QuestionSelect',
        'className · triggerClassName',
        '바깥 요소 · 선택 컨트롤에 덧붙일 클래스.',
        'undefined',
        'string',
    ],
] as const

const QuestionListGuidePage = () => (
    <GuidePageShell
        title="문항 목록 (QuestionList)"
        description="체크박스 · 분류 배지 · 본문 · 설명 · 도움말을 정렬하는 문항 목록입니다. Select · Checkbox · Chip 은 기존 컴포넌트를 그대로 넣어 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="question-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="question-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>QuestionList</code> 안에 <code>QuestionItem</code> 을 나열합니다. 본문은 children, 앞쪽
                        체크박스는 <code>control</code>, 본문 아래 설명은 <code>description</code> 으로 넘깁니다. 문항
                        번호는 붙지 않으며 순서는 <code>ol</code> 마크업이 가집니다.
                    </p>
                </div>
                <div className="border-subtle-3 rounded-md border p-6">
                    <QuestionList>
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
            <section aria-labelledby="question-patterns" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="question-patterns" className="typo-h4-bold">
                        문항 구성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        본문 첫 줄에 Select · Chip 처럼 컨트롤 높이의 요소가 오면 <code>align=&quot;control&quot;</code>{' '}
                        을 줍니다.
                    </p>
                </div>

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">분류 배지와 문장 속 칩</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            분류는 <code>badge</code> 로 넘깁니다. 문장 속 선택은 문장 전체를{' '}
                            <code>ChipCheckboxGroup</code> 하나로 감싸야 줄이 바뀌어도 둘째 줄이 배지 뒤에서 시작합니다.
                        </p>
                        <div className="border-subtle-3 rounded-md border p-6">
                            <QuestionList>
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
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">문장 속 선택값</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>QuestionSelect</code> 는 문장 안 <code>[ ]</code> 에 현재 선택값을 보여주고 그 아래
                            줄에 선택 컨트롤을 둡니다. 목록 문구와 문장 속 표기가 다르면 옵션에 <code>token</code> 을
                            줍니다(<code>3단계</code> → <code>[3]</code>).
                        </p>
                        <div className="border-subtle-3 rounded-md border p-6">
                            <QuestionList>
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
                            <QuestionList className="mt-6">
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
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">도움말과 하위 항목</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            안내 링크는 <code>helper</code> 로 넘깁니다. 한 문항이 여러 문장으로 갈라지면{' '}
                            <code>QuestionOptionList</code> · <code>QuestionOption</code> 으로 묶습니다.
                        </p>
                        <div className="border-subtle-3 rounded-md border p-6">
                            <QuestionList>
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
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="question-group" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="question-group" className="typo-h4-bold">
                        그룹 헤더와 조합
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        문항 묶음의 안내 제목은 목록 위에 <code>QuestionGroupHeader</code> 로 둡니다.
                    </p>
                </div>

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">선택 안내와 분기 문항</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            안내 제목과 ChipRadio 선택을 목록 위에 두고, 선택에 따라 보여줄 문항을 QuestionList 로
                            잇습니다.
                        </p>
                        <div className="border-subtle-3 rounded-md border p-6">
                            <div className="flex flex-col gap-6">
                                <QuestionGroupHeader>
                                    <QuestionGroupHeaderTitle>
                                        신청기술의 기술 구분을 선택해 주세요.
                                    </QuestionGroupHeaderTitle>
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
                                <QuestionList>
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
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section id="question-form" aria-labelledby="question-form-title" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="question-form-title" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        QuestionList 는 값을 갖지 않습니다. 안에 넣은 각 입력에 <code>name</code> 과 <code>value</code>{' '}
                        를 지정하면 그 값이 제출됩니다.
                    </p>
                </div>
                <div className="border-subtle-3 rounded-md border p-6">
                    <QuestionListFormDemo />
                </div>
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="question-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="question-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        목록 마크업(<code>ol</code> · <code>li</code>)은 컴포넌트가 처리합니다. 입력의 이름은 사용처에서
                        넣습니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code className="text-foreground font-mono">control</code> 로 넘기는 Checkbox 와 문장 속
                        SelectTrigger 에는 <code className="text-foreground font-mono">aria-label</code> 을 줍니다. 본문
                        문장이 입력의 이름으로 연결되지 않습니다[7.4.1].
                    </li>
                    <li>
                        문장 속 칩 묶음(ChipCheckboxGroup · ChipRadioGroup)에도{' '}
                        <code className="text-foreground font-mono">aria-label</code> 을 줍니다[7.4.1].
                    </li>
                    <li>
                        QuestionSelect 는 <code className="text-foreground font-mono">label</code> 이 선택 컨트롤의
                        이름이 되고, <code className="text-foreground font-mono">error</code> 를 주면 오류 문구가
                        컨트롤과 연결됩니다[7.4.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section id="question-props" aria-labelledby="question-props-title" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="question-props-title" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        QuestionSelect 는 <code>@/components/composite/question-select</code> 에서 가져옵니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="QuestionList · QuestionSelect Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default QuestionListGuidePage
