import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import PropsTable from '@/components/guide/props-table'
import {BaseCard} from '@/components/composite/base-card'
import {ListMarker} from '@/components/custom/list-marker'

export const metadata: Metadata = {title: '리스트 마커 (ListMarker)'}

const USAGE_CODE = `<ul className="flex list-none flex-col gap-2">
  <li className="flex gap-1.5">
    <ListMarker type="unordered" level={1} />
    위 고유식별정보 수집·이용에 동의하십니까?
  </li>
</ul>

{/* 번호 목록 — index 로 순번을 넘긴다 */}
<ol className="flex list-none flex-col gap-2">
  {items.map((text, index) => (
    <li key={text} className="flex gap-1.5">
      <ListMarker type="ordered" level={1} index={index + 1} />
      {text}
    </li>
  ))}
</ol>`

// 4개 변형 — [type, level, 설명, 예]
const VARIANTS = [
    {type: 'unordered', level: 1, desc: '점(•) — 기본 불릿', label: 'unordered · level 1'},
    {type: 'unordered', level: 2, desc: '대시(–) — 2뎁스 불릿', label: 'unordered · level 2'},
    {type: 'ordered', level: 1, desc: '숫자(1.) — 순서 목록', label: 'ordered · level 1'},
    {type: 'ordered', level: 2, desc: '문자(a.) — 2뎁스 순서 목록', label: 'ordered · level 2'},
] as const

const PROPS_ITEMS = [
    ['ListMarker', 'type', '불릿 계열과 순서 계열을 선택합니다.', "'unordered'", "'unordered' | 'ordered'"],
    ['ListMarker', 'level', '1은 점·숫자, 2는 대시·소문자로 표시합니다.', '1', '1 | 2'],
    ['ListMarker', 'index', 'ordered 순번입니다. level 2는 1–26을 a–z로 표시합니다.', '1', 'number'],
    ['ListMarker', 'className', '마커 바깥 span에 추가할 클래스입니다.', 'undefined', 'string'],
] as const

// 리스트 마커 — 리스트 항목 앞의 표식(custom 리프 원자). shadcn 프리미티브가 없어 직접 만든다.
const ListMarkerGuidePage = () => (
    <GuidePageShell
        title="리스트 마커 (ListMarker)"
        description="리스트 항목 앞에 붙는 표식(웹 표준 ::marker)입니다. 점·대시·숫자·문자를 type·level 로 나눕니다. 순수 시각 표식이라 항상 장식용(aria-hidden)이며, 목록 구조의 의미는 감싸는 마크업이 전달합니다."
    >
        <BaseCard>
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
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="lm-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="lm-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        본문 앞에 마커를 두어 목록·안내 문구를 구성합니다. 순서 목록은{' '}
                        <code className="font-mono">index</code>로 순번을 넘깁니다. 목록 의미는{' '}
                        <code className="font-mono">ul/ol &gt; li</code> 구조가 담당합니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <ul className="flex list-none flex-col gap-2" aria-label="안내 목록">
                        <li className="typo-body-xl-regular text-foreground flex gap-1.5">
                            <ListMarker type="unordered" level={1} />
                            고유식별정보 수집·이용에 동의합니다.
                        </li>
                        <li className="typo-body-xl-regular text-foreground flex gap-1.5">
                            <ListMarker type="unordered" level={2} />
                            동의 내용은 언제든 철회할 수 있습니다.
                        </li>
                    </ul>
                    <ol className="flex list-none flex-col gap-2" aria-label="수집 정보 목록">
                        <li className="typo-body-xl-regular text-foreground flex gap-1.5">
                            <ListMarker type="ordered" level={1} index={1} />
                            수집·이용 목적: 본인 확인
                        </li>
                        <li className="typo-body-xl-regular text-foreground flex gap-1.5">
                            <ListMarker type="ordered" level={1} index={2} />
                            보유 기간: 5년
                        </li>
                        <li className="typo-body-xl-regular text-foreground flex gap-1.5">
                            <ListMarker type="ordered" level={2} index={1} />
                            세부 항목: 성명
                        </li>
                        <li className="typo-body-xl-regular text-foreground flex gap-1.5">
                            <ListMarker type="ordered" level={2} index={2} />
                            세부 항목: 연락처
                        </li>
                    </ol>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="lm-accessibility" className="flex flex-col gap-4">
                <div>
                    <h2 id="lm-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        ListMarker는 시각 표식만 담당하고 목록의 구조와 순서는 시맨틱 마크업이 전달합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-1 pl-5">
                    <li>마커의 바깥 span과 내부 도형은 항상 접근성 트리에서 제외됩니다.</li>
                    <li>
                        여러 항목은 <code>ul/ol &gt; li</code>로 구성하고 CSS로 기본 marker를 숨긴 뒤 ListMarker를
                        표시합니다.
                    </li>
                    <li>한 문장 앞의 단순 안내 표식은 본문 텍스트가 의미를 모두 전달해야 합니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="lm-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="lm-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">ListMarker에 넘기는 속성입니다.</p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ListMarker Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ListMarkerGuidePage
