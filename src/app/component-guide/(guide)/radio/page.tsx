import type {Metadata} from 'next'
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

const USAGE_CODE = `<RadioGroup name="payment" defaultValue="card" aria-label="결제 수단">
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
            '그룹 선택값',
        ],
    },
    {
        key: 'form',
        cells: [
            'RadioGroup',
            <code key="p">name / required / form</code>,
            <code key="t">form attributes</code>,
            '폼 제출 설정',
        ],
    },
    {
        key: 'disabled',
        cells: ['RadioGroup', <code key="p">disabled</code>, <code key="t">boolean</code>, '그룹 전체 비활성'],
    },
    {
        key: 'item',
        cells: [
            'RadioGroupItem',
            <code key="p">value / disabled</code>,
            <code key="t">string / boolean</code>,
            '항목 값과 개별 비활성',
        ],
    },
    {
        key: 'a11y',
        cells: [
            'RadioGroupItem',
            <code key="p">id / aria-describedby</code>,
            <code key="t">HTML attributes</code>,
            '라벨·설명 연결',
        ],
    },
] as const

const RadioGuidePage = () => (
    <GuidePageShell
        title="라디오 (Radio)"
        description="서로 배타적인 선택지 중 하나를 고를 때 사용합니다. 선택 취소가 필요하거나 복수 선택이면 Checkbox를 사용합니다."
    >
        <BaseCard variant="outlined">
            <section aria-labelledby="radio-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        RadioGroup에 선택값을 관리하고 각 RadioGroupItem에는 고유한 value와 id를 지정합니다. 컨트롤은
                        24px 고정입니다.
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
                        라벨과 상태
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        설명은 FieldContent와 FieldDescription으로 구성하고 aria-describedby로 연결합니다. disabled는
                        개별 항목이나 그룹에 지정할 수 있습니다.
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
                    <p className="typo-body-l-regular text-muted-foreground">
                        RadioGroup에 name을 지정하면 선택된 항목의 value 하나가 제출됩니다. 그룹 오류는 FieldSet에
                        표시하고 FieldError를 aria-describedby로 연결합니다.
                    </p>
                </div>
                <RadioFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="폼 제출 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="radio-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="radio-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        그룹과 항목에 지정하는 주요 속성을 구분합니다.
                    </p>
                </div>
                <Table caption="Radio Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RadioGuidePage
