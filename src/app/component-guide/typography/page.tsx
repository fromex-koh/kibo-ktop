import type { Metadata } from 'next';
import GuidePage from '@/components/guide-page';
import tokens from '../../../../tokens.json';

export const metadata: Metadata = { title: '타이포그래피' };

// 타이포그래피 — typo-* 복합 클래스(크기·굵기·행간·자간·반응형이 한 묶음).
const TypographyGuidePage = () => (
  <GuidePage
    title="타이포그래피 (Typography)"
    description="제목·본문·라벨·캡션용 복합 클래스(typo-*)입니다. 크기·굵기·행간·자간과 모바일→PC 반응형이 한 묶음으로 적용되므로, 한 요소엔 typo-* 하나만 쓰고 text-*·font-* 와 섞지 않습니다."
  >
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
  </GuidePage>
);

export default TypographyGuidePage;
