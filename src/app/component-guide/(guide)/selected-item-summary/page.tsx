// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {SelectedItemSummary} from '@/components/composite/selected-item-summary'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '선택 항목 요약 (SelectedItemSummary)'}

const USAGE_CODE = `import {SelectedItemSummary} from '@/components/composite/selected-item-summary'

const companyNumber = getInnovationGrowthCompanyNumber(company) // {label: '법인번호', value: '110111-*******'}

<SelectedItemSummary
  label="선택한 기업"
  title="프롬엑스테크"
  // 번호는 가린 값을 넣는다(법인번호 끝 7자리 · 사업자번호 끝 4자리 — src/lib/mask.ts)
  meta={\`\${companyNumber.label} \${companyNumber.value} · 특허수 23건\`}
  action={<Button type="button" variant="tertiary" size="sm">기업 목록 보기</Button>}
/>`

const PROPS_ITEMS = [
    ['SelectedItemSummary', 'label', '무엇을 골랐는지입니다(필수). 구역의 이름으로도 읽힙니다.', '-', 'string'],
    ['SelectedItemSummary', 'title', '고른 항목 이름입니다(필수).', '-', 'ReactNode'],
    ['SelectedItemSummary', 'meta', '이름 아래 부가 정보 한 줄입니다.', '-', 'ReactNode'],
    ['SelectedItemSummary', 'action', '오른쪽 동작입니다.', '-', 'ReactNode'],
    [
        'SelectedItemSummary',
        'ref · className · section 속성',
        'section 에 그대로 전달합니다.',
        '-',
        'ComponentProps<section>',
    ],
] as const

const SelectedItemSummaryGuidePage = () => (
    <GuidePageShell
        title="선택 항목 요약 (SelectedItemSummary)"
        description="목록에서 고른 항목을 다음 단계 위에 한 번 더 보여 주는 띠입니다."
    >
        <BaseCard>
            <section aria-labelledby="sis-usage" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="sis-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        좁은 화면(md 미만)에서는 내용과 동작이 위아래로 쌓입니다.
                    </p>
                    <p className="typo-body-l-regular text-label-foreground">
                        meta 의 기업 번호는 가린 값입니다 — 법인기업은 법인번호 끝 7자리, 개인기업은 사업자번호 끝
                        4자리를 * 로 바꿉니다(K-BIGx 기업혁신성장 조회의 getInnovationGrowthCompanyNumber).
                    </p>
                </div>
                <SelectedItemSummary
                    label="선택한 기업"
                    title="프롬엑스테크"
                    meta="법인번호 110111-******* · 특허수 23건"
                    action={
                        <Button type="button" variant="tertiary" size="sm">
                            기업 목록 보기
                        </Button>
                    }
                />
                <SelectedItemSummary
                    label="선택한 기업"
                    title="한결정밀테크"
                    meta="사업자번호 214-07-3**** · 특허수 0건"
                    action={
                        <Button type="button" variant="tertiary" size="sm">
                            기업 목록 보기
                        </Button>
                    }
                />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sis-a11y" className="flex flex-col gap-6">
                <h2 id="sis-a11y" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>구역 이름은 label 입니다(section · aria-label)[8.2.1].</li>
                    <li>고른 상태는 면 색뿐 아니라 체크 아이콘과 글자로 전합니다[5.3.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sis-props" className="flex flex-col gap-6">
                <h2 id="sis-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="SelectedItemSummary Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SelectedItemSummaryGuidePage
