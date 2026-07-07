import type { Metadata } from 'next';
import CopyChip from '@/components/guide/copy-chip';
import GuidePage from '@/components/guide/guide-page';
import tokens from '@tokens';

export const metadata: Metadata = { title: '타이포그래피' };

// 한글·영문(대소문자)·숫자가 섞인 짧은 미리보기 표본 — 표 한 행 안에서 바로 렌더를 확인하는 용도라
// 자간·행간 확인 위주의 긴 문장 대신 컴팩트하게 둔다(전체 문장 표본은 필요하면 별도 페이지에서).
const PREVIEW_SAMPLE = '가나다 Ag 12';

type TypographyToken = {
  size: { mobile: number; pc: number };
  weight: number;
  lineHeight: number;
  letterSpacing: string;
};
type TypographyEntry = [string, TypographyToken];

// 타이포그래피 스케일 그룹 — Figma '크기(font-size)' 프레임의 분류(Display·Heading·Title·Body·
// Caption·Micro) 순서 그대로 표를 나눈다. tokens.json 순서를 유지한 채 첫 매칭 그룹에 담는다.
const TYPOGRAPHY_GROUPS: { name: string; match: (n: string) => boolean }[] = [
  { name: 'Display', match: (n) => n.startsWith('display-') },
  { name: 'Heading', match: (n) => n.startsWith('heading-') },
  { name: 'Title', match: (n) => n.startsWith('title-') },
  { name: 'Body', match: (n) => n.startsWith('body-') },
  { name: 'Caption', match: (n) => n.startsWith('caption-') },
  { name: 'Micro', match: (n) => n.startsWith('micro-') },
];
const groupNameOfTypo = (name: string): string =>
  TYPOGRAPHY_GROUPS.find((group) => group.match(name))?.name ?? '기타';
const TYPOGRAPHY_ENTRIES: TypographyEntry[] = Object.entries(tokens.typography);
const TYPOGRAPHY_GROUPED = TYPOGRAPHY_GROUPS.map((group) => ({
  name: group.name,
  tokens: TYPOGRAPHY_ENTRIES.filter(([name]) => groupNameOfTypo(name) === group.name),
})).filter((group) => group.tokens.length > 0);

// 그룹 하나 = 독립 테이블(미리보기·클래스·크기·굵기·행간·자간). '미리보기' 칸이 실제 typo-* 클래스를
// 바로 적용해 렌더하므로, 클래스를 쓰면 어떻게 나오는지 값 옆에서 바로 확인할 수 있다.
// 클래스 칩을 클릭하면 이름이 복사된다.
const TypographyScaleTable = ({
  title,
  entries,
}: {
  title: string;
  entries: TypographyEntry[];
}) => (
  <div className="flex flex-col gap-2">
    <h3 className="typo-body-l-medium text-bolder font-semibold">{title}</h3>
    <div className="border-gray-subtle-2 overflow-x-auto rounded-xl border">
      <table className="w-full text-left">
        <caption className="sr-only">{title} typo-* 클래스별 미리보기·크기·굵기·행간·자간</caption>
        <thead>
          <tr className="border-gray-subtle-2 bg-surface border-b">
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
            <tr key={name} className="border-gray-subtle-2 border-b last:border-b-0">
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`typo-${name}`}>{PREVIEW_SAMPLE}</span>
              </td>
              <th scope="row" className="px-4 py-3 text-left font-normal">
                <CopyChip value={`typo-${name}`} />
              </th>
              <td className="typo-caption-regular text-subtle px-4 py-3 font-mono">
                {t.size.mobile}px
              </td>
              <td className="typo-caption-regular text-subtle px-4 py-3 font-mono">
                {t.size.pc}px
              </td>
              <td className="typo-caption-regular text-subtle px-4 py-3 font-mono">{t.weight}</td>
              <td className="typo-caption-regular text-subtle px-4 py-3 font-mono">
                {t.lineHeight}
              </td>
              <td className="typo-caption-regular text-subtle px-4 py-3 font-mono">
                {t.letterSpacing}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

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
];

// 타이포그래피 — typo-* 복합 유틸리티. 스케일 표 각 행에 실제 렌더 미리보기를 함께 담는다.
const TypographyGuidePage = () => (
  <GuidePage
    title="타이포그래피 (Typography)"
    description="제목·본문·라벨·캡션용 복합 클래스(typo-*)입니다. 크기·굵기·행간·자간과 모바일→PC 반응형이 한 묶음으로 적용되므로, 한 요소엔 typo-* 하나만 쓰고 text-*·font-* 와 섞지 않습니다."
  >
    {/* 글꼴 체계 (Font Family) */}
    <section aria-labelledby="typo-font" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="typo-font" className="typo-heading-h4-bold">
          글꼴 (Font Family)
        </h2>
        <p className="typo-body-l-regular text-subtle">
          본문·제목은 <code>font-sans</code>(<code>--font-sans</code>) 하나로 통일합니다. Pretendard
          를 1순위로 쓰고, 로드 실패·미지원 글리프는 아래 순서로 폴백합니다. 코드·수치 등 고정폭이
          필요한 곳은 <code>font-mono</code> 를 씁니다.
        </p>
      </div>
      <ol className="border-gray-subtle-2 divide-gray-subtle-2 divide-y rounded-xl border">
        {SANS_STACK.map((font, i) => (
          <li key={font.name} className="flex items-start gap-3 px-4 py-3">
            <span
              aria-hidden="true"
              className={`typo-caption-regular flex size-6 shrink-0 items-center justify-center rounded-full font-mono font-bold ${
                font.isPrimary ? 'bg-element-primary/80 text-background' : 'text-subtle bg-gray-100'
              }`}
            >
              {i + 1}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="inline-flex flex-wrap items-center gap-2">
                <span className="typo-body-l-regular text-bolder font-semibold">{font.name}</span>
                <span
                  className={`typo-caption-regular rounded-full px-2 py-0.5 font-semibold ${
                    font.isPrimary
                      ? 'bg-element-primary/10 text-primary'
                      : 'text-subtle bg-gray-100'
                  }`}
                >
                  {font.role}
                </span>
              </span>
              <span className="typo-caption-regular text-subtle">{font.desc}</span>
              {font.version && (
                <span className="typo-caption-regular text-subtle">
                  v{font.version} · {font.license}
                  {font.repoUrl && (
                    <>
                      {' · '}
                      <a
                        href={font.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary focus-visible:ring-focus focus-visible:ring-offset-background rounded-sm underline decoration-1 underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
      <p className="typo-caption-regular text-subtle">
        고정폭(<code>font-mono</code>): <code>ui-monospace</code> · <code>SFMono-Regular</code> ·{' '}
        <code>Menlo</code> · <code>Consolas</code> · <code>monospace</code> 순으로 폴백합니다.
      </p>
    </section>

    {/* 크기 단위 안내 — px 입력, rem 출력(접근성) */}
    <section
      aria-labelledby="typo-rem"
      className="border-gray-subtle-2 bg-surface flex flex-col gap-1 rounded-xl border p-4"
    >
      <h2 id="typo-rem" className="typo-body-l-medium">
        크기 단위 — px 입력, rem 출력
      </h2>
      <p className="typo-body-l-regular text-subtle">
        토큰 크기는 인지 기준인 <strong>px</strong> 로 <code>tokens.json</code> 에 쓰고, 생성기가{' '}
        <strong>rem</strong>(÷ remBase {tokens.remBase})으로 변환해 내보냅니다. 아래 표는 이해를
        돕기 위해 px 로 표기하지만, 실제 출력은 rem 입니다(예: PC{' '}
        {tokens.typography['display-m-bold'].size.pc}
        px → {tokens.typography['display-m-bold'].size.pc / tokens.remBase}rem). 글자 크기를 rem
        으로 두면 사용자가 브라우저 기본 글꼴 크기를 키웠을 때 본문도 비례해 커져{' '}
        <strong>접근성</strong>에 유리합니다. (px→rem 변환은 간격·크기 등 전 토큰 공통 원칙입니다.)
      </p>
    </section>

    {/* 타이포그래피 스케일 — typo-* 유틸리티가 묶어 적용하는 값(토큰)을 Figma 분류별 표로 나눈다 */}
    <section aria-labelledby="typo-tokens" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="typo-tokens" className="typo-heading-h4-bold">
          타이포그래피 스케일
        </h2>
        <p className="typo-body-l-regular text-subtle">
          용도별 <code>typo-*</code> <strong>유틸리티 클래스</strong> 목록을 Figma 분류(Display·
          Heading·Title·Body·Caption·Micro)별 표로 나눴습니다. &apos;미리보기&apos; 칸이 그 행의
          클래스를 바로 적용해 렌더하므로, 클래스를 쓰면 어떻게 나오는지 크기·굵기·행간·자간{' '}
          <strong>토큰</strong> 값 옆에서 바로 확인할 수 있습니다. 클래스 칩을 클릭하면 이름이
          복사됩니다.
        </p>
        <p className="typo-body-l-regular text-subtle">
          현재는 <strong>크기 (모바일)</strong>과 <strong>크기 (PC)</strong> 값이 모든 토큰에서
          동일합니다. Figma 디자인이 해상도별 폰트 크기 변화를 두지 않았기 때문이며, 모바일/PC 분기
          구조 자체는 나중에 반응형 크기가 필요해질 경우를 대비해 그대로 남겨뒀습니다(값만 다르게
          채우면 바로 반응형으로 전환됩니다).
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {TYPOGRAPHY_GROUPED.map((group) => (
          <TypographyScaleTable key={group.name} title={group.name} entries={group.tokens} />
        ))}
      </div>
    </section>
  </GuidePage>
);

export default TypographyGuidePage;
