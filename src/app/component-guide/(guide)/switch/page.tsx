import type {Metadata} from 'next'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Label} from '@/components/kit/label'
import {Switch} from '@/components/kit/switch'

export const metadata: Metadata = {title: '스위치 (Switch)'}

const USAGE_CODE = `<div className={cn('flex w-fit items-center gap-2', FIELD_FOCUS_RING)}>
  <Switch id="marketing" defaultChecked />
  <Label htmlFor="marketing">마케팅 정보 수신</Label>
</div>`

const PROPS_ITEMS = [
    ['checked · onCheckedChange', '켜짐 상태(제어). 비제어면 defaultChecked 로 초기값만.', 'boolean · (v) => void'],
    ['defaultChecked', '비제어 초기 상태.', 'boolean'],
    ['size', '크기. default=40×24, sm(컴팩트)=32×20.', "'default' | 'sm'"],
    ['disabled', '비활성(흐림 + 클릭 불가).', 'boolean'],
    ['id · name · aria-*', 'Radix 루트(button role="switch")에 전달. Label 과 htmlFor↔id 로 연결.', 'button 속성'],
] as const

// 스위치 — shadcn Switch 프리미티브를 Figma 토글 스위치 스타일로 재스킨한 styled copy(kit).
// 상태(on/off)·전환 애니메이션·키보드(Space/Enter)·포커스는 radix 원형 그대로다.
const SwitchGuidePage = () => (
    <GuidePageShell
        title="스위치 (Switch)"
        description="켜짐/꺼짐 두 상태를 즉시 전환하는 토글입니다. 설정처럼 그 자리에서 바로 반영되는 on/off 에 씁니다(폼 제출이 필요하면 Checkbox 를 고려)."
    >
        <section aria-labelledby="sw-state" className="flex flex-col gap-4">
            <div>
                <h2 id="sw-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    꺼짐(off)·켜짐(on) 두 상태입니다. off 는 <code className="font-mono">gray-400</code>, on 은{' '}
                    <code className="font-mono">primary</code>(brand blue) 트랙에 흰 thumb 입니다. 클릭해서 전환해
                    보세요.
                </p>
            </div>
            <div className="border-border flex flex-wrap items-center gap-8 rounded-md border p-6">
                <div className="flex flex-col items-center gap-2">
                    <Switch aria-label="꺼짐 예시" />
                    <span className="typo-caption-regular text-muted-foreground font-mono">off</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Switch defaultChecked aria-label="켜짐 예시" />
                    <span className="typo-caption-regular text-muted-foreground font-mono">on</span>
                </div>
            </div>
        </section>

        <section aria-labelledby="sw-size" className="flex flex-col gap-4">
            <div>
                <h2 id="sw-size" className="typo-h4-bold">
                    사이즈 (Size)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">default</code>(40×24)과 밀도 높은 UI 용{' '}
                    <code className="font-mono">sm</code>(32×20)입니다.
                </p>
            </div>
            <div className="border-border flex flex-wrap items-center gap-8 rounded-md border p-6">
                <div className="flex flex-col items-center gap-2">
                    <Switch defaultChecked aria-label="default 크기" />
                    <span className="typo-caption-regular text-muted-foreground font-mono">default</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Switch size="sm" defaultChecked aria-label="sm 크기" />
                    <span className="typo-caption-regular text-muted-foreground font-mono">sm</span>
                </div>
            </div>
        </section>

        <section aria-labelledby="sw-disabled" className="flex flex-col gap-4">
            <div>
                <h2 id="sw-disabled" className="typo-h4-bold">
                    비활성 (Disabled)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">disabled</code> — 흐리게(opacity) 표시하고 클릭을 막습니다.
                </p>
            </div>
            <div className="border-border flex flex-wrap items-center gap-8 rounded-md border p-6">
                <div className="flex flex-col items-center gap-2">
                    <Switch disabled aria-label="비활성 꺼짐" />
                    <span className="typo-caption-regular text-muted-foreground font-mono">disabled · off</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Switch disabled defaultChecked aria-label="비활성 켜짐" />
                    <span className="typo-caption-regular text-muted-foreground font-mono">disabled · on</span>
                </div>
            </div>
        </section>

        <section aria-labelledby="sw-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="sw-usage" className="typo-h4-bold">
                    사용 예시 (Label 조합)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">Label</code> 과 <code className="font-mono">htmlFor</code>↔
                    <code className="font-mono">id</code> 로 연결합니다. 라벨을 눌러도 토글됩니다.
                </p>
            </div>
            <div className="border-border flex flex-col gap-4 rounded-md border p-6">
                <div className={cn('flex w-fit items-center gap-2', FIELD_FOCUS_RING)}>
                    <Switch id="sw-marketing" defaultChecked />
                    <Label htmlFor="sw-marketing">마케팅 정보 수신</Label>
                </div>
                <div className={cn('flex w-fit items-center gap-2', FIELD_FOCUS_RING)}>
                    <Switch id="sw-alarm" />
                    <Label htmlFor="sw-alarm">푸시 알림 받기</Label>
                </div>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sw-props" className="flex flex-col gap-4">
            <div>
                <h2 id="sw-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">Switch 에 넘기는 속성입니다.</p>
            </div>
            <dl className="flex flex-col gap-2">
                {PROPS_ITEMS.map(([name, desc, type]) => (
                    <div key={name} className="flex flex-col gap-0.5">
                        <dt className="typo-body-l-medium text-primary font-mono">
                            {name}
                            <span className="text-muted-foreground ml-2 font-normal">{type}</span>
                        </dt>
                        <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                    </div>
                ))}
            </dl>
        </section>
    </GuidePageShell>
)

export default SwitchGuidePage
