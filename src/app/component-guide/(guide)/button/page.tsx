import type {Metadata} from 'next'
import {ArrowRight, ChevronRight, Download, LoaderCircle, Search, Sun} from 'lucide-react'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '버튼 (Button)'}

const USAGE_CODE = `<Button variant="default" size="medium">저장</Button>
<Button variant="secondary" size="medium">취소</Button>
<Button variant="tertiary" size="medium">더보기</Button>`

const USAGE_CODE_ICON = `{/* 아이콘 왼쪽 */}
<Button variant="default" size="medium">
  <Download aria-hidden="true" />
  다운로드
</Button>

{/* 아이콘 오른쪽 */}
<Button variant="default" size="medium">
  다음
  <ArrowRight aria-hidden="true" />
</Button>`

// Loading — variant 색은 유지하고 스피너 + aria-busy + pointer-events-none 로 진행 중을 표현한다.
const LOADING_CODE = `<Button variant="default" size="medium" aria-busy className="pointer-events-none">
  <LoaderCircle aria-hidden="true" className="animate-spin" />
  로딩중
</Button>`

const DISABLED_ICON_CODE = `<Button variant="default" size="medium" disabled>
  <Download aria-hidden="true" />
  다운로드
</Button>

<Button variant="secondary" size="medium" disabled>
  다음
  <ArrowRight aria-hidden="true" />
</Button>`

// Figma 버튼 컴포넌트셋의 3 type. secondary 는 회색 solid 가 아니라 연한 블루 틴트+테두리 스타일이다.
const TYPES = [
    {key: 'default', label: 'Primary', desc: '가장 강조되는 주요 액션(화면당 1개 권장)에 사용합니다.'},
    {key: 'secondary', label: 'Secondary', desc: 'Primary 와 나란히 놓이는 보조 액션에 사용합니다.'},
    {key: 'tertiary', label: 'Tertiary', desc: '가장 낮은 강조의 보조 액션(취소·더보기 등)에 사용합니다.'},
] as const

// Figma 사이즈 스케일(xlarge~small) + 프로젝트 보간 xsmall(36)/2xsmall(32)을 노출한다. 클래스명은 cva 안에
// 리터럴로 고정돼 있어 여기서도 템플릿 문자열 대신 배열에 직접 나열한다(Tailwind 정적 분석, icon 가이드와 동일 이유).
const SIZES = [
    {key: 'xlarge', label: 'xlarge', height: 60},
    {key: 'large', label: 'large', height: 52},
    {key: 'medium', label: 'medium', height: 48},
    {key: 'small', label: 'small', height: 40},
    {key: 'xsmall', label: 'xsmall', height: 36},
    {key: '2xsmall', label: '2xsmall', height: 32},
] as const

// 아이콘 전용(정사각) 버튼 사이즈. 텍스트 사이즈와 달리 min-w 가 없어 정사각형이 되고, 텍스트 스케일 높이에
// 대응한다(icon-2xl=60·icon-xl=52·icon-lg=48·icon=44(44px 터치타깃)·icon-sm=36·icon-xs=32).
const ICON_SIZES = [
    {key: 'icon-2xl', label: 'icon-2xl', height: 60},
    {key: 'icon-xl', label: 'icon-xl', height: 52},
    {key: 'icon-lg', label: 'icon-lg', height: 48},
    {key: 'icon', label: 'icon', height: 44},
    {key: 'icon-sm', label: 'icon-sm', height: 36},
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

const LEGACY_SIZES = [
    'default',
    'lg',
    'icon',
    'icon-lg',
    'icon-xl',
    'icon-2xl',
    'sm',
    'xs',
    'icon-sm',
    'icon-xs',
] as const

// Button 이 가진 variant 케이스. default/secondary/tertiary/text 는 Figma type(버튼 전용 토큰),
// ghost/destructive/link 는 다이얼로그·시트 등 내부 컴포넌트가 쓰는 기존 값이다(outline 은 프로젝트 미사용).
// 채움이 없는 text/link 는 모양이 비슷해 마지막에 나란히 둔다.
const ALL_VARIANTS = [
    {key: 'default', label: 'default', note: 'Figma Primary'},
    {key: 'secondary', label: 'secondary', note: 'Figma Secondary'},
    {key: 'tertiary', label: 'tertiary', note: 'Figma Tertiary'},
    {key: 'ghost', label: 'ghost', note: '내부 컴포넌트용'},
    {key: 'destructive', label: 'destructive', note: '내부 컴포넌트용'},
    {key: 'text', label: 'text', note: 'Figma Text(채움·테두리 없음)'},
    {key: 'link', label: 'link', note: 'Figma Text + hover 밑줄'},
] as const

const INLINE_VARIANTS = [
    {key: 'text', label: 'text', note: '채움·테두리 없는 텍스트형'},
    {key: 'link', label: 'link', note: 'text 와 같되 hover 에 밑줄'},
] as const

// Figma button_text 는 공용 size 축(xlarge~2xsmall)과 별개로 자체 4단 스케일을 쓴다(값은 Figma 실측 px).
// link 도 이 사양을 그대로 공유한다 — hover 밑줄만 다르다.
const INLINE_SIZES = [
    {key: 'large', label: 'large', height: 40, font: 18, icon: 20},
    {key: 'medium', label: 'medium', height: 32, font: 16, icon: 20},
    {key: 'small', label: 'small', height: 24, font: 14, icon: 16},
    {key: 'xsmall', label: 'xsmall', height: 24, font: 12, icon: 12},
] as const

// text·link 는 같은 Figma 사양을 공유하므로 큐레이션 표도 같은 모양으로 나란히 둔다.
const InlineSizeTable = ({variant, caption}: {variant: 'text' | 'link'; caption: string}) => (
    <div className="bg-background border-border overflow-x-auto rounded-md border">
        <table className="w-full text-left">
            <caption className="sr-only">{caption}</caption>
            <thead>
                <tr className="border-border border-b bg-gray-100/25">
                    <th scope="col" className="typo-body-l-medium px-4 py-3">
                        Size
                    </th>
                    <th scope="col" className="typo-body-l-medium px-4 py-3">
                        텍스트
                    </th>
                    <th scope="col" className="typo-body-l-medium px-4 py-3">
                        아이콘 왼쪽
                    </th>
                    <th scope="col" className="typo-body-l-medium px-4 py-3">
                        아이콘 오른쪽
                    </th>
                    <th scope="col" className="typo-body-l-medium px-4 py-3">
                        disabled
                    </th>
                </tr>
            </thead>
            <tbody>
                {INLINE_SIZES.map((size) => (
                    <tr key={size.key} className="border-border bg-background border-b last:border-b-0">
                        <th
                            scope="row"
                            className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                        >
                            {size.label}
                            <span className="typo-caption-regular text-muted-foreground block font-sans">
                                {size.height}px · 폰트 {size.font}px · 아이콘 {size.icon}px
                            </span>
                        </th>
                        <td className="px-4 py-3 align-middle">
                            <Button variant={variant} size={size.key}>
                                버튼명
                            </Button>
                        </td>
                        <td className="px-4 py-3 align-middle">
                            <Button variant={variant} size={size.key}>
                                <Download aria-hidden="true" />
                                버튼명
                            </Button>
                        </td>
                        <td className="px-4 py-3 align-middle">
                            <Button variant={variant} size={size.key}>
                                버튼명
                                <ChevronRight aria-hidden="true" />
                            </Button>
                        </td>
                        <td className="px-4 py-3 align-middle">
                            <Button variant={variant} size={size.key} disabled>
                                <Download aria-hidden="true" />
                                버튼명
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)

// 버튼은 Card 와 달리 아이콘 전용 하위 컴포넌트가 없다 — 아이콘은 props 가 아니라 children 으로
// 직접 조합한다(lucide-react, 장식 목적이면 aria-hidden). 좌/우 어느 쪽에도 넣을 수 있다.
const ButtonGuidePage = () => (
    <GuidePageShell
        title="버튼 (Button)"
        description="shadcn Button 프리미티브입니다. 3가지 type × 6가지 사이즈에 아이콘 버튼까지 지원합니다."
    >
        <section aria-labelledby="button-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="button-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">variant</code> 로 강조 단계(Primary/Secondary/Tertiary)를,{' '}
                    <code className="font-mono">size</code> 로 크기를 고릅니다.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <Button variant="default" size="medium">
                    저장
                </Button>
                <Button variant="secondary" size="medium">
                    취소
                </Button>
                <Button variant="tertiary" size="medium">
                    더보기
                </Button>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">아이콘 조합</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    아이콘은 별도 prop 이 아니라 children 으로 텍스트와 함께 조합합니다. 텍스트 좌/우 어느 쪽에도 놓을
                    수 있고, 장식 목적 아이콘에는 <code className="font-mono">aria-hidden</code> 을 붙입니다.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <Button variant="default" size="medium">
                    <Download aria-hidden="true" />
                    다운로드
                </Button>
                <Button variant="default" size="medium">
                    다음
                    <ArrowRight aria-hidden="true" />
                </Button>
            </div>
            <CodeBlock code={USAGE_CODE_ICON} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="button-variants" className="flex flex-col gap-4">
            <div>
                <h2 id="button-variants" className="typo-h4-bold">
                    전체 Variant
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Button 을 디자인에 쓰는 variant 입니다.{' '}
                    <span className="font-mono">default·secondary·tertiary·text</span> 는 Figma type(
                    <span className="font-mono">text</span> 는 채움·테두리 없는 텍스트 버튼)이고,{' '}
                    <span className="font-mono">link</span> 는 그 text 사양에 hover 밑줄만 더한 형태입니다.{' '}
                    <span className="font-mono">ghost·destructive</span> 는 다이얼로그·시트 등 내부 컴포넌트가 쓰는 기존
                    값입니다(outline 은 목록에서 제외).
                </p>
            </div>
            <div className="flex flex-col gap-4">
                {ALL_VARIANTS.map((v) => (
                    <div key={v.key} className="flex flex-wrap items-center gap-3">
                        <div className="flex w-40 shrink-0 flex-col">
                            <span className="typo-body-l-medium text-foreground font-mono">{v.label}</span>
                            <span className="typo-caption-regular text-muted-foreground">{v.note}</span>
                        </div>
                        <Button variant={v.key} size="medium">
                            버튼
                        </Button>
                    </div>
                ))}
            </div>
        </section>

        <section aria-labelledby="button-matrix" className="flex flex-col gap-4">
            <div>
                <h2 id="button-matrix" className="typo-h4-bold">
                    Type × Size 큐레이션
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    3 type 을 열로, 6 size 를 행으로 교차해 전체 조합을 확인합니다. 44px 미만인 small·xsmall·2xsmall 은
                    밀도 높은 UI 용 컴팩트 예외입니다(터치 타깃 보정 미적용, 인접 간격 확보 전제).
                </p>
            </div>
            <div className="flex flex-col gap-3">
                {TYPES.map((type) => (
                    <p key={type.key} className="typo-body-l-regular text-muted-foreground">
                        <span className="text-foreground font-medium">{type.label}</span> — {type.desc}
                    </p>
                ))}
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">버튼 type·size 조합 미리보기</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Size
                            </th>
                            {TYPES.map((type) => (
                                <th key={type.key} scope="col" className="typo-body-l-medium px-4 py-3">
                                    {type.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {SIZES.map((size) => (
                            <tr key={size.key} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                                >
                                    {size.label}
                                    <span className="typo-caption-regular text-muted-foreground block font-sans">
                                        {size.height}px
                                    </span>
                                </th>
                                {TYPES.map((type) => (
                                    <td key={type.key} className="px-4 py-3 align-middle">
                                        <div className="flex flex-col items-start gap-2">
                                            <Button variant={type.key} size={size.key}>
                                                <Download aria-hidden="true" />
                                                버튼
                                            </Button>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="button-icon-matrix" className="flex flex-col gap-4">
            <div>
                <h2 id="button-icon-matrix" className="typo-h4-bold">
                    아이콘 전용 버튼
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    아이콘만 있는 정사각 버튼입니다. <span className="font-mono">variant</span> 와{' '}
                    <span className="font-mono">size</span> 는 서로 독립된 축이라, 텍스트 버튼과 똑같이{' '}
                    <span className="font-mono">primary·secondary·tertiary</span>(+ 내부용{' '}
                    <span className="font-mono">ghost</span>) 를 아이콘 버튼에도 그대로 쓸 수 있습니다. 아이콘만
                    있으므로 <code className="font-mono">aria-label</code> 로 용도를 알리고 내부 아이콘은{' '}
                    <code className="font-mono">aria-hidden</code> 입니다(5.1.1).{' '}
                    <code className="font-mono">icon</code> (44px)은 터치 타깃을 보장하고, 그 이하는 밀도 높은 UI 용
                    컴팩트 예외입니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">아이콘 버튼 variant·size 조합 미리보기</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Size
                            </th>
                            {ICON_VARIANTS.map((v) => (
                                <th key={v.key} scope="col" className="typo-body-l-medium px-4 py-3">
                                    {v.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ICON_SIZES.map((size) => (
                            <tr key={size.key} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                                >
                                    {size.label}
                                    <span className="typo-caption-regular text-muted-foreground block font-sans">
                                        {size.height}px
                                    </span>
                                </th>
                                {ICON_VARIANTS.map((v) => (
                                    <td key={v.key} className="px-4 py-3 align-middle">
                                        <div className="flex flex-col items-start gap-2">
                                            <Button variant={v.key} size={size.key} aria-label="라이트 모드">
                                                <Sun aria-hidden="true" />
                                            </Button>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="button-inline-matrix" className="flex flex-col gap-4">
            <div>
                <h2 id="button-inline-matrix" className="typo-h4-bold">
                    Link/Text 큐레이션
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    비교하기 쉽도록 미리보기는 모두 <span className="font-mono">medium</span> size 로 통일합니다. 둘은
                    같은 Figma 사양(높이·폰트·아이콘·색)을 공유하고 <span className="font-mono">link</span> 만 hover 에
                    밑줄이 붙습니다. size 별 사양은 아래{' '}
                    <a href="#button-text-matrix" className="text-primary underline underline-offset-4">
                        Text
                    </a>
                    ·
                    <a href="#button-link-matrix" className="text-primary underline underline-offset-4">
                        Link 사이즈 큐레이션
                    </a>
                    을 참고하세요.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">link text 버튼 variant 미리보기</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Variant
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Preview
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Note
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {INLINE_VARIANTS.map((variant) => (
                            <tr key={variant.key} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                                >
                                    {variant.label}
                                </th>
                                <td className="px-4 py-3 align-middle">
                                    <div className="flex flex-col items-start gap-2">
                                        <Button variant={variant.key} size="medium">
                                            자세히 보기
                                        </Button>
                                    </div>
                                </td>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{variant.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="button-text-matrix" className="flex flex-col gap-4">
            <div>
                <h2 id="button-text-matrix" className="typo-h4-bold">
                    Text 사이즈 큐레이션
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Figma <span className="font-mono">button_text</span> 는 공용 size 축과 별개로 자체 4단 스케일(높이
                    40/32/24/24 · 폰트 18/16/14/12 · 아이콘 20/20/16/12)을 쓰고, 전 사이즈가 Regular(400)입니다.
                    채움·테두리가 없어 <span className="font-mono">default·hover·pressed</span> 가 모두 같은 색(
                    <span className="font-mono">label-foreground</span>)이라 상태 피드백은 focus 링뿐이고,{' '}
                    <span className="font-mono">disabled</span> 만 흐리게가 아니라 solid{' '}
                    <span className="font-mono">disabled-subtle</span> 로 바뀝니다. 높이는 Figma 값을 그대로 쓰므로 공용
                    축의 44px 터치 보정(<span className="font-mono">min-h-11</span>)이 적용되지 않습니다 — 밀도 높은 UI
                    용 컴팩트 예외로, 인접 간격을 넉넉히 두고 씁니다(6.1.3).
                </p>
            </div>
            <InlineSizeTable variant="text" caption="text 버튼 size 조합 미리보기" />
        </section>

        <section aria-labelledby="button-link-matrix" className="flex flex-col gap-4">
            <div>
                <h2 id="button-link-matrix" className="typo-h4-bold">
                    Link 사이즈 큐레이션
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <span className="font-mono">link</span> 는 위 <span className="font-mono">text</span> 와 높이·폰트·
                    아이콘·색 사양이 모두 같고,{' '}
                    <strong className="text-foreground font-medium">hover 에서만 밑줄</strong>(
                    <span className="font-mono">underline-offset-4</span>)이 붙는 점만 다릅니다. 표의 미리보기는 정적
                    이라 밑줄이 보이지 않으니 마우스를 올려 확인하세요.
                </p>
            </div>
            <InlineSizeTable variant="link" caption="link 버튼 size 조합 미리보기" />
        </section>

        <section aria-labelledby="button-icon-pill" className="flex flex-col gap-4">
            <div>
                <h2 id="button-icon-pill" className="typo-h4-bold">
                    완전 원형 (pill)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    아이콘 버튼의 기본 모서리는 <span className="font-mono">rounded-sm</span>(8px) 이지만, 검색 바의
                    검색 버튼처럼 완전한 원형이 필요하면{' '}
                    <code className="font-mono">className=&quot;rounded-full&quot;</code> 로 덮어씁니다(twMerge 가 기본
                    radius 를 정확히 치환합니다). 어떤 <span className="font-mono">variant</span> 에도 그대로
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
        </section>

        <section aria-labelledby="button-disabled" className="flex flex-col gap-4">
            <div>
                <h2 id="button-disabled" className="typo-h4-bold">
                    Disabled 상태
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    비활성 상태는 단순히 흐리게 처리하지 않고, type 별로 별도 배경·테두리·텍스트 색을 씁니다.
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                {TYPES.map((type) => (
                    <Button key={type.key} variant={type.key} size="medium" disabled>
                        {type.label}
                    </Button>
                ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
                {TYPES.map((type) => (
                    <Button key={type.key} variant={type.key} size="medium" disabled>
                        <Download aria-hidden="true" />
                        {type.label}
                    </Button>
                ))}
                <Button variant="secondary" size="medium" disabled>
                    다음
                    <ArrowRight aria-hidden="true" />
                </Button>
            </div>
            <CodeBlock code={DISABLED_ICON_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="button-loading" className="flex flex-col gap-4">
            <div>
                <h2 id="button-loading" className="typo-h4-bold">
                    Loading 상태
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
                        size="medium"
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

        <section aria-labelledby="button-props" className="flex flex-col gap-4">
            <div>
                <h2 id="button-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">Button 에서 커스터마이징 가능한 속성입니다.</p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Props 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Name
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Default
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Control
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                variant
                            </th>
                            <td className="px-4 py-3">
                                <p className="typo-body-l-regular text-muted-foreground">
                                    강조 단계. default/secondary/tertiary 는 Figma 디자인을 반영한 버튼 전용 토큰을
                                    씁니다. outline/ghost/destructive 는 다이얼로그·시트 등 내부 컴포넌트가 쓰는 기존
                                    값이고, text/link 는 채움이 없는 인라인 액션이라 마지막에 함께 둡니다.
                                </p>
                            </td>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                &apos;default&apos;
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                    {[
                                        ...TYPES.map((t) => t.key),
                                        'outline',
                                        'ghost',
                                        'destructive',
                                        'text',
                                        'link',
                                    ].map((value) => (
                                        <span
                                            key={value}
                                            className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs"
                                        >
                                            {value}
                                        </span>
                                    ))}
                                </div>
                            </td>
                        </tr>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                size
                            </th>
                            <td className="px-4 py-3">
                                <p className="typo-body-l-regular text-muted-foreground">
                                    Figma 사이즈 스케일(xlarge~small) + 프로젝트 보간 xsmall(36)·2xsmall(32)입니다. 기존
                                    값(default/lg/icon 등)은 다이얼로그·시트·사이드바 등 내부 컴포넌트 호환을 위해
                                    그대로 유지됩니다.
                                </p>
                            </td>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                &apos;default&apos;
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                    {[...SIZES.map((s) => s.key), ...LEGACY_SIZES].map((value) => (
                                        <span
                                            key={value}
                                            className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs"
                                        >
                                            {value}
                                        </span>
                                    ))}
                                </div>
                            </td>
                        </tr>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                asChild
                            </th>
                            <td className="px-4 py-3">
                                <p className="typo-body-l-regular text-muted-foreground">
                                    <code className="font-mono">next/link</code> 등 다른 요소에 버튼 스타일만 씌울 때
                                    사용합니다.
                                </p>
                            </td>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">false</td>
                            <td className="px-4 py-3">
                                <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                    boolean
                                </span>
                            </td>
                        </tr>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                className
                            </th>
                            <td className="px-4 py-3">
                                <p className="typo-body-l-regular text-muted-foreground">
                                    추가 클래스명으로 스타일 확장
                                </p>
                            </td>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                &quot;&quot;
                            </td>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePageShell>
)

export default ButtonGuidePage
