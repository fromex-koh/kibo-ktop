// src/content/*.json 의 구조를 기술하는 콘텐츠 스키마 타입.
// JSON 은 열거형 문자열을 넓은 string 으로 추론하므로, 열거값(Status·Note)은 타입가드로 좁힌다. [ST-002]

import type { IconName } from '@/components/icon-registry';

// ── 퍼블리싱 진행 상태 ──
// 색/아이콘 매핑은 화면(컴포넌트)이 담당하고, 여기선 '값의 집합'만 정의한다.
export type Status = '대기중' | '진행중' | '수정요청' | '보완' | '완료' | '최종완료';

export const STATUS_VALUES: readonly Status[] = [
  '대기중',
  '진행중',
  '수정요청',
  '보완',
  '완료',
  '최종완료',
];

export const isStatus = (value: string): value is Status =>
  STATUS_VALUES.some((status) => status === value);

export type StructureNote = 'issue' | 'info';

export const isStructureNote = (value: string): value is StructureNote =>
  value === 'issue' || value === 'info';

// 자산이 단일 파일인지 디렉터리인지 — 컬럼 헤더에 파일/폴더 아이콘으로 표시한다.
export type AssetKind = 'file' | 'folder';

export const isAssetKind = (value: string): value is AssetKind =>
  value === 'file' || value === 'folder';

// ── 홈 화면 ──
export type HomeCard = {
  icon: IconName;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

export type HomeContent = {
  badge: string;
  projectInfo: {
    icon: IconName;
    title: string;
    repositoryLabel: string;
    author: string;
  };
  guide: HomeCard;
};

// ── 퍼블리싱 인덱스 ──
export type AssetVersion = {
  name: string;
  version: string;
  kind: AssetKind;
};

// 사이트 구조는 뎁스 제한 없는 트리다 — 자식이 있으면 branch(더 깊은 메뉴), 없으면 leaf(실제 화면 1건).
// leaf 만 screenId·status·version 을 가진다(화면이 있어야 상태를 매길 수 있으므로).
export type StructureLeaf = {
  label: string;
  screenId: string;
  status: Status;
  version: string;
  note?: StructureNote;
};

export type StructureBranch = {
  label: string;
  children: StructureNode[];
};

export type StructureNode = StructureLeaf | StructureBranch;

export const isStructureBranch = (node: StructureNode): node is StructureBranch =>
  'children' in node;

export type StructureGroup = {
  name: string;
  depth1: boolean;
  children: StructureNode[];
};

export type PublishingIndexContent = {
  assetVersions: AssetVersion[];
  structureGroups: StructureGroup[];
};
