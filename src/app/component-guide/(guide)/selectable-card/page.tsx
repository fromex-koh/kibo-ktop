import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {
    CheckboxBadgeDemo,
    CheckboxBasicDemo,
    CheckboxDisabledDemo,
    RadioBadgeDemo,
    RadioBasicDemo,
    RadioDisabledDemo,
    SelectableCardFormDemo,
} from './selectable-card-demo'

export const metadata: Metadata = {title: '선택 카드 (SelectableCard)'}

const RADIO_BASIC_CODE = `import {SelectableCard, SelectableCardGroup} from '@/components/composite/selectable-card'

{/* Controlled — 부모 상태로 선택값 관리 */}
<SelectableCardGroup
  name="agreement"
  aria-label="동의 범위"
  value={value}
  onValueChange={setValue}
  className="gap-4 xl:grid-cols-2"
>
  <SelectableCard control="radio" value="required">필수항목만 동의</SelectableCard>
  <SelectableCard control="radio" value="all">전체 항목 동의</SelectableCard>
</SelectableCardGroup>

{/* Uncontrolled — 초기값만 주고 그룹 내부에서 선택값 관리 */}
<SelectableCardGroup
  name="agreement"
  aria-label="동의 범위"
  defaultValue="required"
  className="gap-4 xl:grid-cols-2"
>
  <SelectableCard control="radio" value="required">필수항목만 동의</SelectableCard>
  <SelectableCard control="radio" value="all">전체 항목 동의</SelectableCard>
</SelectableCardGroup>`

const RADIO_BADGE_CODE = `import {Badge} from '@/components/ui/badge'

<SelectableCardGroup
  name="agreement"
  aria-label="동의 범위"
  value={value}
  onValueChange={setValue}
  className="gap-4 xl:grid-cols-2"
>
  {/* 뱃지 1개 */}
  <SelectableCard
    control="radio"
    value="required"
    badges={<Badge variant="outline" color="info" shape="round">필수</Badge>}
  >
    필수항목만 동의
  </SelectableCard>

  {/* 뱃지 2개 — badges 슬롯에 여러 개를 넘기면 4px 간격으로 나열된다 */}
  <SelectableCard
    control="radio"
    value="all"
    badges={
      <>
        <Badge variant="outline" color="info" shape="round">필수</Badge>
        <Badge variant="outline" color="neutral" shape="round">선택</Badge>
      </>
    }
  >
    전체 항목 동의
  </SelectableCard>
</SelectableCardGroup>`

const RADIO_DISABLED_CODE = `<SelectableCardGroup
  name="agreement"
  aria-label="비활성 라디오 상태"
  value="disabled-checked"
  className="gap-4 xl:grid-cols-2"
>
  <SelectableCard control="radio" value="disabled-default" disabled>비활성 미선택</SelectableCard>
  <SelectableCard control="radio" value="disabled-checked" disabled>비활성 선택</SelectableCard>
</SelectableCardGroup>`

const CHECKBOX_BASIC_CODE = `import {SelectableCard} from '@/components/composite/selectable-card'

{/* 카드마다 독립적인 checked 상태를 가진다 — 그룹으로 감싸지 않는다 */}
<div className="flex flex-col gap-4">
  <SelectableCard control="checkbox" checked={first} onCheckedChange={setFirst}>
    본인은 기술보증기금과 동의서를 작성함에 … 확인합니다.
  </SelectableCard>
  <SelectableCard control="checkbox" checked={second} onCheckedChange={setSecond}>
    본인은 회원정보(마이페이지)상 이메일정보를 확인하였으며 … 동의합니다.
  </SelectableCard>
</div>`

const CHECKBOX_BADGE_CODE = `<SelectableCard
  control="checkbox"
  checked={required}
  onCheckedChange={setRequired}
  badges={<Badge variant="outline" color="info" shape="round">필수</Badge>}
>
  개인정보 수집·이용에 동의합니다.
</SelectableCard>

<SelectableCard
  control="checkbox"
  checked={optional}
  onCheckedChange={setOptional}
  badges={<Badge variant="outline" color="neutral" shape="round">선택</Badge>}
>
  마케팅 정보 수신에 동의합니다.
</SelectableCard>`

const CHECKBOX_DISABLED_CODE = `<SelectableCard control="checkbox" checked={false} disabled>비활성 미선택</SelectableCard>
<SelectableCard control="checkbox" checked disabled>비활성 선택</SelectableCard>`

const FORM_CODE = `<form onSubmit={handleSubmit}>
  <fieldset>
    <legend id="applicant-type-label">신청 주체</legend>
    <SelectableCardGroup
      name="applicantType"
      aria-labelledby="applicant-type-label"
      defaultValue="corporation"
      className="gap-4 xl:grid-cols-2"
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
        description:
            '내장 선택 컨트롤입니다. radio는 단일 선택, checkbox는 독립 선택에 사용하며 라벨 타이포도 함께 결정됩니다.',
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
        description:
            '라벨 왼쪽에 Badge 등 보조 요소를 표시하는 슬롯입니다. 뱃지 텍스트도 컨트롤의 접근 가능한 이름에 포함됩니다.',
        defaultValue: '-',
        control: 'ReactNode',
    },
    {
        component: 'SelectableCard',
        name: 'labelClassName',
        description: 'control이 정한 기본 라벨 타이포를 확장하거나 덮어씁니다.',
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

// 케이스 한 칸 — 제목·설명·미리보기·코드를 한 묶음으로 보여준다. 개발자가 화면에서 본 상태의
// 코드를 바로 아래에서 확인할 수 있게 짝을 고정한다.
type GuideCaseProps = {title: string; description: ReactNode; code: string; children: ReactNode}

const GuideCase = ({title, description, code, children}: GuideCaseProps) => (
    <div className="flex flex-col gap-3">
        <div>
            <h3 className="typo-title-l-medium text-foreground">{title}</h3>
            <p className="typo-body-l-regular text-muted-foreground">{description}</p>
        </div>
        {children}
        <CodeBlock code={code} language="tsx" copyLabel="복사" />
    </div>
)

const SelectableCardGuidePage = () => (
    <GuidePageShell
        title="선택 카드 (SelectableCard)"
        description="카드 전체가 하나의 선택 대상인 컨트롤입니다. 카드 어디를 눌러도 선택되고, 뱃지와 라벨이 왼쪽, 선택 컨트롤이 오른쪽 끝에 붙습니다. control 로 단일 선택(radio)과 독립 선택(checkbox)을 정하며 라벨 타이포도 함께 결정됩니다."
    >
        <BaseCard>
            <section aria-labelledby="sc-radio" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="sc-radio" className="typo-h4-bold">
                        control=&quot;radio&quot; — 단일 선택
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        동의 범위처럼 <strong className="font-medium">여러 선택지 중 하나만</strong> 고르는 화면에
                        씁니다. 반드시 <code className="font-mono">SelectableCardGroup</code>으로 감싸고, 선택값은
                        그룹이 관리하므로 카드에는 <code className="font-mono">value</code>만 넘깁니다.
                    </p>
                    <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-1 pl-5">
                        <li>
                            라벨은 <code className="font-mono">typo-title-l-bold</code>(20px Bold) 고정입니다 — 선택
                            여부와 무관합니다.
                        </li>
                        <li>
                            <strong className="font-medium">열 수와 반응형 분기는 화면이 정합니다.</strong> 그룹은 1단
                            grid만 갖고 있으므로, 2단이 필요한 화면에서 <code className="font-mono">className</code>에{' '}
                            <code className="font-mono">gap-4 xl:grid-cols-2</code>처럼 배치를 얹습니다. 아래 예시는
                            태블릿까지 1단으로 쌓고 데스크톱(xl)에서 2단이 됩니다.
                        </li>
                    </ul>
                </div>

                <GuideCase
                    title="기본 (뱃지 없음)"
                    description="라벨만 있는 기본 형태입니다. 선택하면 primary 테두리와 배경이 적용됩니다."
                    code={RADIO_BASIC_CODE}
                >
                    <RadioBasicDemo />
                </GuideCase>

                <GuideCase
                    title="뱃지"
                    description={
                        <>
                            항목의 성격을 알리는 뱃지를 라벨 왼쪽에 1개 또는 2개 붙입니다.{' '}
                            <code className="font-mono">badges</code> 슬롯으로 넘기며, 뱃지 텍스트도 라디오의 접근
                            가능한 이름에 포함됩니다.
                        </>
                    }
                    code={RADIO_BADGE_CODE}
                >
                    <RadioBadgeDemo />
                </GuideCase>

                <GuideCase
                    title="비활성 (disabled)"
                    description="상호작용을 막고 공통 disabled 토큰을 적용합니다. 선택된 항목도 primary 강조 대신 비활성 표시를 따르며 폼 제출에서 제외됩니다."
                    code={RADIO_DISABLED_CODE}
                >
                    <RadioDisabledDemo />
                </GuideCase>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sc-checkbox" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="sc-checkbox" className="typo-h4-bold">
                        control=&quot;checkbox&quot; — 독립 선택
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        확인 동의처럼 <strong className="font-medium">항목마다 따로</strong> 켜고 끄는 화면에 씁니다.
                        그룹으로 감싸지 않고 카드마다 <code className="font-mono">checked</code>와{' '}
                        <code className="font-mono">onCheckedChange</code>로 상태를 관리합니다.
                    </p>
                    <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-1 pl-5">
                        <li>
                            라벨은 <code className="font-mono">typo-body-xl-regular</code>(16px)이고 선택했을 때만
                            Bold로 강조됩니다 — 긴 동의 문장을 읽는 화면이라 본문 크기를 씁니다.
                        </li>
                        <li>
                            배치는 <code className="font-mono">flex flex-col gap-4</code> 세로 스택입니다.
                        </li>
                    </ul>
                </div>

                <GuideCase
                    title="기본 (체크전 · 체크후)"
                    description="첫 번째는 체크전, 두 번째는 체크후 상태입니다. 카드를 클릭하면 각각 독립적으로 토글됩니다."
                    code={CHECKBOX_BASIC_CODE}
                >
                    <CheckboxBasicDemo />
                </GuideCase>

                <GuideCase
                    title="뱃지"
                    description="checkbox 카드도 radio와 같은 badges 슬롯을 사용합니다. 항목마다 필수·선택이 갈리므로 뱃지로 구분합니다."
                    code={CHECKBOX_BADGE_CODE}
                >
                    <CheckboxBadgeDemo />
                </GuideCase>

                <GuideCase
                    title="비활성 (disabled)"
                    description="미선택·선택 두 경우 모두 공통 disabled 토큰으로 표시되고 폼 제출에서 제외됩니다."
                    code={CHECKBOX_DISABLED_CODE}
                >
                    <CheckboxDisabledDemo />
                </GuideCase>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sc-form" className="flex flex-col gap-4">
                <div>
                    <h2 id="sc-form" className="typo-h4-bold">
                        신청 Form 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        실제 신청 화면을 가정해 두 control을 함께 구성했습니다. 라디오는 그룹에{' '}
                        <code className="font-mono">name</code>, 각 항목에 <code className="font-mono">value</code>를
                        지정하고, 체크박스는 카드에 <code className="font-mono">name</code>과{' '}
                        <code className="font-mono">value</code>를 지정하면 선택값이 제출됩니다. 컴포넌트가 실제{' '}
                        <code className="font-mono">form</code> 안에 있어야 하며,{' '}
                        <code className="font-mono">disabled</code> 값은 제출에서 제외됩니다. 아래 버튼으로 실제{' '}
                        <code className="font-mono">FormData</code> 결과를 확인할 수 있습니다.
                    </p>
                </div>
                <SelectableCardFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
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
                                const componentRowSpan = PROPS.filter(
                                    (item) => item.component === prop.component,
                                ).length

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
        </BaseCard>
    </GuidePageShell>
)

export default SelectableCardGuidePage
