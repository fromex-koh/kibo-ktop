import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ActiveBreakpointTag from '@/components/active-breakpoint-tag';
import tokens from '../../../tokens.json';
import sampleCatImg from '../../../public/sample-cat.jpg';

export const metadata: Metadata = {
  title: '컴포넌트 가이드',
};

// 그리드 데모: 현재 브레이크포인트에서 실제 노출되는 컬럼 수만큼만 보이도록 매핑한다.
// 프리픽스는 Tailwind 정적 분석을 위해 리터럴로 고정 — 새 브레이크포인트 추가 시 함께 갱신.
const GRID_MAX_COLUMNS = Math.max(
  tokens.grid.mobile.columns,
  tokens.grid.wide.columns,
  tokens.grid.pc.columns,
);
const getGridRevealClass = (index: number) => {
  if (index < tokens.grid.mobile.columns) return 'flex';
  if (index < tokens.grid.wide.columns) return 'hidden wide:flex';
  return 'hidden pc:flex';
};

const ComponentGuidePage = () => {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="max-w-content mx-auto flex w-full flex-col gap-14 px-6 py-16">
        <header className="flex flex-col gap-2">
          <h1 className="typo-heading-xl">컴포넌트 가이드</h1>
          <p className="typo-body-sm text-foreground-muted">
            디자인 토큰(색상·타이포그래피·간격·라운드·그림자·흐림·오버레이). 오른쪽 하단 토글로
            라이트/다크를 확인하세요.
          </p>
        </header>

        {/* 색상 — Tier 1 */}
        <section aria-labelledby="s-color" className="flex flex-col gap-6">
          <h2 id="s-color" className="typo-heading-md">
            색상 — Tier 1 (Primitive)
          </h2>
          {Object.entries(tokens.primitive).map(([hue, steps]) => (
            <div key={hue} className="flex flex-col gap-2">
              <span className="typo-label">{hue}</span>
              <ul className="wide:grid-cols-4 pc:grid-cols-7 grid grid-cols-2 gap-3">
                {Object.entries(steps).map(([step, hex]) => (
                  <li key={step} className="border-border overflow-hidden rounded-lg border">
                    <span
                      className="block aspect-[16/9] w-full"
                      style={{ background: `var(--raw-${hue}-${step})` }}
                    />
                    <div className="typo-caption border-border border-t px-3 py-2 font-mono">
                      <span className="block">{step}</span>
                      <span className="text-foreground-muted block">{hex}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* 타이포그래피 */}
        <section aria-labelledby="s-typo" className="flex flex-col gap-4">
          <h2 id="s-typo" className="typo-heading-md">
            타이포그래피
          </h2>
          <ul className="flex flex-col gap-5">
            {Object.entries(tokens.typography).map(([name, t]) => (
              <li key={name} className="border-border flex flex-col gap-1 border-b pb-5">
                <p className={`typo-${name}`}>다람쥐 헌 쳇바퀴 Ag 123</p>
                <p className="typo-caption text-foreground-muted font-mono">
                  typo-{name} · {t.size.mobile}→{t.size.pc}px · w{t.weight} · lh{t.lineHeight}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* 브레이크포인트 — 모바일 퍼스트 3단계 (기본 → wide: → pc:) */}
        <section aria-labelledby="s-breakpoint" className="flex flex-col gap-4">
          <h2 id="s-breakpoint" className="typo-heading-md">
            브레이크포인트 (Breakpoint)
          </h2>
          <p className="typo-caption text-foreground-muted">
            모바일 퍼스트 — 프리픽스 없는 유틸이 기본(모바일), 정의된 프리픽스만 사용합니다. 기본
            sm:/md:/lg: 는 비활성화. 콘텐츠 영역은 <code>max-w-content</code>(
            {tokens.container.content}px) 로 제한합니다.
          </p>
          <p className="typo-caption text-foreground-muted">
            구간명은 특정 기기 하나를 뜻하지 않는다. <code>wide</code> 는 태블릿(세로·가로)과
            노트북이 함께 걸치는 폭 구간이라 기기 중립적으로 이름 붙였다(단, 12.9형급 대형 태블릿을
            가로로 눕히면 <code>pc</code> 구간으로 넘어갈 수 있다).
          </p>
          <div className="border-border overflow-x-auto rounded-xl border">
            <table className="w-full text-left">
              <caption className="sr-only">브레이크포인트 구간과 프리픽스, 포함 기기</caption>
              <thead>
                <tr className="border-border bg-surface border-b">
                  <th scope="col" className="typo-label px-4 py-3">
                    구간
                  </th>
                  <th scope="col" className="typo-label px-4 py-3">
                    범위
                  </th>
                  <th scope="col" className="typo-label px-4 py-3">
                    프리픽스
                  </th>
                  <th scope="col" className="typo-label px-4 py-3">
                    포함 기기
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // 구간명은 기기 하나를 가리키지 않으므로(예: wide = 태블릿·노트북 공유 폭),
                  // 실제 포함 기기는 여기서 별도 안내한다. 새 브레이크포인트 키 추가 시 함께 갱신.
                  const DEVICE_HINT: Record<string, string> = {
                    모바일: '폰',
                    wide: '태블릿·노트북',
                    pc: '데스크톱',
                  };
                  const entries = Object.entries(tokens.breakpoint).sort((a, b) => a[1] - b[1]);
                  const rows = [
                    {
                      key: 'mobile',
                      name: '모바일 (기본)',
                      range: `0 ~ ${entries[0][1] - 1}px`,
                      prefix: '없음',
                      device: DEVICE_HINT['모바일'],
                    },
                    ...entries.map(([k, v], i) => ({
                      key: k,
                      name: k,
                      range:
                        i + 1 < entries.length ? `${v} ~ ${entries[i + 1][1] - 1}px` : `${v}px ~`,
                      prefix: `${k}:`,
                      device: DEVICE_HINT[k] ?? '—',
                    })),
                  ];
                  return rows.map((r) => (
                    <tr key={r.name} className="border-border border-b last:border-b-0">
                      <td className="typo-body-sm px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          {r.name}
                          <ActiveBreakpointTag targetKey={r.key} />
                        </span>
                      </td>
                      <td className="typo-caption text-foreground-muted px-4 py-3 font-mono">
                        {r.range}
                      </td>
                      <td className="typo-caption text-foreground-muted px-4 py-3 font-mono">
                        {r.prefix}
                      </td>
                      <td className="typo-body-sm text-foreground-muted px-4 py-3">{r.device}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </section>

        {/* 레이아웃 그리드 — 브레이크포인트별 columns/gutter/margin, .grid-layout 하나로 캡슐화 */}
        <section aria-labelledby="s-grid" className="flex flex-col gap-4">
          <h2 id="s-grid" className="typo-heading-md">
            레이아웃 그리드 (Grid)
          </h2>
          <p className="typo-caption text-foreground-muted">
            브레이크포인트별 컬럼 수·거터(칸 간격)·마진(가장자리 여백)을 정의합니다. 전체 폭 상한은
            위 브레이크포인트 섹션의 <code>max-w-content</code>({tokens.container.content}px)를
            그대로 공유합니다. <code>.grid-layout</code> 클래스 하나로 컬럼 그리드·거터·마진·폭
            상한을 함께 적용합니다.
          </p>
          <p className="typo-caption text-foreground-muted">
            브라우저 폭을 조절하면(또는 기기 회전) 실제로 보이는 칸 수가 4 → 8 → 12 로 바뀝니다 — 각
            브레이크포인트에서 실제 사용하는 컬럼 수만 표시합니다.
          </p>
          <div className="grid-layout">
            {Array.from({ length: GRID_MAX_COLUMNS }).map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`${getGridRevealClass(i)} bg-danger/15 border-danger/40 h-20 items-center justify-center rounded-md border`}
              >
                <span className="bg-surface border-danger text-danger typo-caption flex size-7 items-center justify-center rounded-full border-2">
                  {i + 1}
                </span>
              </span>
            ))}
          </div>
          <div className="border-border overflow-x-auto rounded-xl border">
            <table className="w-full text-left">
              <caption className="sr-only">브레이크포인트별 그리드 columns·gutter·margin</caption>
              <thead>
                <tr className="border-border bg-surface border-b">
                  <th scope="col" className="typo-label px-4 py-3">
                    구간
                  </th>
                  <th scope="col" className="typo-label px-4 py-3">
                    columns
                  </th>
                  <th scope="col" className="typo-label px-4 py-3">
                    gutter
                  </th>
                  <th scope="col" className="typo-label px-4 py-3">
                    margin
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const order = ['mobile', ...Object.keys(tokens.breakpoint)];
                  const rows = Object.entries(tokens.grid).sort(
                    ([a], [b]) => order.indexOf(a) - order.indexOf(b),
                  );
                  return rows.map(([key, g]) => (
                    <tr key={key} className="border-border border-b last:border-b-0">
                      <td className="typo-body-sm px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          {key === 'mobile' ? '모바일 (기본)' : key}
                          <ActiveBreakpointTag targetKey={key} />
                        </span>
                      </td>
                      <td className="typo-caption text-foreground-muted px-4 py-3 font-mono">
                        {g.columns}
                      </td>
                      <td className="typo-caption text-foreground-muted px-4 py-3 font-mono">
                        {g.gutter}px
                      </td>
                      <td className="typo-caption text-foreground-muted px-4 py-3 font-mono">
                        {g.margin}px
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </section>

        {/* 사이드 메뉴 레이아웃 — works/system-guide 벤치마킹, 실제 큰 레이아웃은 별도 페이지(새 창)에서 확인 */}
        <section aria-labelledby="s-sidebar-layout" className="flex flex-col gap-4">
          <h2 id="s-sidebar-layout" className="typo-heading-md">
            사이드 메뉴 레이아웃 (Side Navigation Layout)
          </h2>
          <p className="typo-caption text-foreground-muted">
            works/system-guide 프로젝트의 사이드 내비게이션 큰 레이아웃(헤더·사이드바)을 이
            프로젝트의 브레이크포인트(<code>wide</code>/<code>pc</code>)·색상·
            <code>.grid-layout</code> 토큰으로 재구성한 벤치마킹입니다. <code>pc</code> 이상은 상시
            고정 레일, 그 미만은 본문을 밀지 않는 오버레이 드로어로 전환됩니다. 위 미니 데모들과
            달리 실제 페이지 크기로 봐야 하는 큰 레이아웃이라 별도 페이지로 분리했습니다.
          </p>
          <Link
            href="/publishing/sidebar-layout"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-surface hover:bg-gray-10 focus-visible:ring-brand focus-visible:ring-offset-background inline-flex w-fit items-center gap-1.5 rounded-lg border px-4 py-2.5 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            새 창에서 레이아웃 확인
            <ArrowUpRight aria-hidden="true" className="size-4" />
            <span className="sr-only">(새 창에서 열림)</span>
          </Link>
        </section>

        {/* 간격 */}
        <section aria-labelledby="s-space" className="flex flex-col gap-4">
          <h2 id="s-space" className="typo-heading-md">
            간격 (Spacing)
          </h2>
          <p className="typo-caption text-foreground-muted">
            base {tokens.spacingBase}px × N (무한). 예: <code>p-4</code> = {tokens.spacingBase * 4}
            px. base 값만 바꾸면 전체가 비율대로 조정됩니다.
          </p>
          <ul className="flex flex-col gap-2">
            {[1, 2, 3, 4, 6, 8, 12, 16, 24, 32].map((n) => (
              <li key={n} className="flex items-center gap-3">
                <span
                  className="bg-brand h-3 shrink-0 rounded-sm"
                  style={{ width: `calc(var(--spacing) * ${n})` }}
                />
                <span className="typo-caption text-foreground-muted font-mono">
                  {n} · {n * tokens.spacingBase}px
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 라운드 */}
        <section aria-labelledby="s-radius" className="flex flex-col gap-4">
          <h2 id="s-radius" className="typo-heading-md">
            라운드 (Radius)
          </h2>
          <ul className="flex flex-wrap gap-5">
            {Object.entries(tokens.radius).map(([k, px]) => (
              <li key={k} className="flex flex-col items-center gap-2">
                <span
                  className="bg-surface border-border size-16 border"
                  style={{ borderRadius: `var(--ds-radius-${k})` }}
                />
                <span className="typo-caption text-foreground-muted font-mono">
                  {k} · {typeof px === 'number' ? `${px}px` : px}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* 그림자 */}
        <section aria-labelledby="s-shadow" className="flex flex-col gap-4">
          <h2 id="s-shadow" className="typo-heading-md">
            그림자 (Shadow)
          </h2>
          <p className="typo-caption text-foreground-muted">
            그림자 색상은 primitive를 참조합니다. 라이트는 검정 alpha, 다크는 흰색 alpha 로 전환되어
            배경에 관계없이 보입니다.
          </p>
          <ul className="wide:grid-cols-3 grid grid-cols-2 gap-5">
            {Object.entries(tokens.effect.shadow).map(([k, val]) => {
              // color 참조 "black.10" → "--raw-black-a10" (primitive → semantic 매핑 표시)
              const rawVar = (ref: string) => {
                const [name, step] = ref.split('.');
                return `--raw-${name}-a${step}`;
              };
              return (
                <li key={k} className="border-border overflow-hidden rounded-xl border">
                  {/* 그림자가 라이트=검정/다크=흰색으로 전환되므로 자연 배경 위에서 양쪽 다 보임 */}
                  <div className="bg-background flex aspect-[16/10] items-center justify-center">
                    <span
                      className="bg-surface border-border size-16 rounded-lg border"
                      style={{ boxShadow: `var(--ds-shadow-${k})` }}
                    />
                  </div>
                  <div className="border-border flex flex-col gap-1 border-t px-4 py-3">
                    <span className="typo-label">shadow-{k}</span>
                    <span className="typo-caption text-foreground-muted font-mono">
                      --ds-shadow-{k}
                    </span>
                    <span className="typo-caption text-foreground-muted font-mono">
                      ↳ {rawVar(val.color.light)} / {rawVar(val.color.dark)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 흐림 — 실제 사진에 blur 토큰을 적용해 흐림 강도를 시각화 */}
        <section aria-labelledby="s-blur" className="flex flex-col gap-4">
          <h2 id="s-blur" className="typo-heading-md">
            흐림 (Blur)
          </h2>
          <ul className="wide:grid-cols-3 grid grid-cols-2 gap-5">
            {Object.entries(tokens.effect.blur).map(([k, px]) => (
              <li key={k} className="border-border overflow-hidden rounded-xl border">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={sampleCatImg}
                    alt="파란 하늘을 배경으로 위를 올려다보는 고양이"
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover"
                    style={{ filter: `blur(var(--ds-blur-${k}))` }}
                  />
                </div>
                <div className="border-border flex flex-col gap-1 border-t px-4 py-3">
                  <span className="typo-label">blur-{k}</span>
                  <span className="typo-caption text-foreground-muted font-mono">
                    --ds-blur-{k} · {px}px
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 오버레이 — 체커보드 위 반투명 토큰(라이트 검정 / 다크 흰색 alpha) */}
        <section aria-labelledby="s-overlay" className="flex flex-col gap-4">
          <h2 id="s-overlay" className="typo-heading-md">
            오버레이 (Overlay)
          </h2>
          <p className="typo-caption text-foreground-muted">
            반투명 토큰입니다. 라이트는 검정 alpha, 다크는 흰색 alpha 로 자동 전환되어 아래 콘텐츠를
            어둡히거나 밝힙니다.
          </p>
          <ul className="wide:grid-cols-3 grid grid-cols-2 gap-5">
            {Object.entries(tokens.overlay).map(([k, ref]) => {
              // "black.5" → "--raw-black-a5" (primitive → semantic 매핑 표시)
              const rawVar = (r: string) => {
                const [name, step] = r.split('.');
                return `--raw-${name}-a${step}`;
              };
              return (
                <li key={k} className="border-border overflow-hidden rounded-xl border">
                  <div
                    className="relative aspect-[16/10]"
                    style={{
                      background:
                        'repeating-conic-gradient(var(--ds-gray-30) 0% 25%, var(--ds-gray-10) 0% 50%) 0 0 / 20px 20px',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{ background: `var(--ds-overlay-${k})` }}
                    />
                  </div>
                  <div className="border-border flex flex-col gap-1 border-t px-4 py-3">
                    <span className="typo-label">overlay-{k}</span>
                    <span className="typo-caption text-foreground-muted font-mono">
                      --ds-overlay-{k}
                    </span>
                    <span className="typo-caption text-foreground-muted font-mono">
                      ↳ {rawVar(ref.light)} / {rawVar(ref.dark)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
};

export default ComponentGuidePage;
