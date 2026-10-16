'use client'

import type {ReactNode} from 'react'
import {usePathname} from 'next/navigation'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

// 기관 K-BIGx 보고서의 [기업혁신성장] [대량정보조회] 탭 — 켜진 탭은 주소가 정한다.
// 탭마다 주소가 있어(헤더 메뉴 · 퍼블리싱 인덱스) 그 주소로 들어오면 그 탭이 켜지고, 탭을 누르면 주소도 그 탭 주소로 바뀐다.
// 주소만 바꾸고(history.pushState — Next 가 usePathname 과 맞춰 준다) 화면은 다시 불러오지 않는다 — 포커스가 탭에 남는다.
// 뒤로 가기 · 헤더 메뉴로 주소가 바뀌어도 같은 규칙으로 탭이 따라 켜진다.
// 키보드 화살표로는 포커스만 옮기고 Enter · Space 로 고른다(activationMode="manual") — 포커스만으로 주소가 바뀌지 않게[7.2.1].

const ORG_KBIGX_REPORT_TABS = [
    {value: 'innovation-growth', label: '기업혁신성장', path: '/org/k-bigx-report/innovation-growth-report'},
    {value: 'bulk-data-search', label: '대량정보조회', path: '/org/k-bigx-report/bulk-data-search'},
] as const

type OrgKbigxReportTab = (typeof ORG_KBIGX_REPORT_TABS)[number]['value']

// 하위 주소(search-result/… · complete · failure)도 그 탭에 속한다.
const getTabFromPath = (pathname: string): OrgKbigxReportTab =>
    ORG_KBIGX_REPORT_TABS.find((tab) => pathname.startsWith(tab.path))?.value ?? ORG_KBIGX_REPORT_TABS[0].value

type OrgKbigxReportTabsProps = {
    innovationPanel: ReactNode
    bulkPanel: ReactNode
}

const OrgKbigxReportTabs = ({innovationPanel, bulkPanel}: OrgKbigxReportTabsProps) => {
    const pathname = usePathname()
    const activeTab = getTabFromPath(pathname)

    const handleTabChange = (value: string) => {
        const nextTab = ORG_KBIGX_REPORT_TABS.find((tab) => tab.value === value)
        if (!nextTab || nextTab.value === activeTab) return
        window.history.pushState(null, '', nextTab.path)
    }

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} activationMode="manual" className="gap-10">
            {/* 회색 화면 바탕 위라 비선택도 흰 면이 보이는 pill-outline(2뎁스 알약 탭)을 쓴다. */}
            <TabsList variant="pill-outline" aria-label="K-BIGx 보고서 구분">
                {ORG_KBIGX_REPORT_TABS.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            <TabsContent value="innovation-growth">{innovationPanel}</TabsContent>
            {/* 대량정보조회 본문은 카드와 버튼 두 덩어리라 같은 40 간격으로 쌓는다. */}
            <TabsContent value="bulk-data-search" className="flex flex-col gap-y-10">
                {bulkPanel}
            </TabsContent>
        </Tabs>
    )
}

export {OrgKbigxReportTabs}
export type {OrgKbigxReportTab}
