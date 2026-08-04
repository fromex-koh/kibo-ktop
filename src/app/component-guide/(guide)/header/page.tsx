import type {Metadata} from 'next'
import type {HeaderNavigationByUserType} from '@/components/composite/header'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable, {type PropsTableItem} from '@/components/custom/props-table'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {TriangleAlert} from 'lucide-react'
import HeaderDemo from './header-demo'

export const metadata: Metadata = {title: '헤더 (Header)'}

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

// 로그인 전: userType을 생략하면 URL의 ?userType=corp|org를 사용한다.
<Header
  overlay={false}
  showThemeToggle
  navigationByUserType={navigationByUserType}
/>`

const AUTHENTICATED_USAGE_CODE = `// 서버 세션·인증 API에서 조회한 로그인 사용자 정보
const user = await getCurrentUser()
const userType = user?.userType

// 로그인 후: 확정된 유형으로 메뉴를 고정하고 기업/기관 토글을 숨긴다.
<Header
  overlay={false}
  showThemeToggle
  userType={userType}
  showUserTypeToggle={false}
  user={user}
  navigationByUserType={navigationByUserType}
/>`

const SUB_PAGE_LAYOUT_CODE = `// 일반 서비스 페이지는 Header를 직접 반복하지 않고
// route layout.tsx에서 SubPageLayout을 사용한다.
<SubPageLayout
  userType={user?.userType}
  showUserTypeToggle={user?.userType === undefined}
>
  {children}
</SubPageLayout>`

const DEMO_USER = {name: '홍길동', sessionRemaining: '30:00'}

const DEMO_NAVIGATION = {
    corp: [
        {label: '자가진단', href: '#'},
        {label: '전문가 평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#'},
        {label: '탄소중립', href: '#'},
    ],
    org: [
        {label: '플랫폼 소개', href: '#'},
        {label: '개별평가', href: '#'},
        {label: '일괄평가', href: '#'},
        {label: 'K-BIGx 보고서', href: '#'},
        {label: '특허평가', href: '#'},
        {label: '탄소중립', href: '#', external: true},
    ],
} satisfies HeaderNavigationByUserType

const PROPS = [
    [
        'Header',
        'overlay',
        'true이면 히어로 위에 fixed 헤더로 겹치고 흰색 로고를 사용합니다. false이면 테마 대응 로고와 배경을 사용하는 sticky 헤더가 됩니다.',
        'true',
        'boolean',
    ],
    [
        'Header',
        'showThemeToggle',
        '라이트·다크 테마 전환 버튼 노출 여부입니다. 일반 서브페이지에서는 true, 테마를 별도로 제어하는 메인 화면에서는 false를 사용합니다.',
        'false',
        'boolean',
    ],
    [
        'Header',
        'showUserTypeToggle',
        '로그인 전 기업/기관 선택 컨트롤 노출 여부입니다. 로그인 후에는 userType을 고정하고 false를 전달합니다.',
        'true',
        'boolean',
    ],
    [
        'Header',
        'userType',
        '현재 화면의 사용자 유형입니다. 전달하면 URL 쿼리보다 우선해 해당 유형의 GNB와 전체 메뉴를 표시합니다.',
        'undefined',
        'UserType | undefined',
    ],
    [
        'Header',
        'user',
        '로그인 사용자 정보입니다. 전달하면 유형 배지·이름·세션 시간과 로그인 후 유틸리티 링크를 표시합니다.',
        'undefined',
        'HeaderUser | undefined',
    ],
    [
        'Header',
        'navigationByUserType',
        '기업(corp)과 기관(org)의 메뉴 배열입니다. 선택된 배열을 데스크톱 GNB와 모바일 전체 메뉴에 함께 렌더링합니다.',
        '기본 메뉴',
        'HeaderNavigationByUserType',
    ],
    ['Header', 'logoHref', '로고 클릭 시 이동 경로입니다. 생략하면 루트(/)로 이동합니다.', '/', 'string'],
    ['HeaderNavLink', 'label', '메뉴에 표시할 이름입니다.', '—', 'string'],
    ['HeaderNavLink', 'href', '이동할 내부 또는 외부 경로입니다.', '—', 'string'],
    ['HeaderNavLink', 'external', '외부 링크로 표시하고 새 창으로 엽니다.', 'false', 'boolean'],
    [
        'HeaderNavLink',
        'items',
        '드롭다운과 모바일 전체 메뉴에 표시할 하위 메뉴 배열입니다.',
        'undefined',
        'HeaderNavLink[]',
    ],
    ['HeaderUser', 'name', '상단에 표시할 사용자명입니다.', '—', 'string'],
    [
        'HeaderUser',
        'sessionRemaining',
        '로그인 유지 시간을 표시할 문자열입니다. 실제 시간 갱신·연장 API는 서비스에서 연결합니다.',
        '—',
        'string',
    ],
] satisfies readonly PropsTableItem[]

const THEME_CASES = [
    {
        theme: 'light',
        overlay: false,
        showThemeToggle: true,
        label: '라이트 서브페이지',
        desc: '테마 대응 컬러 로고와 테마 전환 버튼을 표시합니다.',
    },
    {
        theme: 'dark',
        overlay: false,
        showThemeToggle: true,
        label: '다크 서브페이지',
        desc: '다크 배경에 맞는 화이트 로고와 라이트 전환 버튼을 표시합니다.',
    },
    {
        theme: 'mainpage',
        overlay: true,
        showThemeToggle: false,
        label: '메인 히어로',
        desc: '히어로 위에 겹치는 fixed 헤더입니다. 흰색 로고를 사용하고 테마 버튼은 숨깁니다.',
    },
] as const

const HeaderGuidePage = () => (
    <GuidePageShell
        title="헤더 (Header)"
        description="로고·GNB·기업/기관 메뉴·테마 전환·전체 메뉴를 제공하는 공통 헤더 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="header-preview" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="header-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데스크톱에서는 GNB를 표시하고, <code className="font-mono">lg</code> 미만에서는 전체 메뉴
                        버튼으로 전환합니다. 일반 서비스 화면의 Header·Footer는{' '}
                        <code className="font-mono">SubPageLayout</code>에서 함께 구성합니다.
                    </p>
                </div>
                <HeaderDemo />
                <CodeBlock code={NAVIGATION_CODE} language="tsx" copyLabel="Header 사용 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="header-user-type" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="header-user-type" className="typo-h4-bold">
                        기업·기관 메뉴
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">navigationByUserType</code>에 기업과 기관의 메뉴를 각각 정의합니다.
                        로그인 전에는 <code className="font-mono">?userType=corp|org</code>로 선택 유형을 바꾸고, 선택된
                        메뉴를 GNB와 전체 메뉴에 동일하게 표시합니다.
                    </p>
                    <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-1 pl-5">
                        <li>메뉴명과 경로는 Header 내부가 아니라 화면 또는 메뉴 데이터에서 관리합니다.</li>
                        <li>corp와 org 배열을 모두 제공해야 두 사용자 유형의 메뉴가 안전하게 렌더링됩니다.</li>
                        <li>하위 메뉴는 items로 구성하며 데스크톱 드롭다운과 모바일 전체 메뉴에서 함께 사용합니다.</li>
                    </ul>
                </div>
                <HeaderDemo navigationByUserType={DEMO_NAVIGATION} />
                <CodeBlock code={NAVIGATION_CODE} language="tsx" copyLabel="기업·기관 메뉴 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="header-authenticated" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="header-authenticated" className="typo-h4-bold">
                        로그인 전·후 상태
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        로그인 전에는 userType을 확정하지 않아 기업/기관 토글을 표시합니다. 로그인 후 서버 세션 또는
                        인증 API에서 userType을 조회해 전달하면 해당 유형의 메뉴를 고정하고 토글을 숨깁니다. user를 함께
                        전달하면 유형 배지, 사용자명, 로그인 유지 시간과 로그인 후 유틸리티 링크를 표시합니다.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <HeaderDemo navigationByUserType={DEMO_NAVIGATION} userType="corp" user={DEMO_USER} />
                    <HeaderDemo navigationByUserType={DEMO_NAVIGATION} userType="org" user={DEMO_USER} />
                </div>
                <CodeBlock code={AUTHENTICATED_USAGE_CODE} language="tsx" copyLabel="로그인 후 Header 코드 복사" />
                <CodeBlock code={SUB_PAGE_LAYOUT_CODE} language="tsx" copyLabel="SubPageLayout 사용 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="header-theme" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="header-theme" className="typo-h4-bold">
                        화면 유형별 설정
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">overlay</code>는 헤더 배치와 로고 종류를 결정하고,{' '}
                        <code className="font-mono">showThemeToggle</code>은 테마 버튼만 제어합니다.
                    </p>
                </div>
                <Alert color="warning">
                    <TriangleAlert aria-hidden="true" />
                    <AlertTitle>아래 테마 래퍼는 가이드 미리보기 전용입니다.</AlertTitle>
                    <AlertDescription>
                        실제 화면에서는 <code className="font-mono">.light</code>·
                        <code className="font-mono">.dark</code>·<code className="font-mono">.mainpage</code> 래퍼를
                        추가하지 않고 페이지 테마와 필요한 Props만 설정합니다.
                    </AlertDescription>
                </Alert>
                <div className="flex flex-col gap-6">
                    {THEME_CASES.map((themeCase) => (
                        <div key={themeCase.theme} className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-baseline gap-2">
                                <p className="typo-body-l-medium text-foreground">{themeCase.label}</p>
                                <code className="typo-body-l-regular text-muted-foreground font-mono">
                                    .{themeCase.theme}
                                </code>
                            </div>
                            <p className="typo-body-l-regular text-muted-foreground">{themeCase.desc}</p>
                            <div className={themeCase.theme}>
                                <HeaderDemo overlay={themeCase.overlay} showThemeToggle={themeCase.showThemeToggle} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="header-props" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="header-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        일반 서비스 페이지는 Header Props를 직접 조합하기보다{' '}
                        <code className="font-mono">SubPageLayout</code>에서 userType과 토글 상태를 연결합니다. 별도
                        Shell이 필요한 화면에서만 Header를 직접 사용합니다.
                    </p>
                </div>
                <PropsTable items={PROPS} caption="Header·HeaderNavLink·HeaderUser Props 목록" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="header-accessibility" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="header-accessibility" className="typo-h4-bold">
                        개발 시 확인사항
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Header에 포함된 공통 동작과 화면별 책임을 구분해 사용합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>Header는 banner 랜드마크로 렌더링되며, 본문 제목 h1은 각 page.tsx에서 제공합니다.</li>
                    <li>
                        일반 서브페이지의 본문 바로가기 링크는 SubPageLayout이 제공하므로 Header에 다시 추가하지
                        않습니다.
                    </li>
                    <li>테마·전체 메뉴 버튼에는 접근성 이름과 키보드 포커스 처리가 포함되어 있습니다.</li>
                    <li>메뉴를 추가하거나 변경할 때는 navigationByUserType의 corp·org 데이터를 함께 확인합니다.</li>
                    <li>404·500·정기점검 같은 풀페이지 상태 화면은 Header 없이 전용 컴포넌트를 사용합니다.</li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default HeaderGuidePage
