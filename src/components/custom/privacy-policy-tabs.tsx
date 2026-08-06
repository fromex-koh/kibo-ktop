'use client'

import {TabsScrollArea} from '@/components/composite/tabs-scroll-area'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

// 개인정보 처리방침 — 시안 "[공통] 개인정보 처리방침"(40006812:26471)·"[공통] 알기 쉬운 개인정보 처리방침"
// (40006812:26580).
// 1뎁스는 글자만으로 갈리는 text 탭이고, 2뎁스(항목) 탭은 '알기 쉬운 개인정보 처리방침' 아래에만 있다 —
// 원문 처리방침은 항목을 나누지 않고 전문을 그대로 싣는 화면이기 때문이다.
// 탭 이동, roving tabindex, aria-controls는 Tabs 내부의 Radix 동작을 따른다.
// 현재 본문은 원문 연동 전 임시 내용이며, PlaceholderPanel을 실제 콘텐츠로 교체한다.

const FULL_VIEW = {value: 'full', label: '개인정보 처리방침'} as const
const EASY_VIEW = {value: 'easy', label: '알기 쉬운 개인정보 처리방침'} as const
const POLICY_VIEWS = [FULL_VIEW, EASY_VIEW] as const

// '알기 쉬운 개인정보 처리방침'에서만 쓰는 2뎁스 항목.
const POLICY_SECTIONS = [
    {value: 'collection', label: '개인정보 수집'},
    {value: 'usage', label: '개인정보 이용'},
    {value: 'provision', label: '개인정보 제공'},
    {value: 'disposal', label: '개인정보 파기'},
    {value: 'user-rights', label: '이용자 권리 보호'},
] as const

type PrivacyPolicyView = (typeof POLICY_VIEWS)[number]['value']

// 개인정보처리방침 원문 연동 전까지 표시하는 임시 패널.
// 아래 줄(보기 방식 · 항목)은 시안에 없지만, 다섯 항목의 본문이 모두 같은 문구라 탭이 실제로 바뀌었는지
// 확인할 수 없어 남겨 둔다. 원문을 넣을 때 패널째 교체된다.
const PlaceholderPanel = ({viewLabel, sectionLabel}: {viewLabel: string; sectionLabel?: string}) => (
    <div className="bg-background flex min-h-100 flex-col items-center justify-center gap-2 px-6">
        <h2 className="typo-title-l-bold text-center break-keep">내용 추후 업데이트</h2>
        <p className="typo-body-xl-regular text-foreground-subtle text-center break-keep">
            {sectionLabel ? `${viewLabel} · ${sectionLabel}` : viewLabel}
        </p>
    </div>
)

// 2뎁스 탭과 본문. 탭과 본문 사이는 시안 40 이다.
const PolicySectionTabs = () => (
    <Tabs defaultValue={POLICY_SECTIONS[0].value} className="gap-10">
        <TabsList variant="pill-outline" aria-label={`${EASY_VIEW.label} 항목`}>
            {POLICY_SECTIONS.map((section) => (
                <TabsTrigger key={section.value} value={section.value}>
                    {section.label}
                </TabsTrigger>
            ))}
        </TabsList>
        {POLICY_SECTIONS.map((section) => (
            <TabsContent key={section.value} value={section.value}>
                <PlaceholderPanel viewLabel={EASY_VIEW.label} sectionLabel={section.label} />
            </TabsContent>
        ))}
    </Tabs>
)

// 1뎁스 탭 아래 간격은 보기 방식마다 다르다(원문 40 · 알기 쉬운 24 — 뒤에 2뎁스 탭이 이어지므로 좁다).
// 그래서 Tabs 의 gap 이 아니라 각 패널이 자기 윗 간격을 갖는다.
const PrivacyPolicyTabs = ({defaultView = FULL_VIEW.value}: {defaultView?: PrivacyPolicyView}) => (
    <Tabs defaultValue={defaultView} className="gap-0">
        {/* 1뎁스 제목이 긴 모바일 화면은 TabsScrollArea로 가로 스크롤을 제공한다. */}
        <TabsScrollArea variant="text" aria-label="개인정보 처리방침 보기 방식">
            {POLICY_VIEWS.map((view) => (
                <TabsTrigger key={view.value} value={view.value}>
                    {view.label}
                </TabsTrigger>
            ))}
        </TabsScrollArea>
        <TabsContent value={FULL_VIEW.value} className="mt-10">
            <PlaceholderPanel viewLabel={FULL_VIEW.label} />
        </TabsContent>
        <TabsContent value={EASY_VIEW.value} className="mt-6">
            <PolicySectionTabs />
        </TabsContent>
    </Tabs>
)

export default PrivacyPolicyTabs
