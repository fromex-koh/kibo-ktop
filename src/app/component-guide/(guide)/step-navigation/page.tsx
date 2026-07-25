import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {BaseCard} from '@/components/composite/base-card'
import {StepNavigation} from '@/components/composite/step-navigation'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '스텝 내비게이션 (StepNavigation)'}

const USAGE_CODE = `import {StepNavigation} from '@/components/composite/step-navigation'

{/* 중간 단계 — 좌 이전(tertiary) · 우 다음(primary). 본문 끝에 그대로 붙는 블록이다 */}
<StepNavigation
  prev={{children: '이전', onClick: goPrev}}
  next={{children: '다음', onClick: goNext}}
/>

{/* 첫 단계 — prev 생략(오른쪽 다음만) */}
<StepNavigation next={{children: '다음', onClick: goNext}} />

{/* 마지막 단계 — 라벨만 바꾼다 */}
<StepNavigation
  prev={{children: '메인으로 이동', onClick: goMain}}
  next={{children: '결과조회', onClick: goResult}}
/>`

// 데모 케이스 — [id, 제목, 설명, StepNavigation props]
const CASES = [
    {
        id: 'mid',
        title: '중간 단계 (이전 / 다음)',
        desc: '가장 흔한 형태. 좌측 보조 버튼(이전)과 우측 주요 버튼(다음)을 콘텐츠 폭 양 끝에 둡니다.',
        prev: {children: '이전'},
        next: {children: '다음'},
    },
    {
        id: 'first',
        title: '첫 단계 (이전 없음)',
        desc: 'prev 를 생략하면 좌측을 비우고 우측 다음 버튼만 남습니다.',
        prev: undefined,
        next: {children: '다음'},
    },
    {
        id: 'last',
        title: '마지막 단계 (메인으로 이동 / 결과조회)',
        desc: '라벨만 바꿔 마무리 단계를 표현합니다. 버튼 스타일·배치는 동일합니다.',
        prev: {children: '메인으로 이동'},
        next: {children: '결과조회'},
    },
    {
        id: 'disabled',
        title: '다음 비활성 (입력 미완료)',
        desc: '검증이 끝나기 전에는 next 에 disabled 를 넘겨 다음 단계로 넘어가지 못하게 합니다.',
        prev: {children: '이전'},
        next: {children: '다음', disabled: true},
    },
] as const

const PROPS_ITEMS = [
    [
        'StepNavigation',
        'prev',
        '좌측 버튼(기본 tertiary · size 2xl). 생략 시 좌측을 비웁니다. children에 라벨, onClick·disabled 등 Button 속성을 넘깁니다.',
        'undefined',
        'ComponentProps<typeof Button>',
    ],
    [
        'StepNavigation',
        'next',
        '우측 버튼(기본 primary · size 2xl). Button 속성을 그대로 넘깁니다.',
        'undefined',
        'ComponentProps<typeof Button>',
    ],
    [
        'StepNavigation',
        'className · div props',
        '바 컨테이너에 추가 스타일을 전달합니다. 위치는 문서 흐름을 따르므로 별도 지정이 필요 없습니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
] as const

// 데모 무대 — 실제 배치 그대로, 본문 콘텐츠 아래에 바가 일반 블록으로 붙는다(고정·플로팅 아님).
// 콘텐츠는 장식(aria-hidden)이다.
const DemoStage = ({children}: {children: ReactNode}) => (
    <div className="border-border flex flex-col overflow-hidden rounded-md border">
        <div aria-hidden="true" className="text-foreground-subtle typo-body-l-regular flex flex-col gap-1 px-6 py-6">
            <p>단계 본문 콘텐츠가 여기까지 이어지고…</p>
            <p>CTA 바는 그 아래에 그대로 붙습니다.</p>
        </div>
        {children}
    </div>
)

// 스텝 내비게이션 — 단계형 화면 하단 CTA 바. ActionBar·Button 을 재사용한 합성 컴포넌트.
const StepNavigationGuidePage = () => (
    <GuidePageShell
        title="스텝 내비게이션 (StepNavigation)"
        description="단계형 화면 하단에 두는 CTA 바입니다. 전체폭 반투명 바 안에서 좌측 보조(이전)/우측 주요(다음) 버튼을 콘텐츠 폭 양 끝에 배치합니다. 3구역 정렬은 ActionBar, 버튼은 Button(size 2xl)을 그대로 재사용합니다."
    >
        <BaseCard>
            <section aria-labelledby="sn-cases" className="flex flex-col gap-4">
                <div>
                    <h2 id="sn-cases" className="typo-h4-bold">
                        케이스
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        버튼 라벨·유무·활성 상태만 바꿔 단계별 상황을 표현합니다. 바는 화면에 고정하지 않고 본문 끝에
                        일반 블록으로 붙으므로, 각 데모도 본문 콘텐츠 아래에 그대로 놓았습니다.
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    {CASES.map((c) => (
                        <div key={c.id} className="flex flex-col gap-2">
                            <div className="flex flex-col">
                                <p className="typo-body-l-medium text-foreground">{c.title}</p>
                                <p className="typo-body-l-regular text-muted-foreground">{c.desc}</p>
                            </div>
                            <DemoStage>
                                <StepNavigation prev={c.prev} next={c.next} />
                            </DemoStage>
                        </div>
                    ))}
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sn-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="sn-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        StepNavigation 에 넘기는 속성입니다. 버튼은 prev·next 에 Button props 로 구성합니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="StepNavigation Props 목록" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sn-notes" className="flex flex-col gap-4">
                <div>
                    <h2 id="sn-notes" className="typo-h4-bold">
                        사용 시 참고
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        바는 본문 마지막에 오는 일반 블록입니다. <code className="font-mono">sticky</code>·
                        <code className="font-mono">fixed</code> 로 띄우지 않아 본문을 가리지 않고, 짧은 화면에서도
                        버튼이 그대로 보입니다.
                    </li>
                    <li>
                        배경은 반투명 토큰 <code className="font-mono">bg-cta-surface</code>로, 테마별로 알맞은 값을
                        따릅니다 — light=흰색 75%(시안), dark·mainpage=화이트 10% 프로스트(어두운 표면을 살짝 밝혀 바가
                        떠 보이게).
                    </li>
                    <li>
                        버튼은 기존 Button(좌 tertiary · 우 primary · size 2xl)을 그대로 씁니다. disabled·asChild(Link)·
                        아이콘 등 Button 기능은 prev·next props 로 전달합니다.
                    </li>
                    <li>
                        좌우 배치는 ActionBar(3구역 grid)를 재사용하므로, prev 를 생략해도 next 는 우측에 정확히
                        고정됩니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default StepNavigationGuidePage
