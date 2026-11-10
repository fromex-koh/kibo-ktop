// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import {ACTION_STYLE} from '@/components/custom/evaluation-card-action-style'
import {
    CountBadge,
    EvaluationCardActions,
    EvaluationDetail,
    EvaluationDetailList,
} from '@/components/custom/evaluation-card'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {VerificationApplicationCard} from '@/components/custom/verification-application-card'
import {EVALUATION_RESULT_ACTION_LABEL, type EvaluationResultActionType} from '@/constants/evaluation-result'
import type {VerificationApplicationItem} from '@/constants/verification-application'

export const metadata: Metadata = {title: '평가 카드 (EvaluationCard)'}

// 가이드에서 보여 줄 예시 한 건 — 실제 화면은 조회 결과를 그대로 넘긴다.
const DEMO_ITEM: VerificationApplicationItem = {
    id: 'guide-verification-1',
    model: 'ktrs-fm',
    grade: 'AA',
    receivedAt: '2026-05-15',
    receivedTime: '14:26',
    companyName: '(주)테크놀로지',
    businessNumber: '683-68-00428',
    verifyHref: '#',
    actions: [
        {type: 'self-diagnosis-general', href: '#'},
        {type: 'guarantee-recommendation', href: '#'},
    ],
    history: [
        {
            id: 'guide-verification-1-history-1',
            team: '부산은행 재무팀',
            verifiedAt: '2026-05-15',
            grade: 'AA',
            actions: [
                {type: 'verification-result', href: '#'},
                {type: 'guarantee-history', href: '#'},
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
  <EvaluationDetail label="접수일" value="2026-05-15 14:26" />
  <EvaluationDetail label="기업명" value="(주)테크놀로지" />
  <EvaluationDetail label="기업 사업자번호" value="683-68-00428" />
</EvaluationDetailList>`

const ACTIONS_CODE = `import {EvaluationCardActions} from '@/components/custom/evaluation-card'

// 버튼 글자 · 아이콘 · 주요/보조 · 자리는 종류(type)가 정한다 — 응답은 type 만 준다
<EvaluationCardActions
  actions={[
    {type: 'general-result', href: '/…/general-analysis/ktrs-fm?id=001', newWindow: true},
    {type: 'deep-result', href: '/…/deep-analysis/ktrs-fm?id=001', newWindow: true},
    {type: 'guarantee-recommendation', href: '#'}, // 모달을 연다
  ]}
  guaranteeDefaults={{guaranteeCompanyName: '(주)테크놀로지'}}
  onGuaranteeCompleted={() => markRecommended(item.id)}
/>

// 카드의 주요 동작이 데이터 밖에 있을 때 — 데이터 버튼은 모두 보조 · 왼쪽, end 가 오른쪽 primary
<EvaluationCardActions
  actions={item.actions}
  hasPrimary={false}
  end={
    <Button asChild size="sm">
      <Link href={item.verifyHref}><PencilLine aria-hidden="true" />평가검증 하기</Link>
    </Button>
  }
/>`

const HREF_CODE = `// 같은 모형 카드가 여럿이면 주소가 같아지므로 건을 가르는 id 를 쿼리로 넘긴다
const generalResult = (model, id) => ({
  type: 'general-result',
  href: \`/org/mypage/evaluation-history/general-analysis/\${model}?id=\${id}\`,
  newWindow: true,
})`

const ACTION_COLUMNS = [
    {key: 'field', header: '필드', align: 'start', rowHeader: true},
    {key: 'type', header: '타입', align: 'start'},
    {key: 'note', header: '동작', align: 'start', wrap: true},
] as const

const ACTION_ROWS = [
    {
        key: 'type',
        cells: [
            <code key="f">type</code>,
            <code key="t">EvaluationResultActionType</code>,
            '버튼 종류입니다. 글자 · 아이콘 · 주요/보조 · 자리 · 여는 모달이 이 값으로 정해집니다(아래 버튼 종류 표).',
        ],
    },
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
        key: 'done',
        cells: [
            <code key="f">done</code>,
            <code key="t">boolean</code>,
            '이미 마친 동작입니다. 링크가 아닌 비활성 button 으로 그려 키보드로도 눌리지 않습니다.',
        ],
    },
] as const

const TYPE_COLUMNS = [
    {key: 'type', header: 'type', align: 'start', rowHeader: true},
    {key: 'label', header: '버튼 글자', align: 'start'},
    {key: 'icon', header: '아이콘(lucide)', align: 'start'},
    {key: 'look', header: '모양 · 자리', align: 'start'},
    {key: 'screen', header: '쓰는 화면', align: 'start', wrap: true},
] as const

// 아이콘 · 모양 · 자리는 컴포넌트의 스타일 표(ACTION_STYLE · evaluation-card-action-style.ts)에서 읽는다 — 가이드에 따로 적지 않는다.
// 여기서는 화면에서의 쓰임만 적는다.
const TYPE_SCREENS: Readonly<Record<EvaluationResultActionType, string>> = {
    'self-diagnosis': '기업 평가결과 조회',
    'bank-transfer': '기업 평가결과 조회',
    guarantee: '기업 평가결과 조회',
    'general-result': '기관 평가결과 조회(개별평가)',
    'deep-result': '기관 평가결과 조회(개별평가)',
    'guarantee-recommendation': '기관 평가결과 조회(개별평가) — 모달 · 평가검증 신청 조회에서는 보조로 그림',
    'guarantee-history': '기관 평가결과 조회(개별평가) — 모달 · 평가검증 신청 조회에서는 보조로 그림',
    'self-diagnosis-general': '기관 평가검증 신청 조회',
    'verification-result': '기관 평가검증 신청 조회(이력)',
    cancel: '기관 평가결과 조회(일괄평가 · 대량정보조회 신청)',
    'excel-result': '기관 평가결과 조회(일괄평가 · 대량정보조회 신청)',
    'html-archive': '기관 평가결과 조회(일괄평가 · 대량정보조회 신청)',
    're-register': '기관 평가결과 조회(일괄평가 · 대량정보조회 신청)',
}

const isActionType = (value: string): value is EvaluationResultActionType => value in TYPE_SCREENS

const TYPE_ROWS = Object.keys(TYPE_SCREENS)
    .filter(isActionType)
    .map((type) => {
        const {icon: ActionIcon, variant, placement} = ACTION_STYLE[type]
        const look = `${variant === 'default' ? '주요(primary)' : '보조(secondary)'} · ${placement === 'end' ? '오른쪽' : '왼쪽'}`
        return {
            key: type,
            cells: [
                <code key="t">{type}</code>,
                EVALUATION_RESULT_ACTION_LABEL[type],
                <span key="i" className="inline-flex items-center gap-2">
                    <ActionIcon aria-hidden="true" className="size-icon-sm" />
                    <code>{ActionIcon.displayName}</code>
                </span>,
                look,
                TYPE_SCREENS[type],
            ],
        }
    })

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
        'EvaluationCardActions',
        'actions',
        '버튼 목록입니다. 항목 필드는 위 표를 따릅니다.',
        '-',
        'readonly EvaluationResultAction[]',
    ],
    [
        'EvaluationCardActions',
        'hasPrimary',
        'false 면 모든 버튼을 보조(secondary) · 왼쪽으로 그립니다. 주요 동작이 데이터 밖에 있거나(end) 보조 동작만 있을 때 씁니다.',
        'true',
        'boolean',
    ],
    [
        'EvaluationCardActions',
        'end',
        '오른쪽 끝에 더 붙일 주요 버튼입니다(예: [평가검증 하기]).',
        'undefined',
        'ReactNode',
    ],
    [
        'EvaluationCardActions',
        'guaranteeDefaults',
        '[보증추천] 모달이 미리 채울 값입니다.',
        'undefined',
        'Record<string, string>',
    ],
    [
        'EvaluationCardActions',
        'onGuaranteeCompleted',
        '[보증추천] 입력을 마쳤을 때 호출됩니다.',
        'undefined',
        '() => void',
    ],
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
        description="기업·기관 평가결과 조회와 평가검증 신청 조회의 결과 카드를 이루는 조각(값 배지·상세 줄·동작 버튼)과 조립된 신청 카드입니다."
    >
        <BaseCard>
            <section aria-labelledby="ec-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="ec-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>VerificationApplicationCard</code> 는 모형명·결과값, 상세 줄, 동작 버튼(보조는 왼쪽 ·
                        [평가검증 하기] 는 오른쪽 primary), 검증 이력 박스로 이루어집니다. 이력 박스는{' '}
                        <code>item.history</code> 가 있을 때만 나오고, 펼치면 테두리가 생기며 그 안에 이력이 이어집니다.
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
                <div className="flex flex-col gap-2">
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
                            등급·점수·기업 수를 같은 모양으로 보여 줍니다. 값은 크게, 단위는 작게 붙습니다. 카드
                            머리에서 제목(모형명 · 팀 이름)과 배지는 한 줄에 들어가는 동안 좌우로 놓이고, 폭이 모자랄
                            때만(모바일 · BBB+ 같은 긴 등급 · 긴 이름) 배지가 다음 줄로 내려갑니다. 말줄임으로 제목을
                            자르지 않습니다.
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
                                <EvaluationDetail label="접수일" value="2026-05-15 14:26" />
                                <EvaluationDetail label="기업명" value="(주)테크놀로지" />
                                <EvaluationDetail label="기업 사업자번호" value="683-68-00428" />
                            </EvaluationDetailList>
                            <EvaluationDetailList>
                                <EvaluationDetail label="접수일" value="2026-05-15 14:26" />
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
                        <h3 className="typo-title-m-bold text-foreground">동작 버튼 (EvaluationCardActions)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            마이페이지 공통 버튼 배치(
                            <Link
                                href="/component-guide/card-action-bar"
                                className="text-primary-strong underline underline-offset-4"
                            >
                                CardActionBar
                            </Link>
                            ) 위에서 버튼 종류(<code>type</code>)마다 글자 · 아이콘 · 주요/보조 · 자리를 정합니다.
                            보조는 왼쪽, 주요는 오른쪽 끝이고 버튼 폭은 글자만큼입니다. 640 미만에서는 주요 버튼이 맨 위
                            한 줄을 채웁니다.
                        </p>
                        <div className="border-border flex flex-col gap-4 rounded-md border p-6">
                            <EvaluationCardActions
                                actions={[
                                    {type: 'general-result', href: '#'},
                                    {type: 'deep-result', href: '#'},
                                    {type: 'guarantee-recommendation', href: '#'},
                                ]}
                            />
                            <EvaluationCardActions
                                actions={[
                                    {type: 'cancel', href: '#', done: true},
                                    {type: 'excel-result', href: '#'},
                                    {type: 'html-archive', href: '#'},
                                ]}
                            />
                        </div>
                        <CodeBlock code={ACTIONS_CODE} language="tsx" copyLabel="복사" />
                        <Table caption="actions 항목 필드" columns={ACTION_COLUMNS} rows={ACTION_ROWS} size="md" />
                        <p className="typo-body-l-regular text-label-foreground">
                            버튼 종류 — 글자는 <code>EVALUATION_RESULT_ACTION_LABEL</code>
                            (constants/evaluation-result.ts), 아이콘 · 모양 · 자리는 <code>ACTION_STYLE</code>
                            (evaluation-card.tsx)이 정합니다. 종류를 늘리면 두 표를 함께 채웁니다(빠뜨리면 타입 검사가
                            알려 줍니다).
                        </p>
                        <Table
                            caption="버튼 종류(type)별 글자 · 모양 · 쓰는 화면"
                            columns={TYPE_COLUMNS}
                            rows={TYPE_ROWS}
                            size="md"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ec-href" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
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
                        버튼 아이콘은 꾸밈이라 <code>aria-hidden</code> 이고, 버튼 이름은 글자입니다[5.1.1].
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
                <div className="flex flex-col gap-2">
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
