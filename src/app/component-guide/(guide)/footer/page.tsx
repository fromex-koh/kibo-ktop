import type {Metadata} from 'next'
import {TriangleAlert} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {FooterDemo} from '@/components/composite/footer'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'

export const metadata: Metadata = {title: '푸터 (Footer)'}

// 사용법 스니펫 — 전체형 기본 variant와 모형선택 화면용 subpage variant.
const USAGE_CODE = `import Footer from '@/components/composite/footer'

export default function Page() {
  return (
    <>
      <main id="main">{/* ... */}</main>
      {/* 전체 사이트맵을 포함하는 기본 푸터 */}
      <Footer />
    </>
  )
}

// 모바일에서 사이트맵을 감추는 경우(마지막 섹션이 이미 긴 화면)
<Footer showSitemapOnMobile={false} />

// 평가모형 선택 화면처럼 사이트맵 없이 핵심 기관 정보만 표시하는 경우
<Footer variant="subpage" />`

// 메인페이지의 스택 페이저에 넣을 때의 배치 스니펫.
const STACK_USAGE_CODE = `// app/component-guide/main-page/page.tsx — 마지막 스택 페이지로 배치한다(mainpage 스킨).
// 데스크톱에서는 고정 레이어의 하단에 맞추고, 모바일에서는 자연 흐름에 둔다.
// 레이어 전환 스타일은 theme/stack-pager.variants 의 stackPageClassName 을 붙여 받는다.
<div data-stack-page className={cn(stackPageClassName, 'bg-background relative md:flex md:h-dvh md:flex-col md:justify-end')}>
  <Footer />
</div>`

// 페이지별 테마 케이스 — 클래스 스코프(.light/.dark/.mainpage)로 강제 미리보기한다.
const THEME_CASES = [
    {
        theme: 'light',
        label: '라이트 (서브페이지)',
        desc: '서브페이지 라이트 모드. 밝은 표면 + 컬러 로고.',
    },
    {
        theme: 'dark',
        label: '다크 (서브페이지)',
        desc: '서브페이지 다크 모드. 어두운 표면 + 화이트 로고.',
    },
    {
        theme: 'mainpage',
        label: '메인페이지 (mainpage 스킨)',
        desc: '메인 라우트에서 강제되는 스킨. 어두운 표면 + 화이트 로고.',
    },
] as const

// Props — [이름, 설명, 기본값, 타입]
const PROPS_ITEMS = [
    [
        'variant',
        'default는 사이트맵을 포함한 전체형, subpage는 간결한 정보형입니다.',
        "'default'",
        "'default' | 'subpage'",
    ],
    ['showSitemapOnMobile', 'md 미만에서 사이트맵 노출 여부입니다. md 이상에서는 항상 노출합니다.', 'true', 'boolean'],
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
        name: '사이트맵 (nav)',
        desc: 'default 전용. 플랫폼 소개·기술평가·특허평가·K-BIGx 보고서·탄소중립 컬럼을 제공한다.',
    },
    {name: '대표전화', desc: '대표번호(tel: 링크)와 운영 시간. xl 이상에서 사이트맵 우측에 배치된다.'},
    {
        name: 'Separator',
        desc: 'default 전용. 사이트맵 영역과 하단 이용 정보를 나누며 표준 border 토큰을 따른다.',
    },
    {name: '이용 정보 (nav)', desc: '이용약관·가격 정책·개인정보처리방침(강조)·공지사항/FAQ 유틸 링크.'},
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
        desc: '사이트맵(SITEMAP)·기본/서브페이지 유틸 링크(UTILITY_LINKS·SUBPAGE_UTILITY_LINKS)·관련사이트(FAMILY_SITES)·연락처(CONTACT)는 footer.tsx 상단 상수입니다. 현재 href 는 목업 값이므로 라우트 확정 시 상수만 실제 경로로 교체합니다.',
    },
    {
        title: '관련사이트 Select 는 표시 전용',
        desc: 'Select 는 값 변경 핸들러가 없는 목업 상태입니다. 실제 이동을 붙일 때는 onValueChange 에서 곧바로 라우팅하지 말고 명시적인 이동 버튼이나 확인 절차를 두어야 합니다. [KWCAG 7.2.1]',
    },
    {
        title: '반응형 전환점',
        desc: 'default는 xl 이상에서 대표전화가 사이트맵 우측으로 이동합니다. 두 variant 모두 md 이상에서 하단 기관 정보와 관련사이트가 가로로 정렬되며, 폭은 content-layout을 따릅니다.',
    },
    {
        title: 'subpage variant 적용 범위',
        desc: '현재 subpage variant는 자가진단 평가모형 선택 화면에만 적용합니다. 다른 서브페이지에는 자동 적용하지 않으며, 화면 요구사항이 확정된 경우에만 명시적으로 variant="subpage"를 지정합니다.',
    },
] as const

// 푸터 — shadcn 에 Footer primitive 가 없어 Select·Separator·Link·Image 를 조립한 합성 컴포넌트.
const FooterGuidePage = () => (
    <GuidePageShell
        title="푸터 (Footer)"
        description="전체 사이트맵형과 서브페이지 정보형을 제공하는 contentinfo 합성 컴포넌트입니다. 색은 페이지 테마(mainpage·light·dark)를 그대로 따릅니다."
    >
        <BaseCard>
            <section aria-labelledby="ft-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        default는 사이트맵을 포함한 전체형이고, subpage는 사이트맵을 제외하고 로고·유틸 메뉴·기관
                        정보·관련사이트를 간결하게 배치합니다. 현재 subpage는 평가모형 선택 화면에만 사용합니다.
                    </p>
                </div>
                <Alert color="warning">
                    <TriangleAlert aria-hidden="true" />
                    <AlertTitle>쇼케이스 전용 — 실제 사용 시 제외하세요</AlertTitle>
                    <AlertDescription>
                        이 페이지의 모든 푸터 미리보기는 테마 토글과 무관하게 항상 같은 모습으로 확인할 수 있도록 각
                        미리보기를 <code className="font-mono">.light</code>·<code className="font-mono">.dark</code>·
                        <code className="font-mono">.mainpage</code> 클래스로 감싸 테마를 고정했습니다. 이 래핑은 가이드
                        전용 스캐폴딩이며 기본 컴포넌트 구성이 아닙니다. 실제 화면에 적용할 때는 이 래퍼를 빼고{' '}
                        <code className="font-mono">&lt;Footer /&gt;</code>만 두세요 — 그러면 놓인 페이지의 테마를
                        자동으로 따릅니다.
                    </AlertDescription>
                </Alert>
                {/* 미리보기는 테마 토글과 무관하게 light 로 고정한다(쇼케이스용 스캐폴딩 — 실제 사용 시 제외). */}
                <div className="light">
                    <FooterDemo />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-baseline gap-2">
                        <p className="typo-body-l-medium text-foreground">서브페이지 정보형</p>
                        <code className="typo-body-l-regular text-muted-foreground font-mono">
                            variant=&quot;subpage&quot;
                        </code>
                    </div>
                    <p className="typo-body-l-regular text-muted-foreground">
                        평가모형 선택 화면에서 사용하는 간결한 푸터입니다.
                    </p>
                    <div className="light">
                        <FooterDemo variant="subpage" />
                    </div>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ft-theme" className="flex flex-col gap-4">
                <div>
                    <h2 id="ft-theme" className="typo-h4-bold">
                        페이지별 테마
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Footer 는 표준 시맨틱 토큰만 쓰므로 놓인 페이지의 테마를 그대로 따릅니다. 메인페이지는 mainpage
                        스킨, 서브페이지는 light/dark 모드로 자동 반사되고, 표면 명도에 맞춰 로고가 교체됩니다. 아래
                        미리보기는 각 테마를 클래스로 고정해 페이지 테마 토글과 무관하게 항상 같은 모습이며, 이 고정
                        래핑은 위 안내대로 가이드 전용입니다(실제 사용 시 제외).
                    </p>
                </div>
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
                                <FooterDemo />
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
                    <p className="typo-body-l-regular text-muted-foreground">
                        Footer 에 넘기는 속성입니다. showSitemapOnMobile은 default variant에만 적용됩니다.
                    </p>
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
                        푸터는 contentinfo 랜드마크(&lt;footer&gt;)로 렌더링되고, 사이트맵·이용 정보는 각각 이름을 가진
                        nav 로 구분됩니다. [8.2.1/6.4.2]
                    </li>
                    <li>
                        외부 링크 아이콘은 aria-hidden 이고 &quot;새 창 열림&quot; 텍스트를 함께 제공합니다. [5.1.1]
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
