import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {LoadingState} from '@/components/composite/loading-state'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '로딩 상태 (LoadingState)'}

const USAGE_CODE = `import {LoadingState} from '@/components/composite/loading-state'

{/* 결과 자리를 그대로 대신한다 — 끝나면 목록 또는 EmptyState 로 바꿔 끼운다 */}
{isLoading ? (
  <LoadingState className="min-h-0 py-10" />
) : items.length > 0 ? (
  <ul>…</ul>
) : (
  <EmptyState title="조회 결과가 없습니다." className="min-h-0 py-10" />
)}`

const PROPS_ITEMS = [
    ['LoadingState', 'title', '한 줄 안내 문구입니다.', "'불러오는 중입니다.'", 'ReactNode'],
    [
        'LoadingState',
        'description',
        '제목 아래 보조 설명(14 Regular)입니다. 주면 제목이 16 Bold 본문 색으로 올라갑니다 — 오래 걸리는 처리 안내(대량정보조회 처리 중)에 씁니다.',
        'undefined',
        'ReactNode',
    ],
    ['LoadingState', 'className', '카드 면·모서리·높이처럼 자리에서 정할 값입니다.', 'undefined', 'string'],
] as const

// 로딩 상태 — EmptyState 와 같은 자리·모양으로 "불러오는 중"을 알린다.
const LoadingStateGuidePage = () => (
    <GuidePageShell
        title="로딩 상태 (LoadingState)"
        description="목록이나 검색 결과를 불러오거나 다시 그리는 동안 그 자리를 대신하는 안내입니다. EmptyState 와 같은 자리·모양이라 끝난 뒤 결과나 빈 상태로 바꿔 끼워도 흔들리지 않습니다."
    >
        <BaseCard>
            <section aria-labelledby="loading-state-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="loading-state-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기본 높이는 360(<code className="font-mono">min-h-90</code>)입니다. 모달처럼 좁은 자리는{' '}
                        <code className="font-mono">min-h-0 py-10</code> 으로 EmptyState 와 같은 높이를 씁니다.
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    <LoadingState className="bg-card min-h-52 rounded-lg" />
                    <LoadingState title="검색 결과를 불러오는 중입니다." className="bg-card min-h-0 rounded-lg py-10" />
                    {/* 제목 + 설명 — 대량정보조회 처리 중(카드 전체를 대신함, 높이 360) */}
                    <LoadingState
                        title="대량 조회 처리 중입니다."
                        description="파일을 분석하여 평가 데이터를 조회하고 있습니다."
                        className="bg-card rounded-lg"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="loading-state-a11y" className="flex flex-col gap-3">
                <h2 id="loading-state-a11y" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code className="font-mono">role=&quot;status&quot;</code> ·{' '}
                        <code className="font-mono">aria-live=&quot;polite&quot;</code> 로 불러오는 중임을
                        알립니다[8.2.1].
                    </li>
                    <li>도는 아이콘은 장식이라 감추고, 동작 줄이기 설정에서는 돌지 않습니다[6.3.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="loading-state-props" className="flex flex-col gap-4">
                <h2 id="loading-state-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="LoadingState Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default LoadingStateGuidePage
