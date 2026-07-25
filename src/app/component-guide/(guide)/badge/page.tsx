import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Badge} from '@/components/ui/badge'

export const metadata: Metadata = {title: '배지 (Badge)'}

const USAGE_CODE = `<Badge color="success">활성</Badge>
<Badge color="warning" variant="outline">대기</Badge>
<Badge color="error" variant="solid">정지</Badge>`

const NUMBER_USAGE_CODE = `<Badge type="number" color="primary">2</Badge>
<Badge type="number" color="new">5</Badge>`

// Figma badge 의 세 축.
const VARIANTS = [
    {key: 'solid-pastel', label: 'solid-pastel', desc: '연한 배경 + 진한 텍스트. 상태 칩 기본형.'},
    {key: 'outline', label: 'outline', desc: '흰 배경 + 색 테두리·텍스트.'},
    {key: 'solid', label: 'solid', desc: '색 배경 + 흰 텍스트. 강조형.'},
] as const

const COLORS = [
    // 상태색(semantic) — Figma blue/green/orange/red/gray 와 값이 동일.
    {key: 'info', label: 'info', desc: '정보·기본(blue)'},
    {key: 'success', label: 'success', desc: '성공·활성(green)'},
    {key: 'warning', label: 'warning', desc: '주의·대기(orange)'},
    {key: 'error', label: 'error', desc: '오류·정지(red)'},
    {key: 'neutral', label: 'neutral', desc: '중립·기타(gray)'},
    // 브랜드 분류색 — 상태색과 동일 스텝 패턴을 navy 팔레트로 적용.
    {key: 'navy', label: 'navy', desc: '브랜드·분류(navy)'},
    // 보조색(Figma secondary-*) — 상태가 아닌 분류용 액센트.
    {key: 'secondary-green', label: 'secondary-green', desc: '보조·녹색(green)'},
    {key: 'secondary-orange', label: 'secondary-orange', desc: '보조·주황(orange)'},
    {key: 'secondary-grape', label: 'secondary-grape', desc: '보조·보라(grape)'},
] as const

// 매트릭스 각 셀에서 두 shape 를 짝지어 보여준다(pill=완전 둥근 / round=8px 라운드).
const SHAPES = ['pill', 'round'] as const

// Variant × Color 매트릭스 — 가이드 문서용 Table(size="md")에 데이터로 넘긴다.
const MATRIX_COLUMNS = [
    {key: 'color', header: 'Color', align: 'start', rowHeader: true},
    ...VARIANTS.map((v) => ({key: v.key, header: v.label, align: 'start'}) as const),
] as const

const MATRIX_ROWS = COLORS.map((c) => ({
    key: c.key,
    cells: [
        <span key="name" className="text-primary font-mono">
            {c.label}
        </span>,
        ...VARIANTS.map((v) => (
            <div key={v.key} className="flex items-center gap-4">
                {SHAPES.map((s) => (
                    <Badge key={s} color={c.key} variant={v.key} shape={s}>
                        라벨
                    </Badge>
                ))}
            </div>
        )),
    ],
}))

const PROPS_ITEMS = [
    ['Badge', 'type', '상태·분류 라벨과 숫자 배지를 구분합니다.', "'label'", "'label' | 'number'"],
    [
        'Badge',
        'variant',
        '배경·테두리의 강조 방식을 선택합니다.',
        "'solid-pastel'",
        "'solid-pastel' | 'outline' | 'solid'",
    ],
    [
        'Badge',
        'color',
        '상태색·브랜드색·보조색을 선택합니다. number는 primary와 new를 사용합니다.',
        "'neutral'",
        'BadgeColor',
    ],
    [
        'Badge',
        'shape',
        '완전 둥근 pill과 8px 라운드 round를 선택합니다. 여백·크기는 형태에 따라 달라지지 않습니다.',
        "'pill'",
        "'pill' | 'round'",
    ],
    [
        'Badge',
        'size',
        'sm은 28px 높이(좌우 여백 8px · 최소 너비 60px), lg는 40px 높이(좌우 여백 16px)입니다. number는 28×24입니다.',
        "'sm'",
        "'sm' | 'lg'",
    ],
    ['Badge', 'asChild', '자식 요소에 Badge 스타일과 속성을 합성합니다.', 'false', 'boolean'],
    ['Badge', 'children', '표시할 라벨·숫자·아이콘 콘텐츠입니다.', '-', 'ReactNode'],
    [
        'Badge',
        'className · span props',
        '추가 스타일과 네이티브 span 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'span'>",
    ],
] as const

const BadgeGuidePage = () => (
    <GuidePageShell
        title="배지 (Badge)"
        description="shadcn Badge 셸에 프로젝트 theme variant를 연결한 컴포넌트입니다. type으로 라벨과 숫자 배지를 구분하고 variant·color·shape·size로 표현을 조합합니다."
    >
        <BaseCard>
            <section aria-labelledby="badge-demo" className="flex flex-col gap-4">
                <div>
                    <h2 id="badge-demo" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">color</code>(상태 5색 + navy + 보조 secondary 3색)로 의미를,{' '}
                        <code className="font-mono">variant</code>(solid-pastel/outline/solid)로 강조를,{' '}
                        <code className="font-mono">shape</code>(pill/round)로 형태를 정합니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Badge color="success">활성</Badge>
                    <Badge color="warning" variant="outline">
                        대기
                    </Badge>
                    <Badge color="error" variant="solid">
                        정지
                    </Badge>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="badge-matrix" className="flex flex-col gap-4">
                <div>
                    <h2 id="badge-matrix" className="typo-h4-bold">
                        Variant × Color 큐레이션
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        9가지 label color(상태 5색 + navy + 보조 3색)를 행으로, 3가지 variant를 열로 교차한 전체
                        조합입니다. 각 셀은 <code className="font-mono">pill</code>(왼쪽)·
                        <code className="font-mono">round</code>
                        (오른쪽) 두 shape 를 짝지어 보여줍니다.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    {COLORS.map((c) => (
                        <p key={c.key} className="typo-body-l-regular text-muted-foreground">
                            <span className="text-foreground font-medium">{c.label}</span> — {c.desc}
                        </p>
                    ))}
                </div>
                <Table
                    size="md"
                    caption="배지 variant·color 조합 미리보기"
                    columns={MATRIX_COLUMNS}
                    rows={MATRIX_ROWS}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="badge-shape" className="flex flex-col gap-4">
                <div>
                    <h2 id="badge-shape" className="typo-h4-bold">
                        Shape
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">pill</code>(완전 둥근 모서리)과{' '}
                        <code className="font-mono">round</code>
                        (8px 라운드) 두 형태입니다. 여백·크기는 형태와 무관하며, 시안대로 sm(28px)은 좌우 여백 8px에
                        최소 너비 60px을 지켜 짧은 라벨도 같은 폭으로 정렬됩니다.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <span className="typo-caption-regular text-muted-foreground w-16 font-mono">pill</span>
                        <Badge color="info" shape="pill">
                            라벨
                        </Badge>
                        <Badge color="success" variant="outline" shape="pill">
                            라벨
                        </Badge>
                        <Badge color="error" variant="solid" shape="pill">
                            라벨
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="typo-caption-regular text-muted-foreground w-16 font-mono">round</span>
                        <Badge color="info" shape="round">
                            라벨
                        </Badge>
                        <Badge color="success" variant="outline" shape="round">
                            라벨
                        </Badge>
                        <Badge color="error" variant="solid" shape="round">
                            라벨
                        </Badge>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="badge-size" className="flex flex-col gap-4">
                <div>
                    <h2 id="badge-size" className="typo-h4-bold">
                        Size
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Figma 두 크기입니다 — <code className="font-mono">sm</code>(기본, 28px·14px)과{' '}
                        <code className="font-mono">lg</code>(40px·16px). 페이지 타이틀 바처럼 큰 제목 옆에는{' '}
                        <code className="font-mono">lg</code> 를 씁니다.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <span className="typo-caption-regular text-muted-foreground w-16 font-mono">sm</span>
                        <Badge color="navy" variant="solid" shape="round" size="sm">
                            KTRS-FM 평가
                        </Badge>
                        <Badge color="info" size="sm">
                            진행중
                        </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="typo-caption-regular text-muted-foreground w-16 font-mono">lg</span>
                        <Badge color="navy" variant="solid" shape="round" size="lg">
                            KTRS-FM 평가
                        </Badge>
                        <Badge color="info" size="lg">
                            진행중
                        </Badge>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="badge-number" className="flex flex-col gap-4">
                <div>
                    <h2 id="badge-number" className="typo-h4-bold">
                        숫자 배지 (type=&quot;number&quot;)
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        숫자 배지는 동일한 <code className="font-mono">Badge</code> 컴포넌트에서{' '}
                        <code className="font-mono">type=&quot;number&quot;</code>로 사용합니다. 기본{' '}
                        <code className="font-mono">color=&quot;primary&quot;</code>는 일반 건수,{' '}
                        <code className="font-mono">color=&quot;new&quot;</code>는 새로움·알림을 강조합니다. 숫자
                        타입에서는 이 두 color만 사용합니다.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge type="number" color="primary">
                        2
                    </Badge>
                    <Badge type="number" color="new">
                        5
                    </Badge>
                    <Badge type="number" color="primary">
                        12
                    </Badge>
                    <Badge type="number" color="new">
                        99
                    </Badge>
                </div>
                <CodeBlock code={NUMBER_USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="badge-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="badge-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Badge 에서 커스터마이징 가능한 속성입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Badge Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default BadgeGuidePage
