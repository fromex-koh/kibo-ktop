// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import VersionSelectPanelDemo from './version-select-panel-demo'

export const metadata: Metadata = {title: '버전 선택 본문 (VersionSelectPanel)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `'use client'

import {VersionSelectPanel} from '@/components/composite/version-select-panel'

const TERMS_VERSIONS = [
  {value: '2026-06-19', label: '현재 (2026-06-19)'},
  {value: '2025-11-01', label: '이전 (2025-11-01)'},
] as const

<VersionSelectPanel
  name="K-BIGx 이용약관"
  versions={TERMS_VERSIONS}
  renderContent={(version) => <TermsDocumentView document={TERMS_BY_VERSION[version]} />}
/>`

const PROPS_ITEMS = [
    [
        'VersionSelectPanel',
        'name',
        "문서 이름입니다(필수). 셀렉트 이름표가 '<name> 버전'이 되어 화면 낭독기가 그대로 읽습니다.",
        '-',
        'string',
    ],
    [
        'VersionSelectPanel',
        'versions',
        '버전 목록입니다(필수). 비어 있지 않은 배열이며 첫 항목(최신)이 처음 값입니다.',
        '-',
        'readonly [VersionOption, ...VersionOption[]]',
    ],
    [
        'VersionSelectPanel',
        'renderContent',
        '고른 버전의 value 를 받아 본문을 그립니다(필수). 함수라 이 컴포넌트를 쓰는 파일은 클라이언트 컴포넌트여야 합니다.',
        '-',
        '(version: string) => ReactNode',
    ],
    ['VersionOption', 'value', '버전 값입니다. renderContent 에 그대로 넘어갑니다.', '-', 'string'],
    ['VersionOption', 'label', '셀렉트에 보이는 글자입니다(예: 현재 (2026-06-19)).', '-', 'string'],
] as const

const VersionSelectPanelGuidePage = () => (
    <GuidePageShell
        title="버전 선택 본문 (VersionSelectPanel)"
        description="개정 이력이 있는 문서에서 버전 셀렉트로 고른 버전의 본문을 아래에 보여 줍니다."
    >
        <BaseCard>
            <section aria-labelledby="version-select-panel-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="version-select-panel-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>name</code> · <code>versions</code> · <code>renderContent</code> 를 넘깁니다. 지금은
                        이용약관과 개인정보 처리방침 화면이 탭 안에서 씁니다.
                    </p>
                </div>
                <VersionSelectPanelDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">구성 · 동작</h3>
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                위에 버전 셀렉트, 아래에 본문이 24px 간격으로 놓입니다. 셀렉트는 모바일에서 전체 폭,{' '}
                                <code>sm</code> 부터 240px 입니다.
                            </li>
                            <li>
                                셀렉트는{' '}
                                <Link href="/component-guide/select" className={LINK_CLASS}>
                                    Select
                                </Link>{' '}
                                그대로라 모양 · 키보드 동작이 같습니다.
                            </li>
                            <li>
                                고른 버전은 컴포넌트 안에서만 기억합니다. 주소(URL)에 남기지 않으므로 새로고침하면 최신
                                버전으로 돌아갑니다.
                            </li>
                            <li>
                                본문이 아직 없는 버전은 <code>renderContent</code> 에서 안내 문구를 그립니다(이용약관의
                                &quot;추후 업데이트&quot;).
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="version-select-panel-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="version-select-panel-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        보이는 이름표가 없어 셀렉트에 <code>aria-label</code> &quot;&lt;name&gt; 버전&quot;이
                        붙습니다[7.4.1]. <code>name</code> 은 탭 이름과 같은 문서 이름으로 씁니다.
                    </li>
                    <li>
                        버전을 골라도 화면을 옮기거나 제출하지 않고 아래 본문만 바뀝니다[7.2.1]. 셀렉트 다음이 바로
                        본문이라 읽는 순서도 같습니다[7.3.1].
                    </li>
                    <li>본문의 제목 계층은 renderContent 가 그리는 문서가 정합니다[6.4.2].</li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="version-select-panel-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="version-select-panel-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="VersionSelectPanel Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default VersionSelectPanelGuidePage
