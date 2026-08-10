'use client'

import {createContext, useContext, useEffect, useRef, type ReactNode} from 'react'
import {ChevronUp} from 'lucide-react'
import {CollapsibleTrigger} from '@/components/ui/collapsible'
import {SectionHeaderAction} from '@/components/composite/section-header'
import {formSectionCollapseTriggerClassName} from '@/components/theme/form-tabs.variants'

// 접히는 폼 섹션(FormTabs 의 태블릿 이하 펼침 목록) 안이라는 표시.
// 열린 섹션은 탭 행이 사라지고 폼 카드만 남으므로, 다시 접는 버튼은 카드 헤더에 있어야 한다.
// FormCard 는 화면마다 그대로 쓰이는 컴포넌트라 사용처 마크업을 바꾸지 않고 이 컨텍스트로 알린다.
// (Radix Collapsible 의 Trigger 는 자기 id 를 만들지 않아, 접힌 행과 이 버튼이 한 섹션의 트리거 두 개로
//  공존해도 id 가 겹치지 않는다 — Accordion 은 트리거마다 같은 id 를 붙여 쓸 수 없다[8.1.1].)
type FormSectionCollapseState = {
    isCollapsible: boolean
    // 방금 사용자가 이 섹션을 펼쳐서 탭 행이 사라졌는지 — 그렇다면 접기 버튼이 포커스를 이어받는다[6.1.2].
    // 한 번만 참을 돌려주므로 다시 그려질 때 포커스를 빼앗지 않는다.
    consumeFocus: () => boolean
}

const FormSectionCollapseContext = createContext<FormSectionCollapseState>({
    isCollapsible: false,
    consumeFocus: () => false,
})

const FormSectionCollapseProvider = ({
    collapsible = true,
    consumeFocus,
    children,
}: {
    // 접기 버튼이 필요한 형태인지 — 모바일은 고정 헤더로 섹션을 바꾸므로 접기 버튼을 두지 않는다.
    collapsible?: boolean
    consumeFocus: () => boolean
    children: ReactNode
}) => (
    <FormSectionCollapseContext.Provider value={{isCollapsible: collapsible, consumeFocus}}>
        {children}
    </FormSectionCollapseContext.Provider>
)

// 카드 헤더의 액션 자리 — 접기 버튼이 필요 없고 액션도 없으면 아무것도 만들지 않는다
// (SectionHeader 가 has-data-[slot=section-header-action] 로 2열 여부를 정하기 때문).
const FormSectionHeaderAction = ({children, label}: {children?: ReactNode; label?: string}) => {
    const {isCollapsible, consumeFocus} = useContext(FormSectionCollapseContext)
    const triggerRef = useRef<HTMLButtonElement>(null)

    // 펼치는 순간 눌렀던 탭 행이 사라지므로, 그 자리를 대신하는 이 버튼으로 포커스를 넘겨받는다.
    // 처음부터 펼쳐져 있던 섹션에서는 consumeFocus 가 거짓이라 포커스를 빼앗지 않는다.
    useEffect(() => {
        if (consumeFocus()) triggerRef.current?.focus()
    })

    if (!isCollapsible && !children) return null

    return (
        <SectionHeaderAction className="flex items-center gap-4">
            {children}
            {isCollapsible ? (
                <CollapsibleTrigger ref={triggerRef} className={formSectionCollapseTriggerClassName}>
                    <ChevronUp aria-hidden="true" className="size-icon-lg" />
                    <span className="sr-only">{label ? `${label} 접기` : '섹션 접기'}</span>
                </CollapsibleTrigger>
            ) : null}
        </SectionHeaderAction>
    )
}

export {FormSectionCollapseProvider, FormSectionHeaderAction}
