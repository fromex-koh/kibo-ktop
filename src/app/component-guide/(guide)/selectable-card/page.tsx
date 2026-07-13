import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {SelectableCardBadgeDemo, SelectableCardRadioDemo, SelectableCardStatesDemo} from './selectable-card-demo'

export const metadata: Metadata = {title: '선택 카드 (SelectableCard)'}

const RADIO_CODE = `<SelectableCardGroup value={value} onValueChange={setValue} className="grid-cols-2 gap-3">
  <SelectableCard control="radio" value="required" badges={<Badge …>필수</Badge>}>
    필수항목만 동의
  </SelectableCard>
  <SelectableCard control="radio" value="all" badges={<><Badge>필수</Badge><Badge>선택</Badge></>}>
    전체 항목 동의
  </SelectableCard>
</SelectableCardGroup>`

const CHECKBOX_CODE = `<SelectableCard control="checkbox" checked={checked} onCheckedChange={setChecked}>
  전체 항목 동의
</SelectableCard>`

// Props 설명 — [이름, 설명, 타입]
const PROPS_ITEMS = [
    [
        'control',
        '내장 컨트롤. radio 는 감싼 <RadioGroup> 안에서 단일 선택, checkbox 는 독립 선택.',
        "'radio' | 'checkbox'",
    ],
    ['value', 'radio: 그룹 안 항목 값 / checkbox: 폼 제출 값.', 'string'],
    ['checked·onCheckedChange', 'checkbox 제어 상태.', 'boolean · (v) => void'],
    ['disabled', '비활성화(컨트롤 비활성 + 카드 흐림).', 'boolean'],
    ['readOnly', '읽기전용(상호작용만 막음, 흐리지 않음).', 'boolean'],
    ['badges', '우측 뱃지 슬롯.', 'ReactNode'],
    ['labelClassName', '라벨 타이포 override(기본 typo-title-l-bold).', 'string'],
] as const

// 선택 카드 — kit Radio/Checkbox + Card + Badge 를 합성한 composite. 카드 전체가 선택 대상이다.
const SelectableCardGuidePage = () => (
    <GuidePageShell
        title="선택 카드 (SelectableCard)"
        description="카드 안에 라디오/체크박스를 품은 선택 컨트롤입니다. 카드 전체가 하나의 선택 대상이고, 선택되면 연한 파란 배경 + 파란 테두리로 강조됩니다. control 로 라디오(단일)·체크박스(다중)를 정합니다."
    >
        <section aria-labelledby="sc-state" className="flex flex-col gap-4">
            <div>
                <h2 id="sc-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    체크전·체크후·비활성·읽기전용입니다. <code className="font-mono">disabled</code> 는 카드가 흐려지고,{' '}
                    <code className="font-mono">readOnly</code> 는 값·모양은 유지한 채 상호작용만 막힙니다.
                </p>
            </div>
            <SelectableCardStatesDemo />
        </section>

        <section aria-labelledby="sc-badge" className="flex flex-col gap-4">
            <div>
                <h2 id="sc-badge" className="typo-h4-bold">
                    뱃지 (Badge)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    우측에 뱃지를 1개(필수) 또는 2개(필수·선택) 붙일 수 있습니다.{' '}
                    <code className="font-mono">badges</code> 슬롯으로 넘깁니다.
                </p>
            </div>
            <SelectableCardBadgeDemo />
        </section>

        <section aria-labelledby="sc-radio" className="flex flex-col gap-4">
            <div>
                <h2 id="sc-radio" className="typo-h4-bold">
                    라디오 그룹 (단일 선택 · 2단)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">control=&quot;radio&quot;</code> 카드를{' '}
                    <code className="font-mono">SelectableCardGroup</code>(kit RadioGroup 래퍼) 으로 감싸면 하나만
                    선택됩니다. Figma 처럼 <code className="font-mono">grid-cols-2</code> 로 2단 배치했습니다.
                </p>
            </div>
            <SelectableCardRadioDemo />
            <CodeBlock code={RADIO_CODE} language="tsx" copyLabel="복사" />
            <CodeBlock code={CHECKBOX_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sc-props" className="flex flex-col gap-4">
            <div>
                <h2 id="sc-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">SelectableCard 에 넘기는 속성입니다.</p>
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

export default SelectableCardGuidePage
