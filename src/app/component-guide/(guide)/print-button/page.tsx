// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {PrintButton} from '@/components/composite/print-button'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '인쇄 버튼 (PrintButton)'}

const SECTION_HEADER = 'flex max-w-4xl flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {PrintButton} from '@/components/composite/print-button'

<PrintButton />`

const PROPS_ITEMS = [['PrintButton', 'className', '버튼에 덧붙일 클래스입니다.', '-', 'string']] as const

const PrintButtonGuidePage = () => (
    <GuidePageShell
        title="인쇄 버튼 (PrintButton)"
        description="보고 있는 문서를 그대로 인쇄하는 버튼입니다. 새 창으로 여는 평가결과 리포트의 머리에 둡니다."
    >
        <BaseCard>
            <section aria-labelledby="print-button-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="print-button-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        props 없이 그대로 둡니다. 문서를 새 창으로 여는 링크는{' '}
                        <Link href="/component-guide/new-window-link" className={LINK_CLASS}>
                            NewWindowLink
                        </Link>{' '}
                        를 씁니다.
                    </p>
                </div>
                <div className="flex">
                    <PrintButton />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">동작</h3>
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                누르면 브라우저 인쇄 대화상자가 열립니다. <code>Button</code> tertiary · xs 입니다.
                            </li>
                            <li>
                                인쇄물에서는 버튼이 나오지 않습니다(<code>print:hidden</code>).
                            </li>
                            <li>인쇄하는 동안 차트 크기를 고정해 쪽 나눔이 바뀌지 않게 하고, 끝나면 되돌립니다.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="print-button-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="print-button-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        보이는 글자 &quot;인쇄&quot;가 버튼 이름이고 아이콘은 <code>aria-hidden</code> 입니다[5.1.1].
                    </li>
                    <li>
                        <code>button</code> 이라 Enter · Space 로 조작하고 포커스가 외곽선으로 표시됩니다[6.1.1][6.1.2].
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="print-button-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="print-button-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="PrintButton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default PrintButtonGuidePage
