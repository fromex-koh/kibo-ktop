'use client'

import {useState} from 'react'
import {FormCard} from '@/components/composite/form-card'
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'
import {TabCard, TabCardList, type TabCardStatus} from '@/components/composite/tab-card'
import {Button} from '@/components/ui/button'

// Figma "입력타겟" 데이터 — 섹션 제목 + 작성 상태.
const SECTIONS: {id: string; title: string; status: TabCardStatus}[] = [
    {id: 'corp', title: '기업정보', status: '작성중'},
    {id: 'ceo', title: '대표자 경력사항', status: '작성완료'},
    {id: 'etc', title: '기업 기타 정보', status: '미작성'},
    {id: 'tech', title: '핵심 기술 인력 현황', status: '미작성'},
    {id: 'perf', title: '기술 개발 실적', status: '미작성'},
]

// 탭 카드 데모 — 선택 상태를 관리하고, 아래 tabpanel 이 선택된 섹션에 연동된다.
const TabCardDemo = () => {
    const [active, setActive] = useState('corp')
    const current = SECTIONS.find((section) => section.id === active)
    return (
        <div className="flex flex-col gap-4">
            <TabCardList aria-label="입력 대상 섹션">
                {SECTIONS.map((section) => (
                    <TabCard
                        key={section.id}
                        id={`tabcard-${section.id}`}
                        title={section.title}
                        status={section.status}
                        active={active === section.id}
                        aria-controls="tabcard-panel"
                        onClick={() => setActive(section.id)}
                    />
                ))}
            </TabCardList>
            <div role="tabpanel" id="tabcard-panel" aria-labelledby={`tabcard-${active}`} className="w-full">
                <FormCard>
                    <div className="flex flex-col items-start gap-6">
                        <SectionHeader>
                            <SectionHeaderTitle>{current?.title}</SectionHeaderTitle>
                            <SectionHeaderDescription>
                                현재 선택된 탭의 입력 콘텐츠입니다. 상태: {current?.status}
                            </SectionHeaderDescription>
                        </SectionHeader>
                        {/* 탭 → 콘텐츠 키보드 진입 테스트용 포커스 대상 */}
                        <Button variant="secondary" size="small">
                            {current?.title} 저장
                        </Button>
                    </div>
                </FormCard>
            </div>
        </div>
    )
}

export default TabCardDemo
