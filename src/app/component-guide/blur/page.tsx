import type { Metadata } from 'next';
import Image from 'next/image';
import GuidePage from '@/components/guide/guide-page';
import tokens from '@tokens';
import sampleCatImg from '../../../../public/sample-cat.jpg';

export const metadata: Metadata = { title: '흐림' };

// 흐림 — 흐림 토큰(--ds-blur-*)을 blur-* 유틸리티로 적용. 실제 사진으로 강도를 시각화한다.
const BlurGuidePage = () => (
  <GuidePage
    title="흐림 (Blur)"
    description="흐림 토큰입니다. blur-* 유틸리티로 적용하며(배경 흐림·오버레이 뒤 흐림 등), 아래는 실제 사진에 단계별로 적용한 예시입니다."
  >
    <ul className="wide:grid-cols-3 grid grid-cols-2 gap-5">
      {Object.entries(tokens.effect.blur).map(([k, px]) => (
        <li key={k} className="border-gray-subtle-2 overflow-hidden rounded-xl border">
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
          <div className="border-gray-subtle-2 flex flex-col gap-1 border-t px-4 py-3">
            <span className="typo-body-l-medium">blur-{k}</span>
            <span className="typo-caption-regular text-subtle font-mono">
              --ds-blur-{k} · {px}px
            </span>
          </div>
        </li>
      ))}
    </ul>
  </GuidePage>
);

export default BlurGuidePage;
