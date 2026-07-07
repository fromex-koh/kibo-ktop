import type { Metadata } from 'next';
import GuidePage from '@/components/guide/guide-page';
import tokens from '@tokens';

export const metadata: Metadata = { title: '오버레이' };

// 오버레이 — 반투명 토큰(라이트=검정 / 다크=흰색 alpha)을 bg-overlay-* 유틸리티로 적용. 드로어 백드롭 등.
const OverlayGuidePage = () => (
  <GuidePage
    title="오버레이 (Overlay)"
    description="반투명 토큰입니다. bg-overlay-* 유틸리티로 적용하며, 라이트는 검정 alpha·다크는 흰색 alpha 로 자동 전환되어 아래 콘텐츠를 어둡히거나 밝힙니다(드로어 백드롭·모달 배경 등)."
  >
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
              <span className="typo-caption text-foreground-muted font-mono">--ds-overlay-{k}</span>
              <span className="typo-caption text-foreground-muted font-mono">
                ↳ {rawVar(ref.light)} / {rawVar(ref.dark)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  </GuidePage>
);

export default OverlayGuidePage;
