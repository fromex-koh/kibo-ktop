import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePage from '@/components/guide/guide-page'
import {Checkbox} from '@/components/kit/checkbox'
import {Input} from '@/components/kit/input'
import {Label} from '@/components/kit/label'
import {RadioGroup, RadioGroupItem} from '@/components/kit/radio-group'

export const metadata: Metadata = {title: '라벨 (Label)'}

const USAGE_CODE = `<div className="flex max-w-90 flex-col gap-2">
  <Label htmlFor="email">이메일</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>`

const REQUIRED_CODE = `<Label htmlFor="name" className="gap-1">
  이름
  <span className="text-error-500">*</span>
</Label>`

const CHECKBOX_CODE = `<div className="flex max-w-90 items-center gap-2">
  <Checkbox id="terms" defaultChecked />
  <Label htmlFor="terms">이용약관에 동의합니다</Label>
</div>`

const DISABLED_CODE = `{/* 연결된 컨트롤이 disabled 이면 peer-disabled 로 라벨도 흐려진다 */}
<div className="flex max-w-90 items-center gap-2">
  <Checkbox id="opt-in" disabled className="peer" />
  <Label htmlFor="opt-in">비활성 옵션</Label>
</div>`

// Figma 라벨 스타일의 핵심 값 — 문서 표에 그대로 노출한다(Figma checkbox 세트 label 프레임 기준).
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
        value: 'font-normal',
        note: '기본 Regular(400) — Figma 라벨 기본(1depth). 강조(2depth 제목)는 사용처에서 font-bold',
    },
    {prop: '커서', value: 'cursor-pointer', note: '라벨 클릭으로 연결 컨트롤을 토글할 수 있음을 알림'},
    {prop: '정렬', value: 'flex items-center gap-2', note: '별표·아이콘 등 인라인 요소를 gap 으로 정렬'},
    {prop: '비활성', value: 'peer-disabled / group-data-[disabled]', note: '연결 컨트롤 비활성 시 자동으로 흐려짐'},
] as const

const LabelGuidePage = () => (
    <GuidePage
        title="라벨 (Label)"
        description="shadcn Label 프리미티브입니다. htmlFor↔id 로 폼 컨트롤과 연결해 함께 씁니다."
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
                <Label htmlFor="demo-email">이메일</Label>
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
                    Figma 폼 라벨 스펙을 반영한 기본 스타일입니다. 크기·행간·굵기·커서는 원본에 담겨 있어 별도 클래스
                    없이 적용됩니다.
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
                    라벨은 단독으로 쓰기보다 폼 컨트롤과 조합해 씁니다. 기본 굵기는 Regular(
                    <code className="font-mono">font-normal</code>)라 별도 지정 없이 쓰고, 2depth 제목처럼 강조가 필요한
                    곳에서만 <code className="font-mono">font-bold</code> 를 씌웁니다.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">체크박스 + 라벨</h3>
                <div className="flex max-w-90 items-center gap-2">
                    <Checkbox id="compose-terms" defaultChecked />
                    <Label htmlFor="compose-terms">이용약관에 동의합니다</Label>
                </div>
                <CodeBlock code={CHECKBOX_CODE} language="tsx" copyLabel="복사" />
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">라디오 + 라벨</h3>
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
                <h3 className="typo-body-l-medium text-foreground">필수 표시 (별표)</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    필수 입력은 <code className="font-mono">gap-1</code> 로 좁힌 뒤{' '}
                    <code className="font-mono">text-error-500</code> 별표를 인라인으로 둡니다.
                </p>
                <div className="flex max-w-90 flex-col gap-2">
                    <Label htmlFor="compose-name" className="gap-1">
                        이름
                        <span className="text-error-500">*</span>
                    </Label>
                    <Input id="compose-name" placeholder="내용을 입력하세요" />
                </div>
                <CodeBlock code={REQUIRED_CODE} language="tsx" copyLabel="복사" />
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">비활성 반영</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    연결된 컨트롤이 <code className="font-mono">disabled</code> 이면{' '}
                    <code className="font-mono">peer-disabled</code> 로 라벨도 함께 흐려집니다(수동 분기 불필요).
                </p>
                <div className="flex max-w-90 items-center gap-2">
                    <Checkbox id="compose-opt" disabled className="peer" />
                    <Label htmlFor="compose-opt">비활성 옵션</Label>
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
                                desc: '추가 클래스명으로 스타일 확장(예: font-normal·gap-1).',
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
    </GuidePage>
)

export default LabelGuidePage
