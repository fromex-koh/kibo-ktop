// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {QaMark} from '@/components/custom/qa-mark'
import {Table} from '@/components/custom/table'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'

export const metadata: Metadata = {title: '아코디언 (Accordion)'}

const USAGE_CODE = `import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'

<Accordion type="single" collapsible>
  <AccordionItem value="fee">
    <AccordionTrigger>
      {/* FAQ 화면은 질문 앞에 'Q.' 그림(QaMark)을 둔다. */}
      <span className="flex min-w-0 items-center gap-2">
        <QaMark type="question" />
        <span className="min-w-0 break-keep">평가 수수료는 어떻게 되나요?</span>
      </span>
    </AccordionTrigger>
    <AccordionContent>평가모형과 기업 규모에 따라 달라집니다.</AccordionContent>
  </AccordionItem>
</Accordion>`

const MULTIPLE_CODE = `{/* 여러 항목을 동시에 펼치려면 type="multiple" 을 쓴다(collapsible 은 필요 없다). */}
<Accordion type="multiple" defaultValue={['apply']}>
  …
</Accordion>`

// FAQ 예시 문항 — 실제 문구는 화면에서 데이터로 넘긴다.
const FAQ_ITEMS = [
    {
        value: 'apply',
        question: '기술평가는 어떻게 신청하나요?',
        answer: '로그인 후 기술평가 메뉴에서 평가모형을 고르고 기업·기술정보를 입력하면 신청이 완료됩니다.',
    },
    {
        value: 'fee',
        question: '평가 수수료는 어떻게 되나요?',
        answer: '평가모형과 기업 규모에 따라 다릅니다. 자세한 금액은 가격 정책에서 확인할 수 있습니다.',
    },
    {
        value: 'result',
        question: '평가 결과는 언제 확인할 수 있나요?',
        answer: '신청 자료가 모두 접수되면 영업일 기준 약 2주 뒤 마이페이지 평가결과 조회에서 확인할 수 있습니다.',
    },
] as const

const STYLE_COLUMNS = [
    {key: 'name', header: '구분', align: 'start', rowHeader: true},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
] as const

const STYLE_ROWS = [
    {
        key: 'item',
        cells: [
            '항목 카드',
            '배경 bg-card, 라운드 16px, 여백 위아래 32px · 좌우 24px 입니다. 카드 사이 간격은 16px 입니다.',
        ],
    },
    {
        key: 'trigger',
        cells: [
            '질문',
            'typo-title-m-medium(18px)입니다. 화살표는 24px(size-icon-lg)이고 펼치면 위쪽 화살표로 바뀝니다.',
        ],
    },
    {
        key: 'content',
        cells: [
            '답변',
            'typo-body-xl-regular(16px) · text-label-foreground 입니다. 질문 아래 24px 에 border-subtle-3 구분선이 있고 그 아래 24px 에서 시작합니다.',
        ],
    },
]

const PROPS_ITEMS = [
    [
        'Accordion',
        'type',
        '한 번에 하나만 펼칠지(single) 여러 개를 펼칠지(multiple) 정합니다(필수).',
        '-',
        "'single' | 'multiple'",
    ],
    ['Accordion', 'collapsible', "type='single' 일 때 열린 항목을 다시 눌러 닫을 수 있게 합니다.", 'false', 'boolean'],
    ['Accordion', 'defaultValue', '처음에 펼쳐 둘 항목의 value 입니다.', '-', 'string | string[]'],
    ['Accordion', 'value / onValueChange', '펼침 상태를 밖에서 제어할 때 사용합니다.', '-', 'string | string[]'],
    ['Accordion', 'disabled', '모든 항목을 펼칠 수 없게 합니다.', 'false', 'boolean'],
    ['AccordionItem', 'value', '항목을 구분하는 값입니다(필수).', '-', 'string'],
    ['AccordionItem', 'disabled', '해당 항목을 펼칠 수 없게 합니다.', 'false', 'boolean'],
    ['AccordionTrigger', 'children', '눌러서 펼치는 제목입니다. 화살표는 자동으로 붙습니다.', '-', 'ReactNode'],
    ['AccordionContent', 'children', '펼쳐지는 본문입니다.', '-', 'ReactNode'],
    ['AccordionContent', 'className', '본문 영역에 추가할 클래스입니다.', '-', 'string'],
] as const

const AccordionGuidePage = () => (
    <GuidePageShell
        title="아코디언 (Accordion)"
        description="질문을 눌러 답변을 펼치는 목록입니다. FAQ처럼 항목이 많고 본문이 긴 정보를 접어 둘 때 사용합니다."
    >
        <BaseCard>
            <section aria-labelledby="accordion-demo" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="accordion-demo" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>type=&quot;single&quot;</code>과 <code>collapsible</code>을 함께 주면 한 번에 하나만
                        펼쳐지고, 열린 항목을 다시 누르면 닫힙니다.
                    </p>
                </div>
                <Accordion type="single" collapsible>
                    {FAQ_ITEMS.map((item) => (
                        <AccordionItem key={item.value} value={item.value}>
                            <AccordionTrigger>
                                <span className="flex min-w-0 items-center gap-2">
                                    <QaMark type="question" />
                                    <span className="min-w-0 break-keep">{item.question}</span>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">여러 항목 펼치기</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            비교하며 읽어야 하는 내용은 <code>type=&quot;multiple&quot;</code>로 두어 여러 항목을 동시에
                            펼칩니다. <code>collapsible</code>은 필요 없습니다.
                        </p>
                        <Accordion type="multiple" defaultValue={['apply']}>
                            {FAQ_ITEMS.map((item) => (
                                <AccordionItem key={item.value} value={item.value}>
                                    <AccordionTrigger>
                                        <span className="flex min-w-0 items-center gap-2">
                                            <QaMark type="question" />
                                            <span className="min-w-0 break-keep">{item.question}</span>
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent>{item.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                        <CodeBlock code={MULTIPLE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="accordion-style" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="accordion-style" className="typo-h4-bold">
                        스타일
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아래 스타일은 기본으로 적용됩니다. 바꿀 때는 <code>theme/accordion.variants.ts</code>를
                        수정합니다.
                    </p>
                </div>
                <Table caption="아코디언 기본 스타일 목록" columns={STYLE_COLUMNS} rows={STYLE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="accordion-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="accordion-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        펼침 상태와 키보드 조작은 컴포넌트가 처리합니다. 사용처는 질문 텍스트와 제목 구조만 확인합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        Radix Accordion 이 <code>aria-expanded</code> · <code>aria-controls</code>, Enter · Space
                        여닫기, 위 · 아래 화살표 키 이동을 처리합니다[6.1.1][8.2.1].
                    </li>
                    <li>
                        <code>AccordionTrigger</code>는 제목 요소 안에 그려지므로 사용처에서 heading 으로 다시 감싸지
                        않습니다[8.1.1]. 제목 레벨은 주변 구조에 맞는지 확인합니다[6.4.2].
                    </li>
                    <li>키보드 포커스는 질문 줄 안쪽 외곽선으로 표시됩니다[6.1.2].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="accordion-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="accordion-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        주요 속성입니다. 나머지는 Radix Accordion 의 props 를 그대로 받습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Accordion 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default AccordionGuidePage
