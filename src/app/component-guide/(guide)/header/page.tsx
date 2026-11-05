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
/>

// 기관 하위계정 — isSubAccount 를 켜면 배지가 '하위 기관' 이 되고, name 에는 기관명 대신 담당자명을 넣는다.
<Header userType="org" user={{name: '홍길동', sessionRemaining: '30:00', isSubAccount: true}} … />`

const SUB_PAGE_LAYOUT_CODE = `// 일반 서비스 페이지는 Header를 직접 반복하지 않고
// (service)/layout.tsx에서 SubPageLayout을 사용한다.
// showUserTypeToggle 을 생략하면 userType 이 없을 때만 토글이 나온다.
<SubPageLayout userType={user?.userType} user={user}>
  {children}
</SubPageLayout>`

const DEMO_USER = {name: '홍길동', sessionRemaining: '30:00'}
// 기관 하위계정 — 배지 '하위 기관' + 담당자명.
const DEMO_SUB_ACCOUNT_USER = {name: '홍길동', sessionRemaining: '30:00', isSubAccount: true}

const DEMO_NAVIGATION = DEFAULT_HEADER_NAVIGATION

const ACTIVE_NAVIGATION_CODE = `const navigationByUserType = {
  corp: [
    {
      label: '기술평가',
      href: '#',
      items: [
        // href 는 시작 화면, matchPaths 는 그 뒤 단계 화면까지 묶는 상위 경로
        {
          label: 'Tech-Index',
          href: '/corp/technology-evaluation/tech-index/selection',
          matchPaths: ['/corp/technology-evaluation/tech-index'],
        },
      ],
    },
    {
      label: '플랫폼 소개',
      href: '#',
      items: [
        // 아래 소개 화면들의 상위 경로라 정확히 같을 때만 현재 위치로 본다.
        {label: '플랫폼 소개', href: '/corp/platform', isExactMatch: true},
        {label: '기술평가', href: '/corp/platform/technology-evaluation'},
      ],
    },
    // 하위 메뉴가 없는 메뉴도 matchPaths 로 묶음 전체를 현재 위치로 본다.
    {label: '일괄평가', href: '#', matchPaths: ['/org/batch-evaluation']},
  ],
  …
} satisfies HeaderNavigationByUserType

// /corp/technology-evaluation/tech-index/general/final-review 에서
// → '기술평가' 아래 강조선 + 드롭다운 'Tech-Index' 굵게`

// 미리보기 전용 — 이 가이드 주소를 matchPaths 에 넣어 현재 위치 상태를 보여 준다.
const GUIDE_PATH = '/component-guide/header'
const DEMO_ACTIVE_LINKS = [
    {
        label: '기술평가',
        href: '#',
        items: [
            {label: 'KTRS-FM', href: '#'},
            {label: 'Tech-Index', href: '#', matchPaths: [GUIDE_PATH]},
            {label: '투자모형', href: '#'},
        ],
    },
    {label: '특허평가', href: '#'},
    {label: 'K-BIGx 보고서', href: '#'},
]
const DEMO_ACTIVE_NAVIGATION = {corp: DEMO_ACTIVE_LINKS, org: DEMO_ACTIVE_LINKS}

const INDICATOR_COLUMNS = [
    {key: 'place', header: '위치', align: 'start', rowHeader: true},
    {key: 'parent', header: '상위 메뉴', align: 'start', wrap: true},
    {key: 'item', header: '하위 항목', align: 'start', wrap: true},
    {key: 'color', header: '색 토큰 (라이트 · 다크 · 메인페이지)', align: 'start', wrap: true},
] as const

const INDICATOR_ROWS = [
    {
        key: 'gnb',
        cells: [
            'GNB',
            '글자 아래 강조선',
            '드롭다운에서 굵은 글씨',
            <span key="color">
                <code>header-nav-indicator</code> blue.500 · blue.300 · mint.500
            </span>,
        ],
    },
    {
        key: 'menu',
        cells: [
            '전체 메뉴(☰)',
            '그룹 이름 아래 강조선',
            '강조색 + 굵은 글씨 (마이페이지 · 알림마당 포함)',
            <span key="color">
                <code>menu-overlay-accent</code> blue.600 · blue.300 · mint.500
            </span>,
        ],
    },
]

const MATCH_COLUMNS = [
    {key: 'case', header: '이럴 때', align: 'start', rowHeader: true, wrap: true},
    {key: 'setting', header: '설정', align: 'start'},
    {key: 'example', header: '예시', align: 'start', wrap: true},
] as const

const MATCH_ROWS = [
    {
        key: 'href',
        cells: [
            '메뉴 화면과 그 아래 화면',
            <code key="setting">href</code>,
            <span key="example">
                <code>/notice/faq</code> 메뉴가 <code>/notice/faq/detail</code> 에서도 표시
            </span>,
        ],
    },
    {
        key: 'match',
        cells: [
            '시작 화면 옆으로 이어지는 단계 화면',
            <code key="setting">matchPaths</code>,
            <span key="example">
                <code>…/tech-index/selection</code> 메뉴에 <code>…/tech-index</code> 를 적으면{' '}
                <code>…/tech-index/general/…</code> 에서도 표시
            </span>,
        ],
    },
    {
        key: 'exact',
        cells: [
            '메뉴 경로가 다른 메뉴 경로의 앞부분',
            <code key="setting">isExactMatch</code>,
            <span key="example">
                <code>/platform</code> 메뉴가 <code>/platform/technology-evaluation</code> 에서는 표시 안 됨
            </span>,
        ],
    },
]

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
        '로그인 후 확정된 유형입니다. 넘기면 그 유형 메뉴로 고정되고, 생략하면 화면 경로의 유형으로 시작합니다.',
        'undefined',
        "'corp' | 'org'",
    ],
    [
        'Header',
        'user',
        '로그인 사용자 정보입니다. 넘기면 유형 배지 · 이름 · 로그인 유지 시간과 로그아웃 링크가 나옵니다.',
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
    [
        'HeaderNavLink',
        'matchPaths',
        'href 외에 현재 위치로 볼 경로입니다. 단계 화면이 href 아래에 없을 때 적습니다.',
        'undefined',
        'readonly string[]',
    ],
    ['HeaderNavLink', 'isExactMatch', 'href 와 정확히 같을 때만 현재 위치로 봅니다.', 'undefined', 'boolean'],
    [
        'HeaderUser',
        'name',
        '사용자 이름입니다(필수). 기관 하위계정이면 기관명이 아니라 담당자명을 넣습니다.',
        '-',
        'string',
    ],
    ['HeaderUser', 'sessionRemaining', '로그인 유지 시간으로 표시할 문자열입니다(필수).', '-', 'string'],
    [
        'HeaderUser',
        'mypageHref',
        '이름을 눌렀을 때 갈 마이페이지 경로입니다. 없으면 회원 유형의 마이페이지 첫 화면입니다.',
        'undefined',
        'string',
    ],
    [
        'HeaderUser',
        'isSubAccount',
        "기관 하위계정으로 로그인했는지입니다. 켜면 배지가 '기관' 대신 '하위 기관'(같은 색)이 됩니다.",
        'false',
        'boolean',
    ],
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
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
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
                        하위 메뉴는 <code className="text-foreground font-mono">items</code>로 넘깁니다. GNB 드롭다운과
                        전체 메뉴에 함께 나옵니다.
                    </li>
                    <li>
                        로그인 전 토글은 화면 경로의 유형으로 시작합니다(<code>/org/…</code> 면 기관). 바꾼 선택은 URL
                        에 남지 않습니다.
                    </li>
                </ul>
                <div className="border-subtle-3 flex flex-col gap-4 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">미리보기</h3>
                    <HeaderDemo navigationByUserType={DEMO_NAVIGATION} />
                    <CodeBlock code={NAVIGATION_CODE} language="tsx" copyLabel="복사" />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="header-current" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="header-current" className="typo-h4-bold">
                        현재 위치 표시
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        지금 보고 있는 화면의 메뉴를 자동으로 강조합니다. 메뉴 데이터에 경로만 넣으면 되고, 스타일은
                        따로 고치지 않습니다.
                    </p>
                </div>
                <Table caption="현재 위치 표시 방식" columns={INDICATOR_COLUMNS} rows={INDICATOR_ROWS} size="md" />
                <div className="border-subtle-3 flex flex-col gap-4 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">경로 설정</h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        대부분은 <code className="text-foreground font-mono">href</code> 만으로 충분합니다. 아래 두
                        경우만 값을 더 적습니다.
                    </p>
                    <Table caption="현재 위치 경로 설정" columns={MATCH_COLUMNS} rows={MATCH_ROWS} size="md" />
                    <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                        <li>하위 항목이 현재 위치면 상위 메뉴도 함께 표시됩니다.</li>
                        <li>
                            경로 앞의 <code>/corp</code> · <code>/org</code> 는 빼고 비교합니다. 토글을 바꿔도
                            알림마당처럼 기업 · 기관 공통 메뉴는 표시가 유지됩니다.
                        </li>
                        <li>
                            쿼리(<code>?model=…</code>)로만 구분되는 화면은 서로 구분하지 못합니다.
                        </li>
                    </ul>
                </div>
                <div className="border-subtle-3 flex flex-col gap-4 border-t pt-8">
                    <h3 className="typo-title-m-bold text-foreground">미리보기</h3>
                    <p className="typo-body-l-regular text-label-foreground">
                        Tech-Index 를 현재 위치로 둔 예시입니다. 1280 이상은 기술평가를, 미만은 전체 메뉴(☰)를 열어
                        확인합니다.
                    </p>
                    <HeaderDemo navigationByUserType={DEMO_ACTIVE_NAVIGATION} userType="corp" />
                    <CodeBlock code={ACTIVE_NAVIGATION_CODE} language="tsx" copyLabel="복사" />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="header-authenticated" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
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
                    <li>
                        기관 하위계정은 <code className="text-foreground font-mono">isSubAccount</code> 를 켭니다.
                        배지가 &lsquo;하위 기관&rsquo; 이 되고 이름에는 담당자명을 넣습니다(예: [하위 기관] 홍길동 님).
                    </li>
                </ul>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">로그인 후 미리보기</h3>
                        <div className="flex flex-col gap-4">
                            <HeaderDemo navigationByUserType={DEMO_NAVIGATION} userType="corp" user={DEMO_USER} />
                            <HeaderDemo navigationByUserType={DEMO_NAVIGATION} userType="org" user={DEMO_USER} />
                            <HeaderDemo
                                navigationByUserType={DEMO_NAVIGATION}
                                userType="org"
                                user={DEMO_SUB_ACCOUNT_USER}
                            />
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
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
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
                    <li>
                        현재 위치 링크에는 <code>aria-current=&quot;page&quot;</code> 가 붙어 보조기기에도
                        알려집니다[5.3.1].
                    </li>
                    <li>전체 메뉴는 Sheet 라 포커스 트랩 · Esc · 포커스 복귀를 Radix 가 처리합니다[8.2.1].</li>
                    <li>
                        본문 바로가기는 Header 가 아니라 레이아웃의 <code>SkipNav</code>가 넣습니다. Header 를 직접
                        배치하면 <code>SkipNav</code>도 함께 넣습니다[6.4.1].
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
