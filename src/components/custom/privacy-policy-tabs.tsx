'use client'

import {TabsScrollArea} from '@/components/composite/tabs-scroll-area'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

// 시안([공통] 개인정보 처리방침)의 탭 안 탭 구조.
// 1뎁스는 밑줄 탭(variant="line"), 그 안의 2뎁스는 알약 탭(variant="pill")이며 둘 다 shadcn Tabs 를 쓴다 —
// 키보드 이동·roving tabindex·aria-controls 는 Radix 가 담당한다[SC-03].
// 본문은 약관 원문 확정 전까지 자리만 잡아 둔 상태다.

// 2뎁스 항목 — 두 1뎁스 탭이 같은 구성을 공유한다.
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

// 모든 패널이 같은 문구라 탭을 눌러도 바뀐 게 없어 보인다. 원문이 들어오기 전까지는 선택된 조합을
// 함께 적어 두 계층이 각각 동작하는지 화면에서 바로 확인할 수 있게 한다(원문 반영 시 이 줄은 삭제).
const PlaceholderPanel = ({viewLabel, sectionLabel}: {viewLabel: string; sectionLabel: string}) => (
    <div className="bg-background flex min-h-100 flex-col items-center justify-center gap-2 px-6">
        <h2 className="typo-title-l-bold text-center break-keep">내용 추후 업데이트</h2>
        <p className="typo-body-xl-regular text-foreground-subtle text-center break-keep">
            {viewLabel} · {sectionLabel}
        </p>
    </div>
)

// 2뎁스 알약 탭 + 본문. 1뎁스 탭마다 같은 구성을 쓰므로 value 접두사로 탭 id 를 분리한다.
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
        {/* 1뎁스는 제목이 길어 좁은 화면에서 가로로 넘친다 — TabsList 대신 좌우 스크롤 래퍼를 쓴다. */}
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
