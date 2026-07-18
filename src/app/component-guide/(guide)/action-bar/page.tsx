import type {Metadata} from 'next'
import {ArrowLeft, ArrowRight} from 'lucide-react'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {ActionBar, ActionBarCenter, ActionBarEnd, ActionBarStart} from '@/components/composite/action-bar'
import {BaseCard} from '@/components/composite/base-card'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '액션 바 (ActionBar)'}

const START_END_CODE = `{/* 왼쪽 "목록" · 오른쪽 "수정"/"저장" — Start/End 만 쓰면 자연히 양 끝에 붙는다 */}
{/* 한 ActionBar 안의 버튼은 모두 같은 size 로 통일한다(여기선 lg) */}
<ActionBar>
  <ActionBarStart>
    <Button variant="tertiary" size="lg">목록</Button>
  </ActionBarStart>
  <ActionBarEnd>
    <Button variant="secondary" size="lg">수정</Button>
    <Button size="lg">저장</Button>
  </ActionBarEnd>
</ActionBar>`

const CENTER_CODE = `{/* "이전" / "다음" — Center 만 쓰면 Start/End 없이도 컨테이너 정중앙에 온다 */}
<ActionBar>
  <ActionBarCenter>
    <Button variant="secondary" size="2xl">
      <ArrowLeft aria-hidden="true" />
      이전
    </Button>
    <Button size="2xl">
      다음
      <ArrowRight aria-hidden="true" />
    </Button>
  </ActionBarCenter>
</ActionBar>`

// 조합 API 설명 — [이름, 설명]
const COMPOSITION = [
    ['ActionBar', '3구역 그리드 루트(grid-cols-[1fr_auto_1fr] + gap-x-4). Start/Center/End 를 필요한 것만 넣는다.'],
    ['ActionBarStart', '왼쪽 구역(1열). 예: 목록.'],
    ['ActionBarCenter', '가운데 구역(2열). Start/End 유무와 무관하게 컨테이너 정중앙에 고정된다. 예: 이전/다음.'],
    ['ActionBarEnd', '오른쪽 구역(3열). 예: 수정/저장.'],
] as const

// 액션 바 — 버튼들을 왼쪽·가운데·오른쪽 중 원하는 구역에 배치하는 레이아웃 컴포넌트. Figma "CTA" 반영.
const ActionBarGuidePage = () => (
    <GuidePageShell
        title="액션 바 (ActionBar)"
        description="버튼들을 화면 하단 등에서 왼쪽·가운데·오른쪽 3구역 중 필요한 곳에 배치하는 레이아웃 컴포넌트입니다. shadcn/radix 에 이 정렬만 전담하는 프리미티브가 없어 직접 합성했습니다(3열 grid — flex justify-between 과 달리 Center 가 항상 정확한 정중앙에 옵니다)."
    >
        <BaseCard>
            <section aria-labelledby="ab-start-end" className="flex flex-col gap-4">
                <div>
                    <h2 id="ab-start-end" className="typo-h4-bold">
                        왼쪽 + 오른쪽 — 목록 / 수정·저장
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">ActionBarStart</code>·
                        <code className="font-mono">ActionBarEnd</code>만 넣으면 각각 왼쪽 끝·오른쪽 끝에 붙습니다.
                        오른쪽처럼 여러 버튼을 한 구역에 넣을 수도 있습니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <ActionBar>
                        <ActionBarStart>
                            <Button variant="tertiary" size="lg">
                                목록
                            </Button>
                        </ActionBarStart>
                        <ActionBarEnd>
                            <Button variant="secondary" size="lg">
                                수정
                            </Button>
                            <Button size="lg">저장</Button>
                        </ActionBarEnd>
                    </ActionBar>
                </div>
                <CodeBlock code={START_END_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ab-center" className="flex flex-col gap-4">
                <div>
                    <h2 id="ab-center" className="typo-h4-bold">
                        가운데 — 이전 / 다음
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">ActionBarCenter</code> 만 넣으면{' '}
                        <code className="font-mono">ActionBarStart</code>/
                        <code className="font-mono">ActionBarEnd</code>가 없어도 컨테이너 정중앙에 옵니다(양 옆 컬럼이
                        똑같이 빈 1fr 이라 항상 반씩 나뉘기 때문). 자가진단 단계 이동처럼 두 버튼을 가운데 페어로 둘 때
                        씁니다.
                    </p>
                </div>
                <div className="border-border rounded-xl border p-6">
                    <ActionBar>
                        <ActionBarCenter>
                            <Button variant="secondary" size="2xl">
                                <ArrowLeft aria-hidden="true" />
                                이전
                            </Button>
                            <Button size="2xl">
                                다음
                                <ArrowRight aria-hidden="true" />
                            </Button>
                        </ActionBarCenter>
                    </ActionBar>
                </div>
                <CodeBlock code={CENTER_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="ab-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="ab-composition" className="typo-h4-bold">
                        구성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        액션 바는 루트와 최대 3개 구역으로 이뤄집니다. 쓰지 않는 구역은 생략하면 됩니다.
                    </p>
                </div>
                <dl className="flex flex-col gap-2">
                    {COMPOSITION.map(([name, desc]) => (
                        <div key={name} className="flex flex-col gap-0.5">
                            <dt className="typo-body-l-medium text-primary font-mono">{name}</dt>
                            <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ActionBarGuidePage
