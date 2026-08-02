import type {Metadata} from 'next'
import {cn} from '@/lib/utils'
import {BaseCard} from '@/components/composite/base-card'
import {Switch} from '@/components/composite/control-switch'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {FIELD_FOCUS_RING} from '@/constants/publishing-guide'
import {Field, FieldLabel} from '@/components/ui/field'
import SwitchFormDemo from './switch-form-demo'

export const metadata: Metadata = {title: '스위치 (Switch)'}

const USAGE_CODE = `<Field orientation="horizontal" className={cn('w-fit gap-2', FIELD_FOCUS_RING)}>
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
    {key: 'height', header: '높이', align: 'start'},
    {key: 'use', header: '사용 기준', align: 'start', wrap: true},
] as const

const SIZE_ROWS = [
    {key: 'lg', cells: [<code key="size">lg</code>, '40px', '강조가 필요한 넓은 설정 영역']},
    {key: 'md', cells: [<code key="size">md</code>, '36px', '일반 설정 — 기본값']},
    {key: 'sm', cells: [<code key="size">sm</code>, '32px', '밀도 높은 목록이나 표']},
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
            '제어 상태',
        ],
    },
    {
        key: 'default',
        cells: [
            <code key="p">defaultChecked</code>,
            <code key="t">boolean</code>,
            <code key="d">false</code>,
            '비제어 초기 상태',
        ],
    },
    {
        key: 'size',
        cells: [<code key="p">size</code>, <code key="t">lg | md | sm</code>, <code key="d">md</code>, '트랙 크기'],
    },
    {
        key: 'disabled',
        cells: [
            <code key="p">disabled</code>,
            <code key="t">boolean</code>,
            <code key="d">false</code>,
            '상호작용 비활성',
        ],
    },
    {
        key: 'a11y',
        cells: [
            <code key="p">id / name / aria-*</code>,
            <code key="t">button attributes</code>,
            '—',
            '라벨·폼·접근성 연결',
        ],
    },
] as const

const SwitchGuidePage = () => (
    <GuidePageShell
        title="스위치 (Switch)"
        description="설정이 즉시 반영되는 켜짐·꺼짐 상태에 사용합니다. 제출 전 확인이 필요한 동의 항목은 Checkbox를 사용합니다."
    >
        <BaseCard variant="outlined">
            <section aria-labelledby="switch-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="switch-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        FieldLabel의 htmlFor와 Switch의 id를 연결합니다. 라벨을 클릭해도 전환되며 포커스링은 라벨과
                        컨트롤을 함께 감쌉니다.
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
                    <p className="typo-body-l-regular text-muted-foreground">
                        name을 지정하면 켜진 Switch만 FormData에 포함됩니다. 제출 시 FormData.has()로 boolean으로
                        변환하고, 즉시 저장하는 설정은 onCheckedChange의 boolean 값을 직접 사용합니다.
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
                        Size와 상태
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기본 크기는 md입니다. disabled는 포커스와 상태 변경을 막습니다.
                    </p>
                </div>
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
                <Table caption="Switch size 사용 기준" columns={SIZE_COLUMNS} rows={SIZE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="switch-api" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="switch-api" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        프로젝트 Switch wrapper의 주요 속성입니다.
                    </p>
                </div>
                <Table caption="Switch Props API" columns={API_COLUMNS} rows={API_ROWS} size="md" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SwitchGuidePage
