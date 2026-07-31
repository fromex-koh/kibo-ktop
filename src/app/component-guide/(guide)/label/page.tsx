import type {Metadata} from 'next'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldLabel} from '@/components/ui/field'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

export const metadata: Metadata = {title: '라벨 (Label)'}

const BASIC_CODE = `import {Label} from '@/components/ui/label'

<div className="flex max-w-90 flex-col gap-2">
  <Label htmlFor="email" className="font-bold text-foreground">
    이메일
  </Label>
  <Input id="email" name="email" type="email" placeholder="이메일을 입력하세요" />
</div>`

const CHECKBOX_CODE = `<Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
  <Checkbox id="terms" name="terms" aria-labelledby="terms-label" />
  <FieldLabel id="terms-label" htmlFor="terms">이용약관에 동의합니다</FieldLabel>
</Field>`

const REQUIRED_CODE = `<Label htmlFor="name" className="gap-1 font-bold text-foreground">
  이름
  <span aria-hidden="true" className="text-error-500">*</span>
  <span className="sr-only"> (필수)</span>
</Label>
<Input id="name" name="name" required placeholder="이름을 입력하세요" />`

const DISABLED_CODE = `<div className="flex items-center gap-2">
  <Checkbox id="marketing" disabled className="peer" />
  <Label htmlFor="marketing">마케팅 정보 수신</Label>
</div>`

const USAGE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const USAGE_ROWS = [
    {
        key: 'standalone',
        cells: [
            '단순한 컨트롤 연결',
            <code key="component">Label</code>,
            '설명·오류 메시지 없이 라벨과 컨트롤만 구성할 때 사용합니다.',
        ],
    },
    {
        key: 'field',
        cells: [
            '설명·오류·상태가 있는 폼 필드',
            <code key="component">FieldLabel</code>,
            'Field 안에서 FieldDescription·FieldError와 함께 구성합니다.',
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
            '입력 필드의 강조 스타일이나 간격을 확장합니다.',
        ],
    },
] as const

const LabelGuidePage = () => (
    <GuidePageShell
        title="라벨 (Label)"
        description="폼 컨트롤에 보이는 이름을 제공하고 클릭 영역과 접근 가능한 이름을 연결하는 공통 Label 컴포넌트입니다."
    >
        <BaseCard variant="outlined">
            <section aria-labelledby="label-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="label-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code>htmlFor</code>와 컨트롤의 <code>id</code>를 같은 값으로 지정합니다. 텍스트 입력 라벨은{' '}
                        <code>font-bold text-foreground</code>를 적용합니다.
                    </p>
                </div>
                <div className="flex max-w-90 flex-col gap-2">
                    <Label htmlFor="label-email" className="text-foreground font-bold">
                        이메일
                    </Label>
                    <Input id="label-email" name="email" type="email" placeholder="이메일을 입력하세요" />
                </div>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="label-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="label-usage" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        폼 구조가 복잡하면 Label에 기능을 추가하지 말고 Field 조합을 사용합니다.
                    </p>
                </div>
                <Table caption="Label과 FieldLabel 사용 기준" columns={USAGE_COLUMNS} rows={USAGE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="label-patterns" className="flex flex-col gap-8">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="label-patterns" className="typo-h4-bold">
                        상태와 조합
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        선택형 컨트롤은 기본 굵기를 유지합니다. 필수·비활성 상태는 컨트롤의 실제 상태와 함께 표현합니다.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="typo-body-xl-bold">선택형 컨트롤</h3>
                    <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                        <Checkbox id="label-terms" name="terms" defaultChecked aria-labelledby="label-terms-label" />
                        <FieldLabel id="label-terms-label" htmlFor="label-terms">
                            이용약관에 동의합니다
                        </FieldLabel>
                    </Field>
                    <CodeBlock code={CHECKBOX_CODE} language="tsx" copyLabel="복사" />
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="typo-body-xl-bold">필수 입력</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        컨트롤에 <code>required</code>를 지정하고, 별표는 장식으로 숨긴 뒤 스크린리더용 “필수” 문구를
                        제공합니다.
                    </p>
                    <div className="flex max-w-90 flex-col gap-2">
                        <Label htmlFor="label-name" className="text-foreground gap-1 font-bold">
                            이름
                            <span aria-hidden="true" className="text-error-500">
                                *
                            </span>
                            <span className="sr-only"> (필수)</span>
                        </Label>
                        <Input id="label-name" name="name" required placeholder="이름을 입력하세요" />
                    </div>
                    <CodeBlock code={REQUIRED_CODE} language="tsx" copyLabel="복사" />
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="typo-body-xl-bold">비활성</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        컨트롤에 <code>disabled</code>와 <code>peer</code>를 지정하면 Label의 비활성 색상과 커서가
                        자동으로 적용됩니다.
                    </p>
                    <div className="flex items-center gap-2">
                        <Checkbox id="label-marketing" disabled className="peer" />
                        <Label htmlFor="label-marketing">마케팅 정보 수신</Label>
                    </div>
                    <CodeBlock code={DISABLED_CODE} language="tsx" copyLabel="복사" />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="label-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="label-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        아래 속성 외에도 Radix Label이 지원하는 표준 HTML label 속성을 전달할 수 있습니다.
                    </p>
                </div>
                <Table caption="Label Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default LabelGuidePage
