// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import {CardActions, CountBadge, EvaluationDetail, EvaluationDetailList} from '@/components/custom/evaluation-card'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {VerificationApplicationCard} from '@/components/custom/verification-application-card'
import type {VerificationApplicationItem} from '@/constants/verification-application'

export const metadata: Metadata = {title: '평가 카드 (EvaluationCard)'}

// 가이드에서 보여 줄 예시 한 건 — 실제 화면은 조회 결과를 그대로 넘긴다.
const DEMO_ITEM: VerificationApplicationItem = {
    id: 'guide-verification-1',
    model: 'ktrs-fm',
    grade: 'AA',
    receivedAt: '2026-05-15',
    companyName: '(주)테크놀로지',
    businessNumber: '683-68-00428',
    verifyHref: '#',
    actions: [
        {label: '자가진단 일반 결과', href: '#'},
        {label: '보증추천', href: '#', opens: 'guarantee-recommendation'},
    ],
    history: [
        {
            id: 'guide-verification-1-history-1',
            team: '부산은행 재무팀',
            verifiedAt: '2026-05-15',
            grade: 'AA',
            actions: [
                {label: '평가검증 결과', href: '#'},
                {label: '보증이력', href: '#', opens: 'guarantee-history'},
            ],
        },
    ],
}

const CARD_CODE = `import {VerificationApplicationCard} from '@/components/custom/verification-application-card'

<VerificationApplicationCard
  item={item}
  isGuaranteeRecommended={recommendedIds.includes(item.id)}
  onGuaranteeCompleted={() => markRecommended(item.id)}
/>`

const BADGE_CODE = `import {CountBadge} from '@/components/custom/evaluation-card'

<CountBadge value="AA" unit="등급" />
<CountBadge value="86.6" unit="점" />
<CountBadge value="12" unit="개 기업" />`

const DETAIL_CODE = `import {EvaluationDetail, EvaluationDetailList} from '@/components/custom/evaluation-card'

<EvaluationDetailList>
  <EvaluationDetail label="접수일" value="2026-05-15" />
  <EvaluationDetail label="기업명" value="(주)테크놀로지" />
  <EvaluationDetail label="기업 사업자번호" value="683-68-00428" />
</EvaluationDetailList>`

const ACTIONS_CODE = `import {CardActions} from '@/components/custom/evaluation-card'

<CardActions
  actions={[
    {label: '개별평가 일반 결과', href: '/…/general-analysis/ktrs-fm?id=001', newWindow: true},
    {label: '보증추천', href: '#', opens: 'guarantee-recommendation'},
    {label: '은행전송', href: '#', done: true},
  ]}
  guaranteeDefaults={{guaranteeCompanyName: '(주)테크놀로지'}}
  onGuaranteeCompleted={() => markRecommended(item.id)}
/>`

const HREF_CODE = `// 같은 모형 카드가 여럿이면 주소가 같아지므로 건을 가르는 id 를 쿼리로 넘긴다
const generalResult = (model, id) => ({
  label: '개별평가 일반 결과',
  href: \`/org/mypage/evaluation-history/general-analysis/\${model}?id=\${id}\`,
  newWindow: true,
})`

const ACTION_COLUMNS = [
    {key: 'field', header: '필드', align: 'start', rowHeader: true},
    {key: 'type', header: '타입', align: 'start'},
    {key: 'note', header: '동작', align: 'start', wrap: true},
] as const

const ACTION_ROWS = [
    {key: 'label', cells: [<code key="f">label</code>, <code key="t">string</code>, '버튼 글자입니다.']},
    {
        key: 'href',
        cells: [
            <code key="f">href</code>,
            <code key="t">string</code>,
            '이동할 주소입니다. 기본은 같은 창의 링크입니다.',
        ],
    },
    {
        key: 'newWindow',
        cells: [
            <code key="f">newWindow</code>,
            <code key="t">boolean</code>,
            '새 창(리포트 창 크기)으로 엽니다. 같은 이름의 창을 재사용해 여러 번 눌러도 창이 쌓이지 않습니다.',
        ],
    },
    {
        key: 'opens',
        cells: [
            <code key="f">opens</code>,
            <code key="t">&apos;guarantee-recommendation&apos; | &apos;guarantee-history&apos;</code>,
            '화면 이동 대신 해당 모달을 여는 버튼이 됩니다.',
        ],
    },
    {
        key: 'done',
        cells: [
            <code key="f">done</code>,
            <code key="t">boolean</code>,
            '이미 마친 동작입니다. 링크가 아닌 비활성 button 으로 그려 키보드로도 눌리지 않습니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['CountBadge', 'value', '크게 보일 값입니다(등급·점수·개수).', '-', 'string'],
    ['CountBadge', 'unit', '값 뒤에 작게 붙는 단위입니다.', '-', 'string'],
    ['EvaluationDetail', 'label', '값 위에 놓이는 이름입니다.', '-', 'string'],
    [
        'EvaluationDetail',
        'value',
        '보여 줄 값입니다. 칸 최대 폭(max-w-40)을 넘으면 그 칸 안에서 줄을 바꿉니다.',
        '-',
        'string',
    ],
    ['EvaluationDetailList', 'children', 'EvaluationDetail 들입니다.', '-', 'ReactNode'],
    [
        'CardActions',
        'actions',
        '버튼 목록입니다. 항목 필드는 위 표를 따릅니다.',
        '-',
        'readonly EvaluationResultAction[]',
    ],
    [
        'CardActions',
        'guaranteeDefaults',
        '[보증추천] 모달이 미리 채울 값입니다.',
        'undefined',
        'Record<string, string>',
    ],
    ['CardActions', 'onGuaranteeCompleted', '[보증추천] 입력을 마쳤을 때 호출됩니다.', 'undefined', '() => void'],
    [
        'VerificationApplicationCard',
        'item',
        '카드 한 장이 그릴 신청 건입니다(검증 이력 포함).',
        '-',
        'VerificationApplicationItem',
    ],
    [
        'VerificationApplicationCard',
        'isGuaranteeRecommended',
        'true 면 [보증추천] 이 [보증이력] 으로 바뀝니다.',
        '-',
        'boolean',
    ],
    [
        'VerificationApplicationCard',
        'onGuaranteeCompleted',
        '[보증추천] 입력을 마쳤을 때 호출됩니다. 사용처가 그 건을 표시해 둡니다.',
        'undefined',
        '() => void',
    ],
] as const

const SUB_BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const SUB_LIST = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'

const EvaluationCardGuidePage = () => (
    <GuidePageShell
        title="평가 카드 (EvaluationCard)"
        description="평가결과 조회·평가검증 신청 조회의 결과 카드를 이루는 조각(값 배지·상세 줄·동작 버튼)과 조립된 신청 카드입니다."
    >
        <BaseCard>
            <section aria-labelledby="ec-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ec-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>VerificationApplicationCard</code> 는 모형명·결과값, 상세 줄과 [평가검증 하기], 동작 버튼,
                        검증 이력 펼침으로 이루어집니다. 펼침 줄은 <code>item.history</code> 가 있을 때만 나옵니다.
                    </p>
                </div>
                <div className="bg-background border-border rounded-md border p-6">
                    <VerificationApplicationCard item={DEMO_ITEM} isGuaranteeRecommended={false} />
                </div>
                <CodeBlock code={CARD_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ec-parts" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ec-parts" className="typo-h4-bold">
                        조각 컴포넌트
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>@/components/custom/evaluation-card</code> 에서 가져옵니다. 평가결과 목록과 평가검증 신청
                        카드가 함께 씁니다.
                    </p>
                </div>
                <div className={SUB_LIST}>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">값 배지 (CountBadge)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            등급·점수·기업 수를 같은 모양으로 보여 줍니다. 값은 크게, 단위는 작게 붙습니다.
                        </p>
                        <div className="border-border flex flex-wrap items-center gap-4 rounded-md border p-6">
                            <CountBadge value="AA" unit="등급" />
                            <CountBadge value="86.6" unit="점" />
                            <CountBadge value="12" unit="개 기업" />
                        </div>
                        <CodeBlock code={BADGE_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">상세 줄 (EvaluationDetailList)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            라벨 위, 값 아래로 놓이며 가로 24·세로 16 간격으로 줄이 바뀝니다. 칸은 값 길이를 따르되 최대
                            폭에서 멈추고, 긴 값은 그 칸 안에서 줄을 바꿉니다. 띄어쓸 곳이 없는 값은 낱말 안에서
                            끊습니다.
                        </p>
                        <div className="border-border flex flex-col gap-6 rounded-md border p-6">
                            <EvaluationDetailList>
                                <EvaluationDetail label="접수일" value="2026-05-15" />
                                <EvaluationDetail label="기업명" value="(주)테크놀로지" />
                                <EvaluationDetail label="기업 사업자번호" value="683-68-00428" />
                            </EvaluationDetailList>
                            <EvaluationDetailList>
                                <EvaluationDetail label="접수일" value="2026-05-15" />
                                <EvaluationDetail
                                    label="기업명"
                                    value="주식회사 대한민국첨단기술융합연구개발센터글로벌지주"
                                />
                                <EvaluationDetail label="기업 사업자번호" value="683-68-00428" />
                            </EvaluationDetailList>
                        </div>
                        <CodeBlock code={DETAIL_CODE} language="tsx" copyLabel="복사" />
                    </div>

                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">동작 버튼 (CardActions)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            버튼 수와 관계없이 카드 폭을 고르게 나누고, 좁은 화면(<code>sm</code> 미만)에서는 한 줄에
                            하나씩 쌓입니다. 라벨이 <code>접수취소</code> 인 버튼만 <code>secondary</code>, 나머지는{' '}
                            <code>tertiary</code> 입니다.
                        </p>
                        <div className="border-border flex flex-col gap-4 rounded-md border p-6">
                            <CardActions
                                actions={[
                                    {label: '개별평가 일반 결과', href: '#'},
                                    {label: '개별평가 심층 결과', href: '#'},
                                    {label: '보증추천', href: '#', opens: 'guarantee-recommendation'},
                                ]}
                            />
                            <CardActions
                                actions={[
                                    {label: '신청서 확인', href: '#'},
                                    {label: '접수취소', href: '#'},
                                    {label: '은행전송', href: '#', done: true},
                                ]}
                            />
                        </div>
                        <CodeBlock code={ACTIONS_CODE} language="tsx" copyLabel="복사" />
                        <Table caption="actions 항목 필드" columns={ACTION_COLUMNS} rows={ACTION_ROWS} size="md" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ec-href" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ec-href" className="typo-h4-bold">
                        결과 링크 주소
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        리포트 화면은 모형마다 경로가 하나라, 같은 모형 카드가 여럿이면 이웃한 링크의 주소가 같아집니다.
                        스크린리더가 같은 링크를 되풀이해 읽고 WAVE 가 Redundant link 로 잡으므로 건을 가르는 값을
                        쿼리로 넘깁니다[6.4.3].
                    </p>
                </div>
                <CodeBlock code={HREF_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ec-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ec-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>CountBadge</code> 는 보이는 두 조각을 <code>aria-hidden</code> 으로 감추고 “AA 등급” 한
                        문장을 <code>sr-only</code> 로 읽게 합니다[8.1.1].
                    </li>
                    <li>
                        <code>EvaluationDetail</code> 은 <code>dl</code> · <code>dt</code> · <code>dd</code> 로 “라벨:
                        값” 쌍이 읽힙니다[7.3.2].
                    </li>
                    <li>
                        <code>done</code> 버튼은 <code>disabled</code> button 이라 포커스되지 않습니다[6.1.1].
                    </li>
                    <li>
                        검증 이력 펼침 버튼은 <code>aria-expanded</code> · <code>aria-controls</code> 를 갖고, 이력
                        제목은 카드 제목(h3) 아래 h4(숨김)·h5 로 단계를 건너뛰지 않습니다[8.2.1][6.4.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ec-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="ec-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="평가 카드 조각들의 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default EvaluationCardGuidePage
