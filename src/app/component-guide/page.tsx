import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GUIDE_NAV_SECTIONS } from '@/constants/guide-nav';
import GuidePage from '@/components/guide-page';

export const metadata: Metadata = {
  // layout 의 template('%s · 컴포넌트 가이드')과 겹치지 않도록 개요는 단독 제목을 쓴다.
  title: { absolute: '컴포넌트 가이드' },
};

// 개요(랜딩) — 디자인 토큰 섹션들을 카테고리별 카드로 나열해 각 페이지로 안내한다.
// 섹션 목록은 사이드 네비와 동일한 단일 소스(GUIDE_NAV_SECTIONS)를 쓴다.
const ComponentGuidePage = () => (
  <GuidePage
    title="컴포넌트 가이드"
    description="이 플랫폼의 디자인 토큰(색상·타이포그래피·간격·라운드·그림자·흐림·오버레이)과 레이아웃 기준을 섹션별로 정리했습니다. 왼쪽 메뉴 또는 아래 카드에서 항목을 선택하세요. 오른쪽 하단 토글로 라이트/다크를 확인할 수 있습니다."
  >
    <div className="flex flex-col gap-8">
      {GUIDE_NAV_SECTIONS.map((section) => (
        <section key={section.title} aria-label={section.title} className="flex flex-col gap-3">
          <h2 className="typo-heading-sm text-foreground-muted">{section.title}</h2>
          <ul className="wide:grid-cols-2 pc:grid-cols-3 grid grid-cols-1 gap-3">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="border-border bg-surface hover:bg-gray-10 focus-visible:ring-brand focus-visible:ring-offset-background flex items-center justify-between gap-3 rounded-xl border px-4 py-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <span className="typo-body-md font-medium">{item.label}</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="text-foreground-muted size-4 shrink-0"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </GuidePage>
);

export default ComponentGuidePage;
