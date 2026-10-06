// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import type {ReactNode} from 'react'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
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

const USAGE_CODE = `import {SelectableCard, SelectableCardGroup} from '@/components/composite/selectable-card'

{/* 단일 선택 — 그룹 안에서 하나만 */}
<SelectableCardGroup name="agreement" aria-label="동의 범위" defaultValue="required">
  <SelectableCard control="radio" value="required">필수항목만 동의</SelectableCard>
  <SelectableCard control="radio" value="all">전체 항목 동의</SelectableCard>
</SelectableCardGroup>

{/* 독립 선택 — 카드마다 따로 (control 기본값) */}
<SelectableCard checked={agreed} onCheckedChange={setAgreed}>내용을 확인하였습니다.</SelectableCard>`

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

  <Button type="submit" variant="default" size="sm">신청 내용 확인</Button>
</form>`

const PROPS_ITEMS = [
    ['SelectableCardGroup', 'name', '폼 제출 시 필드 이름.', 'undefined', 'string'],
    ['SelectableCardGroup', 'aria-label · aria-labelledby', '그룹의 이름. 둘 중 하나를 줍니다.', '—', 'string'],
    [
        'SelectableCardGroup',
        'value · onValueChange',
        '선택값을 바깥에서 관리할 때 씁니다.',
        'undefined',
        'string · (value: string) => void',
    ],
    ['SelectableCardGroup', 'defaultValue', '초기 선택값(비제어).', 'undefined', 'string'],
    ['SelectableCardGroup', 'required', '필수 선택 여부.', 'false', 'boolean'],
    [
        'SelectableCardGroup',
        'disabled',
        '그룹 안의 카드를 모두 비활성으로 둡니다(Radix RadioGroup 속성).',
        'false',
        'boolean',
    ],
    ['SelectableCardGroup', 'form', '연결할 form 의 id.', 'undefined', 'string'],
    ['SelectableCardGroup', 'className', '열 수 · 간격 등 배치. 기본은 1단 grid 입니다.', 'undefined', 'string'],
    [
        'SelectableCard',
        'control',
        '선택 방식. radio 는 SelectableCardGroup 안에서만 씁니다.',
        "'checkbox'",
        "'radio' | 'checkbox'",
    ],
    ['SelectableCard', 'children', '카드의 라벨.', '—', 'ReactNode'],
    ['SelectableCard', 'value', 'radio 는 필수이며 항목을 구분하는 값. checkbox 는 폼 제출값입니다.', '—', 'string'],
    [
        'SelectableCard',
        'checked · onCheckedChange',
        'checkbox 의 선택 상태를 바깥에서 관리할 때 씁니다.',
        'undefined',
        'boolean · (checked: boolean) => void',
    ],
    ['SelectableCard', 'defaultChecked', 'checkbox 의 초기 선택 상태(비제어).', 'undefined', 'boolean'],
    ['SelectableCard', 'name', 'checkbox 의 폼 제출 필드 이름.', 'undefined', 'string'],
    [
        'SelectableCard',
        'required · form',
        'checkbox 의 필수 여부 · 연결할 form 의 id.',
        'undefined',
        'boolean · string',
    ],
    ['SelectableCard', 'disabled', '선택할 수 없고 폼 제출에서 빠집니다.', 'undefined', 'boolean'],
    ['SelectableCard', 'badges', '카드 오른쪽 끝에 놓을 Badge. 여러 개면 나란히 나열됩니다.', 'undefined', 'ReactNode'],
    [
        'SelectableCard',
        'onClick',
        '카드를 누를 때마다 호출됩니다. 이미 선택된 카드를 다시 눌러도 호출됩니다.',
        'undefined',
        '() => void',
    ],
    ['SelectableCard', 'id', '내부 컨트롤의 id. 생략하면 자동으로 만들어집니다.', '자동 생성', 'string'],
    ['SelectableCard', 'labelClassName', '라벨에 덧붙일 클래스.', 'undefined', 'string'],
    ['SelectableCard', 'className', '카드에 덧붙일 클래스.', 'undefined', 'string'],
] as const

// control 별 차이 — 어느 쪽을 쓸지와 넘길 값을 먼저 보여 준다.
const CONTROL_COLUMNS = [
    {key: 'control', header: 'control', align: 'start', rowHeader: true},
    {key: 'use', header: '쓰는 곳', align: 'start', wrap: true},
    {key: 'state', header: '선택 상태', align: 'start', wrap: true},
    {key: 'label', header: '라벨', align: 'start', wrap: true},
] as const

const CONTROL_ROWS = [
    {
        key: 'radio',
        cells: [
            <code key="control">radio</code>,
            '여러 카드 중 하나만 고름',
            <span key="state">
                <code>SelectableCardGroup</code> 의 <code>value</code> · <code>onValueChange</code>
            </span>,
            <code key="label">typo-title-l-bold</code>,
        ],
    },
    {
        key: 'checkbox',
        cells: [
            <span key="control">
                <code>checkbox</code> (기본값)
            </span>,
            '카드마다 따로 켜고 끔',
            <span key="state">
                카드의 <code>checked</code> · <code>onCheckedChange</code>
            </span>,
            <span key="label">
                <code>typo-body-xl-regular</code>, 선택하면 Bold
            </span>,
        ],
    },
] as const

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'selectable-card',
        cells: [
            '한 줄 라벨(+ 배지)을 카드째 눌러 선택',
            <code key="component">SelectableCard</code>,
            '동의 범위, 확인 동의처럼 문장 하나가 선택지입니다. 컨트롤 표시(동그라미·체크)가 있습니다.',
        ],
    },
    {
        key: 'info-card',
        cells: [
            '이름·값 여러 줄을 담은 카드 중 하나 선택',
            <Link key="component" href="/component-guide/selectable-info-card" className={LINK_CLASS}>
                SelectableInfoCard
            </Link>,
            '검색된 기업·특허처럼 정보 카드입니다. 컨트롤 표시 없이 테두리로 선택을 보입니다.',
        ],
    },
    {
        key: 'radio-card',
        cells: [
            '일러스트·부가 정보가 있는 큰 선택지',
            <span key="component">
                <Link href="/component-guide/radio-card" className={LINK_CLASS}>
                    RadioCard
                </Link>
                {' · '}
                <Link href="/component-guide/option-card" className={LINK_CLASS}>
                    OptionCard
                </Link>
            </span>,
            '라벨 한 줄보다 많은 내용을 담을 때 씁니다.',
        ],
    },
    {
        key: 'chip',
        cells: [
            '짧은 값을 작게 고름',
            <span key="component">
                <Link href="/component-guide/chip" className={LINK_CLASS}>
                    Chip
                </Link>
                {' · '}
                <Link href="/component-guide/radio-chip" className={LINK_CLASS}>
                    RadioChip
                </Link>
            </span>,
            '카드보다 작은 칩 모양입니다.',
        ],
    },
    {
        key: 'radio-checkbox',
        cells: [
            '카드 모양이 필요 없는 일반 폼 항목',
            <span key="component">
                <Link href="/component-guide/radio" className={LINK_CLASS}>
                    Radio
                </Link>
                {' · '}
                <Link href="/component-guide/checkbox" className={LINK_CLASS}>
                    Checkbox
                </Link>
            </span>,
            '기본 컨트롤입니다.',
        ],
    },
] as const

// 소제목 블록 — 설명 · 미리보기 · 코드를 한 묶음으로 둔다.
type GuideCaseProps = {title: string; description: ReactNode; code: string; children: ReactNode}

const GuideCase = ({title, description, code, children}: GuideCaseProps) => (
    <div className="flex flex-col gap-4 py-8 last:pb-0">
        <h3 className="typo-title-m-bold text-foreground">{title}</h3>
        <p className="typo-body-l-regular text-label-foreground">{description}</p>
        {children}
        <CodeBlock code={code} language="tsx" copyLabel="복사" />
    </div>
)

const SelectableCardGuidePage = () => (
    <GuidePageShell
        title="선택 카드 (SelectableCard)"
        description="카드 전체를 눌러 선택하는 컨트롤입니다. control 로 단일 선택(radio)과 독립 선택(checkbox)을 정합니다."
    >
        <BaseCard>
            <section aria-labelledby="sc-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sc-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        라벨은 children, 오른쪽 끝 뱃지는 <code>badges</code> 로 넘깁니다. 카드의 빈 영역을 누르면
                        컨트롤이 눌리고, 카드 안의 링크 · 버튼은 자체 동작만 합니다. 라디오와 체크박스는{' '}
                        <code>control</code> 로 고릅니다.
                    </p>
                </div>
                <Table caption="control 별 사용 기준" columns={CONTROL_COLUMNS} rows={CONTROL_ROWS} size="md" />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sc-radio" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sc-radio" className="typo-h4-bold">
                        단일 선택 (radio)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        반드시 <code>SelectableCardGroup</code> 으로 감싸고 카드에는 <code>value</code> 를 넘깁니다. 열
                        수와 간격은 그룹 <code>className</code> 에 줍니다(예: <code>gap-4 xl:grid-cols-2</code>).
                    </p>
                </div>

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <GuideCase
                        title="기본"
                        description={
                            <>
                                선택값은 <code>value</code> · <code>onValueChange</code>(제어) 또는{' '}
                                <code>defaultValue</code>(비제어)로 관리합니다.
                            </>
                        }
                        code={RADIO_BASIC_CODE}
                    >
                        <RadioBasicDemo />
                    </GuideCase>

                    <GuideCase
                        title="뱃지"
                        description={
                            <>
                                <code>badges</code> 에 Badge 를 하나 또는 여러 개 넘깁니다.
                            </>
                        }
                        code={RADIO_BADGE_CODE}
                    >
                        <RadioBadgeDemo />
                    </GuideCase>

                    <GuideCase
                        title="비활성"
                        description={
                            <>
                                <code>disabled</code> 카드는 선택할 수 없고 폼 제출에서 빠집니다.
                            </>
                        }
                        code={RADIO_DISABLED_CODE}
                    >
                        <RadioDisabledDemo />
                    </GuideCase>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sc-checkbox" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sc-checkbox" className="typo-h4-bold">
                        독립 선택 (checkbox)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        그룹으로 감싸지 않고 카드마다 상태를 관리합니다. 여러 장은 <code>flex flex-col gap-4</code> 로
                        쌓습니다.
                    </p>
                </div>

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <GuideCase
                        title="기본"
                        description={
                            <>
                                <code>checked</code> · <code>onCheckedChange</code>(제어) 또는{' '}
                                <code>defaultChecked</code>(비제어)로 관리합니다.
                            </>
                        }
                        code={CHECKBOX_BASIC_CODE}
                    >
                        <CheckboxBasicDemo />
                    </GuideCase>

                    <GuideCase
                        title="뱃지"
                        description="radio 카드와 같은 <code>badges</code> 를 씁니다."
                        code={CHECKBOX_BADGE_CODE}
                    >
                        <CheckboxBadgeDemo />
                    </GuideCase>

                    <GuideCase
                        title="비활성"
                        description={
                            <>
                                <code>disabled</code> 카드는 선택할 수 없고 폼 제출에서 빠집니다.
                            </>
                        }
                        code={CHECKBOX_DISABLED_CODE}
                    >
                        <CheckboxDisabledDemo />
                    </GuideCase>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sc-form" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sc-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        radio 는 그룹에 <code>name</code>, 카드에 <code>value</code> 를 줍니다. checkbox 는 카드에{' '}
                        <code>name</code> 과 <code>value</code> 를 줍니다.
                    </p>
                </div>
                <SelectableCardFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sc-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sc-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">선택 컴포넌트는 담는 내용으로 고릅니다.</p>
                </div>
                <Table caption="선택 컴포넌트 사용 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sc-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sc-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        라벨과 뱃지 글자는 <code>aria-labelledby</code> 로 컨트롤의 이름에 연결되므로 따로 넣지
                        않습니다[7.4.1].
                    </li>
                    <li>선택 상태는 테두리 · 배경과 함께 컨트롤 표시로도 전달합니다[5.3.1].</li>
                    <li>카드 어디에 포커스가 가도 카드 외곽선이 표시됩니다[6.1.2].</li>
                    <li>
                        <code className="text-foreground font-mono">SelectableCardGroup</code> 에는{' '}
                        <code className="text-foreground font-mono">aria-label</code> 또는{' '}
                        <code className="text-foreground font-mono">aria-labelledby</code> 로 그룹 이름을 줍니다[7.4.1].
                    </li>
                    <li>
                        checkbox 카드를 여러 장 묶을 때는 <code className="text-foreground font-mono">fieldset</code> ·{' '}
                        <code className="text-foreground font-mono">legend</code> 로 묶음 이름을 줍니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sc-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sc-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SelectableCard Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SelectableCardGuidePage
