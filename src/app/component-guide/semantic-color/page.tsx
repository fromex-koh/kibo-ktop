import type { Metadata } from 'next';
import CopyChip from '@/components/guide/copy-chip';
import GuidePage from '@/components/guide/guide-page';
import tokens from '@tokens';

export const metadata: Metadata = { title: 'Semantic' };

// 각 토큰의 대표 유틸리티 클래스명 — 접두사(bg/text/border)는 역할로 결정한다.
// border·text 그룹은 접두사 중복을 피해 토큰명이 무접두사(default·bolder…)라 집합으로 판별한다.
const BORDER_TOKENS = new Set([
  'default',
  'gray-subtle-1',
  'gray-subtle-2',
  'gray-subtle-3',
  'white',
  'strong',
  'focus',
  'error',
]);
const TEXT_TOKENS = new Set([
  'bolder',
  'basic',
  'subtle',
  'inverse',
  'subtle-inverse',
  'disabled',
  'disabled-on',
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'warning',
  'success',
  'info',
]);
// 스크롤바 토큰은 ::-webkit-scrollbar 전용이라 Tailwind 유틸이 없다(null → 클래스 대신 토큰명 표기).
const utilClass = (name: string): string | null => {
  if (name.startsWith('scroll-')) return null;
  if (BORDER_TOKENS.has(name)) return `border-${name}`;
  if (TEXT_TOKENS.has(name)) return `text-${name}`;
  if (name.startsWith('icon-')) return `text-${name}`; // 아이콘은 currentColor(text-)로 색을 준다
  if (name.includes('border')) return `border-${name}`;
  return `bg-${name}`;
};

// 앱이 실제로 쓰는 시맨틱 토큰(--ds → bg-*/text-* 유틸)을 tokens.json 에서 그대로 문서화한다.
// 인덱싱 타입 오류를 피하려고 Record 로 받는다(값 형태는 build-tokens 검증이 보장).
const scale: number[] = tokens.scale;
const primitive: Record<string, Record<string, string>> = tokens.primitive;
const common: Record<string, string> = tokens.common;
const semantic: Record<string, string | { light: string; dark: string }> = tokens.semantic;

// 다크 위치반사(생성기와 동일 규칙): 스케일 배열에서 대칭 위치.
const mirror = (step: number): number => scale[scale.length - 1 - scale.indexOf(step)];

// 투명 값(alpha) 뒤에 깔 체커보드 (토큰 뷰어 인라인 var 은 PB-12 허용).
// --raw-* 는 모드에 안 뒤집히는 고정 프리미티브라 라이트/다크 어디서든 동일한 '투명 표시' 체커가 된다.
const CHECKERBOARD =
  'repeating-conic-gradient(var(--raw-gray-300) 0% 25%, var(--raw-common-white) 0% 50%) 0 0 / 8px 8px';

// 참조("gray.900"·"common.white"·"black.75") → CSS 색. alpha(black/white)는 rgba, 그 외는 hex.
const rawColor = (ref: string): string => {
  if (ref === 'transparent' || ref === 'currentColor') return ref;
  const [hue, step] = ref.split('.');
  if (hue === 'black' || hue === 'white') {
    return `rgba(${hue === 'black' ? '0, 0, 0' : '255, 255, 255'}, ${Number(step) / 100})`;
  }
  return hue === 'common' ? common[step] : primitive[hue][step];
};

// 문자열 ref = 다크 자동 반사, {light,dark} = 명시값 → 모드별 색으로 해석
const resolveModes = (
  val: string | { light: string; dark: string },
): { light: string; dark: string } => {
  if (typeof val !== 'string') {
    return { light: rawColor(val.light), dark: rawColor(val.dark) };
  }
  const [hue, step] = val.split('.');
  return { light: rawColor(val), dark: rawColor(`${hue}.${mirror(Number(step))}`) };
};

// 참조 primitive 표기 — 문자열은 "라이트 → 다크(반사)", 객체는 "light / dark".
const refLabel = (val: string | { light: string; dark: string }): string => {
  if (typeof val !== 'string') {
    return `${val.light} / ${val.dark}`;
  }
  const [hue, step] = val.split('.');
  return `${val} → ${hue}.${mirror(Number(step))} (반사)`;
};

// 표기용 rgba 문자열 — hex 는 변환, 이미 rgba(alpha)면 그대로.
const toRgbaText = (color: string): string => {
  if (!color.startsWith('#')) return color;
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 1)`;
};

// 맨 앞 '현재' 칸 — 실제 토큰을 현재 테마로 렌더. 다크 토글 시 실제로 바뀐다(파이프라인 검증).
// :root/.dark 에 출력되는 --ds-* 를 참조한다(--color-* 는 @theme inline 이라 런타임 변수로 안 나옴).
const LiveSwatch = ({ name }: { name: string }) => (
  <span
    aria-hidden="true"
    className="border-gray-subtle-2 size-icon-lg relative block shrink-0 overflow-hidden rounded border"
    style={{ background: CHECKERBOARD }}
  >
    <span className="absolute inset-0" style={{ background: `var(--ds-${name})` }} />
  </span>
);

// 정적 모드값 칸 — 해석된 색 스와치 + rgba 표기(모드 무관 고정 표시).
const ModeSwatch = ({ color }: { color: string }) => (
  <span className="flex items-center gap-3">
    <span
      aria-hidden="true"
      className="border-gray-subtle-2 size-icon-md relative shrink-0 overflow-hidden rounded border"
      style={{ background: CHECKERBOARD }}
    >
      <span className="absolute inset-0" style={{ background: color }} />
    </span>
    <span className="typo-caption text-subtle font-mono whitespace-nowrap">
      {toRgbaText(color)}
    </span>
  </span>
);

// 색상(Semantic) — 앱이 실제로 쓰는 시맨틱 토큰(--ds). primitive 를 용도별로 매핑한 층.
const SemanticColorGuidePage = () => (
  <GuidePage
    title="02 Semantic Color"
    description="앱이 실제로 쓰는 시맨틱 색상 토큰입니다. '클래스' 칸은 실제 사용하는 유틸리티 클래스(bg-brand·text-bolder 등)이며 클릭하면 복사돼 바로 붙여넣을 수 있습니다. 라이트 값은 Figma 02 Semantic Color 정의에 맞췄고, 다크는 primitive 위치반사/명시로 도출합니다(Figma Dark 미완성이라 이 방식). 맨 앞 '현재' 칸은 실제 토큰을 현재 테마로 렌더한 것이라, 헤더의 다크모드 토글을 누르면 이 칸이 실제로 바뀝니다(토큰 파이프라인 작동 검증)."
  >
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          시맨틱 토큰 — 현재 테마 적용값(라이브), 유틸리티 클래스(클릭 복사), 라이트/다크 해석값,
          참조 primitive
        </caption>
        <thead>
          <tr className="border-gray-subtle-2 border-b">
            <th scope="col" className="typo-label text-subtle px-3 py-3 whitespace-nowrap">
              현재
            </th>
            <th scope="col" className="typo-label text-subtle px-3 py-3 whitespace-nowrap">
              클래스 (클릭 복사)
            </th>
            <th scope="col" className="typo-label text-subtle px-3 py-3 whitespace-nowrap">
              라이트
            </th>
            <th scope="col" className="typo-label text-subtle px-3 py-3 whitespace-nowrap">
              다크
            </th>
            <th scope="col" className="typo-label text-subtle px-3 py-3 whitespace-nowrap">
              참조 primitive
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(semantic).map(([name, val]) => {
            const modes = resolveModes(val);
            const util = utilClass(name);
            return (
              <tr
                key={name}
                className="border-gray-subtle-2 hover:bg-surface border-b transition-colors"
              >
                <td className="px-3 py-3">
                  <LiveSwatch name={name} />
                </td>
                <th scope="row" className="px-3 py-3 text-left">
                  {util ? (
                    <CopyChip value={util} />
                  ) : (
                    <span className="typo-caption text-bolder font-mono whitespace-nowrap">
                      {name}
                    </span>
                  )}
                </th>
                <td className="px-3 py-3">
                  <ModeSwatch color={modes.light} />
                </td>
                <td className="px-3 py-3">
                  <ModeSwatch color={modes.dark} />
                </td>
                <td className="typo-caption text-subtle px-3 py-3 font-mono whitespace-nowrap">
                  {refLabel(val)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </GuidePage>
);

export default SemanticColorGuidePage;
