'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Menu, PanelLeft, X } from 'lucide-react';
import tokens from '../../tokens.json';

// works/system-guide 프로젝트의 사이드 내비게이션 구조를 이 프로젝트 브레이크포인트(wide/pc)·색상·
// 그리드·크기 토큰으로 재구성한 벤치마킹 데모.
// UX: pc(1280px) 이상은 상시 고정 레일, pc 미만은 오프캔버스 드로어(햄버거로 여닫고 콘텐츠 위에 오버레이).
// 예전처럼 사이드바가 콘텐츠 위로 쌓여 본문을 밀어내지 않아, 좁은 화면에서도 본문이 바로 보인다.
const NAV_SECTIONS = [
  {
    title: '색상 · 타이포',
    items: [
      { label: '색상 (Primitive)', href: '/component-guide#s-color' },
      { label: '타이포그래피', href: '/component-guide#s-typo' },
    ],
  },
  {
    title: '레이아웃',
    items: [
      { label: '브레이크포인트', href: '/component-guide#s-breakpoint' },
      { label: '레이아웃 그리드', href: '/component-guide#s-grid' },
      { label: '간격 (Spacing)', href: '/component-guide#s-space' },
    ],
  },
  {
    title: '효과',
    items: [
      { label: '라운드', href: '/component-guide#s-radius' },
      { label: '그림자', href: '/component-guide#s-shadow' },
      { label: '흐림', href: '/component-guide#s-blur' },
      { label: '오버레이', href: '/component-guide#s-overlay' },
    ],
  },
];

// pc 여부(≥1280px)를 미디어쿼리로 구독 — 브레이크포인트 값은 tokens.json 에서 가져와 하드코딩 방지.
const PC_MEDIA = `(min-width: ${tokens.breakpoint.pc}px)`;
const subscribePc = (callback: () => void) => {
  const mql = window.matchMedia(PC_MEDIA);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};
const getPcSnapshot = () => window.matchMedia(PC_MEDIA).matches;
const getPcServerSnapshot = () => false; // SSR: pc 아님으로 가정(모바일 퍼스트)

const SidebarLayoutDemo = () => {
  // pc 미만에서 드로어 열림 상태(기본 닫힘 → 콘텐츠가 바로 보임). pc 는 CSS 로 상시 레일이라 이 값과 무관.
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isPc = useSyncExternalStore(subscribePc, getPcSnapshot, getPcServerSnapshot);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const isDrawerMode = !isPc; // pc 미만 = 드로어로 동작
  const isDrawerActive = isDrawerMode && isDrawerOpen; // 드로어가 실제로 열려 오버레이 중
  const isNavOffCanvas = isDrawerMode && !isDrawerOpen; // 화면 밖으로 숨은 상태 → inert 로 초점/AT 제외
  const closeDrawer = () => setIsDrawerOpen(false);

  // Esc 로 닫고, 닫힌 뒤 초점을 토글 버튼으로 복귀 (KWCAG 8.2.1)
  useEffect(() => {
    if (!isDrawerActive) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isDrawerActive]);

  // 드로어가 열리면 초점을 내비로 이동(키보드/스크린리더가 메뉴에 진입) + 배경 스크롤 잠금
  useEffect(() => {
    if (!isDrawerActive) return;
    navRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isDrawerActive]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="border-border bg-background wide:px-6 h-header-h sticky top-0 flex items-center gap-3 border-b px-4">
        {/* 햄버거 — pc 미만에서만. pc 는 상시 레일이라 토글이 불필요해 숨긴다.
            터치 타깃은 44px(min-h-11/min-w-11) 유지(KWCAG 6.1.3), 아이콘만 한 단계 작게(icon-sm)
            해서 은은한 모노톤 원형으로 보이게 한다. */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsDrawerOpen((open) => !open)}
          aria-label={isDrawerOpen ? '사이드 메뉴 닫기' : '사이드 메뉴 열기'}
          aria-expanded={isDrawerOpen}
          aria-controls="sidebar-layout-nav"
          className="bg-gray-10 text-foreground-muted hover:text-foreground focus-visible:ring-brand focus-visible:ring-offset-background pc:hidden inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          {isDrawerOpen ? (
            <X aria-hidden="true" className="size-icon-sm" />
          ) : (
            <Menu aria-hidden="true" className="size-icon-sm" />
          )}
        </button>
        <Link
          href="/"
          aria-label="홈으로"
          className="bg-gray-10 text-foreground-muted hover:text-foreground focus-visible:ring-brand focus-visible:ring-offset-background inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <Home aria-hidden="true" className="size-icon-sm" />
        </Link>
        {/* 헤더 중앙 타이틀 — 로고 아이콘 + 큰 글자로 "이 페이지의 타이틀"임을 드러냄.
            남는 공간을 차지해 좌측 아이콘 그룹 폭과 무관하게 중앙에 가깝게 위치 */}
        <div className="flex flex-1 items-center justify-center gap-2 truncate">
          <PanelLeft aria-hidden="true" className="text-brand-foreground size-icon-md shrink-0" />
          <p className="typo-heading-sm truncate">사이드 메뉴 레이아웃</p>
        </div>
        {/* 좌측 아이콘 그룹과 동일한 폭의 빈 자리 — 타이틀이 시각적으로 정확히 중앙에 오도록 균형을 맞춤.
            pc 에서는 햄버거가 숨어(pc:hidden) 좌측 그룹이 홈 버튼 하나뿐이므로, 이 자리도 하나만 남긴다. */}
        <div aria-hidden="true" className="flex gap-3">
          <span className="pc:hidden min-h-11 min-w-11" />
          <span className="min-h-11 min-w-11" />
        </div>
      </header>

      {/* pc 는 상시 레일이라 본문을 사이드바 폭만큼 항상 밀어둔다(pc 미만은 드로어가 오버레이라 안 밈). */}
      <div className="pc:pl-sidebar-pl">
        {/* 백드롭(반투명 배경) — pc 미만에서 드로어가 열렸을 때만. 눌러서 닫기(마우스 편의, 키보드는 Esc/X).
            static 인 main 위에 뜨도록 positioned(fixed) 로만 쌓아 z-index 하드코딩을 피한다. [CD-002] */}
        <button
          type="button"
          onClick={closeDrawer}
          aria-hidden="true"
          tabIndex={-1}
          className={`bg-overlay-lg top-header-top pc:hidden fixed inset-x-0 bottom-0 transition-opacity duration-200 motion-reduce:transition-none ${
            isDrawerActive ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />

        {/* 사이드 내비 — pc: 상시 고정 레일 / pc 미만: 왼쪽에서 슬라이드되는 오프캔버스 드로어.
            숨었을 때(off-canvas)는 inert 로 초점 이동·스크린리더에서 제외한다. */}
        <nav
          ref={navRef}
          id="sidebar-layout-nav"
          tabIndex={-1}
          inert={isNavOffCanvas || undefined}
          aria-label="사이드 메뉴 레이아웃 데모 내비게이션"
          className={`border-border bg-background wide:px-6 top-header-top pc:translate-x-0 pc:py-8 w-sidebar-w fixed bottom-0 left-0 flex flex-col gap-6 overflow-y-auto border-r p-4 transition-transform duration-200 ease-out outline-none motion-reduce:transition-none ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <p className="typo-caption text-foreground-muted px-1 font-semibold uppercase">
                {section.title}
              </p>
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeDrawer}
                      className="text-foreground-muted hover:bg-gray-10 hover:text-foreground focus-visible:ring-brand focus-visible:ring-offset-background typo-body-sm block rounded-lg px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* 본문 — 레이아웃 그리드(.grid-layout) 재사용: 모바일 4 / wide 8 / pc 12열.
            드로어가 열리면 배경으로서 inert(뒤 콘텐츠와 상호작용 차단 → 모달 성격). */}
        <main inert={isDrawerActive || undefined} className="grid-layout wide:py-12 pc:py-16 py-10">
          <div className="col-span-full flex flex-col gap-4">
            {/* 브레드크럼 — 이 페이지의 실제 사이드 메뉴 계층(카테고리 → 현재 항목)을 그대로 반영.
                실제 페이지가 아니라 레이아웃 확인용 데모라 링크 기능 없이 텍스트로만 표시.
                마지막 항목만 aria-current(현재 위치). */}
            <nav aria-label="브레드크럼">
              <ol className="typo-caption text-foreground-muted flex flex-wrap items-center gap-1.5">
                {/* NAV_SECTIONS[1] = "레이아웃" — 이 데모(사이드 메뉴 레이아웃)가 속한 사이드 메뉴 카테고리 */}
                <li>{NAV_SECTIONS[1].title}</li>
                <li aria-hidden="true">
                  <ChevronRight className="size-3.5" />
                </li>
                <li aria-current="page" className="text-foreground font-semibold">
                  사이드 메뉴 레이아웃
                </li>
              </ol>
            </nav>
            <h1 className="typo-heading-lg">사이드 메뉴 레이아웃</h1>
            <p className="typo-body-sm text-foreground-muted w-full">
              works/system-guide 프로젝트의 사이드 내비게이션 구조를 이 프로젝트의 브레이크포인트(
              <code>wide</code>/<code>pc</code>)·색상·그리드 토큰으로 재구성한 벤치마킹 데모입니다.
              <code>pc</code>(1280px) 이상은 사이드바가 상시 고정 레일로 보이고 본문이 그 폭(
              <code>size.sidebar-w</code>, 256px)만큼 밀립니다. <code>pc</code> 미만에서는 헤더의
              메뉴 버튼으로 여닫는 <strong>오버레이 드로어</strong>가 되어, 본문을 아래로 밀지 않고
              필요할 때만 위에 겹쳐 보여줍니다.
            </p>
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-border bg-surface col-span-4 flex aspect-video items-center justify-center rounded-xl border"
            >
              <span className="typo-caption text-foreground-muted">콘텐츠 블록 {i + 1}</span>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayoutDemo;
