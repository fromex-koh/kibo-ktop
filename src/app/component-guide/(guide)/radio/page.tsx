import type {Metadata} from 'next'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Label} from '@/components/kit/label'
import {RadioGroup, RadioGroupItem} from '@/components/kit/radio-group'

export const metadata: Metadata = {title: '라디오 (Radio)'}

const USAGE_CODE = `<RadioGroup defaultValue="card" aria-label="결제 수단">
  <div className={cn('flex w-fit max-w-90 items-center gap-2', FIELD_FOCUS_RING)}>
    <RadioGroupItem value="card" id="pay-card" />
    <Label htmlFor="pay-card">신용카드</Label>
  </div>
  <div className={cn('flex w-fit max-w-90 items-center gap-2', FIELD_FOCUS_RING)}>
    <RadioGroupItem value="transfer" id="pay-transfer" />
    <Label htmlFor="pay-transfer">계좌이체</Label>
  </div>
</RadioGroup>`

const DEPTH1_CODE = `<div className={cn('flex w-fit max-w-90 items-center gap-2', FIELD_FOCUS_RING)}>
  <RadioGroupItem value="r1" id="r-1" />
  <Label htmlFor="r-1">라디오버튼</Label>
</div>`

const DEPTH2_CODE = `<div className={cn('flex w-fit max-w-90 flex-col gap-1', FIELD_FOCUS_RING)}>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="r2" id="r-2" aria-describedby="r-2-desc" />
    <Label htmlFor="r-2" className="font-bold text-foreground">라디오버튼</Label>
  </div>
  {/* 설명은 제목 아래로 들여쓰기(ml-8). 폭은 감싸는 wrapper 의 max-w-90(360)이 잡는다. */}
  <p id="r-2-desc" className="typo-body-xl-regular text-label-foreground ml-8">
    2depth 스타일의 부가적인 설명이 들어갈 경우 해당 예시처럼 사용됩니다.
  </p>
</div>`

// Figma radio 의 두 축 — check(off/on) × state(default/disabled).
const CHECK_ROWS = [
    {key: 'off', label: 'Off (미선택)', checked: false},
    {key: 'on', label: 'On (선택)', checked: true},
] as const

const STATE_COLS = [
    {key: 'default', label: 'Default', disabled: false},
    {key: 'disabled', label: 'Disabled', disabled: true},
] as const

// 라디오는 shadcn RadioGroup(그룹) + RadioGroupItem(원) + Label(텍스트) 직접 조합으로 쓴다 — 별도
// 래퍼 컴포넌트를 만들지 않는다([SC-02], 프로젝트 원칙). 라벨은 htmlFor↔id 로 연결해 클릭·스크린리더
// 접근성을 확보하고(7.4.1), 2depth 부가설명은 aria-describedby 로 연결한다. 상태 매트릭스에서는 각 셀을
// 최소 RadioGroup 으로 감싸 개별 선택/비활성 상태를 시연한다(라디오는 그룹 소속이라야 렌더된다).
const RadioGuidePage = () => (
    <GuidePageShell
        title="라디오 (Radio)"
        description="shadcn RadioGroup 프리미티브입니다. Label 과 조합해 단일 선택 항목을 구성합니다."
    >
        <section aria-labelledby="radio-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="radio-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">RadioGroup</code> 안에 <code className="font-mono">RadioGroupItem</code>{' '}
                    을 넣어 단일 선택을 만듭니다. 텍스트는 shadcn <code className="font-mono">Label</code> 을{' '}
                    <code className="font-mono">htmlFor</code>↔<code className="font-mono">id</code> 로 연결합니다.
                </p>
            </div>
            <RadioGroup defaultValue="card" aria-label="결제 수단" className="flex flex-col gap-3">
                <div className={cn('flex w-fit max-w-90 items-center gap-2', FIELD_FOCUS_RING)}>
                    <RadioGroupItem value="card" id="pay-card" />
                    <Label htmlFor="pay-card">신용카드</Label>
                </div>
                <div className={cn('flex w-fit max-w-90 items-center gap-2', FIELD_FOCUS_RING)}>
                    <RadioGroupItem value="transfer" id="pay-transfer" />
                    <Label htmlFor="pay-transfer">계좌이체</Label>
                </div>
            </RadioGroup>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="radio-state" className="flex flex-col gap-4">
            <div>
                <h2 id="radio-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    선택(off/on) × 상태(default/disabled) 조합입니다. 선택됨은{' '}
                    <code className="font-mono">blue.500</code> 원에 흰 점, 비활성은 회색 원(
                    <code className="font-mono">gray.100</code>)으로 표현됩니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">라디오 선택·상태 조합 미리보기</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                선택
                            </th>
                            {STATE_COLS.map((col) => (
                                <th key={col.key} scope="col" className="typo-body-l-medium px-4 py-3">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {CHECK_ROWS.map((row) => (
                            <tr key={row.key} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-middle font-mono font-normal whitespace-nowrap"
                                >
                                    {row.label}
                                </th>
                                {STATE_COLS.map((col) => (
                                    <td key={col.key} className="px-4 py-3 align-middle">
                                        <div className="flex flex-col items-start gap-2">
                                            <RadioGroup
                                                defaultValue={row.checked ? 'on' : 'off'}
                                                disabled={col.disabled}
                                                aria-label={`${row.label} ${col.label}`}
                                                className="w-auto"
                                            >
                                                <div
                                                    className={cn(
                                                        'flex w-fit max-w-90 items-center gap-2',
                                                        FIELD_FOCUS_RING,
                                                    )}
                                                >
                                                    <RadioGroupItem value="on" id={`radio-${row.key}-${col.key}`} />
                                                    <Label htmlFor={`radio-${row.key}-${col.key}`}>라디오버튼</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="radio-depth" className="flex flex-col gap-4">
            <div>
                <h2 id="radio-depth" className="typo-h4-bold">
                    라벨 구성 (Depth)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    별도 컴포넌트가 아니라 <code className="font-mono">RadioGroupItem</code> +{' '}
                    <code className="font-mono">Label</code> (+ 설명 <code className="font-mono">&lt;p&gt;</code>)
                    조합으로 두 형태를 만듭니다.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                <RadioGroup defaultValue="r1" aria-label="1depth 라디오 예시" className="flex flex-col gap-2">
                    <h3 className="typo-body-l-medium text-foreground">1depth — 라벨만</h3>
                    <div className={cn('flex w-fit max-w-90 items-center gap-2', FIELD_FOCUS_RING)}>
                        <RadioGroupItem value="r1" id="depth-r1" />
                        <Label htmlFor="depth-r1">라디오버튼</Label>
                    </div>
                    <CodeBlock code={DEPTH1_CODE} language="tsx" copyLabel="복사" />
                </RadioGroup>

                <RadioGroup defaultValue="r2" aria-label="2depth 라디오 예시" className="flex flex-col gap-2">
                    <h3 className="typo-body-l-medium text-foreground">2depth — 제목 + 설명</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        제목은 <code className="font-mono">Label</code>(볼드), 설명은 별도{' '}
                        <code className="font-mono">&lt;p&gt;</code> 로 두고{' '}
                        <code className="font-mono">aria-describedby</code> 로 연결합니다. 원은 제목과 세로 중앙정렬(
                        <code className="font-mono">items-center</code>)하고, 설명은 제목 아래로 들여써 감싸는 wrapper(
                        <code className="font-mono">max-w-90</code>=360) 폭에서 줄바꿈됩니다.
                    </p>
                    <div className={cn('flex w-fit max-w-90 flex-col gap-1', FIELD_FOCUS_RING)}>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="r2" id="depth-r2" aria-describedby="depth-r2-desc" />
                            <Label htmlFor="depth-r2" className="text-foreground font-bold">
                                라디오버튼
                            </Label>
                        </div>
                        <p id="depth-r2-desc" className="typo-body-xl-regular text-label-foreground ml-8">
                            2depth 스타일의 부가적인 설명이 들어갈 경우 해당 예시처럼 사용됩니다.
                        </p>
                    </div>
                    <CodeBlock code={DEPTH2_CODE} language="tsx" copyLabel="복사" />
                </RadioGroup>
            </div>
        </section>

        <section aria-labelledby="radio-props" className="flex flex-col gap-4">
            <div>
                <h2 id="radio-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    RadioGroup(그룹)·RadioGroupItem(개별 원)에서 자주 쓰는 속성입니다.
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
                                name: 'defaultValue',
                                desc: 'RadioGroup — 비제어 그룹의 초기 선택값(RadioGroupItem 의 value).',
                                def: '-',
                                control: 'string',
                            },
                            {
                                name: 'value',
                                desc: 'RadioGroupItem 은 고유 value 를, RadioGroup 은 제어 시 현재 선택값을 받습니다.',
                                def: '-',
                                control: 'string',
                            },
                            {
                                name: 'onValueChange',
                                desc: 'RadioGroup — 선택이 바뀔 때 호출되는 콜백입니다.',
                                def: '-',
                                control: '(value) => void',
                            },
                            {
                                name: 'disabled',
                                desc: 'RadioGroup(전체) 또는 RadioGroupItem(개별)을 비활성화합니다.',
                                def: 'false',
                                control: 'boolean',
                            },
                            {
                                name: 'className',
                                desc: '추가 클래스명으로 스타일 확장',
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

export default RadioGuidePage
