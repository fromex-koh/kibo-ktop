// 콘텐츠 JSON 을 '검증된 타입 확정 객체'로 만들어 export 하는 단일 관문.
// 컴포넌트는 원본 .json 을 직접 import 하지 않고 반드시 여기서 가져온다(검증 우회 방지).
// 열거형(status·icon·note)이 어긋나면 로드/빌드 시점에 에러를 던져 화면에 나가기 전에 차단한다.
// (tokens.json 을 build-tokens 가 검증해 빌드를 실패시키는 것과 같은 철학)

import { isIconName, type IconName } from '@/components/icon-registry';
import homeJson from './home.json';
import publishingIndexJson from './publishing-index.json';
import {
  isAssetKind,
  isStatus,
  isStructureNote,
  type AssetKind,
  type HomeContent,
  type PublishingIndexContent,
  type StructureNode,
  type StructureNote,
} from './types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

// JSON 의 icon 문자열을 IconName 으로 좁힌다. 미등록이면 즉시 실패. [MD-004]
const assertIconName = (value: string, path: string): IconName => {
  if (!isIconName(value)) {
    throw new Error(`[content] ${path}: "${value}" 은(는) 등록된 아이콘 이름이 아닙니다.`);
  }
  return value;
};

const parseAssetKind = (value: string, path: string): AssetKind => {
  if (!isAssetKind(value)) {
    throw new Error(`[content] ${path}: kind "${value}" 은(는) file|folder 여야 합니다.`);
  }
  return value;
};

// note 는 JSON 에 있을 수도(문자열) 없을 수도(undefined) 있어 unknown 으로 받아 안전하게 좁힌다.
const parseNote = (value: unknown, path: string): StructureNote | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string' || !isStructureNote(value)) {
    throw new Error(
      `[content] ${path}: "${String(value)}" 은(는) 유효한 note 값이 아닙니다(issue|info).`,
    );
  }
  return value;
};

// 사이트 구조는 뎁스 제한 없는 트리 — children 이 있으면 branch(재귀), 없으면 leaf(실제 화면 1건)로 검증한다.
const parseStructureNode = (value: unknown, path: string): StructureNode => {
  if (!isRecord(value) || typeof value.label !== 'string') {
    throw new Error(`[content] ${path}: label 이 있는 객체가 아닙니다.`);
  }
  const label = value.label;
  const where = `${path} > ${label}`;

  if ('children' in value) {
    if (!Array.isArray(value.children)) {
      throw new Error(`[content] ${where}: children 은 배열이어야 합니다.`);
    }
    const children = value.children.map((child, i) => parseStructureNode(child, `${where}[${i}]`));
    return { label, children };
  }

  if (typeof value.screenId !== 'string') {
    throw new Error(`[content] ${where}: screenId 가 필요합니다.`);
  }
  if (typeof value.status !== 'string' || !isStatus(value.status)) {
    throw new Error(
      `[content] ${where}: status "${String(value.status)}" 이(가) 유효하지 않습니다.`,
    );
  }
  if (typeof value.version !== 'string') {
    throw new Error(`[content] ${where}: version 이 필요합니다.`);
  }
  const note = parseNote(value.note, `${where} > note`);
  return {
    label,
    screenId: value.screenId,
    status: value.status,
    version: value.version,
    ...(note !== undefined ? { note } : {}),
  };
};

const parseHomeContent = (raw: typeof homeJson): HomeContent => ({
  badge: raw.badge,
  projectInfo: {
    icon: assertIconName(raw.projectInfo.icon, 'home.json > projectInfo.icon'),
    title: raw.projectInfo.title,
    author: raw.projectInfo.author,
  },
  guide: {
    icon: assertIconName(raw.guide.icon, 'home.json > guide.icon'),
    title: raw.guide.title,
    description: raw.guide.description,
    href: raw.guide.href,
    linkLabel: raw.guide.linkLabel,
  },
});

const parsePublishingIndexContent = (raw: typeof publishingIndexJson): PublishingIndexContent => ({
  assetVersions: raw.assetVersions.map((asset) => ({
    name: asset.name,
    version: asset.version,
    kind: parseAssetKind(
      asset.kind,
      `publishing-index.json > assetVersions > ${asset.name} > kind`,
    ),
  })),
  structureGroups: raw.structureGroups.map((group) => ({
    name: group.name,
    depth1: group.depth1,
    children: group.children.map((child, i) =>
      parseStructureNode(child, `publishing-index.json > ${group.name}[${i}]`),
    ),
  })),
});

export const HOME_CONTENT: HomeContent = parseHomeContent(homeJson);

export const PUBLISHING_INDEX_CONTENT: PublishingIndexContent =
  parsePublishingIndexContent(publishingIndexJson);

export { isStructureBranch, STATUS_VALUES } from './types';
export type { Status, StructureGroup, StructureNode, StructureNote } from './types';
