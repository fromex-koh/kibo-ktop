// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ProcedureSteps} from '@/components/custom/procedure-steps'
import PropsTable from '@/components/custom/props-table'
import {PLATFORM_PATENT_EVALUATION} from '@/content/service/platform-patent-evaluation'

export const metadata: Metadata = {title: '절차 단계 (ProcedureSteps)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

const THREE_STEPS = [
    {title: '신청', description: '평가에 필요한 정보를 입력합니다.'},
    {title: '평가', description: '입력한 정보로 등급을 산출합니다.'},
    {title: '확인', description: '결과 보고서를 확인합니다.'},
] as const

const USAGE_CODE = `import {ProcedureSteps} from '@/components/custom/procedure-steps'

<section aria-labelledby="procedure" className="flex flex-col gap-12">
  <h2 id="procedure" className="typo-lead-title-bold text-foreground">평가절차 안내</h2>
  <ProcedureSteps
    steps={[
      {title: '등급평가검색', description: '특허출원번호 또는 특허등록번호를 입력 후 …'},
      {title: '결과확인', description: '조회한 특허등급의 기본정보를 확인합니다.'},
      …
    ]}
  />
</section>`

const PROPS_ITEMS = [
    [
        'ProcedureSteps',
        'steps',
        '단계 목록(필수) — 이름(title) · 설명(description). 단계 수만큼 같은 폭으로 나눠 섭니다.',
        '-',
        'readonly {title; description}[]',
    ],
    [
        'ProcedureSteps',
        'stepHeadingLevel',
        '단계 이름의 제목 단계. 절차 제목(h2) 아래면 h3, 그보다 깊으면 h4.',
        "'h3'",
        "'h3' | 'h4'",
    ],
] as const

const ProcedureStepsGuidePage = () => (
    <GuidePageShell
        title="절차 단계 (ProcedureSteps)"
        description="둥근 번호 · 이름 · 설명으로 된 단계를 가로로 늘어놓고 번호 사이를 화살표로 잇습니다. 화면에 들어오면 단계가 왼쪽에서 차례로 밀려옵니다."
    >
        <BaseCard>
            <section aria-labelledby="procedure-steps-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="procedure-steps-usage" className="typo-h4-bold">
                        기본 모양
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        실제 화면 —{' '}
                        <Link href="/corp/platform/patent-evaluation" className={LINK_CLASS}>
                            플랫폼 소개 &gt; 특허평가
                        </Link>
                        (평가절차 안내 4단계) · K-BIGx 보고서(4단계) · 탄소중립 선도중소기업확인(5단계). 단계 수가
                        바뀌어도 같은 폭으로 나눠 섭니다(아래 3단계 예).
                    </p>
                </div>
                <div className="flex flex-col gap-12">
                    <ProcedureSteps steps={PLATFORM_PATENT_EVALUATION.procedure.steps} />
                    <ProcedureSteps steps={THREE_STEPS} />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="procedure-steps-spec" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="procedure-steps-spec" className="typo-h4-bold">
                        규격 · 모션
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>
                        단계 사이 24 · 둥근 번호 60(반경 20 · procedure-step-number 면 — 라이트 gray.500 · 다크 gray.200
                        · 32 Bold) · 이름 24 Bold · 설명 16 Medium(gray.500).
                    </li>
                    <li>
                        번호와 이름 16 · 이름과 설명 8. 번호 사이 화살표(96 · platform-connector, 선은 50%)는 단계 사이
                        간격 가운데에 놓입니다.
                    </li>
                    <li>모바일은 단계를 세로로 쌓고(사이 40) 화살표를 감춥니다.</li>
                    <li>
                        화면에 들어오면 단계가 왼쪽에서 밀려오며 0.12초 간격으로 나타납니다(0.45초 · 화살표는 단계에
                        붙어 함께 옴). 나타나는 시점은{' '}
                        <Link href="/component-guide/motion" className={LINK_CLASS}>
                            ScrollReveal(hasRise=false)
                        </Link>
                        이 정합니다. 동작 줄이기면 처음부터 제자리입니다[6.3.1].
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="procedure-steps-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="procedure-steps-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>순서 목록(ol)이라 단계 수와 순서가 화면 낭독기에 그대로 전해집니다[7.3.1].</li>
                    <li>화면의 숫자 · 화살표는 꾸밈이라 읽지 않습니다(aria-hidden) — 목록이 순서를 이미 알립니다.</li>
                    <li>단계 이름은 제목(h3 · h4)이라 제목 목록으로 단계를 건너다닐 수 있습니다[6.4.2].</li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="procedure-steps-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="procedure-steps-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ProcedureSteps Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ProcedureStepsGuidePage
