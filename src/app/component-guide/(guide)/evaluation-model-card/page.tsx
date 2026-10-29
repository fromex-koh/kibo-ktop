// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import {
    EVALUATION_MODEL_CARD_OUTER_CLASS_NAME,
    EvaluationModelCardContent,
} from '@/components/custom/evaluation-model-card'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {EVALUATION_MODELS} from '@/content/service/evaluation-model-selection'

export const metadata: Metadata = {title: '평가모형 카드 (EvaluationModelCard)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {
  EVALUATION_MODEL_CARD_OUTER_CLASS_NAME,
  EVALUATION_MODEL_TONE_CLASS,
  EvaluationModelCardContent,
} from '@/components/custom/evaluation-model-card'

// 감싸는 쪽이 고르는 방식을 정한다 — 바깥 상자 + 모형 색(border) + 그라데이션이 보일 때(변형).
// 예: 탭 카드(플랫폼 소개 > 기술평가) — 고른 탭 · hover · 키보드 포커스 때 테두리가 비친다.
<TabsPrimitive.Trigger
  value={model.id}
  aria-labelledby={titleId}
  className={cn(
    EVALUATION_MODEL_CARD_OUTER_CLASS_NAME,
    EVALUATION_MODEL_TONE_CLASS[model.tone].border,
    'w-full text-left hover:bg-linear-to-br focus-visible:bg-linear-to-br data-[state=active]:bg-linear-to-br …',
  )}
>
  <EvaluationModelCardContent model={model} titleId={titleId} isArrowDesktopOnly />
</TabsPrimitive.Trigger>`

const USAGE_COLUMNS = [
    {key: 'screen', header: '쓰는 화면', align: 'start', rowHeader: true},
    {key: 'wrapper', header: '감싸는 방식', align: 'start', wrap: true},
    {key: 'border', header: '그라데이션 테두리가 보일 때', align: 'start', wrap: true},
    {key: 'arrow', header: '화살표', align: 'start', wrap: true},
] as const

const USAGE_ROWS = [
    {
        key: 'selection',
        cells: [
            '평가모형 선택(EvaluationModelSelection)',
            '라디오 — 카드 전체가 감춘 라디오의 label. 고른 뒤 [다음]',
            'hover · 고른 카드(has-checked) · 키보드 포커스(has-focus-visible)',
            '모든 폭',
        ],
    },
    {
        key: 'platform',
        cells: [
            '플랫폼 소개 > 기술평가(EvaluationModelTabs)',
            '탭 — 카드가 탭 단추. 처음엔 아무것도 고르지 않은 상태이고, 누르면 아래에 모형 소개(구조도 포함)가 떠오르며 나타나고 그 위치로 스크롤. 화면을 열면 카드 3장이 차례로 떠오름(0.3 · 0.4 · 0.5초 뒤)',
            'hover · 고른 탭(data-state=active) · 키보드 포커스(focus-visible)',
            'PC(xl)만 — isArrowDesktopOnly',
        ],
    },
]

const TONE_COLUMNS = [
    {key: 'tone', header: 'tone', align: 'start', rowHeader: true},
    {key: 'model', header: '모형', align: 'start'},
    {key: 'tokens', header: '토큰(면 · 약칭 · 테두리)', align: 'start', wrap: true},
] as const

const TONE_ROWS = [
    {key: 'blue', cells: ['blue', 'KTRS-FM 신속표준모형', 'model-card-blue · -foreground · -border-from → -border-to']},
    {
        key: 'mint',
        cells: ['mint', 'Tech-Index 혁신성장역량지수', 'model-card-mint · -foreground · -border-from → -border-to'],
    },
    {
        key: 'orange',
        cells: ['orange', '투자모형', 'model-card-orange · -foreground · -border-from → -border-to'],
    },
]

const PROPS_ITEMS = [
    [
        'EvaluationModelCardContent',
        'model',
        '모형 하나입니다(필수) — 약칭 · 제목 · 설명 · tone · 그림(content/service/evaluation-model-selection.ts).',
        '-',
        'EvaluationModel',
    ],
    [
        'EvaluationModelCardContent',
        'titleId',
        '제목의 id 입니다. 탭 카드가 탭 이름(aria-labelledby)으로 잇습니다.',
        '-',
        'string',
    ],
    [
        'EvaluationModelCardContent',
        'isArrowDesktopOnly',
        '오른쪽 아래 화살표를 PC(xl)에서만 보일지 정합니다. true 면 태블릿 · 모바일은 화살표 없이 아래 여백 32 입니다.',
        'false',
        'boolean',
    ],
    [
        'EVALUATION_MODEL_CARD_OUTER_CLASS_NAME',
        '-',
        '바깥 상자(1px 여백 · 반경 16). 이 면이 그라데이션 테두리가 됩니다.',
        '-',
        'string',
    ],
    [
        'EVALUATION_MODEL_TONE_CLASS',
        '[tone]',
        '모형별 surface · label · border(그라데이션 두 끝 색) 클래스입니다.',
        '-',
        'Record<tone, {surface; label; border}>',
    ],
] as const

const EvaluationModelCardGuidePage = () => (
    <GuidePageShell
        title="평가모형 카드 (EvaluationModelCard)"
        description="평가모형(KTRS-FM · Tech-Index · 투자모형) 카드의 겉모습입니다. 고르는 방식(라디오 · 탭)은 감싸는 쪽이 정합니다."
    >
        <BaseCard>
            <section aria-labelledby="evaluation-model-card-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="evaluation-model-card-usage" className="typo-h4-bold">
                        기본 모양
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        모형별 파스텔 면 · 약칭(14 Bold) · 제목(28 Bold) · 설명(14) · 그림 자리(높이 144) · 짙은 원형
                        화살표(48)입니다. 아래는 겉모습만 보인 것이고, 실제 화면은 라디오나 탭으로 감쌉니다 —{' '}
                        <Link href="/corp/home/technology-evaluation-model-selection" className={LINK_CLASS}>
                            평가모형 선택
                        </Link>{' '}
                        ·{' '}
                        <Link href="/corp/platform/technology-evaluation" className={LINK_CLASS}>
                            플랫폼 소개 &gt; 기술평가
                        </Link>
                        .
                    </p>
                </div>
                <ul className="grid list-none gap-6 md:grid-cols-3">
                    {EVALUATION_MODELS.map((model) => (
                        <li key={model.id}>
                            <div className={EVALUATION_MODEL_CARD_OUTER_CLASS_NAME}>
                                <EvaluationModelCardContent model={model} />
                            </div>
                        </li>
                    ))}
                </ul>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">쓰는 곳 · 감싸는 방식</h3>
                        <Table
                            caption="평가모형 카드를 감싸는 방식"
                            columns={USAGE_COLUMNS}
                            rows={USAGE_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">모형별 색(tone)</h3>
                        <Table caption="평가모형 카드의 모형별 색" columns={TONE_COLUMNS} rows={TONE_ROWS} size="md" />
                        <p className="typo-body-l-regular text-label-foreground">
                            색은 시맨틱 토큰 model-card-* 가 라이트 · 다크 값을 함께 정합니다. 원시 팔레트는 다크에서
                            단계가 뒤집혀 글자 대비가 무너지므로 쓰지 않습니다.
                        </p>
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">규격</h3>
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>반경 16 · 여백 위 · 좌우 32, 아래 24(화살표가 없으면 32).</li>
                            <li>
                                약칭과 제목 8 · 제목과 설명 16 · 설명과 그림 자리 32. 약칭이 없는 카드도 그 줄을 비워
                                제목 높이를 맞춥니다.
                            </li>
                            <li>
                                그림은 정해진 표시 크기로 자리의 가운데에 놓고, 좁은 카드에서는 폭에 맞춰 줄어듭니다.
                            </li>
                            <li>
                                제목은 단어 단위로 끊고, 한 단어가 칸보다 길면 그 안에서 줄을 바꿉니다 — 태블릿 3열에서
                                &apos;혁신성장역량지수&apos;가 두 줄이 됩니다(시안과 같음).
                            </li>
                            <li>테두리 — 바깥 상자(1px 여백)의 면을 그라데이션으로 칠합니다. 평소에는 투명합니다.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="evaluation-model-card-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="evaluation-model-card-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        고르는 동작 · 키보드 · 상태 전달은 감싸는 쪽(라디오 · Radix Tabs)이 맡습니다. 카드는 겉모습만
                        그립니다[8.2.1].
                    </li>
                    <li>
                        탭 카드는 제목만 탭 이름으로 읽도록 <code>titleId</code> 를 aria-labelledby 로 잇습니다 — 약칭 ·
                        설명까지 한 줄로 길게 읽히지 않게 합니다.
                    </li>
                    <li>그림과 화살표는 꾸밈이라 읽지 않습니다(alt=&quot;&quot; · aria-hidden)[5.1.1].</li>
                    <li>키보드 포커스는 그라데이션 테두리와 함께 포커스 링(outline-ring)으로 보입니다[6.1.2].</li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="evaluation-model-card-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="evaluation-model-card-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="EvaluationModelCard Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default EvaluationModelCardGuidePage
