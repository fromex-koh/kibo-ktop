// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {SubPageLayout} from '@/components/composite/page-layout'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import LayoutChoiceTable from './layout-choice-table'

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

const PAGE_USAGE_CODE = `import {PageTitleBar} from '@/components/composite/page-title-bar'

export const metadata = {title: '이용약관'}

const TermsPage = () => (
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
        '로그인 후 확정된 사용자 유형입니다. 넘기면 Header 메뉴와 Footer 가 그 유형으로 고정됩니다.',
        '-',
        "'corp' | 'org'",
    ],
    [
        'SubPageLayout',
        'showUserTypeToggle',
        'Header 의 기업/기관 토글 노출 여부입니다. 넘기지 않으면 userType 이 없을 때만 보입니다.',
        'userType === undefined',
        'boolean',
    ],
    [
        'SubPageLayout',
        'user',
        '로그인 사용자 정보입니다. 넘기면 Header 에 사용자명 · 유형 배지 · 로그인 유지 시간이 보입니다.',
        '-',
        '{name: string; sessionRemaining: string}',
    ],
    [
        'SubPageLayout',
        'navigationByUserType',
        '기업(corp) · 기관(org)별 메뉴입니다.',
        'DEFAULT_HEADER_NAVIGATION',
        'HeaderNavigationByUserType',
    ],
    ['SubPageLayout', 'logoHref', 'Header 로고의 이동 경로입니다.', "'/'", 'string'],
    [
        'SubPageLayout',
        'skipLinks',
        '바로가기 링크 목록입니다.',
        "[{href: '#main', label: '본문 바로가기'}]",
        'readonly SkipLinkItem[]',
    ],
    [
        'SubPageLayout',
        'footerUserType',
        'Footer 에만 적용할 사용자 유형입니다. 퍼블리싱 인덱스 화면 확인용이며 실제 서비스에서는 쓰지 않습니다.',
        'userType',
        "'corp' | 'org'",
    ],
    ['SubPageLayout', 'children', 'Header 와 Footer 사이에 들어갈 페이지 본문입니다(필수).', '-', 'ReactNode'],
] as const

const PARTS_COLUMNS = [
    {key: 'name', header: '영역', align: 'start', rowHeader: true},
    {key: 'desc', header: '설명', align: 'start', wrap: true},
] as const

const PARTS = [
    {name: 'SkipNav', desc: 'skipLinks 의 바로가기 링크를 Header 앞에 둡니다.'},
    {name: 'RouteScrollReset', desc: '라우트가 바뀌면 스크롤을 맨 위로 되돌립니다.'},
    {name: 'Header', desc: '화면 위쪽에 붙는(sticky) 헤더입니다. 테마 버튼이 보입니다.'},
    {
        name: 'children',
        desc: '페이지 본문입니다. 레이아웃 최상위가 min-h-dvh flex-col 이므로 main 에 flex-1 을 주면 Footer 가 화면 아래에 붙습니다.',
    },
    {
        name: 'Footer',
        desc: 'subpage variant 의 Footer 입니다. userType(footerUserType 우선)에 따라 유틸 링크 경로가 정해집니다.',
    },
] as const

const SubPageLayoutGuidePage = () => (
    <GuidePageShell
        title="서브페이지 레이아웃 (SubPageLayout)"
        description="Header · 본문 · Footer 를 공유하는 일반 서비스 화면의 공통 레이아웃입니다."
    >
        <BaseCard>
            <section aria-labelledby="sub-page-layout-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sub-page-layout-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>(service)/layout.tsx</code>에서 한 번 감싸고 <code>page.tsx</code>에는 본문만 작성합니다.
                        로그인 전에는 <code>userType</code>을 생략하고, 로그인 후에는 조회한 <code>userType</code>과{' '}
                        <code>user</code>를 넘깁니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">레이아웃</h3>
                        <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="SubPageLayout 사용 코드 복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">페이지 본문</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            본문은 <code>main id=&quot;main&quot;</code>으로 작성하고 콘텐츠 폭은{' '}
                            <code>content-layout</code>(<code>max-w-content</code> 상한 + 그리드 가장자리 여백)으로
                            잡습니다. 컬럼 그리드가 필요한 영역만 <code>grid-layout</code>을 씁니다.
                        </p>
                        <CodeBlock code={PAGE_USAGE_CODE} language="tsx" copyLabel="서브페이지 본문 코드 복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">미리보기</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            Header 의 기업 · 기관 토글로 유형별 메뉴를 확인합니다. 가이드 화면의 main 과 겹치지 않도록
                            본문을 section 으로 넣었습니다.
                        </p>
                        <div className="border-border h-160 overflow-auto rounded-lg border">
                            <SubPageLayout>
                                <section className="bg-surface flex-1">
                                    <div className="content-layout flex min-h-80 items-center justify-center py-16">
                                        <p className="typo-title-l-bold">페이지 콘텐츠 영역</p>
                                    </div>
                                </section>
                            </SubPageLayout>
                        </div>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sub-page-layout-parts" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sub-page-layout-parts" className="typo-h4-bold">
                        구성 요소
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아래 영역을 레이아웃이 순서대로 그리므로 페이지에서 다시 넣지 않습니다.
                    </p>
                </div>
                <Table
                    caption="SubPageLayout 구성 요소 목록"
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
            <section aria-labelledby="sub-page-layout-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sub-page-layout-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        화면 유형에 맞는 레이아웃을 고릅니다. Header 와 Footer 가 모두 필요하면 SubPageLayout 입니다.
                    </p>
                </div>
                <LayoutChoiceTable />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sub-page-layout-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sub-page-layout-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        바로가기 링크와 Header · Footer 랜드마크는 레이아웃이 처리합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>본문 바로가기 링크를 Header 앞에 둡니다. 키보드 포커스가 갔을 때만 보입니다[6.4.1].</li>
                    <li>
                        본문은 <code>main id=&quot;main&quot; tabIndex=&#123;-1&#125;</code>로 작성해 바로가기 대상이
                        되게 합니다. <code>skipLinks</code>를 바꾸면 각 <code>href</code> 대상에도 <code>id</code>와{' '}
                        <code>tabIndex=&#123;-1&#125;</code>을 줍니다[6.4.1].
                    </li>
                    <li>
                        페이지마다 <code>metadata.title</code>을 지정하고 <code>h1</code>은 <code>PageTitleBar</code>로
                        하나만 둡니다[6.4.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sub-page-layout-props" className="flex flex-col gap-6">
                <h2 id="sub-page-layout-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="SubPageLayout Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SubPageLayoutGuidePage
