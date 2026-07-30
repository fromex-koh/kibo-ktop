import type {Metadata} from 'next'
import {TriangleAlert} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {FooterDemo, type FooterVariant} from '@/components/composite/footer'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'

export const metadata: Metadata = {title: '푸터 (Footer)'}

const USAGE_CODE = `import Footer from '@/components/composite/footer'

export default function Page() {
  return (
    <>
      <main id="main">{/* 페이지 콘텐츠 */}</main>
      <Footer variant="subpage" />
    </>
  )
}`

const STACK_USAGE_CODE = `// 메인페이지의 마지막 스택 섹션
<div
  data-stack-page
  className={cn(
    stackPageClassName,
    'bg-background relative md:flex md:h-dvh md:flex-col md:justify-end'
  )}
>
  <Footer variant="mainpage" />
</div>`

const VARIANTS = [
    {
        name: 'mainpage',
        usage: '메인페이지 마지막 스택 섹션',
        code: '<Footer variant="mainpage" />',
        difference: 'mainpage 스킨에 맞는 본문 톤과 solid 관련사이트 Select를 사용합니다.',
    },
    {
        name: 'subpage',
        usage: '자가진단 평가모형 선택 화면',
        code: '<Footer variant="subpage" />',
        difference: '서브페이지 표면에 맞는 낮은 본문 톤과 outline 관련사이트 Select를 사용합니다.',
    },
] as const

const THEMES: {
    label: string
    theme: 'mainpage' | 'light' | 'dark'
    variant: FooterVariant
    description: string
}[] = [
    {
        label: 'Mainpage',
        theme: 'mainpage',
        variant: 'mainpage',
        description: '메인페이지 마지막 스택 섹션의 어두운 표면입니다.',
    },
    {
        label: 'Subpage (라이트)',
        theme: 'light',
        variant: 'subpage',
        description: '라이트 모드를 사용하는 서브페이지의 밝은 표면입니다.',
    },
    {
        label: 'Subpage (다크)',
        theme: 'dark',
        variant: 'subpage',
        description: '다크 모드를 사용하는 서브페이지의 어두운 표면입니다.',
    },
]

const COMPOSITION = [
    {
        name: '로고',
        description: '기술보증기금 홈 링크입니다. 표면 명도에 따라 컬러·화이트 로고가 자동으로 교체됩니다.',
    },
    {
        name: '유틸 메뉴',
        description: '이용약관·가격 정책·개인정보처리방침·공지사항을 nav 랜드마크로 제공합니다.',
    },
    {
        name: '기관 정보',
        description: '대표전화, 운영 시간, 주소와 저작권을 표시합니다. 전화번호는 tel: 링크입니다.',
    },
    {
        name: '관련사이트',
        description: '현재 Select는 표시용 목업입니다. 실제 이동 기능은 별도 이동 버튼 또는 확인 절차와 조합합니다.',
    },
] as const

const PROPS = [
    {
        name: 'variant',
        description: '푸터가 놓이는 화면 유형을 선택합니다.',
        defaultValue: "'mainpage'",
        type: "'mainpage' | 'subpage'",
    },
    {
        name: 'className',
        description: 'footer 루트에 레이아웃 클래스를 추가합니다. 테마 색상 덮어쓰기는 지양합니다.',
        defaultValue: 'undefined',
        type: 'string',
    },
    {
        name: '...props',
        description: 'id, aria-* 등 네이티브 footer 속성을 전달합니다.',
        defaultValue: '-',
        type: "ComponentProps<'footer'>",
    },
] as const

const FooterGuidePage = () => (
    <GuidePageShell
        title="푸터 (Footer)"
        description="메인페이지와 서브페이지의 사이트 정보 영역을 제공하는 합성 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="footer-variant" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="footer-variant" className="typo-h4-bold">
                        Variant
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        variant는 테마가 아니라 푸터가 놓이는 화면 유형을 선택합니다.
                    </p>
                </div>
                <div className="border-border overflow-x-auto rounded-xl border">
                    <table className="w-full text-left">
                        <caption className="sr-only">Footer variant 선택 기준</caption>
                        <thead>
                            <tr className="border-border bg-card border-b">
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    Variant
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    사용 화면
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    차이
                                </th>
                                <th scope="col" className="typo-body-l-medium px-4 py-3">
                                    사용법
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {VARIANTS.map((variant) => (
                                <tr key={variant.name} className="border-border border-b last:border-b-0">
                                    <th
                                        scope="row"
                                        className="typo-body-l-medium text-primary-strong px-4 py-3 font-mono"
                                    >
                                        {variant.name}
                                    </th>
                                    <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">
                                        {variant.usage}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                        {variant.difference}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {variant.code}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="footer-theme" className="flex flex-col gap-12">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <h2 id="footer-theme" className="typo-h4-bold">
                            Theme
                        </h2>
                        <p className="typo-body-l-regular text-muted-foreground">
                            사용처에서 색상 클래스를 추가하지 않아도 페이지 테마가 자동으로 반영됩니다.
                        </p>
                    </div>
                    <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                        <li>
                            <code className="text-foreground font-mono">mainpage</code>는 메인페이지의{' '}
                            <code className="text-foreground font-mono">mainpage</code> 스킨에서 사용합니다.
                        </li>
                        <li>
                            <code className="text-foreground font-mono">subpage</code>는 사용자의 light/dark 선택을
                            그대로 따릅니다.
                        </li>
                        <li>
                            배경·본문·테두리는 시맨틱 토큰으로 관리합니다. 사용처에서{' '}
                            <code className="text-foreground font-mono">dark:</code> 분기나 임의 색상을 덮지 않습니다.
                        </li>
                        <li>로고만 표면 명도에 맞춰 컬러 또는 화이트 이미지로 자동 교체됩니다.</li>
                    </ul>
                    <Alert color="warning">
                        <TriangleAlert aria-hidden="true" />
                        <AlertTitle>가이드 큐레이션 전용 테마 스코프</AlertTitle>
                        <AlertDescription>
                            아래 <code className="font-mono">.mainpage</code>, <code className="font-mono">.light</code>
                            , <code className="font-mono">.dark</code> 래퍼는 한 페이지에서 세 테마를 비교하기 위한
                            큐레이션 용도입니다. 실제 프로젝트에서는 이 래퍼를 직접 추가하지 않고 ThemeProvider가 설정한
                            현재 페이지 테마에 Footer를 배치합니다.
                        </AlertDescription>
                    </Alert>
                </div>
                <div className="flex flex-col gap-12">
                    {THEMES.map((theme) => (
                        <article key={theme.theme} className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-baseline gap-2">
                                <h3 className="typo-body-xl-bold text-foreground">{theme.label}</h3>
                                <code className="typo-body-l-regular text-muted-foreground font-mono">
                                    variant=&quot;{theme.variant}&quot; · .{theme.theme}
                                </code>
                            </div>
                            <p className="typo-body-l-regular text-muted-foreground">{theme.description}</p>
                            {/* 가이드에서만 테마 스코프를 고정한다. 실제 화면은 ThemeProvider의 현재 테마를 따른다. */}
                            <div className={theme.theme}>
                                <FooterDemo variant={theme.variant} theme={theme.theme} />
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="footer-composition" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="footer-composition" className="typo-h4-bold">
                        Composition
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        두 variant는 같은 정보 구조와 유틸 메뉴 네 항목을 공유합니다.
                    </p>
                </div>
                <dl className="grid gap-4 md:grid-cols-2">
                    {COMPOSITION.map((item) => (
                        <div
                            key={item.name}
                            className="border-border bg-card flex flex-col gap-1 rounded-lg border p-4"
                        >
                            <dt className="typo-body-xl-bold text-foreground">{item.name}</dt>
                            <dd className="typo-body-l-regular text-muted-foreground">{item.description}</dd>
                        </div>
                    ))}
                </dl>
                <div className="flex flex-col gap-2">
                    <p className="typo-body-l-medium text-foreground">기본 조합</p>
                    <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="typo-body-l-medium text-foreground">메인페이지 스택 배치</p>
                    <CodeBlock code={STACK_USAGE_CODE} language="tsx" copyLabel="복사" />
                </div>
                <p className="typo-body-l-regular text-muted-foreground">
                    메뉴·관련사이트·연락처 데이터는 <code className="text-foreground font-mono">footer.tsx</code> 상단의{' '}
                    <code className="text-foreground font-mono">UTILITY_LINKS</code>,{' '}
                    <code className="text-foreground font-mono">FAMILY_SITES</code>,{' '}
                    <code className="text-foreground font-mono">CONTACT</code>에서 관리합니다.
                </p>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="footer-props" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="footer-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        화면에서는 대부분 variant만 선택하면 됩니다.
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
                            {PROPS.map((prop) => (
                                <tr key={prop.name} className="border-border border-b last:border-b-0">
                                    <th
                                        scope="row"
                                        className="typo-body-l-medium text-primary-strong px-4 py-3 font-mono"
                                    >
                                        {prop.name}
                                    </th>
                                    <td className="typo-body-l-regular text-foreground-subtle px-4 py-3">
                                        {prop.description}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {prop.defaultValue}
                                    </td>
                                    <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                        {prop.type}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="footer-accessibility" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="footer-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        컴포넌트가 제공하는 의미 구조를 유지하고 실제 링크 목적지만 연결합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code className="text-foreground font-mono">footer</code>는 사이트 정보 contentinfo
                        랜드마크이며, 유틸 링크는 이름이 있는 nav로 구분됩니다.
                    </li>
                    <li>로고·유틸 링크·전화번호는 목적을 알 수 있는 이름과 키보드 포커스 표시를 제공합니다.</li>
                    <li>관련사이트 Select에는 접근 가능한 이름이 있으며 키보드로 선택할 수 있습니다.</li>
                    <li>
                        Select 값 변경만으로 페이지를 이동시키지 않습니다. 이동 기능이 필요하면 명시적인 버튼 또는 확인
                        절차를 제공합니다.
                    </li>
                    <li>본문·링크 대비는 시맨틱 토큰으로 light·dark·mainpage 테마에서 관리합니다.</li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FooterGuidePage
