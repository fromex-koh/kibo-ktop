import type {Metadata} from 'next'
import {TriangleAlert} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {FooterDemo, type FooterVariant} from '@/components/composite/footer'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'

export const metadata: Metadata = {title: '푸터 (Footer)'}

// 사용법 스니펫 — 메인페이지용 기본 variant와 모형선택 화면용 subpage variant.
const USAGE_CODE = `import Footer from '@/components/composite/footer'

export default function Page() {
  return (
    <>
      <main id="main">{/* ... */}</main>
      {/* 메인페이지용 기본 푸터 */}
      <Footer />
    </>
  )
}

// 평가모형 선택 화면처럼 '플랫폼 소개'까지 노출하는 서브페이지 푸터
<Footer variant="subpage" />`

// 메인페이지의 스택 페이저에 넣을 때의 배치 스니펫.
const STACK_USAGE_CODE = `// app/component-guide/main-page/page.tsx — 마지막 스택 페이지로 배치한다(mainpage 스킨).
// 데스크톱에서는 고정 레이어의 하단에 맞추고, 모바일에서는 자연 흐름에 둔다.
// 레이어 전환 스타일은 theme/stack-pager.variants 의 stackPageClassName 을 붙여 받는다.
<div data-stack-page className={cn(stackPageClassName, 'bg-background relative md:flex md:h-dvh md:flex-col md:justify-end')}>
  <Footer />
</div>`

const VARIANT_CASES: {
    variant: FooterVariant
    label: string
    usage: string
    composition: string
    code: string
    theme: 'light' | 'mainpage'
}[] = [
    {
        variant: 'default',
        label: '메인페이지용',
        usage: '메인페이지의 마지막 스택 섹션에서 사용하는 푸터입니다.',
        composition: '로고·유틸 메뉴(4개)·대표전화·주소·저작권·관련사이트',
        code: '<Footer />',
        theme: 'mainpage',
    },
    {
        variant: 'subpage',
        label: '서브페이지용',
        usage: '현재 자가진단 평가모형 선택 화면에서 사용하는 푸터입니다.',
        composition: "로고·유틸 메뉴(5개 — '플랫폼 소개' 포함)·대표전화·주소·저작권·관련사이트",
        code: '<Footer variant="subpage" />',
        theme: 'light',
    },
]

// 실제 화면 조합 — 클래스 스코프(.light/.dark/.mainpage)와 화면에 맞는 variant를 함께 고정한다.
const THEME_CASES = [
    {
        variant: 'default',
        screen: '메인페이지',
        usage: '<Footer />',
        theme: 'mainpage',
        label: '메인페이지 · mainpage 스킨',
        desc: '메인페이지 마지막 섹션의 푸터. 어두운 표면과 화이트 로고로 고정됩니다.',
    },
    {
        variant: 'subpage',
        screen: '평가모형 선택',
        usage: '<Footer variant="subpage" />',
        theme: 'light',
        label: '서브페이지 · 라이트',
        desc: '사용자가 라이트 모드를 선택한 평가모형 선택 화면. 밝은 표면과 컬러 로고를 사용합니다.',
    },
    {
        variant: 'subpage',
        screen: '평가모형 선택',
        usage: '<Footer variant="subpage" />',
        theme: 'dark',
        label: '서브페이지 · 다크',
        desc: '사용자가 다크 모드를 선택한 평가모형 선택 화면. 어두운 표면과 화이트 로고를 사용합니다.',
    },
] satisfies {
    variant: FooterVariant
    screen: string
    usage: string
    theme: 'light' | 'dark' | 'mainpage'
    label: string
    desc: string
}[]

// Props — [이름, 설명, 기본값, 타입]
const PROPS_ITEMS = [
    [
        'variant',
        "default는 메인페이지용, subpage는 유틸 메뉴에 '플랫폼 소개'가 추가된 서브페이지용입니다.",
        "'default'",
        "'default' | 'subpage'",
    ],
    ['className', '푸터 루트에 클래스를 덧붙입니다(색은 페이지 테마를 따름).', 'undefined', 'string'],
    ['...props', 'aria-*·id 등 네이티브 footer 속성을 그대로 전달합니다.', '-', "ComponentProps<'footer'>"],
] as const

// 푸터가 조립하는 요소 목록(Composition 표).
const COMPOSITION = [
    {
        name: '로고',
        desc: '홈으로 이동하는 KIBO 기술보증기금 로고 링크. light 테마엔 컬러 로고(logo-kibo), dark·mainpage 엔 화이트 로고(logo-kibo-white)로 교체된다.',
    },
    {
        name: '유틸 메뉴 (nav)',
        desc: "이용약관·가격 정책·개인정보처리방침(강조)·공지사항 링크. subpage 에는 '플랫폼 소개'가 앞에 추가된다.",
    },
    {name: '대표전화', desc: '대표번호(tel: 링크)와 운영 시간.'},
    {name: '주소·저작권', desc: '기관 주소와 저작권 문구.'},
    {
        name: '관련사이트 (Select)',
        desc: '패밀리 사이트 이동 Select. 색 오버라이드 없이 페이지 테마를 그대로 따른다.',
    },
] as const

// 개발자가 연동 전에 알아야 하는 사항 — 데이터 위치·링크 처리·테마 정책.
const DEV_NOTES = [
    {
        title: '색은 페이지 테마를 따른다',
        desc: 'Footer 는 bg-background·text-foreground·text-muted-foreground·border 등 표준 시맨틱 토큰만 쓰므로, 메인페이지(mainpage 스킨)에서는 다크, 서브페이지에서는 light/dark 모드로 자동 반사됩니다([PB-06]). 사용처에서 dark: 분기나 임의 색을 덮지 마세요. 표면 명도가 바뀌는 로고만 자동 교체됩니다.',
    },
    {
        title: '페이지 테마 전환은 theme-provider 담당',
        desc: '메인 라우트는 theme-provider 가 forcedTheme 으로 mainpage 스킨을 강제하고, 그 외 라우트는 사용자의 light/dark 선택을 따릅니다. Footer 는 테마를 모른 채 표준 토큰만 참조하므로 어떤 페이지에 놓아도 그 페이지의 테마로 렌더됩니다.',
    },
    {
        title: '메뉴·연락처 데이터는 컴포넌트 상수',
        desc: '기본/서브페이지 유틸 링크(UTILITY_LINKS·SUBPAGE_UTILITY_LINKS)·관련사이트(FAMILY_SITES)·연락처(CONTACT)는 footer.tsx 상단 상수입니다. 현재 href 는 목업 값이므로 라우트 확정 시 상수만 실제 경로로 교체합니다.',
    },
    {
        title: '관련사이트 Select 는 표시 전용',
        desc: 'Select 는 값 변경 핸들러가 없는 목업 상태입니다. 실제 이동을 붙일 때는 onValueChange 에서 곧바로 라우팅하지 말고 명시적인 이동 버튼이나 확인 절차를 두어야 합니다. [KWCAG 7.2.1]',
    },
    {
        title: 'variant 별 간격과 셀렉트 외형',
        desc: '두 값 모두 footer.tsx 의 FOOTER_STYLE 한 곳에서 관리합니다. default 는 메인 시안(footer_area 325px)대로 위아래 여백 40·블록 간격 32·연락처 내부 8/0 이고, subpage 는 서브 시안(378px)대로 여백 56·간격 48·12/4 입니다. 관련사이트 Select 는 default 가 280px 폭에 테두리 없는 solid 면(bg-muted — mainpage·dark 에서 gray.700 반사), subpage 가 188px 폭에 Select 기본 outline(bg-surface·border-control)입니다.',
    },
    {
        title: '반응형 전환점',
        desc: '두 variant 모두 md 이상에서 저작권과 관련사이트가 가로로 정렬되고, 로고와 유틸 메뉴는 폭이 좁아지면 줄바꿈됩니다. 폭은 content-layout을 따릅니다.',
    },
    {
        title: 'subpage variant 적용 범위',
        desc: '현재 subpage variant는 자가진단 평가모형 선택 화면에만 적용합니다. 다른 서브페이지에는 자동 적용하지 않으며, 화면 요구사항이 확정된 경우에만 명시적으로 variant="subpage"를 지정합니다.',
    },
] as const

// 푸터 — shadcn 에 Footer primitive 가 없어 Select·Link·Image 를 조립한 합성 컴포넌트.
const FooterGuidePage = () => (
    <GuidePageShell
        title="푸터 (Footer)"
        description="메인페이지형과 서브페이지형을 제공하는 contentinfo 합성 컴포넌트입니다. 색은 페이지 테마(mainpage·light·dark)를 그대로 따릅니다."
    >
        <BaseCard>
            <section aria-labelledby="ft-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        두 variant 모두 로고·유틸 메뉴·기관 정보·관련사이트를 같은 구조로 배치하며, 유틸 메뉴 구성과
                        표면색·세로 간격만 다릅니다. default는 풀스크린 섹션에 들어가 시안 기준 더 촘촘합니다. 현재
                        subpage는 평가모형 선택 화면에만 사용합니다.
                    </p>
                </div>
                <Alert color="warning">
                    <TriangleAlert aria-hidden="true" />
                    <AlertTitle>쇼케이스 전용 — 실제 사용 시 제외하세요</AlertTitle>
                    <AlertDescription>
                        메인페이지용 미리보기는 <code className="font-mono">.mainpage</code>, 서브페이지용 미리보기는{' '}
                        <code className="font-mono">.light</code> 또는 <code className="font-mono">.dark</code>로 감싸
                        실제 화면 상태를 고정했습니다. 이 래퍼는 가이드 전용이며 실제 화면에서는 Footer만 배치합니다.
                    </AlertDescription>
                </Alert>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-baseline gap-2">
                        <p className="typo-body-l-medium text-foreground">메인페이지용</p>
                        <code className="typo-body-l-regular text-muted-foreground font-mono">default</code>
                    </div>
                    <p className="typo-body-l-regular text-muted-foreground">
                        메인페이지 마지막 섹션에서 사용하는 푸터입니다.
                    </p>
                    <div className="mainpage">
                        <FooterDemo />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-baseline gap-2">
                        <p className="typo-body-l-medium text-foreground">서브페이지용 정보형</p>
                        <code className="typo-body-l-regular text-muted-foreground font-mono">
                            variant=&quot;subpage&quot;
                        </code>
                    </div>
                    <p className="typo-body-l-regular text-muted-foreground">
                        평가모형 선택 화면에서 사용하는 정보형 푸터입니다.
                    </p>
                    <div className="light">
                        <FooterDemo variant="subpage" />
                    </div>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-variant" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-variant" className="typo-h4-bold">
                        Variant
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        화면 유형에 따라 정보 밀도와 메뉴 구성이 달라집니다. variant는 화면의 테마가 아니라 푸터의
                        구조를 선택합니다.
                    </p>
                </div>
                <div className="flex flex-col gap-8">
                    {VARIANT_CASES.map((item) => (
                        <article key={item.variant} className="flex flex-col gap-3">
                            <div className="border-border bg-muted grid gap-3 rounded-lg border p-4 md:grid-cols-3">
                                <div>
                                    <h3 className="typo-body-xl-bold text-foreground">{item.label}</h3>
                                    <code className="typo-body-l-regular text-primary font-mono">{item.variant}</code>
                                </div>
                                <div>
                                    <p className="typo-body-l-medium text-foreground">사용 화면</p>
                                    <p className="typo-body-l-regular text-muted-foreground">{item.usage}</p>
                                </div>
                                <div>
                                    <p className="typo-body-l-medium text-foreground">포함 정보</p>
                                    <p className="typo-body-l-regular text-muted-foreground">{item.composition}</p>
                                </div>
                            </div>
                            <code className="border-border bg-background text-foreground w-fit rounded-md border px-3 py-2 font-mono text-sm">
                                {item.code}
                            </code>
                            <div className={item.theme}>
                                <FooterDemo variant={item.variant} />
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-theme" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-theme" className="typo-h4-bold">
                        화면별 테마
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        실제 사용 화면과 variant를 함께 큐레이션합니다. 메인페이지는 default와 mainpage 스킨, 평가모형
                        선택 화면은 subpage와 사용자의 light/dark 테마를 조합합니다.
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    {THEME_CASES.map((tc) => (
                        <div key={`${tc.screen}-${tc.theme}`} className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-baseline gap-2">
                                <p className="typo-body-l-medium text-foreground">{tc.label}</p>
                                <code className="typo-body-l-regular text-muted-foreground font-mono">
                                    {tc.usage} · .{tc.theme}
                                </code>
                            </div>
                            <p className="typo-body-l-regular text-muted-foreground">{tc.desc}</p>
                            {/* 클래스 스코프로 테마를 강제한다 — 내부 시맨틱 토큰이 해당 테마 값으로 반사된다. */}
                            <div className={tc.theme}>
                                <FooterDemo variant={tc.variant} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-composition" className="typo-h4-bold">
                        Composition
                    </h2>
                    <p className="text-foreground-muted text-sm">푸터가 조립하는 요소들입니다.</p>
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
            <section aria-labelledby="ft-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">Footer 에 넘기는 속성입니다.</p>
                </div>
                <div className="border-border overflow-x-auto rounded-xl border">
                    <table className="w-full text-left">
                        <caption className="sr-only">Footer Props 목록</caption>
                        <thead>
                            <tr className="border-border bg-card border-b">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Name
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Description
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Default
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Type
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROPS_ITEMS.map(([name, description, defaultValue, type]) => (
                                <tr key={name} className="border-border border-b last:border-b-0">
                                    <th
                                        scope="row"
                                        className="typo-body-l-medium text-primary-strong px-4 py-3 font-mono"
                                    >
                                        {name}
                                    </th>
                                    <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">
                                        {description}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {defaultValue}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {type}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-dev" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-dev" className="typo-h4-bold">
                        개발 시 참고사항
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터 연동·라우팅·테마 정책 등 사용 전에 알아야 하는 사항입니다.
                    </p>
                </div>
                <dl className="flex flex-col gap-5">
                    {DEV_NOTES.map((note) => (
                        <div key={note.title} className="flex flex-col gap-1">
                            <dt className="typo-body-xl-bold text-foreground">{note.title}</dt>
                            <dd className="typo-body-l-regular text-muted-foreground">{note.desc}</dd>
                        </div>
                    ))}
                </dl>
                <CodeBlock code={STACK_USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="text-foreground-muted text-sm">푸터가 지키는 KWCAG 2.1 요건입니다.</p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        푸터는 contentinfo 랜드마크(&lt;footer&gt;)로 렌더링되고, 유틸 메뉴는 이름을 가진 nav 로
                        구분됩니다. [8.2.1/6.4.2]
                    </li>
                    <li>모든 링크는 텍스트만으로 목적을 알 수 있고 focus-visible 아웃라인을 가집니다. [6.4.3/6.1.2]</li>
                    <li>관련사이트 Select 는 aria-label 을 가지며 Radix 가 키보드 조작을 담당합니다. [7.4.1/8.2.1]</li>
                    <li>
                        본문·링크 색은 표준 시맨틱 토큰으로 각 테마(light·dark·mainpage)에서 대비를 관리합니다. [5.3.3]
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FooterGuidePage
