'use client';

import {
  AlertTriangle,
  Building2,
  Check,
  CheckCheck,
  File,
  Folder,
  Info,
  Landmark,
  LayoutGrid,
  LayoutList,
  Sparkles,
} from 'lucide-react';
import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  AUDIENCE_VALUES,
  isStructureBranch,
  PUBLISHING_INDEX_CONTENT,
  STATUS_VALUES,
  type Audience,
  type Status,
  type StructureGroup,
  type StructureNode,
  type StructureNote,
} from '@/content';

// isCurrent(이번 릴리스에서 변경됨) 하이라이트는 자산 표·공통 레이아웃 표·화면 표가 모두 같은
// 방식(배경색 + 아이콘 + sr-only 텍스트)을 쓰므로, 버전 셀 하나를 공용 컴포넌트로 뺀다.
const VersionCell = ({ version, isCurrent }: { version: string; isCurrent: boolean }) => (
  <>
    <span className="inline-flex items-center gap-1">
      {isCurrent && <Sparkles aria-hidden="true" className="size-3 shrink-0" />}
      {version}
    </span>
    {isCurrent && <span className="sr-only"> (이번 릴리스에서 변경됨)</span>}
  </>
);

// 비고(이슈/정보) 표시도 공통 레이아웃 표·화면 표가 동일하게 쓴다.
const NoteCell = ({ note }: { note?: StructureNote }) => (
  <>
    {note === 'issue' && (
      <span className="inline-flex items-center">
        <AlertTriangle aria-hidden="true" className="text-danger size-4" />
        <span className="sr-only">이슈 있음</span>
      </span>
    )}
    {note === 'info' && (
      <span className="inline-flex items-center">
        <Info aria-hidden="true" className="text-info size-4" />
        <span className="sr-only">추가 정보 있음</span>
      </span>
    )}
  </>
);

// 퍼블리싱 진행 상태 인덱스 데모. 데이터는 src/content/publishing-index.json 단일 소스에서 온다.
// 이 컴포넌트는 '표현'(상태 색·아이콘 매핑, 뎁스별 rowSpan 계산, 레이아웃, 사용자 유형 필터)만 담당한다.

// 현재 HEAD 버전 — next.config.ts 가 주입(src/app/page.tsx 의 BUILD_VERSION과 같은 소스).
// 화면(leaf)의 수동 기입 버전이 이 값과 같으면 "이번 릴리스에서 반영됨"으로 하이라이트한다.
const BUILD_VERSION = process.env.NEXT_PUBLIC_BUILD_VERSION ?? 'dev';

// 상태별 색상 — 이 프로젝트에 이미 정의된 시맨틱 토큰(danger/warning/info/success)만 재사용.
// 색만으로 구분하지 않도록 상태명을 항상 함께 표기한다. [KWCAG 5.3.1]
const STATUS_STYLES: Record<Status, string> = {
  대기중: 'bg-gray-10 text-foreground-muted',
  진행중: 'bg-info-surface text-info',
  수정요청: 'bg-danger-surface text-danger',
  보완: 'bg-warning-surface text-warning',
  완료: 'bg-success-surface text-success',
  최종완료: 'bg-success-surface text-success',
};

const StatusTag = ({ status }: { status: Status }) => (
  <span
    className={`${STATUS_STYLES[status]} typo-caption inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold`}
  >
    {status === '최종완료' && <CheckCheck aria-hidden="true" className="size-3" />}
    {status === '완료' && <Check aria-hidden="true" className="size-3" />}
    {status}
  </span>
);

// 사이트 구조는 뎁스 제한 없는 트리라, 표에 그리려면 각 leaf(실제 화면)를 "뿌리부터 자신까지의
// 라벨 경로"로 펼쳐야 한다. 이 펼친 목록 + 뎁스별 rowSpan 계산이 표 렌더링의 핵심이다.
type FlatLeaf = {
  key: string;
  path: string[]; // index 0 = 1뎁스(그룹명) ... 마지막 = leaf 자신의 라벨
  screenId: string;
  status: Status;
  version: string;
  note?: StructureNote;
  audience?: Audience; // 상위에서 상속된 최종 사용자 유형. 없으면 공통(기업·기관 둘 다).
};

const collectLeaves = (group: StructureGroup): FlatLeaf[] => {
  // inherited = 상위(그룹·브랜치)에서 내려온 audience. 노드에 자체 audience 가 있으면 그것이 우선한다.
  const walk = (node: StructureNode, path: string[], inherited?: Audience): FlatLeaf[] => {
    // 라벨이 바로 위 뎁스와 같으면(예: '홈' 그룹의 유일한 화면도 라벨이 '홈') 실질적으로
    // 추가 뎁스가 아니므로 경로에 다시 넣지 않는다 — 컬럼마다 같은 텍스트가 반복되지 않는다.
    const last = path[path.length - 1];
    const nextPath = node.label === last ? path : [...path, node.label];
    if (isStructureBranch(node)) {
      const branchAudience = node.audience ?? inherited;
      // branch 자신도 독립된 화면(screen)일 수 있다 — 예: '(1) 고객정보활용동의' 자체가
      // 화면이면서 하위에 상세보기·전자서명을 더 갖는 경우. 있으면 그 행을 먼저 넣는다.
      // screen.label 이 있으면(예: '목록') 자기 화면을 한 뎁스 더 내려간 항목으로 취급해,
      // 하위 뎁스 빈 칸('-')이 그 라벨 한 칸으로 병합돼 보이게 한다.
      const screenPath = node.screen?.label ? [...nextPath, node.screen.label] : nextPath;
      const ownScreen: FlatLeaf[] = node.screen
        ? [
            {
              key: screenPath.join(' > '),
              path: screenPath,
              screenId: node.screen.screenId,
              status: node.screen.status,
              version: node.screen.version,
              note: node.screen.note,
              audience: node.screen.audience ?? branchAudience,
            },
          ]
        : [];
      return [
        ...ownScreen,
        ...node.children.flatMap((child) => walk(child, nextPath, branchAudience)),
      ];
    }
    return [
      {
        key: nextPath.join(' > '),
        path: nextPath,
        screenId: node.screenId,
        status: node.status,
        version: node.version,
        note: node.note,
        audience: node.audience ?? inherited,
      },
    ];
  };
  return group.children.flatMap((child) => walk(child, [group.name], group.audience));
};

// depth 컬럼에서 두 leaf 를 "같은 상위 아래" 로 볼지 판단하는 키. depth 가 leaf 의 실제 경로보다
// 깊으면(그 leaf 는 거기까지 내려가지 않으면) null — rowSpan 병합 대상이 아니다.
const pathKeyAt = (leaf: FlatLeaf, depth: number): string | null =>
  depth < leaf.path.length ? leaf.path.slice(0, depth + 1).join(' ') : null;

const spanAt = (leaves: FlatLeaf[], index: number, depth: number): number => {
  const key = pathKeyAt(leaves[index], depth);
  const rest = leaves.slice(index + 1);
  const breakOffset = rest.findIndex((leaf) => pathKeyAt(leaf, depth) !== key);
  return breakOffset === -1 ? rest.length + 1 : breakOffset + 1;
};

type DepthCell =
  | { kind: 'span'; label: string; rowSpan: number; colSpan: number }
  | { kind: 'continued' } // 이전 행의 rowSpan 이 덮고 있거나, 같은 행의 colSpan 에 흡수됨 — 렌더하지 않음
  | { kind: 'empty' }; // 이 leaf 는 여기까지 안 내려가지만, 같은 rowSpan 그룹의 다른 leaf 는 더 내려감 — 빈 칸을 명시적으로 렌더

// leaf 가 더 내려가지 않는 뎁스는 "-" 로 끊어 보이지 않도록, 마지막 실제 라벨 칸을 남은 뎁스
// 칸까지 colSpan 으로 이어붙인다 — 1뎁스→2뎁스→3뎁스가 시각적으로 하나로 연결되어 보인다.
// 단, "같은 rowSpan 그룹(같은 접두사) 안의 다른 leaf 가 더 깊이 내려가는" 경우엔(예: '(1)
// 고객정보활용동의' 자신도 화면이면서 하위에 상세보기·전자서명을 더 가짐) colSpan 으로 흡수하면
// 그 하위 leaf 들의 실제 칸이 사라지므로, 그룹 전체가 여기서 끝날 때만 colSpan 을 쓴다.
const buildDepthCells = (leaves: FlatLeaf[], maxDepth: number): DepthCell[][] =>
  leaves.map((leaf, i) => {
    const cells: DepthCell[] = Array.from({ length: maxDepth }, () => ({ kind: 'continued' }));
    let depth = 0;
    while (depth < maxDepth) {
      if (depth >= leaf.path.length) {
        cells[depth] = { kind: 'empty' };
        depth += 1;
        continue;
      }
      const key = pathKeyAt(leaf, depth);
      const prevKey = i > 0 ? pathKeyAt(leaves[i - 1], depth) : null;
      if (key === prevKey) {
        depth += 1; // 위 rowSpan 이 덮음 — 'continued' 유지
        continue;
      }
      const span = spanAt(leaves, i, depth);
      const noneDeeper = leaves.slice(i, i + span).every((l) => l.path.length <= depth + 1);
      const colSpan = noneDeeper ? maxDepth - depth : 1;
      cells[depth] = { kind: 'span', label: leaf.path[depth], rowSpan: span, colSpan };
      depth += colSpan; // colSpan 만큼 건너뛴다 — 그 칸들은 이미 이 셀에 흡수됐다(재처리 방지)
    }
    return cells;
  });

// 뎁스 배지 색상 — 시맨틱 토큰 brand(라이트·다크 모드에서 값이 바뀌지 않는 고정색)의
// 불투명도만 20/40/60/80% 로 단계적으로 올려 뎁스가 깊어질수록 진해지게 한다(새 색상
// 하드코딩 없음). text-foreground 하나로 통일해도 이 네 단계 전부 라이트·다크 모드 모두
// 4.5:1 이상 대비를 유지한다(실측 확인). 뎁스가 이 배열보다 깊어지면 마지막 스타일을 그대로 쓴다.
const DEPTH_BADGE_STYLES = [
  'bg-brand/20 text-foreground',
  'bg-brand/40 text-foreground',
  'bg-brand/60 text-foreground',
  'bg-brand/80 text-foreground',
];
const depthBadgeClass = (depth: number): string =>
  DEPTH_BADGE_STYLES[Math.min(depth, DEPTH_BADGE_STYLES.length - 1)];

// 사용자 유형 필터 — '전체' + 실제 audience 값(기업·기관). 화면(leaf)에 audience 가 없으면
// 공통이라 기업·기관 어느 탭에서나 보인다. '전체'는 프로젝트 전체 화면·진척률 기준.
type AudienceFilter = '전체' | Audience;
const AUDIENCE_FILTERS: readonly AudienceFilter[] = ['전체', ...AUDIENCE_VALUES];
// id 는 ASCII 로 — 한글 id 는 aria 연결·CSS 선택자에서 문제가 될 수 있어 슬러그로 매핑한다.
const FILTER_ID: Record<AudienceFilter, string> = { 전체: 'all', 기업: 'corp', 기관: 'org' };

const matchesAudience = (leaf: FlatLeaf, filter: AudienceFilter): boolean =>
  filter === '전체' || leaf.audience === undefined || leaf.audience === filter;

const FilterIcon = ({ filter }: { filter: AudienceFilter }) => {
  if (filter === '기업') return <Building2 aria-hidden="true" className="size-4 shrink-0" />;
  if (filter === '기관') return <Landmark aria-hidden="true" className="size-4 shrink-0" />;
  return <LayoutList aria-hidden="true" className="size-4 shrink-0" />;
};

const { assetVersions, commonLayouts, structureGroups } = PUBLISHING_INDEX_CONTENT;

// 전체 화면(트리를 펼친 leaf) — 필터·카운트는 이 목록을 기준으로 컴포넌트 안에서 파생한다.
const ALL_LEAVES = structureGroups.flatMap(collectLeaves);

const PublishingIndex = () => {
  const [filter, setFilter] = useState<AudienceFilter>('전체');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 선택된 사용자 유형에 맞는 화면만 남기고, 그 부분집합으로 뎁스 컬럼·rowSpan·카운트를 다시 계산한다.
  const leaves = useMemo(
    () => ALL_LEAVES.filter((leaf) => matchesAudience(leaf, filter)),
    [filter],
  );
  const maxDepth = useMemo(
    () => leaves.reduce((max, leaf) => Math.max(max, leaf.path.length), 0),
    [leaves],
  );
  const depthCells = useMemo(() => buildDepthCells(leaves, maxDepth), [leaves, maxDepth]);
  const depthHeaders = useMemo(
    () => Array.from({ length: maxDepth }, (_, depth) => `${depth + 1}뎁스`),
    [maxDepth],
  );

  const screenCount = leaves.length;
  // 작업 진척률 — '최종완료'된 화면 수 / (필터된) 전체 화면 수.
  const doneCount = useMemo(
    () => leaves.filter((leaf) => leaf.status === '최종완료').length,
    [leaves],
  );
  const progressPercent = screenCount === 0 ? 0 : Math.round((doneCount / screenCount) * 100);

  // 탭(tablist) 키보드 이동 — 좌우/상하 화살표로 이동+선택, Home/End 로 처음/끝. [KWCAG 6.1.1]
  const moveTab = (index: number) => {
    const count = AUDIENCE_FILTERS.length;
    const next = ((index % count) + count) % count;
    setFilter(AUDIENCE_FILTERS[next]);
    tabRefs.current[next]?.focus();
  };
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      moveTab(index + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveTab(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      moveTab(AUDIENCE_FILTERS.length - 1);
    }
  };

  return (
    <section aria-labelledby="section-publishing-index" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="section-publishing-index" className="typo-heading-sm">
          퍼블리싱 인덱스
        </h2>
        <p className="typo-body-sm text-foreground-muted">
          이 플랫폼의 화면별 퍼블리싱 진행 상태와 산출물 버전을 추적합니다. 버전은 git 태그를
          기준으로 자동 계산되며, 이번 릴리스에서 바뀐 항목은 강조 표시됩니다.
        </p>
      </div>

      {/* 상태 태그 범례 */}
      <ul aria-label="상태 범례" className="flex flex-wrap items-center gap-2">
        {STATUS_VALUES.map((status) => (
          <li key={status}>
            <StatusTag status={status} />
          </li>
        ))}
        <li className="text-danger typo-caption inline-flex items-center gap-1 font-semibold">
          <AlertTriangle aria-hidden="true" className="size-3.5" />
          이슈
        </li>
        <li className="text-info typo-caption inline-flex items-center gap-1 font-semibold">
          <Info aria-hidden="true" className="size-3.5" />
          정보
        </li>
      </ul>

      {/* 자산 버전 요약 */}
      <div className="bg-background border-border overflow-x-auto rounded-xl border">
        <table className="w-full text-left">
          <caption className="sr-only">자산별 버전 예시</caption>
          <thead>
            <tr className="bg-gray-10/25 border-border border-b">
              {assetVersions.map((a) => (
                <th key={a.name} scope="col" className="typo-label px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center gap-1.5">
                    {a.kind === 'folder' ? (
                      <Folder
                        aria-hidden="true"
                        className="text-foreground-muted size-3.5 shrink-0"
                      />
                    ) : (
                      <File
                        aria-hidden="true"
                        className="text-foreground-muted size-3.5 shrink-0"
                      />
                    )}
                    <span className="sr-only">{a.kind === 'folder' ? '폴더 ' : '파일 '}</span>
                    {a.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-background">
              {assetVersions.map((a) => (
                <td
                  key={a.name}
                  className={`typo-body-sm px-4 py-3 text-center font-mono ${
                    a.isCurrent
                      ? 'bg-brand/10 text-brand-foreground font-semibold'
                      : 'text-foreground-muted'
                  }`}
                >
                  <VersionCell version={a.version} isCurrent={a.isCurrent} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 공통 레이아웃 — 화면을 찍어내는 틀(내부 콘텐츠만 바뀜) 단위라 화면 표와 별도로 다룬다.
          위 자산 표와 구분되도록 간격을 더 둔다. */}
      <div className="bg-background border-border mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full text-left">
          <caption className="sr-only">공통 레이아웃 상태·버전</caption>
          <thead>
            <tr className="bg-gray-10/25 border-border border-b">
              <th scope="col" className="typo-label px-4 py-3">
                공통 레이아웃
              </th>
              <th scope="col" className="typo-label px-4 py-3">
                상태
              </th>
              <th scope="col" className="typo-label px-4 py-3">
                버전
              </th>
              <th scope="col" className="typo-label px-4 py-3">
                비고
              </th>
            </tr>
          </thead>
          <tbody>
            {commonLayouts.map((layout) => {
              const isCurrent = layout.version === BUILD_VERSION;
              return (
                <tr
                  key={layout.label}
                  className={`border-border border-b last:border-b-0 ${
                    isCurrent ? 'bg-brand/10' : 'bg-background'
                  }`}
                >
                  <th
                    scope="row"
                    className="typo-body-sm border-border border-r px-4 py-3 align-top font-normal"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LayoutGrid
                        aria-hidden="true"
                        className="text-foreground-muted size-4 shrink-0"
                      />
                      {layout.label}
                    </span>
                  </th>
                  <td className="px-4 py-3">
                    <StatusTag status={layout.status} />
                  </td>
                  <td
                    className={`typo-caption px-4 py-3 font-mono ${
                      isCurrent ? 'text-brand-foreground font-semibold' : 'text-foreground-muted'
                    }`}
                  >
                    <VersionCell version={layout.version} isCurrent={isCurrent} />
                  </td>
                  <td className="px-4 py-3">
                    <NoteCell note={layout.note} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 사용자 유형 필터 + 요약 — 아래 사이트 구조 표를 전체/기업/기관으로 걸러 보여준다.
          위 공통 레이아웃 표와 구분되도록 간격을 더 둔다. */}
      <div className="mt-4 flex flex-col gap-3">
        <div
          role="tablist"
          aria-label="사용자 유형별 화면"
          className="bg-gray-10/50 inline-flex w-fit gap-1 rounded-lg p-1"
        >
          {AUDIENCE_FILTERS.map((f, i) => {
            const selected = f === filter;
            return (
              <button
                key={f}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`audience-tab-${FILTER_ID[f]}`}
                aria-selected={selected}
                aria-controls="screen-structure-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setFilter(f)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={`typo-label focus-visible:ring-brand inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-md px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  selected ? 'bg-background text-foreground shadow-1' : 'text-foreground-muted'
                }`}
              >
                <FilterIcon filter={f} />
                {f}
              </button>
            );
          })}
        </div>

        {/* 총 화면 본수·작업 진척률 — 선택된 필터 기준으로 갱신되고, 탭 전환을 스크린리더에 알린다.
            진척률은 '최종완료' 화면 비율이라 상태값이 바뀔 때마다 자동으로 갱신된다. */}
        <p aria-live="polite" className="typo-body-sm text-foreground-muted">
          {filter} 화면 본수: <span className="text-foreground font-semibold">{screenCount}개</span>
          {filter === '전체' ? ' (공통 레이아웃 제외)' : ''} · 작업 진척률:{' '}
          <span className="text-foreground font-semibold">{progressPercent}%</span> (최종완료{' '}
          {doneCount}/{screenCount})
        </p>
      </div>

      {/* 사이트 구조 정보 (선택된 사용자 유형 탭의 패널) */}
      <div
        id="screen-structure-panel"
        role="tabpanel"
        aria-labelledby={`audience-tab-${FILTER_ID[filter]}`}
        className="bg-background border-border overflow-x-auto rounded-xl border"
      >
        <table className="w-full text-left">
          <caption className="sr-only">사이트 구조별 화면 ID·상태·버전 예시</caption>
          <thead>
            <tr className="bg-gray-10/25 border-border border-b">
              {depthHeaders.map((header) => (
                <th key={header} scope="col" className="typo-label px-4 py-3">
                  {header}
                </th>
              ))}
              <th scope="col" className="typo-label px-4 py-3">
                화면 ID
              </th>
              <th scope="col" className="typo-label px-4 py-3">
                상태
              </th>
              <th scope="col" className="typo-label px-4 py-3">
                버전
              </th>
              <th scope="col" className="typo-label px-4 py-3">
                비고
              </th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leaf, i) => {
              const isCurrent = leaf.version === BUILD_VERSION;
              return (
                <tr
                  key={leaf.key}
                  className={`border-border border-b last:border-b-0 ${
                    isCurrent ? 'bg-brand/10' : 'bg-background'
                  }`}
                >
                  {depthCells[i].map((cell, depth) => {
                    if (cell.kind === 'continued') return null;
                    if (cell.kind === 'empty') {
                      return (
                        <th
                          key={depth}
                          scope="row"
                          className="typo-caption text-foreground-muted border-border border-r px-4 py-3 align-top font-normal"
                        >
                          <span aria-hidden="true">-</span>
                          <span className="sr-only">해당 없음</span>
                        </th>
                      );
                    }
                    return (
                      <th
                        key={depth}
                        scope="row"
                        rowSpan={cell.rowSpan}
                        colSpan={cell.colSpan}
                        className="typo-body-sm border-border border-r px-4 py-3 align-top font-normal"
                      >
                        <span className="inline-flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={`${depthBadgeClass(depth)} flex size-5 shrink-0 items-center justify-center rounded font-mono text-xs font-bold`}
                          >
                            {depth + 1}
                          </span>
                          <span className="sr-only">{depth + 1}뎁스 </span>
                          {cell.label}
                        </span>
                      </th>
                    );
                  })}
                  <td className="typo-caption text-foreground-muted px-4 py-3 font-mono">
                    {leaf.screenId}
                  </td>
                  <td className="px-4 py-3">
                    <StatusTag status={leaf.status} />
                  </td>
                  <td
                    className={`typo-caption px-4 py-3 font-mono ${
                      isCurrent ? 'text-brand-foreground font-semibold' : 'text-foreground-muted'
                    }`}
                  >
                    <VersionCell version={leaf.version} isCurrent={isCurrent} />
                  </td>
                  <td className="px-4 py-3">
                    <NoteCell note={leaf.note} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PublishingIndex;
