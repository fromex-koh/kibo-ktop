import type { Metadata } from 'next';
import ActiveBreakpointTag from '@/components/active-breakpoint-tag';
import GuidePage from '@/components/guide-page';
import tokens from '../../../../tokens.json';

export const metadata: Metadata = { title: '레이아웃 그리드' };

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

// 레이아웃 그리드 — 브레이크포인트별 컬럼·거터·마진, .grid-layout 하나로 캡슐화.
const GridGuidePage = () => (
  <GuidePage
    title="레이아웃 그리드 (Grid)"
    description={
      <>
        브레이크포인트별 컬럼 수·거터(칸 간격)·마진(가장자리 여백)을 정의합니다. 전체 폭 상한은{' '}
        <code>max-w-content</code>({tokens.container.content}px)를 공유하며,{' '}
        <code>.grid-layout</code> 클래스 하나로 컬럼 그리드·거터·마진·폭 상한을 함께 적용합니다.
      </>
    }
  >
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
  </GuidePage>
);

export default GridGuidePage;
