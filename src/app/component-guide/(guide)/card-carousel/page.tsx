// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Image from 'next/image'
import aiDatabaseServer from '@public/images/platform-intro/ai-database-server.webp'
import aiDonutChart from '@public/images/platform-intro/ai-donut-chart.webp'
import officeBankBuildings from '@public/images/platform-intro/office-bank-buildings.webp'
import documentChartMagnifier from '@public/images/option-card/document-chart-magnifier.webp'
import {BaseCard} from '@/components/composite/base-card'
import {CardCarousel, type CardCarouselItem} from '@/components/custom/card-carousel'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '카드 캐러셀 (CardCarousel)'}

// 데모 카드 — 플랫폼 소개 화면과 같은 그림을 쓴다(꾸밈 그림이라 alt="").
const DEMO_IMAGE_CLASS = 'size-25'
const DEMO_ITEMS: readonly CardCarouselItem[] = [
    {
        id: 'what',
        title: 'K-TOP은\n어떤 플랫폼인가요?',
        descriptions: ['기보 빅데이터와 AI로 기술평가정보 생성', '누구나 활용하는 기술평가포털 (기업 및 유관기관 등)'],
        image: <Image src={aiDonutChart} alt="" sizes="100px" className={DEMO_IMAGE_CLASS} />,
    },
    {
        id: 'why',
        title: '왜 만들어졌나요?',
        descriptions: ['데이터 개방 정책에 부합하는 플랫폼', '기업의 혁신·성장을 위한 평가 지원'],
        image: <Image src={documentChartMagnifier} alt="" sizes="100px" className={'h-auto w-25'} />,
    },
    {
        id: 'made-of',
        title: '무엇으로\n만들어졌나요?',
        descriptions: ['기보 25년·86만건 기술평가 빅데이터', '평가 목적에 최적화된 AI 모델'],
        image: <Image src={aiDatabaseServer} alt="" sizes="100px" className={DEMO_IMAGE_CLASS} />,
    },
    {
        id: 'who',
        title: '누가 활용하나요?',
        descriptions: ['기업, 은행 등 민간금융, 민간투자기관', '정부, 공공기관, R&D 혁신지원기관'],
        image: <Image src={officeBankBuildings} alt="" sizes="100px" className={DEMO_IMAGE_CLASS} />,
    },
]

const USAGE_CODE = `import Image from 'next/image'
import {CardCarousel} from '@/components/custom/card-carousel'
import aiDonutChart from '@public/images/platform-intro/ai-donut-chart.webp'

<CardCarousel
  title="K-TOP 플랫폼 개요"
  items={[
    {
      id: 'what',
      title: 'K-TOP은\\n어떤 플랫폼인가요?',   // \\n 에서 줄이 나뉜다
      descriptions: ['기보 빅데이터와 AI로 기술평가정보 생성', '…'],
      image: <Image src={aiDonutChart} alt="" sizes="100px" className="size-25" />,
    },
    // …
  ]}
/>`

const BLEED_CODE = `// 화면 전체 폭으로 두고, 카드 줄을 콘텐츠 왼쪽 선에서 시작해 화면 오른쪽 끝까지 잇는다(플랫폼 소개).
// --platform-inset = 콘텐츠 왼쪽 끝까지의 거리(grid-layout 과 같은 계산) — platform-intro.tsx 참고.
<CardCarousel className="[--card-carousel-inset:var(--platform-inset)]" title="K-TOP 플랫폼 개요" items={items} />

// 카드 · 패널 안처럼 좁은 곳 — 왼쪽 · 오른쪽 여백을 모두 0 으로.
<CardCarousel className="[--card-carousel-inset:0px] [--card-carousel-gutter:0px]" title="…" items={items} />`

const STATE_COLUMNS = [
    {key: 'state', header: '상태', align: 'start', rowHeader: true},
    {key: 'look', header: '모양', align: 'start', wrap: true},
    {key: 'content', header: '아래쪽 내용', align: 'start', wrap: true},
] as const

const STATE_ROWS = [
    {
        key: 'active',
        cells: [
            '고른 카드(하나)',
            '옅은 파랑 면(primary-subtle) · 파란 테두리 · 번호 진한 파랑 · 제목 본문 색',
            '설명 목록(점 + 16 Regular — 점은 platform-carousel-marker, 다크는 글자와 같은 gray.100). 설명이 비면 그림',
        ],
    },
    {
        key: 'default',
        cells: ['나머지 카드', '파랑 면(primary) · 흰 글자', '오른쪽 아래 그림(100 × 100 자리)'],
    },
    {
        key: 'nav',
        cells: [
            '이전 · 다음 버튼',
            '이전은 흰 면 + 테두리(platform-carousel-nav-border — 다크는 gray.200), 다음은 짙은 면 — 한 바퀴 돌아 둘 다 늘 누를 수 있음',
            '카드 줄 전체를 한 칸 밀어 고른 카드를 첫 칸으로(0.5초 · ease-roll) — 나가는 카드는 흐려지며 사라지고, 들어오는 카드는 선명해짐',
        ],
    },
]

const LAYOUT_COLUMNS = [
    {key: 'width', header: '화면 폭', align: 'start', rowHeader: true},
    {key: 'title', header: '제목 줄', align: 'start', wrap: true},
    {key: 'card', header: '카드', align: 'start', wrap: true},
] as const

const LAYOUT_ROWS = [
    {
        key: 'md',
        cells: ['768px 이상', '제목 | 이전 · 다음 버튼이 한 줄(양 끝)', '폭 384 · 안쪽 여백 40 — 여러 장이 이어 보임'],
    },
    {
        key: 'base',
        cells: [
            '768px 미만',
            '제목 아래(8)에 버튼',
            '보이는 창 폭에서 오른쪽 여백을 뺀 폭(최대 384) · 안쪽 여백 32 — 한 장씩',
        ],
    },
]

const PROPS_ITEMS = [
    ['CardCarousel', 'title', '제목 줄 왼쪽 제목입니다(h2). 카드 제목은 h3 입니다.', '-', 'string'],
    ['CardCarousel', 'items', '카드 목록입니다. 아래 CardCarouselItem 을 봅니다.', '-', 'readonly CardCarouselItem[]'],
    ['CardCarousel', 'defaultIndex', '처음 고른 카드 순번(0부터)입니다.', '0', 'number'],
    [
        'CardCarousel',
        'className',
        '바깥 section 에 클래스를 더합니다. 여백 변수(--card-carousel-inset · --card-carousel-gutter)도 여기서 줍니다.',
        '-',
        'string',
    ],
    ['CardCarouselItem', 'id', '카드 키 · 설명 영역 id 에 씁니다.', '-', 'string'],
    ['CardCarouselItem', 'title', '카드 제목입니다. 줄바꿈(\\n)에서 줄이 나뉩니다.', '-', 'string'],
    ['CardCarouselItem', 'descriptions', '고른 카드에 보이는 설명 목록입니다.', '-', 'readonly string[]'],
    ['CardCarouselItem', 'image', '고르지 않은 카드의 그림입니다. next/image 에 alt="" 로 넘깁니다.', '-', 'ReactNode'],
] as const

const CardCarouselGuidePage = () => (
    <GuidePageShell
        title="카드 캐러셀 (CardCarousel)"
        description="제목 줄의 이전 · 다음 버튼으로 가로 카드를 한 바퀴 돌리며, 첫 칸에 온 카드만 설명을 펼쳐 보여 줍니다. 플랫폼 소개 · K-TOP 플랫폼 개요에서 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="cc-usage" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="cc-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        고른 카드는 늘 첫 칸에 오고 나머지가 번호 순서대로 뒤따릅니다(마지막 다음은 처음). 카드를
                        누르거나 이전 · 다음 버튼을 누르면 카드 줄 전체가 밀려 그 카드가 첫 칸에 옵니다. 같은 카드를 두
                        자리에 겹쳐 두지 않아 잔상이 생기지 않고, 밀려 나가는 카드는 흐려지며 사라지고 [이전]으로
                        들어오는 카드는 투명하게 시작해 선명해집니다. 아래 데모는 카드 안이라 여백을 0 으로
                        두었습니다(왼쪽 페이드 없음).
                    </p>
                </div>
                <CardCarousel
                    className="[--card-carousel-gutter:0px] [--card-carousel-inset:0px]"
                    title="K-TOP 플랫폼 개요"
                    items={DEMO_ITEMS}
                />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8">
                        <h3 className="typo-title-m-bold text-foreground">카드 상태</h3>
                        <Table
                            caption="카드 캐러셀의 상태별 모양"
                            columns={STATE_COLUMNS}
                            rows={STATE_ROWS}
                            size="md"
                        />
                    </div>
                    <div className="flex flex-col gap-4 py-8">
                        <h3 className="typo-title-m-bold text-foreground">화면 폭별 배치</h3>
                        <Table
                            caption="화면 폭별 제목 줄과 카드 배치"
                            columns={LAYOUT_COLUMNS}
                            rows={LAYOUT_ROWS}
                            size="md"
                        />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">여백 · 화면 끝까지 잇기</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            왼쪽 여백은 <code>--card-carousel-inset</code>(없으면 그리드 가장자리 여백), 오른쪽 여백은{' '}
                            <code>--card-carousel-gutter</code>(기본 그리드 가장자리 여백)입니다. 화면 전체 폭에 두고
                            왼쪽 여백에 콘텐츠 왼쪽 끝까지의 거리를 주면 카드 줄이 화면 오른쪽 끝까지 이어집니다. 넘치는
                            부분은 감싼 화면이 <code>overflow-x-clip</code> 으로 자릅니다.
                        </p>
                        <p className="typo-body-l-regular text-label-foreground">
                            왼쪽 페이드 — 왼쪽 여백 구간(콘텐츠 선 바깥)은 마스크로 투명하게 지워 밀려 나가는 카드가 뚝
                            잘려 보이지 않습니다(탭 TabsScrollArea 의 가장자리 페이드와 같은 방식). 콘텐츠 선 안의 고른
                            카드는 흐려지지 않고, 오른쪽 끝은 화면 끝에서 그대로 잘립니다. 왼쪽 여백이 0 이면 페이드도
                            없습니다.
                        </p>
                        <CodeBlock code={BLEED_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cc-accessibility" className="flex flex-col gap-6">
                <h2 id="cc-accessibility" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        카드 제목이 버튼이고 <code>aria-expanded</code> 로 설명이 열렸는지 알립니다. 설명 영역과{' '}
                        <code>aria-controls</code> 로 이어집니다[8.2.1].
                    </li>
                    <li>버튼 영역이 카드 전체로 넓혀져 있어 카드 어디를 눌러도 고릅니다[6.1.3].</li>
                    <li>
                        이전 · 다음 버튼은 아이콘만 있어 <code>aria-label</code>(이전 항목 · 다음 항목)을 줍니다. 한
                        바퀴 돌아 늘 누를 수 있습니다[5.1.1].
                    </li>
                    <li>그림은 꾸밈이라 읽지 않습니다 — 그림의 alt 는 빈 문자열로 둡니다[5.1.1].</li>
                    <li>카드가 돌 때 DOM 순서도 함께 돌아 보이는 순서와 읽는 순서가 같습니다[7.3.1].</li>
                    <li>동작 줄이기 설정이면 밀지 않고 바로 바꿉니다[6.3.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cc-props" className="flex flex-col gap-6">
                <h2 id="cc-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="CardCarousel Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default CardCarouselGuidePage
