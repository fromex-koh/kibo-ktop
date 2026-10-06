import type {Metadata} from 'next'
import Link from 'next/link'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/form'
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

const GROUP_TITLE_CODE = `<Label asChild className="text-foreground cursor-auto font-bold">
  <span id="own-workplace-label">자가사업장 보유</span>
</Label>
<RadioGroup aria-labelledby="own-workplace-label">…</RadioGroup>`

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
        key: 'form-field',
        cells: [
            '서비스 화면의 일반 폼 필드',
            <Link key="component" href="/component-guide/form-fields" className="text-primary-strong underline">
                Field (form-fields)
            </Link>,
            'label · required 를 prop 으로 넘기면 라벨과 필수 표시가 함께 그려집니다. 대부분의 입력은 이것을 씁니다.',
        ],
    },
    {
        key: 'field',
        cells: [
            '설명·오류를 직접 조합하는 필드',
            <code key="component">FieldLabel</code>,
            'ui/field 의 Field 안에서 FieldDescription · FieldError 와 함께 씁니다.',
        ],
    },
    {
        key: 'standalone',
        cells: [
            '라벨만 따로 필요한 자리',
            <code key="component">Label</code>,
            '라디오 옵션의 글자, 묶음 제목처럼 필드 틀 없이 라벨만 둘 때 씁니다.',
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
        key: 'asChild',
        cells: [
            <code key="prop">asChild</code>,
            <code key="type">boolean</code>,
            'label 대신 자식 요소에 라벨 모양을 입힙니다. 묶음 제목처럼 htmlFor 로 이을 컨트롤이 없을 때 씁니다.',
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
        description="폼 컨트롤의 이름을 보여 주고, 눌렀을 때 그 컨트롤로 이어 주는 라벨입니다."
    >
        <BaseCard>
            <section aria-labelledby="label-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="label-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>htmlFor</code>와 컨트롤의 <code>id</code>를 같은 값으로 둡니다. 입력 필드의 라벨은{' '}
                        <code>font-bold text-foreground</code>를 더합니다(기본은 보통 굵기 · 라벨 글자색).
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
                    <p className="typo-body-l-regular text-label-foreground">
                        Label을 직접 쓰는 자리는 많지 않습니다. 입력 필드는 먼저 Field로 표현할 수 있는지 봅니다.
                    </p>
                </div>
                <Table
                    caption="Field · FieldLabel · Label 사용 기준"
                    columns={USAGE_COLUMNS}
                    rows={USAGE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="label-patterns" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="label-patterns" className="typo-h4-bold">
                        상태와 조합
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        체크박스 · 라디오 옆의 라벨은 기본 굵기를 유지합니다.
                    </p>
                </div>

                {/* 소제목 블록마다 가로선과 같은 여백으로 갈라, 섹션 제목(24) → 소제목(18) → 본문(14) 순서가 보이게 한다. */}
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">선택형 컨트롤</h3>
                        <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                            <Checkbox
                                id="label-terms"
                                name="terms"
                                defaultChecked
                                aria-labelledby="label-terms-label"
                            />
                            <FieldLabel id="label-terms-label" htmlFor="label-terms">
                                이용약관에 동의합니다
                            </FieldLabel>
                        </Field>
                        <CodeBlock code={CHECKBOX_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">필수 입력</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            별표는 장식으로 숨기고 스크린리더용 “(필수)” 문구를 함께 둡니다. Field 를 쓰면{' '}
                            <code>required</code> prop 하나로 같은 표시가 그려집니다.
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

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">묶음 제목</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            라디오 묶음처럼 연결할 컨트롤이 하나가 아니면 <code>asChild</code>로 <code>span</code>에
                            라벨 모양만 입히고, 묶음이 <code>aria-labelledby</code>로 그 <code>id</code>를 가리킵니다.
                        </p>
                        <CodeBlock code={GROUP_TITLE_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">비활성</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            컨트롤에 <code>disabled</code>와 <code>peer</code>를 지정하면 Label의 비활성 색상과 커서가
                            자동으로 적용됩니다.
                        </p>
                        <div className="flex items-center gap-2">
                            <Checkbox id="label-marketing" disabled className="peer" />
                            <Label htmlFor="label-marketing">마케팅 정보 수신</Label>
                        </div>
                        <CodeBlock code={DISABLED_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="label-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="label-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        그 밖의 표준 label 속성도 그대로 넘길 수 있습니다.
                    </p>
                </div>
                <Table caption="Label Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default LabelGuidePage
