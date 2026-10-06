// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {SelectableInfoCardDemo} from './selectable-info-card-demo'

export const metadata: Metadata = {title: '선택 정보 카드 (SelectableInfoCard)'}

const USAGE_CODE = `import {SelectableInfoCard, SelectableInfoCardGroup} from '@/components/composite/selectable-info-card'

const [companyId, setCompanyId] = useState('')
const [patents, setPatents] = useState(null)

// 기업을 고르면 그 기업의 특허를 불러온다.
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

const CHOICE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'select', header: '선택 개수', align: 'start'},
    {key: 'use', header: '쓰는 곳', align: 'start', wrap: true},
] as const

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const CHOICE_ROWS = [
    {
        key: 'info',
        cells: [
            <code key="component">SelectableInfoCard</code>,
            '하나만',
            '항목 이름 · 값 여러 줄로 된 정보 카드 목록(검색된 기업 · 특허). 컨트롤 표시가 없습니다.',
        ],
    },
    {
        key: 'card',
        cells: [
            <Link key="component" href="/component-guide/selectable-card" className={LINK_CLASS}>
                SelectableCard
            </Link>,
            '하나 또는 여러 개',
            '한 줄 라벨에 라디오 · 체크박스 표시가 있는 선택 카드',
        ],
    },
    {
        key: 'radio-card',
        cells: [
            <span key="component">
                <Link href="/component-guide/radio-card" className={LINK_CLASS}>
                    RadioCard
                </Link>
                {' · '}
                <Link href="/component-guide/option-card" className={LINK_CLASS}>
                    OptionCard
                </Link>
            </span>,
            '하나만',
            '일러스트 · 부가 정보가 있는 큰 선택지',
        ],
    },
    {
        key: 'radio',
        cells: [
            <span key="component">
                <Link href="/component-guide/radio" className={LINK_CLASS}>
                    Radio
                </Link>
                {' · '}
                <Link href="/component-guide/checkbox" className={LINK_CLASS}>
                    Checkbox
                </Link>
            </span>,
            '하나만 · 여러 개',
            '카드 모양이 필요 없는 일반 폼 항목',
        ],
    },
] as const

const LAYOUT_COLUMNS = [
    {key: 'target', header: '대상', align: 'start', rowHeader: true},
    {key: 'rule', header: '기준', align: 'start', wrap: true},
] as const

const LAYOUT_ROWS = [
    {key: 'grid', cells: ['목록', '모바일 1열, md 이상 2열입니다. 카드 사이는 24 입니다.']},
    {
        key: 'card',
        cells: [
            '카드',
            '반경 12 · 안쪽 여백 24 · 줄 사이 12 입니다. 고르거나 마우스를 올리면 테두리가 primary 로 바뀝니다.',
        ],
    },
    {
        key: 'row',
        cells: [
            '줄',
            '왼쪽에 항목 이름, 오른쪽에 값이 놓입니다. 이름은 줄바꿈하지 않고, 긴 값은 오른쪽 정렬로 줄바꿈되어 카드 밖으로 나가지 않습니다.',
        ],
    },
    {
        key: 'disabled',
        cells: [
            '비활성',
            <span key="rule">
                카드에 <code>disabled</code>를 주면 흐려지고 고를 수 없습니다.
            </span>,
        ],
    },
] as const

const PROPS_ITEMS = [
    ['SelectableInfoCardGroup', 'value · defaultValue', '고른 카드의 value 입니다.', '-', 'string'],
    ['SelectableInfoCardGroup', 'onValueChange', '카드를 골랐을 때 호출됩니다.', '-', '(value: string) => void'],
    [
        'SelectableInfoCardGroup',
        'aria-label · aria-labelledby',
        '목록의 이름입니다. 보이는 제목이 있으면 aria-labelledby 로 잇습니다.',
        '-',
        'string',
    ],
    ['SelectableInfoCardGroup', 'name', '폼으로 제출할 때의 키입니다.', '-', 'string'],
    ['SelectableInfoCardGroup', 'disabled', '모든 카드를 고를 수 없게 합니다.', 'false', 'boolean'],
    ['SelectableInfoCardGroup', 'className', '그리드 배치에 덧붙일 클래스입니다.', '-', 'string'],
    ['SelectableInfoCard', 'value', '카드의 값입니다(필수).', '-', 'string'],
    [
        'SelectableInfoCard',
        'fields',
        '카드의 줄입니다(필수). label 은 한 카드 안에서 겹치지 않아야 합니다.',
        '-',
        'readonly {label: string; value: string}[]',
    ],
    ['SelectableInfoCard', 'disabled', '고를 수 없게 합니다.', 'false', 'boolean'],
    ['SelectableInfoCard', 'className', '카드에 덧붙일 클래스입니다.', '-', 'string'],
] as const

const SelectableInfoCardGuidePage = () => (
    <GuidePageShell
        title="선택 정보 카드 (SelectableInfoCard)"
        description="항목 이름 · 값 몇 줄로 된 카드 중 하나를 고르는 목록입니다."
    >
        <BaseCard>
            <section aria-labelledby="sic-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sic-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code className="text-foreground font-mono">SelectableInfoCardGroup</code> 안에 카드를 넣고,
                        카드마다 <code className="text-foreground font-mono">value</code>와{' '}
                        <code className="text-foreground font-mono">fields</code>를 넘깁니다. 카드를 고른 뒤 다음 목록을
                        불러오는 화면은 <code className="text-foreground font-mono">onValueChange</code>에서 조회합니다.
                    </p>
                </div>
                <SelectableInfoCardDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sic-rules" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sic-rules" className="typo-h4-bold">
                        배치와 상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        배치와 줄바꿈은 컴포넌트가 정합니다. 단위는 px 입니다.
                    </p>
                </div>
                <Table caption="SelectableInfoCard 배치와 상태" columns={LAYOUT_COLUMNS} rows={LAYOUT_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sic-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sic-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        선택 컴포넌트는 담는 내용과 선택 개수로 고릅니다.
                    </p>
                </div>
                <Table caption="선택 컴포넌트 사용 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sic-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sic-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        역할과 키보드 조작은 Radix RadioGroup 이 처리합니다[8.2.1].
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>목록은 라디오 그룹이고 카드는 라디오 하나입니다. 방향키로 카드 사이를 옮깁니다[6.1.1].</li>
                    <li>카드 안 글 전체가 그 라디오의 이름으로 읽힙니다[7.4.1].</li>
                    <li>
                        선택은 테두리 색으로만 표시됩니다(동그라미 표시 없음). 스크린리더에는 <code>aria-checked</code>{' '}
                        로 전달되며, 화면에서도 선택 결과를 보여 줘야 하면 사용처가 별도 텍스트를 둡니다[5.3.1].
                    </li>
                    <li>포커스는 카드 외곽선으로 표시됩니다[6.1.2].</li>
                    <li>
                        그룹 이름은 필수입니다. 사용처는 그룹에{' '}
                        <code className="text-foreground font-mono">aria-labelledby</code>(보이는 목록 제목) 또는{' '}
                        <code className="text-foreground font-mono">aria-label</code>로 이름을 줍니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sic-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="sic-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SelectableInfoCard 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SelectableInfoCardGuidePage
