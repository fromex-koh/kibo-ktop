import type {Metadata} from 'next'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldDescription, FieldError, FieldLabel} from '@/components/ui/field'
import {Input} from '@/components/ui/input'

export const metadata: Metadata = {title: '필드 라벨 (FieldLabel)'}

const BASIC_CODE = `<Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
  <FieldLabel htmlFor="company-name" className="font-bold text-foreground">기업명</FieldLabel>
  <Input id="company-name" name="companyName" placeholder="기업명을 입력하세요" />
  <FieldDescription>사업자등록증에 표시된 기업명을 입력해 주세요.</FieldDescription>
</Field>`

const HORIZONTAL_CODE = `<Field orientation="horizontal" className={cn('w-fit gap-2', FIELD_FOCUS_RING)}>
  <Checkbox id="terms" name="terms" />
  <FieldLabel htmlFor="terms">이용약관에 동의합니다</FieldLabel>
</Field>`

const INVALID_CODE = `<Field data-invalid className={cn('max-w-90', FIELD_FOCUS_RING)}>
  <FieldLabel htmlFor="manager-name" className="gap-1 font-bold text-foreground">
    담당자명
    <span aria-hidden="true" className="text-error-500">*</span>
    <span className="sr-only"> (필수)</span>
  </FieldLabel>
  <Input id="manager-name" required aria-invalid aria-describedby="manager-name-error" />
  <FieldError id="manager-name-error">담당자명을 입력해 주세요.</FieldError>
</Field>`

const PROPS_ITEMS = [
    {
        name: 'htmlFor',
        desc: '연결할 폼 컨트롤의 id입니다. 라벨을 눌러도 해당 컨트롤이 포커스되거나 전환됩니다.',
        def: '-',
        control: 'string',
    },
    {
        name: 'children',
        desc: '라벨 텍스트와 필수 표시·아이콘 등 인라인 요소입니다.',
        def: '-',
        control: 'ReactNode',
    },
    {
        name: 'className',
        desc: '입력 필드 제목의 font-bold·text-foreground 등 사용처 스타일을 확장합니다.',
        def: '""',
        control: 'string',
    },
    {
        name: 'id / aria-* / data-*',
        desc: 'Label이 지원하는 HTML 속성을 그대로 전달합니다.',
        def: '-',
        control: 'LabelHTMLAttributes',
    },
] as const

const FieldLabelGuidePage = () => (
    <GuidePageShell
        title="필드 라벨 (FieldLabel)"
        description="Field 내에서 폼 컨트롤·설명·오류 메시지를 하나의 구조로 묶을 때 사용하는 Label 확장 구성 요소입니다."
    >
        <section aria-labelledby="field-label-role" className="flex flex-col gap-4">
            <div>
                <h2 id="field-label-role" className="typo-h4-bold">
                    Label과의 차이
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">FieldLabel</code>은 새로운 primitive가 아니라{' '}
                    <code className="font-mono">Label</code>을 기반으로 하는 shadcn Field 전용 조합 요소입니다. 단독
                    라벨만 필요하면 Label을 쓰고, 컨트롤과 <code className="font-mono">FieldDescription</code>·
                    <code className="font-mono">FieldError</code>를 같이 관리할 때 FieldLabel을 사용합니다.
                </p>
            </div>
            <div className="border-border rounded-md border p-6">
                <Field className={cn('max-w-90', FIELD_FOCUS_RING)}>
                    <FieldLabel htmlFor="field-label-company" className="text-foreground font-bold">
                        기업명
                    </FieldLabel>
                    <Input id="field-label-company" name="companyName" placeholder="기업명을 입력하세요" />
                    <FieldDescription>사업자등록증에 표시된 기업명을 입력해 주세요.</FieldDescription>
                </Field>
            </div>
            <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="field-label-layout" className="flex flex-col gap-4">
            <div>
                <h2 id="field-label-layout" className="typo-h4-bold">
                    배치 (Orientation)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Input·Select·Textarea는 기본 vertical Field, Checkbox·Radio·Switch와 인라인으로 배치할 때는{' '}
                    <code className="font-mono">orientation=&quot;horizontal&quot;</code>을 사용합니다.
                </p>
            </div>
            <div className="border-border rounded-md border p-6">
                <Field orientation="horizontal" className={cn('w-fit gap-2', FIELD_FOCUS_RING)}>
                    <Checkbox id="field-label-terms" name="terms" />
                    <FieldLabel htmlFor="field-label-terms">이용약관에 동의합니다</FieldLabel>
                </Field>
            </div>
            <CodeBlock code={HORIZONTAL_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="field-label-message" className="flex flex-col gap-4">
            <div>
                <h2 id="field-label-message" className="typo-h4-bold">
                    설명·오류·비활성
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    오류 상태는 Field의 <code className="font-mono">data-invalid</code>와 컨트롤의{' '}
                    <code className="font-mono">aria-invalid</code>를 같이 연결합니다. 비활성 Field는{' '}
                    <code className="font-mono">data-disabled</code>를 지정해 라벨에도 상태를 전달합니다.
                </p>
            </div>
            <div className="border-border grid gap-6 rounded-md border p-6 lg:grid-cols-2">
                <Field data-invalid className={cn('max-w-90', FIELD_FOCUS_RING)}>
                    <FieldLabel htmlFor="field-label-manager" className="text-foreground gap-1 font-bold">
                        담당자명
                        <span aria-hidden="true" className="text-error-500">
                            *
                        </span>
                        <span className="sr-only"> (필수)</span>
                    </FieldLabel>
                    <Input
                        id="field-label-manager"
                        required
                        aria-invalid
                        aria-describedby="field-label-manager-error"
                    />
                    <FieldError id="field-label-manager-error">담당자명을 입력해 주세요.</FieldError>
                </Field>
                <Field data-disabled="true" className="max-w-90">
                    <FieldLabel htmlFor="field-label-disabled" className="text-foreground font-bold">
                        접수 기관
                    </FieldLabel>
                    <Input id="field-label-disabled" value="기술보증기금" disabled readOnly />
                    <FieldDescription>비활성 상태에서는 수정할 수 없습니다.</FieldDescription>
                </Field>
            </div>
            <CodeBlock code={INVALID_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="field-label-props" className="flex flex-col gap-4">
            <div>
                <h2 id="field-label-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    FieldLabel은 Label props를 그대로 상속하며 Field 조합을 위한 스타일을 추가합니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">FieldLabel Props 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
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
                        {PROPS_ITEMS.map((item) => (
                            <tr key={item.name} className="border-border border-b last:border-b-0">
                                <th scope="row" className="typo-body-l-medium text-primary px-4 py-3 font-mono">
                                    {item.name}
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{item.desc}</td>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                    {item.def}
                                </td>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                    {item.control}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePageShell>
)

export default FieldLabelGuidePage
