// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {LicenseNotice, type LicenseLink} from '@/components/custom/license-notice'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {CompanyNetworkDemo, SupplyNetworkDemo} from './chart-demo'

export const metadata: Metadata = {title: '네트워크 그래프 (NetworkGraph)'}

const CYTOSCAPE_LICENSE: LicenseLink = {
    name: 'Cytoscape.js',
    href: 'https://github.com/cytoscape/cytoscape.js/blob/master/LICENSE',
}
const FCOSE_LICENSE: LicenseLink = {
    name: 'cytoscape-fcose',
    href: 'https://github.com/iVis-at-Bilkent/cytoscape.js-fcose/blob/master/LICENSE',
}

const COMPANY_CODE = `import {
  CompanyRelationshipGraph,
  type CompanySector,
  type RelatedCompany,
} from '@/components/custom/company-relationship-graph'

// 섹터(2depth) → 기업(3depth) 구조입니다. id 는 섹터끼리, 기업끼리 겹치지 않아야 합니다.
const sectors: CompanySector[] = [
  {
    id: 'construction',
    label: '건설',
    icon: 'construction',
    companies: [
      {
        id: 'korea-construction',
        label: '한국건설',
        businessNumber: '444-44-44444', // 툴팁 · 스크린리더용
        relationCode: '24', // 연결선에 표시할 연계유형 번호
        relationLabel: '임원-임원',
        status: 'normal', // 노드 색(EW등급)
      },
    ],
  },
]

// 섹터 없이 분석기업에 바로 연결되는 기업입니다. 없으면 생략합니다.
const directCompanies: RelatedCompany[] = [
  {id: 'direct-partner', label: '한국직접연계기업', businessNumber: '491-01-01010', relationCode: '11', relationLabel: '법인특수관계', status: 'normal'},
]

<CompanyRelationshipGraph
  companyName="주식회사 한국첨단산업기술연구원"
  sectors={sectors}
  directCompanies={directCompanies}
  ariaLabel="한국첨단산업기술연구원과 연계기업의 산업 섹터별 관계"
/>

// icon: construction | education | finance | food | information | management | manufacturing | retail
// status: normal | good | attention | alert | danger | high-risk | poor | closed`

const SUPPLY_CODE = `import {NetworkGraph, type NetworkLink, type NetworkNode} from '@/components/custom/network-graph'

// 모든 노드 id 는 겹치지 않아야 합니다. 분석기업(kind="analysis")은 하나만 둡니다.
const nodes: NetworkNode[] = [
  {id: 'analysis', label: '한국기업(주)', kind: 'analysis', status: 'interest', weight: 100},
  {id: 'information', label: '정보통신', kind: 'industry', status: 'interest', weight: 80, icon: 'information'},
  // 거래기업은 status 가 노드 색, weight(1~100)가 노드 지름(20~48px)을 정합니다.
  {id: 'company-a', label: '한국정보기술(주)', kind: 'company', status: 'normal', weight: 40},
  {id: 'company-direct', label: '한국직접거래(주)', kind: 'company', status: 'normal', weight: 30},
]

// source · target 은 위 nodes 의 id 이고 ratio 는 연결선에 표시할 비중(%)입니다.
const links: NetworkLink[] = [
  {id: 'analysis-information', source: 'analysis', target: 'information', ratio: 60.13},
  {id: 'information-company-a', source: 'information', target: 'company-a', ratio: 28.33},
  // 업종이 없는 기업은 분석기업에서 바로 연결합니다.
  {id: 'analysis-company-direct', source: 'analysis', target: 'company-direct', ratio: 2.21},
]

<NetworkGraph nodes={nodes} links={links} ariaLabel="한국기업의 산업별 공급망 연결 비중" />

// status: normal | interest | danger | closed
// icon: information | science | rental | food | manufacturing | construction | finance | retail | education | transport`

const LOADING_CODE = `// 그래프가 준비되는 동안 범례도 함께 스켈레톤으로 바꾸려면 onLoadingChange 를 사용합니다.
const [isGraphLoading, setIsGraphLoading] = useState(true)

{isGraphLoading ? <ChartSkeleton type="network" legend="supply-network" label="공급망을 불러오는 중입니다." /> : null}
<div className={isGraphLoading ? 'invisible' : undefined} aria-hidden={isGraphLoading}>
  <Legend nodes={nodes} />
  <NetworkGraph nodes={nodes} links={links} ariaLabel="…" onLoadingChange={setIsGraphLoading} />
</div>`

const DATA_CODE = `// 연계기업: API 응답을 섹터 → 기업 구조로 바꿉니다. id 는 API 원본의 겹치지 않는 값을 씁니다.
const sectors = response.sectors.map((sector) => ({
  id: sector.code,
  label: sector.name,
  icon: SECTOR_ICONS[sector.code] ?? 'management', // 섹터 코드 → 아이콘 이름
  companies: sector.companies.map((company) => ({
    id: company.id,
    label: company.name,
    businessNumber: company.bizNo,
    relationCode: company.relationCode,
    relationLabel: company.relationName,
    status: company.ewStatus, // 'normal' | 'good' | 'attention' | …
  })),
}))

// 공급망: 점(nodes)과 선(links)으로 바꿉니다. 선의 source · target 은 점 id 입니다.
const nodes = response.nodes.map((node) => ({
  id: node.id, label: node.name, kind: node.type, status: node.ewStatus, weight: node.transactionAmount,
}))
const links = response.links.map((link) => ({
  id: \`\${link.from}-\${link.to}\`, source: link.from, target: link.to, ratio: link.ratio,
}))`

const CHOICE_COLUMNS = [
    {key: 'case', header: '표현할 관계', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'company',
        cells: [
            '기업 간 연계관계 (연계유형 · EW등급)',
            <code key="component">CompanyRelationshipGraph</code>,
            '입력이 섹터 → 기업 구조입니다. 연결선에는 연계유형 번호, 노드 색에는 EW등급 8단계를 씁니다.',
        ],
    },
    {
        key: 'supply',
        cells: [
            '업종별 거래 · 공급망 비중',
            <code key="component">NetworkGraph</code>,
            '입력이 nodes · links 입니다. 연결선에는 비중(%), 노드 색에는 상태 4단계, 노드 크기에는 weight 를 씁니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'CompanyRelationshipGraph',
        'companyName',
        '중심 분석기업명입니다. 14자를 넘으면 화면에서 말줄임하고 전체 이름은 접근성 목록에 남깁니다.',
        '-',
        'string',
    ],
    [
        'CompanyRelationshipGraph',
        'sectors',
        '섹터와 소속 기업 목록입니다. 섹터명은 9자, 기업명은 10자를 넘으면 화면에서 말줄임합니다.',
        '-',
        'CompanySector[]',
    ],
    [
        'CompanyRelationshipGraph',
        'directCompanies',
        '섹터 없이 분석기업에 바로 연결되는 기업 목록입니다.',
        '[]',
        'RelatedCompany[]',
    ],
    ['CompanyRelationshipGraph', 'ariaLabel', '그래프가 전달하는 관계를 설명하는 이름입니다.', '-', 'string'],
    [
        'CompanyRelationshipGraph',
        'onLoadingChange',
        '그래프 로딩 상태가 바뀔 때 호출됩니다. 범례를 함께 스켈레톤 처리할 때 씁니다.',
        'undefined',
        '(isLoading: boolean) => void',
    ],
    [
        'CompanyRelationshipGraph',
        'className · div props',
        '바깥 div 의 네이티브 속성을 전달합니다. 그래프 높이는 컴포넌트가 정합니다(모바일 h-100, sm 이상 h-125).',
        'undefined',
        "Omit<ComponentPropsWithoutRef<'div'>, 'children'>",
    ],
    ['CompanySector', 'id', '섹터 식별자입니다. 섹터끼리 겹치지 않아야 합니다.', '-', 'string'],
    ['CompanySector', 'label', '섹터명입니다.', '-', 'string'],
    [
        'CompanySector',
        'icon',
        '섹터 노드 안에 표시할 아이콘입니다.',
        '-',
        "'construction' | 'education' | 'finance' | 'food' | 'information' | 'management' | 'manufacturing' | 'retail'",
    ],
    ['CompanySector', 'companies', '섹터에 속한 기업 목록입니다.', '-', 'RelatedCompany[]'],
    ['RelatedCompany', 'id', '기업 식별자입니다. 기업끼리 겹치지 않아야 합니다.', '-', 'string'],
    ['RelatedCompany', 'label', '기업명입니다.', '-', 'string'],
    ['RelatedCompany', 'businessNumber', '사업자번호입니다. 툴팁과 접근성 목록에 쓰입니다.', '-', 'string'],
    ['RelatedCompany', 'relationCode', '연계유형 번호입니다. 연결선에 표시됩니다.', '-', 'string'],
    ['RelatedCompany', 'relationLabel', '연계유형 이름입니다. 툴팁과 접근성 목록에 쓰입니다.', '-', 'string'],
    [
        'RelatedCompany',
        'status',
        'EW등급입니다. 노드 색을 정합니다.',
        '-',
        "'normal' | 'good' | 'attention' | 'alert' | 'danger' | 'high-risk' | 'poor' | 'closed'",
    ],
    [
        'NetworkGraph',
        'nodes',
        '분석기업(kind="analysis") 1개, 업종(kind="industry"), 거래기업(kind="company") 목록입니다. id 는 겹치지 않아야 합니다.',
        '-',
        'NetworkNode[]',
    ],
    [
        'NetworkGraph',
        'links',
        '노드 사이의 연결과 비중 목록입니다. 업종이 없는 기업은 분석기업을 source 로 둡니다.',
        '-',
        'NetworkLink[]',
    ],
    ['NetworkGraph', 'ariaLabel', '그래프가 전달하는 관계를 설명하는 이름입니다.', '-', 'string'],
    [
        'NetworkGraph',
        'onLoadingChange',
        '그래프 로딩 상태가 바뀔 때 호출됩니다. 범례를 함께 스켈레톤 처리할 때 씁니다.',
        'undefined',
        '(isLoading: boolean) => void',
    ],
    [
        'NetworkGraph',
        'className · div props',
        '바깥 div 의 네이티브 속성을 전달합니다. 그래프 높이는 컴포넌트가 정합니다(h-120).',
        'undefined',
        "Omit<ComponentPropsWithoutRef<'div'>, 'children'>",
    ],
    ['NetworkNode', 'id', '노드 식별자입니다. link 의 source · target 이 가리킵니다.', '-', 'string'],
    [
        'NetworkNode',
        'label',
        '노드 이름입니다. 분석기업 14자, 업종 9자, 기업 10자를 넘으면 말줄임합니다.',
        '-',
        'string',
    ],
    ['NetworkNode', 'kind', '노드 계층입니다.', '-', "'analysis' | 'industry' | 'company'"],
    ['NetworkNode', 'status', '노드 색을 정하는 상태입니다.', '-', "'normal' | 'interest' | 'danger' | 'closed'"],
    [
        'NetworkNode',
        'weight',
        '1~100 값입니다. 거래기업 노드 지름(20~48px)에 반영되고 업종 · 분석기업 크기는 kind 로 고정됩니다.',
        '-',
        'number',
    ],
    [
        'NetworkNode',
        'icon',
        '업종 노드 안에 표시할 아이콘입니다.',
        'undefined',
        "'information' | 'science' | 'rental' | 'food' | 'manufacturing' | 'construction' | 'finance' | 'retail' | 'education' | 'transport'",
    ],
    ['NetworkLink', 'id', '연결 식별자입니다.', '-', 'string'],
    ['NetworkLink', 'source', '시작 노드 id 입니다.', '-', 'string'],
    ['NetworkLink', 'target', '도착 노드 id 입니다.', '-', 'string'],
    ['NetworkLink', 'ratio', '연결선에 표시할 비중(%)입니다.', '-', 'number'],
] as const

const NetworkGraphGuidePage = () => (
    <GuidePageShell
        title="네트워크 그래프 (NetworkGraph)"
        description="기업 사이의 연결을 점과 선으로 보여 주는 관계망 그래프입니다. 연계기업은 CompanyRelationshipGraph, 공급망은 NetworkGraph 를 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="ng-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ng-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        두 그래프 모두 분석기업을 중심에 두고 노드 수에 맞춰 반경 · 각도 · 라벨 위치를 자동으로
                        정합니다. 영역을 벗어나면 분석기업을 중앙에 유지한 채 전체를 축소하며, 노드 위에 마우스를
                        올리거나 포커스를 두면 전체 정보 툴팁이 나타납니다. 데모의 범례와 개수 선택 버튼은 사용처에서
                        구성한 예시입니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex min-w-0 flex-col gap-4 py-8 last:pb-0">
                        <div className="flex max-w-4xl flex-col gap-2">
                            <h3 className="typo-title-m-bold text-foreground">
                                연계기업 네트워크 (CompanyRelationshipGraph)
                            </h3>
                            <p className="typo-body-l-regular text-label-foreground">
                                분석기업 - 섹터 - 연계기업 구조입니다. 연결선 숫자는 연계유형, 기업 노드 색은
                                EW등급입니다. 섹터 없는 기업은 분석기업에 바로 연결하고 연계기업 노드는 끌어서 옮길 수
                                있습니다.
                            </p>
                        </div>
                        <div className="bg-card border-border overflow-hidden rounded-xl border p-4">
                            <CompanyNetworkDemo />
                        </div>
                        <CodeBlock code={COMPANY_CODE} language="tsx" copyLabel="복사" />
                        <LicenseNotice libraries={[CYTOSCAPE_LICENSE, FCOSE_LICENSE]} />
                    </div>
                    <div className="flex min-w-0 flex-col gap-4 py-8 last:pb-0">
                        <div className="flex max-w-4xl flex-col gap-2">
                            <h3 className="typo-title-m-bold text-foreground">공급망 네트워크 (NetworkGraph)</h3>
                            <p className="typo-body-l-regular text-label-foreground">
                                분석기업 - 업종 - 거래기업으로 이어지는 비중(%)을 보여 줍니다. 업종 정보가 없는 기업은
                                분석기업에 바로 연결합니다.
                            </p>
                        </div>
                        <div className="bg-card border-border overflow-hidden rounded-xl border p-4">
                            <SupplyNetworkDemo />
                        </div>
                        <CodeBlock code={SUPPLY_CODE} language="tsx" copyLabel="복사" />
                        <LicenseNotice libraries={[CYTOSCAPE_LICENSE, FCOSE_LICENSE]} />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ng-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ng-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        표현할 관계에 따라 입력 구조와 색 기준이 다릅니다.
                    </p>
                </div>
                <Table
                    caption="CompanyRelationshipGraph · NetworkGraph 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ng-loading" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ng-loading" className="typo-h4-bold">
                        로딩
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        그래프 모듈과 배치가 준비되는 동안 컴포넌트가{' '}
                        <code>ChartSkeleton type=&quot;network&quot;</code> 를 스스로 보여 줍니다. 범례까지 함께
                        대체하려면 <code>onLoadingChange</code> 로 상태를 받아 <code>legend</code> 가 있는 스켈레톤을
                        사용처에서 그립니다.
                    </p>
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ng-data" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ng-data" className="typo-h4-bold">
                        데이터 연결
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        API 응답을 그래프가 받는 모양(섹터 → 기업, 점 · 선)으로 바꿔 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={DATA_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ng-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ng-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        그림 대신 읽을 수 있는 목록과 키보드 이동을 컴포넌트가 제공합니다. 사용처는{' '}
                        <code>ariaLabel</code> 과 범례를 책임집니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        그래프에 <code>role=&quot;img&quot;</code> 와 <code>ariaLabel</code> 이 붙고, 같은 관계 데이터가
                        숨김 목록으로 함께 제공됩니다. 연계기업은 섹터별 기업 · 사업자번호 · EW등급 · 연계유형, 공급망은
                        연결별 비중과 상태별 개수가 담깁니다[5.1.1].
                    </li>
                    <li>
                        노드마다 보이지 않는 버튼이 겹쳐 있어 <kbd>Tab</kbd> 키로 이동하며 포커스하면 툴팁이 나타납니다.
                        공급망 그래프는 분석기업, 업종, 소속 기업 순으로 이동합니다[6.1.1].
                    </li>
                    <li>
                        상태는 노드 색만으로 전하지 않고 툴팁과 숨김 목록의 상태명으로도 전합니다. 범례의 색에는 이름을
                        함께 적습니다[5.3.1].
                    </li>
                    <li>말줄임한 이름은 화면에만 적용되며 전체 이름은 툴팁과 숨김 목록에 남습니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ng-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ng-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>onLoadingChange</code> · <code>className</code> 을 제외한 모든 속성이 필수입니다. 단,{' '}
                        <code>directCompanies</code> 와 <code>NetworkNode.icon</code> 은 생략할 수 있습니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="CompanyRelationshipGraph · NetworkGraph Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default NetworkGraphGuidePage
