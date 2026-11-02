// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {
    RollingAccordion,
    RollingAccordionBody,
    type RollingAccordionItem,
} from '@/components/composite/rolling-accordion'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '롤링 아코디언 (RollingAccordion)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

// 데모 그림 — 실제 사진 대신 항목마다 다른 면으로 바뀌는 모습만 보인다(실제 화면은 next/image 를 넘긴다).
const DemoImage = ({label, surface}: {label: string; surface: string}) => (
    <div className={`${surface} typo-title-l-bold text-foreground flex size-full items-center justify-center`}>
        {label}
    </div>
)

// 데모 내용 — 플랫폼 소개 > 기술평가(혁신성장지수 · KTRS-FM)와 같은 본문 모양(RollingAccordionBody)이다.
const DEMO_ITEMS: readonly RollingAccordionItem[] = [
    {
        value: 'results',
        title: '결과정보',
        content: (
            <RollingAccordionBody
                groups={[
                    {
                        heading: '개별기업 평가정보',
                        items: [
                            '지수 정보, 4대 혁신역량(인프라, 투입, 활동, 성과) 부문 점수',
                            '14개 세부지표(내부 혁신역량) 단계의 중소기업 평균 대비 수준',
                        ],
                    },
                    {heading: '사업참가 기업집단 정보', items: ['지수 및 4대 혁신역량 부문 기업집단 점수 분포']},
                ]}
            />
        ),
        image: <DemoImage label="결과정보 그림" surface="bg-model-card-blue" />,
    },
    {
        value: 'effect',
        title: '기대효과',
        content: (
            <RollingAccordionBody
                groups={[
                    {
                        items: [
                            '창업 초기, 영세·소기업의 신속·소액 지원 가능',
                            '평가·보증 절차 간소화 및 실시간 등급 산출로 소액 지원 시간 단축',
                        ],
                    },
                ]}
            />
        ),
        image: <DemoImage label="기대효과 그림" surface="bg-model-card-mint" />,
    },
    {
        value: 'usage',
        title: '활용분야',
        content: (
            <RollingAccordionBody
                groups={[
                    {items: ['고객·은행이 KTRS-FM을 통해 신속·정확하게 기술사업 평가등급 및 보증 가능 여부 등을 확인']},
                ]}
            />
        ),
        image: <DemoImage label="활용분야 그림" surface="bg-model-card-orange" />,
    },
]

const USAGE_CODE = `import Image from 'next/image'
import {RollingAccordion, RollingAccordionBody} from '@/components/composite/rolling-accordion'

<RollingAccordion
  items={[
    {
      value: 'results',
      title: '결과정보',
      // 본문은 RollingAccordionBody — 소제목(선택) + 점 목록 묶음
      content: (
        <RollingAccordionBody
          groups={[
            {heading: '개별기업 평가정보', items: ['지수 정보, 4대 혁신역량 부문 점수', '…']},
            {heading: '사업참가 기업집단 정보', items: ['…']},
          ]}
        />
      ),
      image: <Image src={resultsPhoto} alt="" sizes="(min-width: 1280px) 690px, 100vw" />,
    },
    {value: 'effect', title: '기대효과', content: …, image: …},
    {value: 'usage', title: '활용분야', content: …, image: …},
  ]}
/>`

const BEHAVIOR_COLUMNS = [
    {key: 'case', header: '상황', align: 'start', rowHeader: true},
    {key: 'behavior', header: '동작', align: 'start', wrap: true},
] as const

const BEHAVIOR_ROWS = [
    {
        key: 'auto',
        cells: [
            '평소',
            '3초(interval)마다 다음 항목이 열리고 앞 항목은 닫힘. 옆 그림은 0.5초 동안 서서히 바뀜. 마지막 다음은 첫 항목',
        ],
    },
    {key: 'click', cells: ['제목을 누름', '그 항목이 바로 열리고 그림도 바뀜. 그 항목부터 이어서 넘어감']},
    {
        key: 'pause',
        cells: [
            '멈춤',
            '아코디언 상자에 마우스를 올림(벗어나면 재생) · 상자를 터치함(상자 밖을 누르면 재생) · 키보드 포커스가 안에 있음 · 화면에서 벗어남(다른 탭 포함) — 옆 그림은 꾸밈이라 그 위에서는 멈추지 않음 · 다시 재생할 때는 그 자리에서 이어서 넘어감',
        ],
    },
    {key: 'reduced', cells: ['동작 줄이기 설정', '자동으로 넘어가지 않음. 그림 바뀜도 즉시']},
    {key: 'closed', cells: ['모두 닫음', '그림은 마지막으로 열렸던 항목의 것이 남음. 다음 차례에 첫 항목부터 엶']},
]

const LAYOUT_COLUMNS = [
    {key: 'width', header: '화면 폭', align: 'start', rowHeader: true},
    {key: 'layout', header: '배치', align: 'start', wrap: true},
    {key: 'box', header: '아코디언 상자', align: 'start', wrap: true},
] as const

const LAYOUT_ROWS = [
    {
        key: 'xl',
        cells: [
            '1280px 이상',
            '상자 | 그림 — 12칸 그리드의 5 : 7(시안 486 · 690). 그림 높이(428)에 상자 높이를 맞춤',
            '여백 48 · 판 rolling-accordion-surface(라이트 gray.10 · 다크는 페이지 바탕과 같은 gray.900) · 목록 점 rolling-accordion-marker(라이트 gray.500 · 다크 gray.100). 본문이 길면 본문 안에서 스크롤(최대 152)',
        ],
    },
    {key: 'md', cells: ['768px 이상', '그림 위 · 상자 아래(사이 24)', '여백 48. 본문은 다 펼침']},
    {key: 'mobile', cells: ['768px 미만', '그림 위 · 상자 아래(사이 24)', '여백 32. 본문은 다 펼침']},
]

const PROPS_ITEMS = [
    [
        'RollingAccordion',
        'items',
        '항목 목록입니다(필수). 이 순서로 자동 전환합니다. 첫 항목이 처음에 열립니다.',
        '-',
        'RollingAccordionItem[]',
    ],
    ['RollingAccordion', 'interval', '다음 항목으로 넘어가는 간격(ms)입니다.', '3000', 'number'],
    ['RollingAccordion', 'className', '바깥 그리드에 더할 클래스입니다(위 여백 등).', '-', 'string'],
    ['RollingAccordionItem', 'value', '항목 식별 값입니다.', '-', 'string'],
    ['RollingAccordionItem', 'title', '제목입니다(20 Bold — 열리면 파랑).', '-', 'string'],
    [
        'RollingAccordionItem',
        'content',
        '펼친 본문입니다. 글자는 16 Regular(label-foreground)를 물려받습니다.',
        '-',
        'ReactNode',
    ],
    [
        'RollingAccordionItem',
        'image',
        '이 항목이 열렸을 때 옆에 보일 그림입니다(next/image · alt=""). 없으면 빈 면입니다.',
        '-',
        'ReactNode',
    ],
    [
        'RollingAccordionBody',
        'groups',
        '본문 묶음입니다(필수). 묶음마다 소제목(heading) · 점 목록(items) · 점 없는 문단(text)을 있는 것만 넘깁니다 — 소제목만 있는 묶음(K-BIGx 기업개요)이나 문단만 있는 묶음(K-BIGx 기대효과)도 됩니다.',
        '-',
        '{heading?: string; items?: string[]; text?: string}[]',
    ],
] as const

const RollingAccordionGuidePage = () => (
    <GuidePageShell
        title="롤링 아코디언 (RollingAccordion)"
        description="일정 시간마다 다음 항목이 열리고, 옆 그림도 그 항목의 그림으로 바뀌는 아코디언입니다."
    >
        <BaseCard>
            <section aria-labelledby="rolling-accordion-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="rolling-accordion-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        회색 상자 안{' '}
                        <Link href="/component-guide/accordion" className={LINK_CLASS}>
                            Accordion
                        </Link>
                        과 옆 그림이 한 쌍입니다. 항목은 하나만 열리고, 메인페이지 기술평가 목차처럼 일정 시간(3초)마다
                        다음 항목으로 넘어갑니다. 플랫폼 소개 &gt; 기술평가의 결과정보 · 기대효과 · 활용분야에서 씁니다.
                    </p>
                </div>
                <RollingAccordion items={DEMO_ITEMS} />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">동작</h3>
                        <Table
                            caption="롤링 아코디언의 상황별 동작"
                            columns={BEHAVIOR_COLUMNS}
                            rows={BEHAVIOR_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">화면 폭별 배치</h3>
                        <Table
                            caption="화면 폭별 배치와 상자 규격"
                            columns={LAYOUT_COLUMNS}
                            rows={LAYOUT_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">상자 규격</h3>
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                회색 면(panel-subtle — 다크에서도 본문 바탕보다 한 단계 밝아 묻히지 않음) · 반경 16.
                                그림 칸도 같은 반경 · 같은 면입니다.
                            </li>
                            <li>제목 20 Bold(title-l-bold) — 열린 항목은 primary-strong(파랑). 여닫는 화살표 20.</li>
                            <li>제목과 본문 사이 8 · 항목 사이 구분선(Separator · subtle-3) 위아래 16.</li>
                            <li>
                                본문(<code>RollingAccordionBody</code>) — 소제목 16 Medium(h4) · 점 목록 16
                                Regular(label-foreground). 소제목과 목록 · 목록 줄 · 묶음 사이 모두 8.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="rolling-accordion-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="rolling-accordion-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>여닫기 · 키보드(Enter · Space) · aria-expanded 는 Radix Accordion 이 맡습니다[8.2.1].</li>
                    <li>
                        읽는 중에 내용이 바뀌지 않도록 아코디언 상자에 마우스를 올리거나 · 터치하거나 · 키보드 포커스가
                        안에 있으면 자동 전환을 멈춥니다[6.2.1] · [6.2.2]. 옆 그림은 꾸밈이라 그 위에서는 멈추지
                        않습니다. 마우스는 벗어나면, 터치는 상자 밖을 누르면 다시 넘어갑니다 — 자동 롤링 공통 규칙(
                        <code>useAutoplayPause</code>)입니다. 동작 줄이기 설정이면 자동으로 넘어가지 않습니다[6.3.1].
                    </li>
                    <li>
                        PC 에서 본문이 상자보다 길면 본문 상자가 포커스를 받아 키보드로 스크롤할 수 있습니다[6.1.1].
                    </li>
                    <li>
                        그림은 꾸밈이라 화면 낭독기가 읽지 않습니다(alt=&quot;&quot; · 그림 칸 aria-hidden)[5.1.1]. 그림
                        칸을 먼저 두고 PC 에서 칸 위치로 상자를 왼쪽에 놓으므로 읽는 순서는 아코디언 하나입니다[7.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="rolling-accordion-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="rolling-accordion-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="RollingAccordion Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default RollingAccordionGuidePage
