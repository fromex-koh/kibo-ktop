'use client'

import {useState, type ReactNode} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'

// 버전 셀렉트 + 본문 — 셀렉트에서 고른 버전의 본문이 아래에 보인다(개정 이력이 있는 문서).
// 쓰는 곳: 이용약관(terms-tabs.tsx) · 개인정보 처리방침(privacy-policy-tabs.tsx).
// 버전 목록은 비어 있지 않은 배열이라 첫 항목(최신)이 처음 값이다.

type VersionOption = {value: string; label: string}

type VersionSelectPanelProps = {
    /** 셀렉트의 이름표에 쓰는 문서 이름(예: K-BIGx 이용약관). 화면 낭독기가 '<이름> 버전'으로 읽는다. */
    name: string
    versions: readonly [VersionOption, ...VersionOption[]]
    /** 고른 버전의 본문. */
    renderContent: (version: string) => ReactNode
}

const VersionSelectPanel = ({name, versions, renderContent}: VersionSelectPanelProps) => {
    const [version, setVersion] = useState(versions[0].value)

    return (
        <div className="flex flex-col gap-6">
            <Select value={version} onValueChange={setVersion}>
                <SelectTrigger aria-label={`${name} 버전`} className="w-full sm:w-60">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {versions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {renderContent(version)}
        </div>
    )
}

export {VersionSelectPanel}
export type {VersionOption, VersionSelectPanelProps}
