import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {BaseCard} from '@/components/composite/base-card'
import {StepHeader} from '@/components/composite/step-header'

export const metadata: Metadata = {title: '스텝 헤더 (StepHeader)'}

const USAGE_CODE = `<StepHeader
  title="1단계. 고객 정보 활용 동의"
  count={5}
  current={1}
  description="자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해주세요."
  nextLabel="2단계. 기업·기술정보 입력"
/>`

// 진행 케이스 — [current, nextLabel] (마지막 단계는 nextLabel 없음).
const PROGRESS_CASES: {current: number; title: string; description: string; nextLabel?: string}[] = [
    {
        current: 1,
        title: '1단계. 고객 정보 활용 동의',
        description: '자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해주세요.',
        nextLabel: '2단계. 기업·기술정보 입력',
    },
    {
        current: 3,
        title: '3단계. 평가모형 선택',
        description: '기업 상황에 맞는 평가모형을 선택해주세요.',
        nextLabel: '4단계. 자가진단 문항 응답',
    },
    {
        current: 5,
        title: '5단계. 결과 확인',
        description: '입력한 정보를 바탕으로 산출된 자가진단 결과입니다.',
    },
]

const PROPS_ITEMS = [
    ['title', '단계 제목. 페이지 최상단 제목이라 h1 로 렌더됩니다.', 'ReactNode'],
    ['count·current', '전체 단계 수 · 현재 단계(1부터). 내부 Stepper 로 전달됩니다.', 'number'],
    ['description', '제목 아래 보조 설명(선택).', 'ReactNode'],
    ['nextLabel', '우측 다음 단계 미리보기 라벨(선택 — 마지막 단계면 생략).', 'ReactNode'],
    ['className', '추가 클래스명으로 스타일 확장.', 'string'],
] as const

// 스텝 헤더 — 다단계 플로우 한 단계의 최상단 헤더(composite). Stepper + 제목/설명 + 다음단계 미리보기 조합.
const StepHeaderGuidePage = () => (
    <GuidePageShell
        title="스텝 헤더 (StepHeader)"
        description="다단계(마법사) 플로우 한 단계의 최상단 헤더입니다. 단계 제목·진행 스테퍼·설명과 다음 단계 미리보기를 한 묶음으로 제공합니다."
    >
        <section aria-labelledby="sh-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="sh-usage" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">title</code> + <code className="font-mono">count</code>·
                    <code className="font-mono">current</code> 로 제목과 진행 스테퍼를 함께 배치합니다.{' '}
                    <code className="font-mono">nextLabel</code> 은 우측에 다음 단계를 흐리게 미리 보여줍니다.
                </p>
            </div>
            <BaseCard>
                <StepHeader
                    title="1단계. 고객 정보 활용 동의"
                    count={5}
                    current={1}
                    description="자가진단 진행을 위해 기업의 정보제공 동의 여부를 확인해주세요."
                    nextLabel="2단계. 기업·기술정보 입력"
                />
            </BaseCard>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sh-progress" className="flex flex-col gap-4">
            <div>
                <h2 id="sh-progress" className="typo-h4-bold">
                    진행 (Progress)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">current</code> 에 따라 스테퍼가 완료·진행중·예정을 자동 계산합니다.
                    마지막 단계는 <code className="font-mono">nextLabel</code> 을 생략합니다.
                </p>
            </div>
            <BaseCard>
                <div className="flex flex-col gap-8">
                    {PROGRESS_CASES.map((c) => (
                        <StepHeader
                            key={c.current}
                            title={c.title}
                            count={5}
                            current={c.current}
                            description={c.description}
                            nextLabel={c.nextLabel}
                        />
                    ))}
                </div>
            </BaseCard>
        </section>

        <section aria-labelledby="sh-props" className="flex flex-col gap-4">
            <div>
                <h2 id="sh-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">StepHeader 에 넘기는 속성입니다.</p>
            </div>
            <dl className="flex flex-col gap-2">
                {PROPS_ITEMS.map(([name, desc, type]) => (
                    <div key={name} className="flex flex-col gap-0.5">
                        <dt className="typo-body-l-medium text-primary font-mono">
                            {name}
                            <span className="text-muted-foreground ml-2 font-normal">{type}</span>
                        </dt>
                        <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                    </div>
                ))}
            </dl>
        </section>
    </GuidePageShell>
)

export default StepHeaderGuidePage
