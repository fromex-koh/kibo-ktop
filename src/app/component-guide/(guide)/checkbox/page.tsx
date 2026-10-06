// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {cn} from '@/lib/utils'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {FIELD_FOCUS_RING} from '@/constants/form'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldContent, FieldDescription, FieldLabel} from '@/components/ui/field'
import CheckboxFormDemo from './checkbox-form-demo'
import CheckboxIndeterminateDemo from './checkbox-indeterminate-demo'

export const metadata: Metadata = {title: '체크박스 (Checkbox)'}

const USAGE_CODE = `import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldLabel} from '@/components/ui/field'
import {FIELD_FOCUS_RING} from '@/constants/form'

<Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
  <Checkbox id="terms" name="terms" value="agreed" />
  <FieldLabel htmlFor="terms">이용약관에 동의합니다</FieldLabel>
</Field>`

const DESCRIPTION_CODE = `<Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
  <Checkbox id="notice" aria-describedby="notice-description" />
  <FieldContent>
    <FieldLabel htmlFor="notice">알림 수신</FieldLabel>
    <FieldDescription id="notice-description">
      서비스 소식을 이메일로 받습니다.
    </FieldDescription>
  </FieldContent>
</Field>`

const FORM_CODE = `<form onSubmit={handleSubmit}>
  {interests.map((interest) => (
    <Field key={interest.value} orientation="horizontal">
      <Checkbox
        id={\`interest-\${interest.value}\`}
        name="interest"
        value={interest.value}
      />
      <FieldLabel htmlFor={\`interest-\${interest.value}\`}>
        {interest.label}
      </FieldLabel>
    </Field>
  ))}
</form>

const formData = new FormData(form)
formData.getAll('interest') // 선택된 값 배열`

const STATE_COLUMNS = [
    {key: 'state', header: '상태', align: 'start', rowHeader: true},
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'prop', header: '지정 방법', align: 'start', wrap: true},
] as const

// 표 칸 안의 미리보기 — Radix 가 Checkbox 옆에 두는 숨은 input 이 칸 밖으로 나가 표에 스크롤이 생기지 않게 기준 상자를 둔다.
const StatePreview = ({children}: {children: ReactNode}) => <span className="relative inline-flex">{children}</span>

const STATE_ROWS = [
    {
        key: 'unchecked',
        cells: [
            '미선택',
            <StatePreview key="preview">
                <Checkbox aria-label="미선택" />
            </StatePreview>,
            '기본',
        ],
    },
    {
        key: 'checked',
        cells: [
            '선택',
            <StatePreview key="preview">
                <Checkbox defaultChecked aria-label="선택" />
            </StatePreview>,
            <code key="prop">checked / defaultChecked</code>,
        ],
    },
    {
        key: 'indeterminate',
        cells: [
            '부분 선택',
            <StatePreview key="preview">
                <Checkbox defaultChecked="indeterminate" aria-label="부분 선택" />
            </StatePreview>,
            <code key="prop">checked=&quot;indeterminate&quot;</code>,
        ],
    },
    {
        key: 'disabled',
        cells: [
            '비활성',
            <StatePreview key="preview">
                <Checkbox disabled aria-label="비활성" />
            </StatePreview>,
            <code key="prop">disabled</code>,
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
        key: 'checkbox',
        cells: [
            '여러 개를 고르거나 단일 동의 여부를 받음',
            <code key="component">Checkbox</code>,
            '항목마다 독립적으로 켜고 끕니다.',
        ],
    },
    {
        key: 'radio',
        cells: [
            '여러 항목 중 하나만 고름',
            <Link key="component" href="/component-guide/radio" className={LINK_CLASS}>
                Radio
            </Link>,
            '같은 그룹에서 하나만 선택됩니다.',
        ],
    },
    {
        key: 'consent-list',
        cells: [
            '약관 · 동의 항목을 묶어 받음',
            <Link key="component" href="/component-guide/consent-list" className={LINK_CLASS}>
                ConsentList
            </Link>,
            '전체 동의와 항목별 동의를 한 묶음으로 제공합니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'Checkbox',
        'checked',
        '선택 상태입니다. 제어 방식에 씁니다. 부분 선택은 "indeterminate".',
        'undefined',
        'boolean | "indeterminate"',
    ],
    [
        'Checkbox',
        'onCheckedChange',
        '상태가 바뀔 때 호출됩니다.',
        'undefined',
        '(checked: boolean | "indeterminate") => void',
    ],
    ['Checkbox', 'defaultChecked', '비제어 초기 상태입니다.', 'false', 'boolean | "indeterminate"'],
    [
        'Checkbox',
        'name / value',
        '폼 필드 이름과 제출값입니다. 체크된 항목만 제출되며 value 기본값은 on 입니다.',
        'undefined',
        'string',
    ],
    ['Checkbox', 'required / form', '필수 여부와 연결할 form 입니다.', 'undefined', 'boolean / string'],
    ['Checkbox', 'disabled', '클릭 · 포커스가 막히고 폼 제출에서 빠집니다.', 'false', 'boolean'],
    [
        'Checkbox',
        'id / aria-describedby / aria-invalid / aria-labelledby',
        'FieldLabel, 설명 · 오류 메시지와 연결합니다.',
        'undefined',
        'HTML attributes',
    ],
    ['Checkbox', 'className', '체크박스에 덧붙일 클래스입니다.', 'undefined', 'string'],
] as const

const CheckboxGuidePage = () => (
    <GuidePageShell title="체크박스 (Checkbox)" description="여러 개를 고르거나 동의 여부를 받는 입력입니다.">
        <BaseCard>
            <section aria-labelledby="checkbox-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="checkbox-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>FieldLabel</code> 의 <code>htmlFor</code> 와 <code>Checkbox</code> 의 <code>id</code> 를
                        연결합니다. <code>Field</code> 에 <code>FIELD_FOCUS_RING</code> 을 주면 포커스 표시가 라벨까지
                        감쌉니다. 크기는 24px 고정이라 size prop 이 없습니다.
                    </p>
                </div>
                <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                    <Checkbox id="checkbox-terms" defaultChecked />
                    <FieldLabel htmlFor="checkbox-terms">이용약관에 동의합니다</FieldLabel>
                </Field>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="checkbox-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="checkbox-variants" className="typo-h4-bold">
                        상태와 조합
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        상태는 선택 · 부분 선택 · 비활성 세 가지입니다. 제어(<code>checked</code>)와 비제어(
                        <code>defaultChecked</code>) 모두 지원합니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">상태</h3>
                        <Table caption="Checkbox 상태 지정 방법" columns={STATE_COLUMNS} rows={STATE_ROWS} size="md" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">라벨과 설명</h3>
                        <p className="typo-body-l-regular text-label-foreground max-w-4xl">
                            설명이 있으면 <code>FieldContent</code> 안에 <code>FieldLabel</code> ·{' '}
                            <code>FieldDescription</code> 을 두고 <code>aria-describedby</code> 로 연결합니다.
                        </p>
                        <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                            <Checkbox id="checkbox-notice" aria-describedby="checkbox-notice-description" />
                            <FieldContent>
                                <FieldLabel htmlFor="checkbox-notice" className="text-foreground font-bold">
                                    알림 수신
                                </FieldLabel>
                                <FieldDescription id="checkbox-notice-description">
                                    서비스 소식을 이메일로 받습니다.
                                </FieldDescription>
                            </FieldContent>
                        </Field>
                        <CodeBlock code={DESCRIPTION_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">전체 선택</h3>
                        <p className="typo-body-l-regular text-label-foreground max-w-4xl">
                            하위 항목이 일부만 선택되면 요약 Checkbox 를 <code>indeterminate</code> 로 둡니다. 요약
                            Checkbox 에는 <code>name</code> 을 주지 않아 제출에는 하위 값만 포함됩니다.
                        </p>
                        <div className="border-foreground-subtle/30 bg-pastel-neutral/40 rounded-sm border p-5">
                            <CheckboxIndeterminateDemo />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">폼 제출과 오류</h3>
                        <p className="typo-body-l-regular text-label-foreground max-w-4xl">
                            체크된 항목의 <code>name</code> · <code>value</code> 만 제출됩니다. 같은 <code>name</code>{' '}
                            의 여러 값은 <code>FormData.getAll()</code> 로 읽습니다. 필수 동의 오류는 <code>Field</code>{' '}
                            의 <code>data-invalid</code>, <code>aria-invalid</code>, <code>FieldError</code> 로 알리고
                            첫 오류 항목으로 포커스를 옮깁니다.
                        </p>
                        <CheckboxFormDemo />
                        <CodeBlock code={FORM_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="checkbox-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="checkbox-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        하나만 고르는지, 여러 개를 고르는지, 동의 묶음인지로 구분합니다.
                    </p>
                </div>
                <Table
                    caption="Checkbox · Radio · ConsentList 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="checkbox-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="checkbox-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        체크박스 역할과 상태(<code>aria-checked</code>)는 Radix 가 처리합니다. 사용처는 라벨과 오류
                        연결을 책임집니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        모든 Checkbox 에 <code>FieldLabel htmlFor</code> 를 연결합니다[7.4.1]. 라벨 클릭으로도
                        토글됩니다.
                    </li>
                    <li>
                        오류는 <code>aria-invalid</code> + <code>aria-describedby</code> + <code>FieldError</code> 로
                        알립니다[7.4.2]. 필수 표시 <code>*</code> 는 <code>sr-only</code> &quot;(필수)&quot; 를 함께
                        둡니다[5.3.1].
                    </li>
                    <li>
                        <kbd>Tab</kbd> 으로 이동하고 <kbd>Space</kbd> 로 토글합니다[6.1.1].
                    </li>
                    <li>
                        포커스는 외곽선으로 표시되고 horizontal <code>Field</code> 에서는 라벨까지 감쌉니다[6.1.2].
                    </li>
                    <li>체크박스 주변에 눌리는 영역을 넓혀 두어 인접 항목과 겹치지 않게 간격을 둡니다[6.1.3].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="checkbox-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="checkbox-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        그 외 속성은 Radix Checkbox 와 같습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Checkbox Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default CheckboxGuidePage
