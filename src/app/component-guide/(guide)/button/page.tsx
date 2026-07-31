import type {Metadata} from 'next'
import Link from 'next/link'
import {ArrowRight, ChevronRight, Download, LoaderCircle, Search, Sun, X} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '버튼 (Button)'}

const USAGE_CODE = `import {Button} from '@/components/ui/button'

<Button variant="default" size="md">저장</Button>
<Button variant="secondary" size="md">취소</Button>
<Button variant="tertiary" size="md">더보기</Button>`

const USAGE_CODE_ICON = `{/* 아이콘 왼쪽 */}
<Button variant="default" size="md">
  <Download aria-hidden="true" />
  다운로드
</Button>

{/* 아이콘 오른쪽 */}
<Button variant="default" size="md">
  다음
  <ArrowRight aria-hidden="true" />
</Button>`

// Loading — variant 색은 유지하고 스피너 + aria-busy + pointer-events-none 로 진행 중을 표현한다.
const LOADING_CODE = `<Button variant="default" size="md" aria-busy className="pointer-events-none">
  <LoaderCircle aria-hidden="true" className="animate-spin" />
  로딩중
</Button>`

const DISABLED_ICON_CODE = `<Button variant="default" size="md" disabled>
  <Download aria-hidden="true" />
  다운로드
</Button>

<Button variant="secondary" size="md" disabled>
  다음
  <ArrowRight aria-hidden="true" />
</Button>

<Button variant="text" size="lg" disabled>텍스트 버튼</Button>
<Button variant="text-underline" size="lg" disabled>밑줄 텍스트 버튼</Button>`

// 인라인 텍스트 버튼을 a 태그로 — 스타일은 그대로 두고 태그만 바꾸는 asChild 조합.
const INLINE_ANCHOR_CODE = `import Link from 'next/link'

{/* 다른 주소로 이동 → a */}
<Button variant="text-underline" size="lg" asChild>
  <Link href="/mypage/result">
    평가결과 조회
    <ChevronRight aria-hidden="true" />
  </Link>
</Button>

{/* 현재 화면에서 실행 → button (기본) */}
<Button variant="text-underline" size="lg" onClick={openDialog}>
  내용보기
</Button>`

const ROUND_ICON_CODE = `<Button
  variant="default"
  size="icon-md"
  className="rounded-full"
  aria-label="검색"
>
  <Search aria-hidden="true" />
</Button>

<Button
  variant="default"
  size="icon-md"
  className="rounded-full"
  disabled
  aria-label="검색 불가"
>
  <Search aria-hidden="true" />
</Button>`

// Figma 버튼 컴포넌트셋의 3 type. secondary 는 회색 solid 가 아니라 연한 블루 틴트+테두리 스타일이다.
const TYPES = [
    {key: 'default', label: 'Primary', desc: '가장 강조되는 주요 액션(화면당 1개 권장)에 사용합니다.'},
    {key: 'secondary', label: 'Secondary', desc: 'Primary 와 나란히 놓이는 보조 액션에 사용합니다.'},
    {key: 'tertiary', label: 'Tertiary', desc: '가장 낮은 강조의 보조 액션(취소·더보기 등)에 사용합니다.'},
] as const

// Figma 5단계 사이즈(60·52·48·40·32)를 같은 의미의 축약형(xl~xs)으로 노출한다. 클래스명은 cva 안에
// 리터럴로 고정돼 있어 여기서도 템플릿 문자열 대신 배열에 직접 나열한다(Tailwind 정적 분석, icon 가이드와 동일 이유).
const SIZES = [
    {key: 'xl', label: 'xl', height: 60},
    {key: 'lg', label: 'lg', height: 52},
    {key: 'md', label: 'md', height: 48},
    {key: 'sm', label: 'sm', height: 40},
    {key: 'xs', label: 'xs', height: 32},
] as const

// 아이콘 전용(정사각) 버튼 사이즈. 텍스트 사이즈와 달리 min-w 가 없어 정사각형이 되고, 텍스트 스케일 높이에
// 대응한다(icon-xl=60·icon-lg=52·icon-md=48·icon-sm=40·icon-xs=32).
const ICON_SIZES = [
    {key: 'icon-xl', label: 'icon-xl', height: 60},
    {key: 'icon-lg', label: 'icon-lg', height: 52},
    {key: 'icon-md', label: 'icon-md', height: 48},
    {key: 'icon-sm', label: 'icon-sm', height: 40},
    {key: 'icon-xs', label: 'icon-xs', height: 32},
] as const

// 아이콘 전용 버튼에 쓸 수 있는 variant — 텍스트 버튼과 동일하게 Figma 3 type(primary/secondary/tertiary)
// + 프로젝트 내부용 ghost 를 전부 지원한다(variant·size 는 cva 의 독립된 축이라 서로 제약이 없다).
const ICON_VARIANTS = [
    {key: 'default', label: 'primary'},
    {key: 'secondary', label: 'secondary'},
    {key: 'tertiary', label: 'tertiary'},
    {key: 'ghost', label: 'ghost'},
] as const

// plain 은 컨트롤 높이를 버리고 상자를 아이콘 크기로 맞추는 variant 라, 같은 size 라도 위 표의 높이와
// 값이 다르다(icon-lg = 52 가 아니라 아이콘 그대로 32). 혼동을 막으려고 표를 따로 둔다.
const PLAIN_SIZES = [
    {key: 'icon-xl', label: 'icon-xl', box: 40},
    {key: 'icon-lg', label: 'icon-lg', box: 32},
    {key: 'icon-md', label: 'icon-md', box: 24},
    {key: 'icon-sm', label: 'icon-sm', box: 20},
    {key: 'icon-xs', label: 'icon-xs', box: 16},
] as const

const LEGACY_SIZES = ['default', 'icon'] as const

// Button 이 가진 variant 케이스. default/secondary/tertiary/text 는 Figma type(버튼 전용 토큰),
// outline/ghost/destructive 는 내부 컴포넌트 및 인라인 액션에서 쓰는 호환 값이다.
// 채움이 없는 text 계열은 모양이 비슷해 마지막에 나란히 둔다.
const ALL_VARIANTS = [
    {key: 'default', label: 'default', note: 'Figma Primary'},
    {key: 'secondary', label: 'secondary', note: 'Figma Secondary'},
    {key: 'tertiary', label: 'tertiary', note: 'Figma Tertiary'},
    {key: 'outline', label: 'outline', note: '내부 컴포넌트용'},
    {key: 'ghost', label: 'ghost', note: '내부 컴포넌트용'},
    {key: 'destructive', label: 'destructive', note: '내부 컴포넌트용'},
    {key: 'text', label: 'text', note: 'Figma Text(채움·테두리 없음, 밑줄 없음)'},
    {key: 'text-underline', label: 'text-underline', note: 'Figma Text + 상시 1px 밑줄(글자 폭만, 아이콘 제외)'},
] as const

const INLINE_VARIANTS = [
    {key: 'text', label: 'text', note: '채움·테두리 없는 텍스트형(밑줄 없음)'},
    {
        key: 'text-underline',
        label: 'text-underline',
        note: 'text 와 같되 상시 1px 밑줄 — 글자 폭만 덮고 아이콘 아래로는 안 이어진다',
    },
] as const

const DISABLED_VARIANTS = [
    {key: 'default', label: 'Primary'},
    {key: 'secondary', label: 'Secondary'},
    {key: 'tertiary', label: 'Tertiary'},
    {key: 'text', label: 'Text'},
    {key: 'text-underline', label: 'Text(밑줄)'},
] as const

// Figma button_text 는 공용 size 축(xl~xs)과 별개로 자체 4단 스케일(large~xsmall)을 쓴다(값은 Figma 실측 px).
// 상자 높이를 따로 두지 않고 행간이 정하므로 높이 = 행간이다. 아이콘은 xsmall 만 12px, 나머지는 16px.
// text-underline 도 이 사양을 그대로 공유한다 — 밑줄 유무만 다르다.
// text-underline 의 밑줄은 글자 폭만 덮는다 — 시안에서 아이콘·간격을 뺀 글자 폭과 정확히 같다.
// xl 은 시안에 없어 lg 와 같은 값이라 표에서 뺀다.
const INLINE_SIZES = [
    {key: 'lg', label: 'lg', figma: 'large', font: 18, lineHeight: 27, icon: 16},
    {key: 'md', label: 'md', figma: 'medium', font: 16, lineHeight: 24, icon: 16},
    {key: 'sm', label: 'sm', figma: 'small', font: 14, lineHeight: 21, icon: 16},
    {key: 'xs', label: 'xs', figma: 'xsmall', font: 12, lineHeight: 18, icon: 12},
] as const

// 가이드 표(size="md")의 행 머리글 — 키 이름과 실측 수치를 함께 보여준다.
const sizeHeaderCell = (label: string, note: string) => (
    <span className="flex flex-col gap-0.5">
        <span className="text-primary font-mono">{label}</span>
        <span className="typo-caption-regular text-muted-foreground">{note}</span>
    </span>
)

const nameCell = (value: string) => <span className="text-primary font-mono">{value}</span>

const controlChip = (value: string) => (
    <span key={value} className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
        {value}
    </span>
)

const TYPE_MATRIX_COLUMNS = [
    {key: 'size', header: 'Size', align: 'start', rowHeader: true},
    ...TYPES.map((type) => ({key: type.key, header: type.label, align: 'start'}) as const),
] as const

const TYPE_MATRIX_ROWS = SIZES.map((size) => ({
    key: size.key,
    cells: [
        sizeHeaderCell(size.label, `${size.height}px`),
        ...TYPES.map((type) => (
            <Button key={type.key} variant={type.key} size={size.key}>
                <Download aria-hidden="true" />
                버튼
            </Button>
        )),
    ],
}))

const ICON_MATRIX_COLUMNS = [
    {key: 'size', header: 'Size', align: 'start', rowHeader: true},
    ...ICON_VARIANTS.map((variant) => ({key: variant.key, header: variant.label, align: 'start'}) as const),
] as const

const ICON_MATRIX_ROWS = ICON_SIZES.map((size) => ({
    key: size.key,
    cells: [
        sizeHeaderCell(size.label, `${size.height}px`),
        ...ICON_VARIANTS.map((variant) => (
            <Button key={variant.key} variant={variant.key} size={size.key} aria-label="라이트 모드">
                <Sun aria-hidden="true" />
            </Button>
        )),
    ],
}))

const PLAIN_MATRIX_COLUMNS = [
    {key: 'size', header: 'Size', align: 'start', rowHeader: true},
    {key: 'preview', header: 'Preview', align: 'start'},
    {key: 'note', header: '같은 size 의 면 있는 버튼', align: 'start'},
] as const

const PLAIN_MATRIX_ROWS = PLAIN_SIZES.map((size) => ({
    key: size.key,
    cells: [
        sizeHeaderCell(size.label, `${size.box}px`),
        <Button key="plain" variant="plain" size={size.key} aria-label="닫기">
            <X aria-hidden="true" />
        </Button>,
        <Button key="compare" variant="tertiary" size={size.key} aria-label="닫기">
            <X aria-hidden="true" />
        </Button>,
    ],
}))

const INLINE_VARIANT_COLUMNS = [
    {key: 'variant', header: 'Variant', align: 'start', rowHeader: true},
    {key: 'preview', header: 'Preview', align: 'start'},
    {key: 'note', header: 'Note', align: 'start', wrap: true},
] as const

const INLINE_VARIANT_ROWS = INLINE_VARIANTS.map((variant) => ({
    key: variant.key,
    cells: [
        nameCell(variant.label),
        <Button key="preview" variant={variant.key} size="lg">
            자세히 보기
        </Button>,
        variant.note,
    ],
}))

const INLINE_SIZE_COLUMNS = [
    {key: 'size', header: 'Size', align: 'start', rowHeader: true},
    {key: 'text', header: '텍스트', align: 'start'},
    {key: 'icon-start', header: '아이콘 왼쪽', align: 'start'},
    {key: 'icon-end', header: '아이콘 오른쪽', align: 'start'},
] as const

const DISABLED_COLUMNS = [
    {key: 'variant', header: 'Variant', align: 'start', rowHeader: true},
    {key: 'text', header: '텍스트', align: 'start'},
    {key: 'icon-start', header: '아이콘 왼쪽', align: 'start'},
    {key: 'icon-end', header: '아이콘 오른쪽', align: 'start'},
    {key: 'icon-only', header: '아이콘 전용', align: 'start'},
    {key: 'icon-round', header: '원형 아이콘', align: 'start'},
] as const

// 인라인 텍스트 버튼(text·text-underline)은 문장 안에 섞이는 버튼이라 아이콘 전용으로 쓰지 않는다.
// 시안 button_text 에 아이콘만 있는 케이스가 없고, 면 없는 아이콘 버튼은 plain 이 담당한다.
// 밑줄형은 글자 폭만 긋기 때문에 글자가 없으면 밑줄 자체가 사라져 text 와 구분되지 않는다.
const UNDERLINE_VARIANT_KEYS: readonly string[] = ['text-underline']
const INLINE_VARIANT_KEYS: readonly string[] = ['text', ...UNDERLINE_VARIANT_KEYS]

const notApplicableCell = (key: string) => (
    <span key={key} className="typo-caption-regular text-muted-foreground">
        해당 없음
    </span>
)

const DISABLED_ROWS = DISABLED_VARIANTS.map((variant) => {
    const hasIconOnly = !INLINE_VARIANT_KEYS.includes(variant.key)

    return {
        key: variant.key,
        cells: [
            nameCell(variant.label),
            <Button
                key="text"
                variant={variant.key}
                size={INLINE_VARIANT_KEYS.includes(variant.key) ? 'lg' : 'md'}
                disabled
            >
                버튼명
            </Button>,
            <Button
                key="icon-start"
                variant={variant.key}
                size={INLINE_VARIANT_KEYS.includes(variant.key) ? 'lg' : 'md'}
                disabled
            >
                <Download aria-hidden="true" />
                버튼명
            </Button>,
            <Button
                key="icon-end"
                variant={variant.key}
                size={INLINE_VARIANT_KEYS.includes(variant.key) ? 'lg' : 'md'}
                disabled
            >
                버튼명
                <ArrowRight aria-hidden="true" />
            </Button>,
            hasIconOnly ? (
                <Button
                    key="icon-only"
                    variant={variant.key}
                    size="icon-md"
                    disabled
                    aria-label={`${variant.label} 비활성 아이콘 버튼`}
                >
                    <Search aria-hidden="true" />
                </Button>
            ) : (
                notApplicableCell('icon-only')
            ),
            hasIconOnly ? (
                <Button
                    key="icon-round"
                    variant={variant.key}
                    size="icon-md"
                    className="rounded-full"
                    disabled
                    aria-label={`${variant.label} 비활성 원형 아이콘 버튼`}
                >
                    <Search aria-hidden="true" />
                </Button>
            ) : (
                notApplicableCell('icon-round')
            ),
        ],
    }
})

const PROPS_COLUMNS = [
    {key: 'name', header: 'Name', align: 'start', rowHeader: true},
    {key: 'description', header: 'Description', align: 'start', wrap: true},
    {key: 'default', header: 'Default', align: 'start'},
    {key: 'control', header: 'Control', align: 'start', wrap: true},
] as const

const PROPS_ROWS = [
    {
        key: 'variant',
        cells: [
            nameCell('variant'),
            '강조 단계. default/secondary/tertiary/text 는 Figma 디자인을 반영한 버튼 전용 토큰을 씁니다. outline/ghost/destructive 는 다이얼로그·시트 등 내부 컴포넌트가 쓰는 기존 값이고, plain 은 면 없는 아이콘 버튼, text 계열은 채움이 없는 인라인 액션이라 마지막에 함께 둡니다.',
            <span key="default" className="font-mono">
                &apos;default&apos;
            </span>,
            <span key="control" className="flex flex-wrap gap-1">
                {[
                    ...TYPES.map((type) => type.key),
                    'outline',
                    'ghost',
                    'destructive',
                    'plain',
                    'text',
                    'text-underline',
                ].map(controlChip)}
            </span>,
        ],
    },
    {
        key: 'size',
        cells: [
            nameCell('size'),
            'Figma의 xlarge/large/medium/small/xsmall을 xl/lg/md/sm/xs로 1:1 제공합니다(60/52/48/40/32px). default와 icon은 다이얼로그·시트·사이드바 등 기존 내부 컴포넌트 호환을 위해 유지됩니다.',
            <span key="default" className="font-mono">
                &apos;default&apos;
            </span>,
            <span key="control" className="flex flex-wrap gap-1">
                {[...SIZES.map((size) => size.key), ...ICON_SIZES.map((size) => size.key), ...LEGACY_SIZES].map(
                    controlChip,
                )}
            </span>,
        ],
    },
    {
        key: 'asChild',
        cells: [
            nameCell('asChild'),
            'next/link 등 다른 요소에 버튼 스타일만 씌울 때 사용합니다.',
            <span key="default" className="font-mono">
                false
            </span>,
            <span key="control">{controlChip('boolean')}</span>,
        ],
    },
    {
        key: 'className',
        cells: [
            nameCell('className'),
            '추가 클래스명으로 스타일 확장',
            <span key="default" className="font-mono">
                &quot;&quot;
            </span>,
            '-',
        ],
    },
]

// text·text-underline 은 같은 Figma 사양을 공유하므로 큐레이션 표도 같은 모양으로 나란히 둔다.
const InlineSizeTable = ({variant, caption}: {variant: 'text' | 'text-underline'; caption: string}) => (
    <Table
        size="md"
        caption={caption}
        columns={INLINE_SIZE_COLUMNS}
        rows={INLINE_SIZES.map((size) => ({
            key: size.key,
            cells: [
                sizeHeaderCell(
                    size.label,
                    `Figma ${size.figma} · 폰트 ${size.font}px · 행간 ${size.lineHeight}px · 아이콘 ${size.icon}px`,
                ),
                <Button key="text" variant={variant} size={size.key}>
                    버튼명
                </Button>,
                <Button key="icon-start" variant={variant} size={size.key}>
                    <Download aria-hidden="true" />
                    버튼명
                </Button>,
                <Button key="icon-end" variant={variant} size={size.key}>
                    버튼명
                    <ChevronRight aria-hidden="true" />
                </Button>,
            ],
        }))}
    />
)

// 버튼은 Card 와 달리 아이콘 전용 하위 컴포넌트가 없다 — 아이콘은 props 가 아니라 children 으로
// 직접 조합한다(lucide-react, 장식 목적이면 aria-hidden). 좌/우 어느 쪽에도 넣을 수 있다.
const ButtonGuidePage = () => (
    <GuidePageShell
        title="버튼 (Button)"
        description="프로젝트 공통 액션 컴포넌트입니다. 먼저 variant로 강조 단계를 정하고, size와 아이콘·상태를 조합해 사용합니다."
    >
        <BaseCard variant="outlined">
            <section aria-labelledby="button-quick-nav" className="flex flex-col gap-4">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-quick-nav" className="typo-h4-bold">
                        빠른 탐색
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        구현할 버튼 형태에 맞는 항목으로 바로 이동하세요. 일반 버튼은 기본 사용부터 확인하면 됩니다.
                    </p>
                </div>
                <nav aria-label="Button 가이드 주요 항목" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {href: '#button-demo', label: '기본 사용과 아이콘 조합'},
                        {href: '#button-matrix', label: '기본 버튼 크기 조합'},
                        {href: '#button-icon-matrix', label: '아이콘 전용 버튼'},
                        {href: '#button-inline-matrix', label: '인라인 버튼'},
                        {href: '#button-inline-anchor', label: '링크로 쓰는 인라인 버튼'},
                        {href: '#button-disabled', label: '상태 처리'},
                        {href: '#button-props', label: 'Props API'},
                    ].map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="border-border text-foreground hover:bg-primary-subtle focus-visible:ring-ring flex items-center justify-between gap-3 rounded-md border px-4 py-3 font-medium focus-visible:ring-2 focus-visible:outline-none"
                        >
                            {item.label}
                            <ChevronRight aria-hidden="true" className="text-muted-foreground size-icon-sm shrink-0" />
                        </a>
                    ))}
                </nav>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-demo" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-demo" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">variant</code> 로 강조 단계(Primary/Secondary/Tertiary)를,{' '}
                        <code className="font-mono">size</code> 로 크기를 고릅니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="default" size="md">
                        저장
                    </Button>
                    <Button variant="secondary" size="md">
                        취소
                    </Button>
                    <Button variant="tertiary" size="md">
                        더보기
                    </Button>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />

                <div className="flex flex-col gap-2">
                    <h3 className="typo-body-l-medium text-foreground">아이콘 조합</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        아이콘은 별도 prop 이 아니라 children 으로 텍스트와 함께 조합합니다. 텍스트 좌/우 어느 쪽에도
                        놓을 수 있고, 장식 목적 아이콘에는 <code className="font-mono">aria-hidden</code> 을 붙입니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="default" size="md">
                        <Download aria-hidden="true" />
                        다운로드
                    </Button>
                    <Button variant="default" size="md">
                        다음
                        <ArrowRight aria-hidden="true" />
                    </Button>
                </div>
                <CodeBlock code={USAGE_CODE_ICON} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-variants" className="typo-h4-bold">
                        Variant 선택 가이드
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Button 을 디자인에 쓰는 variant 입니다.{' '}
                        <span className="font-mono">default·secondary·tertiary·text</span> 는 Figma type(
                        <span className="font-mono">text</span> 는 채움·테두리 없는 텍스트 버튼)이고,{' '}
                        <span className="font-mono">text-underline</span> 은 여기에 상시 1px 밑줄이 붙는 점만 다릅니다.{' '}
                        <span className="font-mono">outline·ghost·destructive</span> 는 다이얼로그·시트 등 내부
                        컴포넌트가 쓰는 호환 값입니다.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    {ALL_VARIANTS.map((v) => (
                        <div key={v.key} className="flex flex-wrap items-center gap-3">
                            <div className="flex w-40 shrink-0 flex-col">
                                <span className="typo-body-l-medium text-foreground font-mono">{v.label}</span>
                                <span className="typo-caption-regular text-muted-foreground">{v.note}</span>
                            </div>
                            <Button variant={v.key} size={INLINE_VARIANT_KEYS.includes(v.key) ? 'lg' : 'md'}>
                                버튼
                            </Button>
                        </div>
                    ))}
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-matrix" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-matrix" className="typo-h4-bold">
                        기본 버튼 크기 조합
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Primary·Secondary·Tertiary와 5단계 size의 실제 조합입니다. 44px 미만인 sm·xs는 밀도 높은
                        UI에서만 사용하고 인접 요소와 충분한 간격을 확보합니다.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    {TYPES.map((type) => (
                        <p key={type.key} className="typo-body-l-regular text-muted-foreground">
                            <span className="text-foreground font-medium">{type.label}</span> — {type.desc}
                        </p>
                    ))}
                </div>
                <Table
                    size="md"
                    caption="버튼 type·size 조합 미리보기"
                    columns={TYPE_MATRIX_COLUMNS}
                    rows={TYPE_MATRIX_ROWS}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-icon-matrix" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-icon-matrix" className="typo-h4-bold">
                        아이콘 버튼 크기와 Variant
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        아이콘만 있는 정사각 버튼입니다. <span className="font-mono">variant</span> 와{' '}
                        <span className="font-mono">size</span> 는 서로 독립된 축이라, 텍스트 버튼과 똑같이{' '}
                        <span className="font-mono">primary·secondary·tertiary</span>(+ 내부용{' '}
                        <span className="font-mono">ghost</span>) 를 아이콘 버튼에도 그대로 쓸 수 있습니다. 아이콘만
                        있으므로 <code className="font-mono">aria-label</code> 로 용도를 알리고 내부 아이콘은{' '}
                        <code className="font-mono">aria-hidden</code> 입니다(5.1.1).
                    </p>
                </div>
                <Table
                    size="md"
                    caption="아이콘 버튼 variant·size 조합 미리보기"
                    columns={ICON_MATRIX_COLUMNS}
                    rows={ICON_MATRIX_ROWS}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-plain" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-plain" className="typo-h4-bold">
                        여백 없는 아이콘 버튼
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        배경·테두리·여백 없이{' '}
                        <strong className="text-foreground font-medium">상자를 아이콘 크기와 똑같이</strong> 두는
                        variant 입니다. hover 에서 아이콘 색만 바뀌고, 보이는 크기와 눌리는 범위가 일치합니다. 모달
                        닫기(X)·헤더 아이콘처럼 시안에 면이 없는 아이콘 버튼에 씁니다.
                    </p>
                    <p className="typo-body-l-regular text-muted-foreground">
                        컨트롤 높이를 쓰지 않으므로{' '}
                        <strong className="text-foreground font-medium">
                            같은 size 라도 위 표의 높이와 값이 다릅니다
                        </strong>{' '}
                        — 예를 들어 <span className="font-mono">icon-lg</span> 는 52px 이 아니라 아이콘 그대로 32px
                        입니다. 오른쪽 열에 같은 size 의 면 있는 버튼을 나란히 두었습니다. 상자가 작아지는 만큼 인접
                        컨트롤과의 간격은 사용처에서 확보합니다([6.1.3]).
                    </p>
                </div>
                <Table
                    size="md"
                    caption="plain 버튼 size 별 상자 크기"
                    columns={PLAIN_MATRIX_COLUMNS}
                    rows={PLAIN_MATRIX_ROWS}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-inline-matrix" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-inline-matrix" className="typo-h4-bold">
                        인라인 버튼 Variant 비교
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        비교하기 쉽도록 미리보기는 모두 <span className="font-mono">lg</span> size 로 통일합니다. 둘은
                        같은 Figma 사양(행간·폰트·아이콘·색)을 공유하고 밑줄 유무만 다릅니다. size 별 사양은 아래{' '}
                        <a href="#button-text-matrix" className="text-primary underline underline-offset-4">
                            Text 버튼 크기
                        </a>
                        를 참고하세요.
                    </p>
                </div>
                <Table
                    size="md"
                    caption="인라인 텍스트 버튼 variant 미리보기"
                    columns={INLINE_VARIANT_COLUMNS}
                    rows={INLINE_VARIANT_ROWS}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-text-matrix" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-text-matrix" className="typo-h4-bold">
                        Text 버튼 크기
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Figma <span className="font-mono">button_text</span> 는 공용 size 축과 별개로 자체 4단
                        스케일(폰트 18/16/14/12 · 행간 27/24/21/18 · 아이콘 16/16/16/12)을 쓰고, 전 사이즈가
                        Regular(400)입니다. 상자 높이를 따로 두지 않고{' '}
                        <strong className="text-foreground font-medium">행간이 높이를 정합니다</strong> — 문장 안에
                        섞이는 버튼이라 컨트롤 높이를 주면 주변 줄 높이가 어긋나고, 밑줄도 글자 줄 아랫변 기준이라 같이
                        밀립니다. 채움·테두리가 없어 <span className="font-mono">default·hover·pressed</span> 가 모두
                        같은 색(
                        <span className="font-mono">label-foreground</span>)이라 상태 피드백은 focus 링뿐이고,{' '}
                        <span className="font-mono">disabled</span> 만 흐리게가 아니라 solid{' '}
                        <span className="font-mono">disabled-subtle</span> 로 바뀝니다. 공용 축의 44px 터치 보정(
                        <span className="font-mono">min-h-11</span>)도 적용되지 않습니다 — 밀도 높은 UI 용 컴팩트
                        예외로, 인접 간격을 넉넉히 두고 씁니다(6.1.3).
                    </p>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <h3 className="typo-body-l-medium text-foreground font-mono">variant=&quot;text&quot;</h3>
                        <InlineSizeTable variant="text" caption="text 버튼 size 조합 미리보기" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="typo-body-l-medium text-foreground font-mono">
                            variant=&quot;text-underline&quot;
                        </h3>
                        <InlineSizeTable variant="text-underline" caption="text-underline 버튼 size 조합 미리보기" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-inline-anchor" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-inline-anchor" className="typo-h4-bold">
                        링크로 쓰는 인라인 버튼
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        인라인 텍스트 버튼은 <code className="font-mono">button</code> 뿐 아니라{' '}
                        <code className="font-mono">a</code> 로도 쓸 수 있습니다.{' '}
                        <code className="font-mono">asChild</code> 를 켜고 자식으로{' '}
                        <code className="font-mono">next/link</code> 를 넣으면 스타일은 그대로 두고 태그만 바뀝니다(
                        <span className="font-mono">text</span>·<span className="font-mono">text-underline</span> 둘 다
                        동일).
                    </p>
                    <p className="typo-body-l-regular text-muted-foreground">
                        고르는 기준은 모양이 아니라 <strong className="text-foreground font-medium">동작</strong>입니다
                        — 다른 주소로 이동하면 <code className="font-mono">a</code>, 현재 화면에서 무언가를
                        실행하면(모달 열기·펼치기·제출) <code className="font-mono">button</code> 입니다([8.1.1]).
                        링크로 쓸 때는 <code className="font-mono">disabled</code> 가 동작하지 않으므로, 비활성이
                        필요하면 링크를 빼고 <code className="font-mono">button</code> 으로 두거나 텍스트만 남깁니다.
                    </p>
                </div>
                <div className="border-border flex flex-wrap items-center gap-6 rounded-md border p-6">
                    <Button variant="text" size="lg" asChild>
                        <Link href="#button-props">
                            Props 보기
                            <ChevronRight aria-hidden="true" />
                        </Link>
                    </Button>
                    <Button variant="text-underline" size="lg" asChild>
                        <Link href="#button-props">
                            Props 보기
                            <ChevronRight aria-hidden="true" />
                        </Link>
                    </Button>
                </div>
                <CodeBlock code={INLINE_ANCHOR_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-icon-pill" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-icon-pill" className="typo-h4-bold">
                        원형 아이콘 버튼
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        아이콘 버튼의 기본 모서리는 <span className="font-mono">rounded-sm</span>(8px) 이지만, 검색 바의
                        검색 버튼처럼 완전한 원형이 필요하면{' '}
                        <code className="font-mono">className=&quot;rounded-full&quot;</code> 로 덮어씁니다(twMerge 가
                        기본 radius 를 정확히 치환합니다). 어떤 <span className="font-mono">variant</span> 에도 그대로
                        적용됩니다.
                    </p>
                </div>
                <div className="border-border flex flex-wrap items-end gap-6 rounded-md border p-6">
                    {ICON_VARIANTS.map((v) => (
                        <div key={v.key} className="flex flex-col items-center gap-2">
                            <Button variant={v.key} size="icon" className="rounded-full" aria-label="검색">
                                <Search aria-hidden="true" />
                            </Button>
                            <span className="typo-caption-regular text-foreground font-mono">{v.label}</span>
                        </div>
                    ))}
                </div>
                <CodeBlock code={ROUND_ICON_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-disabled" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-disabled" className="typo-h4-bold">
                        비활성 상태
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        비활성 상태는 단순히 흐리게 처리하지 않고, type 별로 별도 배경·테두리·텍스트 색을 씁니다. 인라인
                        텍스트 버튼(<span className="font-mono">text</span>·
                        <span className="font-mono">text-underline</span>)은 문장 안에 섞이는 버튼이라 아이콘 전용으로
                        쓰지 않아 해당 칸을 비웠습니다 — 면 없는 아이콘 버튼은 <span className="font-mono">plain</span>{' '}
                        이 담당합니다.
                    </p>
                </div>
                <Table
                    size="md"
                    caption="Button variant별 비활성 상태"
                    columns={DISABLED_COLUMNS}
                    rows={DISABLED_ROWS}
                />
                <CodeBlock code={DISABLED_ICON_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-loading" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-loading" className="typo-h4-bold">
                        로딩 상태
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        진행 중 상태입니다. Disabled 와 달리 variant 색은 그대로 두고 스피너(
                        <code className="font-mono">animate-spin</code>)를 앞에 둡니다.{' '}
                        <code className="font-mono">aria-busy</code> +{' '}
                        <code className="font-mono">pointer-events-none</code> 로 진행 중 중복 클릭을 막습니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {TYPES.map((type) => (
                        <Button
                            key={type.key}
                            variant={type.key}
                            size="md"
                            aria-busy="true"
                            className="pointer-events-none"
                        >
                            <LoaderCircle aria-hidden="true" className="animate-spin" />
                            로딩중
                        </Button>
                    ))}
                </div>
                <CodeBlock code={LOADING_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="button-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="button-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Button 에서 커스터마이징 가능한 속성입니다.
                    </p>
                </div>
                <Table size="md" caption="Props 목록" columns={PROPS_COLUMNS} rows={PROPS_ROWS} />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ButtonGuidePage
