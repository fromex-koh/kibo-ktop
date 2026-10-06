// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import type {LucideIcon} from 'lucide-react'
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
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
import packageJson from '@package'
import tokens from '@tokens'

export const metadata: Metadata = {title: '아이콘 (Icon)'}

const ICON_SIZE_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'class', header: '클래스 (클릭 복사)', align: 'start', rowHeader: true},
    {key: 'value', header: '값', align: 'start'},
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
const ICON_BUTTON_CODE = `{/* Icon 래퍼: 항상 aria-hidden */}
<Button size="icon" aria-label="검색">
    <Icon icon={Search} />
</Button>

{/* lucide 글리프를 직접 쓸 때: aria-hidden 을 직접 지정 */}
<Button size="icon" aria-label="검색">
    <Search aria-hidden="true" />
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

// 아이콘 목록 — 프로젝트에서 실제 쓰는 lucide-react 아이콘([NA-008]). 새 아이콘을 쓰면 함께 추가한다.
const CURATED_ICONS = [
    {name: 'ArrowDown', Icon: ArrowDown},
    {name: 'ArrowLeft', Icon: ArrowLeft},
    {name: 'ArrowRight', Icon: ArrowRight},
    {name: 'ArrowUp', Icon: ArrowUp},
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

// Solid(원형 배지) 스타일은 강조·알림 배지 용도라 실제로 몇 개만 큐레이션한다. lucide에 채운 글리프가
// 없는 Info·CircleAlert는 기존 디자인대로 원형 배지 안에 문자 i·!를 사용한다.
type SolidIconItem = {name: string; icon: LucideIcon; symbol?: never} | {name: string; icon?: never; symbol: IconSymbol}

const SOLID_ICONS: readonly SolidIconItem[] = [
    {name: 'X', icon: X},
    {name: 'Info', symbol: 'info'},
    {name: 'CircleAlert', symbol: 'alert'},
]

const PROPS_ITEMS = [
    ['Icon', 'icon', 'lucide 아이콘 컴포넌트입니다. symbol 과 함께 쓸 수 없습니다.', '조건부 필수', 'LucideIcon'],
    [
        'Icon',
        'symbol',
        '문자형 아이콘입니다. icon 과 함께 쓸 수 없고 variant="solid" 가 필요합니다.',
        '조건부 필수',
        "'info' | 'alert'",
    ],
    [
        'Icon',
        'variant',
        '글리프만 그리는 outline 과 원형 배지 안에 담는 solid 중 고릅니다. symbol 은 solid 만 지원합니다.',
        "'outline'",
        "'outline' | 'solid'",
    ],
    [
        'Icon',
        'symbolClassName',
        'symbol 글자 크기(typo-*)입니다. 배지를 키우면 함께 키웁니다.',
        "'typo-title-l-bold'",
        'string',
    ],
    ['Icon', 'className', '크기(size-icon-*)와 색(text-*) 유틸리티를 추가합니다.', "''", 'string'],
] as const

const SOURCE_COLUMNS = [
    {key: 'source', header: '출처', align: 'start', rowHeader: true},
    {key: 'use', header: '쓰는 곳', align: 'start', wrap: true},
] as const

const SOURCE_ROWS = [
    {
        key: 'lucide',
        cells: [
            <code key="source">lucide-react</code>,
            '모든 아이콘의 표준 라이브러리입니다([NA-008]). SVG 를 직접 그리거나 다른 아이콘 폰트를 섞지 않습니다.',
        ],
    },
    {
        key: 'icon',
        cells: [
            <code key="source">components/custom/icon.tsx</code>,
            'lucide 글리프를 원형 배지(solid)나 문자형(symbol)으로 쓸 때의 래퍼입니다. 글리프만 필요하면 lucide 를 그대로 씁니다.',
        ],
    },
] as const

const IconGuidePage = () => (
    <GuidePageShell
        title="아이콘 (Icon)"
        description="lucide-react 아이콘과 solid 배지·문자형 아이콘을 쓰는 방법입니다."
    >
        <BaseCard>
            <section aria-labelledby="icon-source" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="icon-source" className="typo-h4-bold">
                        아이콘 출처
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        표준 단일 라이브러리 lucide-react v{LUCIDE_VERSION}(ISC 라이선스)를 사용합니다.
                    </p>
                </div>
                <Table caption="아이콘 출처" columns={SOURCE_COLUMNS} rows={SOURCE_ROWS} size="md" />
                <div className="flex flex-wrap items-center gap-2">
                    <code className="border-border bg-muted text-foreground rounded-sm border px-2 py-1 font-mono text-sm">
                        yarn add lucide-react
                    </code>
                    <a
                        href={LUCIDE_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-strong focus-visible:ring-ring inline-flex items-center gap-1.5 rounded underline underline-offset-4 focus:outline-none focus-visible:ring-2"
                    >
                        <GitBranch aria-hidden="true" className="size-icon-sm shrink-0" />
                        lucide-icons/lucide
                        <span className="sr-only"> (새 창에서 열림)</span>
                    </a>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="icon-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        형태는 outline(기본) · solid · symbol 세 가지입니다. 크기는 <code>size-icon-*</code>, 색은{' '}
                        <code>text-*</code> 시맨틱 유틸로 지정하고 solid 배지 색은 variant 가 정합니다.
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

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">크기</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>size-icon-*</code> 유틸은 <code>tokens.json</code> 의 <code>size.icon-*</code>{' '}
                            토큰입니다.
                        </p>
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
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-list" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="icon-list" className="typo-h4-bold">
                        아이콘 목록
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        프로젝트에서 쓰는 lucide 아이콘 {CURATED_ICONS.length}개입니다. 목록에 없는 아이콘은 lucide 에서
                        골라 쓰고 이 목록에도 추가합니다. 한 컴포넌트에서만 쓰는 장식 SVG 는 포함하지 않습니다.
                    </p>
                </div>

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">Outline</h3>
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

                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">Solid</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            배지가 어울리는 X(닫기) · info(안내) · alert(경고)만 씁니다. info 와 alert 는 문자 i · !
                            입니다.
                        </p>
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
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="icon-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아이콘은 장식이고 의미는 텍스트와 감싸는 요소가 전달합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>Icon</code> 은 항상 <code>aria-hidden=&quot;true&quot;</code> 로 렌더됩니다. lucide
                        글리프를 직접 쓸 때는 <code>aria-hidden=&quot;true&quot;</code> 를 직접 지정합니다.
                    </li>
                    <li>
                        아이콘만 있는 버튼 · 링크는 감싸는 요소에 <code>aria-label</code> 또는 <code>sr-only</code>{' '}
                        텍스트를 줍니다[5.1.1].
                    </li>
                    <li>상태 · 정보는 색만으로 구분하지 않고 텍스트를 함께 둡니다[5.3.1].</li>
                </ul>
                <CodeBlock code={ICON_BUTTON_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="icon-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="icon-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Icon Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default IconGuidePage
