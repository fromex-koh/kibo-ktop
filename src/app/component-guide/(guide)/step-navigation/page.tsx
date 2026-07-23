import type {Metadata} from 'next'
import type {ReactNode} from 'react'
import {BaseCard} from '@/components/composite/base-card'
import {StepNavigation} from '@/components/composite/step-navigation'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '스텝 내비게이션 (StepNavigation)'}

const USAGE_CODE = `import {StepNavigation} from '@/components/composite/step-navigation'

{/* 중간 단계 — 좌 이전(tertiary) · 우 다음(primary). 위치는 사용처에서 지정 */}
<StepNavigation
  className="sticky bottom-0"
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
        '바 컨테이너 스타일과 위치(sticky/fixed 등)를 지정합니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
] as const

// 반투명 확인용 데모 무대 — 바 뒤로 본문 콘텐츠를 깔아 bg-cta-surface 가 비치는 것을 보여준다.
// 콘텐츠는 장식(aria-hidden)이고, 바는 무대 하단에 겹쳐 둔다.
const DemoStage = ({children}: {children: ReactNode}) => (
    <div className="border-border relative h-40 overflow-hidden rounded-md border">
        <div
            aria-hidden="true"
            className="text-foreground-subtle typo-body-l-regular absolute inset-0 flex flex-col justify-end gap-1 px-6 pb-2"
        >
            <p>단계 본문 콘텐츠가 여기에 있고…</p>
            <p>반투명 CTA 바가 이 내용 위에 겹쳐 뜹니다.</p>
            <p>bg-cta-surface 라서 아래 본문이 살짝 비칩니다.</p>
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
                        버튼 라벨·유무·활성 상태만 바꿔 단계별 상황을 표현합니다. 각 데모는 바를 본문 콘텐츠 위에 겹쳐
                        놓아 <code className="font-mono">bg-cta-surface</code> 반투명 효과(뒤 내용이 비침)를 함께
                        보여줍니다.
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
                                <StepNavigation className="absolute inset-x-0 bottom-0" prev={c.prev} next={c.next} />
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
                        위치는 컴포넌트가 정하지 않습니다. 스크롤되는 본문 위에 고정하려면 사용처에서{' '}
                        <code className="font-mono">className=&quot;sticky bottom-0&quot;</code>(또는 fixed)를 줍니다.
                    </li>
                    <li>
                        배경은 반투명 토큰 <code className="font-mono">bg-cta-surface</code>로, 테마별로 알맞은 값을
                        따릅니다 — light=흰색 75%(시안), dark·mainpage=화이트 10% 프로스트(어두운 표면을 살짝 밝혀 바가
                        떠 보이게). 반투명은 본문 위에 겹쳐 뜰 때만 드러나므로, 아래 케이스 데모는 바를 본문 콘텐츠 위에
                        겹쳐 놓았습니다.
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
