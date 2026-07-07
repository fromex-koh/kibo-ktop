import type { Metadata } from 'next';
import GuidePage from '@/components/guide/guide-page';
import tokens from '@tokens';

export const metadata: Metadata = { title: '그림자' };

// 그림자 — primitive alpha 참조(라이트=검정 / 다크=흰색)라 배경에 관계없이 보인다.
const ShadowGuidePage = () => (
  <GuidePage title="그림자 (Shadow)" description="shadow-* 유틸로 쓰는 그림자 토큰입니다.">
    <ul className="wide:grid-cols-3 grid grid-cols-2 gap-5">
      {Object.entries(tokens.effect.shadow).map(([k, val]) => {
        // color 참조 "black.10" → "--raw-black-a10" (primitive → semantic 매핑 표시)
        const rawVar = (ref: string) => {
          const [name, step] = ref.split('.');
          return `--raw-${name}-a${step}`;
        };
        return (
          <li key={k} className="border-gray-subtle-2 overflow-hidden rounded-xl border">
            {/* 그림자가 라이트=검정/다크=흰색으로 전환되므로 자연 배경 위에서 양쪽 다 보임 */}
            <div className="bg-background flex aspect-[16/10] items-center justify-center">
              <span
                className="bg-surface border-gray-subtle-2 size-16 rounded-lg border"
                style={{ boxShadow: `var(--ds-shadow-${k})` }}
              />
            </div>
            <div className="border-gray-subtle-2 flex flex-col gap-1 border-t px-4 py-3">
              <span className="typo-body-l-medium">shadow-{k}</span>
              <span className="typo-caption-regular text-subtle font-mono">--ds-shadow-{k}</span>
              <span className="typo-caption-regular text-subtle font-mono">
                ↳ {rawVar(val.color.light)} / {rawVar(val.color.dark)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  </GuidePage>
);

export default ShadowGuidePage;
