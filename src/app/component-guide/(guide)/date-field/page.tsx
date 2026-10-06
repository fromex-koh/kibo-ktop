// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '날짜 칸 (DateField)'}

const USAGE_CODE = `import {DateField} from '@/components/composite/date-field'

{/* 라벨 + 달력 한 칸 */}
<DateField id="foundedAt" name="foundedAt" label="설립일" required />

{/* 연월까지만 고르는 칸 */}
<DateField id="careerStart" name="careerStart" label="근무시작 년월" granularity="month" />`

const RANGE_CODE = `{/* 서로를 짝으로 지정하면 순서를 검사한다 */}
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

const RULE_COLUMNS = [
    {key: 'case', header: '경우', align: 'start', rowHeader: true},
    {key: 'pick', header: '달력에서', align: 'start'},
    {key: 'result', header: '결과', align: 'start', wrap: true},
] as const

const RULE_ROWS = [
    {
        key: 'future',
        cells: ['오늘 이후 (월 단위는 이번 달 이후)', '고를 수 없음', '이번 달 안의 날짜는 모두 고를 수 있습니다.'],
    },
    {
        key: 'same',
        cells: [
            '시작과 종료가 같은 날 · 같은 연월',
            '고를 수 있음',
            '두 칸 모두에 같은 메시지가 뜨고 제출이 막힙니다.',
        ],
    },
    {
        key: 'order',
        cells: ['짝과 앞뒤 순서가 어긋남', '고를 수 있음', 'rangeStart · rangeEnd 의 message 가 뜨고 제출이 막힙니다.'],
    },
] as const

const PROPS_ITEMS = [
    ['DateField', 'id', '라벨 · 메시지와 잇는 id.', '-', 'string'],
    ['DateField', 'name', '폼에 담길 이름.', '-', 'string'],
    ['DateField', 'label', '칸 위 라벨.', '-', 'string'],
    ['DateField', 'required', '필수 표시와 필수 검사를 함께 켭니다.', 'false', 'boolean'],
    ['DateField', 'helper', '칸 아래 도움말.', 'undefined', 'string'],
    ['DateField', 'granularity', "고르는 단위. 라벨이 '년월'인 칸은 month.", "'day'", "'day' | 'month'"],
    [
        'DateField',
        'rangeEnd',
        '이 칸이 시작일일 때 짝이 되는 종료일 칸. 종료일보다 뒤를 고르면 message 가 뜨고 제출이 막힙니다.',
        'undefined',
        '{name: string; message: string}',
    ],
    [
        'DateField',
        'rangeStart',
        '이 칸이 종료일일 때 짝이 되는 시작일 칸. 시작일보다 앞을 고르면 message 가 뜨고 제출이 막힙니다.',
        'undefined',
        '{name: string; message: string}',
    ],
    [
        'DateField',
        'onInvalidSelect',
        "짝과 어긋나는 값을 고른 직후 한 번 호출됩니다. 'order' 는 순서 어긋남, 'same' 은 같은 단위.",
        'undefined',
        "(violation: 'order' | 'same') => void",
    ],
] as const

const DateFieldGuidePage = () => (
    <GuidePageShell title="날짜 칸 (DateField)" description="라벨 · 달력 · 검사 메시지를 묶은 날짜 입력 한 칸입니다.">
        <BaseCard>
            <section aria-labelledby="date-field-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-field-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        설립일 · 근무 시작 · 종료처럼 지난 일을 적는 칸에 씁니다. 라벨과 필수 표시는 내부{' '}
                        <code>Field</code>(<code>composite/form-fields</code>)가 그리고, 폼 값 Provider(
                        <code>FormValuesProvider</code>) 안에서만 동작합니다. 달력의 모양과 조작은{' '}
                        <Link href="/component-guide/date-picker" className="text-primary-strong underline">
                            DatePicker
                        </Link>
                        를 참고합니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-field-rule" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-field-rule" className="typo-h4-bold">
                        검사 규칙
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        한 칸에는 먼저 걸린 메시지 하나만 나옵니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">규칙과 결과</h3>
                        <Table caption="DateField 검사 규칙" columns={RULE_COLUMNS} rows={RULE_ROWS} size="md" />
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                고른 직후에는 <code>onInvalidSelect</code> 로 알리고(팝업 등), 칸에는 오류 테두리만
                                남습니다.
                            </li>
                            <li>제출할 때 걸리면 다른 칸처럼 칸 밑에 메시지가 붙습니다.</li>
                            <li>짝을 고쳐 조건이 맞아지면 제출 때 남은 메시지는 자동으로 사라집니다.</li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">시작 · 종료 짝짓기</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            시작 칸에 <code>rangeEnd</code>, 종료 칸에 <code>rangeStart</code> 로 서로의{' '}
                            <code>name</code> 과 메시지를 지정합니다.
                        </p>
                        <CodeBlock code={RANGE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-field-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-field-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아래는 컴포넌트가 처리하므로 사용처에서 따로 넣지 않습니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        라벨은 <code>id</code> 로 입력과 연결됩니다[7.4.1].
                    </li>
                    <li>
                        오류가 있으면 <code>aria-invalid</code> 가 걸리고 제출이 막히며, 브라우저 검사와 화면 메시지가
                        같은 문구를 씁니다[7.4.2].
                    </li>
                    <li>
                        도움말(<code>helper</code>)은 <code>aria-describedby</code> 로 이어집니다.
                    </li>
                    <li>
                        어긋난 값을 알리는 팝업(<code>onInvalidSelect</code>)에서는 포커스와 닫기를 사용처가
                        책임집니다[8.2.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="date-field-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="date-field-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="DateField Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default DateFieldGuidePage
