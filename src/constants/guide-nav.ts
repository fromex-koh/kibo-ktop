// 컴포넌트 가이드(/component-guide)의 사이드 내비게이션 = 화면 내 섹션(#s-*) 목차.
// 사이드바 레이아웃을 쓰는 가이드 페이지와 레이아웃 데모가 같은 목차를 공유하도록 한 곳에 둔다.
// 섹션을 추가·리네임하면 여기 href(#s-*)와 페이지의 aria-labelledby id 를 함께 맞춘다.

export type GuideNavItem = { label: string; href: string };
export type GuideNavSection = { title: string; items: GuideNavItem[] };

export const GUIDE_NAV_SECTIONS: readonly GuideNavSection[] = [
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
      { label: '사이드 메뉴 레이아웃', href: '/component-guide#s-sidebar-layout' },
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
