import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {MainPageLayout} from '@/components/composite/page-layout'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable, {type PropsTableItem} from '@/components/custom/props-table'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {TriangleAlert} from 'lucide-react'

export const metadata: Metadata = {title: '메인페이지 레이아웃 (MainPageLayout)'}

const USAGE_CODE = `import type {ReactNode} from 'react'
import {DEFAULT_HEADER_NAVIGATION} from '@/components/composite/header'
import {MainPageLayout} from '@/components/composite/page-layout'
import StackPager from '@/components/custom/stack-pager'

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

const FOOTER_USAGE_CODE = `<TechEvalSection
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
        '로그인 후 확정된 사용자 유형입니다. 전달하면 Header의 기업·기관 메뉴를 해당 유형으로 고정합니다.',
        'undefined',
        'UserType | undefined',
    ],
    [
        'MainPageLayout',
        'showUserTypeToggle',
        'Header의 기업/기관 토글 노출 여부입니다. 로그인 전에는 true, 확정된 userType이 있으면 false로 전달합니다.',
        'userType === undefined',
        'boolean | undefined',
    ],
    [
        'MainPageLayout',
        'user',
        '로그인 사용자 정보입니다. 전달하면 Header에 사용자명·유형 배지·로그인 유지 시간을 표시합니다.',
        'undefined',
        'HeaderUser | undefined',
    ],
    [
        'MainPageLayout',
        'navigationByUserType',
        '기업(corp)·기관(org)별 GNB와 전체 메뉴를 전달합니다. 생략하면 Header 기본 메뉴를 사용합니다.',
        '기본 메뉴',
        'HeaderNavigationByUserType | undefined',
    ],
    ['MainPageLayout', 'logoHref', 'Header 로고 클릭 시 이동 경로입니다.', '/', 'string | undefined'],
    [
        'MainPageLayout',
        'skipLinks',
        '메인 섹션으로 이동하는 Skip Navigation 링크 목록입니다. 생략하면 #main 본문 바로가기를 사용합니다.',
        "[{href: '#main', label: '본문 바로가기'}]",
        'SkipLinkItem[] | undefined',
    ],
    [
        'MainPageLayout',
        'children',
        'StackPager 안에서 렌더링할 MainPageHeaderState와 main 콘텐츠입니다.',
        '—',
        'ReactNode',
    ],
] satisfies readonly PropsTableItem[]

const RESPONSIBILITIES = [
    {
        name: 'Header',
        description:
            'overlay=true와 테마 버튼 숨김을 기본으로 사용하며, 전달받은 userType·user·메뉴 데이터를 Header로 전달합니다.',
    },
    {
        name: 'StackPager 배치',
        description: 'MainPageLayout은 StackPager 내부에 배치해야 Header 배경 상태와 섹션 전환 흐름이 유지됩니다.',
    },
    {
        name: 'SkipNav',
        description:
            '메인 섹션별 바로가기 링크를 표시합니다. 각 href의 대상은 children에서 id와 tabIndex={-1}로 제공합니다.',
    },
    {
        name: 'Footer',
        description: 'Footer는 레이아웃이 자동으로 렌더링하지 않으며, 마지막 섹션의 bottomContent에 직접 배치합니다.',
    },
] as const

const MainPageLayoutGuidePage = () => (
    <GuidePageShell
        title="메인페이지 레이아웃 (MainPageLayout)"
        description="메인페이지 전용 레이아웃입니다. StackPager(화면 단위 전환·스크롤 관리) 기반 메인 랜딩페이지에서 Header 데이터 흐름과 Skip Navigation을 공통으로 관리합니다."
    >
        <BaseCard>
            <section aria-labelledby="main-page-layout-preview" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="main-page-layout-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        실제 <code className="font-mono">MainPageLayout</code>을 미리보기 영역에 배치했습니다.
                        메인페이지와 동일하게 overlay Header를 사용하지만, 가이드 셸과 겹치지 않도록 미리보기에서만
                        Header를 문서 흐름에 배치합니다.
                    </p>
                </div>
                <Alert color="warning">
                    <TriangleAlert aria-hidden="true" />
                    <AlertTitle>아래 테마 래퍼는 가이드 화면 확인용입니다.</AlertTitle>
                    <AlertDescription>
                        <code className="font-mono">.mainpage</code> 클래스를 미리보기에 고정해 가이드 페이지 Header의
                        라이트·다크 테마 버튼을 바꿔도 메인페이지 예시가 함께 바뀌지 않도록 했습니다. 실제
                        프로젝트에서는 이 래퍼를 추가하지 않고 메인페이지 테마를 사용합니다.
                    </AlertDescription>
                </Alert>
                <div className="flex flex-col gap-6">
                    {THEME_CASES.map((themeCase) => (
                        <div key={themeCase.theme} className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-baseline gap-2">
                                <h3 className="typo-body-xl-bold text-foreground">{themeCase.label}</h3>
                                <code className="typo-body-l-regular text-muted-foreground font-mono">
                                    .{themeCase.theme}
                                </code>
                            </div>
                            <p className="typo-body-l-regular text-muted-foreground">{themeCase.description}</p>
                            <div className={themeCase.theme}>
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
                        </div>
                    ))}
                </div>
                <p className="typo-caption-regular text-muted-foreground">
                    실제 사용 시에는 이 레이아웃을 <code className="font-mono">StackPager</code> 내부에 배치하고{' '}
                    <code className="font-mono">main id=&quot;main&quot; tabIndex=&#123;-1&#125;</code>를 children으로
                    제공합니다.
                </p>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="main-page-layout-usage" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="main-page-layout-usage" className="typo-h4-bold">
                        사용법
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        메인페이지의 route <code className="font-mono">page.tsx</code>에서{' '}
                        <code className="font-mono">StackPager</code> 안에 한 번 감싸고, 인증 사용자 정보와 기업·기관
                        메뉴를 <code className="font-mono">MainPageLayout</code>에 전달합니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="MainPageLayout 사용 코드 복사" />
                <CodeBlock code={FOOTER_USAGE_CODE} language="tsx" copyLabel="메인페이지 Footer 배치 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="main-page-layout-responsibilities" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="main-page-layout-responsibilities" className="typo-h4-bold">
                        기본 구성
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        SubPageLayout과 같은 Header 데이터 흐름을 사용하면서 메인페이지의 배치 요구사항만 분리합니다.
                    </p>
                </div>
                <dl className="grid gap-4 md:grid-cols-2">
                    {RESPONSIBILITIES.map((item) => (
                        <div
                            key={item.name}
                            className="border-border bg-card flex flex-col gap-1 rounded-lg border p-4"
                        >
                            <dt className="typo-body-xl-bold text-foreground">{item.name}</dt>
                            <dd className="typo-body-l-regular text-foreground-subtle">{item.description}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="main-page-layout-props" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="main-page-layout-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        로그인 전에는 userType을 전달하지 않아 기업/기관 토글을 표시하고, 로그인 후에는 서버에서 조회한{' '}
                        userType과 user를 전달해 Header의 메뉴와 사용자 상태를 고정합니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="MainPageLayout Props 목록" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="main-page-layout-rules" className="flex flex-col gap-4">
                <h2 id="main-page-layout-rules" className="typo-h4-bold">
                    사용 원칙
                </h2>
                <ul className="typo-body-l-regular text-foreground-subtle flex list-disc flex-col gap-2 pl-5">
                    <li>
                        일반 서비스 화면은 SubPageLayout을 사용하고, 메인 랜딩페이지에서만 MainPageLayout을 사용합니다.
                    </li>
                    <li>
                        MainPageLayout은 StackPager 밖으로 이동하지 않습니다. Header 배경 상태가 StackPager를 기준으로
                        동작합니다.
                    </li>
                    <li>Footer는 자동으로 추가되지 않으므로 마지막 섹션에서 mainpage variant로 배치합니다.</li>
                    <li>404·500·정기점검 같은 Header 없는 풀페이지 상태 화면에는 사용하지 않습니다.</li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default MainPageLayoutGuidePage
