import type { Metadata } from 'next';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronUp,
  Download,
  GitBranch,
  Home,
  Info,
  Lock,
  Upload,
  X,
} from 'lucide-react';
import CopyChip from '@/components/guide/copy-chip';
import GuidePage from '@/components/guide/guide-page';
import { GUIDE_NAV_SECTIONS } from '@/constants/guide-nav';
import tokens from '@tokens';

export const metadata: Metadata = { title: '아이콘' };

// package.json 의 lucide-react 버전과 라이선스. 패키지를 올리면 함께 갱신한다.
const LUCIDE_VERSION = '1.23.0';
const LUCIDE_REPO_URL = 'https://github.com/lucide-icons/lucide';
// 정확한 아이콘 총 개수는 릴리스마다 계속 늘어나(deprecated 별칭 포함 약 2,000개), 대략치로 안내.
const LUCIDE_ICON_COUNT_LABEL = '2,000개 이상';

// 아이콘 크기 — size.icon-* 토큰(size-icon-* 유틸)만 사용한다. 클래스명은 Tailwind 정적 분석을
// 위해 리터럴로 고정 — 템플릿 문자열(`size-${key}`)로 조합하면 스캐너가 인식하지 못해 스타일이
// 안 나온다(z-index 가이드와 같은 이유). 새 크기를 추가하면 tokens.json 의 size.icon-* 와 함께 갱신.
const ICON_SIZES = [
  { key: 'icon-xs', class: 'size-icon-xs' },
  { key: 'icon-sm', class: 'size-icon-sm' },
  { key: 'icon-md', class: 'size-icon-md' },
  { key: 'icon-lg', class: 'size-icon-lg' },
  { key: 'icon-xl', class: 'size-icon-xl' },
  { key: 'icon-2xl', class: 'size-icon-2xl' },
] as const;

// 참고 이미지의 두 톤(중립 회색 배지·짙은 배지)을 재현한다. 페이지 라이트/다크 모드와 무관하게
// 항상 같은 색으로 보여야 크기 비교가 정확해서(코드블럭이 항상 어두운 배경을 쓰는 것과 같은 이유),
// 테마에 따라 자동 반전되는 시맨틱 토큰 대신 고정 raw 값을 쓴다(PB-12 — 토큰 뷰어 예외).
// glyphScale = 배지(원) 대비 아이콘 크기. lucide 아이콘마다 자체 뷰박스 안에서 차지하는 비율이
// 달라(X 는 획이 굵고 뷰박스의 ~50%만 채우지만 시각적 무게가 커 커 보이고, Info 는 얇은 원이라
// 가벼워 보임) 같은 크기로 두면 X 가 더 커 보인다. 그래서 X 는 더 줄여 두 아이콘의 체감 크기를 맞춘다.
const SOLID_SWATCHES = [
  { label: '중립', Icon: X, bg: 'var(--raw-gray-400)', glyphScale: 0.55 },
  { label: '강조', Icon: Info, bg: 'var(--raw-common-black)', glyphScale: 0.85 },
] as const;

// 아이콘 큐레이션 — 실제 화면에서 자주 쓰는 lucide-react 아이콘([NA-008] 표준 단일 아이콘
// 라이브러리). 새 아이콘이 필요하면 여기 추가한다.
const CURATED_ICONS = [
  { name: 'Home', Icon: Home },
  { name: 'X', Icon: X },
  { name: 'ArrowRight', Icon: ArrowRight },
  { name: 'ArrowLeft', Icon: ArrowLeft },
  { name: 'Download', Icon: Download },
  { name: 'Upload', Icon: Upload },
  { name: 'ChevronLeft', Icon: ChevronLeft },
  { name: 'ChevronRight', Icon: ChevronRight },
  { name: 'ChevronUp', Icon: ChevronUp },
  { name: 'ChevronDown', Icon: ChevronDown },
  { name: 'ChevronsRight', Icon: ChevronsRight },
  { name: 'Check', Icon: Check },
  { name: 'Info', Icon: Info },
  { name: 'Lock', Icon: Lock },
  { name: 'Calendar', Icon: Calendar },
] as const;

const IconGuidePage = () => (
  <GuidePage
    title="아이콘 (Icon)"
    category={GUIDE_NAV_SECTIONS[1].title}
    description="lucide-react 아이콘 중 실제 화면에서 쓰는 것들을 큐레이션했습니다."
  >
    <section aria-labelledby="icon-library" className="flex flex-col gap-4">
      <div>
        <h2 id="icon-library" className="typo-heading-h4-bold">
          라이브러리
        </h2>
        <p className="typo-body-l-regular text-subtle">
          아이콘은 이 프로젝트의 표준 라이브러리인 lucide-react 하나만 사용합니다([NA-008]).
        </p>
      </div>
      <div className="border-gray-subtle-2 flex flex-col gap-4 rounded-md border p-4">
        <dl className="typo-body-l-regular flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <dt className="text-subtle w-20 shrink-0">패키지</dt>
            <dd className="font-mono">lucide-react</dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className="text-subtle w-20 shrink-0">버전</dt>
            <dd className="font-mono">v{LUCIDE_VERSION}</dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className="text-subtle w-20 shrink-0">라이선스</dt>
            <dd>ISC — 상업적 사용 가능(무료)</dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className="text-subtle w-20 shrink-0">아이콘 수</dt>
            <dd>{LUCIDE_ICON_COUNT_LABEL}</dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className="text-subtle w-20 shrink-0">저장소</dt>
            <dd>
              <a
                href={LUCIDE_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary focus-visible:ring-focus focus-visible:ring-offset-background inline-flex items-center gap-1.5 rounded font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <GitBranch aria-hidden="true" className="size-4 shrink-0" />
                lucide-icons/lucide
                <span className="sr-only"> (새 창에서 열림)</span>
              </a>
            </dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-2">
          <CopyChip value="yarn add lucide-react" label="설치" />
          <CopyChip value="import { Home } from 'lucide-react';" label="사용법" />
        </div>
      </div>
    </section>

    <section aria-labelledby="icon-size" className="flex flex-col gap-4">
      <div>
        <h2 id="icon-size" className="typo-heading-h4-bold">
          크기
        </h2>
        <p className="typo-body-l-regular text-subtle">
          size-icon-* 유틸로 쓰는 아이콘 크기 토큰입니다.
        </p>
      </div>
      <div className="bg-background border-gray-subtle-2 overflow-x-auto rounded-md border">
        <table className="w-full text-left">
          <caption className="sr-only">아이콘 크기 토큰과 클래스</caption>
          <thead>
            <tr className="border-gray-subtle-2 border-b bg-gray-100/25">
              <th scope="col" className="typo-body-l-medium px-4 py-3">
                미리보기
              </th>
              <th scope="col" className="typo-body-l-medium px-4 py-3">
                클래스 (클릭 복사)
              </th>
              <th scope="col" className="typo-body-l-medium px-4 py-3">
                값
              </th>
            </tr>
          </thead>
          <tbody>
            {ICON_SIZES.map(({ key, class: sizeClass }) => (
              <tr key={key} className="border-gray-subtle-2 bg-background border-b last:border-b-0">
                <td className="px-4 py-3">
                  {/* 배지를 고정 흰 배경 위에 둔다 — '강조' 배지 색(raw-common-black)이 다크
                      페이지 배경과 같아 배지 원이 안 보이면 X(회색)만 채워진 원으로 보여 크기가
                      어긋나 보인다. 밝은 바탕에서 두 배지 모두 같은 크기의 채워진 원으로 보인다
                      (참고 이미지 재현 · PB-12 토큰 뷰어 예외). */}
                  <div
                    className="inline-flex items-center gap-3 rounded-md p-2"
                    style={{ backgroundColor: 'var(--raw-common-white)' }}
                  >
                    {SOLID_SWATCHES.map(({ label, Icon, bg, glyphScale }) => {
                      const glyphPx = tokens.size[key] * glyphScale;
                      return (
                        <span
                          key={label}
                          className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full`}
                          style={{ backgroundColor: bg }}
                        >
                          <Icon
                            aria-hidden="true"
                            style={{
                              width: glyphPx,
                              height: glyphPx,
                              color: 'var(--raw-common-white)',
                            }}
                          />
                        </span>
                      );
                    })}
                  </div>
                </td>
                <th scope="row" className="px-4 py-3 text-left font-normal">
                  <CopyChip value={sizeClass} />
                </th>
                <td className="typo-caption-regular text-subtle px-4 py-3 font-mono">
                  {tokens.size[key]}px
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="icon-list" className="flex flex-col gap-6">
      <div>
        <h2 id="icon-list" className="typo-heading-h4-bold">
          아이콘 목록
        </h2>
        <p className="typo-body-l-regular text-subtle">
          {CURATED_ICONS.length}개 아이콘 — 칩을 클릭하면 컴포넌트 이름이 복사됩니다. lucide-react
          는 획(Outline) 스타일 단일 세트라, 배지·알림처럼 강조가 필요한 곳엔 아이콘을 원형 배경에
          채운 Solid 스타일을 조합해 씁니다.
        </p>
      </div>

      {/* Outline·Solid 는 같은 "슬롯 크기"(size-icon-xl·32px)를 공유한다.
          - Outline: span 없이 아이콘만 슬롯 크기로 둔다.
          - Solid: span(배지)이 슬롯 크기를 차지하고, 그 안의 아이콘은 여백을 두고 작게(size-icon-md)
            넣는다 — 배지 총 크기 = Outline 아이콘 크기라, 둘의 겉넓이가 같아 보인다. */}
      <div className="flex flex-col gap-3">
        <h3 className="typo-body-l-medium text-foreground">Outline</h3>
        <ul className="wide:grid-cols-4 pc:grid-cols-6 grid grid-cols-3 gap-3">
          {CURATED_ICONS.map(({ name, Icon }) => (
            <li
              key={name}
              className="border-gray-subtle-2 flex flex-col items-center gap-3 rounded-md border p-4"
            >
              <Icon aria-hidden="true" className="size-icon-xl text-bolder" />
              <CopyChip value={name} />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="typo-body-l-medium text-foreground">Solid</h3>
        <ul className="wide:grid-cols-4 pc:grid-cols-6 grid grid-cols-3 gap-3">
          {CURATED_ICONS.map(({ name, Icon }) => (
            <li
              key={name}
              className="border-gray-subtle-2 flex flex-col items-center gap-3 rounded-md border p-4"
            >
              <span className="bg-info-surface text-info-text size-icon-xl flex items-center justify-center rounded-full">
                <Icon aria-hidden="true" className="size-icon-md" />
              </span>
              <CopyChip value={name} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  </GuidePage>
);

export default IconGuidePage;
