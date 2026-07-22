import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {MainFooterDemo} from '@/components/composite/main-footer'

export const metadata: Metadata = {title: '메인 푸터 (MainFooter)'}

// 사용법 스니펫 — 메인페이지 하단에 배치하는 기본 사용과 마키 제외 사용.
const USAGE_CODE = `import MainFooter from '@/components/composite/main-footer'

export default function Page() {
  return (
    <>
      <main id="main">{/* ... */}</main>
      {/* 마키 장식 + 사이트맵·대표전화·이용 정보를 담은 푸터 */}
      <MainFooter />
    </>
  )
}

// 장식 마키 없이 푸터 본문만 노출하는 경우
<MainFooter showMarquee={false} />`

// 메인페이지의 스택 페이저에 넣을 때의 배치 스니펫.
const STACK_USAGE_CODE = `// app/main-page/page.tsx — 마지막 스택 페이지로 배치한다.
// 데스크톱에서는 고정 레이어의 하단에 맞추고, 모바일에서는 자연 흐름에 둔다.
<div data-stack-page className="stack-page bg-background relative md:flex md:h-dvh md:flex-col md:justify-end">
  <MainFooter />
</div>`

// Props — [이름, 설명, 기본값, 타입]
const PROPS_ITEMS = [
    ['showMarquee', '상단 장식 마키 밴드 노출 여부입니다.', 'true', 'boolean'],
    ['className', '푸터 루트에 클래스를 덧붙입니다(색은 토큰 고정).', 'undefined', 'string'],
    ['...props', 'aria-*·id 등 네이티브 footer 속성을 그대로 전달합니다.', '-', "ComponentProps<'footer'>"],
] as const

// 푸터가 조립하는 요소 목록(Composition 표).
const COMPOSITION = [
    {
        name: '마키 밴드 (showMarquee)',
        desc: '"Korea Technology-rating Open platform" 대형 문구가 좌측으로 흐르는 장식 영역. 기본 true이며 aria-hidden 이고 감속 모션 선호 시 정지한다.',
    },
    {name: '로고', desc: '홈으로 이동하는 KIBO 기술보증기금 로고 링크. 다크 표면이라 logo-white 에셋을 사용한다.'},
    {
        name: '사이트맵 (nav)',
        desc: '플랫폼 소개·기술평가·특허평가·K-BIGx 보고서·탄소중립 컬럼. 탄소중립은 외부 링크(↗)라 "새 창 열림" 대체 텍스트를 함께 제공한다.',
    },
    {name: '대표전화', desc: '대표번호(tel: 링크)와 운영 시간. xl 이상에서 사이트맵 우측에 배치된다.'},
    {name: 'Separator', desc: '사이트맵 영역과 하단 이용 정보를 나누는 구분선. 색은 main-footer-border 를 따른다.'},
    {name: '이용 정보 (nav)', desc: '이용약관·가격 정책·개인정보처리방침(강조)·공지사항/FAQ 유틸 링크.'},
    {name: '주소·저작권', desc: '기관 주소와 저작권 문구.'},
    {
        name: '관련사이트 (Select)',
        desc: '패밀리 사이트 이동 Select. 다크 표면에 맞춰 main-footer-* 토큰으로 색만 연결한다.',
    },
] as const

// 개발자가 연동 전에 알아야 하는 사항 — 데이터 위치·링크 처리·색 정책.
const DEV_NOTES = [
    {
        title: '메뉴·연락처 데이터는 컴포넌트 상수',
        desc: '사이트맵(SITEMAP)·유틸 링크(UTILITY_LINKS)·관련사이트(FAMILY_SITES)·연락처(CONTACT)는 main-footer.tsx 상단 상수입니다. 현재 href 는 전부 "#" 목업이므로 라우트 확정 시 이 상수만 실제 경로로 교체합니다. 항목이 늘어도 마크업 수정은 필요 없습니다.',
    },
    {
        title: '관련사이트 Select 는 표시 전용',
        desc: 'Select 는 값 변경 핸들러가 없는 목업 상태입니다. 실제 이동을 붙일 때는 onValueChange 에서 곧바로 라우팅하지 말고 명시적인 이동 버튼이나 확인 절차를 두어야 합니다. [KWCAG 7.2.1]',
    },
    {
        title: '색은 main-footer-* 토큰 고정',
        desc: '시안 푸터는 테마와 무관한 고정 다크 표면이라 세 테마(light·dark·mainpage) 값이 모두 같습니다. 사용처에서 dark: 분기나 임의 색을 덮지 말고 tokens.json 의 main-footer-* 값만 수정합니다. 토큰 목록은 Semantic 색상 가이드의 main-footer 그룹에 있습니다.',
    },
    {
        title: '반응형 전환점',
        desc: 'xl(≥1280) 이상에서 대표전화가 사이트맵 우측으로, md(≥768) 이상에서 주소와 관련사이트가 좌우로 나뉩니다. 폭은 content-layout(max-w-content)을 따르므로 별도 컨테이너로 감쌀 필요가 없습니다.',
    },
    {
        title: '마키는 컴포넌트 폭 전체를 사용',
        desc: '마키 밴드는 뷰포트 폭을 흐르는 장식이라 좁은 컨테이너 안에 넣으면 잘립니다. 카드·모달 등 폭이 제한된 문맥에서는 showMarquee={false} 로 끕니다. 애니메이션은 globals.css 의 main-marquee 키프레임입니다.',
    },
    {
        title: '메인페이지 스택 페이저와의 관계',
        desc: '푸터 자체는 스택 구조를 모릅니다. /main-page 에서는 data-stack-page 래퍼가 마지막 페이지 역할을 하므로, 다른 화면에서 재사용할 때는 래퍼 없이 그대로 배치하면 됩니다.',
    },
] as const

// 메인 푸터 — shadcn 에 Footer primitive 가 없어 Select·Separator·Link·Image 를 조립한 합성 컴포넌트.
const MainFooterGuidePage = () => (
    <GuidePageShell
        title="메인 푸터 (MainFooter)"
        description="사이트맵·대표전화·이용 정보·관련사이트를 담는 메인페이지 하단 contentinfo 합성 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="mf-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="mf-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        로고·사이트맵·대표전화 영역과 구분선 아래 이용 정보 영역 2단 구성입니다. xl(≥1280) 미만에서는
                        대표전화가 사이트맵 아래로 내려가고, md(≥768) 미만에서는 주소·관련사이트가 세로로 쌓입니다.
                        데모에서는 화면 폭 전체를 흐르는 마키 장식을 감췄습니다(showMarquee=false).
                    </p>
                </div>
                <MainFooterDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="mf-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="mf-composition" className="typo-h4-bold">
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
            <section aria-labelledby="mf-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="mf-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        MainFooter 에 넘기는 속성입니다. 메뉴·연락처는 props 가 아니라 컴포넌트 상수로 관리합니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-xl border">
                    <table className="w-full text-left">
                        <caption className="sr-only">MainFooter Props 목록</caption>
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
            <section aria-labelledby="mf-dev" className="flex flex-col gap-4">
                <div>
                    <h2 id="mf-dev" className="typo-h4-bold">
                        개발 시 참고사항
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        데이터 연동·라우팅·색 정책 등 사용 전에 알아야 하는 사항입니다.
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
            <section aria-labelledby="mf-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="mf-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="text-foreground-muted text-sm">푸터가 지키는 KWCAG 2.1 요건입니다.</p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        푸터는 contentinfo 랜드마크(&lt;footer&gt;)로 렌더링되고, 사이트맵·이용 정보는 각각 이름을 가진
                        nav 로 구분됩니다. [8.2.1/6.4.2]
                    </li>
                    <li>마키는 장식이라 aria-hidden 이며 prefers-reduced-motion 에서 정지합니다. [5.1.1/6.3.1]</li>
                    <li>
                        외부 링크 아이콘은 aria-hidden 이고 &quot;새 창 열림&quot; 텍스트를 함께 제공합니다. [5.1.1]
                    </li>
                    <li>모든 링크는 텍스트만으로 목적을 알 수 있고 focus-visible 아웃라인을 가집니다. [6.4.3/6.1.2]</li>
                    <li>관련사이트 Select 는 aria-label 을 가지며 Radix 가 키보드 조작을 담당합니다. [7.4.1/8.2.1]</li>
                    <li>다크 표면 위 본문·링크 색은 main-footer-* 토큰으로 대비를 관리합니다. [5.3.3]</li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default MainFooterGuidePage
