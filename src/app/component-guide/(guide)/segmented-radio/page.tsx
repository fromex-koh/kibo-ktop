import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {SegmentedRadioGroup, SegmentedRadioGroupItem} from '@/components/composite/segmented-toggle-group'

export const metadata: Metadata = {title: '세그먼티드 라디오 (Segmented Radio)'}

const USAGE_SEGMENTED = `<SegmentedRadioGroup type="single" defaultValue="corp" variant="segmented" size="sm">
  <SegmentedRadioGroupItem value="corp">기업</SegmentedRadioGroupItem>
  <SegmentedRadioGroupItem value="org">기관</SegmentedRadioGroupItem>
</SegmentedRadioGroup>`

const COMPOSITION = [
    {name: 'SegmentedRadioGroup', desc: '라디오 세그먼트 항목을 감싸는 그룹. 프로젝트에서는 단일 선택만 사용한다.'},
    {name: 'SegmentedRadioGroupItem', desc: '개별 라디오 세그먼트 항목. value 로 선택 상태를 식별한다.'},
] as const

const PROPS = [
    {name: 'type', desc: '선택 방식 (프로젝트는 단일 선택만 사용)', values: "'single'", def: '—'},
    {
        name: 'variant',
        desc: '프로젝트에서는 라디오 기반 segmented variant만 사용한다.',
        values: "'segmented'",
        def: "'segmented'",
    },
    {name: 'size', desc: '컨트롤 높이', values: "'sm' | 'default' | 'lg'", def: "'default'"},
    {name: 'spacing', desc: '항목 간 간격(px). 0 이면 인접 항목이 이어붙는다', values: 'number', def: '2'},
] as const

const SegmentedRadioGroupGuidePage = () => (
    <GuidePageShell
        title="세그먼티드 라디오 (Segmented Radio)"
        description="여러 항목 중 하나를 선택하는 라디오 기반 세그먼티드 컨트롤입니다."
    >
        <section aria-labelledby="tg-preview" className="flex flex-col gap-4">
            <div>
                <h2 id="tg-preview" className="typo-h4-bold">
                    Preview
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    프로젝트에서는 <code className="font-mono">variant=&quot;segmented&quot;</code> 만 사용합니다. Figma
                    라디오 기반 세그먼티드 컨트롤(회색 트랙 + 선택 시 흰 알약)입니다. 토글처럼 다중 선택하지 않습니다.
                </p>
            </div>
            <div className="border-border flex flex-wrap items-center gap-6 rounded-md border p-6">
                <SegmentedRadioGroup
                    type="single"
                    defaultValue="corp"
                    variant="segmented"
                    size="sm"
                    aria-label="회원 유형 (2개)"
                >
                    <SegmentedRadioGroupItem value="corp">기업</SegmentedRadioGroupItem>
                    <SegmentedRadioGroupItem value="org">기관</SegmentedRadioGroupItem>
                </SegmentedRadioGroup>
                <SegmentedRadioGroup
                    type="single"
                    defaultValue="corp"
                    variant="segmented"
                    size="sm"
                    aria-label="회원 유형 (3개)"
                >
                    <SegmentedRadioGroupItem value="corp">기업</SegmentedRadioGroupItem>
                    <SegmentedRadioGroupItem value="org">기관</SegmentedRadioGroupItem>
                    <SegmentedRadioGroupItem value="person">개인</SegmentedRadioGroupItem>
                </SegmentedRadioGroup>
            </div>
            <CodeBlock code={USAGE_SEGMENTED} language="tsx" copyLabel="복사" />
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
                <p className="text-foreground-muted text-sm">라디오 기반 SegmentedRadioGroup의 주요 속성입니다.</p>
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
    </GuidePageShell>
)

export default SegmentedRadioGroupGuidePage
