// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {cn} from '@/lib/utils'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {FIELD_FOCUS_RING} from '@/constants/form'
import {Field, FieldContent, FieldDescription, FieldLabel} from '@/components/ui/field'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import RadioFormDemo from './radio-form-demo'

export const metadata: Metadata = {title: '라디오 (Radio)'}

const USAGE_CODE = `import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'

<RadioGroup name="payment" defaultValue="card" aria-label="결제 수단">
  <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
    <RadioGroupItem id="payment-card" value="card" />
    <FieldLabel htmlFor="payment-card">신용카드</FieldLabel>
  </Field>
  <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
    <RadioGroupItem id="payment-transfer" value="transfer" />
    <FieldLabel htmlFor="payment-transfer">계좌이체</FieldLabel>
  </Field>
</RadioGroup>`

const FORM_CODE = `<form onSubmit={handleSubmit}>
  <FieldSet data-invalid={error || undefined}>
    <FieldLegend id="payment-label">결제 수단</FieldLegend>
    <RadioGroup
      name="paymentMethod"
      value={value}
      onValueChange={setValue}
      required
      aria-labelledby="payment-label"
      aria-invalid={error || undefined}
      aria-describedby={error ? 'payment-error' : undefined}
    >
      <RadioGroupItem id="payment-card" value="card" />
      <FieldLabel htmlFor="payment-card">신용카드</FieldLabel>
      <RadioGroupItem id="payment-transfer" value="transfer" />
      <FieldLabel htmlFor="payment-transfer">계좌이체</FieldLabel>
    </RadioGroup>
    {error ? <FieldError id="payment-error">결제 수단을 선택해 주세요.</FieldError> : null}
  </FieldSet>
</form>

new FormData(form).get('paymentMethod') // 선택된 value 하나`

const DESCRIPTION_CODE = `<RadioGroup defaultValue="email" aria-label="영수증 수신 방법">
  <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
    <RadioGroupItem
      id="receipt-email"
      value="email"
      aria-describedby="receipt-email-description"
    />
    <FieldContent>
      <FieldLabel htmlFor="receipt-email">이메일</FieldLabel>
      <FieldDescription id="receipt-email-description">
        등록된 이메일로 영수증을 전송합니다.
      </FieldDescription>
    </FieldContent>
  </Field>

  <Field orientation="horizontal" data-disabled="true">
    <RadioGroupItem id="receipt-fax" value="fax" disabled />
    <FieldLabel htmlFor="receipt-fax">팩스 수신 불가</FieldLabel>
  </Field>
</RadioGroup>`

const API_COLUMNS = [
    {key: 'scope', header: '대상', align: 'start', rowHeader: true},
    {key: 'prop', header: 'Prop', align: 'start'},
    {key: 'type', header: '값', align: 'start', wrap: true},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const API_ROWS = [
    {
        key: 'value',
        cells: [
            'RadioGroup',
            <code key="p">value / defaultValue / onValueChange</code>,
            <code key="t">string / callback</code>,
            '선택값(제어 · 비제어).',
        ],
    },
    {
        key: 'form',
        cells: [
            'RadioGroup',
            <code key="p">name / required / form</code>,
            <code key="t">form attributes</code>,
            '필드 이름 · 필수 · 연결할 form.',
        ],
    },
    {
        key: 'group-a11y',
        cells: [
            'RadioGroup',
            <code key="p">aria-label / aria-labelledby / aria-invalid / aria-describedby</code>,
            <code key="t">HTML attributes</code>,
            '그룹 이름 · 오류 상태 · 메시지 연결.',
        ],
    },
    {
        key: 'disabled',
        cells: ['RadioGroup', <code key="p">disabled</code>, <code key="t">boolean</code>, '그룹 전체를 비활성으로.'],
    },
    {
        key: 'item',
        cells: [
            'RadioGroupItem',
            <code key="p">value / disabled</code>,
            <code key="t">string / boolean</code>,
            '항목의 값 · 그 항목만 비활성.',
        ],
    },
    {
        key: 'a11y',
        cells: [
            'RadioGroupItem',
            <code key="p">id / aria-describedby</code>,
            <code key="t">HTML attributes</code>,
            'FieldLabel, 설명과 연결.',
        ],
    },
] as const

const RadioGuidePage = () => (
    <GuidePageShell
        title="라디오 (Radio)"
        description="여러 선택지 중 하나만 고르는 입력입니다. 선택을 취소하거나 여러 개를 골라야 하면 Checkbox 를 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="radio-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        선택값은 <code>RadioGroup</code> 이 갖고, 각 <code>RadioGroupItem</code> 에는 고유한{' '}
                        <code>value</code> 와 <code>id</code> 를 줍니다. 그룹에는 <code>aria-label</code> 또는{' '}
                        <code>aria-labelledby</code> 로 이름을 붙입니다. 크기는 24px 고정입니다.
                    </p>
                    <p className="typo-body-l-regular text-label-foreground">
                        카드 · 칩 모양의 단일 선택은{' '}
                        <Link href="/component-guide/radio-card" className="text-primary-strong underline">
                            RadioCard
                        </Link>{' '}
                        ·{' '}
                        <Link href="/component-guide/radio-chip" className="text-primary-strong underline">
                            RadioChip
                        </Link>
                        을 씁니다.
                    </p>
                </div>
                <RadioGroup defaultValue="card" aria-label="결제 수단" className="flex flex-col gap-3">
                    <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                        <RadioGroupItem value="card" id="radio-card" />
                        <FieldLabel htmlFor="radio-card">신용카드</FieldLabel>
                    </Field>
                    <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                        <RadioGroupItem value="transfer" id="radio-transfer" />
                        <FieldLabel htmlFor="radio-transfer">계좌이체</FieldLabel>
                    </Field>
                </RadioGroup>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-description" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-description" className="typo-h4-bold">
                        설명과 비활성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        설명이 있으면 <code>FieldContent</code> 안에 FieldLabel · FieldDescription 을 두고{' '}
                        <code>aria-describedby</code>로 연결합니다. <code>disabled</code>는 항목 하나에도, 그룹 전체에도
                        줄 수 있습니다.
                    </p>
                </div>
                <RadioGroup defaultValue="email" aria-label="영수증 수신 방법" className="flex flex-col gap-4">
                    <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                        <RadioGroupItem value="email" id="radio-email" aria-describedby="radio-email-description" />
                        <FieldContent>
                            <FieldLabel htmlFor="radio-email" className="text-foreground font-bold">
                                이메일
                            </FieldLabel>
                            <FieldDescription id="radio-email-description">
                                등록된 이메일로 영수증을 전송합니다.
                            </FieldDescription>
                        </FieldContent>
                    </Field>
                    <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)} data-disabled="true">
                        <RadioGroupItem value="fax" id="radio-fax" disabled />
                        <FieldLabel htmlFor="radio-fax">팩스 수신 불가</FieldLabel>
                    </Field>
                </RadioGroup>
                <CodeBlock code={DESCRIPTION_CODE} language="tsx" copyLabel="라벨과 상태 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-form" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        RadioGroup 에 <code>name</code>을 주면 선택된 <code>value</code> 하나가 제출됩니다. 오류는
                        FieldSet 에 <code>data-invalid</code>를 주고, 메시지를 <code>aria-describedby</code>로
                        연결합니다.
                    </p>
                </div>
                <RadioFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="폼 제출 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        Radix 가 <code>role=&quot;radiogroup&quot;</code> · <code>radio</code> 와{' '}
                        <code>aria-checked</code> 를 제공합니다. 그룹 이름은 <code>aria-label</code> 또는{' '}
                        <code>FieldLegend</code> + <code>aria-labelledby</code> 로 붙입니다[7.4.1, 8.2.1].
                    </li>
                    <li>
                        <kbd>Tab</kbd> 은 그룹에 한 번 들어가고, <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> 로
                        항목을 옮기며 선택합니다[6.1.1]. 포커스는 <code>focus-visible</code> 외곽선, 가로 배치는{' '}
                        <code>FIELD_FOCUS_RING</code> 으로 라벨까지 감쌉니다[6.1.2].
                    </li>
                    <li>
                        오류는 그룹의 <code>aria-invalid</code> + <code>aria-describedby</code> 로{' '}
                        <code>FieldError</code> 와 잇습니다[7.4.2]. 선택은 색 외에 안쪽 점으로도 구분됩니다[5.3.1].
                    </li>
                    <li>인접 항목은 간격을 두어 눌리는 영역이 겹치지 않게 합니다[6.1.3].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        대상 열로 그룹과 항목을 구분합니다. Radix RadioGroup 속성을 그대로 받고 size prop 은 없습니다.
                    </p>
                </div>
                <Table caption="Radio Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RadioGuidePage
