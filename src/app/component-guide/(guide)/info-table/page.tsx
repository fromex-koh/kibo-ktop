// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {InfoTable} from '@/components/composite/info-table'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '정보 표 (InfoTable)'}

// 기업 정보 예시 — K-BIGx 기업혁신성장 보고서의 기업 정보 표와 같은 항목이다.
const COMPANY_ITEMS = [
    {label: '기업명', value: '프롬엑스테크'},
    {label: '대표자', value: '홍길동'},
    {label: '기업유형/형태', value: '유가증권시장/법인기업'},
    {label: '표준산업분류', value: '(C26299) 그 외 기타 전자부품 제조업'},
    {label: '대표기술분야', value: '-'},
    {label: '주요제품', value: '5G통신 및 IoT 관련 서비스'},
] as const

const USAGE_CODE = `import {InfoTable} from '@/components/composite/info-table'

<InfoTable
  aria-label="기업 정보"
  items={[
    {label: '기업명', value: '프롬엑스테크'},
    {label: '대표자', value: '홍길동'},
    {label: '기업유형/형태', value: '유가증권시장/법인기업'},
    {label: '표준산업분류', value: '(C26299) 그 외 기타 전자부품 제조업'},
  ]}
/>`

// 조합 API 설명 — [컴포넌트, 이름, 설명, 기본값, 타입]
const PROPS_ITEMS = [
    [
        'InfoTable',
        'items',
        '이름 칸(label)과 값 칸(value) 쌍의 목록입니다. key 를 주면 목록 key 로 씁니다.',
        '-',
        '{label, value, key?}[]',
    ],
    [
        'InfoTable',
        'className · dl props',
        '표 바깥 스타일과 네이티브 dl 속성(aria-label 등)을 전달합니다.',
        'undefined',
        'DlHTMLAttributes',
    ],
] as const

const InfoTableGuidePage = () => (
    <GuidePageShell
        title="정보 표 (InfoTable)"
        description="옅은 파란 이름 칸과 흰 값 칸을 한 줄에 두 쌍씩 늘어놓는 조회용 표입니다. 기업 정보처럼 '항목: 값' 쌍을 문서 안에 촘촘히 보여 줄 때 씁니다. 카드형 목록은 SummaryList 를 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="info-table-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="info-table-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        PC(1280 이상)는 한 줄에 두 쌍, 태블릿 · 모바일은 한 쌍씩 세로로 쌓입니다. 긴 값은 칸 안에서
                        줄바꿈되고 같은 줄의 칸이 함께 높아집니다. 가로 스크롤 없이 폭만 줄어들고, 이름 칸은 160(모바일
                        112)으로 고정됩니다. 창 폭을 줄여 확인해 보세요.
                    </p>
                </div>
                <InfoTable aria-label="기업 정보" items={COMPANY_ITEMS} />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="info-table-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="info-table-usage" className="typo-h4-bold">
                        Usage
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        마크업은 정의 목록(<code className="font-mono">dl · dt · dd</code>)이라 스크린리더가 &apos;이름:
                        값&apos; 쌍으로 읽습니다. 표 이름은 <code className="font-mono">aria-label</code>로 붙입니다.
                        사용처: K-BIGx 기업혁신성장 보고서 기업 정보.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="info-table-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="info-table-props" className="typo-h4-bold">
                        Props
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="InfoTable Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default InfoTableGuidePage
