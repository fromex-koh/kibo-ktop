// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {TruncatedText} from '@/components/composite/truncated-text'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '말줄임 툴팁 (TruncatedText)'}

const LONG_TEXT =
    '차세대 이동통신 네트워크 환경에서 인공지능 기반 트래픽 예측 모델을 이용하여 기지국 간 부하를 분산하고 전송 품질을 유지하는 트래픽 관리 시스템 및 방법'
const SHORT_TEXT = '무선 통신 시스템에서 데이터 및 제어 정보 송수신 방법'

const USAGE_CODE = `import {TruncatedText} from '@/components/composite/truncated-text'

// 표 칸 안 긴 이름 — 두 줄을 넘으면 '…', 잘렸을 때만 툴팁으로 전체 이름을 보인다.
<TruncatedText lines={2} className="break-keep">
  {patent.title}
</TruncatedText>`

const INPUT_COLUMNS = [
    {key: 'device', header: '입력', align: 'start', rowHeader: true},
    {key: 'open', header: '열기', align: 'start', wrap: true},
    {key: 'close', header: '닫기', align: 'start', wrap: true},
] as const

const INPUT_ROWS = [
    {key: 'mouse', cells: ['마우스(PC)', '글 위에 올리기', '글 밖으로 나가기']},
    {key: 'keyboard', cells: ['키보드', 'Tab 으로 초점', '초점 이동 · Esc']},
    {
        key: 'touch',
        cells: ['터치(모바일 · 태블릿)', '탭', '같은 글 다시 탭 · 바깥 탭'],
    },
] as const

const USE_COLUMNS = [
    {key: 'where', header: '쓰는 곳', align: 'start', rowHeader: true},
    {key: 'lines', header: '줄 수', align: 'start'},
] as const

const USE_ROWS = [
    {
        key: 'patent-tables',
        cells: [
            'K-BIGx 웹 보고서 · 기술혁신정보 > 특허 보유현황 · 우수특허 — 특허명 · 출원인 · 권리자(각각) · 기술분야',
            '2',
        ],
    },
    {key: 'emerging', cells: ['K-BIGx 웹 보고서 · 기술혁신정보 > 이머징 기술 — 기술분야', '2']},
    {key: 'institutes', cells: ['K-BIGx 웹 보고서 · 기술혁신정보 > R&D 전문기관 현황 — 기관명', '2']},
    {
        key: 'government-rnd',
        cells: ['K-BIGx 웹 보고서 · 기술혁신정보 > 정부 R&D 사업 현황 — 전문기관 · 공고명 / 담당자', '2 / 1'],
    },
    {
        key: 'company-tables',
        cells: [
            'K-BIGx 웹 보고서 · 기업현황 > 경영진 · 주주 · 관계기업 · 매출처 · 매입처 — 이름 · 직위 · 관계 · 업종',
            '2',
        ],
    },
    {
        key: 'competitors',
        cells: ['K-BIGx 웹 보고서 · 기술혁신정보 > 경쟁기업 사업실적 — 기업명(차트 축, TruncationTooltip)', '1'],
    },
    {
        key: 'donut-legend',
        cells: ['PercentageDonutChart 범례 — 분류명(진단브리핑 기업 보유기술 · 기술 보유현황 · 담보 현황)', '1'],
    },
] as const

const PROPS_ITEMS = [
    ['TruncatedText', 'children', '보일 글입니다. 툴팁에도 같은 글이 그대로 나옵니다.', '-', 'string'],
    [
        'TruncatedText',
        'lines',
        '보이는 최대 줄 수입니다. 넘으면 마지막 줄 끝에 … — 1 은 줄바꿈 없이 폭을 꽉 채운 뒤 자릅니다(truncate).',
        '1',
        '1 | 2 | 3',
    ],
    [
        'TruncatedText',
        'suffix',
        "잘려도 끝에 남길 글입니다(예: ')'). 잘리면 '(한국전자통신연구…)' 처럼 '…' 뒤에 붙고, 스크린리더는 전체 글을 읽습니다.",
        '-',
        'string',
    ],
    ['TruncatedText', 'className', '글 상자에 덧붙일 클래스입니다(예: break-keep).', '-', 'string'],
    ['TruncationTooltip', 'content', '툴팁에 보일 전체 글입니다.', '-', 'string'],
    [
        'TruncationTooltip',
        'isTruncated',
        '잘렸는지 — true 일 때만 툴팁이 열립니다(자르는 쪽이 정합니다).',
        '-',
        'boolean',
    ],
    ['TruncationTooltip', 'children', '툴팁을 여는 글 요소 하나(span · SVG text 등)입니다.', '-', 'ReactElement'],
] as const

const TruncatedTextGuidePage = () => (
    <GuidePageShell
        title="말줄임 툴팁 (TruncatedText)"
        description="정해진 줄 수를 넘는 글을 '…'로 자르고, 실제로 잘렸을 때만 전체 글을 툴팁으로 보입니다."
    >
        <BaseCard>
            <section aria-labelledby="truncated-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="truncated-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        위 칸은 두 줄을 넘어 잘렸으므로 마우스를 올리거나 탭하면 툴팁이 열립니다. 아래 칸은 다 보여
                        툴팁이 없습니다. 창 폭이 바뀌면 다시 재서, 넓어져 다 보이면 툴팁도 꺼집니다.
                    </p>
                </div>
                <div className="border-subtle-3 typo-body-l-regular text-label-foreground flex max-w-80 flex-col divide-y rounded-sm border">
                    <div className="p-4">
                        <TruncatedText lines={2} className="break-keep">
                            {LONG_TEXT}
                        </TruncatedText>
                    </div>
                    <div className="p-4">
                        <TruncatedText lines={2} className="break-keep">
                            {SHORT_TEXT}
                        </TruncatedText>
                    </div>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="truncated-input" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="truncated-input" className="typo-h4-bold">
                        여닫는 방법
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        Radix Tooltip 은 터치를 무시하므로, 터치일 때만 컴포넌트가 열림 상태를 직접 바꿉니다(라이브러리
                        · ui 셸은 그대로).
                    </p>
                </div>
                <Table caption="말줄임 툴팁 여닫는 방법" columns={INPUT_COLUMNS} rows={INPUT_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="truncated-use" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="truncated-use" className="typo-h4-bold">
                        쓰는 곳
                    </h2>
                </div>
                <p className="typo-body-l-regular text-label-foreground">
                    K-BIGx 웹 보고서 표의 글 칸은 ReportTextCell(innovation-growth-report-parts)로 감쌉니다 — 법인 표기
                    (주) · 주식회사 를 이름과 붙이고, 띄어 쓴 글은 낱말 단위 · 띄어쓰기 없는 이름은 글자 단위로 줄을
                    바꿉니다.
                </p>
                <p className="typo-body-l-regular text-label-foreground">
                    차트 축 이름처럼 SVG 글자라 줄 수로 자를 수 없는 곳은 글을 직접 자르고 TruncationTooltip 만
                    감쌉니다. 여닫는 방법은 같지만, 그래프(role=&quot;img&quot;) 안이라 Tab 초점은 두지 않고 전체 이름은
                    숨김 표가 스크린리더에 읽어 줍니다.
                </p>
                <Table caption="말줄임 툴팁 쓰는 곳" columns={USE_COLUMNS} rows={USE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="truncated-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="truncated-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>잘린 글만 Tab 초점을 받습니다. 잘리지 않은 글은 Tab 순서에 넣지 않습니다[6.1.1].</li>
                    <li>말줄임은 화면에서만 자르므로 스크린리더는 원래부터 전체 글을 읽습니다.</li>
                    <li>초점 표시는 focus-visible 테두리입니다[6.1.2].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="truncated-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="truncated-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="TruncatedText Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default TruncatedTextGuidePage
