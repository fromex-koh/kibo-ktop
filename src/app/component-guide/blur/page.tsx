import type { Metadata } from 'next';
import Image from 'next/image';
import GuidePage from '@/components/guide-page';
import tokens from '../../../../tokens.json';
import sampleCatImg from '../../../../public/sample-cat.jpg';

export const metadata: Metadata = { title: '흐림' };

// 흐림 — blur-* 토큰. 실제 사진에 적용해 흐림 강도를 시각화한다.
const BlurGuidePage = () => (
  <GuidePage
    title="흐림 (Blur)"
    description="흐림(blur) 토큰입니다. 배경 흐림·오버레이 뒤 흐림 등에 쓰며, 아래는 실제 사진에 단계별로 적용한 예시입니다."
  >
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
  </GuidePage>
);

export default BlurGuidePage;
