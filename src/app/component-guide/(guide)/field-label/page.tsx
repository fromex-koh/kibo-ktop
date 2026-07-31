import type {Metadata} from 'next'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldDescription, FieldError, FieldLabel} from '@/components/ui/field'
import {Input} from '@/components/ui/input'

export const metadata: Metadata = {title: '필드 라벨 (FieldLabel)'}

const BASIC_CODE = `<Field className="max-w-90">
  <FieldLabel htmlFor="company-name" className="font-bold text-foreground">
    기업명
  </FieldLabel>
  <Input
    id="company-name"
    name="companyName"
    placeholder="기업명을 입력하세요"
    aria-describedby="company-name-description"
  />
  <FieldDescription id="company-name-description">
    사업자등록증에 표시된 기업명을 입력해 주세요.
  </FieldDescription>
</Field>`

const HORIZONTAL_CODE = `<Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
  <Checkbox id="terms" name="terms" aria-labelledby="terms-label" />
  <FieldLabel id="terms-label" htmlFor="terms">
    이용약관에 동의합니다
  </FieldLabel>
</Field>`

const INVALID_CODE = `<Field data-invalid className="max-w-90">
  <FieldLabel htmlFor="manager-name" className="gap-1 font-bold text-foreground">
    담당자명
    <span aria-hidden="true" className="text-error-500">*</span>
    <span className="sr-only"> (필수)</span>
  </FieldLabel>
  <Input
    id="manager-name"
    name="managerName"
    required
    aria-invalid="true"
    aria-describedby="manager-name-error"
    placeholder="담당자명을 입력하세요"
  />
  <FieldError id="manager-name-error">담당자명을 입력해 주세요.</FieldError>
</Field>`

const DISABLED_CODE = `<Field data-disabled="true" className="max-w-90">
  <FieldLabel htmlFor="reception-agency" className="font-bold text-foreground">
    접수 기관
  </FieldLabel>
  <Input
    id="reception-agency"
    name="receptionAgency"
    value="기술보증기금"
    disabled
    readOnly
  />
</Field>`

const LAYOUT_COLUMNS = [
    {key: 'control', header: '컨트롤', align: 'start', rowHeader: true},
    {key: 'orientation', header: 'Field 배치', align: 'start'},
    {key: 'focus', header: '포커스링', align: 'start', wrap: true},
] as const

const LAYOUT_ROWS = [
    {
        key: 'text-field',
        cells: [
            'Input · Select · Combobox · Textarea',
            <code key="orientation">vertical (기본)</code>,
            '라벨을 제외한 실제 입력 영역에만 표시합니다.',
        ],
    },
    {
        key: 'choice',
        cells: [
            'Checkbox · Radio · Switch',
            <code key="orientation">horizontal</code>,
            'FIELD_FOCUS_RING으로 컨트롤과 라벨 전체를 감쌉니다.',
        ],
    },
] as const

const API_COLUMNS = [
    {key: 'prop', header: 'Prop', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const API_ROWS = [
    {
        key: 'htmlFor',
        cells: [
            <code key="prop">htmlFor</code>,
            <code key="type">string</code>,
            '연결할 컨트롤의 id입니다. 라벨 클릭과 접근 가능한 이름을 연결합니다.',
        ],
    },
    {
        key: 'children',
        cells: [
            <code key="prop">children</code>,
            <code key="type">ReactNode</code>,
            '라벨 문구와 필수 표시 등 인라인 콘텐츠입니다.',
        ],
    },
    {
        key: 'className',
        cells: [
            <code key="prop">className</code>,
            <code key="type">string</code>,
            '입력 필드 제목의 강조 스타일이나 간격을 확장합니다.',
        ],
    },
] as const

const FieldLabelGuidePage = () => (
    <GuidePageShell
        title="필드 라벨 (FieldLabel)"
        description="Field 안에서 컨트롤의 라벨을 설명·오류·비활성 상태와 함께 구성하는 Label 확장 컴포넌트입니다."
    >
        <BaseCard variant="outlined">
            <section aria-labelledby="field-label-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="field-label-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code>FieldLabel</code>의 <code>htmlFor</code>와 컨트롤의 <code>id</code>를 연결합니다. 설명은
                        컨트롤의 <code>aria-describedby</code>로 함께 연결합니다.
                    </p>
                </div>
                <Field className="max-w-90">
                    <FieldLabel htmlFor="field-label-company" className="text-foreground font-bold">
                        기업명
                    </FieldLabel>
                    <Input
                        id="field-label-company"
                        name="companyName"
                        placeholder="기업명을 입력하세요"
                        aria-describedby="field-label-company-description"
                    />
                    <FieldDescription id="field-label-company-description">
                        사업자등록증에 표시된 기업명을 입력해 주세요.
                    </FieldDescription>
                </Field>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="field-label-layout" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="field-label-layout" className="typo-h4-bold">
                        배치와 포커스
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        컨트롤 유형에 따라 Field 배치와 포커스링 범위를 선택합니다.
                    </p>
                </div>
                <Table
                    caption="컨트롤 유형별 Field 배치와 포커스링"
                    columns={LAYOUT_COLUMNS}
                    rows={LAYOUT_ROWS}
                    size="md"
                />
                <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                    <Checkbox
                        id="field-label-terms"
                        name="terms"
                        defaultChecked
                        aria-labelledby="field-label-terms-label"
                    />
                    <FieldLabel id="field-label-terms-label" htmlFor="field-label-terms">
                        이용약관에 동의합니다
                    </FieldLabel>
                </Field>
                <CodeBlock code={HORIZONTAL_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="field-label-state" className="flex flex-col gap-8">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="field-label-state" className="typo-h4-bold">
                        오류와 비활성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Field와 실제 컨트롤에 상태를 함께 지정해야 시각 표현과 접근성 정보가 일치합니다.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="typo-body-xl-bold">오류</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Field에 <code>data-invalid</code>, 컨트롤에 <code>aria-invalid</code>를 지정하고 오류 메시지는{' '}
                        <code>aria-describedby</code>로 연결합니다.
                    </p>
                    <Field data-invalid className="max-w-90">
                        <FieldLabel htmlFor="field-label-manager" className="text-foreground gap-1 font-bold">
                            담당자명
                            <span aria-hidden="true" className="text-error-500">
                                *
                            </span>
                            <span className="sr-only"> (필수)</span>
                        </FieldLabel>
                        <Input
                            id="field-label-manager"
                            name="managerName"
                            required
                            aria-invalid="true"
                            aria-describedby="field-label-manager-error"
                            placeholder="담당자명을 입력하세요"
                        />
                        <FieldError id="field-label-manager-error">담당자명을 입력해 주세요.</FieldError>
                    </Field>
                    <CodeBlock code={INVALID_CODE} language="tsx" copyLabel="복사" />
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="typo-body-xl-bold">비활성</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Field에 <code>data-disabled</code>, 컨트롤에 <code>disabled</code>를 지정합니다.
                    </p>
                    <Field data-disabled="true" className="max-w-90">
                        <FieldLabel htmlFor="field-label-disabled" className="text-foreground font-bold">
                            접수 기관
                        </FieldLabel>
                        <Input
                            id="field-label-disabled"
                            name="receptionAgency"
                            value="기술보증기금"
                            disabled
                            readOnly
                        />
                    </Field>
                    <CodeBlock code={DISABLED_CODE} language="tsx" copyLabel="복사" />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="field-label-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="field-label-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        FieldLabel은 Label props를 그대로 지원하며 Field 상태 스타일을 추가합니다.
                    </p>
                </div>
                <Table caption="FieldLabel Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FieldLabelGuidePage
