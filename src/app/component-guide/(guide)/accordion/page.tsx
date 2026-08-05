import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import Image from 'next/image'
import faqQuestionMark from '@public/images/faq/faq-question-mark.webp'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'

export const metadata: Metadata = {title: '아코디언 (Accordion)'}

const USAGE_CODE = `<Accordion type="single" collapsible>
  <AccordionItem value="fee">
    <AccordionTrigger>
      {/* FAQ 화면은 질문 앞에 'Q.' 이미지를 둔다(장식이라 alt=""). */}
      <span className="flex min-w-0 items-center gap-2">
        <Image src={faqQuestionMark} alt="" sizes="24px" className="size-icon-lg shrink-0" />
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

const PROPS_ITEMS = [
    [
        'Accordion',
        'type',
        '한 번에 하나만 펼칠지(single) 여러 개를 펼칠지(multiple) 정합니다.',
        '—',
        "'single' | 'multiple'",
    ],
    ['Accordion', 'collapsible', "type='single' 일 때 열린 항목을 다시 눌러 닫을 수 있게 합니다.", 'false', 'boolean'],
    ['Accordion', 'defaultValue', '처음에 펼쳐 둘 항목의 value 입니다.', 'undefined', 'string | string[]'],
    [
        'Accordion',
        'value / onValueChange',
        '펼침 상태를 밖에서 제어할 때 사용합니다.',
        'undefined',
        'string | string[]',
    ],
    ['AccordionItem', 'value', '항목을 구분하는 값입니다(필수).', '—', 'string'],
    ['AccordionItem', 'disabled', '해당 항목을 펼칠 수 없게 합니다.', 'false', 'boolean'],
    ['AccordionTrigger', 'children', '질문 등 눌러서 펼치는 제목입니다. 화살표는 셸이 붙입니다.', '—', 'ReactNode'],
    ['AccordionContent', 'children', '펼쳐지는 본문입니다.', '—', 'ReactNode'],
] as const

// 아코디언 — shadcn Accordion 셸에 프로젝트 theme 스타일을 연결한다. 펼침·키보드·aria 는 radix 가 담당한다.
const AccordionGuidePage = () => (
    <GuidePageShell
        title="아코디언 (Accordion)"
        description="질문을 눌러 답변을 펼치는 목록입니다. FAQ처럼 항목이 많고 본문이 긴 정보를 접어 둘 때 사용합니다."
    >
        <BaseCard>
            <section aria-labelledby="accordion-demo" className="flex flex-col gap-4">
                <div>
                    <h2 id="accordion-demo" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">type=&quot;single&quot;</code>과{' '}
                        <code className="font-mono">collapsible</code>을 함께 주면 한 번에 하나만 펼쳐지고, 열린 항목을
                        다시 누르면 닫힙니다.
                    </p>
                </div>
                <Accordion type="single" collapsible>
                    {FAQ_ITEMS.map((item) => (
                        <AccordionItem key={item.value} value={item.value}>
                            <AccordionTrigger>
                                <span className="flex min-w-0 items-center gap-2">
                                    <Image
                                        src={faqQuestionMark}
                                        alt=""
                                        sizes="24px"
                                        className="size-icon-lg shrink-0"
                                    />
                                    <span className="min-w-0 break-keep">{item.question}</span>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="accordion-multiple" className="flex flex-col gap-4">
                <div>
                    <h2 id="accordion-multiple" className="typo-h4-bold">
                        여러 항목 펼치기
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        비교하며 읽어야 하는 내용은 <code className="font-mono">type=&quot;multiple&quot;</code>로 두어
                        여러 항목을 동시에 펼칠 수 있게 합니다.
                    </p>
                </div>
                <Accordion type="multiple" defaultValue={['apply']}>
                    {FAQ_ITEMS.map((item) => (
                        <AccordionItem key={item.value} value={item.value}>
                            <AccordionTrigger>
                                <span className="flex min-w-0 items-center gap-2">
                                    <Image
                                        src={faqQuestionMark}
                                        alt=""
                                        sizes="24px"
                                        className="size-icon-lg shrink-0"
                                    />
                                    <span className="min-w-0 break-keep">{item.question}</span>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <CodeBlock code={MULTIPLE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="accordion-style" className="flex flex-col gap-4">
                <div>
                    <h2 id="accordion-style" className="typo-h4-bold">
                        스타일
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        질문마다 흰 카드가 하나씩이고 카드 사이는 16px입니다. 카드는 라운드 16px에 여백은 위아래 32px ·
                        좌우 24px이며 그림자는 두지 않습니다.
                    </li>
                    <li>
                        질문은 <code className="font-mono">typo-title-m-medium</code>(18px), 답변은{' '}
                        <code className="font-mono">typo-body-xl-regular</code>(16px)입니다. 질문 줄에서 24px 떨어진
                        자리에 <code className="font-mono">border-subtle-3</code> 구분선이 그어지고 다시 24px 아래에서
                        답변이 시작합니다.
                    </li>
                    <li>
                        여닫는 화살표는 24px(<code className="font-mono">size-icon-lg</code>)이고 펼침 여부에 따라
                        위·아래로 바뀝니다.
                    </li>
                    <li>
                        스타일은 <code className="font-mono">theme/accordion.variants.ts</code>에서 관리합니다. 셸의
                        구조·동작은 수정하지 않습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="accordion-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="accordion-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        펼침 상태(<code className="font-mono">aria-expanded</code>)와 제목↔본문 연결(
                        <code className="font-mono">aria-controls</code>), 위·아래 화살표 이동은 radix 가 처리합니다
                        ([8.2.1]). 직접 구현하지 마세요.
                    </li>
                    <li>
                        트리거는 버튼이라 Enter·Space 로 여닫을 수 있고, 포커스는 프로젝트 공통 outline 링으로
                        표시합니다 ([6.1.1]·[6.1.2]).
                    </li>
                    <li>
                        제목 계층이 필요하면 <code className="font-mono">AccordionTrigger</code>를 감싼 heading 대신
                        위쪽 섹션 제목으로 단계를 잡습니다 — 셸이 이미{' '}
                        <code className="font-mono">AccordionPrimitive.Header</code>를 렌더합니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="accordion-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="accordion-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Accordion 루트와 각 조합 컴포넌트에 전달하는 주요 속성입니다. 나머지는 Radix Accordion props 를
                        그대로 받습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Accordion 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default AccordionGuidePage
