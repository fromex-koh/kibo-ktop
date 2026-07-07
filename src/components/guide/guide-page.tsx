import type { ReactNode } from 'react';

// 컴포넌트 가이드 각 섹션 페이지의 공용 틀 — 타이틀 영역(h1 + 설명)을 통일하고 본문을 감싼다.
// 사이드바 셸(헤더·네비)은 상위 layout.tsx 가 담당하므로 여기선 콘텐츠 컨테이너만 책임진다.
type GuidePageProps = {
  title: string;
  description: ReactNode;
  children: ReactNode;
};

const GuidePage = ({ title, description, children }: GuidePageProps) => (
  <div className="max-w-content wide:py-16 mx-auto flex w-full flex-col gap-10 px-6 py-12">
    <header className="flex flex-col gap-2">
      <h1 className="typo-heading-xl">{title}</h1>
      <p className="typo-body-sm text-subtle">{description}</p>
    </header>
    {children}
  </div>
);

export default GuidePage;
