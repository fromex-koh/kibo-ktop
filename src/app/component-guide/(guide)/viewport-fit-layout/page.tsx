import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {ViewportFitLayout} from '@/components/composite/viewport-fit-layout'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '뷰포트 맞춤 레이아웃 (ViewportFitLayout)'}

const USAGE_CODE = `import Header from '@/components/composite/header'
import {StepNavigation} from '@/components/composite/step-navigation'
import {ViewportFitLayout} from '@/components/composite/viewport-fit-layout'

<ViewportFitLayout
  header={<Header overlay={false} />}
  footer={
    <StepNavigation
      prev={{children: '메인으로 이동'}}
      next={{children: '결과조회'}}
    />
  }
  mainProps={{id: 'main', tabIndex: -1}}
>
  <PageTitleBar title="제출 완료" />
  <CompletionHero />
  <InfoBox />
  <CompletionActions />
</ViewportFitLayout>`

const PROPS_ITEMS = [
    [
        'ViewportFitLayout',
        'header',
        '본문 위에 배치할 사이트 Header 또는 페이지 상단 영역입니다.',
        'undefined',
        'ReactNode',
    ],
    [
        'ViewportFitLayout',
        'footer',
        '본문 아래에 배치할 StepNavigation 같은 하단 액션 영역입니다.',
        'undefined',
        'ReactNode',
    ],
    [
        'ViewportFitLayout',
        'contentAs',
        '본문 컨테이너 요소입니다. 일반 페이지는 main을 유지하고, 이미 main 안에 임베드하는 미리보기에서만 div를 사용합니다.',
        "'main'",
        "'main' | 'div'",
    ],
    [
        'ViewportFitLayout',
        'mainProps',
        '내부 본문 요소에 id·tabIndex·aria-*·className 등을 전달합니다.',
        'undefined',
        "ComponentProps<'main'>",
    ],
    ['ViewportFitLayout', 'children', '한 화면에서 완결할 제목·상태·안내·액션 콘텐츠입니다.', '—', 'ReactNode'],
    [
        'ViewportFitLayout',
        'className · div props',
        '최상위 레이아웃 div에 추가 클래스와 네이티브 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
] as const

const BEHAVIORS = [
    {
        condition: '콘텐츠 합계 ≤ 100dvh',
        result: 'Header·본문·하단 액션을 스크롤 없이 한 화면에 배치합니다.',
    },
    {
        condition: '화면 높이 감소',
        result: 'dvh 계산으로 본문 간격·패딩과 장식 크기를 토큰 범위 안에서 점진적으로 줄입니다.',
    },
    {
        condition: '콘텐츠 합계 > 100dvh',
        result: '요소를 자르거나 scale로 축소하지 않고 레이아웃 높이가 늘어나 문서 스크롤로 전환됩니다.',
    },
    {
        condition: '문구 증가·확대·줄바꿈',
        result: '고정 임계값이 아니라 실제 콘텐츠 높이로 판정하므로 같은 안전한 fallback을 사용합니다.',
    },
] as const

const ViewportFitLayoutGuidePage = () => (
    <GuidePageShell
        title="뷰포트 맞춤 레이아웃 (ViewportFitLayout)"
        description="완료·결과·안내처럼 한 화면에서 완결해야 하는 페이지의 Header·본문·하단 액션을 배치하고, 공간이 부족하면 안전한 문서 스크롤로 전환하는 합성 레이아웃입니다."
    >
        <BaseCard>
            <section aria-labelledby="viewport-fit-preview" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="viewport-fit-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        아래 미리보기는 실제 슬롯 구조를 축소해 보여줍니다. 실사용에서는 최상위 높이가{' '}
                        <code className="font-mono">min-h-dvh</code>라 브라우저의 동적 뷰포트를 기준으로 동작합니다.
                    </p>
                </div>
                <ViewportFitLayout
                    className="border-border h-96 min-h-0 overflow-auto rounded-md border"
                    contentAs="div"
                    header={
                        <div className="bg-card border-border flex items-center border-b px-6 py-3">
                            <span className="typo-body-l-medium">Header slot</span>
                        </div>
                    }
                    footer={
                        <div className="bg-cta-surface border-border flex justify-between border-t px-6 py-3">
                            <Button variant="tertiary" size="sm">
                                이전
                            </Button>
                            <Button size="sm">결과 확인</Button>
                        </div>
                    }
                    mainProps={{className: 'px-6'}}
                >
                    <div>
                        <p className="typo-title-l-bold">Page title</p>
                        <p className="typo-body-l-regular text-foreground-subtle">완료 화면의 제목 영역</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <span
                            aria-hidden="true"
                            className="bg-primary outline-primary-subtle size-12 rounded-full outline-8"
                        />
                        <p className="typo-title-l-bold mt-3">작업이 완료되었습니다.</p>
                    </div>
                    <div className="bg-card border-border rounded-md border px-4 py-3">
                        <p className="typo-body-l-regular text-foreground-subtle">
                            안내 콘텐츠와 후속 행동을 본문 슬롯에 배치합니다.
                        </p>
                    </div>
                </ViewportFitLayout>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="ViewportFitLayout 사용 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="viewport-fit-behavior" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="viewport-fit-behavior" className="typo-h4-bold">
                        높이 판정과 fallback
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        스크롤을 켜는 고정 breakpoint는 없습니다. 실제 렌더링된 콘텐츠의 최소 높이가{' '}
                        <code className="font-mono">100dvh</code>를 넘는지가 기준입니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-md border">
                    <table className="w-full text-left">
                        <caption className="sr-only">ViewportFitLayout 높이 조건별 동작</caption>
                        <thead>
                            <tr className="bg-card border-border border-b">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    조건
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    동작
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {BEHAVIORS.map((item) => (
                                <tr key={item.condition} className="border-border border-b last:border-b-0">
                                    <th scope="row" className="typo-body-l-medium text-primary-strong px-4 py-3">
                                        {item.condition}
                                    </th>
                                    <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">
                                        {item.result}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="typo-body-l-regular text-foreground-subtle">
                    현재 적용 화면은{' '}
                    <Link
                        href="/component-guide/self-diagnosis/complete"
                        className="text-primary-strong underline underline-offset-4"
                    >
                        자가진단 제출 완료
                    </Link>
                    이며, 1280×720 이상의 일반 노트북·PC와 태블릿 가로·세로에서 한 화면 표시를 확인했습니다.
                </p>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="viewport-fit-tokens" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="viewport-fit-tokens" className="typo-h4-bold">
                        토큰과 밀도
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        최소·최대 크기와 간격은 토큰을 사용하고, 중간값만 현재 뷰포트 높이에 비례해 계산합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-foreground-subtle flex list-disc flex-col gap-2 pl-5">
                    <li>
                        장식 최대 크기: <code className="font-mono">size.action-check</code> — 150px
                    </li>
                    <li>
                        장식 최소 크기: <code className="font-mono">size.viewport-fit-decorative-min</code> — 96px
                    </li>
                    <li>
                        본문 패딩·간격의 최소·최대: <code className="font-mono">--spacing(n)</code>
                    </li>
                    <li>
                        유동 중간값: <code className="font-mono">dvh</code> — 모바일 브라우저 UI 변화를 반영
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="viewport-fit-props" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="viewport-fit-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        레이아웃은 슬롯의 배치와 높이 fallback만 담당하고, Header·콘텐츠·CTA의 의미와 스타일은 각
                        컴포넌트가 관리합니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ViewportFitLayout Props 목록" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="viewport-fit-notes" className="flex flex-col gap-4">
                <h2 id="viewport-fit-notes" className="typo-h4-bold">
                    사용 원칙
                </h2>
                <ul className="typo-body-l-regular text-foreground-subtle flex list-disc flex-col gap-2 pl-5">
                    <li>완료·결과·안내처럼 정보량이 제한되고 한 화면 완결이 중요한 화면에 사용합니다.</li>
                    <li>
                        긴 폼·목록·검색 결과처럼 본문 길이가 계속 달라지는 화면에는 일반 문서 레이아웃을 사용합니다.
                    </li>
                    <li>
                        <code className="font-mono">overflow-hidden</code>이나 전체{' '}
                        <code className="font-mono">scale()</code>로 콘텐츠를 강제로 맞추지 않습니다.
                    </li>
                    <li>
                        확대·문구 증가·번역으로 공간이 부족하면 스크롤을 허용해 콘텐츠와 키보드 접근성을 보존합니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ViewportFitLayoutGuidePage
