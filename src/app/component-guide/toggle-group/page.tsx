import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePage from '@/components/guide/guide-page'
import {ToggleGroup, ToggleGroupItem} from '@/components/kit/toggle-group'

export const metadata: Metadata = {title: '토글 그룹 (ToggleGroup)'}

const USAGE_SEGMENTED = `<ToggleGroup type="single" defaultValue="corp" variant="segmented" size="sm">
  <ToggleGroupItem value="corp">기업</ToggleGroupItem>
  <ToggleGroupItem value="org">기관</ToggleGroupItem>
</ToggleGroup>`

const USAGE_MULTIPLE = `<ToggleGroup type="multiple" variant="outline">
  <ToggleGroupItem value="bold">굵게</ToggleGroupItem>
  <ToggleGroupItem value="italic">기울임</ToggleGroupItem>
  <ToggleGroupItem value="underline">밑줄</ToggleGroupItem>
</ToggleGroup>`

// 변형 표 행.
const VARIANTS = [
    {key: 'segmented', desc: 'Figma 세그먼티드 컨트롤 — 회색 트랙 + 선택 시 흰 알약. 모드/유형 전환에 쓴다.'},
    {key: 'default', desc: '트랙 없이 선택 시 배경만 강조(muted). 툴바형 토글에 쓴다.'},
    {key: 'outline', desc: '테두리를 두른 토글. spacing=0 이면 인접 항목이 이어붙는다.'},
] as const

const COMPOSITION = [
    {name: 'ToggleGroup', desc: '토글 항목들을 감싸는 그룹. type(single|multiple)·variant·size·spacing 을 정한다.'},
    {name: 'ToggleGroupItem', desc: '개별 토글 항목. value 로 선택 상태를 식별한다.'},
] as const

const PROPS = [
    {name: 'type', desc: '단일 선택(single) / 다중 선택(multiple)', values: "'single' | 'multiple'", def: '—'},
    {name: 'variant', desc: '시각 스타일', values: "'segmented' | 'default' | 'outline'", def: "'default'"},
    {name: 'size', desc: '컨트롤 높이', values: "'sm' | 'default' | 'lg'", def: "'default'"},
    {name: 'spacing', desc: '항목 간 간격(px). 0 이면 인접 항목이 이어붙는다', values: 'number', def: '2'},
] as const

// 토글 그룹 — shadcn primitive(radix)를 승격한 styled copy. Figma "회원 유형" 세그먼티드가 기본 예시.
const ToggleGroupGuidePage = () => (
    <GuidePage
        title="토글 그룹 (ToggleGroup)"
        description="여러 항목 중 하나(또는 여럿)를 켜고 끄는 컨트롤입니다. Figma 세그먼티드 디자인을 segmented 변형으로 담았습니다."
    >
        <section aria-labelledby="tg-preview" className="flex flex-col gap-4">
            <div>
                <h2 id="tg-preview" className="typo-h4-bold">
                    Preview
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Figma 세그먼티드 컨트롤(회색 트랙 + 선택 시 흰 알약)입니다.
                </p>
            </div>
            <div className="border-border flex flex-wrap items-center gap-6 rounded-md border p-6">
                <ToggleGroup
                    type="single"
                    defaultValue="corp"
                    variant="segmented"
                    size="sm"
                    aria-label="회원 유형 (sm)"
                >
                    <ToggleGroupItem value="corp">기업</ToggleGroupItem>
                    <ToggleGroupItem value="org">기관</ToggleGroupItem>
                </ToggleGroup>
                <ToggleGroup type="single" defaultValue="corp" variant="segmented" aria-label="회원 유형 (default)">
                    <ToggleGroupItem value="corp" className="px-6">
                        기업
                    </ToggleGroupItem>
                    <ToggleGroupItem value="org" className="px-6">
                        기관
                    </ToggleGroupItem>
                    <ToggleGroupItem value="person" className="px-6">
                        개인
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
            <CodeBlock code={USAGE_SEGMENTED} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="tg-variant" className="flex flex-col gap-4">
            <div>
                <h2 id="tg-variant" className="typo-h4-bold">
                    Variant
                </h2>
                <p className="text-foreground-muted text-sm">시각 스타일 3가지입니다.</p>
            </div>
            <div className="border-border flex flex-col gap-6 rounded-md border p-6">
                <div className="flex items-center gap-3">
                    <span className="text-primary w-24 shrink-0 rounded bg-gray-100 px-2 py-1 text-center font-mono text-xs">
                        segmented
                    </span>
                    <ToggleGroup
                        type="single"
                        defaultValue="a"
                        variant="segmented"
                        size="sm"
                        aria-label="segmented 예시"
                    >
                        <ToggleGroupItem value="a">전체</ToggleGroupItem>
                        <ToggleGroupItem value="b">기업</ToggleGroupItem>
                        <ToggleGroupItem value="c">기관</ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-primary w-24 shrink-0 rounded bg-gray-100 px-2 py-1 text-center font-mono text-xs">
                        default
                    </span>
                    <ToggleGroup type="multiple" defaultValue={['bold']} aria-label="default 예시">
                        <ToggleGroupItem value="bold">굵게</ToggleGroupItem>
                        <ToggleGroupItem value="italic">기울임</ToggleGroupItem>
                        <ToggleGroupItem value="underline">밑줄</ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-primary w-24 shrink-0 rounded bg-gray-100 px-2 py-1 text-center font-mono text-xs">
                        outline
                    </span>
                    <ToggleGroup
                        type="single"
                        defaultValue="left"
                        variant="outline"
                        spacing={0}
                        aria-label="outline 예시"
                    >
                        <ToggleGroupItem value="left">왼쪽</ToggleGroupItem>
                        <ToggleGroupItem value="center">가운데</ToggleGroupItem>
                        <ToggleGroupItem value="right">오른쪽</ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Variant 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Variant
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {VARIANTS.map((v) => (
                            <tr key={v.key} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    {v.key}
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{v.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="tg-multiple" className="flex flex-col gap-4">
            <div>
                <h2 id="tg-multiple" className="typo-h4-bold">
                    다중 선택
                </h2>
                <p className="text-foreground-muted text-sm">
                    <code>type=&quot;multiple&quot;</code> 이면 여러 항목을 동시에 켤 수 있습니다.
                </p>
            </div>
            <div className="border-border rounded-md border p-6">
                <ToggleGroup type="multiple" variant="outline" defaultValue={['bold']} aria-label="텍스트 서식">
                    <ToggleGroupItem value="bold">굵게</ToggleGroupItem>
                    <ToggleGroupItem value="italic">기울임</ToggleGroupItem>
                    <ToggleGroupItem value="underline">밑줄</ToggleGroupItem>
                </ToggleGroup>
            </div>
            <CodeBlock code={USAGE_MULTIPLE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="tg-composition" className="flex flex-col gap-4">
            <div>
                <h2 id="tg-composition" className="typo-h4-bold">
                    Composition
                </h2>
                <p className="text-foreground-muted text-sm">이 컴포넌트를 이루는 요소들입니다.</p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Composition 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Name
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {COMPOSITION.map((row) => (
                            <tr key={row.name} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    {row.name}
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{row.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="tg-props" className="flex flex-col gap-4">
            <div>
                <h2 id="tg-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="text-foreground-muted text-sm">ToggleGroup 의 주요 속성입니다.</p>
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
                                Type
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Default
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {PROPS.map((p) => (
                            <tr key={p.name} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    {p.name}
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{p.desc}</td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    {p.values}
                                </td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    {p.def}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePage>
)

export default ToggleGroupGuidePage
