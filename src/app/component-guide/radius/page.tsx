import type { Metadata } from 'next';
import CopyChip from '@/components/guide/copy-chip';
import GuidePage from '@/components/guide/guide-page';
import tokens from '@tokens';

export const metadata: Metadata = { title: '라운드' };

// 라운드 — Figma '05 Radius' 정의를 반경 토큰(--ds-radius-*)으로 반영. rounded-* 유틸로 쓰며
// 정의된 키(xs·sm·md·lg·xl·2xl·full)만 사용한다. '클래스' 칩을 클릭하면 이름이 복사된다.
const RadiusGuidePage = () => (
  <GuidePage title="라운드 (Radius)" description="rounded-* 유틸로 쓰는 모서리 반경 토큰입니다.">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-gray-subtle-2 border-b">
            <th scope="col" className="typo-body-l-medium text-subtle px-3 py-3 whitespace-nowrap">
              미리보기
            </th>
            <th scope="col" className="typo-body-l-medium text-subtle px-3 py-3 whitespace-nowrap">
              클래스 (클릭 복사)
            </th>
            <th scope="col" className="typo-body-l-medium text-subtle px-3 py-3 whitespace-nowrap">
              값
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tokens.radius).map(([k, px]) => (
            <tr
              key={k}
              className="border-gray-subtle-2 hover:bg-surface border-b transition-colors"
            >
              <td className="px-3 py-3">
                <span
                  aria-hidden="true"
                  className="bg-surface border-gray-subtle-2 block size-16 border"
                  style={{ borderRadius: `var(--ds-radius-${k})` }}
                />
              </td>
              <th scope="row" className="px-3 py-3 text-left font-normal">
                <CopyChip value={`rounded-${k}`} />
              </th>
              <td className="typo-caption-regular text-subtle px-3 py-3 font-mono whitespace-nowrap">
                {typeof px === 'number' ? `${px}px` : px}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </GuidePage>
);

export default RadiusGuidePage;
