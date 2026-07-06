import type { Metadata } from 'next';
import CopyChip from '@/components/copy-chip';
import GuidePage from '@/components/guide-page';
import tokens from '../../../../tokens.json';

export const metadata: Metadata = { title: '레이어 (Z-index)' };

// 각 z 토큰의 용도 큐레이션 — 값(순서)만으로는 의미가 안 드러나므로 어디에 쓰는지 함께 적는다.
const Z_USAGE: Record<string, string> = {
  base: '기본 흐름 — 별도 레이어 없음(0).',
  dropdown: '드롭다운·셀렉트 메뉴.',
  sticky: '일반 고정 요소 — 툴바·섹션 헤더 등.',
  header: '앱 상단 헤더(sticky 상단 바).',
  'drawer-backdrop': '드로어·모달 뒤 반투명 배경(백드롭).',
  drawer: '오프캔버스 사이드 드로어.',
  modal: '모달 다이얼로그.',
  popover: '팝오버 등 부유 콘텐츠.',
  toast: '토스트·스낵바 알림.',
  tooltip: '툴팁 — 거의 최상위.',
  skiplink: '스킵 링크 — 포커스 시 모든 것 위.',
};

// 겹침 시연용 큐레이션 subset(값 오름차순). 클래스명은 리터럴로 둬야 Tailwind 가 z-* 유틸을 생성한다.
const STACK_DEMO = [
  { z: 'z-dropdown', label: '드롭다운', value: tokens.z.dropdown, pos: 'top-0 left-0' },
  { z: 'z-sticky', label: '헤더(sticky)', value: tokens.z.sticky, pos: 'top-5 left-8' },
  { z: 'z-drawer', label: '드로어', value: tokens.z.drawer, pos: 'top-10 left-16' },
  { z: 'z-modal', label: '모달', value: tokens.z.modal, pos: 'top-15 left-24' },
  { z: 'z-toast', label: '토스트', value: tokens.z.toast, pos: 'top-20 left-32' },
];

// 레이어 (Z-index) — 쌓임 순서 토큰. 값이 아니라 '순서'가 의미.
const ZIndexGuidePage = () => (
  <GuidePage
    title="레이어 (Z-index)"
    description={
      <>
        겹치는 UI의 <strong>쌓임 순서</strong>를 정하는 토큰입니다. 값이 클수록 위에 옵니다.{' '}
        <code>z-[숫자]</code> 하드코딩 대신 용도 이름(<code>z-modal</code> 등)을 써서 레이어 충돌을
        막습니다. 헤더·드로어·FAB 는 아직 DOM 순서로 쌓이며(CD-002), 이 토큰은 스킵 링크·모달처럼
        명시적 레이어가 필요한 곳에 씁니다.
      </>
    }
  >
    {/* 겹침 시연 — 값이 큰 카드가 위에 그려진다 */}
    <section aria-labelledby="z-demo" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="z-demo" className="typo-heading-md">
          쌓임 순서 미리보기
        </h2>
        <p className="typo-body-sm text-foreground-muted">
          아래 카드는 값이 큰 순서대로 위에 겹칩니다 — 토큰 값이 곧 우선순위입니다.
        </p>
      </div>
      {/* 겹침을 보이려면 positioned 요소가 필요해 데모에 한해 absolute 를 쓴다(ST-005 예외). */}
      <div className="border-border bg-background relative h-52 overflow-hidden rounded-xl border">
        {STACK_DEMO.map((card) => (
          <div
            key={card.z}
            className={`${card.z} ${card.pos} border-border bg-surface shadow-2 absolute flex w-36 flex-col gap-1 rounded-lg border p-3`}
          >
            <span className="typo-label">{card.label}</span>
            <span className="typo-caption text-foreground-muted font-mono">
              {card.z} · {card.value}
            </span>
          </div>
        ))}
      </div>
    </section>

    {/* 전체 토큰 레퍼런스 */}
    <section aria-labelledby="z-tokens" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="z-tokens" className="typo-heading-md">
          레이어 토큰
        </h2>
        <p className="typo-body-sm text-foreground-muted">
          정수라 rem 변환하지 않습니다. 클래스 칩을 클릭하면 이름이 복사됩니다.
        </p>
      </div>
      <div className="border-border overflow-x-auto rounded-xl border">
        <table className="w-full text-left">
          <caption className="sr-only">z-* 레이어 토큰의 값과 용도</caption>
          <thead>
            <tr className="border-border bg-surface border-b">
              <th scope="col" className="typo-label px-4 py-3">
                클래스
              </th>
              <th scope="col" className="typo-label px-4 py-3">
                값
              </th>
              <th scope="col" className="typo-label px-4 py-3">
                용도
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(tokens.z).map(([name, value]) => (
              <tr key={name} className="border-border border-b last:border-b-0">
                <th scope="row" className="px-4 py-3 text-left font-normal">
                  <CopyChip value={`z-${name}`} />
                </th>
                <td className="typo-caption text-foreground-muted px-4 py-3 font-mono">{value}</td>
                <td className="typo-body-sm text-foreground-muted px-4 py-3">
                  {Z_USAGE[name] ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </GuidePage>
);

export default ZIndexGuidePage;
