// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs'
import {TabsScrollArea} from '@/components/composite/tabs-scroll-area'

export const metadata: Metadata = {title: '탭 (Tabs)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const MYPAGE_TABS = [
    ['info', '내 정보 확인'],
    ['status', '진행현황 결과조회'],
    ['report', 'K-BIGx 보고서 이력'],
    ['paid', '유료 서비스 관리'],
    ['qna', '1:1 문의'],
    ['alarm', '알림 설정'],
    ['payment', '결제 내역'],
    ['terms', '이용약관'],
] as const

// 기본 예시는 다섯 개, 스크롤 예시는 여덟 개를 모두 쓴다.
const BASIC_TAB_COUNT = 5

const POLICY_SECTIONS = [
    ['collection', '개인정보 수집'],
    ['usage', '개인정보 이용'],
    ['provision', '개인정보 제공'],
] as const

const BASIC_CODE = `import {Tabs, TabsTrigger, TabsContent} from '@/components/ui/tabs'
import {TabsScrollArea} from '@/components/composite/tabs-scroll-area'

<Tabs defaultValue="info">
  <TabsScrollArea aria-label="마이페이지 메뉴">
    <TabsTrigger value="info">내 정보 확인</TabsTrigger>
    <TabsTrigger value="status">진행현황 결과조회</TabsTrigger>
    <TabsTrigger value="report">K-BIGx 보고서 이력</TabsTrigger>
  </TabsScrollArea>
  <TabsContent value="info" className="pt-6">내 정보 확인 내용</TabsContent>
  <TabsContent value="status" className="pt-6">진행현황 결과조회 내용</TabsContent>
  <TabsContent value="report" className="pt-6">K-BIGx 보고서 이력 내용</TabsContent>
</Tabs>`

const TEXT_CODE = `<Tabs defaultValue="full" className="gap-0">
  <TabsScrollArea variant="text" aria-label="보기 방식">
    <TabsTrigger value="full">개인정보 처리방침</TabsTrigger>
    <TabsTrigger value="easy">알기 쉬운 개인정보 처리방침</TabsTrigger>
  </TabsScrollArea>
  {/* 탭 아래 간격은 패널마다 달라서 Tabs 의 gap 대신 각 TabsContent 가 갖는다 */}
  <TabsContent value="full" className="mt-10">개인정보 처리방침 전문</TabsContent>
  <TabsContent value="easy" className="mt-6">알기 쉬운 개인정보 처리방침</TabsContent>
</Tabs>`

const PILL_CODE = `<Tabs defaultValue="collection" className="gap-10">
  <TabsList variant="pill-outline" aria-label="처리방침 항목">
    <TabsTrigger value="collection">개인정보 수집</TabsTrigger>
    <TabsTrigger value="usage">개인정보 이용</TabsTrigger>
    <TabsTrigger value="provision">개인정보 제공</TabsTrigger>
  </TabsList>
  <TabsContent value="collection">개인정보 수집 내용</TabsContent>
  <TabsContent value="usage">개인정보 이용 내용</TabsContent>
  <TabsContent value="provision">개인정보 제공 내용</TabsContent>
</Tabs>`

const SCROLL_CODE = `<Tabs defaultValue="info">
  <TabsScrollArea aria-label="마이페이지 메뉴">
    <TabsTrigger value="info">내 정보 확인</TabsTrigger>
    {/* … 탭이 폭을 넘치면 좌우 화살표가 자동으로 나타난다 */}
    <TabsTrigger value="terms">이용약관</TabsTrigger>
  </TabsScrollArea>
  <TabsContent value="info" className="pt-6">내 정보 확인 내용</TabsContent>
  {/* … */}
</Tabs>`

const VARIANT_COLUMNS = [
    {key: 'variant', header: 'variant', align: 'start', rowHeader: true},
    {key: 'shape', header: '모양', align: 'start', wrap: true},
    {key: 'usage', header: '쓰는 자리', align: 'start', wrap: true},
] as const

const VARIANT_ROWS = [
    {
        key: 'line',
        cells: [
            <code key="v">line</code>,
            '1뎁스. 밑줄 트랙 위에 활성 탭만 굵은 글자와 진한 밑줄로 표시합니다.',
            '화면 상단의 큰 구분. TabsScrollArea 로 감싸 긴 목록과 좁은 화면에 대응합니다.',
        ],
    },
    {
        key: 'text',
        cells: [
            <code key="v">text</code>,
            '1뎁스. 트랙과 밑줄 없이 글자색만으로 활성 탭을 구분합니다. 글자는 항상 굵어 탭을 옮겨도 폭이 변하지 않습니다.',
            '개인정보 처리방침 · 이용약관의 보기 방식 전환. TabsScrollArea 로 감쌉니다.',
        ],
    },
    {
        key: 'pill-outline',
        cells: [
            <code key="v">pill-outline</code>,
            '2뎁스. 알약 버튼이 늘어서고 폭을 넘으면 다음 줄로 넘어갑니다. 비선택은 흰 면에 옅은 테두리입니다.',
            '흰 본문이나 카드 목록 위. 자주 묻는 질문 · 알기 쉬운 개인정보 처리방침 · K-BIGx 보고서 구성 항목.',
        ],
    },
    {
        key: 'pill',
        cells: [
            <code key="v">pill</code>,
            'pill-outline 과 같은 알약이지만 비선택이 페이지 배경(회색) 면입니다. 간격은 12로 더 넓습니다.',
            '회색 카드 위처럼 흰 면으로는 배경과 구분되지 않는 자리.',
        ],
    },
    {
        key: 'default',
        cells: [
            <code key="v">default</code>,
            'shadcn 기본 세그먼트. 회색 면 안에서 활성 탭만 흰 면으로 떠 보입니다.',
            '프로젝트 시안에 없는 모양이라 서비스 화면에서는 쓰지 않습니다.',
        ],
    },
    {
        key: 'plain',
        cells: [
            <code key="v">plain</code>,
            '표면 스타일이 없는 구조만 남깁니다.',
            '탭 모양이 전혀 다른 composite 가 자기 디자인을 얹을 때(FormTabs · 로그인 회원 유형).',
        ],
    },
] as const

// 조합 API 설명 — [컴포넌트, 이름, 설명, 기본값, 타입]
const PROPS_ITEMS = [
    ['Tabs', 'defaultValue', '비제어 방식의 초기 활성 탭 값입니다.', 'undefined', 'string'],
    [
        'Tabs',
        'value · onValueChange',
        '현재 활성 탭과 변경 콜백입니다. 밖에서 탭을 바꿔야 할 때만 제어합니다.',
        'undefined',
        'string · (value: string) => void',
    ],
    ['Tabs', 'orientation', '탭 이동 방향과 레이아웃 방향입니다.', "'horizontal'", "'horizontal' | 'vertical'"],
    [
        'TabsList',
        'variant',
        '탭 모양입니다. 위 종류 선택 표를 따릅니다.',
        "'default'",
        "'default' | 'line' | 'text' | 'pill' | 'pill-outline' | 'plain'",
    ],
    ['TabsList', 'aria-label', '탭 목록의 이름입니다. 스크린리더가 읽으므로 항상 넘깁니다.', 'undefined', 'string'],
    ['TabsTrigger', 'value', '같은 값을 가진 TabsContent 와 연결되는 고유 값입니다.', '-', 'string'],
    ['TabsTrigger', 'disabled', '개별 탭을 비활성화합니다.', 'false', 'boolean'],
    ['TabsContent', 'value', '연결할 TabsTrigger 의 값입니다.', '-', 'string'],
    [
        'TabsScrollArea',
        'variant',
        '감쌀 1뎁스 탭의 모양입니다. TabsList 의 variant 로 그대로 넘어갑니다.',
        "'line'",
        "'line' | 'text'",
    ],
    [
        'TabsScrollArea',
        '…TabsList props',
        'aria-label · className 등 TabsList 의 나머지 속성을 그대로 받습니다.',
        'undefined',
        'ComponentPropsWithoutRef<typeof TabsList>',
    ],
] as const

const TabsGuidePage = () => (
    <GuidePageShell
        title="탭 (Tabs)"
        description="한 화면 안에서 콘텐츠 영역을 전환하는 shadcn 기반 탭입니다. 1뎁스(line · text)와 2뎁스(pill · pill-outline) 모양을 variant 로 고릅니다."
    >
        <BaseCard>
            <section aria-labelledby="tabs-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="tabs-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        1뎁스 탭은 <code>TabsList</code> 대신 <code>TabsScrollArea</code> 로 감쌉니다. 탭이 폭을 넘치면
                        좌우 화살표와 가장자리 페이드가 자동으로 붙어 좁은 화면에서도 모든 탭에 닿을 수 있습니다. 탭과
                        본문 사이 간격은 각 <code>TabsContent</code> 에 줍니다.
                    </p>
                </div>
                <Tabs defaultValue={MYPAGE_TABS[0][0]}>
                    <TabsScrollArea aria-label="마이페이지 메뉴">
                        {MYPAGE_TABS.slice(0, BASIC_TAB_COUNT).map(([value, label]) => (
                            <TabsTrigger key={value} value={value}>
                                {label}
                            </TabsTrigger>
                        ))}
                    </TabsScrollArea>
                    {MYPAGE_TABS.slice(0, BASIC_TAB_COUNT).map(([value, label]) => (
                        <TabsContent
                            key={value}
                            value={value}
                            className="typo-body-l-regular text-label-foreground pt-6"
                        >
                            {label} 내용
                        </TabsContent>
                    ))}
                </Tabs>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tabs-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="tabs-variants" className="typo-h4-bold">
                        종류 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        화면의 큰 구분은 1뎁스(line · text), 그 안에서 한 번 더 나누는 자리는 2뎁스(pill · pill-outline)
                        입니다. 본문 패널 없이 값만 고르는 글자 탭은{' '}
                        <Link href="/component-guide/text-tabs" className={LINK_CLASS}>
                            텍스트 탭 (TextTabs)
                        </Link>
                        , 입력 폼의 섹션 탭은{' '}
                        <Link href="/component-guide/form-tabs" className={LINK_CLASS}>
                            폼 탭 (FormTabs)
                        </Link>
                        를 씁니다.
                    </p>
                </div>
                <Table
                    caption="TabsList variant 종류와 쓰는 자리"
                    columns={VARIANT_COLUMNS}
                    rows={VARIANT_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tabs-examples" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="tabs-examples" className="typo-h4-bold">
                        변형 예시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        기본 사용의 line 을 제외한 나머지 모양입니다.
                    </p>
                </div>

                {/* 소제목 블록마다 가로선과 같은 여백으로 갈라, 섹션 제목(24) → 소제목(18) → 본문(14) 순서가 보이게 한다. */}
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">글자만 (text)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            트랙과 밑줄이 없어 항목 간격이 24로 넓고 좌우 여백은 0입니다. 첫 항목이 콘텐츠 왼쪽 끝에
                            맞습니다.
                        </p>
                        <Tabs defaultValue="full" className="gap-0">
                            <TabsScrollArea variant="text" aria-label="보기 방식">
                                <TabsTrigger value="full">개인정보 처리방침</TabsTrigger>
                                <TabsTrigger value="easy">알기 쉬운 개인정보 처리방침</TabsTrigger>
                            </TabsScrollArea>
                            <TabsContent value="full" className="typo-body-l-regular text-label-foreground mt-10">
                                개인정보 처리방침 전문
                            </TabsContent>
                            <TabsContent value="easy" className="typo-body-l-regular text-label-foreground mt-6">
                                알기 쉬운 개인정보 처리방침
                            </TabsContent>
                        </Tabs>
                        <CodeBlock code={TEXT_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">알약 (pill-outline · pill)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            1뎁스 탭 안에서 한 단계 더 나누는 2뎁스 탭입니다. 선택 항목은 두 모양 모두 navy 면에 흰 굵은
                            글자이고 비선택 항목의 면만 다릅니다. 항목이 폭을 넘으면 다음 줄로 넘어갑니다.
                        </p>
                        <Tabs defaultValue="easy" className="gap-0">
                            <TabsScrollArea variant="text" aria-label="보기 방식 (알약 예시)">
                                <TabsTrigger value="full">개인정보 처리방침</TabsTrigger>
                                <TabsTrigger value="easy">알기 쉬운 개인정보 처리방침</TabsTrigger>
                            </TabsScrollArea>
                            <TabsContent value="full" className="typo-body-l-regular text-label-foreground mt-10">
                                전문을 그대로 싣는 화면이라 2뎁스 탭이 없습니다.
                            </TabsContent>
                            <TabsContent value="easy" className="mt-6">
                                <Tabs defaultValue="collection" className="gap-10">
                                    <TabsList variant="pill-outline" aria-label="알기 쉬운 처리방침 항목">
                                        {POLICY_SECTIONS.map(([section, sectionLabel]) => (
                                            <TabsTrigger key={section} value={section}>
                                                {sectionLabel}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    {POLICY_SECTIONS.map(([section, sectionLabel]) => (
                                        <TabsContent
                                            key={section}
                                            value={section}
                                            className="typo-body-l-regular text-label-foreground"
                                        >
                                            {sectionLabel} 내용
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </TabsContent>
                        </Tabs>
                        <CodeBlock code={PILL_CODE} language="tsx" copyLabel="복사" />
                        <p className="typo-body-l-regular text-label-foreground">
                            같은 탭을 <code>variant=&quot;pill&quot;</code> 로 두면 비선택 항목이 페이지 배경 면이
                            됩니다.
                        </p>
                        <Tabs defaultValue="collection" className="gap-10">
                            <TabsList variant="pill" aria-label="처리방침 항목 (회색 면)">
                                {POLICY_SECTIONS.map(([section, sectionLabel]) => (
                                    <TabsTrigger key={section} value={section}>
                                        {sectionLabel}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            {POLICY_SECTIONS.map(([section, sectionLabel]) => (
                                <TabsContent
                                    key={section}
                                    value={section}
                                    className="typo-body-l-regular text-label-foreground"
                                >
                                    {sectionLabel} 내용
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">많은 탭 (좌우 스크롤)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            400px 영역에 탭 여덟 개를 넣은 예시입니다. 화살표는 탭을 선택하지 않고 목록만 탭 하나
                            너비만큼 옮기며, 더 갈 수 없는 쪽은 흐리게 표시됩니다. 키보드로 탭을 옮기면 포커스된 탭이
                            영역 가운데에 오고, 스크롤할 수 있는 가장자리는 페이드로 표시됩니다.
                        </p>
                        <div className="bg-surface border-border max-w-100 rounded-md border p-4">
                            <Tabs defaultValue={MYPAGE_TABS[0][0]}>
                                <TabsScrollArea aria-label="마이페이지 메뉴 (스크롤 예시)">
                                    {MYPAGE_TABS.map(([value, label]) => (
                                        <TabsTrigger key={value} value={value}>
                                            {label}
                                        </TabsTrigger>
                                    ))}
                                </TabsScrollArea>
                                {MYPAGE_TABS.map(([value, label]) => (
                                    <TabsContent
                                        key={value}
                                        value={value}
                                        className="typo-body-l-regular text-label-foreground pt-6"
                                    >
                                        {label} 내용
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>
                        <CodeBlock code={SCROLL_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tabs-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="tabs-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        탭 역할과 키보드 조작은 Radix 가 제공하므로 사용처에서 다시 만들지 않습니다[8.2.1].
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>role=&quot;tab&quot;</code> · <code>tabpanel</code> 연결, <kbd>←</kbd> <kbd>→</kbd> 이동,
                        선택 탭만 Tab 키 순서에 드는 roving tabindex 가 기본으로 붙습니다.
                    </li>
                    <li>
                        <code>TabsList</code> 와 <code>TabsScrollArea</code> 에는 항상 <code>aria-label</code> 로 탭
                        묶음의 이름을 넘깁니다.
                    </li>
                    <li>
                        본문 패널(<code>TabsContent</code>)도 Tab 키 순서에 들어가며 포커스 링이 표시됩니다[6.1.2].
                    </li>
                    <li>
                        스크롤 화살표는 더 갈 수 없을 때 <code>disabled</code> 대신 <code>aria-disabled</code> 로 두어
                        포커스가 사라지지 않고, 스크롤 이동은 <code>prefers-reduced-motion</code> 을 존중합니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tabs-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="tabs-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        그 밖의 Radix Tabs 속성도 그대로 넘길 수 있습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Tabs 조합 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default TabsGuidePage
