import type {Metadata} from 'next'
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
    Download,
    ExternalLink,
    Eye,
    EyeOff,
    File,
    FileCheckCorner,
    FilePenLine,
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
    Moon,
    MoreHorizontal,
    Mouse,
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
    X,
} from 'lucide-react'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Icon} from '@/components/custom/icon'
import tokens from '@tokens'

export const metadata: Metadata = {title: '아이콘 (Icon)'}

// Icon 컴포넌트 사용법 스니펫 — variant 별로 코드블럭을 나눠 보여준다. 미리보기와 같은 아이콘·
// 크기(size-icon-2xl)로 맞춰 마크업과 미리보기가 일치한다.
const USAGE_OUTLINE = `import { X } from 'lucide-react';
import { Icon } from '@/components/custom/icon';

<Icon icon={X} className="size-icon-2xl" />`

const USAGE_SOLID = `import { X } from 'lucide-react';
import { Icon } from '@/components/custom/icon';

<Icon icon={X} variant="solid" className="size-icon-2xl" />`

// package.json 의 lucide-react 버전과 라이선스. 패키지를 올리면 함께 갱신한다.
const LUCIDE_VERSION = '1.23.0'
const LUCIDE_REPO_URL = 'https://github.com/lucide-icons/lucide'
// 정확한 아이콘 총 개수는 릴리스마다 계속 늘어나(deprecated 별칭 포함 약 2,000개), 대략치로 안내.
const LUCIDE_ICON_COUNT_LABEL = '2,000개 이상'

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
// Figma 이름 ↔ lucide 매핑이 자명하지 않은 것: line-reset→RotateCcw · line-alert→CircleAlert ·
// line-left/right/up/down→Chevron* · line-close→X.
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
    {name: 'Download', Icon: Download},
    {name: 'ExternalLink', Icon: ExternalLink},
    {name: 'Eye', Icon: Eye},
    {name: 'EyeOff', Icon: EyeOff},
    {name: 'File', Icon: File},
    {name: 'FileCheckCorner', Icon: FileCheckCorner},
    {name: 'FilePenLine', Icon: FilePenLine},
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
    {name: 'Moon', Icon: Moon},
    {name: 'MoreHorizontal', Icon: MoreHorizontal},
    {name: 'Mouse', Icon: Mouse},
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
    {name: 'X', Icon: X},
] as const

// Solid(원형 배지) 스타일은 강조·알림 배지 용도라 실제로 몇 개만 큐레이션한다. 별도 마크업으로
// 모양을 흉내 내지 않고 실제 Icon wrapper를 렌더해 구현과 가이드가 항상 같게 유지되도록 한다.
const SOLID_ICONS = [
    {name: 'X', Glyph: X},
    {name: 'Info', Glyph: Info},
    {name: 'CircleAlert', Glyph: CircleAlert},
] as const

const IconGuidePage = () => (
    <GuidePageShell
        title="아이콘 (Icon)"
        description="lucide-react 아이콘 중 실제 화면에서 쓰는 것들을 큐레이션했습니다."
    >
        <section aria-labelledby="icon-library" className="flex flex-col gap-4">
            <div>
                <h2 id="icon-library" className="typo-h4-bold">
                    라이브러리
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    재사용 아이콘은 이 프로젝트의 표준 라이브러리인 lucide-react 하나만 사용합니다([NA-008]). shadcn{' '}
                    <code>radix-nova</code> registry에는 별도 Icon primitive가 없으므로,{' '}
                    <code>components/custom/icon.tsx</code>가 Lucide 글리프를 받아 프로젝트의 outline·solid 표현만
                    부여합니다. 프로젝트 variant 스타일은 <code>components/theme/icon.variants.ts</code>에 분리되어
                    wrapper와 연결되며, shadcn 원본을 복사하거나 수정한 컴포넌트가 아닙니다.
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
                        <dt className="text-muted-foreground w-20 shrink-0">아이콘 수</dt>
                        <dd>{LUCIDE_ICON_COUNT_LABEL}</dd>
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
                        import {'{ Home }'} from &apos;lucide-react&apos;;
                    </code>
                </div>
            </div>
        </section>

        <section aria-labelledby="icon-size" className="flex flex-col gap-4">
            <div>
                <h2 id="icon-size" className="typo-h4-bold">
                    크기
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    size-icon-* 유틸로 쓰는 아이콘 크기 토큰입니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">아이콘 크기 토큰과 클래스</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                미리보기
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                클래스 (클릭 복사)
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                값
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {ICON_SIZES.map(({key, class: sizeClass}) => (
                            <tr key={key} className="border-border bg-background border-b last:border-b-0">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Icon icon={X} variant="solid" className={`${sizeClass} shrink-0`} />
                                        <Icon icon={Info} className={`${sizeClass} text-foreground shrink-0`} />
                                    </div>
                                </td>
                                <th scope="row" className="px-4 py-3 text-left font-normal">
                                    <code className="text-foreground font-mono">{sizeClass}</code>
                                </th>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    {tokens.size[key]}px
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="icon-list" className="flex flex-col gap-6">
            <div>
                <h2 id="icon-list" className="typo-h4-bold">
                    아이콘 목록
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Outline은 프로젝트에서 사용하는 아이콘과 Figma 아이콘 세트(icon/line-*)의 lucide 대응 아이콘을 합친{' '}
                    {CURATED_ICONS.length}개 전체입니다. lucide-react의 <code>*Icon</code> 별칭은 같은 글리프의 정식
                    이름으로 합쳐 중복을 제거했습니다. lucide-react는 획(Outline) 스타일 단일 세트라, 배지·알림처럼
                    강조가 필요한 곳엔 아이콘을 원형 배경에 채운 Solid 스타일을 조합해 씁니다. Solid는 실제로 배지가
                    어울리는 X(닫기)·info(안내)·alert(경고) 세 가지만 큐레이션했습니다. Stepper의 삼각형은 재사용
                    아이콘이 아니라 해당 컴포넌트에만 쓰는 장식 SVG이므로 목록에서 제외합니다.
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
                        <li key={name} className="border-border flex flex-col items-center gap-3 rounded-md border p-4">
                            <Icon icon={Glyph} className="size-icon-xl text-foreground" />
                            <code className="text-foreground font-mono text-sm">{name}</code>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="typo-body-l-medium text-foreground">Solid</h3>
                <ul className="grid grid-cols-3 gap-3 md:grid-cols-4 xl:grid-cols-6">
                    {SOLID_ICONS.map(({name, Glyph}) => (
                        <li key={name} className="border-border flex flex-col items-center gap-3 rounded-md border p-4">
                            <Icon icon={Glyph} variant="solid" className="size-icon-xl" />
                            <code className="text-foreground font-mono text-sm">{name}</code>
                        </li>
                    ))}
                </ul>
            </div>
        </section>

        <section aria-labelledby="icon-variant" className="flex flex-col gap-6">
            <div>
                <h2 id="icon-variant" className="typo-h4-bold">
                    Variant
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    용도에 맞춰 선택하는 아이콘 스타일 2가지입니다.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                        variant
                    </span>
                    <h3 className="typo-body-l-medium text-foreground">outline — 아이콘만 (기본)</h3>
                </div>
                <div className="border-border flex items-center gap-4 rounded-md border p-6">
                    <Icon icon={X} className="size-icon-2xl" />
                </div>
                <CodeBlock code={USAGE_OUTLINE} language="tsx" copyLabel="복사" />
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                        variant
                    </span>
                    <h3 className="typo-body-l-medium text-foreground">solid — 원형 안에 아이콘</h3>
                </div>
                <div className="border-border flex items-center gap-4 rounded-md border p-6">
                    <Icon icon={X} variant="solid" className="size-icon-2xl" />
                </div>
                <CodeBlock code={USAGE_SOLID} language="tsx" copyLabel="복사" />
            </div>
        </section>

        <section aria-labelledby="icon-props" className="flex flex-col gap-4">
            <div>
                <h2 id="icon-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    커스터마이징 가능한 속성들입니다. 필수 값은 이름 옆에 <span className="text-destructive">*</span> 로
                    표시했습니다.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">BASIC</h3>
                <div className="bg-background border-border overflow-x-auto rounded-md border">
                    <table className="w-full text-left">
                        <caption className="sr-only">Icon Props 목록</caption>
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
                                    icon
                                    <span aria-hidden="true" className="text-destructive">
                                        *
                                    </span>
                                    <span className="sr-only"> (필수)</span>
                                </th>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col gap-2">
                                        <p className="typo-body-l-regular text-muted-foreground">
                                            표시할 lucide 아이콘 컴포넌트.
                                        </p>
                                        <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                            LucideIcon
                                        </span>
                                    </div>
                                </td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">-</td>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">-</td>
                            </tr>
                            <tr className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                                >
                                    variant
                                </th>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col gap-2">
                                        <p className="typo-body-l-regular text-muted-foreground">
                                            아이콘 스타일. outline 은 글리프만, solid 는 원형 배지 안에 담아 강조한다.
                                        </p>
                                        <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                            &apos;outline&apos; | &apos;solid&apos;
                                        </span>
                                    </div>
                                </td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    &apos;outline&apos;
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                            outline
                                        </span>
                                        <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                            solid
                                        </span>
                                    </div>
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
                                    <div className="flex flex-col gap-2">
                                        <p className="typo-body-l-regular text-muted-foreground">
                                            크기·색 확장. outline 은 아이콘에, solid 는 배지에 적용된다(예:
                                            size-icon-*).
                                        </p>
                                        <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                            string
                                        </span>
                                    </div>
                                </td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    &quot;&quot;
                                </td>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </GuidePageShell>
)

export default IconGuidePage
