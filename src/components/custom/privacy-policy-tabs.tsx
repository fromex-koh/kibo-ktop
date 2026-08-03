'use client'

import {TabsScrollArea} from '@/components/composite/tabs-scroll-area'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

// 개인정보 처리방침의 1뎁스·2뎁스 탭을 중첩 Tabs로 구성한다.
// 탭 이동, roving tabindex, aria-controls는 Tabs 내부의 Radix 동작을 따른다.
// 현재 본문은 원문 연동 전 임시 내용이며, PlaceholderPanel을 실제 콘텐츠로 교체한다.

// 두 1뎁스 탭에서 공통으로 사용하는 2뎁스 항목.
const POLICY_SECTIONS = [
    {value: 'collection', label: '개인정보 수집'},
    {value: 'usage', label: '개인정보 이용'},
    {value: 'provision', label: '개인정보 제공'},
    {value: 'disposal', label: '개인정보 파기'},
    {value: 'user-rights', label: '이용자 권리 보호'},
] as const

const POLICY_VIEWS = [
    {value: 'full', label: '개인정보 처리방침'},
    {value: 'easy', label: '알기 쉬운 개인정보 처리방침'},
] as const

// 개인정보처리방침 원문 연동 전까지 표시하는 임시 패널.
const PlaceholderPanel = ({viewLabel, sectionLabel}: {viewLabel: string; sectionLabel: string}) => (
    <div className="bg-background flex min-h-100 flex-col items-center justify-center gap-2 px-6">
        <h2 className="typo-title-l-bold text-center break-keep">내용 추후 업데이트</h2>
        <p className="typo-body-xl-regular text-foreground-subtle text-center break-keep">
            {viewLabel} · {sectionLabel}
        </p>
    </div>
)

// 2뎁스 탭과 본문. 1뎁스별 탭 id가 겹치지 않도록 value에 1뎁스 값을 접두사로 사용한다.
const PolicySectionTabs = ({viewValue, viewLabel}: {viewValue: string; viewLabel: string}) => (
    <Tabs defaultValue={`${viewValue}-${POLICY_SECTIONS[0].value}`} className="gap-6">
        <TabsList variant="pill" aria-label={`${viewLabel} 항목`}>
            {POLICY_SECTIONS.map((section) => (
                <TabsTrigger key={section.value} value={`${viewValue}-${section.value}`}>
                    {section.label}
                </TabsTrigger>
            ))}
        </TabsList>
        {POLICY_SECTIONS.map((section) => (
            <TabsContent key={section.value} value={`${viewValue}-${section.value}`}>
                <PlaceholderPanel viewLabel={viewLabel} sectionLabel={section.label} />
            </TabsContent>
        ))}
    </Tabs>
)

const PrivacyPolicyTabs = () => (
    <Tabs defaultValue={POLICY_VIEWS[0].value} className="gap-6">
        {/* 1뎁스 제목이 긴 모바일 화면은 TabsScrollArea로 가로 스크롤을 제공한다. */}
        <TabsScrollArea aria-label="개인정보 처리방침 보기 방식">
            {POLICY_VIEWS.map((view) => (
                <TabsTrigger key={view.value} value={view.value}>
                    {view.label}
                </TabsTrigger>
            ))}
        </TabsScrollArea>
        {POLICY_VIEWS.map((view) => (
            <TabsContent key={view.value} value={view.value}>
                <PolicySectionTabs viewValue={view.value} viewLabel={view.label} />
            </TabsContent>
        ))}
    </Tabs>
)

export default PrivacyPolicyTabs
