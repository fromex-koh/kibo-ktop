import { Info } from 'lucide-react';
import GuidePage from '@/components/guide/guide-page';
import { GUIDE_NAV_SECTIONS } from '@/constants/guide-nav';
import SidebarLayout from '@/components/sidebar-layout';

// 공용 SidebarLayout 셸을 그대로 쓰고, 본문은 다른 컴포넌트 가이드 페이지들과 같은 GuidePage
// 틀(브레드크럼 + PageHeader)을 재사용한 뒤 레이아웃 확인용 데모 콘텐츠로 채운다.
// 실제 가이드(/component-guide)도 같은 셸·같은 사이드 메뉴를 쓰고 항목 클릭 시 실제 페이지로
// 이동하기까지 해서, 자칫 이 화면 자체를 실제 가이드 페이지로 착각할 수 있다 — 그래서 본문
// 맨 위에 "이 페이지는 예시"임을 알리는 안내를 둔다.
const SidebarLayoutDemo = () => {
  return (
    <SidebarLayout
      title="사이드 메뉴 레이아웃 (예시)"
      navSections={GUIDE_NAV_SECTIONS}
      navLabel="사이드 메뉴 레이아웃 데모 내비게이션"
    >
      <GuidePage
        title="사이드 메뉴 레이아웃 (예시 페이지)"
        category={GUIDE_NAV_SECTIONS[2].title}
        description={
          <>
            works/system-guide 프로젝트의 사이드 내비게이션 구조를 이 프로젝트의 브레이크포인트(
            <code>wide</code>/<code>pc</code>)·색상 토큰·<code>.grid-layout</code> 유틸리티로
            재구성한 벤치마킹 데모입니다. <code>pc</code>(1280px) 이상은 사이드바가 상시 고정 레일로
            보이고 본문이 그 폭(<code>size.sidebar-w</code>, 256px)만큼 밀립니다. <code>pc</code>{' '}
            미만에서는 헤더의 메뉴 버튼으로 여닫는 <strong>오버레이 드로어</strong>가 되어, 본문을
            아래로 밀지 않고 필요할 때만 위에 겹쳐 보여줍니다.
          </>
        }
      >
        {/* 이 화면이 실제 가이드 페이지가 아니라 레이아웃 시연용 예시임을 알리는 안내.
            왼쪽 사이드 메뉴는 실제 컴포넌트 가이드와 동일한 목록을 그대로 재사용하고 항목을
            클릭하면 실제 해당 페이지로 이동하므로, 이 안내가 없으면 이 화면 자체를 진짜
            가이드 페이지로 착각하기 쉽다. */}
        <div className="border-info-border bg-info-surface flex items-start gap-3 rounded-md border p-4">
          <Info aria-hidden="true" className="text-info-text mt-0.5 size-5 shrink-0" />
          <p className="typo-body-l-regular text-info-text">
            <strong className="font-semibold">이 페이지는 실제 화면이 아니라 예시입니다.</strong>{' '}
            <code>SidebarLayout</code> 컴포넌트의 레이아웃(고정 레일·오프캔버스 드로어)만 확인하기
            위한 것으로, 아래 콘텐츠 블록은 더미입니다. 왼쪽 사이드 메뉴는 실제 컴포넌트 가이드와
            같은 목록이라 항목을 클릭하면 실제 해당 페이지로 이동합니다.
          </p>
        </div>

        {/* 본문 — 레이아웃 그리드(.grid-layout) 재사용: 모바일 4 / wide 8 / pc 12열. */}
        <div className="grid-layout">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-gray-subtle-2 bg-surface col-span-4 flex aspect-video items-center justify-center rounded-xl border"
            >
              <span className="typo-caption-regular text-subtle">더미 콘텐츠 블록 {i + 1}</span>
            </div>
          ))}
        </div>
      </GuidePage>
    </SidebarLayout>
  );
};

export default SidebarLayoutDemo;
