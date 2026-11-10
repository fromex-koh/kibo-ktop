// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {HorizontalScrollArea} from '@/components/composite/horizontal-scroll-area'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '가로 스크롤 영역 (HorizontalScrollArea)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

const DEMO_FILTERS = [
    {value: 'all', label: '전체'},
    {value: 'using', label: '사용중'},
    {value: 'waiting', label: '대기중'},
    {value: 'expired', label: '만료'},
    {value: 'refunded', label: '환불'},
] as const

const USAGE_CODE = `import {HorizontalScrollArea} from '@/components/composite/horizontal-scroll-area'

{/* 안의 목록은 자기 내용 폭을 가져야 한다(w-max) — 부모 폭에 맞춰 줄면 넘치지 않아 스크롤이 생기지 않는다. */}
<HorizontalScrollArea itemSelector='[data-slot="segmented-control-item"]' scrollLabel="이용권 상태 필터">
  <SegmentedControl type="radio" variant="solid" size="md" defaultValue="all" aria-label="이용권 상태 필터" className="w-max">
    <SegmentedControlItem value="all">전체</SegmentedControlItem>
    …
  </SegmentedControl>
</HorizontalScrollArea>`

const PROPS_ITEMS = [
    [
        'HorizontalScrollArea',
        'children',
        '한 줄로 늘어선 목록입니다. 자기 내용 폭(w-max)을 가져야 합니다.',
        '-',
        'ReactNode',
    ],
    [
        'HorizontalScrollArea',
        'itemSelector',
        '항목 하나를 찾는 선택자입니다. 화살표가 넘기는 폭과 키보드 가운데 맞춤의 기준입니다.',
        '-',
        'string',
    ],
    [
        'HorizontalScrollArea',
        'scrollLabel',
        '화살표 버튼 이름에 붙는 목록 이름입니다 — "{scrollLabel} 왼쪽으로 스크롤".',
        '-',
        'string',
    ],
    ['HorizontalScrollArea', 'className', '바깥 줄(화살표 + 스크롤 영역)에 더할 클래스입니다.', '-', 'string'],
] as const

const HorizontalScrollAreaGuidePage = () => (
    <GuidePageShell
        title="가로 스크롤 영역 (HorizontalScrollArea)"
        description="한 줄로 늘어선 항목이 폭을 넘칠 때, 페이지 전체가 아니라 이 영역만 가로로 스크롤되게 하는 래퍼입니다."
    >
        <BaseCard>
            <section aria-labelledby="hsa-basic" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="hsa-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        넘칠 때만 좌우 화살표와 가장자리 페이드가 생깁니다. 아래 예시는 폭을 좁힌 상자라 화살표가
                        보입니다. 실제 화면 —{' '}
                        <Link href="/corp/mypage/paid-services/payment-history" className={LINK_CLASS}>
                            마이페이지 &gt; 이용권 관리
                        </Link>
                        의 상태 필터(모바일).
                    </p>
                </div>
                <div className="bg-muted rounded-md p-6">
                    <div className="max-w-xs">
                        <HorizontalScrollArea
                            itemSelector='[data-slot="segmented-control-item"]'
                            scrollLabel="가로 스크롤 예시 필터"
                        >
                            <SegmentedControl
                                type="radio"
                                variant="solid"
                                size="md"
                                defaultValue="all"
                                aria-label="가로 스크롤 예시 필터"
                                className="w-max"
                            >
                                {DEMO_FILTERS.map((item) => (
                                    <SegmentedControlItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SegmentedControlItem>
                                ))}
                            </SegmentedControl>
                        </HorizontalScrollArea>
                    </div>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="hsa-where" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="hsa-where" className="typo-h4-bold">
                        쓰는 곳
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>
                        <Link href="/component-guide/tabs" className={LINK_CLASS}>
                            TabsScrollArea
                        </Link>{' '}
                        — 탭 목록(TabsList)용 래퍼가 이 컴포넌트 위에 만들어져 있습니다. 탭은 TabsScrollArea 를 씁니다.
                    </li>
                    <li>
                        <Link href="/component-guide/segmented-control" className={LINK_CLASS}>
                            SegmentedControl
                        </Link>{' '}
                        — 칸이 많아 모바일에서 넘칠 수 있는 세그먼트 필터를 직접 감쌉니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="hsa-behavior" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="hsa-behavior" className="typo-h4-bold">
                        동작 · 접근성
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>화살표는 항목 하나의 폭만큼 넘깁니다. 손가락 · 트랙패드 스와이프도 그대로 됩니다.</li>
                    <li>
                        더 갈 수 없는 쪽 화살표는 <code>disabled</code> 대신 <code>aria-disabled</code> 로 흐리게 둡니다
                        — 포커스가 사라지지 않습니다[6.1.2].
                    </li>
                    <li>키보드(방향키 · Home · End)로 항목을 옮기면 그 항목이 영역 가운데로 옵니다[6.1.1].</li>
                    <li>스크롤 애니메이션은 prefers-reduced-motion 을 따릅니다[6.3.1].</li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="hsa-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="hsa-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="HorizontalScrollArea 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default HorizontalScrollAreaGuidePage
