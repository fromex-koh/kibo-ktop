// 콘텐츠 JSON 을 '검증된 타입 확정 객체'로 만들어 export 하는 단일 관문.
// 컴포넌트는 원본 .json 을 직접 import 하지 않고 반드시 여기서 가져온다(검증 우회 방지).
// 열거형(status·icon·note)이 어긋나면 로드/빌드 시점에 에러를 던져 화면에 나가기 전에 차단한다.
// (tokens.json 을 build-tokens 가 검증해 빌드를 실패시키는 것과 같은 철학)

import { isIconName, type IconName } from '@/components/icon-registry';
import assetVersionsGenerated from './asset-versions.generated.json';
import homeJson from './home.json';
import publishingIndexJson from './publishing-index.json';
import {
  isAssetKind,
  isUserType,
  isStatus,
  isStructureNote,
  type AssetKind,
  type AssetVersion,
  type UserType,
  type CommonLayout,
  type HomeContent,
  type PublishingIndexContent,
  type ScreenInfo,
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

// userType 는 그룹·브랜치·화면 어디에나 올 수 있는 선택 값 — 한 곳에서 검증한다.
const parseUserType = (value: unknown, where: string): UserType | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string' || !isUserType(value)) {
    throw new Error(
      `[content] ${where}: userType "${String(value)}" 은(는) 기업|기관 이어야 합니다.`,
    );
  }
  return value;
};

// leaf 든, branch 의 screen 필드든, '화면 1건'의 형태는 동일하다 — 한 곳에서 검증한다.
const parseScreenInfo = (value: Record<string, unknown>, where: string): ScreenInfo => {
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
  const userType = parseUserType(value.userType, `${where} > userType`);
  return {
    screenId: value.screenId,
    status: value.status,
    version: value.version,
    ...(note !== undefined ? { note } : {}),
    ...(userType !== undefined ? { userType } : {}),
  };
};

// 사이트 구조는 뎁스 제한 없는 트리 — children 이 있으면 branch(재귀), 없으면 leaf(실제 화면 1건)로 검증한다.
// branch 에 screen 이 있으면 그 branch 자신도 독립된 화면이다(예: '(1) 고객정보활용동의').
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
    const userType = parseUserType(value.userType, `${where} > userType`);
    if (value.screen !== undefined) {
      if (!isRecord(value.screen)) {
        throw new Error(`[content] ${where} > screen: 객체여야 합니다.`);
      }
      const screenBase = parseScreenInfo(value.screen, `${where} > screen`);
      // label 은 하이브리드 branch 의 자기 화면을 하위 뎁스 칸에 표시할 이름(예: '목록').
      const screenLabel = value.screen.label;
      if (screenLabel !== undefined && typeof screenLabel !== 'string') {
        throw new Error(`[content] ${where} > screen > label: 문자열이어야 합니다.`);
      }
      const screen: ScreenInfo =
        screenLabel !== undefined ? { ...screenBase, label: screenLabel } : screenBase;
      return { label, children, screen, ...(userType !== undefined ? { userType } : {}) };
    }
    return { label, children, ...(userType !== undefined ? { userType } : {}) };
  }

  return { label, ...parseScreenInfo(value, where) };
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

// version·isCurrent 는 publishing-index.json 이 아니라 자동 생성된
// asset-versions.generated.json(scripts/compute-asset-versions.mjs)에서 가져온다. [MD-003]
const findGeneratedVersion = (name: string): { version: string; isCurrent: boolean } => {
  const found = assetVersionsGenerated.find((a) => a.name === name);
  return { version: found?.version ?? '-', isCurrent: found?.isCurrent ?? false };
};

const parseCommonLayout = (
  raw: (typeof publishingIndexJson)['commonLayouts'][number],
): CommonLayout => {
  const where = `publishing-index.json > commonLayouts > ${raw.label}`;
  if (!isStatus(raw.status)) {
    throw new Error(`[content] ${where}: status "${raw.status}" 이(가) 유효하지 않습니다.`);
  }
  const note = parseNote('note' in raw ? raw.note : undefined, `${where} > note`);
  return {
    label: raw.label,
    status: raw.status,
    version: raw.version,
    ...(note !== undefined ? { note } : {}),
  };
};

const parsePublishingIndexContent = (raw: typeof publishingIndexJson): PublishingIndexContent => ({
  assetVersions: raw.assetVersions.map((asset): AssetVersion => {
    const { version, isCurrent } = findGeneratedVersion(asset.name);
    return {
      name: asset.name,
      kind: parseAssetKind(
        asset.kind,
        `publishing-index.json > assetVersions > ${asset.name} > kind`,
      ),
      version,
      isCurrent,
    };
  }),
  commonLayouts: raw.commonLayouts.map(parseCommonLayout),
  structureGroups: raw.structureGroups.map((group) => {
    const userType = parseUserType(
      'userType' in group ? group.userType : undefined,
      `publishing-index.json > ${group.name} > userType`,
    );
    return {
      name: group.name,
      children: group.children.map((child, i) =>
        parseStructureNode(child, `publishing-index.json > ${group.name}[${i}]`),
      ),
      ...(userType !== undefined ? { userType } : {}),
    };
  }),
});

export const HOME_CONTENT: HomeContent = parseHomeContent(homeJson);

export const PUBLISHING_INDEX_CONTENT: PublishingIndexContent =
  parsePublishingIndexContent(publishingIndexJson);

export { USER_TYPE_VALUES, isStructureBranch, STATUS_VALUES } from './types';
export type {
  UserType,
  CommonLayout,
  Status,
  StructureGroup,
  StructureNode,
  StructureNote,
} from './types';
