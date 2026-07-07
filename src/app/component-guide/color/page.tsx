import { Fragment } from 'react';
import type { Metadata } from 'next';
import GuidePage from '@/components/guide/guide-page';
import tokens from '@tokens';

export const metadata: Metadata = { title: 'Primitive' };

// 저장은 hex(생성기 규격)지만 Figma 원본이 rgba 라, 큐레이션 화면엔 rgba 문자열로 보여준다(값은 동일).
const hexToRgba = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 1)`;
};

// 휴가 속한 그룹(brand/system) 라벨 — Figma 의 "brand / blue" 표기를 재현한다. 미정의면 휴명으로 대체.
const groupOf = (hue: string): string =>
  Object.entries(tokens.primitiveGroups).find(([, hues]) => hues.includes(hue))?.[0] ?? hue;

// 색상 — Tier 1 프리미티브 팔레트. Figma(Mode 1) 의 "01 Primitive" 정의를 이름/값 표로 그대로 옮긴다.
const ColorGuidePage = () => (
  <GuidePage
    title="01 Primitive"
    description="Figma(Mode 1) 의 프리미티브 팔레트입니다. brand·system 그룹의 8색을 50~900 스케일로 정의하고, 스케일 밖 앵커인 common(white·black)을 함께 둡니다. 값은 Figma 원본대로 rgba 로 표기합니다(저장은 hex). 시맨틱 토큰(background·brand·danger 등)이 이 값을 참조하므로, 직접 사용은 지양하고 시맨틱 토큰을 우선하세요."
  >
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">프리미티브 색상 팔레트 — 이름과 rgba 값</caption>
        <thead>
          <tr className="border-gray-subtle-2 border-b">
            <th scope="col" className="typo-label text-subtle px-3 py-3 whitespace-nowrap">
              이름
            </th>
            <th scope="col" className="typo-label text-subtle px-3 py-3 whitespace-nowrap">
              값
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tokens.primitive).map(([hue, steps]) => (
            <Fragment key={hue}>
              <tr className="bg-surface border-gray-subtle-2 border-b">
                <th
                  scope="colgroup"
                  colSpan={2}
                  className="typo-label px-3 py-3 text-left font-normal"
                >
                  <span className="text-subtle">{groupOf(hue)} / </span>
                  <span className="text-bolder font-semibold">{hue}</span>
                </th>
              </tr>
              {Object.entries(steps).map(([step, hex]) => (
                <tr
                  key={step}
                  className="border-gray-subtle-2 hover:bg-surface border-b transition-colors"
                >
                  <th
                    scope="row"
                    className="typo-caption text-bolder w-1/3 px-3 py-3 font-mono font-normal"
                  >
                    {step}
                  </th>
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="border-gray-subtle-2 size-icon-md shrink-0 rounded border"
                        style={{ background: `var(--raw-${hue}-${step})` }}
                      />
                      <span className="typo-caption text-subtle font-mono whitespace-nowrap">
                        {hexToRgba(hex)}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </Fragment>
          ))}
          <Fragment key="common">
            <tr className="bg-surface border-gray-subtle-2 border-b">
              <th
                scope="colgroup"
                colSpan={2}
                className="typo-label text-bolder px-3 py-3 text-left font-semibold"
              >
                common
              </th>
            </tr>
            {Object.entries(tokens.common).map(([name, hex]) => (
              <tr
                key={name}
                className="border-gray-subtle-2 hover:bg-surface border-b transition-colors"
              >
                <th
                  scope="row"
                  className="typo-caption text-bolder w-1/3 px-3 py-3 font-mono font-normal"
                >
                  {name}
                </th>
                <td className="px-3 py-3">
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="border-gray-subtle-2 size-icon-md shrink-0 rounded border"
                      style={{ background: `var(--raw-common-${name})` }}
                    />
                    <span className="typo-caption text-subtle font-mono whitespace-nowrap">
                      {hexToRgba(hex)}
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </Fragment>
        </tbody>
      </table>
    </div>
  </GuidePage>
);

export default ColorGuidePage;
