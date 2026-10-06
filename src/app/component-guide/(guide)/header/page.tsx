// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {DEFAULT_HEADER_NAVIGATION} from '@/components/composite/header'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable, {type PropsTableItem} from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import LayoutChoiceTable from '../sub-page-layout/layout-choice-table'
import HeaderDemo from './header-demo'

export const metadata: Metadata = {title: '헤더 (Header)'}

const USAGE_CODE = `import Header from '@/components/composite/header'

// 서브페이지: 문서 흐름에 놓이는 sticky 헤더 + 테마 전환 버튼
<Header overlay={false} showThemeToggle />

// 메인 히어로: 히어로 위에 겹치는 fixed 헤더(기본값)
<Header />`

const NAVIGATION_CODE = `import Header, {type HeaderNavigationByUserType} from '@/components/composite/header'

const navigationByUserType = {
  corp: [
    {label: '기술평가', href: '/corp/evaluation'},
    {label: '특허평가', href: '/corp/patent'},
  ],
  org: [
    {label: '개별평가', href: '/org/evaluation'},
    {label: '일괄평가', href: '/org/bulk-evaluation'},
  ],
} satisfies HeaderNavigationByUserType

// 로그인 전: userType을 생략하면 기업/기관 토글로 메뉴를 전환한다.
<Header
  overlay={false}
  showThemeToggle
  navigationByUserType={navigationByUserType}
/>`

const AUTHENTICATED_USAGE_CODE = `// 서버 세션·인증 API에서 조회한 로그인 사용자 정보
const user = await getCurrentUser()
const userType = user?.userType

// 로그인 후: 확정된 유형으로 메뉴를 고정한다. user 를 넘기면 기업/기관 토글은 나오지 않는다.
<Header
  overlay={false}
  showThemeToggle
  userType={userType}
  showUserTypeToggle={false}
  user={user}
  navigationByUserType={navigationByUserType}
/>`

const SUB_PAGE_LAYOUT_CODE = `// 일반 서비스 페이지는 Header를 직접 반복하지 않고
// (service)/layout.tsx에서 SubPageLayout을 사용한다.
// showUserTypeToggle 을 생략하면 userType 이 없을 때만 토글이 나온다.
<SubPageLayout userType={user?.userType} user={user}>
  {children}
</SubPageLayout>`

const DEMO_USER = {name: '홍길동', sessionRemaining: '30:00'}

const DEMO_NAVIGATION = DEFAULT_HEADER_NAVIGATION

const PROPS = [
    [
        'Header',
        'overlay',
        'true 면 화면 위에 겹치는 fixed 헤더(흰색 로고), false 면 배경이 있는 sticky 헤더(테마 대응 로고)입니다.',
        'true',
        'boolean',
    ],
    ['Header', 'showThemeToggle', '라이트·다크 테마 전환 버튼을 표시합니다.', 'false', 'boolean'],
    [
        'Header',
        'showUserTypeToggle',
        '로그인 전 기업/기관 토글을 표시합니다. user 를 넘기면 값과 무관하게 나오지 않습니다.',
        'true',
        'boolean',
    ],
    [
        'Header',
        'userType',
        '확정된 사용자 유형입니다. 넘기면 그 유형의 메뉴로 고정됩니다. 생략하면 기업(corp)으로 시작합니다.',
        'undefined',
        "'corp' | 'org'",
    ],
    [
        'Header',
        'user',
        '로그인 사용자 정보입니다. 넘기면 유형 배지 · 이름 · 로그인 유지 시간과 로그인 후 유틸리티 링크가 나옵니다.',
        'undefined',
        'HeaderUser',
    ],
    [
        'Header',
        'navigationByUserType',
        '기업(corp)과 기관(org)의 메뉴 배열입니다. GNB와 전체 메뉴에 함께 쓰입니다.',
        'DEFAULT_HEADER_NAVIGATION',
        'HeaderNavigationByUserType',
    ],
    ['Header', 'logoHref', '로고를 눌렀을 때 이동할 경로입니다.', "'/'", 'string'],
    ['HeaderNavLink', 'label', '메뉴 이름입니다(필수).', '-', 'string'],
    ['HeaderNavLink', 'href', '이동할 경로입니다(필수).', '-', 'string'],
    ['HeaderNavLink', 'external', '새 창으로 열고 외부 링크 아이콘을 붙입니다.', 'undefined', 'boolean'],
    [
        'HeaderNavLink',
        'items',
        '하위 메뉴 배열입니다. 있으면 GNB 항목이 드롭다운이 됩니다.',
        'undefined',
        'readonly HeaderNavLink[]',
    ],
    ['HeaderUser', 'name', '사용자 이름입니다(필수).', '-', 'string'],
    ['HeaderUser', 'sessionRemaining', '로그인 유지 시간으로 표시할 문자열입니다(필수).', '-', 'string'],
] satisfies readonly PropsTableItem[]

const SCREEN_COLUMNS = [
    {key: 'screen', header: '화면', align: 'start', rowHeader: true},
    {key: 'overlay', header: 'overlay', align: 'start'},
    {key: 'toggle', header: 'showThemeToggle', align: 'start'},
    {key: 'desc', header: '모습', align: 'start', wrap: true},
] as const

const THEME_CASES = [
    {
        theme: 'light',
        overlay: false,
        showThemeToggle: true,
        label: '라이트 서브페이지',
        desc: '컬러 로고와 테마 전환 버튼이 나옵니다.',
    },
    {
        theme: 'dark',
        overlay: false,
        showThemeToggle: true,
        label: '다크 서브페이지',
        desc: '흰색 로고와 테마 전환 버튼이 나옵니다.',
    },
    {
        theme: 'mainpage',
        overlay: true,
        showThemeToggle: false,
        label: '메인 히어로',
        desc: '화면 위에 겹치는 fixed 헤더입니다. 흰색 로고를 쓰고 테마 버튼은 없습니다.',
    },
] as const

const HeaderGuidePage = () => (
    <GuidePageShell
        title="헤더 (Header)"
        description="로고 · GNB · 기업/기관 메뉴 · 테마 전환 · 전체 메뉴를 제공하는 공통 헤더입니다."
    >
        <BaseCard>
            <section aria-labelledby="header-preview" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="header-preview" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        일반 서비스 화면은 Header 를 직접 넣지 않고 레이아웃(<code>SubPageLayout</code> ·{' '}
                        <code>MainPageLayout</code>)이 넣어 줍니다. 별도 레이아웃이 필요한 화면에서만 직접 배치합니다.
                    </p>
                    <p className="typo-body-l-regular text-label-foreground">
                        반응형은 <code>xl</code>(1280) 기준입니다. GNB 는 <code>xl</code> 이상에서만 보이고 전체 메뉴
                        버튼은 모든 폭에서 보입니다.
                    </p>
                </div>
                <HeaderDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="header-user-type" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="header-user-type" className="typo-h4-bold">
                        기업 · 기관 메뉴
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">navigationByUserType</code>에 기업과 기관의 메뉴를
                        각각 넘깁니다. 생략하면 기본 메뉴(
                        <code className="text-foreground font-mono">DEFAULT_HEADER_NAVIGATION</code>)를 씁니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code className="text-foreground font-mono">corp</code> ·{' '}
                        <code className="text-foreground font-mono">org</code> 배열을 모두 넘깁니다.
                    </li>
                    <li>
                        하위 메뉴는 <code className="text-foreground font-mono">items</code>로 넘깁니다. GNB 드롭다운과
                        전체 메뉴에 함께 나옵니다.
                    </li>
                    <li>로그인 전 기업/기관 토글의 선택은 URL에 남지 않습니다.</li>
                </ul>
                <div className="border-subtle-3 flex flex-col gap-4 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">미리보기</h3>
                    <HeaderDemo navigationByUserType={DEMO_NAVIGATION} />
                    <CodeBlock code={NAVIGATION_CODE} language="tsx" copyLabel="복사" />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="header-authenticated" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="header-authenticated" className="typo-h4-bold">
                        로그인 전 · 후 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        로그인 후에는 <code className="text-foreground font-mono">userType</code>과{' '}
                        <code className="text-foreground font-mono">user</code>를 넘깁니다. 메뉴가 그 유형으로 고정되고
                        토글 자리에 유형 배지 · 이름 · 로그인 유지 시간이 나옵니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code className="text-foreground font-mono">sessionRemaining</code>은 넘긴 문자열을 그대로 보여
                        줍니다. 시간 갱신은 사용처에서 연결합니다.
                    </li>
                    <li>로그인 연장 · 로그아웃 버튼의 실제 처리는 연결되어 있지 않습니다. 서비스에서 연결합니다.</li>
                </ul>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">로그인 후 미리보기</h3>
                        <div className="flex flex-col gap-4">
                            <HeaderDemo navigationByUserType={DEMO_NAVIGATION} userType="corp" user={DEMO_USER} />
                            <HeaderDemo navigationByUserType={DEMO_NAVIGATION} userType="org" user={DEMO_USER} />
                        </div>
                        <CodeBlock code={AUTHENTICATED_USAGE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">SubPageLayout 에서 연결</h3>
                        <CodeBlock code={SUB_PAGE_LAYOUT_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="header-theme" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="header-theme" className="typo-h4-bold">
                        화면 유형별 설정
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">overlay</code>는 헤더 배치와 로고를,{' '}
                        <code className="text-foreground font-mono">showThemeToggle</code>은 테마 버튼만 정합니다.
                    </p>
                </div>
                <Table
                    caption="화면 유형별 Header 설정"
                    columns={SCREEN_COLUMNS}
                    rows={THEME_CASES.map((themeCase) => ({
                        key: themeCase.theme,
                        cells: [
                            themeCase.label,
                            <code key="overlay">{String(themeCase.overlay)}</code>,
                            <code key="toggle">{String(themeCase.showThemeToggle)}</code>,
                            themeCase.desc,
                        ],
                    }))}
                    size="md"
                />
                <div className="border-foreground-subtle/30 bg-pastel-neutral/40 rounded-sm border p-5">
                    <p className="typo-body-l-regular text-label-foreground">
                        아래 미리보기의 <code className="text-foreground font-mono">.light</code> ·{' '}
                        <code className="text-foreground font-mono">.dark</code> ·{' '}
                        <code className="text-foreground font-mono">.mainpage</code> 래퍼는 가이드 전용입니다. 실제
                        화면에서는 래퍼를 넣지 않고 Props 만 정합니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    {THEME_CASES.map((themeCase) => (
                        <div key={themeCase.theme} className="flex flex-col gap-4 py-8 last:pb-0">
                            <h3 className="typo-title-m-bold text-foreground">{themeCase.label}</h3>
                            <div className={themeCase.theme}>
                                <HeaderDemo overlay={themeCase.overlay} showThemeToggle={themeCase.showThemeToggle} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="header-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="header-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        Header 는 레이아웃이 감싸 줍니다. 화면 유형에 맞는 레이아웃을 고릅니다.
                    </p>
                </div>
                <LayoutChoiceTable />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="header-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="header-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        랜드마크와 이름은 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>header</code> 요소이고 GNB 와 전체 메뉴는 이름이 있는 <code>nav</code>입니다[6.4.2].
                    </li>
                    <li>
                        로고 이미지는 장식(<code>alt=&quot;&quot;</code>)이고 링크 · 테마 버튼 · 전체 메뉴 버튼에 접근성
                        이름이 있습니다[5.1.1].
                    </li>
                    <li>전체 메뉴는 Sheet 라 포커스 트랩 · Esc · 포커스 복귀를 Radix 가 처리합니다[8.2.1].</li>
                    <li>
                        본문 바로가기는 Header 가 아니라 레이아웃의 <code>SkipNav</code>가 넣습니다. Header 를 직접
                        배치하면 <code>SkipNav</code>도 함께 넣습니다[6.4.1].
                    </li>
                    <li>
                        로그인 유지 시간의 연장 · 로그아웃 버튼은 모달만 연결돼 있고 실제 처리는 서비스에서 연결합니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="header-props" className="flex flex-col gap-6">
                <h2 id="header-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS} caption="Header · HeaderNavLink · HeaderUser Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default HeaderGuidePage
