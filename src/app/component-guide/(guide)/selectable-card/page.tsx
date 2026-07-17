import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {
    SelectableCardBadgeDemo,
    SelectableCardFormDemo,
    SelectableCardRadioDemo,
    SelectableCardRadioStatesDemo,
    SelectableCardStatesDemo,
} from './selectable-card-demo'

export const metadata: Metadata = {title: '선택 카드 (SelectableCard)'}

const RADIO_CODE = `{/* Controlled — 부모 상태로 선택값 관리 */}
<SelectableCardGroup name="agreement" aria-label="동의 범위" value={value} onValueChange={setValue} className="grid-cols-2 gap-3">
  <SelectableCard control="radio" value="required" badges={<Badge …>필수</Badge>}>
    필수항목만 동의
  </SelectableCard>
  <SelectableCard control="radio" value="all" badges={<><Badge>필수</Badge><Badge>선택</Badge></>}>
    전체 항목 동의
  </SelectableCard>
</SelectableCardGroup>

{/* Uncontrolled — 초기값 이후 SelectableCardGroup 내부에서 선택값 관리 */}
<SelectableCardGroup name="agreement" aria-label="동의 범위" defaultValue="required" className="grid-cols-2 gap-3">
  <SelectableCard control="radio" value="required">필수항목만 동의</SelectableCard>
  <SelectableCard control="radio" value="all">전체 항목 동의</SelectableCard>
</SelectableCardGroup>`

const RADIO_STATES_CODE = `<div className="flex flex-col gap-3">
  <SelectableCardGroup name="default-state" aria-label="기본 라디오 상태" value="checked" className="grid-cols-2 gap-3">
    <SelectableCard control="radio" value="default">기본 (default)</SelectableCard>
    <SelectableCard control="radio" value="checked">선택됨 (checked)</SelectableCard>
  </SelectableCardGroup>
  <SelectableCardGroup name="disabled-state" aria-label="비활성 라디오 상태" value="disabled-checked" className="grid-cols-2 gap-3">
    <SelectableCard control="radio" value="disabled-default" disabled>비활성 미선택</SelectableCard>
    <SelectableCard control="radio" value="disabled-checked" disabled>비활성 선택</SelectableCard>
  </SelectableCardGroup>
</div>`

const CHECKBOX_CODE = `<SelectableCard control="checkbox" name="agreement" value="all" checked={checked} onCheckedChange={setChecked}>
  전체 항목 동의
</SelectableCard>`

const FORM_CODE = `<form onSubmit={handleSubmit}>
  <fieldset>
    <legend id="applicant-type-label">신청 주체</legend>
    <p>사업자 유형에 맞는 신청 주체를 선택해 주세요.</p>
    <SelectableCardGroup
      name="applicantType"
      aria-labelledby="applicant-type-label"
      defaultValue="corporation"
      required
    >
      <SelectableCard control="radio" value="corporation">법인사업자</SelectableCard>
      <SelectableCard control="radio" value="sole-proprietor">개인사업자</SelectableCard>
    </SelectableCardGroup>
  </fieldset>

  <fieldset>
    <legend>필수 동의</legend>
    <SelectableCard
      control="checkbox"
      name="privacyConsent"
      value="agreed"
      checked={consent}
      onCheckedChange={setConsent}
      required
    >
      개인정보 수집·이용에 동의합니다.
    </SelectableCard>
  </fieldset>

  <Button type="submit" variant="default" size="md">신청 내용 확인</Button>
</form>`

const PROPS = [
    {
        component: 'SelectableCardGroup',
        name: 'name',
        description: '폼 제출 시 사용할 필드 이름입니다. 화면 상태 선택에만 사용한다면 생략할 수 있습니다.',
        defaultValue: '-',
        control: 'string',
    },
    {
        component: 'SelectableCardGroup',
        name: 'aria-label / aria-labelledby',
        description: '라디오 그룹의 목적을 보조기기에 전달합니다. 사용 시 두 속성 중 하나를 제공합니다.',
        defaultValue: '-',
        control: 'string',
    },
    {
        component: 'SelectableCardGroup',
        name: 'value / defaultValue',
        description:
            '라디오 카드 그룹의 현재 선택값 또는 초기 선택값입니다. controlled와 uncontrolled 방식을 모두 지원합니다.',
        defaultValue: '-',
        control: 'string',
    },
    {
        component: 'SelectableCardGroup',
        name: 'onValueChange',
        description: '라디오 카드의 선택값이 바뀔 때 호출됩니다.',
        defaultValue: '-',
        control: '(value) => void',
    },
    {
        component: 'SelectableCardGroup',
        name: 'required / form',
        description: '네이티브 필수 선택 검증과 외부 form 연결에 사용합니다.',
        defaultValue: 'false / -',
        control: 'boolean / string',
    },
    {
        component: 'SelectableCardGroup',
        name: 'className',
        description: '그룹의 열 수, 간격과 폭 등 레이아웃 스타일을 확장합니다.',
        defaultValue: '""',
        control: 'string',
    },
    {
        component: 'SelectableCard',
        name: 'control',
        description: '내장 선택 컨트롤입니다. radio는 단일 선택, checkbox는 독립 선택에 사용합니다.',
        defaultValue: '"checkbox"',
        control: '"radio" | "checkbox"',
    },
    {
        component: 'SelectableCard',
        name: 'value',
        description: '폼 제출 값입니다. radio 카드에는 각 항목을 구분하는 고유한 값을 지정합니다.',
        defaultValue: '-',
        control: 'string',
    },
    {
        component: 'SelectableCard',
        name: 'checked / onCheckedChange',
        description: 'checkbox 카드의 제어 선택 상태와 변경 콜백입니다.',
        defaultValue: 'false',
        control: 'boolean / (checked) => void',
    },
    {
        component: 'SelectableCard',
        name: 'name',
        description: 'checkbox 값을 폼으로 제출할 때 사용할 필드 이름입니다.',
        defaultValue: '-',
        control: 'string',
    },
    {
        component: 'SelectableCard',
        name: 'required / form',
        description: 'checkbox 카드의 네이티브 필수 검증과 외부 form 연결에 사용합니다.',
        defaultValue: 'false / -',
        control: 'boolean / string',
    },
    {
        component: 'SelectableCard',
        name: 'disabled',
        description: '상호작용을 막고 공통 비활성 배경·텍스트·테두리 토큰을 적용합니다.',
        defaultValue: 'false',
        control: 'boolean',
    },
    {
        component: 'SelectableCard',
        name: 'badges',
        description: '카드 오른쪽에 Badge 등 보조 요소를 표시하는 슬롯입니다.',
        defaultValue: '-',
        control: 'ReactNode',
    },
    {
        component: 'SelectableCard',
        name: 'labelClassName',
        description: '기본 typo-title-l-bold 라벨 스타일을 확장하거나 덮어씁니다.',
        defaultValue: '""',
        control: 'string',
    },
    {
        component: 'SelectableCard',
        name: 'id',
        description: '내부 RadioGroupItem 또는 Checkbox에 전달할 식별자입니다.',
        defaultValue: '-',
        control: 'string',
    },
    {
        component: 'SelectableCard',
        name: 'className',
        description: '카드의 폭과 레이아웃 스타일을 확장합니다.',
        defaultValue: '""',
        control: 'string',
    },
    {
        component: 'SelectableCard',
        name: 'children',
        description: '카드의 기본 라벨 콘텐츠입니다.',
        defaultValue: '-',
        control: 'ReactNode',
    },
]

const SelectableCardGuidePage = () => (
    <GuidePageShell
        title="선택 카드 (SelectableCard)"
        description="shadcn Radio Group의 Choice Card 패턴(FieldLabel > Field + Radio/Checkbox)을 프로젝트 스타일로 확장한 선택 컨트롤입니다. 카드 전체가 하나의 선택 대상이고, control 로 라디오(단일)·체크박스(다중)를 정합니다."
    >
        <section aria-labelledby="sc-state" className="flex flex-col gap-4">
            <div>
                <h2 id="sc-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    체크전·체크후·비활성 상태입니다. <code className="font-mono">disabled</code>는 primitive의
                    상호작용과 폼 제출 규칙을 그대로 따르며 공통 disabled 토큰으로 표시합니다.
                </p>
            </div>
            <SelectableCardStatesDemo />
        </section>

        <section aria-labelledby="sc-badge" className="flex flex-col gap-4">
            <div>
                <h2 id="sc-badge" className="typo-h4-bold">
                    뱃지 (Badge)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    우측에 뱃지를 1개(필수) 또는 2개(필수·선택) 붙일 수 있습니다.{' '}
                    <code className="font-mono">badges</code> 슬롯으로 넘깁니다.
                </p>
            </div>
            <SelectableCardBadgeDemo />
        </section>

        <section aria-labelledby="sc-radio" className="flex flex-col gap-4">
            <div>
                <h2 id="sc-radio" className="typo-h4-bold">
                    라디오 그룹 (단일 선택 · 2단)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">control=&quot;radio&quot;</code> 카드를{' '}
                    <code className="font-mono">SelectableCardGroup</code>(shadcn RadioGroup 래퍼) 으로 감싸면 하나만
                    선택됩니다. 각 항목은 Choice Card 구조를 사용하며, Figma처럼{' '}
                    <code className="font-mono">grid-cols-2</code> 로 2단 배치했습니다.{' '}
                    <code className="font-mono">value</code>와 <code className="font-mono">onValueChange</code>를 쓰는
                    controlled 방식과 <code className="font-mono">defaultValue</code>를 쓰는 uncontrolled 방식을 모두
                    지원합니다.
                </p>
            </div>
            <SelectableCardRadioDemo />
            <div className="flex flex-col gap-3">
                <h3 className="typo-title-l-medium text-foreground">라디오 상태 큐레이션</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    라디오 카드도 체크박스 카드와 동일하게 기본·선택됨·비활성 상태를 확인할 수 있습니다. 비활성은
                    미선택과 선택 케이스를 함께 둬서 border 표시 규칙까지 비교합니다.
                </p>
                <SelectableCardRadioStatesDemo />
            </div>
            <CodeBlock code={RADIO_CODE} language="tsx" copyLabel="복사" />
            <CodeBlock code={RADIO_STATES_CODE} language="tsx" copyLabel="복사" />
            <CodeBlock code={CHECKBOX_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sc-form" className="flex flex-col gap-4">
            <div>
                <h2 id="sc-form" className="typo-h4-bold">
                    신청 Form 제출
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    실제 신청 화면을 가정해 신청 주체와 필수 동의를 구성했습니다. 라디오는 그룹에{' '}
                    <code className="font-mono">name</code>, 각 항목에 <code className="font-mono">value</code>를
                    지정하고, 체크박스는 카드에 <code className="font-mono">name</code>과{' '}
                    <code className="font-mono">value</code>를 지정하면 선택값이 제출됩니다. 컴포넌트가 실제{' '}
                    <code className="font-mono">form</code> 안에 있어야 하며,{' '}
                    <code className="font-mono">disabled</code> 값은 폼 제출에서 제외됩니다. 아래 버튼으로 실제{' '}
                    <code className="font-mono">FormData</code> 결과를 확인할 수 있습니다.
                </p>
            </div>
            <SelectableCardFormDemo />
            <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sc-props" className="flex flex-col gap-4">
            <div>
                <h2 id="sc-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    SelectableCard와 SelectableCardGroup에서 주로 사용하는 프로젝트 API입니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">SelectableCard Props 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Component
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Name
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Default
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Control
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {PROPS.map((prop, index) => {
                            const firstComponentIndex = PROPS.findIndex((item) => item.component === prop.component)
                            const componentRowSpan = PROPS.filter((item) => item.component === prop.component).length

                            return (
                                <tr
                                    key={`${prop.component}-${prop.name}`}
                                    className="border-border bg-background border-b last:border-b-0"
                                >
                                    {index === firstComponentIndex ? (
                                        <th
                                            scope="rowgroup"
                                            rowSpan={componentRowSpan}
                                            className="typo-caption-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                                        >
                                            {prop.component}
                                        </th>
                                    ) : null}
                                    <td className="typo-caption-regular text-primary px-4 py-3 align-top font-mono whitespace-nowrap">
                                        {prop.name}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 align-top">
                                        {prop.description}
                                    </td>
                                    <td className="typo-caption-regular text-muted-foreground px-4 py-3 align-top font-mono whitespace-nowrap">
                                        {prop.defaultValue}
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs whitespace-nowrap">
                                            {prop.control}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePageShell>
)

export default SelectableCardGuidePage
