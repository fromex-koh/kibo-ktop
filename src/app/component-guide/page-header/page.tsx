import type { Metadata } from 'next';
import CodeBlock from '@/components/guide/code-block';
import GuidePage from '@/components/guide/guide-page';
import { GUIDE_NAV_SECTIONS } from '@/constants/guide-nav';
import { PageHeader, PageHeaderDescription, PageHeaderTitle } from '@/components/page-header';

export const metadata: Metadata = { title: 'PageHeader' };

// 사용법 스니펫 — CopyChip 의 label 로 짧게 노출하고 클립보드엔 이 전체를 복사한다.
const USAGE_CODE_DEFAULT = `<PageHeader>
  <PageHeaderTitle>내 정보 확인</PageHeaderTitle>
  <PageHeaderDescription>
    KIBGx AI가 기술·시장·특허 데이터를 분석해 드립니다.
  </PageHeaderDescription>
</PageHeader>`;

const USAGE_CODE_COMPACT = `<PageHeader>
  <PageHeaderTitle variant="compact">사업자 정보 입력</PageHeaderTitle>
  <PageHeaderDescription variant="compact">
    기업 평가에 필요한 기본 정보를 입력해 주세요.
  </PageHeaderDescription>
</PageHeader>`;

// 페이지 헤더 — 제목+설명 묶음 컴포넌트. 이 가이드 페이지들의 상단 타이틀 영역(GuidePage)도
// 내부적으로 이 컴포넌트를 쓴다(직접 예시로 확인하려면 이 페이지 맨 위 타이틀이 바로 그 결과).
const PageHeaderGuidePage = () => (
  <GuidePage
    title="PageHeader"
    description="페이지·섹션 최상단의 제목+설명 묶음 컴포넌트입니다."
    category={GUIDE_NAV_SECTIONS[2].title}
  >
    <section aria-labelledby="ph-variant" className="flex flex-col gap-6">
      <div>
        <h2 id="ph-variant" className="typo-heading-h4-bold">
          Variant
        </h2>
        <p className="typo-body-l-regular text-subtle">
          페이지 성격에 맞춰 선택하는 타이포그래피 조합 2가지입니다.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
            variant
          </span>
          <h3 className="typo-body-l-medium text-foreground">default — 일반 페이지</h3>
        </div>
        <div className="border-gray-subtle-2 rounded-md border p-6">
          <PageHeader>
            <PageHeaderTitle>내 정보 확인</PageHeaderTitle>
            <PageHeaderDescription>
              KIBGx AI가 기술·시장·특허 데이터를 분석해 드립니다.
            </PageHeaderDescription>
          </PageHeader>
        </div>
        <CodeBlock code={USAGE_CODE_DEFAULT} language="tsx" copyLabel="복사" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
            variant
          </span>
          <h3 className="typo-body-l-medium text-foreground">
            compact — 콘텐츠 밀도가 높은 페이지
          </h3>
        </div>
        <div className="border-gray-subtle-2 rounded-md border p-6">
          <PageHeader>
            <PageHeaderTitle variant="compact">사업자 정보 입력</PageHeaderTitle>
            <PageHeaderDescription variant="compact">
              기업 평가에 필요한 기본 정보를 입력해 주세요.
            </PageHeaderDescription>
          </PageHeader>
        </div>
        <p className="typo-body-l-regular text-subtle">
          모바일에서는 Heading/H4/bold + Body/XL/Regular, wide 이상에서는 Display/M/bold +
          Title/L/Regular 로 전환됩니다. 화면 폭을 줄여 확인해 보세요.
        </p>
        <CodeBlock code={USAGE_CODE_COMPACT} language="tsx" copyLabel="복사" />
      </div>
    </section>

    <section aria-labelledby="ph-composition" className="flex flex-col gap-4">
      <div>
        <h2 id="ph-composition" className="typo-heading-h4-bold">
          Composition
        </h2>
        <p className="text-foreground-muted text-sm">
          이 컴포넌트 내부에 들어갈 수 있는 요소들입니다.
        </p>
      </div>
      <div className="bg-background border-gray-subtle-2 overflow-x-auto rounded-md border">
        <table className="w-full text-left">
          <caption className="sr-only">Composition 목록</caption>
          <thead>
            <tr className="border-gray-subtle-2 border-b bg-gray-100/25">
              <th scope="col" className="typo-body-l-medium px-4 py-3">
                Name
              </th>
              <th scope="col" className="typo-body-l-medium px-4 py-3">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-gray-subtle-2 bg-background border-b last:border-b-0">
              <th
                scope="row"
                className="typo-body-l-regular border-gray-subtle-2 text-primary border-r px-4 py-3 align-top font-mono font-normal"
              >
                PageHeaderTitle
              </th>
              <td className="typo-body-l-regular text-subtle px-4 py-3">
                페이지 제목을 표시합니다. 내부적으로 h1 요소를 렌더링합니다.
              </td>
            </tr>
            <tr className="border-gray-subtle-2 bg-background border-b last:border-b-0">
              <th
                scope="row"
                className="typo-body-l-regular border-gray-subtle-2 text-primary border-r px-4 py-3 align-top font-mono font-normal"
              >
                PageHeaderDescription
              </th>
              <td className="typo-body-l-regular text-subtle px-4 py-3">
                페이지의 추가 설명을 표시합니다. 내부적으로 p 요소를 렌더링합니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="ph-props" className="flex flex-col gap-4">
      <div>
        <h2 id="ph-props" className="typo-heading-h4-bold">
          Props
        </h2>
        <p className="text-foreground-muted text-sm">커스터마이징 가능한 속성들입니다.</p>
      </div>

      {/* BASIC */}
      <div className="flex flex-col gap-2">
        <h3 className="typo-body-l-medium text-foreground">BASIC</h3>
        <div className="bg-background border-gray-subtle-2 overflow-x-auto rounded-md border">
          <table className="w-full text-left">
            <caption className="sr-only">BASIC Props 목록</caption>
            <thead>
              <tr className="border-gray-subtle-2 border-b bg-gray-100/25">
                <th scope="col" className="typo-body-l-medium px-4 py-3">
                  Name
                </th>
                <th scope="col" className="typo-body-l-medium px-4 py-3">
                  Description
                </th>
                <th scope="col" className="typo-body-l-medium px-4 py-3">
                  Default
                </th>
                <th scope="col" className="typo-body-l-medium px-4 py-3">
                  Control
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-gray-subtle-2 bg-background border-b last:border-b-0">
                <th
                  scope="row"
                  className="typo-body-l-regular border-gray-subtle-2 text-primary border-r px-4 py-3 align-top font-mono font-normal"
                >
                  variant
                </th>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <p className="typo-body-l-regular text-subtle">
                      PageHeaderTitle·PageHeaderDescription 각각에 적용하는 타이포그래피 조합.
                      페이지 성격에 맞춰 선택한다.
                    </p>
                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                      &apos;default&apos; | &apos;compact&apos;
                    </span>
                  </div>
                </td>
                <td className="typo-caption-regular text-subtle px-4 py-3 font-mono">
                  &apos;default&apos;
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                      default
                    </span>
                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                      compact
                    </span>
                  </div>
                </td>
              </tr>
              <tr className="border-gray-subtle-2 bg-background border-b last:border-b-0">
                <th
                  scope="row"
                  className="typo-body-l-regular border-gray-subtle-2 text-primary border-r px-4 py-3 align-top font-mono font-normal"
                >
                  className
                </th>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <p className="typo-body-l-regular text-subtle">추가 클래스명으로 스타일 확장</p>
                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                      string
                    </span>
                  </div>
                </td>
                <td className="typo-caption-regular text-subtle px-4 py-3 font-mono">
                  &quot;&quot;
                </td>
                <td className="typo-body-l-regular text-subtle px-4 py-3">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </GuidePage>
);

export default PageHeaderGuidePage;
