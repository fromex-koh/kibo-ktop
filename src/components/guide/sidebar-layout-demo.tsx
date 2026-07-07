import GuidePage from '@/components/guide/guide-page';
import { GUIDE_NAV_SECTIONS } from '@/constants/guide-nav';
import SidebarLayout from '@/components/sidebar-layout';

// 공용 SidebarLayout 셸을 그대로 쓰고, 본문은 다른 컴포넌트 가이드 페이지들과 같은 GuidePage
// 틀(브레드크럼 + PageHeader)을 재사용한 뒤 레이아웃 확인용 데모 콘텐츠로 채운다.
// 실제 가이드(/component-guide)도 같은 셸을 쓴다 — 여긴 큰 레이아웃을 단독으로 보기 위한 데모다.
const SidebarLayoutDemo = () => {
  return (
    <SidebarLayout
      title="사이드 메뉴 레이아웃"
      navSections={GUIDE_NAV_SECTIONS}
      navLabel="사이드 메뉴 레이아웃 데모 내비게이션"
    >
      <GuidePage
        title="사이드 메뉴 레이아웃"
        category={GUIDE_NAV_SECTIONS[1].title}
        description={
          <>
            works/system-guide 프로젝트의 사이드 내비게이션 구조를 이 프로젝트의 브레이크포인트(
            <code>wide</code>/<code>pc</code>)·색상 토큰·<code>.grid-layout</code> 유틸리티로
            재구성한 벤치마킹 데모입니다. <code>pc</code>(1280px) 이상은 사이드바가 상시 고정
            레일로 보이고 본문이 그 폭(<code>size.sidebar-w</code>, 256px)만큼 밀립니다.{' '}
            <code>pc</code> 미만에서는 헤더의 메뉴 버튼으로 여닫는{' '}
            <strong>오버레이 드로어</strong>가 되어, 본문을 아래로 밀지 않고 필요할 때만 위에
            겹쳐 보여줍니다.
          </>
        }
      >
        {/* 본문 — 레이아웃 그리드(.grid-layout) 재사용: 모바일 4 / wide 8 / pc 12열. */}
        <div className="grid-layout">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-gray-subtle-2 bg-surface col-span-4 flex aspect-video items-center justify-center rounded-xl border"
            >
              <span className="typo-caption-regular text-subtle">콘텐츠 블록 {i + 1}</span>
            </div>
          ))}
        </div>
      </GuidePage>
    </SidebarLayout>
  );
};

export default SidebarLayoutDemo;
