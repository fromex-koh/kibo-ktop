// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Badge} from '@/components/ui/badge'

export const metadata: Metadata = {title: '배지 (Badge)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `<Badge color="success">활성</Badge>
<Badge color="warning" variant="outline">대기</Badge>
<Badge color="error" variant="solid">정지</Badge>`

const NUMBER_USAGE_CODE = `<Badge type="number" color="primary">2</Badge>
<Badge type="number" color="new">5</Badge>`

const VARIANTS = [
    {key: 'solid-pastel', label: 'solid-pastel', desc: '연한 배경 + 진한 텍스트. 상태 칩 기본형.'},
    {key: 'outline', label: 'outline', desc: '흰 배경 + 색 테두리·텍스트.'},
    {key: 'solid', label: 'solid', desc: '색 배경 + 흰 텍스트. 강조형.'},
] as const

const COLORS = [
    {key: 'info', label: 'info', desc: '정보·기본(blue)'},
    {key: 'success', label: 'success', desc: '성공·활성(green)'},
    {key: 'warning', label: 'warning', desc: '주의·대기(orange)'},
    {key: 'error', label: 'error', desc: '오류·정지(red)'},
    {key: 'neutral', label: 'neutral', desc: '중립·기타(gray)'},
    {key: 'navy', label: 'navy', desc: '브랜드·분류(navy)'},
    {key: 'secondary-green', label: 'secondary-green', desc: '보조·녹색(green)'},
    {key: 'secondary-orange', label: 'secondary-orange', desc: '보조·주황(orange)'},
    {key: 'secondary-purple', label: 'secondary-purple', desc: '보조·보라(purple)'},
] as const

// 매트릭스 각 셀에서 두 shape 를 짝지어 보여준다.
const SHAPES = ['pill', 'round'] as const

const MATRIX_COLUMNS = [
    {key: 'color', header: 'color', align: 'start', rowHeader: true},
    ...VARIANTS.map((v) => ({key: v.key, header: v.label, align: 'start'}) as const),
] as const

const MATRIX_ROWS = COLORS.map((c) => ({
    key: c.key,
    cells: [
        <code key="name" className="text-foreground">
            {c.label}
        </code>,
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

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'badge',
        cells: [
            '상태 · 분류 · 건수를 짧게 표시',
            <code key="component">Badge</code>,
            '클릭하지 않는 정보 표시입니다. 선택 · 필터 같은 조작은 Chip 을 씁니다.',
        ],
    },
    {
        key: 'chip',
        cells: [
            '누르거나 선택하는 태그',
            <Link key="component" href="/component-guide/chip" className={LINK_CLASS}>
                Chip
            </Link>,
            '선택 상태를 가지는 조작 요소입니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['Badge', 'type', '상태 · 분류 라벨과 숫자 배지를 구분합니다.', "'label'", "'label' | 'number'"],
    [
        'Badge',
        'variant',
        '배경 · 테두리의 강조 방식입니다. solid 는 흰 글자, outline 은 흰 배경에 색 테두리입니다.',
        "'solid-pastel'",
        "'solid-pastel' | 'outline' | 'solid'",
    ],
    [
        'Badge',
        'color',
        'label 은 info · success · warning · error · neutral · navy · secondary-green · secondary-orange · secondary-purple, number 는 primary · new 를 씁니다.',
        "'neutral'",
        'BadgeColor',
    ],
    ['Badge', 'shape', '완전 둥근 pill 과 8px 라운드 round 입니다.', "'pill'", "'pill' | 'round'"],
    [
        'Badge',
        'size',
        'xs 는 높이 24px, sm 은 높이 28px · 최소 너비 60px, lg 는 높이 40px 입니다. 좌우 여백은 sm · xs 가 pill 12px · round 8px, lg 는 16px 입니다. number 는 size 와 무관하게 높이 24px 입니다.',
        "'sm'",
        "'xs' | 'sm' | 'lg'",
    ],
    ['Badge', 'asChild', '자식 요소에 Badge 스타일과 속성을 합성합니다.', 'false', 'boolean'],
    [
        'Badge',
        'className · span props',
        '추가 클래스와 네이티브 span 속성을 전달합니다.',
        'undefined',
        "ComponentProps<'span'>",
    ],
] as const

const SizeRow = ({size}: {size: 'xs' | 'sm' | 'lg'}) => (
    <div className="flex flex-wrap items-center gap-3">
        <code className="typo-caption-regular text-label-foreground w-16">{size}</code>
        <Badge color="navy" variant="solid" shape="round" size={size}>
            KTRS-FM 평가
        </Badge>
        <Badge color="info" size={size}>
            진행중
        </Badge>
    </div>
)

const ShapeRow = ({shape}: {shape: 'pill' | 'round'}) => (
    <div className="flex flex-wrap items-center gap-3">
        <code className="typo-caption-regular text-label-foreground w-16">{shape}</code>
        <Badge color="info" shape={shape}>
            라벨
        </Badge>
        <Badge color="success" variant="outline" shape={shape}>
            라벨
        </Badge>
        <Badge color="error" variant="solid" shape={shape}>
            라벨
        </Badge>
    </div>
)

const BadgeGuidePage = () => (
    <GuidePageShell title="배지 (Badge)" description="상태 · 분류를 알려 주는 라벨과 건수를 알려 주는 숫자 배지입니다.">
        <BaseCard>
            <section aria-labelledby="badge-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="badge-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>color</code> 로 의미를, <code>variant</code> 로 강조를, <code>shape</code> 로 형태를
                        정합니다.
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
                <CodeBlock
                    code={`import {Badge} from '@/components/ui/badge'\n\n${USAGE_CODE}`}
                    language="tsx"
                    copyLabel="복사"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="badge-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="badge-variants" className="typo-h4-bold">
                        변형
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">variant × color</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            각 셀은 <code>pill</code>(왼쪽)과 <code>round</code>(오른쪽)를 함께 보여 줍니다.
                        </p>
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-1 pl-5">
                            {COLORS.map((c) => (
                                <li key={c.key}>
                                    <code>{c.label}</code> — {c.desc}
                                </li>
                            ))}
                        </ul>
                        <Table
                            size="md"
                            caption="배지 variant·color 조합 미리보기"
                            columns={MATRIX_COLUMNS}
                            rows={MATRIX_ROWS}
                        />
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">shape</h3>
                        <div className="flex flex-col gap-3">
                            <ShapeRow shape="pill" />
                            <ShapeRow shape="round" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">size</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            페이지 타이틀 바처럼 큰 제목 옆에는 <code>lg</code> 를 씁니다.
                        </p>
                        <div className="flex flex-col gap-3">
                            <SizeRow size="xs" />
                            <SizeRow size="sm" />
                            <SizeRow size="lg" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">숫자 배지</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>type=&quot;number&quot;</code> 에서는 <code>primary</code>(일반 건수)와{' '}
                            <code>new</code>(새로움 · 알림 강조) 두 color 만 씁니다.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
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
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="badge-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="badge-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                </div>
                <Table caption="Badge 사용 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="badge-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="badge-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>상태는 색만으로 전하지 않고 항상 글자를 함께 둡니다[5.3.1].</li>
                    <li>
                        숫자 배지는 숫자만으로 의미가 모호하므로 옆 라벨이나 <code>sr-only</code> 텍스트로 대상을
                        밝힙니다.
                    </li>
                    <li>
                        배지는 정보 표시용이라 포커스를 받지 않습니다. 누르는 동작이 필요하면 <code>asChild</code> 로
                        링크 · 버튼에 합성합니다[6.1.1].
                    </li>
                    <li>secondary 계열 색의 글자 대비는 수동으로 검수합니다[5.3.3].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="badge-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="badge-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Badge Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default BadgeGuidePage
