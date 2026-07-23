import type {Metadata} from 'next'
import type {LucideIcon} from 'lucide-react'
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Blocks,
    Building2,
    Calendar,
    ChartArea,
    Check,
    CheckCheck,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    ChevronUp,
    CircleAlert,
    CircleCheck,
    Component,
    Copy,
    CreditCard,
    Download,
    ExternalLink,
    Eye,
    EyeOff,
    File,
    FileCheckCorner,
    FilePenLine,
    FileSearchCorner,
    Folder,
    GitBranch,
    Home,
    IdCardLanyard,
    Info,
    Landmark,
    Layers,
    LayoutGrid,
    LayoutList,
    LoaderCircle,
    Lock,
    Menu,
    MessageCircleMore,
    Moon,
    MoreHorizontal,
    Mouse,
    NotepadText,
    Palette,
    PanelLeft,
    Pin,
    Plus,
    RotateCcw,
    SavePen,
    Search,
    Sparkles,
    SquareArrowOutUpRight,
    Sun,
    TriangleAlert,
    Upload,
    User,
    X,
} from 'lucide-react'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {BaseCard} from '@/components/composite/base-card'
import {Icon, type IconSymbol} from '@/components/custom/icon'
import packageJson from '../../../../../package.json'
import tokens from '@tokens'

export const metadata: Metadata = {title: '아이콘 (Icon)'}

const ICON_SIZE_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'class', header: '클래스 (클릭 복사)', align: 'start', rowHeader: true},
    {key: 'value', header: '값', align: 'start'},
] as const

const FIGMA_MAP_COLUMNS = [
    {key: 'figma', header: 'Figma 이름', align: 'start', rowHeader: true},
    {key: 'lucide', header: 'lucide 아이콘', align: 'start'},
] as const

// lucide-react 버전은 package.json 을 단일 소스로 읽는다 — 패키지를 올리면 이 페이지도 저절로 갱신된다.
const LUCIDE_VERSION = packageJson.dependencies['lucide-react'].replace(/^[\^~]/, '')
const LUCIDE_REPO_URL = 'https://github.com/lucide-icons/lucide'

// 사용법 — 세 형태(outline·solid·symbol)를 한 스니펫에 담아 미리보기와 1:1 로 맞춘다.
const USAGE_CODE = `import {Search, X} from 'lucide-react'
import {Icon} from '@/components/custom/icon'

{/* outline(기본) — 글리프 그대로. 크기는 size-icon-*, 색은 text-* 유틸 */}
<Icon icon={Search} className="size-icon-xl text-foreground" />

{/* solid — 원형 배지 안에 글리프 */}
<Icon icon={X} variant="solid" className="size-icon-xl" />

{/* symbol — lucide 에 채운 글리프가 없는 정보·경고는 문자형 배지(i·!) */}
<Icon symbol="info" variant="solid" className="size-icon-xl" />
<Icon symbol="alert" variant="solid" className="size-icon-xl" />`

// 아이콘 단독 버튼 — 접근 가능한 이름은 감싸는 상호작용 요소가 갖는다([5.1.1]).
const ICON_BUTTON_CODE = `<Button size="icon" aria-label="검색">
    <Search />
</Button>`

// 아이콘 크기 — size.icon-* 토큰(size-icon-* 유틸)만 사용한다. 클래스명은 Tailwind 정적 분석을
// 위해 리터럴로 고정 — 템플릿 문자열(`size-${key}`)로 조합하면 스캐너가 인식하지 못해 스타일이
// 안 나온다(z-index 가이드와 같은 이유). 새 크기를 추가하면 tokens.json 의 size.icon-* 와 함께 갱신.
const ICON_SIZES = [
    {key: 'icon-xs', class: 'size-icon-xs'},
    {key: 'icon-sm', class: 'size-icon-sm'},
    {key: 'icon-md', class: 'size-icon-md'},
    {key: 'icon-lg', class: 'size-icon-lg'},
    {key: 'icon-xl', class: 'size-icon-xl'},
    {key: 'icon-2xl', class: 'size-icon-2xl'},
] as const

// 아이콘 큐레이션 — 프로젝트 소스에서 실제 import하는 lucide-react 아이콘 + Figma 아이콘 세트(icon/line-*)의
// lucide 대응 아이콘 전체([NA-008] 표준 단일 아이콘 라이브러리). *Icon 별칭은 같은 글리프의 정식 이름으로 합쳐
// 중복을 제거한다. 새 아이콘을 사용하거나 Figma 세트에 추가되면 함께 갱신한다.
// Figma 이름 ↔ lucide 매핑 규칙과 예외는 페이지의 "Figma 이름 매핑" 표가 단일 안내처다.
const CURATED_ICONS = [
    {name: 'ArrowLeft', Icon: ArrowLeft},
    {name: 'ArrowRight', Icon: ArrowRight},
    {name: 'ArrowUpRight', Icon: ArrowUpRight},
    {name: 'Blocks', Icon: Blocks},
    {name: 'Building2', Icon: Building2},
    {name: 'Calendar', Icon: Calendar},
    {name: 'ChartArea', Icon: ChartArea},
    {name: 'Check', Icon: Check},
    {name: 'CheckCheck', Icon: CheckCheck},
    {name: 'ChevronDown', Icon: ChevronDown},
    {name: 'ChevronLeft', Icon: ChevronLeft},
    {name: 'ChevronRight', Icon: ChevronRight},
    {name: 'ChevronsRight', Icon: ChevronsRight},
    {name: 'ChevronUp', Icon: ChevronUp},
    {name: 'CircleAlert', Icon: CircleAlert},
    {name: 'CircleCheck', Icon: CircleCheck},
    {name: 'Component', Icon: Component},
    {name: 'Copy', Icon: Copy},
    {name: 'CreditCard', Icon: CreditCard},
    {name: 'Download', Icon: Download},
    {name: 'ExternalLink', Icon: ExternalLink},
    {name: 'Eye', Icon: Eye},
    {name: 'EyeOff', Icon: EyeOff},
    {name: 'File', Icon: File},
    {name: 'FileCheckCorner', Icon: FileCheckCorner},
    {name: 'FilePenLine', Icon: FilePenLine},
    {name: 'FileSearchCorner', Icon: FileSearchCorner},
    {name: 'Folder', Icon: Folder},
    {name: 'GitBranch', Icon: GitBranch},
    {name: 'Home', Icon: Home},
    {name: 'IdCardLanyard', Icon: IdCardLanyard},
    {name: 'Info', Icon: Info},
    {name: 'Landmark', Icon: Landmark},
    {name: 'Layers', Icon: Layers},
    {name: 'LayoutGrid', Icon: LayoutGrid},
    {name: 'LayoutList', Icon: LayoutList},
    {name: 'LoaderCircle', Icon: LoaderCircle},
    {name: 'Lock', Icon: Lock},
    {name: 'Menu', Icon: Menu},
    {name: 'MessageCircleMore', Icon: MessageCircleMore},
    {name: 'Moon', Icon: Moon},
    {name: 'MoreHorizontal', Icon: MoreHorizontal},
    {name: 'Mouse', Icon: Mouse},
    {name: 'NotepadText', Icon: NotepadText},
    {name: 'Palette', Icon: Palette},
    {name: 'PanelLeft', Icon: PanelLeft},
    {name: 'Pin', Icon: Pin},
    {name: 'Plus', Icon: Plus},
    {name: 'RotateCcw', Icon: RotateCcw},
    {name: 'SavePen', Icon: SavePen},
    {name: 'Search', Icon: Search},
    {name: 'Sparkles', Icon: Sparkles},
    {name: 'SquareArrowOutUpRight', Icon: SquareArrowOutUpRight},
    {name: 'Sun', Icon: Sun},
    {name: 'TriangleAlert', Icon: TriangleAlert},
    {name: 'Upload', Icon: Upload},
    {name: 'User', Icon: User},
    {name: 'X', Icon: X},
] as const

// Figma 세트 이름은 icon/line-<kebab-case> = lucide PascalCase 이름이 기본 규칙이다
// (예: icon/line-file-pen-line → FilePenLine). 규칙에서 벗어나는 예외만 표로 안내한다.
const FIGMA_NAME_EXCEPTIONS = [
    {figma: 'icon/line-close', lucide: 'X'},
    {figma: 'icon/line-left · right · up · down', lucide: 'ChevronLeft · ChevronRight · ChevronUp · ChevronDown'},
    {figma: 'icon/line-reset', lucide: 'RotateCcw'},
    {figma: 'icon/line-alert', lucide: 'CircleAlert'},
    {figma: 'icon/blank', lucide: '대응 없음 — 빈 슬롯 플레이스홀더'},
] as const

// Solid(원형 배지) 스타일은 강조·알림 배지 용도라 실제로 몇 개만 큐레이션한다. lucide에 채운 글리프가
// 없는 Info·CircleAlert는 기존 디자인대로 원형 배지 안에 문자 i·!를 사용한다.
type SolidIconItem = {name: string; icon: LucideIcon; symbol?: never} | {name: string; icon?: never; symbol: IconSymbol}

const SOLID_ICONS: readonly SolidIconItem[] = [
    {name: 'X', icon: X},
    {name: 'Info', symbol: 'info'},
    {name: 'CircleAlert', symbol: 'alert'},
]

const PROPS_ITEMS = [
    [
        'Icon',
        'icon',
        'Lucide 모드에서 표시할 아이콘 컴포넌트입니다. symbol과 함께 쓸 수 없습니다.',
        '조건부 필수',
        'LucideIcon',
    ],
    [
        'Icon',
        'symbol',
        '문자형 Solid 아이콘을 선택합니다. icon과 함께 쓸 수 없습니다.',
        '조건부 필수',
        "'info' | 'alert'",
    ],
    [
        'Icon',
        'variant',
        'Lucide 글리프를 그대로 표시하거나 원형 배지 안에 강조합니다. symbol은 solid만 지원합니다.',
        "'outline'",
        "'outline' | 'solid'",
    ],
    ['Icon', 'className', '크기와 색상 유틸리티를 추가합니다.', "''", 'string'],
] as const

const IconGuidePage = () => (
    <GuidePageShell
        title="아이콘 (Icon)"
        description="lucide-react 아이콘 중 실제 화면에서 쓰는 것들을 큐레이션했습니다."
    >
        <BaseCard>
            <section aria-labelledby="icon-library" className="flex flex-col gap-4">
                <div>
                    <h2 id="icon-library" className="typo-h4-bold">
                        라이브러리
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        아이콘은 표준 단일 라이브러리 lucide-react만 사용합니다([NA-008]) — SVG를 직접 그리거나 다른
                        아이콘 폰트를 섞지 않습니다. 글리프를 그대로 쓰는 것이 outline이고, 원형 배지(solid)나
                        문자형(symbol) 표현이 필요할 때 <code>Icon</code> 래퍼(
                        <code>components/custom/icon.tsx</code>)를 사용합니다.
                    </p>
                </div>
                <div className="border-border flex flex-col gap-4 rounded-md border p-4">
                    <dl className="typo-body-l-regular flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <dt className="text-muted-foreground w-20 shrink-0">패키지</dt>
                            <dd className="font-mono">lucide-react</dd>
                        </div>
                        <div className="flex items-center gap-3">
                            <dt className="text-muted-foreground w-20 shrink-0">버전</dt>
                            <dd className="font-mono">v{LUCIDE_VERSION}</dd>
                        </div>
                        <div className="flex items-center gap-3">
                            <dt className="text-muted-foreground w-20 shrink-0">라이선스</dt>
                            <dd>ISC — 상업적 사용 가능(무료)</dd>
                        </div>
                        <div className="flex items-center gap-3">
                            <dt className="text-muted-foreground w-20 shrink-0">저장소</dt>
                            <dd>
                                <a
                                    href={LUCIDE_REPO_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-1.5 rounded font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                >
                                    <GitBranch aria-hidden="true" className="size-4 shrink-0" />
                                    lucide-icons/lucide
                                    <span className="sr-only"> (새 창에서 열림)</span>
                                </a>
                            </dd>
                        </div>
                    </dl>
                    <div className="flex flex-wrap gap-2">
                        <code className="border-border bg-muted text-foreground rounded-sm border px-2 py-1 font-mono text-sm">
                            yarn add lucide-react
                        </code>
                        <code className="border-border bg-muted text-foreground rounded-sm border px-2 py-1 font-mono text-sm">
                            {"import { Home } from 'lucide-react';"}
                        </code>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="icon-usage" className="typo-h4-bold">
                        사용법
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        형태는 outline(기본)·solid·symbol 세 가지입니다. 크기는{' '}
                        <code className="font-mono">size-icon-*</code>, 색은 <code className="font-mono">text-*</code>{' '}
                        시맨틱 유틸로 지정하고, solid 배지 색은 variant가 정합니다.
                    </p>
                </div>
                <div className="border-border flex flex-wrap items-center gap-8 rounded-md border p-6">
                    <div className="flex items-center gap-3">
                        <Icon icon={Search} className="size-icon-xl text-foreground" />
                        <code className="text-foreground font-mono text-sm">outline</code>
                    </div>
                    <div className="flex items-center gap-3">
                        <Icon icon={X} variant="solid" className="size-icon-xl" />
                        <code className="text-foreground font-mono text-sm">solid</code>
                    </div>
                    <div className="flex items-center gap-3">
                        <Icon symbol="info" variant="solid" className="size-icon-xl" />
                        <Icon symbol="alert" variant="solid" className="size-icon-xl" />
                        <code className="text-foreground font-mono text-sm">symbol</code>
                    </div>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-size" className="flex flex-col gap-4">
                <div>
                    <h2 id="icon-size" className="typo-h4-bold">
                        크기
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        size-icon-* 유틸로 쓰는 아이콘 크기 토큰입니다.
                    </p>
                </div>
                <Table
                    caption="아이콘 크기 토큰과 클래스"
                    columns={ICON_SIZE_COLUMNS}
                    rows={ICON_SIZES.map(({key, class: sizeClass}) => ({
                        key,
                        cells: [
                            <div key="preview" className="flex items-center gap-3">
                                <Icon icon={X} variant="solid" className={`${sizeClass} shrink-0`} />
                                <Icon icon={Info} className={`${sizeClass} text-foreground shrink-0`} />
                            </div>,
                            <code key="class" className="text-foreground font-mono">
                                {sizeClass}
                            </code>,
                            <span key="value" className="font-mono">
                                {tokens.size[key]}px
                            </span>,
                        ],
                    }))}
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-list" className="flex flex-col gap-6">
                <div>
                    <h2 id="icon-list" className="typo-h4-bold">
                        아이콘 목록
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        프로젝트에서 실제 사용하는 아이콘과 Figma 아이콘 세트(icon/line-*)의 lucide 대응을 합친{' '}
                        {CURATED_ICONS.length}개입니다. 목록에 없는 아이콘이 필요하면 lucide에서 골라 쓰고 이 목록에도
                        추가합니다. Solid는 배지가 어울리는 X(닫기)·info(안내)·alert(경고) 세 가지만 씁니다. Stepper의
                        삼각형처럼 한 컴포넌트 전용 장식 SVG는 재사용 아이콘이 아니므로 목록에 없습니다.
                    </p>
                </div>

                {/* Outline·Solid 는 같은 "슬롯 크기"(size-icon-xl·32px)를 공유한다.
          - Outline: span 없이 아이콘만 슬롯 크기로 둔다.
          - Solid: span(배지)이 슬롯 크기를 차지하고, 그 안의 아이콘은 여백을 두고 작게(size-icon-md)
            넣는다 — 배지 총 크기 = Outline 아이콘 크기라, 둘의 겉넓이가 같아 보인다. */}
                <div className="flex flex-col gap-3">
                    <h3 className="typo-body-l-medium text-foreground">Outline</h3>
                    <ul className="grid grid-cols-3 gap-3 md:grid-cols-4 xl:grid-cols-6">
                        {CURATED_ICONS.map(({name, Icon: Glyph}) => (
                            <li
                                key={name}
                                className="border-border flex flex-col items-center gap-3 rounded-md border p-4"
                            >
                                <Icon icon={Glyph} className="size-icon-xl text-foreground" />
                                <code className="text-foreground font-mono text-sm">{name}</code>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <h3 className="typo-body-l-medium text-foreground">Solid</h3>
                    <ul className="grid grid-cols-3 gap-3 md:grid-cols-4 xl:grid-cols-6">
                        {SOLID_ICONS.map((item) => (
                            <li
                                key={item.name}
                                className="border-border flex flex-col items-center gap-3 rounded-md border p-4"
                            >
                                {item.icon ? (
                                    <Icon icon={item.icon} variant="solid" className="size-icon-xl" />
                                ) : (
                                    <Icon symbol={item.symbol} variant="solid" className="size-icon-xl" />
                                )}
                                <code className="text-foreground font-mono text-sm">{item.name}</code>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <h3 className="typo-body-l-medium text-foreground">Figma 이름 매핑</h3>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Figma 세트 이름 <code className="font-mono">icon/line-&lt;kebab-case&gt;</code>는 lucide의 같은
                        이름(PascalCase)에 대응합니다 — 예:{' '}
                        <code className="font-mono">icon/line-file-pen-line → FilePenLine</code>. 규칙에서 벗어나는
                        예외만 아래 표에 정리했습니다.
                    </p>
                    <Table
                        caption="규칙에서 벗어나는 Figma 이름과 lucide 이름 매핑"
                        columns={FIGMA_MAP_COLUMNS}
                        rows={FIGMA_NAME_EXCEPTIONS.map(({figma, lucide}) => ({
                            key: figma,
                            cells: [
                                <code key="figma" className="text-foreground font-mono text-sm">
                                    {figma}
                                </code>,
                                <code key="lucide" className="font-mono text-sm">
                                    {lucide}
                                </code>,
                            ],
                        }))}
                    />
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-accessibility" className="flex flex-col gap-4">
                <div>
                    <h2 id="icon-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        아이콘은 순수 장식이고, 의미 전달은 텍스트와 감싸는 요소가 담당합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-1 pl-5">
                    <li>
                        <code>Icon</code> 래퍼는 항상 <code className="font-mono">aria-hidden</code>을 처리합니다.
                        lucide 글리프를 직접 쓸 때는 <code className="font-mono">aria-hidden=&quot;true&quot;</code>를
                        직접 지정합니다.
                    </li>
                    <li>
                        아이콘 단독 버튼·링크는 감싸는 상호작용 요소에 <code className="font-mono">aria-label</code>을
                        붙입니다([5.1.1]).
                    </li>
                    <li>
                        클릭·터치 대상은 44×44px 이상(<code className="font-mono">min-h-11 min-w-11</code>)을
                        확보합니다([6.1.3]).
                    </li>
                    <li>상태·정보를 색만으로 구분하지 않고 텍스트를 병행합니다([5.3.1]).</li>
                </ul>
                <CodeBlock code={ICON_BUTTON_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="icon-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        Icon wrapper가 받는 프로젝트 속성입니다. 아이콘은 항상 장식 요소로 렌더링됩니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Icon Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default IconGuidePage
