import type { Metadata } from 'next';
import GuidePage from '@/components/guide/guide-page';
import tokens from '@tokens';

export const metadata: Metadata = { title: '라운드' };

// 라운드 — 반경 토큰(--ds-radius-*)을 rounded-* 유틸리티로 적용. 정의된 키만 사용한다.
const RadiusGuidePage = () => (
  <GuidePage
    title="라운드 (Radius)"
    description="모서리 반경 토큰입니다. rounded-* 유틸로 쓰며, 정의된 키(sm·md·lg·xl·2xl·full)만 사용합니다. 임의값(rounded-[7px])은 지양합니다."
  >
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
  </GuidePage>
);

export default RadiusGuidePage;
