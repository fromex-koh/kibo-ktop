import type {Metadata} from 'next'
import {Calendar, Lock, Search} from 'lucide-react'
import CodeBlock from '@/components/guide/code-block'
import GuidePage from '@/components/guide/guide-page'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

export const metadata: Metadata = {title: '인풋 (Input)'}

const USAGE_CODE = `<div className="flex flex-col gap-2">
  <Label htmlFor="name">
    이름 <span className="text-error-500">*</span>
  </Label>
  <Input id="name" placeholder="내용을 입력하세요" aria-describedby="name-help" />
  <p id="name-help" className="typo-caption-regular text-muted-foreground">
    입력 시 필요한 정보를 입력해주세요.
  </p>
</div>`

const ADDON_CODE = `{/* 우측 아이콘 (검색·날짜 등) */}
<div className="relative">
  <Input placeholder="검색어를 입력하세요" className="pr-11" />
  <Search aria-hidden="true" className="text-muted-foreground absolute top-1/2 right-4 size-5 -translate-y-1/2" />
</div>

{/* 단위 접미사 */}
<div className="relative">
  <Input type="number" placeholder="0" className="pr-10" />
  <span className="text-foreground absolute top-1/2 right-4 -translate-y-1/2">명</span>
</div>

{/* 아이콘 + 단위 조합 */}
<div className="relative">
  <Input type="number" placeholder="0" className="pr-16" />
  <div className="text-muted-foreground absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-1.5">
    <span className="text-foreground">건</span>
    <Calendar aria-hidden="true" className="size-5" />
  </div>
</div>

{/* 잠금(읽기전용) — readOnly + lock 아이콘 */}
<div className="relative">
  <Input readOnly defaultValue="11222-1234567" className="pr-11" />
  <Lock aria-hidden="true" className="text-muted-foreground absolute top-1/2 right-4 size-5 -translate-y-1/2" />
</div>`

const InputGuidePage = () => (
    <GuidePage
        title="인풋 (Input)"
        description="shadcn Input 프리미티브입니다. Label 과 조합해 텍스트 입력을 구성합니다."
    >
        <section aria-labelledby="input-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="input-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">Label</code> + <code className="font-mono">Input</code> 조합입니다. 필수
                    입력은 라벨에 <code className="font-mono">text-error-500</code> 별표로, 도움말은 하단{' '}
                    <code className="font-mono">&lt;p&gt;</code> 를 <code className="font-mono">aria-describedby</code>{' '}
                    로 연결합니다.
                </p>
            </div>
            <div className="flex max-w-sm flex-col gap-2">
                <Label htmlFor="demo-name">
                    이름 <span className="text-error-500">*</span>
                </Label>
                <Input id="demo-name" placeholder="내용을 입력하세요" aria-describedby="demo-name-help" />
                <p id="demo-name-help" className="typo-caption-regular text-muted-foreground">
                    입력 시 필요한 정보를 입력해주세요.
                </p>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="input-state" className="flex flex-col gap-4">
            <div>
                <h2 id="input-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    기본·값 입력됨·오류·비활성·읽기전용 상태입니다.{' '}
                    <span className="text-foreground font-medium">포커스</span> 시 테두리가{' '}
                    <code className="font-mono">blue.500</code> 로 바뀝니다.
                </p>
            </div>
            <div className="wide:grid-cols-2 grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="st-default">기본 (default)</Label>
                    <Input id="st-default" placeholder="내용을 입력하세요" />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="st-completed">값 입력됨 (completed)</Label>
                    <Input id="st-completed" defaultValue="홍길동" />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="st-error">오류 (error)</Label>
                    <Input
                        id="st-error"
                        placeholder="내용을 입력하세요"
                        aria-invalid="true"
                        aria-describedby="st-error-msg"
                    />
                    <p id="st-error-msg" role="alert" className="typo-caption-regular text-error-500">
                        에러메시지가 노출됩니다.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="st-disabled">비활성 (disabled)</Label>
                    <Input id="st-disabled" placeholder="내용을 입력하세요" disabled />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="st-view">읽기전용 (view)</Label>
                    <Input id="st-view" defaultValue="수정 불가한 값" readOnly />
                </div>
            </div>
        </section>

        <section aria-labelledby="input-addon" className="flex flex-col gap-4">
            <div>
                <h2 id="input-addon" className="typo-h4-bold">
                    애드온 (아이콘·단위)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    우측 아이콘·단위는 <code className="font-mono">relative</code> 래퍼에 절대배치로 얹고, 겹치지 않도록
                    Input 에 오른쪽 padding(<code className="font-mono">pr-*</code>)을 줍니다.
                </p>
            </div>
            <div className="flex max-w-sm flex-col gap-4">
                {/* 우측 아이콘 — 검색 */}
                <div className="relative">
                    <Input placeholder="검색어를 입력하세요" aria-label="검색" className="pr-11" />
                    <Search
                        aria-hidden="true"
                        className="text-muted-foreground absolute top-1/2 right-4 size-5 -translate-y-1/2"
                    />
                </div>
                {/* 우측 아이콘 — 날짜 */}
                <div className="relative">
                    <Input placeholder="날짜를 선택하세요" aria-label="날짜" className="pr-11" />
                    <Calendar
                        aria-hidden="true"
                        className="text-muted-foreground absolute top-1/2 right-4 size-5 -translate-y-1/2"
                    />
                </div>
                {/* 단위 접미사 */}
                <div className="relative">
                    <Input type="number" placeholder="0" aria-label="인원" className="pr-10" />
                    <span className="text-foreground absolute top-1/2 right-4 -translate-y-1/2">명</span>
                </div>
                {/* 아이콘 + 단위 조합 */}
                <div className="relative">
                    <Input type="number" placeholder="0" aria-label="건수" className="pr-16" />
                    <div className="text-muted-foreground absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-1.5">
                        <span className="text-foreground">건</span>
                        <Calendar aria-hidden="true" className="size-5" />
                    </div>
                </div>
                {/* 잠금(읽기전용) — readOnly + lock 아이콘 */}
                <div className="relative">
                    <Input readOnly defaultValue="11222-1234567" aria-label="법인번호(읽기전용)" className="pr-11" />
                    <Lock
                        aria-hidden="true"
                        className="text-muted-foreground absolute top-1/2 right-4 size-5 -translate-y-1/2"
                    />
                </div>
            </div>
            <CodeBlock code={ADDON_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="input-props" className="flex flex-col gap-4">
            <div>
                <h2 id="input-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Input(네이티브 input)에서 자주 쓰는 속성입니다.
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
                                name: 'type',
                                desc: '입력 종류(text/email/number/password 등).',
                                def: "'text'",
                                control: 'string',
                            },
                            {
                                name: 'placeholder',
                                desc: '비어 있을 때 표시되는 안내 문구(레이블을 대체하지 않음).',
                                def: '-',
                                control: 'string',
                            },
                            {
                                name: 'disabled',
                                desc: '비활성. 회색 배경 + 상호작용 차단.',
                                def: 'false',
                                control: 'boolean',
                            },
                            {
                                name: 'readOnly',
                                desc: '읽기전용(view). 회색 배경으로 값만 보여줍니다.',
                                def: 'false',
                                control: 'boolean',
                            },
                            {
                                name: 'aria-invalid',
                                desc: '오류 상태. 테두리가 error 색으로 바뀝니다(메시지는 aria-describedby 로 연결).',
                                def: '-',
                                control: 'boolean',
                            },
                            {
                                name: 'className',
                                desc: '추가 클래스명으로 스타일 확장(아이콘·단위 시 pr-* 등).',
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

export default InputGuidePage
