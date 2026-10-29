// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {PillTabsDemo} from './pill-tabs-demo'

export const metadata: Metadata = {title: '알약 전환 탭 (PillTabs)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

const USAGE_CODE = `import {Tabs as TabsPrimitive} from 'radix-ui'
import {PILL_TAB_LIST_CLASS_NAME, PILL_TAB_TRIGGER_CLASS_NAME} from '@/components/theme/pill-tabs.variants'

<TabsPrimitive.Root value={value} onValueChange={setValue}>
  <TabsPrimitive.List aria-label="탄소중립 플랫폼" className={PILL_TAB_LIST_CLASS_NAME}>
    <TabsPrimitive.Trigger value="leading-sme" className={PILL_TAB_TRIGGER_CLASS_NAME}>
      탄소중립 선도중소기업확인 플랫폼
    </TabsPrimitive.Trigger>
    <TabsPrimitive.Trigger value="taxonomy" className={PILL_TAB_TRIGGER_CLASS_NAME}>
      개방형 K-택소노미 플랫폼
    </TabsPrimitive.Trigger>
  </TabsPrimitive.List>
  {/* 내용은 늘 그려 두고(forceMount) 고르지 않은 쪽은 즉시 감춘다 — 고른 쪽만 서서히 나타난다. */}
  <TabsPrimitive.Content
    value="leading-sme"
    forceMount
    className="motion-safe:data-[state=active]:animate-in motion-safe:data-[state=active]:fade-in-0 motion-safe:data-[state=active]:duration-500 transition-none data-[state=inactive]:hidden"
  >
    …
  </TabsPrimitive.Content>
</TabsPrimitive.Root>`

const PillTabsGuidePage = () => (
    <GuidePageShell
        title="알약 전환 탭 (PillTabs)"
        description="둥근 트랙 안에 항목 두세 개가 나란히 놓이고, 고른 항목만 진한 초록 면 · 흰 굵은 글자로 채워지는 전환 탭입니다."
    >
        <BaseCard>
            <section aria-labelledby="pill-tabs-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="pill-tabs-usage" className="typo-h4-bold">
                        기본 모양
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        스타일만 담은 theme 파일(theme/pill-tabs.variants.ts)을 Radix Tabs 원형에 얹어 씁니다. 실제 화면
                        —{' '}
                        <Link href="/corp/platform/carbon-neutrality" className={LINK_CLASS}>
                            플랫폼 소개 &gt; 탄소중립
                        </Link>
                        (고른 플랫폼에 따라 카드 · 기능 · 아래 묶음이 바뀜).
                    </p>
                </div>
                <PillTabsDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <ul className={LIST_CLASS}>
                    <li>
                        트랙 pill-tab-track(라이트 green.50 · 다크 gray.700 — 고른 면이 또렷하게) · 여백 4 · 반경
                        끝까지. 항목 높이 64 · 좌우 48 · 글 18(평소 Medium · 고르면 Bold).
                    </li>
                    <li>
                        고른 면은 pill-tab-active(mint.800) · 글자 pill-tab-active-foreground(흰색) — 다크에서도 같은
                        진한 초록이라 흰 글자 대비가 유지됩니다.
                    </li>
                    <li>모바일은 트랙이 화면 폭을 넘지 않도록 항목이 반씩 나눠 서고 글이 줄바꿈됩니다(좌우 16).</li>
                    <li>
                        탭 동작(role=&quot;tab&quot; · 좌우 화살표 키 · aria-selected · aria-controls)은 Radix Tabs 가
                        맡습니다[8.2.1]. 포커스는 포커스 링(outline-ring)으로 보입니다[6.1.2].
                    </li>
                    <li>
                        내용 전환 — 내용 칸은 늘 그려 두고(forceMount) 고르지 않은 쪽을 바로 감춥니다(hidden · 겹쳐 쌓은
                        카드는 invisible). 고른 쪽만 서서히 나타나 이전 내용과 겹쳐 보이지 않습니다. 등장의 duration-*
                        이 감춤을 늦추지 않도록 transition-none 을 함께 둡니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PillTabsGuidePage
