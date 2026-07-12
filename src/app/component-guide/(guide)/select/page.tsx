import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePage from '@/components/guide/guide-page'
import {Label} from '@/components/kit/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/kit/select'

export const metadata: Metadata = {title: '셀렉트 (Select)'}

const USAGE_CODE = `<div className="flex max-w-90 flex-col gap-2">
  <Label htmlFor="fruit" className="gap-1 font-bold text-foreground">
    좋아하는 과일
    <span className="text-error-500">*</span>
  </Label>
  <Select>
    <SelectTrigger id="fruit" className="w-full">
      <SelectValue placeholder="선택해주세요" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">사과</SelectItem>
      <SelectItem value="banana">바나나</SelectItem>
      <SelectItem value="cherry">체리</SelectItem>
    </SelectContent>
  </Select>
</div>`

// Figma selectbox 의 상태(default/focused/completed/error) 중 정적으로 보여줄 수 있는 것.
const FRUITS = [
    {value: 'apple', label: '사과'},
    {value: 'banana', label: '바나나'},
    {value: 'cherry', label: '체리'},
] as const

const FruitOptions = () =>
    FRUITS.map((f) => (
        <SelectItem key={f.value} value={f.value}>
            {f.label}
        </SelectItem>
    ))

const SelectGuidePage = () => (
    <GuidePage
        title="셀렉트 (Select)"
        description="shadcn Select 프리미티브입니다. Label 과 조합해 단일 선택 입력을 구성합니다."
    >
        <section aria-labelledby="select-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="select-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">Label</code> + <code className="font-mono">Select</code> 조합입니다.
                    필수 입력은 라벨에{' '}
                    <code className="font-mono">&lt;span className=&quot;text-error-500&quot;&gt;*&lt;/span&gt;</code>{' '}
                    별표를 붙여 표시합니다. 라벨은 <code className="font-mono">htmlFor</code>↔
                    <code className="font-mono">id</code> 로 연결합니다.
                </p>
            </div>
            <div className="flex max-w-90 flex-col gap-2">
                <Label htmlFor="demo-fruit" className="text-foreground gap-1 font-bold">
                    좋아하는 과일
                    <span className="text-error-500">*</span>
                </Label>
                <Select>
                    <SelectTrigger id="demo-fruit" className="w-full">
                        <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                        <FruitOptions />
                    </SelectContent>
                </Select>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="select-state" className="flex flex-col gap-4">
            <div>
                <h2 id="select-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    기본·값 선택됨·오류·비활성 상태입니다. <span className="text-foreground font-medium">포커스</span>
                    (탭 이동·열림) 시 테두리가 <code className="font-mono">blue.500</code> 로 바뀝니다.
                </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex max-w-90 flex-col gap-2">
                    <Label htmlFor="st-default" className="text-foreground font-bold">
                        기본 (default)
                    </Label>
                    <Select>
                        <SelectTrigger id="st-default" className="w-full">
                            <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                            <FruitOptions />
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex max-w-90 flex-col gap-2">
                    <Label htmlFor="st-completed" className="text-foreground font-bold">
                        값 선택됨 (completed)
                    </Label>
                    <Select defaultValue="apple">
                        <SelectTrigger id="st-completed" className="w-full">
                            <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                            <FruitOptions />
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex max-w-90 flex-col gap-2">
                    <Label htmlFor="st-error" className="text-foreground font-bold">
                        오류 (error)
                    </Label>
                    <Select>
                        <SelectTrigger
                            id="st-error"
                            aria-invalid="true"
                            aria-describedby="st-error-msg"
                            className="w-full"
                        >
                            <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                            <FruitOptions />
                        </SelectContent>
                    </Select>
                    <p id="st-error-msg" role="alert" className="typo-caption-regular text-error-500">
                        필수 항목입니다.
                    </p>
                </div>
                <div className="flex max-w-90 flex-col gap-2">
                    <Label htmlFor="st-disabled" className="text-foreground font-bold">
                        비활성 (disabled)
                    </Label>
                    <Select disabled>
                        <SelectTrigger id="st-disabled" className="w-full">
                            <SelectValue placeholder="선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                            <FruitOptions />
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </section>

        <section aria-labelledby="select-props" className="flex flex-col gap-4">
            <div>
                <h2 id="select-props" className="typo-h4-bold">
                    Props · 구성
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Select 는 여러 하위 요소의 조합입니다. 자주 쓰는 속성입니다.
                </p>
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
                                name: 'defaultValue / value',
                                desc: 'Select — 초기(비제어)/현재(제어) 선택값. onValueChange 와 함께 씁니다.',
                                def: '-',
                                control: 'string',
                            },
                            {
                                name: 'disabled',
                                desc: 'Select — 전체 비활성화.',
                                def: 'false',
                                control: 'boolean',
                            },
                            {
                                name: 'size',
                                desc: 'SelectTrigger — 높이. default 는 48px(Figma), sm 은 밀도 높은 UI 용 컴팩트.',
                                def: "'default'",
                                control: 'default | sm',
                            },
                            {
                                name: 'aria-invalid',
                                desc: 'SelectTrigger — 오류 상태. 테두리가 error 색으로 바뀝니다(오류 메시지는 aria-describedby 로 연결).',
                                def: '-',
                                control: 'boolean',
                            },
                            {
                                name: 'className',
                                desc: '추가 클래스명으로 스타일 확장(폼에서는 SelectTrigger 에 w-full).',
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

export default SelectGuidePage
