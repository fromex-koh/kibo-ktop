import type { Metadata } from 'next';
import CopyChip from '@/components/guide/copy-chip';
import GuidePage from '@/components/guide/guide-page';
import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/page-header';

export const metadata: Metadata = { title: '페이지 헤더' };

// 사용법 스니펫 — CopyChip 의 label 로 짧게 노출하고 클립보드엔 이 전체를 복사한다.
const USAGE_CODE = `<PageHeader>
  <PageHeaderTitle>내 정보 확인</PageHeaderTitle>
  <PageHeaderDescription>
    KIBGx AI가 기술·시장·특허 데이터를 분석해 드립니다.
  </PageHeaderDescription>
</PageHeader>`;

// 페이지 헤더 — 제목+설명 묶음 컴포넌트. 이 가이드 페이지들의 상단 타이틀 영역(GuidePage)도
// 내부적으로 이 컴포넌트를 쓴다(직접 예시로 확인하려면 이 페이지 맨 위 타이틀이 바로 그 결과).
const PageHeaderGuidePage = () => (
  <GuidePage
    title="페이지 헤더 (PageHeader)"
    description="페이지·섹션 최상단의 제목+설명 묶음입니다. shadcn 의 CardHeader·CardTitle·CardDescription 과 같은 합성(compound) 컴포넌트 API — PageHeader 로 감싸고 안에 PageHeaderTitle·PageHeaderDescription 을 둡니다. 실은 지금 이 페이지 맨 위 타이틀 영역도 GuidePage 가 내부적으로 이 컴포넌트를 써서 렌더한 것입니다."
  >
    <section aria-labelledby="ph-preview" className="flex flex-col gap-4">
      <h2 id="ph-preview" className="typo-heading-h4-bold">
        미리보기
      </h2>
      <div className="border-gray-subtle-2 rounded-xl border p-6">
        <PageHeader>
          <PageHeaderTitle>내 정보 확인</PageHeaderTitle>
          <PageHeaderDescription>
            KIBGx AI가 기술·시장·특허 데이터를 분석해 드립니다.
          </PageHeaderDescription>
        </PageHeader>
      </div>
    </section>

    <section aria-labelledby="ph-usage" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="ph-usage" className="typo-heading-h4-bold">
          사용법
        </h2>
        <CopyChip value={USAGE_CODE} label="사용법" />
      </div>
      <pre className="border-gray-subtle-2 bg-surface overflow-x-auto rounded-xl border p-4">
        <code className="typo-caption-regular font-mono">{USAGE_CODE}</code>
      </pre>
    </section>
  </GuidePage>
);

export default PageHeaderGuidePage;
