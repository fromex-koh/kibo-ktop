import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import PropsTable from '@/components/guide/props-table'
import {CompanyNetworkDemo, IssueWordCloudDemo, SupplyNetworkDemo} from './chart-demo'

export const metadata: Metadata = {title: '차트 (Chart)'}

const NETWORK_CODE = `import { NetworkGraph } from '@/components/custom/network-graph';

<NetworkGraph
  nodes={nodes}
  links={links}
  ariaLabel="산업과 연계기업의 공급망 분포"
/>`

const WORD_CLOUD_CODE = `import { WordCloud } from '@/components/custom/word-cloud';

<WordCloud
  words={[
    { text: '인공지능', weight: 100 },
    { text: '학습', weight: 82 },
  ]}
  ariaLabel="최근 연구개발 이슈"
/>`

const PROPS_ITEMS = [
    ['CompanyRelationshipGraph', 'companyName', '네트워크 중심에 표시할 기준 기업명을 전달합니다.', '-', 'string'],
    [
        'CompanyRelationshipGraph',
        'sectors',
        '동적 산업 섹터와 각 섹터에 포함된 기업·관계 코드·EW등급 데이터를 전달합니다.',
        '-',
        'CompanySector[]',
    ],
    ['CompanyRelationshipGraph', 'ariaLabel', '연계기업 네트워크가 전달하는 핵심 관계를 설명합니다.', '-', 'string'],
    ['NetworkGraph', 'nodes', '기업·산업 노드와 상태·가중치·아이콘 데이터를 전달합니다.', '-', 'NetworkNode[]'],
    ['NetworkGraph', 'links', '노드 사이 연결 관계와 비중을 전달합니다.', '-', 'NetworkLink[]'],
    ['NetworkGraph', 'ariaLabel', '그래프가 전달하는 핵심 관계를 간결하게 설명합니다.', '-', 'string'],
    ['WordCloud', 'words', '단어와 중요도 가중치를 전달합니다.', '-', 'WordCloudItem[]'],
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
                    <p className="typo-body-l-regular text-foreground-subtle">
                        고정된 분석기업을 중심으로 동적인 산업 섹터와 섹터별 연계기업을 두 단계로 연결합니다. 섹터와
                        기업 수가 달라지면 방사형 각도와 위치를 다시 계산하며, 섹터와 기업 사이 숫자는 연계유형, 외곽
                        노드 색상은 기업별 EW등급을 나타냅니다. 중앙 분석기업과 산업 섹터는 고정되며, 외곽 기업 노드는
                        마우스로 이동해 겹친 관계를 직접 확인할 수 있습니다.
                    </p>
                </div>
                <div className="bg-background border-border overflow-hidden rounded-xl border p-4">
                    <CompanyNetworkDemo />
                </div>
                <LicenseNotice libraries={[CYTOSCAPE_LICENSE]} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="chart-supply-network" className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h2 id="chart-supply-network" className="typo-h4-bold">
                        산업별 공급망 분포
                    </h2>
                    <p className="typo-body-l-regular text-foreground-subtle">
                        여러 산업 중심 노드와 연계기업을 함께 배치합니다. 노드 크기는 가중치, 선의 숫자는 연결 비중을
                        의미합니다.
                    </p>
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
                    <p className="typo-body-l-regular text-foreground-subtle">
                        중요도에 따라 글자 크기를 계산하고 단어 간 충돌을 피해 자동 배치합니다. 모든 단어는 가독성을
                        위해 수평으로 유지합니다.
                    </p>
                </div>
                <div className="bg-background border-border overflow-hidden rounded-xl border p-4">
                    <IssueWordCloudDemo />
                </div>
                <LicenseNotice libraries={[WORD_CLOUD_LICENSE]} />
                <CodeBlock code={WORD_CLOUD_CODE} language="tsx" copyLabel="WordCloud 사용 코드 복사" />
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
