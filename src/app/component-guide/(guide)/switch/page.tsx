import type {Metadata} from 'next'
import {cn} from '@/lib/utils'
import {BaseCard} from '@/components/composite/base-card'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Field, FieldLabel} from '@/components/ui/field'
import {Switch} from '@/components/composite/control-switch'

export const metadata: Metadata = {title: '스위치 (Switch)'}

const USAGE_CODE = `<Field orientation="horizontal" className={cn('w-fit gap-2', FIELD_FOCUS_RING)}>
  <Switch id="marketing" defaultChecked aria-labelledby="marketing-label" />
  <FieldLabel id="marketing-label" htmlFor="marketing">마케팅 정보 수신</FieldLabel>
</Field>`

const PROPS_ITEMS = [
    {
        name: 'checked · onCheckedChange',
        desc: '켜짐 상태(제어). 비제어면 defaultChecked로 초기값만 지정합니다.',
        type: 'boolean · (value: boolean) => void',
        def: '—',
    },
    {name: 'defaultChecked', desc: '비제어 초기 상태입니다.', type: 'boolean', def: 'false'},
    {name: 'size', desc: 'lg=40px, md=36px, sm=32px 높이입니다.', type: "'lg' | 'md' | 'sm'", def: "'md'"},
    {name: 'disabled', desc: '비활성 상태로 표시하고 상호작용을 막습니다.', type: 'boolean', def: 'false'},
    {
        name: 'id · name · aria-*',
        desc: 'Radix 루트(button role="switch")에 전달하며 FieldLabel과 htmlFor↔id로 연결합니다.',
        type: 'button 속성',
        def: '—',
    },
] as const

// 스위치 — shadcn Switch primitive를 호출하는 프로젝트 wrapper다.
// 프로젝트 크기와 색상만 확장하고 상태·키보드·포커스 동작은 primitive에 위임한다.
const SwitchGuidePage = () => (
    <GuidePageShell
        title="스위치 (Switch)"
        description="켜짐/꺼짐 두 상태를 즉시 전환하는 토글입니다. 설정처럼 그 자리에서 바로 반영되는 on/off 에 씁니다(폼 제출이 필요하면 Checkbox 를 고려)."
    >
        <BaseCard>
            <section aria-labelledby="sw-state" className="flex flex-col gap-4">
                <div>
                    <h2 id="sw-state" className="typo-h4-bold">
                        상태 (State)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        꺼짐(off)·켜짐(on) 두 상태입니다. on 은 <code className="font-mono">bg-primary</code>, off 는{' '}
                        <code className="font-mono">bg-foreground-subtle</code> 트랙으로 표시합니다. 클릭해서 전환해
                        보세요. 상태 예시는 <code className="font-mono">lg</code> 크기입니다.
                    </p>
                </div>
                <div className="border-border flex flex-wrap items-center gap-8 rounded-md border p-6">
                    <div className="flex flex-col items-center gap-2">
                        <Switch size="lg" aria-labelledby="sw-state-off-label" />
                        <span id="sw-state-off-label" className="typo-caption-regular text-muted-foreground font-mono">
                            off
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Switch size="lg" defaultChecked aria-labelledby="sw-state-on-label" />
                        <span id="sw-state-on-label" className="typo-caption-regular text-muted-foreground font-mono">
                            on
                        </span>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sw-size" className="flex flex-col gap-4">
                <div>
                    <h2 id="sw-size" className="typo-h4-bold">
                        사이즈 (Size)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Button 크기 체계에 맞춰 <code className="font-mono">lg</code>(40px),{' '}
                        <code className="font-mono">md</code>(36px), <code className="font-mono">sm</code>(32px) 높이를
                        씁니다. 기본값은 <code className="font-mono">md</code>입니다.
                    </p>
                </div>
                <div className="border-border flex flex-wrap items-center gap-8 rounded-md border p-6">
                    <div className="flex flex-col items-center gap-2">
                        <Switch size="lg" defaultChecked aria-labelledby="sw-size-lg-label" />
                        <span id="sw-size-lg-label" className="typo-caption-regular text-muted-foreground font-mono">
                            lg
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Switch size="md" defaultChecked aria-labelledby="sw-size-md-label" />
                        <span id="sw-size-md-label" className="typo-caption-regular text-muted-foreground font-mono">
                            md
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Switch size="sm" defaultChecked aria-labelledby="sw-size-sm-label" />
                        <span id="sw-size-sm-label" className="typo-caption-regular text-muted-foreground font-mono">
                            sm
                        </span>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sw-disabled" className="flex flex-col gap-4">
                <div>
                    <h2 id="sw-disabled" className="typo-h4-bold">
                        비활성 (Disabled)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">disabled</code> — 공통 disabled 토큰으로 색상을 낮추고 클릭을
                        막습니다.
                    </p>
                </div>
                <div className="border-border flex flex-wrap items-center gap-8 rounded-md border p-6">
                    <div className="flex flex-col items-center gap-2">
                        <Switch disabled aria-labelledby="sw-disabled-off-label" />
                        <span
                            id="sw-disabled-off-label"
                            className="typo-caption-regular text-muted-foreground font-mono"
                        >
                            disabled · off
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Switch disabled defaultChecked aria-labelledby="sw-disabled-on-label" />
                        <span
                            id="sw-disabled-on-label"
                            className="typo-caption-regular text-muted-foreground font-mono"
                        >
                            disabled · on
                        </span>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sw-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="sw-usage" className="typo-h4-bold">
                        사용 예시 (FieldLabel 조합)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">Field</code> 안에 <code className="font-mono">FieldLabel</code>과
                        Switch를 두고 <code className="font-mono">htmlFor</code>↔<code className="font-mono">id</code>로
                        연결합니다. 라벨을 눌러도 토글되며 포커스링은 전체 영역을 감쌉니다.
                    </p>
                </div>
                <div className="border-border flex flex-col gap-4 rounded-md border p-6">
                    <Field orientation="horizontal" className={cn('w-fit gap-2', FIELD_FOCUS_RING)}>
                        <Switch id="sw-marketing" defaultChecked aria-labelledby="sw-marketing-label" />
                        <FieldLabel id="sw-marketing-label" htmlFor="sw-marketing">
                            마케팅 정보 수신
                        </FieldLabel>
                    </Field>
                    <Field orientation="horizontal" className={cn('w-fit gap-2', FIELD_FOCUS_RING)}>
                        <Switch id="sw-alarm" aria-labelledby="sw-alarm-label" />
                        <FieldLabel id="sw-alarm-label" htmlFor="sw-alarm">
                            푸시 알림 받기
                        </FieldLabel>
                    </Field>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sw-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="sw-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">Switch 에 넘기는 속성입니다.</p>
                </div>
                <div className="bg-background border-border overflow-x-auto rounded-md border">
                    <table className="w-full text-left">
                        <caption className="sr-only">Switch Props 목록</caption>
                        <thead>
                            <tr className="border-border border-b bg-gray-100/25">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Component
                                </th>
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
                            {PROPS_ITEMS.map((item, index) => (
                                <tr key={item.name} className="border-border bg-background border-b last:border-b-0">
                                    {index === 0 ? (
                                        <th
                                            scope="rowgroup"
                                            rowSpan={PROPS_ITEMS.length}
                                            className="typo-caption-regular border-border text-muted-foreground border-r px-4 py-3 align-top font-mono font-normal"
                                        >
                                            Switch
                                        </th>
                                    ) : null}
                                    <th
                                        scope="row"
                                        className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                                    >
                                        {item.name}
                                    </th>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{item.desc}</td>
                                    <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                        {item.type}
                                    </td>
                                    <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                        {item.def}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SwitchGuidePage
