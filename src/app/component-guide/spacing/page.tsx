import type { Metadata } from 'next';
import GuidePage from '@/components/guide-page';
import tokens from '../../../../tokens.json';

export const metadata: Metadata = { title: '간격' };

// 간격 — base(4px) × N 무한 스케일. p-*·m-*·gap-* 정수 배수 유틸을 쓴다.
const SpacingGuidePage = () => (
  <GuidePage
    title="간격 (Spacing)"
    description={
      <>
        base {tokens.spacingBase}px × N(무한) 스케일입니다. 예: <code>p-4</code> ={' '}
        {tokens.spacingBase * 4}px. base 값 하나만 바꾸면 전체 간격이 비율대로 조정됩니다. 임의값(
        <code>p-[13px]</code>)·반단위는 지양합니다.
      </>
    }
  >
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
  </GuidePage>
);

export default SpacingGuidePage;
