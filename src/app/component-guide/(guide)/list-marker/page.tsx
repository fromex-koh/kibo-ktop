import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {BaseCard} from '@/components/composite/base-card'
import {ListMarker} from '@/components/custom/list-marker'

export const metadata: Metadata = {title: '리스트 마커 (ListMarker)'}

const USAGE_CODE = `<p className="flex gap-1.5">
  <ListMarker type="unordered" level={1} />
  위 고유식별정보 수집·이용에 동의하십니까?
</p>

{/* 번호 목록 — index 로 순번을 넘긴다 */}
{items.map((text, i) => (
  <p key={text} className="flex gap-1.5">
    <ListMarker type="ordered" level={1} index={i + 1} />
    {text}
  </p>
))}`

// 4개 변형 — [type, level, 설명, 예]
const VARIANTS = [
    {type: 'unordered', level: 1, desc: '점(•) — 기본 불릿', label: 'unordered · level 1'},
    {type: 'unordered', level: 2, desc: '대시(–) — 2뎁스 불릿', label: 'unordered · level 2'},
    {type: 'ordered', level: 1, desc: '숫자(1.) — 순서 목록', label: 'ordered · level 1'},
    {type: 'ordered', level: 2, desc: '문자(a.) — 2뎁스 순서 목록', label: 'ordered · level 2'},
] as const

const PROPS_ITEMS = [
    ['type', '불릿 계열(unordered) vs 순서 계열(ordered).', "'unordered' | 'ordered'"],
    ['level', '뎁스. 1=점/숫자, 2=대시/문자.', '1 | 2'],
    ['index', 'ordered 순번(1부터). level 1→"3.", level 2→"c.".', 'number'],
] as const

// 리스트 마커 — 리스트 항목 앞의 표식(custom 리프 원자). shadcn 프리미티브가 없어 직접 만든다.
const ListMarkerGuidePage = () => (
    <GuidePageShell
        title="리스트 마커 (ListMarker)"
        description="리스트 항목 앞에 붙는 표식(웹 표준 ::marker)입니다. 점·대시·숫자·문자를 type·level 로 나눕니다. 순수 시각 표식이라 항상 장식용(aria-hidden)이며, 목록 구조의 의미는 감싸는 마크업이 전달합니다."
    >
        <section aria-labelledby="lm-variants" className="flex flex-col gap-4">
            <div>
                <h2 id="lm-variants" className="typo-h4-bold">
                    변형
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">type</code>(unordered·ordered) ×{' '}
                    <code className="font-mono">level</code>
                    (1·2) 의 4가지입니다.
                </p>
            </div>
            <BaseCard>
                <ul className="flex flex-col gap-3">
                    {VARIANTS.map((v) => (
                        <li key={v.label} className="flex items-center gap-4">
                            <span className="flex w-40 items-center gap-1.5">
                                <ListMarker type={v.type} level={v.level} index={1} />
                                <span className="typo-body-xl-regular text-foreground">항목 텍스트</span>
                            </span>
                            <span className="typo-caption-regular text-muted-foreground font-mono">{v.label}</span>
                            <span className="typo-body-l-regular text-muted-foreground">{v.desc}</span>
                        </li>
                    ))}
                </ul>
            </BaseCard>
        </section>

        <section aria-labelledby="lm-usage" className="flex flex-col gap-4">
            <div>
                <h2 id="lm-usage" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    본문 앞에 마커를 두어 목록·안내 문구를 구성합니다. 순서 목록은{' '}
                    <code className="font-mono">index</code> 로 순번을 넘깁니다.
                </p>
            </div>
            <BaseCard>
                <div className="flex flex-col gap-2">
                    <p className="typo-body-xl-regular text-foreground flex gap-1.5">
                        <ListMarker type="unordered" level={1} />위 고유식별정보 수집·이용에 동의하십니까?
                    </p>
                    <p className="typo-body-xl-regular text-foreground flex gap-1.5">
                        <ListMarker type="ordered" level={1} index={1} />
                        수집·이용 목적: 본인 확인
                    </p>
                    <p className="typo-body-xl-regular text-foreground flex gap-1.5">
                        <ListMarker type="ordered" level={1} index={2} />
                        보유 기간: 5년
                    </p>
                </div>
            </BaseCard>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="lm-props" className="flex flex-col gap-4">
            <div>
                <h2 id="lm-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">ListMarker 에 넘기는 속성입니다.</p>
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

export default ListMarkerGuidePage
