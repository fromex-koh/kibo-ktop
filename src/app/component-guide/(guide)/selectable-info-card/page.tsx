import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {ListMarker} from '@/components/custom/list-marker'
import PropsTable from '@/components/custom/props-table'
import {SelectableInfoCardDemo} from './selectable-info-card-demo'

export const metadata: Metadata = {title: '선택 정보 카드 (SelectableInfoCard)'}

const USAGE_CODE = `const [companyId, setCompanyId] = useState('')
const [patents, setPatents] = useState(null)

// 기업을 고르면 그 기업의 특허를 불러온다 — 카드(UI)는 그대로, 조회 함수만 API 로 바꾼다.
const handleCompanyChange = async (id) => {
  setCompanyId(id)
  setPatents(null) // 그동안 LoadingState
  setPatents(await getInnovationGrowthPatents(id)) // 빈 배열이면 EmptyState
}

<SelectableInfoCardGroup value={companyId} onValueChange={handleCompanyChange} aria-labelledby="company-list-title">
  {companies.map((company) => (
    <SelectableInfoCard
      key={company.id}
      value={company.id}
      fields={[
        {label: '기업명', value: company.name},
        {label: '법인번호', value: company.corporateNumber},
        {label: '특허수', value: \`\${company.patentCount}건\`},
      ]}
    />
  ))}
</SelectableInfoCardGroup>`

const RULES = [
    '카드 — 흰 면 · 테두리 1(border-subtle-3) · 반경 12 · 여백 24, 줄 사이 12. 마우스를 올리거나(hover) 고르면 테두리가 primary 로 바뀝니다(라디오 카드 — 동그라미 표시 없음).',
    '줄 — 왼쪽 항목 이름(16 Regular · foreground-subtle), 오른쪽 값(16 Medium · label-foreground). 이름은 줄바꿈하지 않고, 값은 오른쪽 정렬로 낱말(띄어쓰기 · 하이픈) 단위로 줄바꿈합니다. 띄어쓰기 없이 긴 값(긴 기업명 · 코드)은 넘치는 자리에서 끊겨 카드 밖으로 나가지 않습니다.',
    '배치 — 모바일 1열, md 이상 2열, 카드 사이 24.',
    '하나만 고르는 목록입니다. 여러 개를 고르려면 SelectableCard(checkbox)를 씁니다.',
    '이어지는 목록 — 기업혁신성장처럼 카드를 고르면 다음 목록(특허)을 불러오는 화면은 onValueChange 에서 조회 함수를 부르고, 기다리는 동안 그 자리에 LoadingState, 결과가 없으면 EmptyState(흰 면 · 반경 16 · min-h-52)를 둡니다. 카드 컴포넌트는 그대로 두고 데이터만 바꿉니다.',
] as const

const A11Y_RULES = [
    '그룹은 Radix RadioGroup 입니다 — 카드는 라디오 하나이고, 방향키로 카드 사이를 옮기며 Space 로 고릅니다[6.1.1][8.2.1].',
    '카드 안 글 전체가 라디오의 이름으로 읽힙니다. 그룹에는 목록 제목을 aria-labelledby 로 잇습니다[7.4.1].',
    '포커스는 카드 바깥 2px 링으로 보입니다[6.1.2]. 선택은 테두리 색뿐 아니라 라디오 상태(aria-checked)로도 전달됩니다[5.3.1].',
] as const

const PROPS_ITEMS = [
    ['SelectableInfoCardGroup', 'value · defaultValue', '고른 카드의 value 입니다.', '-', 'string'],
    ['SelectableInfoCardGroup', 'onValueChange', '카드를 골랐을 때입니다.', '-', '(value) => void'],
    ['SelectableInfoCardGroup', 'className', '그리드 배치를 확장합니다.', '-', 'string'],
    ['SelectableInfoCard', 'value', '카드의 값입니다.', '-', 'string'],
    ['SelectableInfoCard', 'fields', '카드의 줄 — 항목 이름과 값입니다.', '-', 'readonly {label; value}[]'],
    ['SelectableInfoCard', 'disabled', '고를 수 없게 합니다.', 'false', 'boolean'],
] as const

const RuleList = ({rules}: {rules: readonly string[]}) => (
    <ul className="typo-body-l-regular text-muted-foreground flex flex-col gap-1">
        {rules.map((rule) => (
            <li key={rule} className="flex">
                <ListMarker type="unordered" />
                <span className="min-w-0">{rule}</span>
            </li>
        ))}
    </ul>
)

const SelectableInfoCardGuidePage = () => (
    <GuidePageShell
        title="선택 정보 카드 (SelectableInfoCard)"
        description="항목 이름 · 값 몇 줄로 된 카드 중 하나를 고르는 목록입니다. K-BIGx 기업혁신성장의 검색된 기업 목록 · 특허 목록이 이 형태입니다."
    >
        <BaseCard>
            <section aria-labelledby="sic-usage" className="flex flex-col gap-4">
                <h2 id="sic-usage" className="typo-h4-bold">
                    사용 예시
                </h2>
                <SelectableInfoCardDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sic-rules" className="flex flex-col gap-4">
                <h2 id="sic-rules" className="typo-h4-bold">
                    스타일 · 상태
                </h2>
                <RuleList rules={RULES} />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sic-a11y" className="flex flex-col gap-4">
                <h2 id="sic-a11y" className="typo-h4-bold">
                    접근성 (Accessibility)
                </h2>
                <RuleList rules={A11Y_RULES} />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="sic-props" className="flex flex-col gap-4">
                <h2 id="sic-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="SelectableInfoCard 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SelectableInfoCardGuidePage
