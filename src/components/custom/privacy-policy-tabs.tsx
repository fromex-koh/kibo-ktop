'use client'

import {TabsScrollArea} from '@/components/composite/tabs-scroll-area'
import {VersionSelectPanel} from '@/components/composite/version-select-panel'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {
    EASY_PRIVACY_POLICY_SECTIONS,
    PRIVACY_POLICY_BY_VERSION,
    PRIVACY_POLICY_PLACEHOLDER,
    PRIVACY_POLICY_VERSIONS,
    type PrivacyPolicyText,
} from '@/content/service/privacy-policy'

// 개인정보 처리방침 — 이용약관(terms-tabs.tsx)과 같은 짜임이다.
// · 개인정보 처리방침 탭: 버전 셀렉트 → 고른 버전의 본문(VersionSelectPanel).
// · 알기 쉬운 개인정보 처리방침 탭: 항목 탭(수집 · 이용 · 제공 · 파기 · 이용자 권리 보호) → 항목마다 버전 셀렉트 → 본문.
// 데이터(버전 · 본문)는 content/service/privacy-policy.ts. 탭 이동 · roving tabindex · aria-controls 는 Radix Tabs 동작을 따른다.

const FULL_VIEW = {value: 'full', label: '개인정보 처리방침'} as const
const EASY_VIEW = {value: 'easy', label: '알기 쉬운 개인정보 처리방침'} as const
const POLICY_VIEWS = [FULL_VIEW, EASY_VIEW] as const

type PrivacyPolicyView = (typeof POLICY_VIEWS)[number]['value']

// 본문 — 문단마다 한 줄씩 띄운 글자만 보인다(이용약관 본문과 같은 글자 모양). 본문이 없으면 '추후 업데이트' 한 줄.
// 문서 제목은 화면에 보이지 않게 두고 탭 패널의 제목으로 스크린리더에 남긴다[6.4.2].
const PolicyText = ({title, paragraphs}: {title: string; paragraphs?: PrivacyPolicyText}) => (
    <article className="text-label-foreground typo-body-xl-regular flex flex-col gap-4 break-keep">
        <h2 className="sr-only">{title}</h2>
        {/* 같은 글의 문단이 있어도 key 가 겹치지 않게 순서를 붙인다(문단 순서는 바뀌지 않는다). */}
        {(paragraphs ?? [PRIVACY_POLICY_PLACEHOLDER]).map((paragraph, index) => (
            <p key={`${index}-${paragraph}`}>{paragraph}</p>
        ))}
    </article>
)

const FullPolicyPanel = () => (
    <VersionSelectPanel
        name={FULL_VIEW.label}
        versions={PRIVACY_POLICY_VERSIONS}
        renderContent={(version) => (
            <PolicyText title={FULL_VIEW.label} paragraphs={PRIVACY_POLICY_BY_VERSION[version]} />
        )}
    />
)

// 알기 쉬운 처리방침 — 항목 탭 → 그 항목의 버전 셀렉트 → 본문. 셀렉트는 항목마다 따로라, 항목별로 날짜마다 내용을 본다.
// 항목 탭과 셀렉트 사이는 40 이다. versions 가 빈 항목은 셀렉트 없이 '추후 업데이트'만 보인다.
const EasyPolicyPanel = () => (
    <Tabs defaultValue={EASY_PRIVACY_POLICY_SECTIONS[0]?.value} className="gap-10">
        <TabsList variant="pill-outline" aria-label={`${EASY_VIEW.label} 항목`}>
            {EASY_PRIVACY_POLICY_SECTIONS.map((section) => (
                <TabsTrigger key={section.value} value={section.value}>
                    {section.label}
                </TabsTrigger>
            ))}
        </TabsList>
        {EASY_PRIVACY_POLICY_SECTIONS.map(({value, label, versions, byVersion}) => {
            const title = `${EASY_VIEW.label} · ${label}`
            const [latest, ...older] = versions

            return (
                <TabsContent key={value} value={value}>
                    {latest ? (
                        <VersionSelectPanel
                            name={title}
                            versions={[latest, ...older]}
                            renderContent={(version) => <PolicyText title={title} paragraphs={byVersion[version]} />}
                        />
                    ) : (
                        <PolicyText title={title} />
                    )}
                </TabsContent>
            )
        })}
    </Tabs>
)

// 처음 열 탭(defaultView)은 페이지가 넘긴다 — 알기 쉬운 처리방침 화면(easy-privacy-policy)은 'easy'.
const PrivacyPolicyTabs = ({defaultView = FULL_VIEW.value}: {defaultView?: PrivacyPolicyView}) => (
    // 1뎁스 탭 아래 간격 — 원문 40 · 알기 쉬운 24(항목 탭이 이어져 좁다). 그래서 Tabs 의 gap 이 아니라 패널이 윗 간격을 갖는다.
    <Tabs defaultValue={defaultView} className="gap-0">
        {/* 1뎁스 제목이 긴 모바일 화면은 TabsScrollArea로 가로 스크롤을 제공한다. */}
        <TabsScrollArea variant="underline" aria-label="개인정보 처리방침 보기 방식">
            {POLICY_VIEWS.map((view) => (
                <TabsTrigger key={view.value} value={view.value}>
                    {view.label}
                </TabsTrigger>
            ))}
        </TabsScrollArea>
        <TabsContent value={FULL_VIEW.value} className="mt-10">
            <FullPolicyPanel />
        </TabsContent>
        <TabsContent value={EASY_VIEW.value} className="mt-6">
            <EasyPolicyPanel />
        </TabsContent>
    </Tabs>
)

export default PrivacyPolicyTabs
