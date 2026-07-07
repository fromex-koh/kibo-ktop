import type { Metadata } from 'next';
import CopyChip from '@/components/guide/copy-chip';
import GuidePage from '@/components/guide/guide-page';
import tokens from '@tokens';

export const metadata: Metadata = { title: '타이포그래피' };

// 한글·영문·숫자·기호가 모두 섞인 미리보기 문장(글꼴 렌더링 확인용).
const SAMPLE_TEXT = '다람쥐 헌 쳇바퀴에 타고파 ABC xyz 123 !?@#';

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

// 그룹 하나 = 독립 테이블(클래스·크기·굵기·행간·자간). 클래스 칩을 클릭하면 이름이 복사된다.
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
        <caption className="sr-only">{title} typo-* 클래스별 크기·굵기·행간·자간</caption>
        <thead>
          <tr className="border-gray-subtle-2 bg-surface border-b">
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
const SANS_STACK = [
  {
    name: 'Pretendard',
    role: '기본',
    desc: '가변 폰트(weight 100–900). 자체 호스팅 — next/font/local · 변수 --font-pretendard.',
    isPrimary: true,
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

// 타이포그래피 — typo-* 복합 유틸리티. 위엔 유틸리티가 묶어 적용하는 값(토큰) 테이블, 아래엔 실제 렌더 미리보기.
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
          Heading·Title·Body·Caption·Micro)별 표로 나눴습니다. 각 클래스가 한 번에 묶어 적용하는
          값(크기·굵기·행간·자간 <strong>토큰</strong>)은 아래와 같습니다. 클래스 칩을 클릭하면
          이름이 복사됩니다.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {TYPOGRAPHY_GROUPED.map((group) => (
          <TypographyScaleTable key={group.name} title={group.name} entries={group.tokens} />
        ))}
      </div>
    </section>

    {/* 미리보기 — 실제 렌더(아래) */}
    <section aria-labelledby="typo-preview" className="flex flex-col gap-4">
      <h2 id="typo-preview" className="typo-heading-h4-bold">
        미리보기 (Preview)
      </h2>
      <ul className="border-gray-subtle-2 divide-gray-subtle-2 divide-y rounded-xl border">
        {Object.entries(tokens.typography).map(([name, t]) => (
          <li key={name} className="flex flex-col gap-2 px-4 py-5">
            <span className="typo-caption-regular text-subtle font-mono">
              typo-{name} · {t.size.mobile}→{t.size.pc}px · w{t.weight}
            </span>
            <p className={`typo-${name}`}>{SAMPLE_TEXT}</p>
          </li>
        ))}
      </ul>
    </section>
  </GuidePage>
);

export default TypographyGuidePage;
