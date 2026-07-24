import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable, {type PropsTableItem} from '@/components/custom/props-table'
import {HeaderDemo, type HeaderNavigationByUserType} from '@/components/composite/header'

export const metadata: Metadata = {title: '헤더 (Header)'}

// 사용법 스니펫 — 기본 헤더와 메인 히어로용 배리에이션을 같은 합성 컴포넌트로 제공한다.
const USAGE_CODE = `import Header from '@/components/composite/header'

export default function Layout({children}) {
  return (
    <>
      {/* 기본 헤더: 테마 변경 버튼 표시 */}
      <Header />
      <main id="main">{children}</main>
    </>
  )
}

// 테마 변경 버튼을 숨기는 경우
<Header showThemeToggle={false} />

// 어두운 메인 히어로 위에 고정하는 경우
// main 배리에이션은 기본적으로 테마 변경 버튼을 숨깁니다.
<Header variant="main" />

// main 배리에이션에서도 필요한 경우 표시할 수 있습니다.
<Header variant="main" showThemeToggle />

// 사용자 유형별 메뉴를 URL의 ?userType=corp|org 상태에 맞춰 주입합니다.
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

<Header variant="main" navigationByUserType={navigationByUserType} />`

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

<Header navigationByUserType={navigationByUserType} />`

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
        'variant',
        '기본 또는 메인 히어로용 외관과 메뉴 기본값을 선택합니다.',
        '"default"',
        '"default" | "main"',
    ],
    [
        'Header',
        'showThemeToggle',
        '테마 변경 버튼 노출 여부를 명시적으로 설정합니다.',
        'variant에 따라 결정',
        'boolean',
    ],
    [
        'Header',
        'navigationByUserType',
        '기업(corp)·기관(org)의 링크 배열을 주입합니다. 현재 userType 쿼리에 해당하는 배열만 표시합니다.',
        'variant 기본 메뉴',
        'HeaderNavigationByUserType',
    ],
    ['HeaderNavLink', 'label', '화면에 표시할 메뉴명입니다.', '—', 'string'],
    ['HeaderNavLink', 'href', 'Next.js Link가 이동할 내부 또는 외부 경로입니다.', '—', 'string'],
    ['HeaderNavLink', 'external', '새 창 링크와 외부 링크 아이콘을 적용합니다.', 'false', 'boolean'],
] satisfies readonly PropsTableItem[]

// 헤더가 조립하는 primitive 목록(Composition 표).
const COMPOSITION = [
    {name: '로고', desc: 'h1 > a > img 구조의 사이트명 로고. 이미지는 기술보증기금 alt 값을 제공한다.'},
    {
        name: '주 메뉴 (NavigationMenu)',
        desc: '자가진단·전문가 평가·BIGx 보고서·탄소중립 등 주 내비게이션. md 미만에서 숨고 전체 메뉴(Sheet)로 이동한다.',
    },
    {
        name: '화면 유형 (Segmented Control)',
        desc: '기업/기관 화면으로 이동하는 link 타입 세그먼티드 컨트롤. URL의 userType을 단일 상태 원천으로 사용해 유틸바·주 메뉴·모바일 Sheet를 함께 갱신한다.',
    },
    {
        name: 'navigationByUserType',
        desc: '사용처가 corp·org 링크 배열을 데이터로 주입한다. Header는 선택 상태에 해당하는 배열을 데스크톱 주 메뉴와 모바일 Sheet에 동일하게 렌더링한다.',
    },
    {name: '유틸 링크', desc: '로그인/회원가입·이용안내·기술보증기금(외부 링크↗). 상단 유틸바에 우측 정렬.'},
    {
        name: 'showThemeToggle',
        desc: '테마 변경 버튼 노출 여부. 기본 헤더는 true, main 배리에이션은 false이며 사용처에서 명시적으로 변경할 수 있다.',
    },
    {name: '전체 메뉴 (Sheet)', desc: '좁은 폭에서 주 메뉴·화면 유형 링크·유틸 링크를 담아 우측에서 여는 드로어.'},
    {
        name: 'variant="main"',
        desc: '메인 히어로용 메뉴·흰색 로고·fixed 배치를 적용한다. content-layout grid 정렬은 유지하고 모바일 동작은 기본 헤더와 공유한다.',
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
                        상단 유틸바(화면 유형 링크·유틸 링크)와 메인 내비(로고·주 메뉴·테마 토글·전체 메뉴) 2줄
                        구성입니다. 화면 폭을 md(≥768) 미만으로 줄이면 유틸바·주 메뉴가 전체 메뉴(Sheet)로 접히며, 테마
                        토글은 showThemeToggle prop으로 사용처에서 노출 여부를 정합니다.
                    </p>
                </div>
                <HeaderDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
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
                        Header에서 기업과 기관을 선택하면 URL의 <code className="font-mono">?userType=corp|org</code>가
                        변경되고, 선택된 유형의 주 메뉴가 즉시 표시됩니다.
                    </p>
                    <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-1 pl-5">
                        <li>
                            URL 쿼리를 선택 상태의 단일 원천으로 사용하므로 새로고침하거나 링크를 공유해도 유지됩니다.
                        </li>
                        <li>같은 메뉴 데이터를 데스크톱 주 메뉴와 모바일 전체 메뉴(Sheet)에 함께 사용합니다.</li>
                        <li>메뉴명과 이동 경로는 Header 내부가 아니라 각 서비스 페이지에서 관리합니다.</li>
                    </ul>
                </div>
                <HeaderDemo navigationByUserType={DEMO_NAVIGATION} />
                <CodeBlock code={USER_TYPE_USAGE_CODE} language="tsx" copyLabel="사용자 유형별 메뉴 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sh-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="sh-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        메뉴 데이터는 Header 바깥에서 관리하고, 선택된 사용자 유형은 URL의{' '}
                        <code className="font-mono">userType</code> 쿼리로 유지합니다.
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
                    <li>로고는 사이트명을 전달하는 h1 안에 홈 링크와 이미지로 구성됩니다.</li>
                    <li>
                        테마 토글·전체 메뉴 버튼은 아이콘 전용이라 aria-label 을 제공하고 내부 아이콘은 aria-hidden
                        입니다. [5.1.1]
                    </li>
                    <li>
                        전체 메뉴(Sheet)는 Radix 가 포커스 트랩·Esc 닫기·포커스 복귀·배경 스크롤 잠금을 담당합니다.
                        [8.2.1]
                    </li>
                    <li>모든 상호작용 요소는 focus-visible 링과 44px 터치 타깃을 가집니다. [6.1.2/6.1.3]</li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default HeaderGuidePage
