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

// 푸터가 사용하는 시맨틱 색 토큰 — 테마와 무관하게 세 테마(light·dark·mainpage) 값이 모두 같다.
const COLOR_TOKENS = [
    {token: 'main-footer-background', role: '푸터 배경 (gray.900)'},
    {token: 'main-footer-foreground', role: '기본 텍스트·제목 (common.white)'},
    {token: 'main-footer-muted', role: '사이트맵 링크·보조 텍스트 (gray.300)'},
    {token: 'main-footer-border', role: '구분선 (gray.700)'},
    {token: 'main-footer-surface', role: '관련사이트 Select 표면 (gray.700)'},
    {token: 'main-footer-control', role: 'Select 테두리 (gray.700)'},
    {token: 'main-footer-placeholder', role: 'Select placeholder (gray.50)'},
    {token: 'main-footer-popover', role: 'Select 목록 배경 (gray.800)'},
    {token: 'main-footer-popover-foreground', role: 'Select 목록 텍스트 (gray.50)'},
    {token: 'main-footer-accent', role: 'Select 항목 hover·focus 배경 (gray.600)'},
    {token: 'main-footer-accent-foreground', role: 'Select 항목 hover·focus 텍스트 (common.white)'},
    {token: 'main-footer-focus', role: '포커스 링·테두리 (blue.400)'},
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
            <section aria-labelledby="mf-tokens" className="flex flex-col gap-4">
                <div>
                    <h2 id="mf-tokens" className="typo-h4-bold">
                        색 토큰
                    </h2>
                    <p className="text-foreground-muted text-sm">
                        시안의 푸터는 테마와 무관하게 고정된 다크 표면이라 main-footer-* 역할 토큰의 light·dark·mainpage
                        값이 모두 같습니다. 값 변경은 tokens.json 에서만 합니다.
                    </p>
                </div>
                <div className="bg-background border-border overflow-x-auto rounded-md border">
                    <table className="w-full text-left">
                        <caption className="sr-only">색 토큰 목록</caption>
                        <thead>
                            <tr className="border-border border-b bg-gray-100/25">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Token
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Role
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {COLOR_TOKENS.map((row) => (
                                <tr key={row.token} className="border-border bg-background border-b last:border-b-0">
                                    <th
                                        scope="row"
                                        className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                    >
                                        {row.token}
                                    </th>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{row.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
