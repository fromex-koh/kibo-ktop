import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {SubPageLayout} from '@/components/composite/page-layout'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '서브페이지 레이아웃 (SubPageLayout)'}

const USAGE_CODE = `import type {ReactNode} from 'react'
import {DEFAULT_HEADER_NAVIGATION} from '@/components/composite/header'
import {SubPageLayout} from '@/components/composite/page-layout'

// app/corp/(service)/layout.tsx 또는 app/org/(service)/layout.tsx
const ServiceLayout = async ({children}: {children: ReactNode}) => {
  // 실제 인증 함수로 로그인 사용자 정보를 조회한다.
  const user = await getCurrentUser()
  const userType = user?.userType
  const headerUser = user
    ? {name: user.name, sessionRemaining: user.sessionRemaining}
    : undefined

  return (
    <SubPageLayout
      userType={userType}
      showUserTypeToggle={userType === undefined}
      user={headerUser}
      navigationByUserType={DEFAULT_HEADER_NAVIGATION}
    >
      {children}
    </SubPageLayout>
  )
}`

const PAGE_USAGE_CODE = `const TermsPage = () => (
  <main id="main" tabIndex={-1} className="bg-surface flex-1">
    <div className="content-layout">
      <PageTitleBar title="이용약관" />
      {/* 화면별 콘텐츠 */}
    </div>
  </main>
)`

const PROPS_ITEMS = [
    [
        'SubPageLayout',
        'userType',
        '로그인 후 확정된 사용자 유형입니다. 전달하면 Header의 기업·기관 메뉴를 해당 유형으로 고정합니다.',
        'undefined',
        'UserType | undefined',
    ],
    [
        'SubPageLayout',
        'showUserTypeToggle',
        'Header의 기업/기관 토글 노출 여부입니다. userType이 없으면 true, 확정된 userType이 있으면 false로 연결합니다.',
        'userType === undefined',
        'boolean | undefined',
    ],
    [
        'SubPageLayout',
        'user',
        '로그인 사용자 정보입니다. 전달하면 Header에 사용자명·유형 배지·로그인 유지 시간을 표시합니다.',
        'undefined',
        'HeaderUser | undefined',
    ],
    [
        'SubPageLayout',
        'navigationByUserType',
        '기업(corp)·기관(org)별 GNB와 전체 메뉴를 전달합니다. 생략하면 Header 기본 메뉴를 사용합니다.',
        '기본 메뉴',
        'HeaderNavigationByUserType | undefined',
    ],
    ['SubPageLayout', 'logoHref', 'Header 로고 클릭 시 이동 경로입니다.', '/', 'string | undefined'],
    [
        'SubPageLayout',
        'skipLinks',
        '반복 영역을 건너뛸 링크 목록입니다. 생략하면 #main으로 이동하는 본문 바로가기를 사용합니다.',
        "[{href: '#main', label: '본문 바로가기'}]",
        'SkipLinkItem[] | undefined',
    ],
    ['SubPageLayout', 'children', 'Header와 Footer 사이에 렌더링할 페이지 콘텐츠입니다.', '—', 'ReactNode'],
] as const

const RESPONSIBILITIES = [
    {
        name: 'Header',
        description: 'overlay=false로 고정형 헤더를 표시하고, 서브페이지에서 테마 버튼을 노출합니다.',
    },
    {
        name: '기업/기관 상태',
        description: 'userType을 전달하면 Header의 GNB·전체 메뉴·회원 배지를 해당 유형으로 고정합니다.',
    },
    {
        name: 'SkipNav',
        description: '반복 영역을 건너뛰어 페이지의 main 콘텐츠로 이동하는 본문 바로가기 링크를 제공합니다.',
    },
    {
        name: 'Footer',
        description: 'subpage variant로 서브페이지용 사이트 정보 영역을 표시합니다.',
    },
] as const

const SubPageLayoutGuidePage = () => (
    <GuidePageShell
        title="서브페이지 레이아웃 (SubPageLayout)"
        description="이용약관·개인정보 처리방침처럼 Header·본문·Footer를 공유하는 일반 서비스 서브페이지의 공통 레이아웃입니다. 풀페이지 상태 화면과 분리한 (service) Route Group에서 하위 페이지에 공통 적용합니다."
    >
        <BaseCard>
            <section aria-labelledby="sub-page-layout-preview" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="sub-page-layout-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        실제 <code className="font-mono">SubPageLayout</code>을 축소된 미리보기 영역에 배치했습니다.
                        Header 상단의 기업·기관 토글을 사용하면 URL을 변경하지 않고 메뉴를 확인할 수 있습니다.
                    </p>
                </div>
                <div className="border-border h-160 overflow-auto rounded-lg border">
                    <SubPageLayout>
                        <section className="bg-surface flex-1">
                            <div className="content-layout flex min-h-80 items-center justify-center py-16">
                                <p className="typo-title-l-bold">페이지 콘텐츠 영역</p>
                            </div>
                        </section>
                    </SubPageLayout>
                </div>
                <p className="typo-caption-regular text-muted-foreground">
                    미리보기는 가이드 셸 안에서 중복 main을 피하기 위해 section으로 구성했습니다. 실제 화면에서는{' '}
                    <code className="font-mono">main id=&quot;main&quot; tabIndex=&#123;-1&#125;</code>를 children으로
                    사용합니다.
                </p>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sub-page-layout-usage" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="sub-page-layout-usage" className="typo-h4-bold">
                        사용법
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        일반 서비스 화면의 <code className="font-mono">(service)/layout.tsx</code>에서 한 번 감싸고,{' '}
                        <code className="font-mono">page.tsx</code>에는 본문만 작성합니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="SubPageLayout 사용 코드 복사" />
                <CodeBlock code={PAGE_USAGE_CODE} language="tsx" copyLabel="서브페이지 본문 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sub-page-layout-responsibilities" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="sub-page-layout-responsibilities" className="typo-h4-bold">
                        기본 구성
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        페이지마다 Header·Footer·접근성 공통 영역을 반복해서 작성하지 않도록 레이아웃에서 관리합니다.
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
            <section aria-labelledby="sub-page-layout-props" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="sub-page-layout-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        로그인 전에는 userType을 전달하지 않아 기업/기관 토글을 표시하고, 로그인 후에는 서버에서 조회한{' '}
                        userType을 전달해 Header 상태를 고정합니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SubPageLayout Props 목록" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sub-page-layout-rules" className="flex flex-col gap-4">
                <h2 id="sub-page-layout-rules" className="typo-h4-bold">
                    사용 원칙
                </h2>
                <ul className="typo-body-l-regular text-foreground-subtle flex list-disc flex-col gap-2 pl-5">
                    <li>
                        이용약관·개인정보 처리방침처럼 일반 서비스 Header와 Footer가 필요한 화면의 route{' '}
                        <code className="font-mono">(service)/layout.tsx</code>에서 사용합니다. 이 레이아웃은 하위 일반
                        페이지 이동에도 유지됩니다.
                    </li>
                    <li>
                        로그인 전에는 <code className="font-mono">userType</code>을 비워 기업/기관 토글을 표시합니다.
                    </li>
                    <li>
                        로그인 후에는 서버 세션·인증 API의 <code className="font-mono">userType</code>을 전달해 해당
                        유형의 GNB와 전체 메뉴를 고정합니다.
                    </li>
                    <li>
                        <code className="font-mono">not-found</code>·<code className="font-mono">server-error</code>·
                        <code className="font-mono">maintenance</code>처럼 Header·Footer가 없는 풀페이지 상태 화면은{' '}
                        <code className="font-mono">(service)</code> 밖에 둡니다.
                    </li>
                    <li>
                        메인 랜딩페이지는 같은 Header 데이터 흐름을 사용하는{' '}
                        <code className="font-mono">MainPageLayout</code>을 사용합니다. 배치·테마·Footer만 다릅니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SubPageLayoutGuidePage
