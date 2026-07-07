import type { Metadata } from 'next';
import ActiveBreakpointTag from '@/components/guide/active-breakpoint-tag';
import ThemeToggle from '@/components/theme-toggle';
import tokens from '@tokens';

export const metadata: Metadata = { title: '레이아웃 그리드 미리보기' };

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

// 레이아웃 그리드 미리보기 — 사이드바 없는 독립 전체화면. .grid-layout 이 뷰포트 전체 폭을 그대로
// 써서 해상도별 실제 그리드(모바일 328 / 태블릿 792 / 데스크톱 1200)를 정확히 확인할 수 있다.
// (컴포넌트 가이드 사이드 레이아웃 안에 넣으면 pc 에서 사이드바 폭만큼 좁아져 값이 어긋난다.)
const GridPreviewPage = () => (
  <main className="bg-background text-foreground wide:py-16 flex min-h-screen flex-col gap-10 py-12">
    {/* 제목·설명 + 테마 토글 (읽기 좋은 폭으로 제한) */}
    <div className="max-w-content mx-auto flex w-full flex-col gap-2 px-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="typo-heading-xl">레이아웃 그리드 미리보기</h1>
        <ThemeToggle />
      </div>
      <p className="typo-body-sm text-foreground-muted">
        브라우저 폭을 조절하면(또는 기기 회전) 실제 컬럼 수가 4 → 8 → 12 로 바뀝니다. 이 화면은
        사이드바 없이 뷰포트 전체 폭을 그대로 써서, 해상도별 실제 그리드(가장자리 여백·거터 포함)를
        정확히 보여줍니다.
      </p>
    </div>

    {/* 미리보기 — 뷰포트 전체 폭. .grid-layout 이 스스로 container 고정폭 + 최소 여백으로 제어한다. */}
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

    {/* 표 — 읽기 좋은 폭으로 제한 */}
    <div className="max-w-content mx-auto w-full px-6">
      <div className="border-border overflow-x-auto rounded-xl border">
        <table className="w-full text-left">
          <caption className="sr-only">
            브레이크포인트별 그리드 columns·gutter·container·margin
          </caption>
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
                container
              </th>
              <th scope="col" className="typo-label px-4 py-3">
                margin (최소)
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
                    {typeof g.container === 'number' ? `${g.container}px` : g.container}
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
    </div>
  </main>
);

export default GridPreviewPage;
