import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Checkbox} from '@/components/ui/checkbox'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'

export const metadata: Metadata = {title: '라벨 (Label)'}

// 입력 필드(Input·Select·Textarea) 조합 라벨은 Body/XL/Bold(font-bold text-foreground).
const USAGE_CODE = `<div className="flex max-w-90 flex-col gap-2">
  <Label htmlFor="email" className="font-bold text-foreground">이메일</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>`

const REQUIRED_CODE = `<Label htmlFor="name" className="gap-1 font-bold text-foreground">
  이름
  <span aria-hidden="true" className="text-error-500">*</span>
  <span className="sr-only"> (필수)</span>
</Label>
<Input id="name" required />`

const CHECKBOX_CODE = `<div className="flex max-w-90 items-center gap-2">
  <Checkbox id="terms" defaultChecked aria-labelledby="terms-label" />
  <Label id="terms-label" htmlFor="terms">이용약관에 동의합니다</Label>
</div>`

const DISABLED_CODE = `{/* 연결된 컨트롤이 disabled 이면 peer-disabled 로 라벨 색상도 바뀐다 */}
<div className="flex max-w-90 items-center gap-2">
  <Checkbox id="opt-in" disabled className="peer" aria-labelledby="opt-in-label" />
  <Label id="opt-in-label" htmlFor="opt-in">비활성 옵션</Label>
</div>`

const STYLE_ROWS = [
    {prop: '크기', value: 'text-base', note: '16px — 폼 라벨 크기를 통일(바닐라 14px 에서 상향)'},
    {prop: '행간', value: 'leading-normal', note: '24px(150%) — Figma 라벨 텍스트 행간'},
    {
        prop: '색',
        value: 'text-label-foreground',
        note: 'gray.700 — Figma 라벨 본문색 전용 시맨틱 토큰. 강조(2depth 제목)는 text-foreground(gray.900)',
    },
    {
        prop: '굵기',
        value: 'font-normal (기본)',
        note: '기본 Regular(400) — 체크박스·라디오 조합 라벨. 입력 필드(Input·Select·Textarea) 조합 라벨은 사용처에서 font-bold(Body/XL/Bold)',
    },
    {prop: '커서', value: 'cursor-pointer', note: '라벨 클릭으로 연결 컨트롤을 토글할 수 있음을 알림'},
    {prop: '정렬', value: 'flex items-center gap-2', note: '별표·아이콘 등 인라인 요소를 gap 으로 정렬'},
    {
        prop: '비활성',
        value: 'text-disabled',
        note: 'gray.300 — 연결 컨트롤 비활성 시 peer/group 상태로 라벨 색상을 명시',
    },
] as const

const LabelGuidePage = () => (
    <GuidePageShell
        title="라벨 (Label)"
        description="최신 shadcn Label shell과 props 구조를 유지하고 프로젝트 label 스타일을 연결한 컴포넌트입니다. htmlFor↔id 로 폼 컨트롤과 연결해 함께 씁니다."
    >
        <section aria-labelledby="label-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="label-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">Label</code> 의 <code className="font-mono">htmlFor</code> 를 컨트롤의{' '}
                    <code className="font-mono">id</code> 와 맞춰 연결합니다. 연결하면 라벨을 클릭해도 컨트롤이
                    포커스·토글되고, 스크린리더가 이름을 함께 읽습니다(
                    <span className="text-foreground font-medium">7.4.1</span>).
                </p>
            </div>
            <div className="flex max-w-90 flex-col gap-2">
                <Label htmlFor="demo-email" className="text-foreground font-bold">
                    이메일
                </Label>
                <Input id="demo-email" type="email" placeholder="you@example.com" />
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="label-style" className="flex flex-col gap-4">
            <div>
                <h2 id="label-style" className="typo-h4-bold">
                    스타일 (Figma)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Figma 폼 라벨 스펙을 반영한 프로젝트 기본 스타일입니다. 크기·행간·기본 굵기·커서는{' '}
                    <code className="font-mono">theme/label.variants.ts</code> 에 정의되어 별도 클래스 없이 적용됩니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">라벨 기본 스타일 값</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                항목
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                값
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                설명
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {STYLE_ROWS.map((row) => (
                            <tr key={row.prop} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-foreground border-r px-4 py-3 align-top font-normal whitespace-nowrap"
                                >
                                    {row.prop}
                                </th>
                                <td className="typo-caption-regular text-primary px-4 py-3 font-mono">{row.value}</td>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{row.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="label-compose" className="flex flex-col gap-4">
            <div>
                <h2 id="label-compose" className="typo-h4-bold">
                    조합 (Composition)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    라벨은 <span className="text-foreground font-medium">조합 상대에 따라 굵기가 갈립니다</span>. 입력
                    필드(<code className="font-mono">Input</code>·<code className="font-mono">Select</code>·
                    <code className="font-mono">Textarea</code>) 라벨은 Body/XL/Bold(
                    <code className="font-mono">font-bold text-foreground</code>), 체크박스·라디오 선택형 라벨은
                    Regular(
                    <code className="font-mono">font-normal</code>, 기본)로 둡니다.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">
                    체크박스 + 라벨{' '}
                    <span className="typo-caption-regular text-muted-foreground">— 라벨 Regular(400), 기본 그대로</span>
                </h3>
                <div className="flex max-w-90 items-center gap-2">
                    <Checkbox id="compose-terms" defaultChecked aria-labelledby="compose-terms-label" />
                    <Label id="compose-terms-label" htmlFor="compose-terms">
                        이용약관에 동의합니다
                    </Label>
                </div>
                <CodeBlock code={CHECKBOX_CODE} language="tsx" copyLabel="복사" />
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">
                    라디오 + 라벨{' '}
                    <span className="typo-caption-regular text-muted-foreground">— 라벨 Regular(400), 기본 그대로</span>
                </h3>
                <RadioGroup defaultValue="a" className="flex flex-col gap-2">
                    <div className="flex max-w-90 items-center gap-2">
                        <RadioGroupItem id="compose-r-a" value="a" />
                        <Label htmlFor="compose-r-a">선택지 A</Label>
                    </div>
                    <div className="flex max-w-90 items-center gap-2">
                        <RadioGroupItem id="compose-r-b" value="b" />
                        <Label htmlFor="compose-r-b">선택지 B</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">
                    필수 표시 (별표){' '}
                    <span className="typo-caption-regular text-muted-foreground">
                        — 입력 필드 라벨이라 Body/XL/Bold
                    </span>
                </h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    필수 입력은 <code className="font-mono">gap-1</code> 로 좁힌 뒤{' '}
                    <code className="font-mono">text-error-500</code> 별표를 인라인으로 둡니다. 별표는{' '}
                    <code className="font-mono">aria-hidden</code>으로 숨기고 <code className="font-mono">sr-only</code>{' '}
                    “필수” 텍스트와 컨트롤의 <code className="font-mono">required</code>를 함께 사용합니다.
                </p>
                <div className="flex max-w-90 flex-col gap-2">
                    <Label htmlFor="compose-name" className="text-foreground gap-1 font-bold">
                        이름
                        <span aria-hidden="true" className="text-error-500">
                            *
                        </span>
                        <span className="sr-only"> (필수)</span>
                    </Label>
                    <Input id="compose-name" required placeholder="내용을 입력하세요" />
                </div>
                <CodeBlock code={REQUIRED_CODE} language="tsx" copyLabel="복사" />
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">비활성 반영</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    연결된 컨트롤이 <code className="font-mono">disabled</code> 이면{' '}
                    <code className="font-mono">peer-disabled</code> 로 라벨 색상도{' '}
                    <code className="font-mono">text-disabled</code> 로 바뀝니다. opacity는 낮추지 않습니다(수동 분기
                    불필요).
                </p>
                <div className="flex max-w-90 items-center gap-2">
                    <Checkbox id="compose-opt" disabled className="peer" aria-labelledby="compose-opt-label" />
                    <Label id="compose-opt-label" htmlFor="compose-opt">
                        비활성 옵션
                    </Label>
                </div>
                <CodeBlock code={DISABLED_CODE} language="tsx" copyLabel="복사" />
            </div>
        </section>

        <section aria-labelledby="label-props" className="flex flex-col gap-4">
            <div>
                <h2 id="label-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">Label(Radix 기반)에서 자주 쓰는 속성입니다.</p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Props 목록</caption>
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
                        {[
                            {
                                name: 'htmlFor',
                                desc: '연결할 폼 컨트롤의 id. 이 값으로 라벨↔컨트롤을 묶습니다(7.4.1).',
                                def: '-',
                                control: 'string',
                            },
                            {
                                name: 'children',
                                desc: '라벨 텍스트. 별표·아이콘 등 인라인 요소를 함께 넣을 수 있습니다.',
                                def: '-',
                                control: 'ReactNode',
                            },
                            {
                                name: 'className',
                                desc: '추가 클래스명으로 스타일 확장(예: font-bold·gap-1).',
                                def: '""',
                                control: 'string',
                            },
                        ].map((prop) => (
                            <tr key={prop.name} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                                >
                                    {prop.name}
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{prop.desc}</td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    {prop.def}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        {prop.control}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePageShell>
)

export default LabelGuidePage
