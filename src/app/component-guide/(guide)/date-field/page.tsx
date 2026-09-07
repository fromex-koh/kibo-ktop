import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '날짜 칸 (DateField)'}

const USAGE_CODE = `{/* 라벨 + 달력 한 칸. Field 와 DatePicker 를 묶고 검사까지 함께 든다 */}
<DateField id="foundedAt" name="foundedAt" label="설립일" required />

{/* 연월까지만 고르는 칸 */}
<DateField id="careerStart" name="careerStart" label="근무시작 년월" granularity="month" />`

const RANGE_CODE = `{/* 시작·종료 두 칸을 서로 짝지어 순서를 검사한다 */}
<DateField
  id="workStart"
  name="workStart"
  label="근무시작 년월"
  granularity="month"
  rangeEnd={{name: 'workEnd', message: '근무종료 년월보다 앞선 달을 고르세요.'}}
  onInvalidSelect={(violation) => openNotice(violation)}
/>
<DateField
  id="workEnd"
  name="workEnd"
  label="근무종료 년월"
  granularity="month"
  rangeStart={{name: 'workStart', message: '근무시작 년월보다 뒤인 달을 고르세요.'}}
/>`

const PROPS_ITEMS = [
    ['DateField', 'id', '라벨·메시지와 컨트롤을 잇는 id 입니다.', '-', 'string'],
    ['DateField', 'name', '폼에 담길 이름입니다.', '-', 'string'],
    ['DateField', 'label', '칸 위에 붙는 라벨입니다.', '-', 'string'],
    ['DateField', 'required', '필수 표시와 컨트롤의 required 를 함께 켭니다.', 'false', 'boolean'],
    ['DateField', 'helper', '칸 아래 도움말입니다.', 'undefined', 'string'],
    [
        'DateField',
        'granularity',
        "고르는 단위입니다. 라벨이 '년월'인 칸은 month 로 두어 일까지 고르지 않게 합니다.",
        "'day'",
        "'day' | 'month'",
    ],
    [
        'DateField',
        'rangeEnd',
        '이 칸이 시작일일 때 짝이 되는 종료일입니다. 뒤를 고르면 그 message 가 뜨고 제출이 막힙니다.',
        'undefined',
        '{name: string; message: string}',
    ],
    [
        'DateField',
        'rangeStart',
        '이 칸이 종료일일 때 짝이 되는 시작일입니다.',
        'undefined',
        '{name: string; message: string}',
    ],
    [
        'DateField',
        'onInvalidSelect',
        "짝과 어긋나는 값을 고른 직후 한 번 부릅니다('order' 순서 어긋남 · 'same' 같은 단위). 팝업으로 즉시 알릴 때 씁니다.",
        'undefined',
        "(violation: 'order' | 'same') => void",
    ],
] as const

const DateFieldGuidePage = () => (
    <GuidePageShell
        title="날짜 칸 (DateField)"
        description="폼 안에서 날짜를 고르는 한 칸입니다. 라벨·달력·검사 메시지를 한 덩어리로 묶어, 화면은 어떤 날짜를 묻는지만 적습니다."
    >
        <BaseCard>
            <section aria-labelledby="date-field-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="date-field-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        달력 자체의 생김새와 조작은 <code className="font-mono">DatePicker</code> 가 갖고, 이 컴포넌트는
                        폼 안에서의 라벨·검사·메시지를 맡습니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-field-rule" className="flex flex-col gap-4">
                <div>
                    <h2 id="date-field-rule" className="typo-h4-bold">
                        검사 규칙
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        한 칸에 메시지 두 줄은 읽기 어려우므로 먼저 걸리는 것 하나만 보여 줍니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        오늘 이후는 달력에서 아예 막습니다(<code className="font-mono">maxDate</code>). 월 단위에서는
                        이번 달 1일이 상한이라 이번 달 안의 날짜는 모두 고를 수 있습니다.
                    </li>
                    <li>시작과 종료가 같은 단위면 기간이 성립하지 않으므로 두 칸 모두에 같은 메시지가 뜹니다.</li>
                    <li>
                        짝과의 앞뒤 순서는 달력에서 막지 않고 고른 뒤 메시지로 알립니다 — 아예 막으면 왜 안 되는지 알 수
                        없습니다.
                    </li>
                    <li>
                        고른 순간의 알림은 <code className="font-mono">onInvalidSelect</code>(팝업)가 맡고, 칸 밑에는
                        빨간 테두리만 남깁니다. 제출할 때 걸리면 그때는 다른 칸처럼 칸 밑에 메시지가 붙습니다.
                    </li>
                    <li>짝을 고쳐 이 칸이 함께 맞게 되면 제출 때 남은 메시지를 거둡니다.</li>
                </ul>
                <CodeBlock code={RANGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-field-a11y" className="flex flex-col gap-3">
                <h2 id="date-field-a11y" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        오류가 있으면 <code className="font-mono">aria-invalid</code> 가 걸리고 제출은{' '}
                        <code className="font-mono">setCustomValidity</code> 로 막힙니다 — 브라우저 검사와 화면 메시지가
                        같은 사유를 씁니다[7.4.2].
                    </li>
                    <li>
                        도움말은 <code className="font-mono">aria-describedby</code> 로 이어집니다.
                    </li>
                    <li>달력의 포커스 관리·키보드 조작은 DatePicker 가 맡습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-field-props" className="flex flex-col gap-4">
                <h2 id="date-field-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="DateField Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DateFieldGuidePage
