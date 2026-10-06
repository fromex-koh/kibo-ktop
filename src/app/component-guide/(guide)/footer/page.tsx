// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {FooterDemo, type FooterVariant} from '@/components/composite/footer'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '푸터 (Footer)'}

const USAGE_CODE = `import Footer from '@/components/composite/footer'

// 서비스 서브페이지 — SubPageLayout 이 Footer 를 함께 넣으므로 직접 넣지 않는다.
<SubPageLayout userType={user?.userType}>{children}</SubPageLayout>

// 별도 레이아웃을 쓰는 화면에서만 직접 배치한다.
<main id="main">{/* 페이지 콘텐츠 */}</main>
<Footer variant="subpage" userType="corp" />`

const MAINPAGE_USAGE_CODE = `import Footer from '@/components/composite/footer'

// 메인페이지 — 마지막 섹션 아래에 직접 배치한다.
<div id="site-info" tabIndex={-1} className="bg-background relative mt-auto w-full pt-28 md:pt-2">
  <Footer variant="mainpage" />
</div>`

const VARIANT_COLUMNS = [
    {key: 'name', header: 'variant', align: 'start', rowHeader: true},
    {key: 'usage', header: '사용 화면', align: 'start'},
    {key: 'difference', header: '차이', align: 'start', wrap: true},
] as const

const VARIANTS = [
    {
        name: 'mainpage',
        usage: '메인페이지 마지막 섹션',
        difference: '페이지 배경 면에 기본 본문색을 쓰고, 관련사이트 셀렉트는 테두리 없는 채움형입니다.',
    },
    {
        name: 'subpage',
        usage: '서비스 서브페이지',
        difference: '카드 면에 보조 본문색을 쓰고, 관련사이트 셀렉트는 기본 모양입니다.',
    },
] as const

const THEMES: {
    label: string
    theme: 'mainpage' | 'light' | 'dark'
    variant: FooterVariant
}[] = [
    {label: 'mainpage', theme: 'mainpage', variant: 'mainpage'},
    {label: 'subpage (라이트)', theme: 'light', variant: 'subpage'},
    {label: 'subpage (다크)', theme: 'dark', variant: 'subpage'},
]

const COMPOSITION_COLUMNS = [
    {key: 'name', header: '영역', align: 'start', rowHeader: true},
    {key: 'description', header: '내용', align: 'start', wrap: true},
] as const

const COMPOSITION = [
    {
        name: '로고',
        description: '기술보증기금 로고입니다. 링크가 아니며, 테마에 따라 컬러 · 흰색 로고로 바뀝니다.',
    },
    {
        name: '유틸 메뉴',
        description:
            '이용약관 · 신용정보 활용체제 · 가격정책 · 개인정보처리방침 · 공지사항입니다. userType 을 넘기면 신용정보 활용체제 · 개인정보처리방침 · 공지사항이 그 유형의 경로로 연결되고, 나머지와 userType 이 없을 때는 # 입니다.',
    },
    {
        name: '기관 정보',
        description: '대표전화(tel: 링크) · 운영 시간 · 주소 · 저작권 문구입니다.',
    },
    {
        name: '관련사이트',
        description: '셀렉트에서 고르면 해당 외부 사이트가 새 창으로 열리고, 셀렉트는 미선택 상태로 돌아갑니다.',
    },
] as const

const PROPS_ITEMS = [
    ['Footer', 'variant', '푸터가 놓이는 화면 유형입니다.', "'mainpage'", "'mainpage' | 'subpage'"],
    [
        'Footer',
        'userType',
        '유틸 메뉴가 연결될 서비스 유형입니다. 생략하면 링크가 # 로 남습니다.',
        'undefined',
        "'corp' | 'org'",
    ],
    ['Footer', 'className', 'footer 요소에 덧붙일 클래스입니다.', 'undefined', 'string'],
    [
        'Footer',
        'footer 속성',
        'id 등 네이티브 footer 속성을 전달합니다. aria-label 은 "사이트 정보"로 고정됩니다.',
        '-',
        "ComponentProps<'footer'>",
    ],
] as const

const FooterGuidePage = () => (
    <GuidePageShell
        title="푸터 (Footer)"
        description="메인페이지와 서브페이지 하단에 사이트 정보를 보여 주는 공통 푸터입니다. 서브페이지는 SubPageLayout 이 함께 그립니다."
    >
        <BaseCard>
            <section aria-labelledby="footer-variant" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="footer-variant" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">variant</code>로 푸터가 놓이는 화면 유형을 고릅니다.
                        색상은 페이지 테마를 따르므로 사용처에서 색상 클래스나{' '}
                        <code className="text-foreground font-mono">dark:</code> 분기를 덧붙이지 않습니다.
                    </p>
                </div>
                <Table
                    caption="Footer variant 선택 기준"
                    columns={VARIANT_COLUMNS}
                    rows={VARIANTS.map((variant) => ({
                        key: variant.name,
                        cells: [<code key="name">{variant.name}</code>, variant.usage, variant.difference],
                    }))}
                    size="md"
                />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">서브페이지</h3>
                        <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">메인페이지</h3>
                        <CodeBlock code={MAINPAGE_USAGE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="footer-theme" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="footer-theme" className="typo-h4-bold">
                        테마별 미리보기
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">mainpage</code>는 메인페이지 스킨에서,{' '}
                        <code className="text-foreground font-mono">subpage</code>는 사용자가 고른 라이트 · 다크
                        테마에서 씁니다.
                    </p>
                </div>
                <div className="border-foreground-subtle/30 bg-pastel-neutral/40 rounded-sm border p-5">
                    <p className="typo-body-l-regular text-label-foreground">
                        아래 미리보기의 <code className="text-foreground font-mono">.mainpage</code> ·{' '}
                        <code className="text-foreground font-mono">.light</code> ·{' '}
                        <code className="text-foreground font-mono">.dark</code> 래퍼는 가이드 전용입니다. 실제
                        화면에서는 래퍼를 넣지 않습니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    {THEMES.map((theme) => (
                        <div key={theme.theme} className="flex flex-col gap-4 py-8 last:pb-0">
                            <h3 className="typo-title-m-bold text-foreground">{theme.label}</h3>
                            {/* 가이드에서만 테마 스코프를 고정한다. 실제 화면은 ThemeProvider의 현재 테마를 따른다. */}
                            <div className={theme.theme}>
                                <FooterDemo variant={theme.variant} theme={theme.theme} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="footer-composition" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="footer-composition" className="typo-h4-bold">
                        구성 요소
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        두 variant 의 내용은 같습니다. 메뉴 · 관련사이트 · 연락처는{' '}
                        <code className="text-foreground font-mono">footer.tsx</code> 상단의{' '}
                        <code className="text-foreground font-mono">createUtilityLinks</code> ·{' '}
                        <code className="text-foreground font-mono">FAMILY_SITES</code> ·{' '}
                        <code className="text-foreground font-mono">CONTACT</code>에서 고칩니다.
                    </p>
                </div>
                <Table
                    caption="Footer 구성 요소 목록"
                    columns={COMPOSITION_COLUMNS}
                    rows={COMPOSITION.map((item) => ({key: item.name, cells: [item.name, item.description]}))}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="footer-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="footer-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        이름과 포커스 표시는 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>footer</code>에는 &quot;사이트 정보&quot;, 유틸 메뉴 <code>nav</code>에는 &quot;푸터 유틸
                        메뉴&quot;, 셀렉트에는 &quot;관련 사이트&quot;라는 이름이 있습니다[6.4.2][7.4.1].
                    </li>
                    <li>로고 이미지는 장식이고 기관명은 스크린리더 전용 텍스트로 제공됩니다[5.1.1].</li>
                    <li>유틸 링크와 전화번호에 키보드 포커스 표시가 있습니다[6.1.2].</li>
                    <li>
                        로고·유틸 메뉴는 <code>xl</code>(1280) 이상에서만 한 줄로 서고 그 미만은 로고 아래에 쌓입니다.
                        DOM 순서와 읽는 순서는 같습니다[7.3.1].
                    </li>
                    <li>
                        관련 사이트는 셀렉트에서 고르는 즉시 새 창이 열립니다[7.2.1]. 별도 확인 버튼이 필요하면
                        서비스에서 보완합니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="footer-props" className="flex flex-col gap-6">
                <h2 id="footer-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="Footer Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FooterGuidePage
