import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {EmptyState} from '@/components/composite/empty-state'
import {Button} from '@/components/ui/button'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '빈 상태 (EmptyState)'}

const USAGE_CODE = `{/* 목록 자리를 그대로 대신한다 — 카드 면·모서리는 사용처가 준다 */}
{items.length > 0 ? (
  <ul>…</ul>
) : (
  <EmptyState title="검색내역이 없습니다." className="bg-card min-h-52 rounded-lg" />
)}`

const OPTION_CODE = `{/* 설명과 액션은 시안에 없는 선택 슬롯이라 넘길 때만 나온다 */}
<EmptyState
  title="등록된 문의가 없습니다."
  description="궁금한 점이 있으면 1:1 문의를 남겨 주세요."
  action={<Button size="md">문의 등록</Button>}
/>`

const PROPS_ITEMS = [
    ['EmptyState', 'title', '한 줄 안내 문구입니다.', "'조회된 데이터가 없습니다.'", 'ReactNode'],
    ['EmptyState', 'description', '안내 아래 덧붙이는 설명입니다. 넘길 때만 나옵니다.', 'undefined', 'ReactNode'],
    [
        'EmptyState',
        'icon',
        '문구 위 아이콘입니다. null 을 주면 아이콘을 두지 않습니다.',
        '<CircleAlert />',
        'ReactNode',
    ],
    ['EmptyState', 'action', '안내 아래 버튼 자리입니다.', 'undefined', 'ReactNode'],
    ['EmptyState', 'className', '카드 면·모서리·높이처럼 자리에서 정할 값입니다.', 'undefined', 'string'],
] as const

const EmptyStateGuidePage = () => (
    <GuidePageShell
        title="빈 상태 (EmptyState)"
        description="목록이나 검색 결과에 보여 줄 것이 없을 때 그 자리를 대신하는 안내입니다. 결과가 없는 화면을 따로 만들지 않고 같은 자리에서 바꿔 끼웁니다."
    >
        <BaseCard>
            <section aria-labelledby="empty-state-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="empty-state-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        기본 높이는 360(<code className="font-mono">min-h-90</code>)이고, 목록 카드와 같은 흰 면을 쓰는
                        화면은 <code className="font-mono">className</code> 으로 면·모서리·높이를 맞춥니다.
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    <EmptyState title="검색내역이 없습니다." className="bg-card min-h-52 rounded-lg" />
                    <EmptyState
                        title="등록된 문의가 없습니다."
                        description="궁금한 점이 있으면 1:1 문의를 남겨 주세요."
                        action={
                            <Button type="button" size="md">
                                문의 등록
                            </Button>
                        }
                        className="bg-card rounded-lg"
                    />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={OPTION_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="empty-state-rule" className="flex flex-col gap-3">
                <h2 id="empty-state-rule" className="typo-h4-bold">
                    구현 기준
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        아이콘은 시안의 채운 알림 표시입니다. lucide 는 채움 아이콘을 따로 주지 않으므로{' '}
                        <code className="font-mono">CircleAlert</code> 의 원을 현재 색으로 채우고 느낌표만 대비색으로
                        덮습니다(단일 아이콘 라이브러리 유지 [NA-008]).
                    </li>
                    <li>
                        면·모서리·높이는 이 컴포넌트가 갖지 않습니다 — 목록 카드와 같은 면을 써야 하는 화면이 있고 회색
                        배경 위에 그대로 놓이는 화면도 있어 자리에서 정합니다.
                    </li>
                    <li>결과가 없을 때 페이지 이동(Pagination)은 함께 감추는 것이 기본입니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="empty-state-a11y" className="flex flex-col gap-3">
                <h2 id="empty-state-a11y" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        조회 결과가 바뀌면 화면을 보지 않아도 알 수 있도록{' '}
                        <code className="font-mono">role=&quot;status&quot;</code> ·{' '}
                        <code className="font-mono">aria-live=&quot;polite&quot;</code> 로 알립니다[8.2.1].
                    </li>
                    <li>아이콘은 장식이라 감춥니다 — 뜻은 문구가 전합니다[5.1.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="empty-state-props" className="flex flex-col gap-4">
                <h2 id="empty-state-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="EmptyState Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default EmptyStateGuidePage
