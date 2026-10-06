// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {MainPageLayout} from '@/components/composite/page-layout'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable, {type PropsTableItem} from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import LayoutChoiceTable from '../sub-page-layout/layout-choice-table'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {TriangleAlert} from 'lucide-react'

export const metadata: Metadata = {title: '메인페이지 레이아웃 (MainPageLayout)'}

const USAGE_CODE = `import {DEFAULT_HEADER_NAVIGATION} from '@/components/composite/header'
import {MainPageLayout} from '@/components/composite/page-layout'
import MainPageHeaderState from '@/components/custom/main-page-header-state'
import StackPager from '@/components/custom/stack-pager'

// 섹션마다 바로가기 대상(id + tabIndex={-1})을 둔다.
const MAIN_PAGE_SKIP_LINKS = [
  {href: '#main', label: '본문 바로가기'},
  {href: '#site-info', label: '사이트 정보 바로가기'},
]

const MainPage = async () => {
  const user = await getCurrentUser()
  const userType = user?.userType
  const headerUser = user
    ? {name: user.name, sessionRemaining: user.sessionRemaining}
    : undefined

  return (
    <StackPager transition="cover">
      <MainPageLayout
        userType={userType}
        showUserTypeToggle={userType === undefined}
        user={headerUser}
        navigationByUserType={DEFAULT_HEADER_NAVIGATION}
        skipLinks={MAIN_PAGE_SKIP_LINKS}
      >
        <MainPageHeaderState />
        <main id="main" tabIndex={-1}>
          {/* 히어로·서비스 소개·기술평가 섹션 */}
        </main>
      </MainPageLayout>
    </StackPager>
  )
}`

const FOOTER_USAGE_CODE = `import Footer from '@/components/composite/footer'

<TechEvalSection
  bottomContent={
    <div id="site-info" tabIndex={-1}>
      <Footer variant="mainpage" />
    </div>
  }
/>`

const THEME_CASES = [
    {
        theme: 'mainpage',
        label: '메인페이지 모드',
        description: '메인 랜딩페이지에서 사용하는 mainpage 테마 토큰을 적용한 Header와 콘텐츠입니다.',
    },
] as const

const PROPS_ITEMS = [
    [
        'MainPageLayout',
        'userType',
        '로그인 후 확정된 사용자 유형입니다. 넘기면 Header 메뉴가 그 유형으로 고정됩니다.',
        '-',
        "'corp' | 'org'",
    ],
    [
        'MainPageLayout',
        'showUserTypeToggle',
        'Header 의 기업/기관 토글 노출 여부입니다. 넘기지 않으면 userType 이 없을 때만 보입니다.',
        'userType === undefined',
        'boolean',
    ],
    [
        'MainPageLayout',
        'user',
        '로그인 사용자 정보입니다. 넘기면 Header 에 사용자명 · 유형 배지 · 로그인 유지 시간이 보입니다.',
        '-',
        '{name: string; sessionRemaining: string}',
    ],
    [
        'MainPageLayout',
        'navigationByUserType',
        '기업(corp) · 기관(org)별 메뉴입니다.',
        'DEFAULT_HEADER_NAVIGATION',
        'HeaderNavigationByUserType',
    ],
    ['MainPageLayout', 'logoHref', 'Header 로고의 이동 경로입니다.', "'/'", 'string'],
    [
        'MainPageLayout',
        'skipLinks',
        '바로가기 링크 목록입니다. 메인 섹션별 링크를 넘깁니다.',
        "[{href: '#main', label: '본문 바로가기'}]",
        'readonly SkipLinkItem[]',
    ],
    ['MainPageLayout', 'children', 'MainPageHeaderState 와 main 콘텐츠입니다(필수).', '-', 'ReactNode'],
] satisfies readonly PropsTableItem[]

const PARTS_COLUMNS = [
    {key: 'name', header: '영역', align: 'start', rowHeader: true},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
] as const

const PARTS = [
    {name: 'SkipNav', desc: 'skipLinks 의 바로가기 링크를 Header 앞에 둡니다.'},
    {name: 'RouteScrollReset', desc: '라우트가 바뀌면 스크롤을 맨 위로 되돌립니다.'},
    {name: 'Header', desc: '본문 위에 겹쳐 고정되는(overlay) 헤더입니다. 테마 버튼은 보이지 않습니다.'},
    {name: 'children', desc: 'MainPageHeaderState 와 main 을 감싸지 않고 그대로 그립니다.'},
    {name: 'Footer', desc: '레이아웃이 그리지 않습니다. 마지막 섹션에 mainpage variant 로 직접 넣습니다.'},
] as const

const MainPageLayoutGuidePage = () => (
    <GuidePageShell
        title="메인페이지 레이아웃 (MainPageLayout)"
        description="StackPager 기반 메인 랜딩페이지의 overlay Header 와 바로가기 링크를 구성하는 전용 레이아웃입니다."
    >
        <BaseCard>
            <section aria-labelledby="main-page-layout-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="main-page-layout-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        메인페이지 <code>page.tsx</code>에서 <code>StackPager</code> 안에 한 번 감싸고 사용자 정보와
                        메뉴를 넘깁니다. Footer 는 레이아웃이 그리지 않으므로 마지막 섹션에 직접 넣습니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">레이아웃</h3>
                        <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="MainPageLayout 사용 코드 복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">Footer 배치</h3>
                        <CodeBlock
                            code={FOOTER_USAGE_CODE}
                            language="tsx"
                            copyLabel="메인페이지 Footer 배치 코드 복사"
                        />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">미리보기</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            실제 화면에서는 Header 가 본문 위에 겹쳐 고정됩니다. 미리보기에서만 Header 를 문서 흐름에
                            둡니다.
                        </p>
                        <Alert color="warning">
                            <TriangleAlert aria-hidden="true" />
                            <AlertTitle>아래 테마 래퍼는 가이드 화면 확인용입니다.</AlertTitle>
                            <AlertDescription>
                                미리보기에 <code className="font-mono">.mainpage</code> 클래스를 고정했습니다. 실제
                                화면에서는 이 래퍼를 추가하지 않습니다.
                            </AlertDescription>
                        </Alert>
                        {THEME_CASES.map((themeCase) => (
                            <div key={themeCase.theme} className={themeCase.theme}>
                                <div className="border-border bg-menu-overlay overflow-hidden rounded-lg border [&>header]:!static [&>header]:!inset-auto [&>header]:!z-auto">
                                    <MainPageLayout
                                        skipLinks={[
                                            {
                                                href: `#main-page-layout-preview-${themeCase.theme}`,
                                                label: '본문 바로가기',
                                            },
                                        ]}
                                    >
                                        <section
                                            id={`main-page-layout-preview-${themeCase.theme}`}
                                            tabIndex={-1}
                                            className="text-menu-overlay-foreground flex min-h-80 items-center justify-center px-6 py-16"
                                        >
                                            <p className="typo-title-l-bold">메인페이지 콘텐츠 영역</p>
                                        </section>
                                    </MainPageLayout>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="main-page-layout-parts" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="main-page-layout-parts" className="typo-h4-bold">
                        구성 요소
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        Header 와 바로가기 링크만 레이아웃이 그립니다. <code>children</code> 맨 앞에{' '}
                        <code>MainPageHeaderState</code>를 넣습니다.
                    </p>
                </div>
                <Table
                    caption="MainPageLayout 구성 요소 목록"
                    columns={PARTS_COLUMNS}
                    rows={PARTS.map((row) => ({
                        key: row.name,
                        cells: [<code key="name">{row.name}</code>, row.desc],
                    }))}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="main-page-layout-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="main-page-layout-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        메인 랜딩페이지에서만 씁니다. 일반 서비스 화면은 SubPageLayout 을 씁니다.
                    </p>
                </div>
                <LayoutChoiceTable />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="main-page-layout-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="main-page-layout-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        바로가기 링크는 레이아웃이 Header 앞에 둡니다. 대상은 사용처가 만듭니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        본문은 <code>main id=&quot;main&quot; tabIndex=&#123;-1&#125;</code>로 작성합니다[6.4.1].
                    </li>
                    <li>
                        <code>skipLinks</code>로 넘긴 각 <code>href</code> 대상(예: 사이트 정보)에 <code>id</code>와{' '}
                        <code>tabIndex=&#123;-1&#125;</code>을 줍니다[6.4.1].
                    </li>
                    <li>
                        페이지에 <code>metadata.title</code>과 <code>h1</code>을 하나 둡니다[6.4.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="main-page-layout-props" className="flex flex-col gap-6">
                <h2 id="main-page-layout-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="MainPageLayout Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default MainPageLayoutGuidePage
