import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs'
import {TabsScrollArea} from '@/components/composite/tabs-scroll-area'

export const metadata: Metadata = {title: '탭 (Tabs)'}

const MANY_TABS = [
    ['tab1', '내 정보 확인'],
    ['tab2', '진행현황 결과조회'],
    ['tab3', 'K-BIGx 보고서 이력'],
    ['tab4', '유료 서비스 관리'],
    ['tab5', '1:1 문의'],
    ['tab6', '알림 설정'],
    ['tab7', '결제 내역'],
    ['tab8', '이용약관'],
] as const

const POLICY_SECTIONS = [
    ['collection', '개인정보 수집'],
    ['usage', '개인정보 이용'],
    ['provision', '개인정보 제공'],
] as const

const LINE_USAGE_CODE = `<Tabs defaultValue="info">
  <TabsScrollArea aria-label="마이페이지 메뉴">
    <TabsTrigger value="info">내 정보 확인</TabsTrigger>
    <TabsTrigger value="status">진행현황 결과조회</TabsTrigger>
    <TabsTrigger value="report">K-BIGx 보고서 이력</TabsTrigger>
    <TabsTrigger value="paid">유료 서비스 관리</TabsTrigger>
    <TabsTrigger value="qna">1:1 문의</TabsTrigger>
  </TabsScrollArea>
  <TabsContent value="info">내 정보 확인 내용</TabsContent>
  <TabsContent value="status">진행현황 결과조회 내용</TabsContent>
  <TabsContent value="report">K-BIGx 보고서 이력 내용</TabsContent>
  <TabsContent value="paid">유료 서비스 관리 내용</TabsContent>
  <TabsContent value="qna">1:1 문의 내용</TabsContent>
</Tabs>`

const TWO_TAB_CODE = `<Tabs defaultValue="all">
  <TabsScrollArea aria-label="목록 필터">
    <TabsTrigger value="all">전체</TabsTrigger>
    <TabsTrigger value="pending">진행중</TabsTrigger>
  </TabsScrollArea>
  <TabsContent value="all">전체 목록</TabsContent>
  <TabsContent value="pending">진행중 목록</TabsContent>
</Tabs>`

const SCROLL_AREA_CODE = `<Tabs defaultValue="tab1">
  <TabsScrollArea aria-label="마이페이지 메뉴">
    <TabsTrigger value="tab1">내 정보 확인</TabsTrigger>
    <TabsTrigger value="tab2">진행현황 결과조회</TabsTrigger>
    <TabsTrigger value="tab3">K-BIGx 보고서 이력</TabsTrigger>
    <TabsTrigger value="tab4">유료 서비스 관리</TabsTrigger>
    <TabsTrigger value="tab5">1:1 문의</TabsTrigger>
    <TabsTrigger value="tab6">알림 설정</TabsTrigger>
    <TabsTrigger value="tab7">결제 내역</TabsTrigger>
    <TabsTrigger value="tab8">이용약관</TabsTrigger>
  </TabsScrollArea>
  <TabsContent value="tab1">내 정보 확인 내용</TabsContent>
  {/* ... */}
</Tabs>`

const TEXT_USAGE_CODE = `<Tabs defaultValue="full" className="gap-0">
  <TabsScrollArea variant="text" aria-label="보기 방식">
    <TabsTrigger value="full">개인정보 처리방침</TabsTrigger>
    <TabsTrigger value="easy">알기 쉬운 개인정보 처리방침</TabsTrigger>
  </TabsScrollArea>
  <TabsContent value="full" className="mt-10">개인정보 처리방침 전문</TabsContent>
  <TabsContent value="easy" className="mt-6">알기 쉬운 개인정보 처리방침</TabsContent>
</Tabs>`

const PILL_USAGE_CODE = `<Tabs defaultValue="easy" className="gap-0">
  <TabsScrollArea variant="text" aria-label="보기 방식">
    <TabsTrigger value="full">개인정보 처리방침</TabsTrigger>
    <TabsTrigger value="easy">알기 쉬운 개인정보 처리방침</TabsTrigger>
  </TabsScrollArea>
  <TabsContent value="easy" className="mt-6">
    <Tabs defaultValue="collection" className="gap-10">
      <TabsList variant="pill-outline" aria-label="처리방침 항목">
        <TabsTrigger value="collection">개인정보 수집</TabsTrigger>
        <TabsTrigger value="usage">개인정보 이용</TabsTrigger>
      </TabsList>
      <TabsContent value="collection">개인정보 수집 내용</TabsContent>
      <TabsContent value="usage">개인정보 이용 내용</TabsContent>
    </Tabs>
  </TabsContent>
  {/* ... */}
</Tabs>`

// 조합 API 설명 — [컴포넌트, 이름, 설명, 기본값, 타입]
const PROPS_ITEMS = [
    ['Tabs', 'defaultValue', '비제어 방식의 초기 활성 탭 값입니다.', 'undefined', 'string'],
    [
        'Tabs',
        'value · onValueChange',
        '현재 활성 탭과 변경 콜백으로 제어합니다.',
        'undefined',
        'string · (value: string) => void',
    ],
    ['Tabs', 'orientation', '탭 이동 방향과 레이아웃 방향입니다.', "'horizontal'", "'horizontal' | 'vertical'"],
    [
        'TabsList',
        'variant',
        '세그먼트 기본형·1뎁스(언더라인형·글자형)·2뎁스 알약형(회색 면·흰 면)입니다.',
        "'default'",
        "'default' | 'line' | 'text' | 'pill' | 'pill-outline'",
    ],
    ['TabsList', 'aria-label', '탭 목록의 접근 가능한 이름입니다.', 'undefined', 'string'],
    ['TabsTrigger', 'value', '같은 값을 가진 TabsContent와 연결되는 고유 값입니다.', '-', 'string'],
    ['TabsTrigger', 'disabled', '개별 탭을 비활성화합니다.', 'false', 'boolean'],
    ['TabsContent', 'value', '연결할 TabsTrigger의 값입니다.', '-', 'string'],
    [
        'TabsScrollArea',
        'variant',
        '감쌀 1뎁스 탭 모양입니다. TabsList의 variant를 그대로 넘깁니다.',
        "'line'",
        "'line' | 'text'",
    ],
    [
        'TabsScrollArea',
        'TabsList props',
        '1뎁스 탭에 스크롤 버튼·가장자리 페이드·키보드 중앙 정렬을 추가합니다.',
        'undefined',
        'ComponentPropsWithoutRef<typeof TabsList>',
    ],
] as const

const TabsGuidePage = () => (
    <GuidePageShell
        title="탭 (Tabs)"
        description="콘텐츠 영역을 전환하는 shadcn 기반 탭입니다. 프로젝트 언더라인형은 TabsScrollArea와 조합해 작은 화면과 긴 탭 목록에 대응합니다."
    >
        <BaseCard>
            <section aria-labelledby="tabs-line-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="tabs-line-usage" className="typo-h4-bold">
                        사용 예시 — 언더라인 (line)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        프로젝트 언더라인형입니다. 활성 탭은 굵은 제목과 밑줄로 표시합니다. 화면 폭에 안전하게
                        대응하려면 <code className="font-mono">TabsList</code> 대신{' '}
                        <code className="font-mono">TabsScrollArea</code>를 사용합니다(아래{' '}
                        <a href="#tabs-scroll" className="text-primary-strong underline underline-offset-2">
                            많은 탭
                        </a>{' '}
                        섹션 참고).
                    </p>
                </div>
                <Tabs defaultValue="info">
                    <TabsScrollArea aria-label="마이페이지 메뉴">
                        <TabsTrigger value="info">내 정보 확인</TabsTrigger>
                        <TabsTrigger value="status">진행현황 결과조회</TabsTrigger>
                        <TabsTrigger value="report">K-BIGx 보고서 이력</TabsTrigger>
                        <TabsTrigger value="paid">유료 서비스 관리</TabsTrigger>
                        <TabsTrigger value="qna">1:1 문의</TabsTrigger>
                    </TabsScrollArea>
                    <TabsContent value="info" className="typo-body-l-regular text-muted-foreground pt-6">
                        내 정보 확인 내용
                    </TabsContent>
                    <TabsContent value="status" className="typo-body-l-regular text-muted-foreground pt-6">
                        진행현황 결과조회 내용
                    </TabsContent>
                    <TabsContent value="report" className="typo-body-l-regular text-muted-foreground pt-6">
                        K-BIGx 보고서 이력 내용
                    </TabsContent>
                    <TabsContent value="paid" className="typo-body-l-regular text-muted-foreground pt-6">
                        유료 서비스 관리 내용
                    </TabsContent>
                    <TabsContent value="qna" className="typo-body-l-regular text-muted-foreground pt-6">
                        1:1 문의 내용
                    </TabsContent>
                </Tabs>
                <CodeBlock code={LINE_USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tabs-two" className="flex flex-col gap-4">
                <div>
                    <h2 id="tabs-two" className="typo-h4-bold">
                        탭 2개
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        탭 개수와 무관하게 같은 스타일이 적용됩니다. 각 탭은 텍스트 길이만큼만 폭을 차지합니다(hug).
                    </p>
                </div>
                <Tabs defaultValue="all">
                    <TabsScrollArea aria-label="목록 필터">
                        <TabsTrigger value="all">전체</TabsTrigger>
                        <TabsTrigger value="pending">진행중</TabsTrigger>
                    </TabsScrollArea>
                    <TabsContent value="all" className="typo-body-l-regular text-muted-foreground pt-6">
                        전체 목록
                    </TabsContent>
                    <TabsContent value="pending" className="typo-body-l-regular text-muted-foreground pt-6">
                        진행중 목록
                    </TabsContent>
                </Tabs>
                <CodeBlock code={TWO_TAB_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tabs-text" className="flex flex-col gap-4">
                <div>
                    <h2 id="tabs-text" className="typo-h4-bold">
                        글자만 (text)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        같은 1뎁스 탭이지만 밑줄 트랙과 활성 인디케이터가 없습니다. 글자는 상태와 무관하게 굵고 활성
                        탭은 진한 색으로만 구분하므로, 탭을 옮겨도 글자 폭이 변하지 않아 옆 항목이 밀리지 않습니다. 선이
                        없어 항목이 붙어 보이지 않도록 간격이 넓고 좌우 여백은 0입니다(첫 항목이 콘텐츠 왼쪽 끝에
                        맞습니다). 탭 아래 간격은 패널마다 다를 수 있어 <code className="font-mono">Tabs</code>의 gap이
                        아니라 각 <code className="font-mono">TabsContent</code>가 자기 윗 간격을 갖습니다.
                    </p>
                </div>
                <Tabs defaultValue="full" className="gap-0">
                    <TabsScrollArea variant="text" aria-label="보기 방식">
                        <TabsTrigger value="full">개인정보 처리방침</TabsTrigger>
                        <TabsTrigger value="easy">알기 쉬운 개인정보 처리방침</TabsTrigger>
                    </TabsScrollArea>
                    <TabsContent value="full" className="typo-body-l-regular text-muted-foreground mt-10">
                        개인정보 처리방침 전문
                    </TabsContent>
                    <TabsContent value="easy" className="typo-body-l-regular text-muted-foreground mt-6">
                        알기 쉬운 개인정보 처리방침
                    </TabsContent>
                </Tabs>
                <CodeBlock code={TEXT_USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tabs-pill" className="flex flex-col gap-4">
                <div>
                    <h2 id="tabs-pill" className="typo-h4-bold">
                        탭 안의 탭 — 알약 (pill · pill-outline)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        1뎁스 탭 안에서 한 단계 더 나누는 2뎁스 탭입니다. 선택 항목은 두 모양 모두 navy 면에 흰 굵은
                        글자이고, 비선택 항목의 표현만 다릅니다 — <code className="font-mono">pill</code>은 회색 면,{' '}
                        <code className="font-mono">pill-outline</code>은 흰 면에 옅은 테두리입니다. 회색 카드 위에서는
                        pill, 흰 본문이나 카드 목록 위에서는 pill-outline을 씁니다. 항목이 폭을 넘으면 다음 줄로
                        넘어갑니다.
                    </p>
                </div>
                <Tabs defaultValue="easy" className="gap-0">
                    <TabsScrollArea variant="text" aria-label="보기 방식">
                        <TabsTrigger value="full">개인정보 처리방침</TabsTrigger>
                        <TabsTrigger value="easy">알기 쉬운 개인정보 처리방침</TabsTrigger>
                    </TabsScrollArea>
                    <TabsContent value="full" className="typo-body-l-regular text-muted-foreground mt-10">
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
                                    className="typo-body-l-regular text-muted-foreground"
                                >
                                    {sectionLabel} 내용
                                </TabsContent>
                            ))}
                        </Tabs>
                    </TabsContent>
                </Tabs>
                <CodeBlock code={PILL_USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tabs-pill-gray" className="flex flex-col gap-4">
                <div>
                    <h2 id="tabs-pill-gray" className="typo-h4-bold">
                        회색 면 알약 (pill)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        위 2뎁스 탭의 다른 표현입니다. 비선택 항목이 페이지 배경 면이라 다크모드에서도 본문 표면과
                        구분됩니다. 간격은 12로 pill-outline(8)보다 넓습니다.
                    </p>
                </div>
                <Tabs defaultValue="collection" className="gap-10">
                    <TabsList variant="pill" aria-label="처리방침 항목">
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
                            className="typo-body-l-regular text-muted-foreground"
                        >
                            {sectionLabel} 내용
                        </TabsContent>
                    ))}
                </Tabs>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tabs-scroll" className="flex flex-col gap-4">
                <div>
                    <h2 id="tabs-scroll" className="typo-h4-bold">
                        많은 탭 (좌우 스크롤)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        400px 영역에 8개 탭을 넣은 예시입니다. 스크롤 버튼은 탭을 선택하지 않고 목록만 탭 하나 너비만큼
                        이동합니다. 탭 키보드 이동 시 포커스된 탭은 중앙에 맞춰지고, 스크롤 가능한 가장자리는 흰색
                        surface 그라데이션으로 표시됩니다.
                    </p>
                </div>
                <div className="bg-surface border-border max-w-100 rounded-md border p-4">
                    <Tabs defaultValue="tab1">
                        <TabsScrollArea aria-label="마이페이지 메뉴">
                            {MANY_TABS.map(([value, label]) => (
                                <TabsTrigger key={value} value={value}>
                                    {label}
                                </TabsTrigger>
                            ))}
                        </TabsScrollArea>
                        {MANY_TABS.map(([value, label]) => (
                            <TabsContent
                                key={value}
                                value={value}
                                className="typo-body-l-regular text-muted-foreground pt-6"
                            >
                                {label} 내용
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
                <CodeBlock code={SCROLL_AREA_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="tabs-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="tabs-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">Tabs 조합에서 넘기는 속성입니다.</p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Tabs 조합 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default TabsGuidePage
