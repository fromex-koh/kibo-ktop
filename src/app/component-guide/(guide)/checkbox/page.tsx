import type {Metadata} from 'next'
import {cn} from '@/lib/utils'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldContent, FieldDescription, FieldLabel} from '@/components/ui/field'
import CheckboxFormDemo from './checkbox-form-demo'
import CheckboxIndeterminateDemo from './checkbox-indeterminate-demo'

export const metadata: Metadata = {title: '체크박스 (Checkbox)'}

const USAGE_CODE = `<Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
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

const API_COLUMNS = [
    {key: 'prop', header: 'Prop', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start', wrap: true},
    {key: 'default', header: '기본값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const API_ROWS = [
    {
        key: 'checked',
        cells: [
            <code key="p">checked / onCheckedChange</code>,
            <code key="t">boolean | indeterminate</code>,
            '—',
            '제어 선택 상태',
        ],
    },
    {
        key: 'default',
        cells: [
            <code key="p">defaultChecked</code>,
            <code key="t">boolean | indeterminate</code>,
            <code key="d">false</code>,
            '비제어 초기 상태',
        ],
    },
    {
        key: 'form',
        cells: [
            <code key="p">name / value / required / form</code>,
            <code key="t">form attributes</code>,
            '—',
            '폼 제출 설정',
        ],
    },
    {
        key: 'disabled',
        cells: [
            <code key="p">disabled</code>,
            <code key="t">boolean</code>,
            <code key="d">false</code>,
            '상호작용과 제출 비활성',
        ],
    },
    {
        key: 'a11y',
        cells: [
            <code key="p">id / aria-describedby / aria-invalid</code>,
            <code key="t">HTML attributes</code>,
            '—',
            '라벨·설명·오류 연결',
        ],
    },
] as const

const CheckboxGuidePage = () => (
    <GuidePageShell
        title="체크박스 (Checkbox)"
        description="복수 선택이나 사용자의 동의 여부를 입력받습니다. 전체 선택 요약에는 indeterminate 상태를 사용합니다."
    >
        <BaseCard variant="outlined">
            <section aria-labelledby="checkbox-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="checkbox-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        FieldLabel의 htmlFor와 Checkbox의 id를 연결합니다. 컨트롤은 24px 고정이며 포커스링은 라벨과
                        Checkbox를 함께 감쌉니다.
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
            <section aria-labelledby="checkbox-description" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="checkbox-description" className="typo-h4-bold">
                        라벨과 설명
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        설명이 필요하면 FieldContent 안에 FieldLabel과 FieldDescription을 두고 aria-describedby로
                        연결합니다.
                    </p>
                </div>
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="checkbox-state" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="checkbox-state" className="typo-h4-bold">
                        상태와 전체 선택
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        checked는 선택, indeterminate는 하위 항목 일부 선택을 나타냅니다. 요약 Checkbox에는 name을
                        지정하지 않습니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-8">
                    <Checkbox aria-label="미선택" />
                    <Checkbox defaultChecked aria-label="선택" />
                    <Checkbox defaultChecked="indeterminate" aria-label="부분 선택" />
                    <Checkbox disabled aria-label="비활성" />
                </div>
                <div className="border-border rounded-md border p-6">
                    <CheckboxIndeterminateDemo />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="checkbox-form" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="checkbox-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        체크된 name과 value만 제출됩니다. 같은 name의 복수 값은 FormData.getAll()로 읽습니다.
                    </p>
                </div>
                <CheckboxFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="폼 제출 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="checkbox-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="checkbox-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">Checkbox에서 사용하는 주요 속성입니다.</p>
                </div>
                <Table caption="Checkbox Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default CheckboxGuidePage
