// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {ArrowRight} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {StickyActionBar} from '@/components/composite/sticky-action-bar'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '하단 고정 액션 바 (StickyActionBar)'}

const USAGE_CODE = `import {StickyActionBar} from '@/components/composite/sticky-action-bar'

{/* 결과 목록 등을 담은 세로 묶음의 마지막 자식으로 둔다 */}
<div className="flex flex-col gap-10">
  …
  <StickyActionBar
    selection={[
      {label: '기업', value: '프롬엑스테크'},
      {label: '특허', value: '에너지 최적화 예측 플랫폼'},
    ]}
    message="보고서를 생성하실 경우 이용횟수 1회가 차감됩니다."
    action={<Button size="lg">보고서 생성</Button>}
  />
</div>`

const PROPS_ITEMS = [
    [
        'StickyActionBar',
        'selection',
        '고른 항목입니다. 이름표 옆 값은 칩(Badge outline · primary — 선택 목록 카드의 고른 상태와 같은 색)으로 보입니다. 항목마다 자리가 따로라 하나가 길어도 다른 항목이 가려지지 않습니다. 모바일은 줄마다, 태블릿 이상은 한 줄입니다(앞 항목 최대 40%, 마지막 항목은 나머지 폭). 넘치면 칩 안에서 말줄임 + 툴팁입니다.',
        '-',
        'readonly {label: string; value: string}[]',
    ],
    [
        'StickyActionBar',
        'message',
        '지금 상태 안내입니다(필수). 바뀌면 스크린리더가 읽습니다. selection 이 있으면 모바일은 버튼 아래 전체 폭에 가운데 정렬, 태블릿 이상은 고른 항목 아래에 왼쪽 정렬입니다.',
        '-',
        'ReactNode',
    ],
    ['StickyActionBar', 'description', '안내 아래 보조 한 줄입니다.', '-', 'ReactNode'],
    [
        'StickyActionBar',
        'tone',
        '안내의 강조 단계입니다. error 는 아이콘이 함께 나옵니다.',
        "'default'",
        "'default' | 'muted' | 'error'",
    ],
    ['StickyActionBar', 'action', '오른쪽 동작(버튼)입니다(필수).', '-', 'ReactNode'],
    ['StickyActionBar', 'className · div 속성', '바에 그대로 전달합니다.', '-', 'ComponentProps<div>'],
] as const

const StickyActionBarGuidePage = () => (
    <GuidePageShell
        title="하단 고정 액션 바 (StickyActionBar)"
        description="긴 목록을 내려도 화면 아래에 남아, 지금 상태 안내와 다음 동작을 보여 주는 바입니다."
    >
        <BaseCard>
            <section aria-labelledby="sab-usage" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="sab-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        화면 전체 폭의 띠이고, 내용은 본문 폭에 맞춥니다. 고른 항목이 없으면 안내와 버튼이 한 줄이고,
                        있으면 고른 항목과 버튼이 위 줄, 안내가 아래 줄입니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        바가 필요한 내용(결과 목록 등)을 담은 세로 묶음의 마지막 자식으로 둡니다. 부모 상자가 끝나면
                        함께 올라가 푸터를 가리지 않습니다. 그리드 칸 안에서는 따라오지 못합니다.
                    </li>
                    <li>
                        떠 있을 때는 반투명 · 배경 흐림 · 그림자이고, 내용 끝에 닿으면 푸터 위에 놓인 면이 됩니다(아래
                        상태 예시의 모습).
                    </li>
                    <li>
                        쓰는 화면의 <code>main</code> 에 <code>overflow-x-clip</code> 을 둡니다. 띠가 화면 폭이라
                        스크롤바 폭만큼 넘칠 수 있습니다.
                    </li>
                    <li>
                        모바일에서는 버튼을 <code>size=&quot;md&quot;</code> 로 둡니다.
                    </li>
                </ul>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sab-tone" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="sab-tone" className="typo-h4-bold">
                        상태
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아래 예시는 고정과 전체 폭을 풀고(<code>static ms-0 w-full translate-x-0</code>) 나란히 보여
                        줍니다.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <StickyActionBar
                        className="static ms-0 w-full translate-x-0"
                        tone="muted"
                        message="기업과 특허를 선택하면 보고서를 생성할 수 있습니다."
                        action={
                            <Button size="lg" disabled>
                                보고서 생성
                                <ArrowRight aria-hidden="true" />
                            </Button>
                        }
                    />
                    <StickyActionBar
                        className="static ms-0 w-full translate-x-0"
                        selection={[
                            {label: '기업', value: '프롬엑스테크'},
                            {label: '특허', value: '에너지 최적화 예측 플랫폼'},
                        ]}
                        message="보고서를 생성하실 경우 이용횟수 1회가 차감됩니다."
                        action={
                            <Button size="lg">
                                보고서 생성
                                <ArrowRight aria-hidden="true" />
                            </Button>
                        }
                    />
                    {/* 긴 이름 — 칩이 자리를 넘으면 칩 안에서 말줄임 + 툴팁. 좁은 화면에서는 두 칩이 8 띄워 쌓인다. */}
                    <StickyActionBar
                        className="static ms-0 w-full translate-x-0"
                        selection={[
                            {label: '기업', value: '주식회사글로벌인공지능에너지솔루션테크놀로지스인터내셔널'},
                            {
                                label: '특허',
                                value: '인공지능 기반 분산형 에너지 자원의 통합 관리 플랫폼을 이용한 실시간 산업 데이터 분석',
                            },
                        ]}
                        message="기관회원은 이용권 차감 없이 보고서가 생성됩니다."
                        action={
                            <Button size="lg">
                                보고서 생성
                                <ArrowRight aria-hidden="true" />
                            </Button>
                        }
                    />
                    <StickyActionBar
                        className="static ms-0 w-full translate-x-0"
                        tone="error"
                        message="재무정보와 특허 정보가 모두 확인되지 않아 보고서를 생성할 수 없습니다."
                        action={
                            <Button size="lg" disabled>
                                보고서 생성
                                <ArrowRight aria-hidden="true" />
                            </Button>
                        }
                    />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sab-a11y" className="flex flex-col gap-6">
                <h2 id="sab-a11y" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>안내는 aria-live 로 바뀔 때 읽힙니다[8.2.1].</li>
                    <li>진행 불가는 색뿐 아니라 아이콘과 문구로 전합니다[5.3.1].</li>
                    <li>문서 순서상 내용 뒤에 있어, 읽기 · Tab 순서가 화면 흐름과 같습니다[7.3.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sab-props" className="flex flex-col gap-6">
                <h2 id="sab-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="StickyActionBar Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default StickyActionBarGuidePage
