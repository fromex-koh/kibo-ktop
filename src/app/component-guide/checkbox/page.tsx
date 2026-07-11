import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import CopyChip from '@/components/guide/copy-chip'
import GuidePage from '@/components/guide/guide-page'
import {Checkbox} from '@/components/kit/checkbox'
import {Label} from '@/components/kit/label'

export const metadata: Metadata = {title: '체크박스 (Checkbox)'}

const USAGE_CODE = `<div className="flex max-w-90 items-center gap-2">
  <Checkbox id="terms" defaultChecked />
  <Label htmlFor="terms">이용약관에 동의합니다</Label>
</div>`

const DEPTH1_CODE = `<div className="flex max-w-90 items-center gap-2">
  <Checkbox id="agree-1" />
  <Label htmlFor="agree-1">체크박스</Label>
</div>`

const DEPTH2_CODE = `<div className="flex max-w-90 flex-col gap-1">
  <div className="flex items-center gap-2">
    <Checkbox id="agree-2" aria-describedby="agree-2-desc" />
    <Label htmlFor="agree-2" className="font-bold text-foreground">체크박스</Label>
  </div>
  {/* 설명은 제목 아래로 들여쓰기(ml-8 = 체크박스 24 + gap 8). 폭은 감싸는 wrapper 의 max-w-90(360)이 잡는다. */}
  <p id="agree-2-desc" className="typo-body-xl-regular text-label-foreground ml-8">
    2depth 스타일의 부가적인 설명이 들어갈 경우 해당 예시처럼 사용됩니다.
  </p>
</div>`

// Figma checkbox_item 의 두 축 — check(off/on) × state(default/disabled).
const CHECK_ROWS = [
    {key: 'off', label: 'Off (미체크)', checked: false},
    {key: 'on', label: 'On (체크)', checked: true},
] as const

const STATE_COLS = [
    {key: 'default', label: 'Default', disabled: false},
    {key: 'disabled', label: 'Disabled', disabled: true},
] as const

// 체크박스는 shadcn Checkbox(박스) + Label(텍스트) 직접 조합으로 쓴다 — 별도 래퍼 컴포넌트를
// 만들지 않는다([SC-02], 프로젝트 원칙). 라벨은 반드시 htmlFor↔id 로 연결해 클릭·스크린리더 접근성을
// 확보하고(7.4.1), 2depth 부가설명은 aria-describedby 로 연결한다.
const CheckboxGuidePage = () => (
    <GuidePage
        title="체크박스 (Checkbox)"
        description="shadcn Checkbox 프리미티브입니다. Label 과 조합해 선택 항목을 구성합니다."
    >
        <section aria-labelledby="checkbox-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="checkbox-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">Checkbox</code> 는 박스만 담당하고, 텍스트는 shadcn{' '}
                    <code className="font-mono">Label</code> 을 <code className="font-mono">htmlFor</code>↔
                    <code className="font-mono">id</code> 로 연결해 함께 씁니다. 라벨을 클릭해도 토글됩니다.
                </p>
            </div>
            <div className="flex max-w-90 items-center gap-2">
                <Checkbox id="terms" defaultChecked />
                <Label htmlFor="terms">이용약관에 동의합니다</Label>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="checkbox-state" className="flex flex-col gap-4">
            <div>
                <h2 id="checkbox-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    선택(off/on) × 상태(default/disabled) 조합입니다. 체크됨은{' '}
                    <code className="font-mono">blue.500</code>, 비활성은 회색 박스(
                    <code className="font-mono">gray.100</code>)로 표현됩니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">체크박스 선택·상태 조합 미리보기</caption>
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
                                            <Checkbox
                                                id={`cb-${row.key}-${col.key}`}
                                                defaultChecked={row.checked}
                                                disabled={col.disabled}
                                                aria-label={`${row.label} ${col.label}`}
                                            />
                                            <CopyChip
                                                value={`defaultChecked={${row.checked}}${col.disabled ? ' disabled' : ''}`}
                                                label="복사"
                                            />
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="checkbox-depth" className="flex flex-col gap-4">
            <div>
                <h2 id="checkbox-depth" className="typo-h4-bold">
                    라벨 구성 (Depth)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    별도 컴포넌트가 아니라 <code className="font-mono">Checkbox</code> +{' '}
                    <code className="font-mono">Label</code> (+ 설명 <code className="font-mono">&lt;p&gt;</code>)
                    조합으로 두 형태를 만듭니다.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">1depth — 라벨만</h3>
                <div className="flex max-w-90 items-center gap-2">
                    <Checkbox id="depth-1" />
                    <Label htmlFor="depth-1">체크박스</Label>
                </div>
                <CodeBlock code={DEPTH1_CODE} language="tsx" copyLabel="복사" />
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">2depth — 제목 + 설명</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    제목은 <code className="font-mono">Label</code>(볼드), 설명은 별도{' '}
                    <code className="font-mono">&lt;p&gt;</code> 로 두고{' '}
                    <code className="font-mono">aria-describedby</code> 로 연결합니다. 체크박스는 제목과 세로 중앙정렬(
                    <code className="font-mono">items-center</code>)하고, 설명은 제목 아래로 들여써 감싸는 wrapper(
                    <code className="font-mono">max-w-90</code>=360) 폭에서 줄바꿈됩니다.
                </p>
                <div className="flex max-w-90 flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Checkbox id="depth-2" aria-describedby="depth-2-desc" />
                        <Label htmlFor="depth-2" className="text-foreground font-bold">
                            체크박스
                        </Label>
                    </div>
                    {/* 설명은 제목 아래로 들여쓰기(ml-8 = 체크박스 24 + gap 8). 폭은 감싸는 wrapper 의 max-w-90(360)이 잡는다. */}
                    <p id="depth-2-desc" className="typo-body-xl-regular text-label-foreground ml-8">
                        2depth 스타일의 부가적인 설명이 들어갈 경우 해당 예시처럼 사용됩니다.
                    </p>
                </div>
                <CodeBlock code={DEPTH2_CODE} language="tsx" copyLabel="복사" />
            </div>
        </section>

        <section aria-labelledby="checkbox-props" className="flex flex-col gap-4">
            <div>
                <h2 id="checkbox-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Checkbox(Radix 기반)에서 자주 쓰는 속성입니다.
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
                                name: 'checked',
                                desc: '제어 컴포넌트로 쓸 때 선택 여부. onCheckedChange 와 함께 사용합니다.',
                                def: '-',
                                control: 'boolean | "indeterminate"',
                            },
                            {
                                name: 'defaultChecked',
                                desc: '비제어 컴포넌트의 초기 선택 여부입니다.',
                                def: 'false',
                                control: 'boolean',
                            },
                            {
                                name: 'onCheckedChange',
                                desc: '선택 상태가 바뀔 때 호출되는 콜백입니다.',
                                def: '-',
                                control: '(checked) => void',
                            },
                            {
                                name: 'disabled',
                                desc: '비활성 상태. 회색 박스로 표시되고 상호작용이 막힙니다.',
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
    </GuidePage>
)

export default CheckboxGuidePage
