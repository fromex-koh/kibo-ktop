import type { LucideIcon } from 'lucide-react';

// 아이콘 — lucide 글리프([NA-008] 표준 단일 아이콘 라이브러리)를 두 스타일(variant)로 렌더한다.
//  - outline(기본): 글리프만 그린다(span 없이 <svg> 하나). 크기는 size-icon-* 유틸로 지정.
//  - solid: 원형 배지 안에 글리프를 담아 강조한다(알림·상태 배지 등). 배지 크기 = size-icon-*,
//    안의 글리프는 배지의 60% 로 두어 여백을 둔다.
// 의미 있는 아이콘이면 label 로 접근성 이름을 준다(role="img"). 생략하면 장식용으로 보고
// aria-hidden 처리한다([5.1.1] — 아이콘만 있는 요소의 대체 텍스트).
type IconVariant = 'outline' | 'solid';

type IconProps = {
  icon: LucideIcon;
  variant?: IconVariant;
  label?: string;
  className?: string;
};

const Icon = ({ icon: Glyph, variant = 'outline', label, className = '' }: IconProps) => {
  // label 이 있으면 의미 있는 아이콘(role=img + 이름), 없으면 장식용(aria-hidden).
  const a11y = label
    ? ({ role: 'img', 'aria-label': label } as const)
    : ({ 'aria-hidden': true } as const);

  if (variant === 'solid') {
    return (
      <span
        {...a11y}
        className={`bg-info-surface text-info-text inline-flex items-center justify-center rounded-full ${className}`.trim()}
      >
        {/* 배지의 60% 로 여백을 둔다(고정 px 아닌 비율이라 어느 size-icon-* 에도 맞는다). */}
        <Glyph aria-hidden="true" style={{ width: '60%', height: '60%' }} />
      </span>
    );
  }

  return <Glyph {...a11y} className={className} />;
};

export { Icon };
export type { IconVariant };
