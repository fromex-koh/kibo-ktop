import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import GuidePage from '@/components/guide-page';

export const metadata: Metadata = { title: '사이드 메뉴 레이아웃' };

// 사이드 메뉴 레이아웃 — 지금 이 가이드가 쓰는 셸. 실제 큰 레이아웃은 별도 페이지(새 창)에서 확인.
const SidebarLayoutGuidePage = () => (
  <GuidePage
    title="사이드 메뉴 레이아웃 (Side Navigation Layout)"
    description={
      <>
        지금 보고 있는 이 가이드가 쓰는 레이아웃 셸입니다. <code>pc</code>(1280px) 이상은 사이드바가
        상시 고정 레일이 되고 본문이 그 폭(<code>size.sidebar-w</code>, 256px)만큼 밀립니다.{' '}
        <code>pc</code> 미만에서는 헤더의 메뉴 버튼으로 여닫는 오버레이 드로어로 전환됩니다.
      </>
    }
  >
    <p className="typo-body-sm text-foreground-muted">
      works/system-guide 프로젝트의 사이드 내비게이션 구조를 이 프로젝트의 브레이크포인트(
      <code>wide</code>/<code>pc</code>)·색상 토큰·<code>.grid-layout</code> 유틸리티로 재구성한
      벤치마킹입니다. 위 미니 데모들과 달리 실제 페이지 크기로 봐야 하는 큰 레이아웃이라, 콘텐츠
      없이 레이아웃만 담은 별도 페이지로도 확인할 수 있습니다.
    </p>
    <Link
      href="/publishing/sidebar-layout"
      target="_blank"
      rel="noopener noreferrer"
      className="border-border bg-surface hover:bg-gray-10 focus-visible:ring-brand focus-visible:ring-offset-background inline-flex w-fit items-center gap-1.5 rounded-lg border px-4 py-2.5 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      새 창에서 레이아웃 확인
      <ArrowUpRight aria-hidden="true" className="size-4" />
      <span className="sr-only">(새 창에서 열림)</span>
    </Link>
  </GuidePage>
);

export default SidebarLayoutGuidePage;
