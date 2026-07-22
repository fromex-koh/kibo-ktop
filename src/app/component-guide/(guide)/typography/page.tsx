import type {ComponentPropsWithoutRef} from 'react'
import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CopyChip from '@/components/custom/copy-chip'
import GuidePageShell from '@/components/custom/guide-page-shell'
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
    size: {mobile: number; pc: number}
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
const TYPOGRAPHY_GROUPS: {name: string; match: (n: string) => boolean}[] = [
    {name: 'Display', match: (n) => n.startsWith('display-')},
    {name: 'Heading', match: (n) => /^h[1-4]-/.test(n)},
    {name: 'Title', match: (n) => n.startsWith('title-')},
    {name: 'Body', match: (n) => n.startsWith('body-')},
    {name: 'Caption', match: (n) => n.startsWith('caption-')},
    {name: 'Micro', match: (n) => n.startsWith('micro-')},
]
const groupNameOfTypo = (name: string): string => TYPOGRAPHY_GROUPS.find((group) => group.match(name))?.name ?? '기타'
const TYPOGRAPHY_ENTRIES: TypographyEntry[] = Object.entries(tokens.typography)
const TYPOGRAPHY_GROUPED = TYPOGRAPHY_GROUPS.map((group) => ({
    name: group.name,
    tokens: TYPOGRAPHY_ENTRIES.filter(([name]) => groupNameOfTypo(name) === group.name),
})).filter((group) => group.tokens.length > 0)
const TYPOGRAPHY_COUNT = TYPOGRAPHY_ENTRIES.length
const TYPOGRAPHY_TIER_COUNT = new Set(
    TYPOGRAPHY_ENTRIES.map(([name]) => name.replace(/-(regular|medium|semibold|bold)$/, '')),
).size

// 그룹 하나 = 독립 테이블(미리보기·클래스·크기·굵기·행간·자간). '미리보기' 칸이 실제 typo-* 클래스를
// 바로 적용해 렌더하므로, 클래스를 쓰면 어떻게 나오는지 값 옆에서 바로 확인할 수 있다.
// 클래스 칩을 클릭하면 이름이 복사된다.
const TypographyScaleTable = ({title, entries}: {title: string; entries: TypographyEntry[]}) => (
    <div className="flex flex-col gap-3">
        <h3 className="typo-title-m-semibold text-foreground">{title}</h3>
        <div className="border-border overflow-x-auto rounded-xl border">
            <table className="w-full text-left">
                <caption className="sr-only">{title} typo-* 클래스별 미리보기·크기·굵기·행간·자간</caption>
                <thead>
                    <tr className="border-border bg-card border-b">
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            미리보기
                        </th>
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            클래스
                        </th>
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            크기 (모바일)
                        </th>
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            크기 (PC)
                        </th>
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            굵기
                        </th>
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            행간
                        </th>
                        <th scope="col" className="typo-body-l-medium px-4 py-3">
                            자간
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map(([name, t]) => (
                        <tr key={name} className="border-border border-b last:border-b-0">
                            <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`typo-${name}`}>{PREVIEW_SAMPLE}</span>
                            </td>
                            <th scope="row" className="px-4 py-3 text-left font-normal">
                                <CopyChip value={`typo-${name}`} />
                            </th>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                {t.size.mobile}px
                            </td>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                {t.size.pc}px
                            </td>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                {FONT_WEIGHT[t.weight]}
                            </td>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                {LINE_HEIGHT[t.lineHeight]}
                            </td>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono">
                                {LETTER_SPACING[t.letterSpacing]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)

// 실제 글꼴 체계는 src/app/globals.css 의 @theme(--font-sans / --font-mono) + layout.tsx 의
// Pretendard 로컬 폰트(next/font/local)에서 온다. 아래는 그 값을 그대로 문서화한 것.
// Pretendard 의 version 은 현재 번들된 src/app/fonts/PretendardVariable.woff2 의 name 테이블에서
// 직접 추출한 값(fonttools 로 확인: nameID 5 "Version 1.309;..."). 폰트 파일을 교체하면 함께 갱신한다.
const SANS_STACK = [
    {
        name: 'Pretendard',
        role: '기본',
        desc: '가변 폰트(weight 100–900). 자체 호스팅 — next/font/local · 변수 --font-pretendard.',
        isPrimary: true,
        version: '1.309',
        repoUrl: 'https://github.com/orioncactus/pretendard',
        license: 'SIL Open Font License 1.1 — 상업적 사용 가능(무료)',
    },
    {
        name: 'Apple SD Gothic Neo',
        role: '한글 폴백',
        desc: 'macOS·iOS 시스템 한글 글꼴.',
        isPrimary: false,
    },
    {
        name: 'Malgun Gothic',
        role: '한글 폴백',
        desc: 'Windows 시스템 한글 글꼴.',
        isPrimary: false,
    },
    {
        name: '-apple-system · BlinkMacSystemFont · system-ui',
        role: '시스템',
        desc: 'OS UI 기본 글꼴로 대체.',
        isPrimary: false,
    },
    {
        name: 'sans-serif',
        role: '최종',
        desc: '위가 모두 불가할 때 OS 기본 산세리프.',
        isPrimary: false,
    },
]

// 페이지의 최상위 문서 그룹을 실제 프로젝트 Card로 구분한다.
const TypographySectionCard = ({children, ...props}: ComponentPropsWithoutRef<'section'>) => (
    <BaseCard>
        <section {...props}>{children}</section>
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
                    구조와 사용 원칙
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    개별 text·font·leading·tracking 유틸리티를 조합하지 않고, 역할에 맞는 typo-* 클래스 하나를
                    우선합니다.
                </p>
            </div>
            <div className="border-border bg-card grid gap-4 rounded-xl border p-5 md:grid-cols-3">
                <div className="flex flex-col gap-1">
                    <strong className="text-foreground">복합 속성</strong>
                    <p className="text-foreground-subtle">크기·굵기·행간·자간을 한 클래스에서 함께 적용합니다.</p>
                </div>
                <div className="flex flex-col gap-1">
                    <strong className="text-foreground">반응형 구조</strong>
                    <p className="text-foreground-subtle">
                        모바일을 기본으로 하고 <code className="font-mono">{tokens.typographyBreakpoint}:</code>부터 PC
                        크기를 적용합니다.
                    </p>
                </div>
                <div className="flex flex-col gap-1">
                    <strong className="text-foreground">현재 구성</strong>
                    <p className="text-foreground-subtle">
                        크기 tier {TYPOGRAPHY_TIER_COUNT}개와 typo-* 조합 {TYPOGRAPHY_COUNT}개를 제공합니다.
                    </p>
                </div>
            </div>
        </TypographySectionCard>

        {/* 글꼴 체계 (Font Family) */}
        <TypographySectionCard aria-labelledby="typo-font" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h2 id="typo-font" className="typo-h4-bold">
                    글꼴 (Font Family)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    본문·제목은 <code>font-sans</code>(<code>--font-sans</code>) 하나로 통일합니다. Pretendard 를
                    1순위로 쓰고, 로드 실패·미지원 글리프는 아래 순서로 폴백합니다. 코드·수치 등 고정폭이 필요한 곳은{' '}
                    <code>font-mono</code> 를 씁니다.
                </p>
            </div>

            {/* font-sans(가변폭) vs font-mono(고정폭) 미리보기 — 같은 5글자 두 줄의 렌더 너비를 나란히 비교 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border-border flex flex-col gap-3 rounded-xl border p-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <CopyChip value="font-sans" />
                        <span className="typo-body-l-regular text-muted-foreground">
                            가변폭 — 글자마다 렌더 너비가 다릅니다
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
                            고정폭 — 글자마다 렌더 너비가 같습니다
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
                고정폭(<code>font-mono</code>): <code>ui-monospace</code> · <code>SFMono-Regular</code> ·{' '}
                <code>Menlo</code> · <code>Consolas</code> · <code>monospace</code> 순으로 폴백합니다.
            </p>
        </TypographySectionCard>

        {/* 크기 단위 안내 — px 입력, rem 출력(접근성) */}
        <TypographySectionCard aria-labelledby="typo-rem" className="flex flex-col gap-2">
            <h2 id="typo-rem" className="typo-h4-bold">
                크기 단위 — px 입력, rem 출력
            </h2>
            <p className="typo-body-l-regular text-muted-foreground">
                <code>tokens.json</code>에는 px 숫자로 입력하고 생성기는 remBase {tokens.remBase}을 기준으로 rem으로
                변환합니다. 표는 디자인 확인을 위해 px로 표시하지만 실제 CSS는 rem을 사용합니다.
            </p>
        </TypographySectionCard>

        <TypographySectionCard aria-labelledby="typo-project-utilities" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h2 id="typo-project-utilities" className="typo-h4-bold">
                    프로젝트 특수 타이포 유틸리티
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    대부분의 텍스트는 <code>typo-*</code> 조합을 우선 사용합니다. 다만 Header 유틸 링크처럼 기존
                    컴포넌트 variant 위에 특정 자간만 덧씌워야 하는 경우, 목적이 드러나는 작은 유틸리티로 분리합니다.
                </p>
            </div>
            <div className="border-border overflow-x-auto rounded-xl border">
                <table className="w-full text-left">
                    <caption className="sr-only">프로젝트 특수 타이포 유틸리티 목록</caption>
                    <thead>
                        <tr className="border-border bg-card border-b">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                미리보기
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                클래스
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                값
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                사용처
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-border border-b last:border-b-0">
                            <td className="px-4 py-3 whitespace-nowrap">
                                <span className="typo-body-l-medium tracking-control-label">{PREVIEW_SAMPLE}</span>
                            </td>
                            <th scope="row" className="px-4 py-3 text-left font-normal">
                                <CopyChip value="tracking-control-label" />
                            </th>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3 font-mono whitespace-nowrap">
                                letter-spacing: -0.035rem (-0.56px)
                            </td>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                Header 상단 유틸 링크와 Segmented Control 항목 등 컨트롤 라벨의 프로젝트 전용 자간.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </TypographySectionCard>

        {/* 타이포그래피 스케일 — typo-* 유틸리티가 묶어 적용하는 값(토큰)을 Figma 분류별 표로 나눈다 */}
        <TypographySectionCard aria-labelledby="typo-tokens" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h2 id="typo-tokens" className="typo-h4-bold">
                    타이포그래피 스케일
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    {TYPOGRAPHY_COUNT}개 클래스를 Display·Heading·Title·Body·Caption·Micro로 구분합니다. 미리보기에는
                    해당 클래스가 실제 적용되며 클래스 칩을 선택하면 이름이 복사됩니다.
                </p>
                <p className="typo-body-l-regular text-muted-foreground">
                    현재 모바일과 PC 크기는 동일하지만 반응형 구조는 유지합니다. 향후 <code>tokens.json</code>의 PC 값만
                    변경하면 {tokens.typographyBreakpoint} breakpoint부터 자동으로 적용됩니다.
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
