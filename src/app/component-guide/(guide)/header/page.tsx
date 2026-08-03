import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable, {type PropsTableItem} from '@/components/custom/props-table'
import {HeaderDemo, type HeaderNavigationByUserType} from '@/components/composite/header'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'
import {TriangleAlert} from 'lucide-react'

export const metadata: Metadata = {title: '헤더 (Header)'}

// 사용법 스니펫 — 로그인 전에는 토글을 노출하고, 로그인 후에는 확정된 userType을 전달해 토글을 숨긴다.
const USAGE_CODE = `import Header from '@/components/composite/header'

// 어두운 메인 히어로 위에 고정: overlay=true, 테마 버튼 숨김이 기본값입니다. 로고는 기본적으로 /로 이동합니다.
<Header />

// 서브페이지: 문서 흐름에 sticky로 두고 테마 버튼을 표시합니다.
<Header overlay={false} showThemeToggle />

// 사용자 유형별 메뉴를 주입합니다. 로그인 전에는 URL의 ?userType=corp|org로 토글합니다.
const navigationByUserType = {
  corp: [
    {label: '기술평가', href: '/evaluation'},
    {label: '특허평가', href: '/patent'},
  ],
  org: [
    {label: '개별평가', href: '/organization/individual'},
    {label: '일괄평가', href: '/organization/bulk'},
  ],
} satisfies HeaderNavigationByUserType

<Header navigationByUserType={navigationByUserType} />`

const AUTHENTICATED_USAGE_CODE = `// 로그인 후에는 확정된 userType을 고정하고 user를 전달합니다.
// 화면 유형 토글 자리에 그 유형의 배지(기업=파랑 / 기관=보라)와 이름이 들어갑니다.
<Header
  userType="corp"
  showUserTypeToggle={false}
  user={{name: '홍길동', sessionRemaining: '30:00'}}
  navigationByUserType={navigationByUserType}
/>`

// 로그인 후 상단 유틸리티 데모용 목업 회원. 남은 시간은 표시 형식 그대로 받는다.
const DEMO_USER = {name: '홍길동', sessionRemaining: '30:00'}

const USER_TYPE_USAGE_CODE = `const navigationByUserType = {
  corp: [
    {label: '자가진단', href: '/self-check'},
    {label: '전문가 평가', href: '/evaluation'},
  ],
  org: [
    {label: '개별평가', href: '/organization/individual'},
    {label: '일괄평가', href: '/organization/bulk'},
  ],
} satisfies HeaderNavigationByUserType

// 로그인 전: URL의 ?userType으로 기업·기관 메뉴를 전환하고 토글을 노출합니다.
<Header navigationByUserType={navigationByUserType} />

// 로그인 후: 확정된 userType을 고정하고 토글을 숨깁니다.
<Header userType="corp" showUserTypeToggle={false} navigationByUserType={navigationByUserType} />`

const DEMO_NAVIGATION = {
    corp: [
        {label: '자가진단', href: '#'},
        {label: '전문가 평가', href: '#'},
        {label: 'BIGx 보고서', href: '#'},
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
        '헤더를 화면 위에 고정할지 설정합니다. false이면 배경과 테마 대응 로고를 사용하며 문서 흐름에 유지됩니다.',
        'true',
        'boolean',
    ],
    [
        'Header',
        'showThemeToggle',
        '테마 변경 버튼 노출 여부입니다. 버튼 아이콘은 현재 상태가 아니라 전환될 모드를 나타냅니다.',
        'false',
        'boolean',
    ],
    [
        'Header',
        'showUserTypeToggle',
        '로그인 전에는 기업·기관 토글을 노출하고, 로그인 후 userType이 확정되면 false로 숨깁니다.',
        'true',
        'boolean',
    ],
    [
        'Header',
        'userType',
        '로그인 후 확정된 사용자 유형입니다. 전달하면 URL 쿼리보다 우선해 해당 유형의 메뉴를 표시합니다.',
        'undefined',
        'UserType',
    ],
    [
        'Header',
        'navigationByUserType',
        '기업(corp)·기관(org)의 링크 배열을 주입합니다. userType prop이 없으면 URL 쿼리의 유형을 사용합니다.',
        '기본 메뉴',
        'HeaderNavigationByUserType',
    ],
    ['Header', 'logoHref', '로고 클릭 시 이동 경로입니다. 생략하면 루트(/)로 이동합니다.', '/', 'string'],
    ['HeaderNavLink', 'label', '화면에 표시할 메뉴명입니다.', '—', 'string'],
    ['HeaderNavLink', 'href', 'Next.js Link가 이동할 내부 또는 외부 경로입니다.', '—', 'string'],
    ['HeaderNavLink', 'external', '새 창 링크와 외부 링크 아이콘을 적용합니다.', 'false', 'boolean'],
] satisfies readonly PropsTableItem[]

// 헤더가 조립하는 primitive 목록(Composition 표).
const COMPOSITION = [
    {
        name: '로고',
        desc: '사이트 식별 로고. 기본적으로 루트(/)로 이동하며 logoHref로 경로를 바꿀 수 있다. 이미지는 기술보증기금 alt 값을 제공한다.',
    },
    {
        name: '주 메뉴 (NavigationMenu)',
        desc: '플랫폼 소개·기술평가·특허평가·K-BIGx 보고서·탄소중립 주 내비게이션. lg 미만에서 숨고 전체 메뉴(Sheet)로 이동한다.',
    },
    {
        name: '화면 유형 (Segmented Control)',
        desc: '로그인 전에는 헤더 상단에서 기업·기관 화면을 전환한다. 로그인 후에는 확정된 userType을 전달하고 토글을 숨긴다.',
    },
    {
        name: 'navigationByUserType',
        desc: '사용처가 corp·org 링크 배열을 주입한다. Header는 선택된 userType의 배열을 데스크톱 주 메뉴와 전체 메뉴에 동일하게 렌더링한다.',
    },
    {name: '유틸 링크', desc: '로그인/회원가입·이용안내·기술보증기금(외부 링크↗). 상단 유틸바에 우측 정렬.'},
    {
        name: 'showThemeToggle',
        desc: '테마 변경 버튼 노출 여부. 기본값은 false이며 라이트·다크 전환이 필요한 서브페이지에서 true로 켠다.',
    },
    {
        name: '아이콘 버튼 (테마 전환·전체 메뉴)',
        desc: '테마 버튼은 전환될 모드를 나타내 라이트에서 달, 다크에서 해를 표시한다. 두 버튼은 동일한 24px 정렬 상자와 20px 간격을 공유하며, hover 시 모노톤 icon-interactive-hover로 전환된다. 라이트에서는 기본 전경색과 더 큰 명도 차를 두어 상태 변화를 분명히 보여준다. 열 때 X는 회전·확대 후 안정되고, 닫을 때 Menu도 짧게 회전·확대 후 원래 위치로 복귀한다.',
    },
    {
        name: '전체 메뉴 (Sheet)',
        desc: '뷰포트 전체를 덮어 선택된 기업/기관 유형의 주 메뉴와 유틸 링크를 제공한다. 메인페이지와 같은 content-layout 정렬선을 사용하며 모바일 1열, md 2열, xl 3열로 전환한다. 열린 동안 헤더 배경은 투명하게 전환해 스크롤 상태와 무관하게 제목을 가리지 않고, X의 높은 위계만 유지한다.',
    },
    {
        name: 'overlay',
        desc: 'true이면 흰색 로고와 fixed 배치로 히어로 위에 겹치고, false이면 테마 대응 로고와 배경을 사용해 sticky로 배치한다.',
    },
] as const

// 페이지별 테마 케이스 — 클래스 스코프(.light/.dark/.mainpage)로 강제 미리보기한다.
const THEME_CASES = [
    {
        theme: 'light',
        overlay: false,
        showThemeToggle: true,
        label: '라이트 (서브페이지)',
        desc: '밝은 표면 + 컬러 로고. 다크 모드로 전환하는 달 아이콘을 표시합니다.',
    },
    {
        theme: 'dark',
        overlay: false,
        showThemeToggle: true,
        label: '다크 (서브페이지)',
        desc: '어두운 표면 + 화이트 로고. 라이트 모드로 전환하는 해 아이콘을 표시합니다.',
    },
    {
        theme: 'mainpage',
        overlay: true,
        showThemeToggle: false,
        label: '메인페이지 (mainpage 스킨)',
        desc: '히어로 위에 겹치는 오버레이 헤더. 화이트 로고 한 장이며 테마 토글은 숨긴다.',
    },
] as const

// 헤더 — 로고+주 메뉴+유틸바를 담는 상단 banner 합성 컴포넌트.
// shadcn 에는 Header primitive 가 없어 primitive(NavigationMenu·SegmentedControl·Sheet)를 조립한다.
const HeaderGuidePage = () => (
    <GuidePageShell
        title="헤더 (Header)"
        description="로고·주 메뉴·화면 유형 링크·유틸 링크를 담는 사이트 최상단 banner 합성 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="sh-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        상단 유틸바(로그인 전 화면 유형 링크·유틸 링크)와 메인 내비(로고·주 메뉴·테마 전환·전체 메뉴)
                        2줄 구성입니다. 로그인 전 선택한 기업/기관 유형은 주 메뉴와 전체 메뉴에 함께 반영되며, 로그인
                        후에는 확정된 userType을 전달하고 showUserTypeToggle={false}로 토글을 숨깁니다. 전체 메뉴 안에는
                        화면 유형 컨트롤을 중복 배치하지 않습니다. 화면 폭을 lg(≥1024) 미만으로 줄이면 주 메뉴와 유틸
                        링크는 전체 메뉴로 이동합니다. 테마 전환은 showThemeToggle prop으로 노출 여부를 정하며, 라이트
                        모드에서는 달, 다크 모드에서는 해 아이콘으로 다음 전환 상태를 안내합니다. 전체 메뉴는 화면
                        전체를 덮고 트리거는 Menu에서 X로 전환됩니다. 트리거는 열린 메뉴보다 높은 위계를 유지해 같은
                        위치에서 다시 눌러 닫을 수 있으며, 모션 축소 설정에서는 애니메이션 없이 상태만 바뀝니다.
                    </p>
                </div>
                <HeaderDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sh-theme" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-theme" className="typo-h4-bold">
                        페이지별 테마
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Header 는 표준 시맨틱 토큰만 쓰므로 놓인 페이지의 테마를 그대로 따릅니다. 로고는 배경 명도에
                        맞춰 교체되는데, 이 교체는 <code className="font-mono">dark:</code> 변형이 아니라{' '}
                        <code className="font-mono">--logo-on-*</code> 변수로 제어합니다 — 아래처럼 테마를 중첩 고정해도
                        가장 가까운 스코프를 따라 항상 배경과 일치시키기 위함입니다.
                    </p>
                </div>
                <Alert color="warning">
                    <TriangleAlert aria-hidden="true" />
                    <AlertTitle>쇼케이스 전용 — 실제 사용 시 제외하세요</AlertTitle>
                    <AlertDescription>
                        아래 미리보기는 테마 토글과 무관하게 항상 같은 모습으로 확인할 수 있도록 각 미리보기를{' '}
                        <code className="font-mono">.light</code>·<code className="font-mono">.dark</code>·
                        <code className="font-mono">.mainpage</code> 클래스로 감싸 테마를 고정했습니다. 실제 화면에서는
                        이 래퍼 없이 <code className="font-mono">&lt;Header /&gt;</code>만 두면 페이지 테마를 따릅니다.
                        미리보기는 카드 안에서 아이콘 버튼이 잘리지 않도록 메뉴 글자와 간격만 한 단계 줄였습니다.
                    </AlertDescription>
                </Alert>
                <div className="flex flex-col gap-6">
                    {THEME_CASES.map((tc) => (
                        <div key={tc.theme} className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-baseline gap-2">
                                <p className="typo-body-l-medium text-foreground">{tc.label}</p>
                                <code className="typo-body-l-regular text-muted-foreground font-mono">.{tc.theme}</code>
                            </div>
                            <p className="typo-body-l-regular text-muted-foreground">{tc.desc}</p>
                            {/* 클래스 스코프로 테마를 강제한다 — 내부 시맨틱 토큰이 해당 테마 값으로 반사된다. */}
                            <div className={tc.theme}>
                                <HeaderDemo overlay={tc.overlay} showThemeToggle={tc.showThemeToggle} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sh-user-type" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 id="sh-user-type" className="typo-h4-bold">
                        User type navigation
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기업·기관처럼 사용자 유형에 따라 정보 구조가 달라질 때{' '}
                        <code className="font-mono">navigationByUserType</code>으로 유형별 링크 배열을 주입합니다. 아래
                        Header에서 기업과 기관을 선택하면 로그인 전 URL의{' '}
                        <code className="font-mono">?userType=corp|org</code>가 변경되고, 선택된 유형의 주 메뉴가 즉시
                        표시됩니다. 로그인 후에는 확정된 <code className="font-mono">userType</code>을 전달하고{' '}
                        <code className="font-mono">showUserTypeToggle={'{false}'}</code>로 토글을 숨깁니다.
                    </p>
                    <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-1 pl-5">
                        <li>
                            로그인 전에는 URL 쿼리를 선택 상태의 원천으로 사용하므로 새로고침하거나 링크를 공유해도
                            유지됩니다.
                        </li>
                        <li>같은 메뉴 데이터를 데스크톱 주 메뉴와 반응형 전체 메뉴(Sheet)에 함께 사용합니다.</li>
                        <li>로그인 후에는 확정된 userType을 prop으로 전달하고 화면 유형 토글을 숨깁니다.</li>
                        <li>메뉴명과 이동 경로는 Header 내부가 아니라 각 서비스 페이지에서 관리합니다.</li>
                    </ul>
                </div>
                <HeaderDemo navigationByUserType={DEMO_NAVIGATION} />
                <CodeBlock code={USER_TYPE_USAGE_CODE} language="tsx" copyLabel="사용자 유형별 메뉴 코드 복사" />

                <div className="flex flex-col gap-2">
                    <h3 className="typo-title-m-bold">로그인 후 — 유형 배지</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">user</code>를 전달하면 화면 유형 토글 자리에 로그인한 유형의 배지
                        하나와 이름, 남은 로그인 유지 시간·연장이 들어가고 첫 링크가 로그아웃으로 바뀝니다. 배지는
                        기업이면 파랑(info), 기관이면 보라(purple)입니다.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <HeaderDemo navigationByUserType={DEMO_NAVIGATION} userType="corp" user={DEMO_USER} />
                    <HeaderDemo navigationByUserType={DEMO_NAVIGATION} userType="org" user={DEMO_USER} />
                </div>
                <CodeBlock code={AUTHENTICATED_USAGE_CODE} language="tsx" copyLabel="로그인 후 Header 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sh-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        메뉴 데이터는 Header 바깥에서 관리합니다. 로그인 전에는 URL의{' '}
                        <code className="font-mono">userType</code> 쿼리를 사용하고, 로그인 후에는 확정된{' '}
                        <code className="font-mono">userType</code> prop을 전달합니다.
                    </p>
                </div>
                <PropsTable items={PROPS} caption="Header와 HeaderNavLink props" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sh-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-composition" className="typo-h4-bold">
                        Composition
                    </h2>
                    <p className="text-foreground-muted text-sm">헤더가 조립하는 kit primitive·요소들입니다.</p>
                </div>
                <div className="bg-background border-border overflow-x-auto rounded-md border">
                    <table className="w-full text-left">
                        <caption className="sr-only">Composition 목록</caption>
                        <thead>
                            <tr className="border-border border-b bg-gray-100/25">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Name
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMPOSITION.map((row) => (
                                <tr key={row.name} className="border-border bg-background border-b last:border-b-0">
                                    <th
                                        scope="row"
                                        className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                    >
                                        {row.name}
                                    </th>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{row.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sh-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="text-foreground-muted text-sm">헤더가 지키는 KWCAG 2.1 요건입니다.</p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>실제 헤더는 banner 랜드마크(&lt;header&gt;)로 렌더링됩니다. [8.2.1]</li>
                    <li>
                        로고는 홈 링크와 이미지로 구성됩니다. 모든 화면에 반복되는 요소라 제목(h1)이 아니라 문단으로
                        두고, h1 은 화면마다 하나뿐인 본문 제목이 가집니다.
                    </li>
                    <li>
                        테마 전환·전체 메뉴 버튼은 아이콘 전용이라 aria-label 을 제공합니다. 테마 버튼은 아이콘과 라벨
                        모두 전환될 모드(다크 또는 라이트)를 안내하고, 내부 아이콘은 aria-hidden 입니다. [5.1.1]
                    </li>
                    <li>
                        두 아이콘 버튼은 시안대로 배경·패딩이 없어 보이는 상자가 24px 입니다. 클릭 영역은 가상요소로
                        44×44 를 확보해 시안을 유지하면서 터치 타깃 기준을 지킵니다(아이콘 간격 20px 이라 두 영역이
                        맞닿기만 하고 겹치지 않습니다). [6.1.3]
                    </li>
                    <li>
                        전체 메뉴를 키보드로 열면 Menu에서 X로 바뀐 트리거에 포커스를 유지해 닫기 위치와 포커스 링을
                        즉시 확인할 수 있습니다. 열린 동안 기존 헤더 링크는 탭 순서에서 제외되므로 Tab을 누르면 전체
                        메뉴의 첫 링크로 이동합니다. 마지막 링크 다음과 첫 링크 이전에는 X 버튼으로 포커스가 순환하며,
                        Esc로도 닫을 수 있습니다. [8.2.1]
                    </li>
                    <li>모든 상호작용 요소는 focus-visible 표시와 44px 클릭 영역을 가집니다. [6.1.2/6.1.3]</li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default HeaderGuidePage
