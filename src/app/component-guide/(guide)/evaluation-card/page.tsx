import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import {CardActions, CountBadge, EvaluationDetail, EvaluationDetailList} from '@/components/custom/evaluation-card'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
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

const CARD_CODE = `{/* 조립된 카드 — 값과 버튼은 모두 데이터가 정한다. 화면은 목록만 넘긴다 */}
<VerificationApplicationCard
  item={item}
  isGuaranteeRecommended={recommendedIds.includes(item.id)}
  onGuaranteeCompleted={() => markRecommended(item.id)}
/>`

const BADGE_CODE = `{/* 값 배지 — 값만 크고 단위는 작게 붙는다. 등급·점수·기업 수를 같은 모양으로 보여 준다.
    "AA 등급" 한 덩어리로 읽히도록 읽을 문장을 따로 두고 보이는 두 조각은 감춘다 */}
<CountBadge value="AA" unit="등급" />
<CountBadge value="86.6" unit="점" />
<CountBadge value="12" unit="개 기업" />`

const DETAIL_CODE = `{/* 상세 줄 — 라벨 위, 값 아래. 칸 폭은 값의 길이를 따르되 160 에서 멈춘다.
    긴 값은 자기 칸 안에서 다음 줄로 내려가므로 뒤따르는 칸이 밀리지 않는다 */}
<EvaluationDetailList>
  <EvaluationDetail label="접수일" value="2026-05-15" />
  <EvaluationDetail label="기업명" value="(주)테크놀로지" />
  <EvaluationDetail label="기업 사업자번호" value="683-68-00428" />
</EvaluationDetailList>`

const ACTIONS_CODE = `{/* 동작 버튼 — 버튼이 몇 개든 카드 폭을 고르게 나눈다. 좁은 화면에서는 한 줄에 하나씩 쌓인다.
    opens 를 주면 화면으로 가지 않고 그 모달을 여는 트리거가 된다 */}
<CardActions
  actions={[
    {label: '개별평가 일반 결과', href: '/…/general-analysis/ktrs-fm?id=001', newWindow: true},
    {label: '보증추천', href: '#', opens: 'guarantee-recommendation'},
    {label: '접수취소', href: '#'},
  ]}
  guaranteeDefaults={{guaranteeCompanyName: '(주)테크놀로지'}}
  onGuaranteeCompleted={() => {}}
/>`

const HREF_CODE = `{/* 같은 모형 카드가 둘 이상이면 결과 링크 주소가 같아진다 — 이웃한 링크가 같은 곳을 가리켜
    스크린리더가 같은 링크를 되풀이해 읽고 WAVE 도 Redundant link 로 잡는다.
    어느 건의 결과인지를 쿼리(id)로 넘겨 구분한다 */}
const generalResult = (model, id) => ({
  label: '개별평가 일반 결과',
  href: \`/org/mypage/evaluation-history/general-analysis/\${model}?id=\${id}\`,
  newWindow: true,
})`

const PROPS_ITEMS = [
    ['CountBadge', 'value', '크게 보일 값입니다(등급·점수·개수).', '-', 'string'],
    ['CountBadge', 'unit', '값 뒤에 작게 붙는 단위입니다("등급"·"점"·"개 기업").', '-', 'string'],
    ['EvaluationDetail', 'label', '값 위에 놓이는 이름입니다.', '-', 'string'],
    ['EvaluationDetail', 'value', '보여 줄 값입니다. 칸(160)을 넘으면 그 칸 안에서 줄을 바꿉니다.', '-', 'string'],
    [
        'EvaluationDetailList',
        'children',
        'EvaluationDetail 들입니다. 가로 24·세로 16 간격으로 놓입니다.',
        '-',
        'ReactNode',
    ],
    [
        'CardActions',
        'actions',
        '버튼 목록입니다. href 로 이동하고, newWindow 면 리포트 창으로, opens 면 모달을 엽니다. done 이면 잠깁니다.',
        '-',
        'EvaluationResultAction[]',
    ],
    [
        'CardActions',
        'guaranteeDefaults',
        '[보증추천] 모달이 미리 채울 값입니다. 그 카드가 들고 있는 기업 정보를 넘깁니다.',
        'undefined',
        'Record<string, string>',
    ],
    [
        'CardActions',
        'onGuaranteeCompleted',
        '보증추천 입력을 마쳤을 때 부릅니다. 사용처가 그 건을 표시해 두면 버튼이 [보증이력] 으로 바뀝니다.',
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
        '이 건의 보증추천 입력이 끝났는지입니다. true 면 [보증추천] 이 [보증이력] 으로 바뀝니다.',
        '-',
        'boolean',
    ],
    ['VerificationApplicationCard', 'onGuaranteeCompleted', '보증추천을 마쳤을 때 부릅니다.', '-', '() => void'],
] as const

const EvaluationCardGuidePage = () => (
    <GuidePageShell
        title="평가 카드 (EvaluationCard)"
        description="평가결과 조회·평가검증 신청 조회의 결과 카드를 이루는 조각들입니다. 값 배지·상세 줄·동작 버튼을 두 화면이 함께 쓰고, 조립된 카드는 화면마다 따로 둡니다."
    >
        <BaseCard>
            <section aria-labelledby="ec-card" className="flex flex-col gap-4">
                <div>
                    <h2 id="ec-card" className="typo-h4-bold">
                        조립된 카드
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        평가검증 신청 카드입니다. 모형명·결과값 / 상세 줄과 [평가검증 하기] / 동작 버튼 / 검증 이력
                        펼침으로 이루어집니다. 펼침 줄은 이력이 있을 때만 나옵니다.
                    </p>
                </div>
                <div className="bg-background border-border rounded-md border p-6">
                    <VerificationApplicationCard item={DEMO_ITEM} isGuaranteeRecommended={false} />
                </div>
                <CodeBlock code={CARD_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ec-badge" className="flex flex-col gap-4">
                <div>
                    <h2 id="ec-badge" className="typo-h4-bold">
                        값 배지 (CountBadge)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        카드 오른쪽 위에 놓이는 결과값입니다. 값과 단위가 한 덩어리로 읽히도록 읽을 문장을 따로 둡니다.
                    </p>
                </div>
                <div className="border-border flex flex-wrap items-center gap-4 rounded-md border p-6">
                    <CountBadge value="AA" unit="등급" />
                    <CountBadge value="86.6" unit="점" />
                    <CountBadge value="12" unit="개 기업" />
                </div>
                <CodeBlock code={BADGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ec-detail" className="flex flex-col gap-4">
                <div>
                    <h2 id="ec-detail" className="typo-h4-bold">
                        상세 줄 (EvaluationDetailList)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        칸 폭은 값의 길이를 따르되 160 에서 멈춥니다 — 기업명이 길어도 그 칸 안에서 줄이 바뀌어 뒤따르는
                        칸이 밀리지 않습니다. 띄어쓸 곳이 없는 영문 상호·긴 번호는 낱말 안에서 끊습니다.
                    </p>
                </div>
                <div className="border-border flex flex-col gap-6 rounded-md border p-6">
                    <EvaluationDetailList>
                        <EvaluationDetail label="접수일" value="2026-05-15" />
                        <EvaluationDetail label="기업명" value="(주)테크놀로지" />
                        <EvaluationDetail label="기업 사업자번호" value="683-68-00428" />
                    </EvaluationDetailList>
                    <EvaluationDetailList>
                        <EvaluationDetail label="접수일" value="2026-05-15" />
                        <EvaluationDetail label="기업명" value="주식회사 대한민국첨단기술융합연구개발센터글로벌지주" />
                        <EvaluationDetail label="기업 사업자번호" value="683-68-00428" />
                    </EvaluationDetailList>
                </div>
                <CodeBlock code={DETAIL_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ec-actions" className="flex flex-col gap-4">
                <div>
                    <h2 id="ec-actions" className="typo-h4-bold">
                        동작 버튼 (CardActions)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        버튼이 몇 개든 카드 폭을 고르게 나눕니다. 좁은 화면에서는 한 줄에 하나씩 쌓입니다.{' '}
                        <code className="font-mono">opens</code> 를 주면 화면으로 가지 않고 그 모달을 여는 트리거가
                        되고, <code className="font-mono">done</code> 이면 잠깁니다. [접수취소] 만 강조 외곽선입니다.
                    </p>
                </div>
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ec-href" className="flex flex-col gap-4">
                <div>
                    <h2 id="ec-href" className="typo-h4-bold">
                        결과 링크 주소
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        리포트 화면은 모형마다 경로가 하나뿐이라, 같은 모형 카드가 둘 이상이면 주소가 같아집니다. 어느
                        건의 결과인지를 쿼리로 구분해 같은 주소 링크가 이웃하지 않게 합니다.
                    </p>
                </div>
                <CodeBlock code={HREF_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ec-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="ec-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        CountBadge / EvaluationDetail / EvaluationDetailList / CardActions / VerificationApplicationCard
                        에 넘기는 속성입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="평가 카드 조각들의 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default EvaluationCardGuidePage
