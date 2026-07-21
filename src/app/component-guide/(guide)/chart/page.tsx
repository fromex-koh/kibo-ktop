import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ListMarker} from '@/components/custom/list-marker'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import PropsTable from '@/components/guide/props-table'
import {CompanyNetworkDemo, IssueWordCloudDemo, SupplyNetworkDemo} from './chart-demo'

export const metadata: Metadata = {title: '차트 (Chart)'}

const COMPANY_RELATIONSHIP_CODE = `import {
  CompanyRelationshipGraph,
  type CompanySector,
  type RelatedCompany,
} from '@/components/custom/company-relationship-graph';

// 1. API 응답을 2depth 섹터 → 3depth 기업 구조로 변환합니다.
const relationshipSectors: CompanySector[] = [
  {
    id: 'construction',          // API 원본의 안정적이고 중복되지 않는 ID
    label: '건설',                 // 2depth 섹터명
    icon: 'construction',       // 섹터 아이콘
    companies: [                // 해당 섹터의 3depth 기업
      {
        id: 'korea-construction',
        label: '한국건설',
        businessNumber: '444-44-44444', // 툴팁·스크린리더용 원문 데이터
        relationCode: '24',     // 섹터-기업 연결선에 표시될 번호
        relationLabel: '임원-임원',
        status: 'normal',       // EW등급 및 노드 색상
      },
    ],
  },
];

// 2. 섹터 정보가 없는 기업만 별도 배열로 전달합니다. 없으면 생략할 수 있습니다.
const directCompanies: RelatedCompany[] = [
  {
    id: 'direct-partner',
    label: '한국직접연계기업',
    businessNumber: '491-01-01010',
    relationCode: '11',
    relationLabel: '법인특수관계',
    status: 'normal',
  },
];

export default function CompanyRelationshipSection() {
  // 3. 변환한 데이터를 각 prop에 연결합니다. 노드 수에 따른 배치는 자동입니다.
  return (
    <CompanyRelationshipGraph
      companyName="주식회사 한국첨단산업기술연구원"
      sectors={relationshipSectors}
      directCompanies={directCompanies}
      ariaLabel="한국첨단산업기술연구원과 연계기업의 산업 섹터별 관계"
    />
  );
}

// icon: construction | education | finance | food | information |
//       management | manufacturing | retail
// status: normal | good | attention | alert | danger | high-risk |
//         poor | closed`

const NETWORK_CODE = `import {
  NetworkGraph,
  type NetworkLink,
  type NetworkNode,
} from '@/components/custom/network-graph';

// 1. API 응답의 개체를 nodes로 변환합니다. 모든 id는 중복되지 않아야 합니다.
const nodes: NetworkNode[] = [
  // 1depth 분석기업은 하나만 전달합니다.
  { id: 'analysis', label: '한국기업(주)', kind: 'analysis', status: 'interest', weight: 100 },

  // 2depth 업종. icon은 업종 노드 내부에 표시됩니다.
  { id: 'information', label: '정보통신', kind: 'industry', status: 'interest', weight: 80, icon: 'information' },

  // 3depth 거래기업. status는 색상, weight(1~100)는 20~48px의 상대 크기에 반영됩니다.
  // 1·2depth 크기는 kind에 따라 고정되므로 weight는 3depth의 비교값으로 사용합니다.
  { id: 'company-a', label: '한국정보기술(주)', kind: 'company', status: 'normal', weight: 40 },
  { id: 'company-direct', label: '한국직접거래(주)', kind: 'company', status: 'normal', weight: 30 },
];

// 2. source와 target에는 반드시 위 nodes에 존재하는 id를 넣습니다.
const links: NetworkLink[] = [
  // ratio는 연결선에 표시할 비중(%)입니다.
  // 1depth → 2depth
  { id: 'analysis-information', source: 'analysis', target: 'information', ratio: 60.13 },

  // 2depth → 3depth
  { id: 'information-company-a', source: 'information', target: 'company-a', ratio: 28.33 },

  // 업종 정보가 없는 3depth 기업은 분석기업에서 바로 연결합니다.
  { id: 'analysis-company-direct', source: 'analysis', target: 'company-direct', ratio: 2.21 },
];

export default function SupplyNetwork() {
  // 3. 완성한 nodes와 links를 전달하면 반경·각도·축소는 자동 계산됩니다.
  return (
    <NetworkGraph
      nodes={nodes}
      links={links}
      ariaLabel="한국기업의 산업별 공급망 연결 비중"
    />
  );
}

// status: normal | interest | danger | closed
// icon: information | science | rental | food | manufacturing |
//       construction | finance | retail | education | transport`

const WORD_CLOUD_CODE = `import {
  WordCloud,
  type WordCloudItem,
} from '@/components/custom/word-cloud';

// 1. API에서 받은 키워드별 원시 빈도·중요도입니다.
const issueKeywordsFromApi = [
  { keyword: '인공지능', score: 248 },
  { keyword: '학습', score: 203 },
  { keyword: '기술', score: 174 },
  { keyword: '이미지', score: 159 },
];

// 2. 같은 키워드가 여러 번 오면 먼저 합산합니다.
const scoreByKeyword = new Map<string, number>();
issueKeywordsFromApi.forEach(({ keyword, score }) => {
  const text = keyword.trim();
  if (!text || score <= 0) return;
  scoreByKeyword.set(text, (scoreByKeyword.get(text) ?? 0) + score);
});

// 3. 가장 큰 score를 100으로 보고 weight를 1~100 범위로 정규화합니다.
const maximumScore = Math.max(
  ...scoreByKeyword.values(),
  1,
);

const issueWords: WordCloudItem[] = Array.from(scoreByKeyword)
  .map(([text, score]) => ({
    text,
    weight: Math.max(1, Math.round((score / maximumScore) * 100)),
  }))
  .sort((a, b) => b.weight - a.weight);

export default function ResearchIssueWordCloud() {
  // 4. 정규화한 배열을 전달하면 글자 크기와 배치는 자동 계산됩니다.
  return (
    <WordCloud
      words={issueWords}
      ariaLabel="최근 3개년 R&D 이슈를 중요도순으로 표시한 워드클라우드"
      className="w-full"
    />
  );
}`

const PROPS_ITEMS = [
    [
        'CompanyRelationshipGraph',
        'companyName',
        '네트워크 중심의 분석기업명입니다. 14자를 넘으면 화면에서 말줄임하고 전체 이름은 툴팁·접근성 데이터에 유지합니다.',
        '-',
        'string',
    ],
    [
        'CompanyRelationshipGraph',
        'sectors',
        '동적 산업 섹터와 각 섹터의 기업·관계 코드·EW등급을 전달합니다. 섹터·기업 id는 각각 중복되지 않아야 합니다.',
        '-',
        'CompanySector[]',
    ],
    [
        'CompanyRelationshipGraph',
        'directCompanies',
        '2depth 섹터 정보 없이 분석기업에 바로 연결되는 기업의 관계 코드·EW등급을 전달합니다.',
        '[]',
        'RelatedCompany[]',
    ],
    ['CompanyRelationshipGraph', 'ariaLabel', '연계기업 네트워크가 전달하는 핵심 관계를 설명합니다.', '-', 'string'],
    [
        'NetworkGraph',
        'nodes',
        '분석기업(kind="analysis") 1개와 업종(kind="industry"), 거래기업(kind="company")을 전달합니다. 3depth 기업의 weight(1~100)는 상대적 노드 크기에 반영되며 모든 id는 중복되지 않아야 합니다.',
        '-',
        'NetworkNode[]',
    ],
    [
        'NetworkGraph',
        'links',
        'source·target으로 계층을 연결하고 ratio에 표시할 비중(%)을 전달합니다. 업종이 없는 기업은 분석기업을 source로 직접 연결합니다.',
        '-',
        'NetworkLink[]',
    ],
    ['NetworkGraph', 'ariaLabel', '분석기업과 업종·거래기업 관계를 간결하게 설명합니다.', '-', 'string'],
    [
        'WordCloud',
        'words',
        '중복되지 않는 단어와 양수 가중치를 전달합니다. weight가 클수록 글자가 크게 표시되며 중요도순으로 정렬해 전달합니다.',
        '-',
        'WordCloudItem[]',
    ],
    ['WordCloud', 'ariaLabel', '워드클라우드가 나타내는 데이터 범위를 설명합니다.', '-', 'string'],
    [
        '공통',
        'className · div props',
        '차트 래퍼에 추가 스타일과 네이티브 div 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
] as const

type LicenseLink = {name: string; href: string}

const LicenseNotice = ({libraries}: {libraries: LicenseLink[]}) => (
    <div className="bg-muted border-border typo-body-m-regular text-foreground-subtle rounded-lg border p-4">
        <p>
            <strong className="text-foreground">라이선스: MIT · 상업적 사용 가능</strong>
            <br />
            상업 서비스에서 사용·수정·배포할 수 있습니다. 라이브러리 사본 또는 주요 부분을 배포할 때는 원문의 저작권 및
            라이선스 고지를 함께 유지해야 합니다.
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {libraries.map((library) => (
                <li key={library.name}>
                    <a
                        href={library.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline underline-offset-4"
                    >
                        {library.name} 공식 LICENSE
                    </a>
                </li>
            ))}
        </ul>
    </div>
)

const CYTOSCAPE_LICENSE: LicenseLink = {
    name: 'Cytoscape.js',
    href: 'https://github.com/cytoscape/cytoscape.js/blob/master/LICENSE',
}
const FCOSE_LICENSE: LicenseLink = {
    name: 'cytoscape-fcose',
    href: 'https://github.com/iVis-at-Bilkent/cytoscape.js-fcose/blob/master/LICENSE',
}
const WORD_CLOUD_LICENSE: LicenseLink = {
    name: 'WordCloud2.js',
    href: 'https://github.com/timdream/wordcloud2.js/blob/gh-pages/LICENSE',
}

const ChartGuidePage = () => (
    <GuidePageShell
        title="차트 (Chart)"
        description="실제 데이터 변화에 따라 자동 배치되는 네트워크 그래프와 워드클라우드입니다. 모든 시각화 색상은 semantic chart 토큰을 사용합니다."
    >
        <BaseCard>
            <section aria-labelledby="chart-company-network" className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h2 id="chart-company-network" className="typo-h4-bold">
                        연계기업 네트워크
                    </h2>
                    <ul className="typo-body-l-regular text-foreground-subtle flex list-none flex-col gap-1">
                        {[
                            '분석기업을 중심으로 산업 섹터와 연계기업을 연결합니다.',
                            '연결선의 숫자는 연계유형, 기업 노드의 색상은 EW등급을 나타냅니다.',
                            '섹터 정보가 없는 기업은 분석기업에 바로 연결합니다.',
                            '연계기업이 많은 섹터만 분석기업과의 거리를 늘려 배치 공간을 확보합니다.',
                            '외곽 노드나 라벨이 영역을 벗어나면 분석기업을 중앙에 유지한 채 자동 축소합니다.',
                            '외곽 기업은 직접 이동하거나 키보드로 선택해 상세 정보를 확인할 수 있습니다.',
                        ].map((description) => (
                            <li key={description} className="flex items-start gap-1.5">
                                <ListMarker type="unordered" level={1} />
                                <span>{description}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-background border-border overflow-hidden rounded-xl border p-4">
                    <CompanyNetworkDemo />
                </div>
                <CodeBlock
                    code={COMPANY_RELATIONSHIP_CODE}
                    language="tsx"
                    copyLabel="CompanyRelationshipGraph 사용 코드 복사"
                />
                <LicenseNotice libraries={[CYTOSCAPE_LICENSE, FCOSE_LICENSE]} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-supply-network" className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h2 id="chart-supply-network" className="typo-h4-bold">
                        산업별 공급망 분포
                    </h2>
                    <ul className="typo-body-l-regular text-foreground-subtle flex list-none flex-col gap-1">
                        {[
                            '분석기업에서 업종과 거래기업으로 이어지는 공급망 비중을 표시합니다.',
                            '업종 정보가 없는 기업은 분석기업에 바로 연결합니다.',
                            '데이터 규모에 맞춰 반경·각도·라벨 위치를 자동 조정합니다.',
                            '거래기업이 많은 업종만 분석기업과의 거리를 늘려 배치 공간을 확보합니다.',
                            '외곽 노드나 라벨이 영역을 벗어나면 전체 그래프가 화면 안에 들어오도록 자동 축소합니다.',
                            '노드는 마우스나 Tab 키로 선택해 전체 정보 툴팁을 확인할 수 있습니다.',
                        ].map((description) => (
                            <li key={description} className="flex items-start gap-1.5">
                                <ListMarker type="unordered" level={1} />
                                <span>{description}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-background border-border overflow-hidden rounded-xl border p-4">
                    <SupplyNetworkDemo />
                </div>
                <LicenseNotice libraries={[CYTOSCAPE_LICENSE, FCOSE_LICENSE]} />
                <CodeBlock code={NETWORK_CODE} language="tsx" copyLabel="NetworkGraph 사용 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-word-cloud" className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h2 id="chart-word-cloud" className="typo-h4-bold">
                        R&amp;D 이슈 워드클라우드
                    </h2>
                    <ul className="typo-body-l-regular text-foreground-subtle flex list-none flex-col gap-1">
                        {[
                            'score는 API에서 받은 빈도·중요도 등의 원본 값입니다.',
                            'weight는 글자 크기에 사용할 시각적 값이며, 가장 큰 score를 100으로 두고 1~100 범위로 정규화합니다.',
                            '정규화하면 API 점수의 단위나 범위가 달라도 상대적 중요도를 유지하면서 글자 크기를 안정적으로 표시할 수 있습니다.',
                            '중요도가 큰 단어부터 전달하면 충돌을 피해 수평으로 자동 배치하고, 컨테이너 크기에 맞춰 다시 계산합니다.',
                            '단어에 마우스를 올리면 정규화된 중요도 weight를 툴팁으로 확인할 수 있습니다.',
                        ].map((description) => (
                            <li key={description} className="flex items-start gap-1.5">
                                <ListMarker type="unordered" level={1} />
                                <span>{description}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-background border-border overflow-hidden rounded-xl border p-4">
                    <IssueWordCloudDemo />
                </div>
                <LicenseNotice libraries={[WORD_CLOUD_LICENSE]} />
                <CodeBlock code={WORD_CLOUD_CODE} language="tsx" copyLabel="R&D 이슈 WordCloud 데이터 연결 코드 복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-accessibility" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="chart-accessibility" className="typo-h4-bold">
                        접근성 및 라이선스
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        시각적 차트와 동일한 관계·가중치 데이터를 스크린리더용 목록으로 함께 제공합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-foreground-subtle flex list-disc flex-col gap-2 pl-5">
                    <li>노드 상태는 색상뿐 아니라 숨김 데이터의 상태명으로도 전달합니다.</li>
                    <li>
                        연계기업·공급망 네트워크의 모든 노드는 Tab 키로 이동하며, 포커스 시 전체 정보 툴팁을 표시합니다.
                        탐색 순서는 분석기업에서 각 업종과 해당 기업 그룹으로 이어집니다.
                    </li>
                    <li>
                        분석기업명은 14자, 업종명은 9자, 기업명은 10자 초과 시 화면에서 말줄임하며 원문은
                        툴팁·스크린리더 목록에 유지합니다.
                    </li>
                    <li>네트워크 연결 비중과 워드 중요도는 차트 내부의 읽기 가능한 목록에 포함됩니다.</li>
                    <li>각 차트에서 사용하는 라이브러리와 공식 MIT LICENSE 근거는 해당 섹션에서 확인합니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-props" className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <h2 id="chart-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        화면에서는 데이터와 접근 가능한 이름만 전달하고 레이아웃·테마 처리는 컴포넌트가 담당합니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Chart 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ChartGuidePage
