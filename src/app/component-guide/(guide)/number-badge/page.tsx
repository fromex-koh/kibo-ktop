import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {NumberBadge} from '@/components/kit/badge'
import {SectionHeader, SectionHeaderAction, SectionHeaderTitle} from '@/components/composite/section-header'
import {Button} from '@/components/kit/button'

export const metadata: Metadata = {title: '숫자 배지 (NumberBadge)'}

const VARIANT_CODE = `{/* primary(기본, 브랜드 블루) / new(빨강 — 새로움·알림 강조) */}
<NumberBadge>2</NumberBadge>
<NumberBadge variant="new">5</NumberBadge>
<NumberBadge>12</NumberBadge>`

const USAGE_CODE = `{/* 제목 옆 건수 — SectionHeaderTitle 안에 인라인으로 조합 */}
<SectionHeader>
  <SectionHeaderTitle className="flex items-center gap-2">
    대표자 경력사항
    <NumberBadge>2</NumberBadge>
  </SectionHeaderTitle>
  <SectionHeaderAction>
    <Button variant="tertiary" size="small">수정</Button>
  </SectionHeaderAction>
</SectionHeader>`

// Props 설명 — [이름, 설명, 타입]
const PROPS_ITEMS = [
    ['variant', '색/용도. primary=브랜드 블루(일반 건수), new=빨강(새로움·알림 강조).', "'primary' | 'new'"],
    ['children', '표시할 숫자. 한 자리는 원형에 가깝고 여러 자리는 좌우로 늘어난다.', 'ReactNode'],
] as const

// 숫자 배지 — Badge 의 숫자 변형 래퍼. Figma "badge_number" 반영.
const NumberBadgeGuidePage = () => (
    <GuidePageShell
        title="숫자 배지 (NumberBadge)"
        description="개수·카운트를 원형 pill 로 표시하는 Badge 의 숫자 변형입니다. 숫자 전용이라 패딩이 좁고 색은 두 가지(primary·new)뿐입니다. 제목 옆 건수, 탭·메뉴의 알림 개수 등에 씁니다."
    >
        <section aria-labelledby="nb-variant" className="flex flex-col gap-4">
            <div>
                <h2 id="nb-variant" className="typo-h4-bold">
                    종류 (variant)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">NumberBadge</code> 는{' '}
                    <code className="font-mono">@/components/kit/badge</code> 에서 가져옵니다.{' '}
                    <code className="font-mono">primary</code>(기본)는 브랜드 블루로 일반 건수를,{' '}
                    <code className="font-mono">new</code> 는 빨강으로 새로움·알림을 강조합니다. 자릿수가 늘면 좌우로
                    늘어납니다.
                </p>
            </div>
            <div className="flex items-center gap-4">
                <NumberBadge>2</NumberBadge>
                <NumberBadge variant="new">5</NumberBadge>
                <NumberBadge>12</NumberBadge>
                <NumberBadge variant="new">99</NumberBadge>
            </div>
            <CodeBlock code={VARIANT_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="nb-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="nb-usage" className="typo-h4-bold">
                    사용 예시 — 제목 옆 건수
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">SectionHeaderTitle</code> 안에 인라인으로 넣어 제목 옆 건수를 표시합니다
                    (Figma &quot;대표자 경력사항 2&quot;).
                </p>
            </div>
            <SectionHeader>
                <SectionHeaderTitle className="flex items-center gap-2">
                    대표자 경력사항
                    <NumberBadge>2</NumberBadge>
                </SectionHeaderTitle>
                <SectionHeaderAction>
                    <Button variant="tertiary" size="small">
                        수정
                    </Button>
                </SectionHeaderAction>
            </SectionHeader>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="nb-props" className="flex flex-col gap-4">
            <div>
                <h2 id="nb-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">NumberBadge 에 넘기는 속성입니다.</p>
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

export default NumberBadgeGuidePage
