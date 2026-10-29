'use client'

import {VersionSelectPanel} from '@/components/composite/version-select-panel'

// 데모 버전 — 실제 화면은 content/service/terms.ts · privacy-policy.ts 의 버전 목록을 넘긴다.
const DEMO_VERSIONS = [
    {value: '2026-06-19', label: '현재 (2026-06-19)'},
    {value: '2025-11-01', label: '이전 (2025-11-01)'},
    {value: '2025-03-02', label: '이전 (2025-03-02)'},
] as const

const DEMO_DOCUMENT_NAME = '서비스 이용약관'

// renderContent 는 함수라 서버 컴포넌트(가이드 page.tsx)에서 넘길 수 없어 이 클라이언트 파일에 둔다.
const VersionSelectPanelDemo = () => (
    <VersionSelectPanel
        name={DEMO_DOCUMENT_NAME}
        versions={DEMO_VERSIONS}
        renderContent={(version) => (
            <article className="border-subtle-3 bg-card flex flex-col gap-2 rounded-lg border p-6">
                <h3 className="typo-title-m-bold text-foreground">
                    {DEMO_DOCUMENT_NAME} ({version} 시행)
                </h3>
                <p className="typo-body-l-regular text-label-foreground">
                    셀렉트에서 고른 버전의 본문이 이 자리에 보입니다. 버전을 바꾸면 본문만 바뀌고 셀렉트는 그대로
                    있습니다.
                </p>
            </article>
        )}
    />
)

export default VersionSelectPanelDemo
