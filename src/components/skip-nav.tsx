import type { MouseEvent } from 'react';

// 반복 영역(헤더·사이드 내비)을 건너뛰는 스킵 링크. [KWCAG 6.4.1]
// 평소엔 sr-only 로 숨고 키보드 Tab 으로 포커스되면 드러난다. DOM 최상단(첫 포커스 대상)에 두어
// z-index 하드코딩 없이 흐름상 헤더 위에 나타나게 한다. [CD-002]
// onSelect: 기본 앵커 이동 외 추가 처리가 필요할 때(예: 닫힌 드로어를 열고 포커스 이동).
export type SkipLinkItem = {
  href: string;
  label: string;
  onSelect?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const SkipNav = ({ links }: { links: readonly SkipLinkItem[] }) => (
  <nav aria-label="바로가기">
    {links.map((link) => (
      <a
        key={link.href}
        href={link.href}
        onClick={link.onSelect}
        className="bg-foreground text-background focus:ring-brand focus:ring-offset-background sr-only rounded-md font-semibold focus:not-sr-only focus:m-3 focus:inline-block focus:px-4 focus:py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none"
      >
        {link.label}
      </a>
    ))}
  </nav>
);

export default SkipNav;
