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
    ['TabsList', 'variant', '세그먼트 기본형 또는 프로젝트 언더라인형입니다.', "'default'", "'default' | 'line'"],
    ['TabsList', 'aria-label', '탭 목록의 접근 가능한 이름입니다.', 'undefined', 'string'],
    ['TabsTrigger', 'value', '같은 값을 가진 TabsContent와 연결되는 고유 값입니다.', '-', 'string'],
    ['TabsTrigger', 'disabled', '개별 탭을 비활성화합니다.', 'false', 'boolean'],
    ['TabsContent', 'value', '연결할 TabsTrigger의 값입니다.', '-', 'string'],
    [
        'TabsScrollArea',
        'TabsList props',
        'line 탭에 스크롤 버튼·가장자리 페이드·키보드 중앙 정렬을 추가합니다.',
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
            <section aria-labelledby="tabs-default" className="flex flex-col gap-4">
                <div>
                    <h2 id="tabs-default" className="typo-h4-bold">
                        세그먼트 (default)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">variant</code>를 생략하면 기본 세그먼트형을 사용합니다. 프로젝트
                        화면의 언더라인형이 필요할 때만 <code className="font-mono">TabsScrollArea</code>를 선택합니다.
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
