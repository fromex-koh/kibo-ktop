import type { Metadata } from 'next';
import GuidePage from '@/components/guide/guide-page';
import tokens from '@tokens';

export const metadata: Metadata = { title: '색상' };

// 색상 — Tier 1 프리미티브 팔레트. 시맨틱 토큰이 이 값을 참조한다.
// 저장은 hex(생성기 규격)지만 Figma 원본이 rgba 라, 큐레이션 화면엔 rgba 문자열로 보여준다(값은 동일).
const hexToRgba = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 1)`;
};

const ColorGuidePage = () => (
  <GuidePage
    title="색상 (Color)"
    description="Tier 1 프리미티브 팔레트입니다. Figma(Mode 1) 원본 값을 그대로 반영하며 각 색상은 50~900 스케일로 정의됩니다. 시맨틱 토큰(background·foreground·brand·danger 등)이 이 값을 참조합니다. 직접 사용은 지양하고 시맨틱 토큰을 우선하세요."
  >
    <div className="flex flex-col gap-6">
      {Object.entries(tokens.primitive).map(([hue, steps]) => (
        <div key={hue} className="flex flex-col gap-2">
          <span className="typo-label">{hue}</span>
          <ul className="wide:grid-cols-5 pc:grid-cols-10 grid grid-cols-2 gap-3">
            {Object.entries(steps).map(([step, hex]) => (
              <li key={step} className="border-border overflow-hidden rounded-lg border">
                <span
                  className="block aspect-[16/9] w-full"
                  style={{ background: `var(--raw-${hue}-${step})` }}
                />
                <div className="typo-caption border-border border-t px-3 py-2 font-mono">
                  <span className="block">{step}</span>
                  <span className="text-foreground-muted block">{hexToRgba(hex)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </GuidePage>
);

export default ColorGuidePage;
