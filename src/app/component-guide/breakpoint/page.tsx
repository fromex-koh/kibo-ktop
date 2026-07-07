import type { Metadata } from 'next';
import ActiveBreakpointTag from '@/components/guide/active-breakpoint-tag';
import GuidePage from '@/components/guide/guide-page';
import tokens from '@tokens';

export const metadata: Metadata = { title: '브레이크포인트' };

// 브레이크포인트 — 모바일 퍼스트 3단계(기본 → wide: → pc:). 정의된 프리픽스만 사용.
const BreakpointGuidePage = () => (
  <GuidePage
    title="브레이크포인트 (Breakpoint)"
    description={
      <>
        모바일 퍼스트 — 프리픽스 없는 유틸이 기본(모바일)이고, 상위 구간만 <code>wide:</code>/
        <code>pc:</code> 로 덮어씁니다. 기본 <code>sm:</code>/<code>md:</code>/<code>lg:</code> 는
        비활성화되어 있고, 콘텐츠 영역은 <code>max-w-content</code>({tokens.container.content}px) 로
        제한합니다.
      </>
    }
  >
    <p className="typo-caption-regular text-subtle">
      구간명은 특정 기기 하나를 뜻하지 않는다. <code>wide</code> 는 태블릿(세로·가로)과 노트북이
      함께 걸치는 폭 구간이라 기기 중립적으로 이름 붙였다(단, 12.9형급 대형 태블릿을 가로로 눕히면{' '}
      <code>pc</code> 구간으로 넘어갈 수 있다).
    </p>
    <div className="border-gray-subtle-2 overflow-x-auto rounded-xl border">
      <table className="w-full text-left">
        <caption className="sr-only">브레이크포인트 구간과 프리픽스, 포함 기기</caption>
        <thead>
          <tr className="border-gray-subtle-2 bg-surface border-b">
            <th scope="col" className="typo-body-l-medium px-4 py-3">
              구간
            </th>
            <th scope="col" className="typo-body-l-medium px-4 py-3">
              범위
            </th>
            <th scope="col" className="typo-body-l-medium px-4 py-3">
              프리픽스
            </th>
            <th scope="col" className="typo-body-l-medium px-4 py-3">
              포함 기기
            </th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            // 구간명은 기기 하나를 가리키지 않으므로(예: wide = 태블릿·노트북 공유 폭),
            // 실제 포함 기기는 여기서 별도 안내한다. 새 브레이크포인트 키 추가 시 함께 갱신.
            const DEVICE_HINT: Record<string, string> = {
              모바일: '폰',
              wide: '태블릿·노트북',
              pc: '데스크톱',
            };
            const entries = Object.entries(tokens.breakpoint).sort((a, b) => a[1] - b[1]);
            const rows = [
              {
                key: 'mobile',
                name: '모바일 (기본)',
                range: `0 ~ ${entries[0][1] - 1}px`,
                prefix: '없음',
                device: DEVICE_HINT['모바일'],
              },
              ...entries.map(([k, v], i) => ({
                key: k,
                name: k,
                range: i + 1 < entries.length ? `${v} ~ ${entries[i + 1][1] - 1}px` : `${v}px ~`,
                prefix: `${k}:`,
                device: DEVICE_HINT[k] ?? '—',
              })),
            ];
            return rows.map((r) => (
              <tr key={r.name} className="border-gray-subtle-2 border-b last:border-b-0">
                <td className="typo-body-l-regular px-4 py-3">
                  <span className="inline-flex items-center gap-2">
                    {r.name}
                    <ActiveBreakpointTag targetKey={r.key} />
                  </span>
                </td>
                <td className="typo-caption-regular text-subtle px-4 py-3 font-mono">{r.range}</td>
                <td className="typo-caption-regular text-subtle px-4 py-3 font-mono">{r.prefix}</td>
                <td className="typo-body-l-regular text-subtle px-4 py-3">{r.device}</td>
              </tr>
            ));
          })()}
        </tbody>
      </table>
    </div>
  </GuidePage>
);

export default BreakpointGuidePage;
