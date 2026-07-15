import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/kit/tabs'
import {TabsScrollArea} from '@/components/composite/tabs-scroll-area'

export const metadata: Metadata = {title: '탭 (Tabs)'}

// 좌우 스크롤 케이스 데모용 — 실제 화면처럼 폭이 좁아 탭이 다 안 들어가는 상황을 만든다.
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

// TabsScrollArea — kit/TabsList(variant="line") 를 그대로 대체하는 composite. 넘치면 좌우 화살표 버튼으로
// 넘겨보고 가장자리가 페이드된다 — 그래서 line 탭은 항상 TabsList 대신 이걸 쓴다(화면 폭이 좁아지거나 탭이
// 늘어나도 항상 안전하다).
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

const DEFAULT_VARIANT_CODE = `{/* variant 생략 시 기본값 — shadcn 세그먼트(알약) 탭, Figma 스펙 없어 원본 그대로 */}
<Tabs defaultValue="tab1">
  <TabsList aria-label="보기 전환">
    <TabsTrigger value="tab1">목록</TabsTrigger>
    <TabsTrigger value="tab2">카드</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">목록 보기</TabsContent>
  <TabsContent value="tab2">카드 보기</TabsContent>
</Tabs>`

// 조합 API 설명 — [이름, 설명, 타입]
const PROPS_ITEMS = [
    ['Tabs · defaultValue / value', '초기/현재 활성 탭 값. onValueChange 로 제어 모드 전환.', 'string'],
    ['TabsList · variant', "'line'(Figma 언더라인 탭) | 'default'(세그먼트 탭, shadcn 원본).", "'line' | 'default'"],
    ['TabsList · aria-label', '탭 묶음 이름(스크린리더용, 필수).', 'string'],
    ['TabsTrigger · value', '해당 탭의 고유 값 — 같은 값의 TabsContent 와 연결된다.', 'string'],
    ['TabsContent · value', '해당 패널의 고유 값.', 'string'],
    [
        'TabsScrollArea',
        'line 탭에서 TabsList 대신 쓰는 composite(composite/tabs-scroll-area). 탭이 폭을 넘치면 좌우 화살표 버튼(데스크톱·모바일 공통)으로 넘겨보고, 키보드 화살표로 탭을 옮기면 활성 탭이 중앙에 오도록 스크롤된다. 좌우 가장자리는 배경색 그라데이션으로 페이드된다. Props 는 TabsList 와 동일(aria-label 등), variant 는 내부에서 항상 line.',
        'ComponentPropsWithoutRef<typeof TabsList>',
    ],
] as const

// 탭 — shadcn Tabs 프리미티브(원본에 이미 있는 variant="line")를 그대로 승격해 스타일만 Figma 값으로
// 교체했다([SC-03]). Figma "언더라인 탭"(마이페이지 상단 내비) 반영: 24px 텍스트·52px 높이·16px 간격,
// 비활성 gray.500 Regular → 활성 gray.900 Bold + 밑줄. 세그먼트(default) variant 는 Figma 스펙이 없어
// shadcn 원본 스타일 그대로 둔다. line 탭은 TabsList 를 직접 쓰지 않고 항상 TabsScrollArea(composite) 로
// 감싼다 — 탭이 많거나 화면이 좁아 넘쳐도 좌우 화살표로 넘겨보고 가장자리가 페이드되는 안전한 기본 선택지다.
const TabsGuidePage = () => (
    <GuidePageShell
        title="탭 (Tabs)"
        description="shadcn Tabs 프리미티브입니다. 원본에 이미 있던 line variant 스타일을 Figma 언더라인 탭 값으로 교체해 승격했습니다. line 탭은 TabsScrollArea 로 감싸, 화면이 좁아지거나 탭이 늘어나면 좌우 화살표 버튼(데스크톱·모바일 공통)으로 넘겨보고 가장자리가 페이드됩니다. 키보드 좌우 화살표로 탭을 옮기면 활성 탭이 중앙에 오도록 스크롤됩니다."
    >
        <section aria-labelledby="tabs-line-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="tabs-line-usage" className="typo-h4-bold">
                    사용 예시 — 언더라인 (line)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Figma 마이페이지 상단 내비 케이스입니다. 활성 탭만 굵게 + 밑줄로 강조되고, 나머지는 옅은 회색입니다.{' '}
                    <code className="font-mono">TabsList</code> 대신 <code className="font-mono">TabsScrollArea</code>{' '}
                    를 씁니다 — 창을 좁혀 탭이 넘치면 좌우 화살표 버튼으로 넘겨봅니다(아래{' '}
                    <a href="#tabs-scroll" className="text-primary underline underline-offset-2">
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

        <section aria-labelledby="tabs-scroll" className="flex flex-col gap-4">
            <div>
                <h2 id="tabs-scroll" className="typo-h4-bold">
                    많은 탭 (좌우 스크롤)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    위와 같은 <code className="font-mono">TabsScrollArea</code> 가 실제로 넘칠 때 어떻게 바뀌는지
                    보여주는 예시입니다 — 좁은 폭(400px)에 8개 탭을 넣어 재현했습니다. 좌우 화살표 버튼(데스크톱·모바일
                    공통)으로 넘겨보고, 더 넘길 수 없는 쪽 화살표는 흐리게 비활성됩니다. 키보드 좌우 화살표로 탭을
                    옮기면 활성 탭이 중앙에 오도록 스크롤되고, 좌우 가장자리는 그라데이션으로 페이드됩니다.
                </p>
            </div>
            <div className="border-border max-w-100 rounded-md border p-4">
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

        <section aria-labelledby="tabs-default" className="flex flex-col gap-4">
            <div>
                <h2 id="tabs-default" className="typo-h4-bold">
                    세그먼트 (default)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">variant</code> 를 생략하면 shadcn 원본의 세그먼트(알약) 탭입니다. Figma
                    스펙이 없어 원본 스타일 그대로 둡니다.
                </p>
            </div>
            <Tabs defaultValue="tab1">
                <TabsList aria-label="보기 전환">
                    <TabsTrigger value="tab1">목록</TabsTrigger>
                    <TabsTrigger value="tab2">카드</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="typo-body-l-regular text-muted-foreground pt-4">
                    목록 보기
                </TabsContent>
                <TabsContent value="tab2" className="typo-body-l-regular text-muted-foreground pt-4">
                    카드 보기
                </TabsContent>
            </Tabs>
            <CodeBlock code={DEFAULT_VARIANT_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="tabs-props" className="flex flex-col gap-4">
            <div>
                <h2 id="tabs-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">Tabs 조합에서 넘기는 속성입니다.</p>
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

export default TabsGuidePage
