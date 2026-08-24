import type {Metadata} from 'next'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {BaseCard} from '@/components/composite/base-card'
import {ListMarker} from '@/components/custom/list-marker'

export const metadata: Metadata = {title: '리스트 마커 (ListMarker)'}

const USAGE_CODE = `<ul className="flex list-none flex-col gap-2">
  <li className="flex">
    <ListMarker type="unordered" level={1} />
    위 고유식별정보 수집·이용에 동의하십니까?
  </li>
</ul>

{/* 번호 목록 — index 로 순번을 넘긴다 */}
<ol className="flex list-none flex-col gap-2">
  {items.map((text, index) => (
    <li key={text} className="flex">
      <ListMarker type="ordered" level={1} index={index + 1} />
      {text}
    </li>
  ))}
</ol>

{/* 제목 줄의 순번 — 문장의 글자를 그대로 따른다 */}
<p className="typo-title-m-bold text-foreground flex">
  <ListMarker type="ordered" level={1} index={1} typography="inherit" />
  <span className="min-w-0">KIPRIS 에 접속해 특허·실용신안 메뉴를 클릭합니다.</span>
</p>`

// 5개 변형 — [type, level, 설명, 예]
const VARIANTS = [
    {type: 'unordered', level: 1, desc: '점(•) — 기본 불릿', label: 'unordered · level 1'},
    {
        type: 'unordered-small',
        level: 1,
        desc: '작은 점(•) — 13px 본문용 불릿',
        label: 'unordered-small · level 1',
    },
    {type: 'unordered', level: 2, desc: '대시(–) — 2뎁스 불릿', label: 'unordered · level 2'},
    {type: 'ordered', level: 1, desc: '숫자(1.) — 순서 목록', label: 'ordered · level 1'},
    {type: 'ordered', level: 2, desc: '문자(a.) — 2뎁스 순서 목록', label: 'ordered · level 2'},
] as const

// Figma "list_atomic_bullet" 실측 — 마커는 글리프 + 뒤 여백을 자기 폭에 포함한다(본문은 그 오른쪽에서 바로 시작).
const SPEC_COLUMNS = [
    {key: 'variant', header: '변형', align: 'start', rowHeader: true},
    {key: 'glyph', header: '글리프', align: 'start', wrap: true},
    {key: 'box', header: '마커 칸', align: 'start', wrap: true},
    {key: 'color', header: '색', align: 'start'},
] as const

const SPEC_ROWS = [
    {
        key: 'unordered-1',
        cells: ['unordered · level 1', '점 4×4, 원형', '12px (글리프 4 + 여백 8)', 'foreground-subtle'],
    },
    {
        key: 'unordered-small-1',
        cells: [
            'unordered-small · level 1',
            '점 3×3, 원형',
            '12px (글리프 3 + 여백 9) · 칸 높이 20',
            'foreground-subtle',
        ],
    },
    {
        key: 'unordered-2',
        cells: ['unordered · level 2', '대시 6×1.5, 직사각형', '12px (글리프 6 + 여백 6)', 'foreground-subtle'],
    },
    {
        key: 'ordered-1',
        cells: ['ordered · level 1', '숫자 "1." body-xl-regular', '글자 폭 + 여백 8', 'label-foreground'],
    },
    {
        key: 'ordered-2',
        cells: ['ordered · level 2', '문자 "a." body-xl-regular', '글자 폭 + 여백 8', 'label-foreground'],
    },
]

const PROPS_ITEMS = [
    [
        'ListMarker',
        'type',
        '불릿 계열과 순서 계열을 선택합니다. unordered-small 은 칸 높이 20px·점 3×3 으로, 13px 본문 옆에 놓을 때 씁니다(level 은 무시).',
        "'unordered'",
        "'unordered' | 'unordered-small' | 'ordered'",
    ],
    ['ListMarker', 'level', '1은 점·숫자, 2는 대시·소문자로 표시합니다.', '1', '1 | 2'],
    ['ListMarker', 'index', 'ordered 순번입니다. level 2는 1–26을 a–z로 표시합니다.', '1', 'number'],
    [
        'ListMarker',
        'typography',
        "ordered 순번의 글자 사양입니다. 'inherit'은 감싼 문장의 글자를 그대로 따릅니다(제목 줄의 순번).",
        "'body'",
        "'body' | 'inherit'",
    ],
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
                        <code className="font-mono">type</code>(unordered·unordered-small·ordered) ×{' '}
                        <code className="font-mono">level</code>
                        (1·2) 의 4가지입니다.
                    </p>
                </div>
                <ul className="flex flex-col gap-3">
                    {VARIANTS.map((v) => (
                        <li key={v.label} className="flex items-center gap-4">
                            <span className="flex w-40 items-center">
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
            <section aria-labelledby="lm-spec" className="flex flex-col gap-4">
                <div>
                    <h2 id="lm-spec" className="typo-h4-bold">
                        규격
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        마커는 글리프와 그 뒤 여백을 함께 차지합니다(불릿은 12px 칸, 순번은 글자 폭 + 8px). 본문은 마커
                        칸 오른쪽에서 바로 시작하므로 <code className="font-mono">li</code> 에 별도{' '}
                        <code className="font-mono">gap</code> 을 주지 않습니다 — 주면 시안보다 들여쓰기가 그만큼
                        넓어집니다.
                    </p>
                </div>
                <Table size="md" caption="ListMarker 규격" columns={SPEC_COLUMNS} rows={SPEC_ROWS} />
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
                        <code className="font-mono">ul/ol &gt; li</code> 구조가 담당합니다. 본문이 아닌 줄(제목 등)에
                        순번을 붙일 때는 <code className="font-mono">typography=&quot;inherit&quot;</code>으로 감싼
                        문장의 글자를 따르게 합니다 — 같은 요소에 <code className="font-mono">typo-*</code>를 겹쳐 쓰지
                        않습니다.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <ul className="flex list-none flex-col gap-2" aria-label="안내 목록">
                        <li className="typo-body-xl-regular text-foreground flex">
                            <ListMarker type="unordered" level={1} />
                            고유식별정보 수집·이용에 동의합니다.
                        </li>
                        <li className="typo-body-xl-regular text-foreground flex">
                            <ListMarker type="unordered" level={2} />
                            동의 내용은 언제든 철회할 수 있습니다.
                        </li>
                    </ul>
                    <ol className="flex list-none flex-col gap-2" aria-label="수집 정보 목록">
                        <li className="typo-body-xl-regular text-foreground flex">
                            <ListMarker type="ordered" level={1} index={1} />
                            수집·이용 목적: 본인 확인
                        </li>
                        <li className="typo-body-xl-regular text-foreground flex">
                            <ListMarker type="ordered" level={1} index={2} />
                            보유 기간: 5년
                        </li>
                        <li className="typo-body-xl-regular text-foreground flex">
                            <ListMarker type="ordered" level={2} index={1} />
                            세부 항목: 성명
                        </li>
                        <li className="typo-body-xl-regular text-foreground flex">
                            <ListMarker type="ordered" level={2} index={2} />
                            세부 항목: 연락처
                        </li>
                        {/* 제목 줄의 순번 — 마커가 문장의 글자(18px Bold)를 그대로 따른다. */}
                        <li className="typo-title-m-bold text-foreground flex">
                            <ListMarker type="ordered" level={1} index={3} typography="inherit" />
                            제목 줄에 붙는 순번 (typography=&quot;inherit&quot;)
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
