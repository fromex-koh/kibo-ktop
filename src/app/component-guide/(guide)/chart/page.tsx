import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ColumnChart, type ColumnChartItem} from '@/components/custom/column-chart'
import {ComparisonRadarChart, type ComparisonRadarItem} from '@/components/custom/comparison-radar-chart'
import {
    GroupedColumnChart,
    type GroupedColumnItem,
    type GroupedColumnSeries,
} from '@/components/custom/grouped-column-chart'
import {ListMarker} from '@/components/custom/list-marker'
import {RatingMatrix, type RatingMatrixRow} from '@/components/custom/rating-matrix'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import PropsTable from '@/components/guide/props-table'
import {Badge} from '@/components/ui/badge'
import {
    CompanyNetworkDemo,
    CreditRatingDemo,
    InnovationGrowthIndexDemo,
    IssueWordCloudDemo,
    SupplyNetworkDemo,
    TechnologyHoldingsDemo,
} from './chart-demo'

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

const TECHNOLOGY_HOLDINGS_CODE = `import {
  PercentageDonutChart,
  type PercentageDonutItem,
} from '@/components/custom/percentage-donut-chart';

type ApiTechnologyHolding = {
  categoryCode: string;
  categoryName: string;
  ratio: number;
  patentCount: number;
  semanticColor: string;
};

// 예: API에서 받은 기술 분류별 보유 현황
const technologyHoldingsFromApi: ApiTechnologyHolding[] = [
  {
    categoryCode: 'wireless-service',
    categoryName: '무선·이동통신 서비스',
    ratio: 30,
    patentCount: 13,
    semanticColor: 'var(--ds-chart-2)',
  },
  {
    categoryCode: 'wireless-system',
    categoryName: '무선·이동통신 시스템',
    ratio: 25,
    patentCount: 11,
    semanticColor: 'var(--ds-chart-4)',
  },
  {
    categoryCode: 'iot-service',
    categoryName: '사물인터넷 응용서비스',
    ratio: 15,
    patentCount: 6,
    semanticColor: 'var(--ds-chart-1)',
  },
  {
    categoryCode: 'platform',
    categoryName: '정보통신 융합 플랫폼',
    ratio: 10,
    patentCount: 4,
    semanticColor: 'var(--ds-chart-3)',
  },
  {
    categoryCode: 'other',
    categoryName: '기타',
    ratio: 20,
    patentCount: 9,
    semanticColor: 'var(--ds-chart-5)',
  },
];

// API의 기술 분류별 건수와 비중을 이 구조로 변환합니다.
const toChartData = (apiData: ApiTechnologyHolding[]): PercentageDonutItem[] =>
  apiData.map((item) => ({
    id: item.categoryCode,
    label: item.categoryName,
    percentage: item.ratio,
    count: item.patentCount,
    color: item.semanticColor,
  }));

export default function TechnologyHoldingsSection() {
  return (
    <PercentageDonutChart
      data={toChartData(technologyHoldingsFromApi)}
      ariaLabel="소분류 기준 기업 보유기술 비중과 건수"
    />
  );
}`

const INNOVATION_GROWTH_INDEX_CODE = `import {
  ScoreBenchmarkChart,
  type ScoreBenchmarkData,
  type ScoreBenchmarkTone,
} from '@/components/custom/score-benchmark-chart';

type ApiInnovationGrowthIndex = {
  techIndexScore: number;
  diagnosisGrade: string;
  industryTopPercentage: number;
  comparisonIndustryName: string;
};

// 예: API에서 받은 혁신성장역량 평가 결과
const innovationIndexFromApi: ApiInnovationGrowthIndex = {
  techIndexScore: 73.7,
  diagnosisGrade: '양호', // '우수' | '양호' | '주의' | '위험'
  industryTopPercentage: 25,
  comparisonIndustryName: '동일업종 기준 · 그 외 기타 전자부품 제조업',
};

const getTone = (grade: string): ScoreBenchmarkTone =>
  ({ 우수: 'strong', 양호: 'positive', 주의: 'caution', 위험: 'danger' })[grade] ?? 'caution';

// 업무 필드를 재사용 가능한 점수·벤치마크 구조로 변환합니다.
const toChartData = (apiData: ApiInnovationGrowthIndex): ScoreBenchmarkData => ({
  score: apiData.techIndexScore,
  scoreLabel: 'TECH-INDEX SCORE',
  statusLabel: apiData.diagnosisGrade,
  tone: getTone(apiData.diagnosisGrade),
  benchmarkPercentage: apiData.industryTopPercentage,
  benchmarkLabel: apiData.comparisonIndustryName,
  summary: '인프라·투입·활동·성과 부문별 전문가 검증 결과',
});

export default function InnovationGrowthIndexSection() {
  return (
    <ScoreBenchmarkChart
      data={toChartData(innovationIndexFromApi)}
      ariaLabel="혁신성장역량 Tech-Index 점수와 동일업종 상위 비율"
    />
  );
}`

const CREDIT_RATING_CODE = `import {
  SemicircleRatingGauge,
  type RatingGaugeTone,
  type SemicircleRatingData,
} from '@/components/custom/semicircle-rating-gauge';

type ApiCreditRating = {
  gradeCode: string;
  gradeName: string;
  gaugeValue: number;
  evaluationDate: string;
  settlementDate: string;
};

// 1. API 응답 예시
const creditRatingFromApi: ApiCreditRating = {
  gradeCode: 'BBB+',
  gradeName: '보통 상위',
  gaugeValue: 78,
  evaluationDate: '2025-05-20',
  settlementDate: '2024-12-31',
};

// 2. 등급 코드를 컴포넌트의 시맨틱 색상으로 변환합니다.
const getCreditRatingTone = (grade: string): RatingGaugeTone => {
  if (grade === 'AAA' || grade.startsWith('AA')) return 'excellent';
  if (grade.startsWith('A')) return 'good';
  if (grade.startsWith('BBB')) return 'normal';
  if (grade.startsWith('BB') || grade.startsWith('B')) return 'caution';
  return 'danger'; // CCC·CC·C·D
};

// 3. API 응답을 컴포넌트가 받는 data 형태로 변환합니다.
const toCreditRatingData = (item: ApiCreditRating): SemicircleRatingData => ({
  label: item.gradeCode,
  description: item.gradeName,
  percentage: item.gaugeValue,
  details: [
    { label: '평가일자', value: item.evaluationDate },
    { label: '결산일자', value: item.settlementDate },
  ],
  tone: getCreditRatingTone(item.gradeCode),
});

export default function CreditRatingSection() {
  const data = toCreditRatingData(creditRatingFromApi);

  return (
    <SemicircleRatingGauge
      data={data}
      title="기업신용등급"
      ariaLabel={\`기업신용등급 \${data.label}, \${data.description}\`}
    />
  );
}`

const BUSINESS_PERFORMANCE_MATRIX_CODE = `import {
  RatingMatrix,
  type RatingMatrixRow,
} from '@/components/custom/rating-matrix';

// API 응답을 행 단위 데이터로 구성합니다.
const performanceRows: RatingMatrixRow[] = [
  { id: 'growth', label: '성장성', rating: 'weak' },
  { id: 'profitability', label: '수익성', rating: 'good' },
  { id: 'stability', label: '안정성', rating: 'average' },
  { id: 'activity', label: '활동성', rating: 'good' },
  { id: 'liquidity', label: '유동성', rating: 'average' },
  { id: 'cash-flow', label: '현금흐름', rating: 'poor' },
];

export default function BusinessPerformanceSection() {
  return (
    <RatingMatrix
      rows={performanceRows}
      ariaLabel="기업 경영지표별 평가등급"
    />
  );
}

// rating: poor(취약) | weak(미흡) | average(보통) |
//         good(양호) | excellent(우수)`

const BUSINESS_PERFORMANCE_ROWS: RatingMatrixRow[] = [
    {id: 'growth', label: '성장성', rating: 'weak'},
    {id: 'profitability', label: '수익성', rating: 'good'},
    {id: 'stability', label: '안정성', rating: 'average'},
    {id: 'activity', label: '활동성', rating: 'good'},
    {id: 'liquidity', label: '유동성', rating: 'average'},
    {id: 'cash-flow', label: '현금흐름', rating: 'poor'},
]

const BUSINESS_METRIC_RADAR_CODE = `import {
  ComparisonRadarChart,
  type ComparisonRadarItem,
} from '@/components/custom/comparison-radar-chart';

// API에서 받은 조회기업과 업종평균의 부문별 점수를 연결합니다.
const comparisonData: ComparisonRadarItem[] = [
  { id: 'growth', label: '성장성', primaryValue: 52, comparisonValue: 60 },
  { id: 'profitability', label: '수익성', primaryValue: 78, comparisonValue: 68 },
  { id: 'stability', label: '안정성', primaryValue: 72, comparisonValue: 61 },
  { id: 'activity', label: '활동성', primaryValue: 66, comparisonValue: 45 },
  { id: 'liquidity', label: '유동성', primaryValue: 58, comparisonValue: 57 },
  { id: 'cash-flow', label: '현금흐름', primaryValue: 38, comparisonValue: 55 },
];

export default function BusinessMetricComparison() {
  return (
    <ComparisonRadarChart
      data={comparisonData}
      primaryLabel="조회기업"
      comparisonLabel="업종평균"
      ariaLabel="조회기업과 업종평균의 6개 경영지표 점수 비교"
    />
  );
}`

const BUSINESS_METRIC_RADAR_DATA: ComparisonRadarItem[] = [
    {id: 'growth', label: '성장성', primaryValue: 52, comparisonValue: 60},
    {id: 'profitability', label: '수익성', primaryValue: 78, comparisonValue: 68},
    {id: 'stability', label: '안정성', primaryValue: 72, comparisonValue: 61},
    {id: 'activity', label: '활동성', primaryValue: 66, comparisonValue: 45},
    {id: 'liquidity', label: '유동성', primaryValue: 58, comparisonValue: 57},
    {id: 'cash-flow', label: '현금흐름', primaryValue: 38, comparisonValue: 55},
]

const GROUPED_COLUMN_CODE = `import {
  GroupedColumnChart,
  type GroupedColumnItem,
  type GroupedColumnSeries,
} from '@/components/custom/grouped-column-chart';

// 비교할 계열은 개수 제한 없이 key·표시명·semantic 색상으로 구성합니다.
const fiscalYears: GroupedColumnSeries[] = [
  { key: '2022', label: '2022년', color: 'var(--ds-chart-4)' },
  { key: '2023', label: '2023년', color: 'var(--ds-chart-2)' },
  { key: '2024', label: '2024년', color: 'var(--ds-chart-1)' },
];

// API의 항목별 값을 series의 key와 동일한 values 필드에 연결합니다.
const financialData: GroupedColumnItem[] = [
  { id: 'assets', label: '총자산', values: { '2022': 11826, '2023': 17168, '2024': 18768 } },
  { id: 'equity', label: '자본총계', values: { '2022': 5332, '2023': 5130, '2024': 5191 } },
  { id: 'liabilities', label: '부채총계', values: { '2022': 6494, '2023': 12038, '2024': 13577 } },
  { id: 'sales', label: '매출액', values: { '2022': 16329, '2023': 18115, '2024': 18243 } },
  { id: 'operating-profit', label: '영업이익', values: { '2022': 1042, '2023': 497, '2024': 821 } },
  { id: 'net-income', label: '순이익', values: { '2022': 821, '2023': 466, '2024': 60 } },
];

export default function FinancialStatusChart() {
  return (
    <GroupedColumnChart
      data={financialData}
      series={fiscalYears}
      unit="백만원"
      yAxisStep={2000}
      ariaLabel="최근 3개년 총자산·자본·부채·매출·이익 비교"
    />
  );
}`

const GROUPED_COLUMN_VARIATION_CODE = `import {
  GroupedColumnChart,
  type GroupedColumnItem,
  type GroupedColumnSeries,
} from '@/components/custom/grouped-column-chart';

// X축을 연도, 묶음 계열을 재무 항목으로 구성한 배리에이션입니다.
const series: GroupedColumnSeries[] = [
  { key: 'assets', label: '총자산', color: 'var(--ds-chart-4)' },
  { key: 'liabilities', label: '부채', color: 'var(--ds-chart-3)' },
  { key: 'equity', label: '자본', color: 'var(--ds-chart-2)' },
];

const data: GroupedColumnItem[] = [
  { id: '2022', label: '2022', values: { assets: 286.4, liabilities: 138.2, equity: 148.2 } },
  { id: '2023', label: '2023', values: { assets: 305.2, liabilities: 141.8, equity: 163.4 } },
  { id: '2024', label: '2024', values: { assets: 324.8, liabilities: 142.6, equity: 182.2 } },
];

export default function BalanceSheetChart() {
  return (
    <GroupedColumnChart
      data={data}
      series={series}
      showValueLabels
      showLegend={false}
      valueFractionDigits={1}
      unit="억원"
      yAxisStep={50}
      ariaLabel="2022년부터 2024년까지 총자산·부채·자본 비교"
    />
  );
}`

const GROUPED_COLUMN_INCOME_CODE = `import {
  GroupedColumnChart,
  type GroupedColumnItem,
  type GroupedColumnSeries,
} from '@/components/custom/grouped-column-chart';

const series: GroupedColumnSeries[] = [
  { key: 'sales', label: '매출', color: 'var(--ds-chart-4)' },
  { key: 'operatingProfit', label: '영업이익', color: 'var(--ds-chart-1)' },
  { key: 'netIncome', label: '순이익', color: 'var(--ds-chart-3)' },
];

const data: GroupedColumnItem[] = [
  { id: '2022', label: '2022', values: { sales: 221.6, operatingProfit: 28.4, netIncome: 20.8 } },
  { id: '2023', label: '2023', values: { sales: 244.8, operatingProfit: 34.1, netIncome: 24.6 } },
  { id: '2024', label: '2024', values: { sales: 267.4, operatingProfit: 38.2, netIncome: 28.6 } },
];

export default function IncomeStatementChart() {
  return (
    <GroupedColumnChart
      data={data}
      series={series}
      showValueLabels
      showLegend={false}
      valueFractionDigits={1}
      unit="억원"
      yAxisStep={50}
      ariaLabel="2022년부터 2024년까지 매출·영업이익·순이익 비교"
    />
  );
}`

const GROUPED_COLUMN_SERIES: GroupedColumnSeries[] = [
    {key: '2022', label: '2022년', color: 'var(--ds-chart-4)'},
    {key: '2023', label: '2023년', color: 'var(--ds-chart-2)'},
    {key: '2024', label: '2024년', color: 'var(--ds-chart-1)'},
]

const GROUPED_COLUMN_DATA: GroupedColumnItem[] = [
    {id: 'assets', label: '총자산', values: {'2022': 11826, '2023': 17168, '2024': 18768}},
    {id: 'equity', label: '자본총계', values: {'2022': 5332, '2023': 5130, '2024': 5191}},
    {id: 'liabilities', label: '부채총계', values: {'2022': 6494, '2023': 12038, '2024': 13577}},
    {id: 'sales', label: '매출액', values: {'2022': 16329, '2023': 18115, '2024': 18243}},
    {id: 'operating-profit', label: '영업이익', values: {'2022': 1042, '2023': 497, '2024': 821}},
    {id: 'net-income', label: '순이익', values: {'2022': 821, '2023': 466, '2024': 60}},
]

const BALANCE_SHEET_SERIES: GroupedColumnSeries[] = [
    {key: 'assets', label: '총자산', color: 'var(--ds-chart-4)'},
    {key: 'liabilities', label: '부채', color: 'var(--ds-chart-3)'},
    {key: 'equity', label: '자본', color: 'var(--ds-chart-2)'},
]

const BALANCE_SHEET_DATA: GroupedColumnItem[] = [
    {id: '2022', label: '2022', values: {assets: 286.4, liabilities: 138.2, equity: 148.2}},
    {id: '2023', label: '2023', values: {assets: 305.2, liabilities: 141.8, equity: 163.4}},
    {id: '2024', label: '2024', values: {assets: 324.8, liabilities: 142.6, equity: 182.2}},
]

const INCOME_STATEMENT_SERIES: GroupedColumnSeries[] = [
    {key: 'sales', label: '매출', color: 'var(--ds-chart-4)'},
    {key: 'operatingProfit', label: '영업이익', color: 'var(--ds-chart-1)'},
    {key: 'netIncome', label: '순이익', color: 'var(--ds-chart-3)'},
]

const INCOME_STATEMENT_DATA: GroupedColumnItem[] = [
    {id: '2022', label: '2022', values: {sales: 221.6, operatingProfit: 28.4, netIncome: 20.8}},
    {id: '2023', label: '2023', values: {sales: 244.8, operatingProfit: 34.1, netIncome: 24.6}},
    {id: '2024', label: '2024', values: {sales: 267.4, operatingProfit: 38.2, netIncome: 28.6}},
]

const COLUMN_CODE = `import {
  ColumnChart,
  type ColumnChartItem,
} from '@/components/custom/column-chart';

// 하나의 지표를 기간·항목별 단일 막대로 비교합니다.
const annualSales: ColumnChartItem[] = [
  { id: '2022', label: '2022', value: 456075, color: 'var(--ds-chart-2)' },
  { id: '2023', label: '2023', value: 452875, color: 'var(--ds-chart-5)' },
  { id: '2024', label: '2024', value: 466542, color: 'var(--ds-chart-1)' },
];

export default function AnnualSalesChart() {
  return (
    <ColumnChart
      data={annualSales}
      barWidth={80}
      unit="천원"
      yAxisStep={50000}
      ariaLabel="2022년부터 2024년까지 인당 매출액 비교"
    />
  );
}`

const COLUMN_DATA: ColumnChartItem[] = [
    {id: '2022', label: '2022', value: 456075, color: 'var(--ds-chart-2)'},
    {id: '2023', label: '2023', value: 452875, color: 'var(--ds-chart-5)'},
    {id: '2024', label: '2024', value: 466542, color: 'var(--ds-chart-1)'},
]

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
        'PercentageDonutChart',
        'data',
        '항목별 고유 id, 표시명, 비중, 건수와 semantic chart 색상을 전달합니다.',
        '-',
        'PercentageDonutItem[]',
    ],
    ['PercentageDonutChart', 'ariaLabel', '도넛 차트가 비교하는 분류 기준과 데이터 범위를 설명합니다.', '-', 'string'],
    [
        'ScoreBenchmarkChart',
        'data',
        '점수명, 점수, 상태, 요약, 비교 기준명·비율과 상태 색상 tone을 전달합니다. 점수와 비율은 0~100 범위로 표시합니다.',
        '-',
        'ScoreBenchmarkData',
    ],
    [
        'ScoreBenchmarkChart',
        'ariaLabel',
        '원형 점수와 비교 기준 비율이 나타내는 데이터 범위를 설명합니다.',
        '-',
        'string',
    ],
    [
        'SemicircleRatingGauge',
        'data',
        '등급 라벨, 설명, 게이지 표시 비율, 부가 정보 목록과 상태 색상 tone을 전달합니다. 비율은 0~100 범위로 표시합니다.',
        '-',
        'SemicircleRatingData',
    ],
    ['SemicircleRatingGauge', 'title', '툴팁과 보조 설명에 사용할 게이지 제목을 전달합니다.', '-', 'string'],
    ['SemicircleRatingGauge', 'ariaLabel', '반원형 게이지가 나타내는 등급과 평가 기준을 설명합니다.', '-', 'string'],
    ['RatingMatrix', 'rows', '지표별 고유 id·표시명과 하나의 평가등급을 전달합니다.', '-', 'RatingMatrixRow[]'],
    ['RatingMatrix', 'ariaLabel', '표가 비교하는 행 지표와 평가등급의 범위를 설명합니다.', '-', 'string'],
    [
        'ComparisonRadarChart',
        'data',
        '지표별 고유 id·표시명과 주 대상·비교 대상의 0~100 값을 전달합니다.',
        '-',
        'ComparisonRadarItem[]',
    ],
    [
        'ComparisonRadarChart',
        'primaryLabel · comparisonLabel',
        '범례·툴팁·숨김 데이터 표에 표시할 두 비교 대상의 이름을 전달합니다.',
        '-',
        'string',
    ],
    ['ComparisonRadarChart', 'ariaLabel', '레이더 차트에서 비교하는 대상과 지표 범위를 설명합니다.', '-', 'string'],
    [
        'GroupedColumnChart',
        'data',
        '항목별 고유 id·표시명과 series key에 대응하는 숫자 값을 전달합니다.',
        '-',
        'GroupedColumnItem[]',
    ],
    [
        'GroupedColumnChart',
        'series',
        '묶음으로 비교할 계열의 고유 key·표시명·semantic chart 색상을 전달합니다.',
        '-',
        'GroupedColumnSeries[]',
    ],
    ['GroupedColumnChart', 'unit', '툴팁과 접근성 표의 숫자 뒤에 표시할 단위를 전달합니다.', 'undefined', 'string'],
    ['GroupedColumnChart', 'showValueLabels', '각 막대 위에 포맷된 숫자 값을 표시합니다.', 'false', 'boolean'],
    ['GroupedColumnChart', 'showLegend', '차트 아래 원형 범례 표시 여부를 설정합니다.', 'true', 'boolean'],
    [
        'GroupedColumnChart',
        'valueFractionDigits',
        '툴팁·막대 라벨·접근성 표에 표시할 소수점 자릿수를 지정합니다.',
        '0',
        'number',
    ],
    [
        'GroupedColumnChart',
        'yAxisStep',
        'Y축 눈금 간격을 지정합니다. 생략하면 데이터 범위에 맞춰 자동 계산합니다.',
        'undefined',
        'number',
    ],
    ['GroupedColumnChart', 'ariaLabel', '묶음 세로 막대 차트가 비교하는 항목·계열·기간을 설명합니다.', '-', 'string'],
    ['ColumnChart', 'data', '단일 계열의 항목별 id·표시명·숫자 값과 선택 색상을 전달합니다.', '-', 'ColumnChartItem[]'],
    ['ColumnChart', 'barWidth', '막대 하나의 너비를 px 단위로 지정하며 16~120 범위로 보정합니다.', '56', 'number'],
    [
        'ColumnChart',
        'color',
        '개별 항목에 color가 없을 때 사용할 기본 semantic chart 색상입니다.',
        'ds-chart-1',
        'string',
    ],
    ['ColumnChart', 'unit', '툴팁과 접근성 표의 숫자 뒤에 표시할 단위를 전달합니다.', 'undefined', 'string'],
    ['ColumnChart', 'showValueLabels', '각 막대 위에 포맷된 숫자 값을 표시합니다.', 'true', 'boolean'],
    ['ColumnChart', 'valueFractionDigits', '툴팁·막대 라벨의 소수점 자릿수를 지정합니다.', '0', 'number'],
    ['ColumnChart', 'yAxisStep', 'Y축 눈금 간격을 지정합니다.', 'undefined', 'number'],
    ['ColumnChart', 'ariaLabel', '단일 세로 막대 차트가 비교하는 지표와 기간을 설명합니다.', '-', 'string'],
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
const RECHARTS_LICENSE: LicenseLink = {
    name: 'Recharts',
    href: 'https://github.com/recharts/recharts/blob/main/LICENSE',
}
const WORD_CLOUD_LICENSE: LicenseLink = {
    name: 'WordCloud2.js',
    href: 'https://github.com/timdream/wordcloud2.js/blob/gh-pages/LICENSE',
}

const ChartGuidePage = () => (
    <GuidePageShell
        title="차트 (Chart)"
        description="실제 데이터에 따라 표현되는 네트워크·정량 차트와 접근 가능한 등급 매트릭스입니다. 모든 시각화 색상은 semantic chart 토큰을 사용합니다."
    >
        <BaseCard>
            <section aria-labelledby="chart-company-network" className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h2 id="chart-company-network" className="typo-h4-bold">
                        연계기업 네트워크 (CompanyRelationshipGraph)
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
                        산업별 공급망 분포 (NetworkGraph)
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
            <section aria-labelledby="chart-technology-holdings" className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 id="chart-technology-holdings" className="typo-h4-bold">
                            기업 보유기술 (PercentageDonutChart)
                        </h2>
                        <ul className="typo-body-l-regular text-foreground-subtle mt-1 flex flex-col gap-1">
                            {[
                                '기술 분류별 보유 비중과 건수를 도넛과 범례로 함께 비교합니다.',
                                '공간이 충분한 비율값은 조각 위에, 좁은 조각은 충돌을 피한 연결선에 표시합니다.',
                                '브라우저 너비가 바뀌면 차트 크기를 다시 계산하므로 라벨이 짧은 시간 뒤 재배치될 수 있습니다.',
                                '중간·모바일 화면에서는 차트와 범례를 세로로 배치해 라벨 영역을 확보합니다.',
                            ].map((description) => (
                                <li key={description} className="flex items-start gap-1.5">
                                    <ListMarker type="unordered" level={1} />
                                    <span>{description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Badge color="neutral">소분류 기준</Badge>
                </div>
                <div className="bg-background border-border overflow-hidden rounded-xl border p-4 sm:p-6">
                    <TechnologyHoldingsDemo />
                </div>
                <CodeBlock
                    code={TECHNOLOGY_HOLDINGS_CODE}
                    language="tsx"
                    copyLabel="PercentageDonutChart 데이터 연결 코드 복사"
                />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-innovation-growth-index" className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 id="chart-innovation-growth-index" className="typo-h4-bold">
                            혁신성장역량지수 (ScoreBenchmarkChart)
                        </h2>
                        <p className="typo-body-l-regular text-foreground-subtle">
                            Tech-Index 점수와 진단 상태, 동일업종 내 상위 비율을 함께 표시합니다.
                        </p>
                    </div>
                    <Badge color="neutral">2025.12.04 기준</Badge>
                </div>
                <div className="bg-background border-border overflow-hidden rounded-xl border p-4 sm:p-6">
                    <InnovationGrowthIndexDemo />
                </div>
                <CodeBlock
                    code={INNOVATION_GROWTH_INDEX_CODE}
                    language="tsx"
                    copyLabel="ScoreBenchmarkChart 데이터 연결 코드 복사"
                />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-credit-rating" className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h2 id="chart-credit-rating" className="typo-h4-bold">
                        기업신용등급 (SemicircleRatingGauge)
                    </h2>
                    <ul className="typo-body-l-regular text-foreground-subtle mt-1 flex flex-col gap-1">
                        {[
                            'data에 등급·설명·게이지 값·평가일자·결산일자·tone을 전달합니다.',
                            '등급 코드에 따른 tone 매핑은 API 변환 단계에서 프로젝트 정책에 맞게 연결합니다.',
                            'score는 반원 게이지의 표시 비율입니다. 현재 예시는 화면 확인용 임시값이며, 실제 연동 시 API 값 또는 확정된 등급별 기준을 사용해야 합니다.',
                            '3자 이상 등급은 글자 크기와 설명 간격을 자동 조정하며 전체 원문은 접근성 텍스트에 유지합니다.',
                        ].map((description) => (
                            <li key={description} className="flex items-start gap-1.5">
                                <ListMarker type="unordered" level={1} />
                                <span>{description}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="typo-body-m-regular text-foreground-subtle mt-2">
                        등급 체계 참고:{' '}
                        <a
                            href="https://www.nicerating.com/disclosure/longTermGrade.do"
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline underline-offset-4"
                        >
                            NICE신용평가 장기등급 정의
                        </a>
                        {' · '}
                        <a
                            href="https://korearatings.com/cms/frCmnCon/index.do?MENU_ID=240"
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline underline-offset-4"
                        >
                            한국기업평가 장기 신용등급
                        </a>
                    </p>
                </div>
                <div className="bg-background border-border overflow-visible rounded-xl border p-4 sm:p-6">
                    <CreditRatingDemo />
                </div>
                <CodeBlock
                    code={CREDIT_RATING_CODE}
                    language="tsx"
                    copyLabel="SemicircleRatingGauge 데이터 연결 코드 복사"
                />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-business-performance" className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h2 id="chart-business-performance" className="typo-h4-bold">
                        기업 경영지표 등급 (RatingMatrix)
                    </h2>
                    <ul className="typo-body-l-regular text-foreground-subtle mt-1 flex flex-col gap-1">
                        {[
                            'Recharts 전용 차트가 아닌 시맨틱 table 기반의 커스텀 등급 매트릭스입니다.',
                            '각 지표에는 하나의 등급만 전달하며 데이터 타입에서 행당 단일 체크를 보장합니다.',
                            '작은 화면에서는 열 너비를 유지하고 표 영역만 가로로 이동해 전체 등급을 확인합니다.',
                        ].map((description) => (
                            <li key={description} className="flex items-start gap-1.5">
                                <ListMarker type="unordered" level={1} />
                                <span>{description}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-background border-border overflow-hidden rounded-xl border p-4 sm:p-6">
                    <RatingMatrix
                        rows={BUSINESS_PERFORMANCE_ROWS}
                        ariaLabel="기업 경영지표별 취약·미흡·보통·양호·우수 평가등급"
                    />
                </div>
                <CodeBlock
                    code={BUSINESS_PERFORMANCE_MATRIX_CODE}
                    language="tsx"
                    copyLabel="RatingMatrix 데이터 연결 코드 복사"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-business-metric-radar" className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 id="chart-business-metric-radar" className="typo-h4-bold">
                            부문별 비교 (ComparisonRadarChart)
                        </h2>
                        <ul className="typo-body-l-regular text-foreground-subtle mt-1 flex flex-col gap-1">
                            {[
                                '조회기업과 업종평균의 경영지표 점수를 동일한 0~100 축에서 비교합니다.',
                                '실선·면은 조회기업, 점선은 업종평균으로 표현해 색상 외에도 형태로 구분합니다.',
                                '컨테이너 너비에 맞춰 차트가 자동 축소되며 전체 수치는 접근성 표로 함께 제공합니다.',
                            ].map((description) => (
                                <li key={description} className="flex items-start gap-1.5">
                                    <ListMarker type="unordered" level={1} />
                                    <span>{description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Badge color="neutral">조회기업 vs 업종평균</Badge>
                </div>
                <div className="bg-background border-border overflow-hidden rounded-xl border p-4 sm:p-6">
                    <ComparisonRadarChart
                        data={BUSINESS_METRIC_RADAR_DATA}
                        primaryLabel="조회기업"
                        comparisonLabel="업종평균"
                        ariaLabel="조회기업과 업종평균의 성장성·수익성·안정성·활동성·유동성·현금흐름 점수 비교"
                    />
                </div>
                <CodeBlock
                    code={BUSINESS_METRIC_RADAR_CODE}
                    language="tsx"
                    copyLabel="ComparisonRadarChart 데이터 연결 코드 복사"
                />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-grouped-column" className="flex flex-col gap-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 id="chart-grouped-column" className="typo-h4-bold">
                            최근 3개년 재무 현황 (GroupedColumnChart)
                        </h2>
                        <ul className="typo-body-l-regular text-foreground-subtle mt-1 flex flex-col gap-1">
                            {[
                                '항목마다 여러 기간·대상의 값을 나란히 배치해 증감과 규모를 비교합니다.',
                                'series를 추가하거나 제거하면 범례와 막대 묶음, 접근성 표의 열이 함께 변경됩니다.',
                                'X축 데이터와 series 구성을 바꾸고 값 라벨 옵션을 조합하면 재무상태표·손익계산서 형태로 확장할 수 있습니다.',
                                '작은 화면에서는 막대와 축의 최소 너비를 유지하고 차트 영역만 가로로 이동합니다.',
                                '막대에 마우스를 올리면 계열명·값·단위를 툴팁으로 확인할 수 있습니다.',
                            ].map((description) => (
                                <li key={description} className="flex items-start gap-1.5">
                                    <ListMarker type="unordered" level={1} />
                                    <span>{description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="bg-background border-border overflow-x-auto rounded-xl border p-4 sm:p-6">
                    <GroupedColumnChart
                        data={GROUPED_COLUMN_DATA}
                        series={GROUPED_COLUMN_SERIES}
                        unit="백만원"
                        yAxisStep={2000}
                        ariaLabel="최근 3개년 총자산·자본·부채·매출·영업이익·순이익 비교"
                    />
                </div>
                <CodeBlock
                    code={GROUPED_COLUMN_CODE}
                    language="tsx"
                    copyLabel="GroupedColumnChart 기본형 데이터 연결 코드 복사"
                />
                <div className="grid gap-6">
                    <section aria-labelledby="chart-grouped-column-balance-sheet" className="flex flex-col gap-3">
                        <h3 id="chart-grouped-column-balance-sheet" className="typo-title-l-bold">
                            재무상태표 배리에이션
                        </h3>
                        <div className="bg-background border-border overflow-x-auto rounded-xl border p-4 sm:p-6">
                            <GroupedColumnChart
                                data={BALANCE_SHEET_DATA}
                                series={BALANCE_SHEET_SERIES}
                                showValueLabels
                                showLegend={false}
                                valueFractionDigits={1}
                                unit="억원"
                                yAxisStep={50}
                                ariaLabel="2022년부터 2024년까지 총자산·부채·자본 비교"
                            />
                        </div>
                        <CodeBlock
                            code={GROUPED_COLUMN_VARIATION_CODE}
                            language="tsx"
                            copyLabel="GroupedColumnChart 재무상태표 코드 복사"
                        />
                    </section>
                    <section aria-labelledby="chart-grouped-column-income-statement" className="flex flex-col gap-3">
                        <h3 id="chart-grouped-column-income-statement" className="typo-title-l-bold">
                            손익계산서 배리에이션
                        </h3>
                        <div className="bg-background border-border overflow-x-auto rounded-xl border p-4 sm:p-6">
                            <GroupedColumnChart
                                data={INCOME_STATEMENT_DATA}
                                series={INCOME_STATEMENT_SERIES}
                                showValueLabels
                                showLegend={false}
                                valueFractionDigits={1}
                                unit="억원"
                                yAxisStep={50}
                                ariaLabel="2022년부터 2024년까지 매출·영업이익·순이익 비교"
                            />
                        </div>
                        <CodeBlock
                            code={GROUPED_COLUMN_INCOME_CODE}
                            language="tsx"
                            copyLabel="GroupedColumnChart 손익계산서 코드 복사"
                        />
                    </section>
                </div>
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-column" className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h2 id="chart-column" className="typo-h4-bold">
                        인당 매출액 (ColumnChart)
                    </h2>
                    <ul className="typo-body-l-regular text-foreground-subtle mt-1 flex flex-col gap-1">
                        {[
                            '하나의 지표를 기간이나 항목별 단일 막대로 비교합니다.',
                            '항목별 color를 전달하면 의미가 유지되는 semantic chart 색상으로 구분할 수 있습니다.',
                            '작은 화면에서는 축과 막대의 최소 너비를 유지하고 차트 영역만 가로로 이동합니다.',
                            '막대 위 값 라벨과 숨김 데이터 표를 함께 제공해 색상에만 의존하지 않습니다.',
                        ].map((description) => (
                            <li key={description} className="flex items-start gap-1.5">
                                <ListMarker type="unordered" level={1} />
                                <span>{description}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-background border-border overflow-x-auto rounded-xl border p-4 sm:p-6">
                    <ColumnChart
                        data={COLUMN_DATA}
                        barWidth={80}
                        unit="천원"
                        yAxisStep={50000}
                        ariaLabel="2022년부터 2024년까지 인당 매출액 비교"
                    />
                </div>
                <CodeBlock code={COLUMN_CODE} language="tsx" />
                <LicenseNotice libraries={[RECHARTS_LICENSE]} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-word-cloud" className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h2 id="chart-word-cloud" className="typo-h4-bold">
                        R&amp;D 이슈 워드클라우드 (WordCloud)
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
