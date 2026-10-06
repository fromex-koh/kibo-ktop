// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {cn} from '@/lib/utils'
import {BaseCard} from '@/components/composite/base-card'
import {Switch} from '@/components/composite/control-switch'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {FIELD_FOCUS_RING} from '@/constants/form'
import {Field, FieldLabel} from '@/components/ui/field'
import SwitchFormDemo from './switch-form-demo'

export const metadata: Metadata = {title: '스위치 (Switch)'}

const USAGE_CODE = `import {Switch} from '@/components/composite/control-switch'

<Field orientation="horizontal" className={cn('w-fit gap-2', FIELD_FOCUS_RING)}>
  <Switch id="marketing" defaultChecked />
  <FieldLabel htmlFor="marketing">마케팅 정보 수신</FieldLabel>
</Field>`

const FORM_CODE = `const [enabled, setEnabled] = useState(false)

<form onSubmit={handleSubmit}>
  <Field orientation="horizontal" className={cn('w-fit gap-2', FIELD_FOCUS_RING)}>
    <Switch
      id="push-notification"
      name="pushNotification"
      checked={enabled}
      onCheckedChange={setEnabled}
    />
    <FieldLabel htmlFor="push-notification">푸시 알림 받기</FieldLabel>
  </Field>
</form>

new FormData(form).has('pushNotification')
// 켜짐: true, 꺼짐: false`

const SIZE_COLUMNS = [
    {key: 'size', header: 'Size', align: 'start', rowHeader: true},
    {key: 'height', header: '크기 (폭 × 높이)', align: 'start'},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
] as const

const SIZE_ROWS = [
    {key: 'lg', cells: [<code key="size">lg</code>, '72 × 40px', '넓은 설정 영역']},
    {key: 'md', cells: [<code key="size">md</code>, '64 × 40px', '일반 설정 (기본값)']},
    {key: 'sm', cells: [<code key="size">sm</code>, '56 × 32px', '목록 · 표처럼 촘촘한 영역']},
] as const

const API_COLUMNS = [
    {key: 'prop', header: 'Prop', align: 'start', rowHeader: true},
    {key: 'type', header: '값', align: 'start', wrap: true},
    {key: 'default', header: '기본값', align: 'start'},
    {key: 'note', header: '설명', align: 'start', wrap: true},
] as const

const API_ROWS = [
    {
        key: 'checked',
        cells: [
            <code key="p">checked / onCheckedChange</code>,
            <code key="t">boolean / (value) =&gt; void</code>,
            '—',
            '켜짐 상태(제어).',
        ],
    },
    {
        key: 'default',
        cells: [
            <code key="p">defaultChecked</code>,
            <code key="t">boolean</code>,
            <code key="d">false</code>,
            '초기 상태(비제어).',
        ],
    },
    {
        key: 'size',
        cells: [
            <code key="p">size</code>,
            <code key="t">lg | md | sm</code>,
            <code key="d">md</code>,
            '크기를 고릅니다(위 표 참고).',
        ],
    },
    {
        key: 'disabled',
        cells: [
            <code key="p">disabled</code>,
            <code key="t">boolean</code>,
            <code key="d">false</code>,
            '포커스 · 전환 · 폼 제출에서 빠집니다.',
        ],
    },
    {
        key: 'a11y',
        cells: [
            <code key="p">id / name / aria-*</code>,
            <code key="t">button attributes</code>,
            '—',
            'FieldLabel 연결 · 폼 필드 이름 · 접근성 속성. 켜짐일 때만 name 으로 제출됩니다.',
        ],
    },
] as const

const SwitchGuidePage = () => (
    <GuidePageShell
        title="스위치 (Switch)"
        description="바로 반영되는 켜짐 · 꺼짐 설정에 씁니다. 제출 전에 확인하는 동의 항목은 Checkbox 를 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="switch-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="switch-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>FieldLabel</code> 의 <code>htmlFor</code> 와 Switch 의 <code>id</code> 를 연결하고, Field
                        에 <code>FIELD_FOCUS_RING</code> 을 주면 포커스 표시가 라벨까지 감쌉니다. Switch 는{' '}
                        <code>composite/control-switch</code> 에서 가져오며(<code>ControlSwitch</code> 는 같은
                        컴포넌트의 다른 이름), <code>ui/switch</code> 는 스타일이 없는 원본이라 화면에서 직접 쓰지
                        않습니다.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <Field orientation="horizontal" className={cn('w-fit gap-2', FIELD_FOCUS_RING)}>
                        <Switch id="switch-marketing" defaultChecked />
                        <FieldLabel htmlFor="switch-marketing">마케팅 정보 수신</FieldLabel>
                    </Field>
                    <Field orientation="horizontal" className={cn('w-fit gap-2', FIELD_FOCUS_RING)}>
                        <Switch id="switch-push" />
                        <FieldLabel htmlFor="switch-push">푸시 알림 받기</FieldLabel>
                    </Field>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="switch-form" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="switch-form" className="typo-h4-bold">
                        폼 제출
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>name</code>을 주면 켜진 Switch 만 제출됩니다. 켜짐 여부는 <code>FormData.has()</code>로
                        읽습니다. 바로 저장하는 설정은 <code>onCheckedChange</code>의 값을 그대로 씁니다.
                    </p>
                </div>
                <SwitchFormDemo />
                <CodeBlock code={FORM_CODE} language="tsx" copyLabel="폼 제출 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="switch-size" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="switch-size" className="typo-h4-bold">
                        Size 와 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        기본 크기는 <code>md</code>입니다. <code>disabled</code>는 포커스와 전환을 막습니다.
                    </p>
                </div>
                <Table caption="Switch size 사용 기준" columns={SIZE_COLUMNS} rows={SIZE_ROWS} size="md" />
                <div className="border-subtle-3 flex flex-col gap-4 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">미리보기</h3>
                    <div className="flex flex-wrap items-center gap-8">
                        {(['lg', 'md', 'sm'] as const).map((size) => (
                            <div key={size} className="flex flex-col items-center gap-2">
                                <Switch size={size} defaultChecked aria-label={`${size} 켜짐`} />
                                <code>{size}</code>
                            </div>
                        ))}
                        <div className="flex flex-col items-center gap-2">
                            <Switch disabled aria-label="비활성 꺼짐" />
                            <code>disabled</code>
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="switch-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="switch-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        Radix Switch 가 <code>role=&quot;switch&quot;</code> 와 <code>aria-checked</code> 를 제공하며{' '}
                        <kbd>Space</kbd> 로 전환합니다[6.1.1, 8.2.1].
                    </li>
                    <li>
                        <code>FieldLabel</code> 연결이 기본입니다. 라벨이 없으면 <code>aria-label</code> 을
                        줍니다[7.4.1].
                    </li>
                    <li>
                        포커스는 <code>focus-visible</code> 외곽선으로 표시되며, 켜짐·꺼짐은 색 외에 손잡이 위치로도
                        구분됩니다[6.1.2, 5.3.1].
                    </li>
                    <li>
                        <code>disabled</code> 는 포커스를 받지 않으므로 이유가 필요하면 근처 텍스트로 안내합니다.
                    </li>
                    <li>전환 즉시 저장되는 설정에만 쓰고, 제출 전 확인이 필요한 동의는 Checkbox 를 씁니다[7.2.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="switch-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="switch-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        size 외에는 Radix Switch 속성을 그대로 받습니다.
                    </p>
                </div>
                <Table caption="Switch Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SwitchGuidePage
