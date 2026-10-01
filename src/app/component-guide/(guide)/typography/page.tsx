import type {ComponentPropsWithoutRef} from 'react'
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Table} from '@/components/custom/table'
import {cn} from '@/lib/utils'
import tokens from '@tokens'

export const metadata: Metadata = {title: '타이포그래피 (Typography)'}

// 한글·영문(대소문자)·숫자가 섞인 짧은 미리보기 표본 — 표 한 행 안에서 바로 렌더를 확인하는 용도라
// 자간·행간 확인 위주의 긴 문장 대신 컴팩트하게 둔다(전체 문장 표본은 필요하면 별도 페이지에서).
const PREVIEW_SAMPLE = '가나다 Ag 12'

// font-sans(가변폭) vs font-mono(고정폭) 비교 표본 — 같은 5글자를 두 줄(좁은 i·넓은 W)로 두면
// 가변폭은 두 줄의 렌더 너비가 크게 달라지고, 고정폭은 글자마다 폭이 같아 두 줄 너비가 같아진다.
// 배경 박스(inline-block)로 감싸 그 실제 렌더 너비 차이가 눈에 보이게 한다.
const WIDTH_DEMO_LINES = ['iiiii', 'WWWWW']

// weight/lineHeight/letterSpacing 는 primitive 맵(tokens.fontWeight 등)의 키를 이름으로 참조한다.
// 표에는 이름이 아니라 실제 값(700·1.5·0)을 그 맵에서 되찾아 보여준다.
type TypographyToken = {
    size: {mobile: number; tablet: number; pc: number}
    weight: string
    lineHeight: string
    letterSpacing: string
}

// primitive 맵을 이름→값 조회용 Record 로 받는다(tokens.fontWeight 등이 그대로 대입 가능).
const FONT_WEIGHT: Record<string, number> = tokens.fontWeight
const LINE_HEIGHT: Record<string, number> = tokens.lineHeight
const LETTER_SPACING: Record<string, string> = tokens.letterSpacing
type TypographyEntry = [string, TypographyToken]

// 타이포그래피 스케일 그룹 — Figma '크기(font-size)' 프레임의 분류(Display·Heading·Title·Body·
// Caption·Micro) 순서 그대로 표를 나눈다. tokens.json 순서를 유지한 채 첫 매칭 그룹에 담는다.
// 마지막 '화면 전용'은 어디에도 안 걸리는 토큰을 받는 자리다 — 없으면 새 토큰이 표에서 조용히 빠진다.
const TYPOGRAPHY_GROUPS: {name: string; match: (n: string) => boolean}[] = [
    {name: 'Display', match: (n) => n.startsWith('display-')},
    {name: 'Heading', match: (n) => /^h[1-4]-/.test(n)},
    {name: 'Title', match: (n) => n.startsWith('title-')},
    {name: 'Body', match: (n) => n.startsWith('body-')},
    {name: 'Caption', match: (n) => n.startsWith('caption-')},
    {name: 'Micro', match: (n) => n.startsWith('micro-')},
    {name: '화면 전용', match: () => true},
]
const formatFontSize = (value: number): string => `${value}px`
const groupNameOfTypo = (name: string): string =>
    TYPOGRAPHY_GROUPS.find((group) => group.match(name))?.name ?? '화면 전용'
const TYPOGRAPHY_ENTRIES: TypographyEntry[] = Object.entries(tokens.typography)
const TYPOGRAPHY_GROUPED = TYPOGRAPHY_GROUPS.map((group) => ({
    name: group.name,
    tokens: TYPOGRAPHY_ENTRIES.filter(([name]) => groupNameOfTypo(name) === group.name),
})).filter((group) => group.tokens.length > 0)
const TYPOGRAPHY_COUNT = TYPOGRAPHY_ENTRIES.length
const WEIGHT_KEYS = Object.keys(FONT_WEIGHT)
const tierOfTypo = (name: string): string => {
    const weight = WEIGHT_KEYS.find((key) => name.endsWith(`-${key}`))
    return weight ? name.slice(0, -(weight.length + 1)) : name
}
// 화면 폭에 따라 크기가 달라지는 티어(예: display-l 38 → 48). 문장에 직접 적지 않고 토큰에서 뽑는다 —
// 값이 바뀌어도 문서가 어긋나지 않는다.
const RESPONSIVE_TIERS = [
    ...new Map(
        TYPOGRAPHY_ENTRIES.filter(([, token]) => new Set(Object.values(token.size)).size > 1).map(([name, token]) => [
            tierOfTypo(name),
            `typo-${tierOfTypo(name)}-* (${token.size.mobile} → ${token.size.tablet} → ${token.size.pc})`,
        ]),
    ).values(),
]

const TYPOGRAPHY_SCALE_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'class', header: '클래스', align: 'start', rowHeader: true},
    {key: 'mobile', header: '크기 (모바일)', align: 'start'},
    {key: 'tablet', header: '크기 (태블릿)', align: 'start'},
    {key: 'pc', header: '크기 (PC)', align: 'start'},
    {key: 'weight', header: '굵기', align: 'start'},
    {key: 'lineHeight', header: '행간', align: 'start'},
    {key: 'letterSpacing', header: '자간', align: 'start'},
] as const

// 그룹 하나 = 독립 테이블(미리보기·클래스·크기·굵기·행간·자간). '미리보기' 칸이 실제 typo-* 클래스를
// 바로 적용해 렌더하므로, 클래스를 쓰면 어떻게 나오는지 값 옆에서 바로 확인할 수 있다.
// 클래스 칩을 클릭하면 이름이 복사된다.
const TypographyScaleTable = ({title, entries}: {title: string; entries: TypographyEntry[]}) => (
    <div className="flex flex-col gap-3">
        <h3 className="typo-title-m-bold text-foreground">{title}</h3>
        <Table
            size="sm"
            caption={`${title} typo-* 클래스별 미리보기·크기·굵기·행간·자간`}
            columns={TYPOGRAPHY_SCALE_COLUMNS}
            rows={entries.map(([name, t]) => ({
                key: name,
                cells: [
                    <span key="preview" className={`typo-${name} text-foreground whitespace-nowrap`}>
                        {PREVIEW_SAMPLE}
                    </span>,
                    <CopyChip key="class" value={`typo-${name}`} />,
                    <span key="mobile" className="text-muted-foreground font-mono">
                        {formatFontSize(t.size.mobile)}
                    </span>,
                    <span key="tablet" className="text-muted-foreground font-mono">
                        {formatFontSize(t.size.tablet)}
                    </span>,
                    <span key="pc" className="text-muted-foreground font-mono">
                        {formatFontSize(t.size.pc)}
                    </span>,
                    <span key="weight" className="text-muted-foreground font-mono">
                        {FONT_WEIGHT[t.weight]}
                    </span>,
                    <span key="lineHeight" className="text-muted-foreground font-mono">
                        {LINE_HEIGHT[t.lineHeight]}
                    </span>,
                    <span key="letterSpacing" className="text-muted-foreground font-mono">
                        {LETTER_SPACING[t.letterSpacing]}
                    </span>,
                ],
            }))}
        />
    </div>
)

const PROJECT_UTILITY_COLUMNS = [
    {key: 'preview', header: '미리보기', align: 'start'},
    {key: 'class', header: '클래스', align: 'start', rowHeader: true},
    {key: 'value', header: '값', align: 'start'},
    {key: 'usage', header: '사용처', align: 'start', wrap: true},
] as const

// 실제 글꼴 체계는 src/app/globals.css 의 @theme(--font-sans / --font-mono) + layout.tsx 의
// Pretendard 로컬 폰트(next/font/local)에서 온다. 아래는 그 값을 그대로 문서화한 것.
// Pretendard 의 version 은 현재 번들된 src/app/fonts/PretendardVariable.woff2 의 name 테이블에서
// 직접 추출한 값(fonttools 로 확인: nameID 5 "Version 1.309;..."). 폰트 파일을 교체하면 함께 갱신한다.
const SANS_STACK = [
    {
        name: 'Pretendard',
        role: '기본',
        desc: '가변 폰트(굵기 100–900). src/app/fonts 의 파일을 직접 제공합니다.',
        isPrimary: true,
        version: '1.309',
        repoUrl: 'https://github.com/orioncactus/pretendard',
        license: 'SIL Open Font License 1.1 — 상업적 사용 가능(무료)',
    },
    {
        name: 'Apple SD Gothic Neo',
        role: '한글 폴백',
        desc: 'macOS·iOS',
        isPrimary: false,
    },
    {
        name: 'Malgun Gothic',
        role: '한글 폴백',
        desc: 'Windows',
        isPrimary: false,
    },
    {
        name: '-apple-system · BlinkMacSystemFont · system-ui',
        role: '시스템',
        desc: 'OS 기본 UI 글꼴',
        isPrimary: false,
    },
    {
        name: 'sans-serif',
        role: '최종',
        desc: '위 글꼴이 모두 없을 때',
        isPrimary: false,
    },
]

// 페이지의 최상위 문서 그룹을 실제 프로젝트 Card로 구분한다.
const TypographySectionCard = ({children, className, ...props}: ComponentPropsWithoutRef<'section'>) => (
    <BaseCard>
        <section className={cn('min-w-0', className)} {...props}>
            {children}
        </section>
    </BaseCard>
)

// 타이포그래피 — typo-* 복합 유틸리티. 스케일 표 각 행에 실제 렌더 미리보기를 함께 담는다.
const TypographyGuidePage = () => (
    <GuidePageShell
        title="타이포그래피 (Typography)"
        description="프로젝트의 제목·본문·라벨·캡션에 사용하는 typo-* 복합 유틸리티와 글꼴 체계입니다."
    >
        <TypographySectionCard aria-labelledby="typo-overview" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h2 id="typo-overview" className="typo-h4-bold">
                    typo-* 적용 방식
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    글자 크기·굵기·행간·자간은 <code>typo-*</code> 클래스 하나로 지정합니다.
                </p>
            </div>
            <ul className="text-foreground-subtle flex list-disc flex-col gap-2 pl-5">
                <li>
                    같은 요소에 <code className="font-mono">text-*</code>(크기) ·{' '}
                    <code className="font-mono">font-*</code> · <code className="font-mono">leading-*</code> ·{' '}
                    <code className="font-mono">tracking-*</code>를 겹쳐 쓰지 않습니다. 색상용{' '}
                    <code className="font-mono">text-foreground</code> 등은 함께 씁니다.
                </li>
                <li>
                    크기는 클래스 안에서 화면 폭에 따라 바뀝니다(모바일 → <code className="font-mono">md</code> →{' '}
                    <code className="font-mono">xl</code>). <code className="font-mono">md:typo-*</code>처럼 접두사를
                    붙여 쓰는 방식은 동작하지 않습니다.
                </li>
                <li>
                    값은 <code className="font-mono">tokens.json</code>의 <code className="font-mono">typography</code>
                    에서 px 로 관리하고, 생성된 CSS 는 rem 을 씁니다.
                </li>
            </ul>
        </TypographySectionCard>

        {/* 글꼴 체계 (Font Family) */}
        <TypographySectionCard aria-labelledby="typo-font" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h2 id="typo-font" className="typo-h4-bold">
                    글꼴 (Font Family)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    기본 글꼴은 <code>font-sans</code>(Pretendard)이고 따로 지정하지 않아도 적용됩니다. 코드·수치처럼
                    고정폭이 필요한 곳에만 <code>font-mono</code>를 씁니다.
                </p>
            </div>

            {/* font-sans(가변폭) vs font-mono(고정폭) 미리보기 — 같은 5글자 두 줄의 렌더 너비를 나란히 비교 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border-border flex flex-col gap-3 rounded-xl border p-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <CopyChip value="font-sans" />
                        <span className="typo-body-l-regular text-muted-foreground">
                            가변폭 — 글자마다 폭이 다릅니다
                        </span>
                    </div>
                    <div className="flex flex-col items-start gap-1.5">
                        {WIDTH_DEMO_LINES.map((line) => (
                            <span
                                key={line}
                                className="bg-primary-subtle text-foreground typo-body-l-regular inline-block w-fit rounded px-1.5 py-0.5 font-sans"
                            >
                                {line}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="border-border flex flex-col gap-3 rounded-xl border p-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <CopyChip value="font-mono" />
                        <span className="typo-body-l-regular text-muted-foreground">
                            고정폭 — 글자 폭이 모두 같습니다
                        </span>
                    </div>
                    <div className="flex flex-col items-start gap-1.5">
                        {WIDTH_DEMO_LINES.map((line) => (
                            <span
                                key={line}
                                className="bg-primary-subtle text-foreground typo-body-l-regular inline-block w-fit rounded px-1.5 py-0.5 font-mono"
                            >
                                {line}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <p className="typo-body-l-regular text-muted-foreground">
                <code>font-sans</code>는 아래 순서로 대체됩니다.
            </p>
            <ol className="border-border divide-border divide-y rounded-xl border">
                {SANS_STACK.map((font, i) => (
                    <li key={font.name} className="flex items-start gap-3 px-4 py-3">
                        <span
                            aria-hidden="true"
                            className={`typo-body-l-bold flex size-6 shrink-0 items-center justify-center rounded-full font-mono ${
                                font.isPrimary ? 'bg-primary text-primary-foreground' : 'text-muted-foreground bg-muted'
                            }`}
                        >
                            {i + 1}
                        </span>
                        <div className="flex flex-col gap-0.5">
                            <span className="inline-flex flex-wrap items-center gap-2">
                                <span className="typo-body-l-medium text-foreground">{font.name}</span>
                                <span
                                    className={`typo-body-l-medium rounded-full px-2 py-0.5 ${
                                        font.isPrimary
                                            ? 'bg-primary-subtle text-primary-strong'
                                            : 'text-muted-foreground bg-muted'
                                    }`}
                                >
                                    {font.role}
                                </span>
                            </span>
                            <span className="typo-body-l-regular text-muted-foreground">{font.desc}</span>
                            {font.version && (
                                <span className="typo-body-l-regular text-muted-foreground">
                                    v{font.version} · {font.license}
                                    {font.repoUrl && (
                                        <>
                                            {' · '}
                                            <a
                                                href={font.repoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary-strong focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm underline decoration-1 underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                            >
                                                저장소
                                                <span className="sr-only"> (새 창에서 열림)</span>
                                            </a>
                                        </>
                                    )}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
            <p className="typo-body-l-regular text-muted-foreground">
                <code>font-mono</code>는 <code>ui-monospace</code> · <code>SFMono-Regular</code> · <code>Menlo</code> ·{' '}
                <code>Consolas</code> · <code>monospace</code> 순입니다.
            </p>
        </TypographySectionCard>

        <TypographySectionCard aria-labelledby="typo-project-utilities" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h2 id="typo-project-utilities" className="typo-h4-bold">
                    프로젝트 특수 타이포 유틸리티
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code>typo-*</code>로 표현할 수 없는 값만 따로 둔 유틸리티입니다. 컴포넌트 안에서 쓰고, 화면에서는
                    직접 조합하지 않습니다.
                </p>
            </div>
            <Table
                size="sm"
                caption="프로젝트 특수 타이포 유틸리티 목록"
                columns={PROJECT_UTILITY_COLUMNS}
                rows={[
                    {
                        key: 'tracking-control-label',
                        cells: [
                            <span
                                key="preview"
                                className="typo-body-l-medium tracking-control-label text-foreground whitespace-nowrap"
                            >
                                {PREVIEW_SAMPLE}
                            </span>,
                            <CopyChip key="class" value="tracking-control-label" />,
                            <span key="value" className="text-muted-foreground font-mono whitespace-nowrap">
                                letter-spacing: -0.035rem (-0.56px)
                            </span>,
                            <span key="usage" className="text-muted-foreground">
                                Header 상단 유틸 링크 · SegmentedControl 항목의 자간
                            </span>,
                        ],
                    },
                ]}
            />
        </TypographySectionCard>

        {/* 타이포그래피 스케일 — typo-* 유틸리티가 묶어 적용하는 값(토큰)을 Figma 분류별 표로 나눈다 */}
        <TypographySectionCard aria-labelledby="typo-tokens" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h2 id="typo-tokens" className="typo-h4-bold">
                    타이포그래피 스케일
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    클래스는 모두 {TYPOGRAPHY_COUNT}개입니다. 미리보기에는 그 클래스가 실제로 적용되어 있고, 클래스 칩을
                    누르면 이름이 복사됩니다. 크기는 px 로 표시합니다.
                </p>
                <p className="typo-body-l-regular text-muted-foreground">
                    {RESPONSIVE_TIERS.length > 0 ? (
                        <>
                            화면 폭에 따라 크기가 달라지는 클래스 — {RESPONSIVE_TIERS.join(' · ')}. 나머지는 세 구간
                            값이 같습니다.
                        </>
                    ) : (
                        <>지금은 모든 클래스의 세 구간 값이 같습니다.</>
                    )}
                </p>
            </div>
            <div className="flex flex-col gap-8">
                {TYPOGRAPHY_GROUPED.map((group) => (
                    <TypographyScaleTable key={group.name} title={group.name} entries={group.tokens} />
                ))}
            </div>
        </TypographySectionCard>
    </GuidePageShell>
)

export default TypographyGuidePage
