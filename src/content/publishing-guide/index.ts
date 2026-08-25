// 콘텐츠 JSON 을 '검증된 타입 확정 객체'로 만들어 export 하는 단일 관문.
// 컴포넌트는 원본 .json 을 직접 import 하지 않고 반드시 여기서 가져온다(검증 우회 방지).
// 열거형(status·icon)이 어긋나면 로드/빌드 시점에 에러를 던져 화면에 나가기 전에 차단한다.
// (tokens.json 을 build-tokens 가 검증해 빌드를 실패시키는 것과 같은 철학)

import {isIconName, type IconName} from '@/constants/publishing-guide'
import assetVersionsGenerated from './asset-versions.generated.json'
import releaseNotesGenerated from './release-notes.generated.json'
import homeJson from './home.json'
import publishingIndexJson from './publishing-index.json'
import screenRegistryGenerated from './screen-registry.generated.json'
import screenRegistryJson from './screen-registry.json'
import {
    USER_TYPE_VALUES,
    isAssetKind,
    isExternalUserType,
    isScreenImplementationStatus,
    isUserType,
    isStatus,
    type AssetKind,
    type AssetVersion,
    type UserType,
    type CommonLayout,
    type HomeContent,
    type PublishingIndexContent,
    type ReleaseNoteChange,
    type ReleaseNoteHandoffMode,
    type ReleaseNote,
    type ScreenRegistryItem,
    type ScreenInfo,
    type StructureNode,
} from './types'

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

// JSON 의 icon 문자열을 IconName 으로 좁힌다. 미등록이면 즉시 실패. [MD-004]
const assertIconName = (value: string, path: string): IconName => {
    if (!isIconName(value)) {
        throw new Error(`[content] ${path}: "${value}" 은(는) 등록된 아이콘 이름이 아닙니다.`)
    }
    return value
}

const parseAssetKind = (value: string, path: string): AssetKind => {
    if (!isAssetKind(value)) {
        throw new Error(`[content] ${path}: kind "${value}" 은(는) file|folder 여야 합니다.`)
    }
    return value
}

// userType 는 그룹·브랜치·화면 어디에나 올 수 있는 선택 값 — 한 곳에서 검증한다.
const parseUserType = (value: unknown, where: string): UserType | undefined => {
    if (value === undefined) {
        return undefined
    }
    if (typeof value !== 'string' || !isUserType(value)) {
        throw new Error(
            `[content] ${where}: userType "${String(value)}" 은(는) ${USER_TYPE_VALUES.join('|')} 중 하나여야 합니다.`,
        )
    }
    return value
}

// 탄소는 외부 프로젝트라 이 저장소에 화면과 레지스트리 항목이 없다 — 접두사는 형식상 자리만 채운다.
const USER_TYPE_PATH_PREFIX: Record<UserType, string> = {
    기업: '/corp',
    기관: '/org',
    탄소: '/carbon',
}

type ScreenRegistrySourceItem = Omit<
    ScreenRegistryItem,
    'implemented' | 'implementationStatus' | 'version' | 'isCurrent'
>

const parseScreenRegistryItem = (value: unknown, index: number): ScreenRegistrySourceItem => {
    const where = `screen-registry.json > screens[${index}]`
    if (!isRecord(value)) {
        throw new Error(`[content] ${where}: 객체여야 합니다.`)
    }
    if (typeof value.key !== 'string' || value.key.length === 0) {
        throw new Error(`[content] ${where}: key 가 필요합니다.`)
    }
    if (value.screenId !== null && typeof value.screenId !== 'string') {
        throw new Error(`[content] ${where}: screenId 는 발급된 문자열 또는 미발급 상태인 null 이어야 합니다.`)
    }
    const userType = parseUserType(value.userType, `${where} > userType`)
    if (userType === undefined) {
        throw new Error(`[content] ${where}: userType 이 필요합니다.`)
    }
    const pathPrefix = USER_TYPE_PATH_PREFIX[userType]
    const hasUserTypePath =
        typeof value.path === 'string' && (value.path === pathPrefix || value.path.startsWith(`${pathPrefix}/`))
    if (typeof value.path !== 'string' || !hasUserTypePath) {
        throw new Error(
            `[content] ${where}: ${userType} 화면 path 는 "${pathPrefix}" 또는 "${pathPrefix}/..." 형태여야 합니다.`,
        )
    }
    if (typeof value.name !== 'string' || value.name.length === 0) {
        throw new Error(`[content] ${where}: name 이 필요합니다.`)
    }
    return {
        key: value.key,
        screenId: value.screenId,
        userType,
        path: value.path,
        name: value.name,
    }
}

// leaf 든, branch 의 screen 필드든, '화면 1건'의 형태는 동일하다 — 한 곳에서 검증한다.
const parseScreenInfo = (value: Record<string, unknown>, where: string): ScreenInfo => {
    if (value.key !== undefined && (typeof value.key !== 'string' || value.key.length === 0)) {
        throw new Error(`[content] ${where}: key 는 비어 있지 않은 문자열이어야 합니다.`)
    }
    if (value.screenId !== null && typeof value.screenId !== 'string') {
        throw new Error(`[content] ${where}: screenId 는 발급된 문자열 또는 미발급 상태인 null 이어야 합니다.`)
    }
    if (typeof value.status !== 'string' || !isStatus(value.status)) {
        throw new Error(`[content] ${where}: status "${String(value.status)}" 이(가) 유효하지 않습니다.`)
    }
    if (
        value.application2Status !== undefined &&
        (typeof value.application2Status !== 'string' || !isStatus(value.application2Status))
    ) {
        throw new Error(
            `[content] ${where}: application2Status "${String(value.application2Status)}" 이(가) 유효하지 않습니다.`,
        )
    }
    if (typeof value.version !== 'string') {
        throw new Error(`[content] ${where}: version 이 필요합니다.`)
    }
    if (value.isRed !== undefined && typeof value.isRed !== 'boolean') {
        throw new Error(`[content] ${where}: isRed 는 boolean 이어야 합니다.`)
    }
    const userType = parseUserType(value.userType, `${where} > userType`)
    if (value.externalHref !== undefined && typeof value.externalHref !== 'string') {
        throw new Error(`[content] ${where}: externalHref 는 문자열이어야 합니다.`)
    }
    return {
        ...(typeof value.key === 'string' ? {key: value.key} : {}),
        screenId: value.screenId,
        status: value.status,
        ...(typeof value.application2Status === 'string' && isStatus(value.application2Status)
            ? {application2Status: value.application2Status}
            : {}),
        version: value.version,
        ...(value.isRed === true ? {isRed: true} : {}),
        ...(userType !== undefined ? {userType} : {}),
        ...(typeof value.externalHref === 'string' ? {externalHref: value.externalHref} : {}),
    }
}

// 사이트 구조는 뎁스 제한 없는 트리 — children 이 있으면 branch(재귀), 없으면 leaf(실제 화면 1건)로 검증한다.
// branch 에 screen 이 있으면 그 branch 자신도 독립된 화면이다(예: '(1) 고객정보활용동의').
const parseStructureNode = (value: unknown, path: string): StructureNode => {
    if (!isRecord(value) || typeof value.label !== 'string') {
        throw new Error(`[content] ${path}: label 이 있는 객체가 아닙니다.`)
    }
    const label = value.label
    const where = `${path} > ${label}`

    if ('children' in value) {
        if (!Array.isArray(value.children)) {
            throw new Error(`[content] ${where}: children 은 배열이어야 합니다.`)
        }
        const children = value.children.map((child, i) => parseStructureNode(child, `${where}[${i}]`))
        const userType = parseUserType(value.userType, `${where} > userType`)
        if (value.isSubtotal !== undefined && typeof value.isSubtotal !== 'boolean') {
            throw new Error(`[content] ${where} > isSubtotal: boolean 이어야 합니다.`)
        }
        if (value.isGroupOnly !== undefined && typeof value.isGroupOnly !== 'boolean') {
            throw new Error(`[content] ${where} > isGroupOnly: boolean 이어야 합니다.`)
        }
        const isSubtotal = value.isSubtotal === true
        const isGroupOnly = value.isGroupOnly === true
        if (value.screen !== undefined) {
            if (!isRecord(value.screen)) {
                throw new Error(`[content] ${where} > screen: 객체여야 합니다.`)
            }
            const screenBase = parseScreenInfo(value.screen, `${where} > screen`)
            // label 은 하이브리드 branch 의 자기 화면을 하위 뎁스 칸에 표시할 이름(예: '목록').
            const screenLabel = value.screen.label
            if (screenLabel !== undefined && typeof screenLabel !== 'string') {
                throw new Error(`[content] ${where} > screen > label: 문자열이어야 합니다.`)
            }
            const screen: ScreenInfo = screenLabel !== undefined ? {...screenBase, label: screenLabel} : screenBase
            return {
                label,
                children,
                screen,
                ...(isSubtotal ? {isSubtotal: true} : {}),
                ...(isGroupOnly ? {isGroupOnly: true} : {}),
                ...(userType !== undefined ? {userType} : {}),
            }
        }
        return {
            label,
            children,
            ...(isSubtotal ? {isSubtotal: true} : {}),
            ...(isGroupOnly ? {isGroupOnly: true} : {}),
            ...(userType !== undefined ? {userType} : {}),
        }
    }

    return {label, ...parseScreenInfo(value, where)}
}

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
})

// asset·공통 레이아웃의 version·isCurrent는 publishing-index.json이 아니라 GitHub Actions가 릴리스 커밋에
// 확정한 asset-versions.generated.json에서 가져온다. [MD-003]
const findGeneratedVersion = (name: string): {version: string; isCurrent: boolean} => {
    const found = assetVersionsGenerated.assets.find((a) => a.name === name)
    return {version: found?.version ?? '-', isCurrent: found?.isCurrent ?? false}
}

const findGeneratedCommonLayoutVersion = (path: string): string =>
    assetVersionsGenerated.commonLayouts?.find((layout) => layout.path === path)?.version ?? '미배포'

const parseCommonLayout = (raw: (typeof publishingIndexJson)['commonLayouts'][number]): CommonLayout => {
    const where = `publishing-index.json > commonLayouts > ${raw.label}`
    if (!isStatus(raw.status)) {
        throw new Error(`[content] ${where}: status "${raw.status}" 이(가) 유효하지 않습니다.`)
    }
    if (typeof raw.path !== 'string' || raw.path.length === 0) {
        throw new Error(`[content] ${where}: path 가 필요합니다.`)
    }
    return {
        label: raw.label,
        ...(typeof raw.href === 'string' ? {href: raw.href} : {}),
        status: raw.status,
        version: findGeneratedCommonLayoutVersion(raw.path),
    }
}

// 반환 타입이 Record<UserType, string> 이라 유형이 늘면 여기서 빌드가 먼저 멈춘다.
const parseIaVersions = (raw: typeof publishingIndexJson): Record<UserType, string> => {
    const readVersion = (userType: UserType): string => {
        const version: unknown = raw.iaVersions[userType]
        if (typeof version !== 'string' || version.length === 0) {
            throw new Error(
                `[content] publishing-index.json > iaVersions > ${userType}: 비어 있지 않은 문자열이어야 합니다.`,
            )
        }
        return version
    }
    return {기업: readVersion('기업'), 기관: readVersion('기관'), 탄소: readVersion('탄소')}
}

const RELEASE_NOTE_HANDOFF_MODES: readonly ReleaseNoteHandoffMode[] = ['diff', 'new', 'overwrite']

const isReleaseNoteHandoffMode = (value: string): value is ReleaseNoteHandoffMode =>
    RELEASE_NOTE_HANDOFF_MODES.some((mode) => mode === value)

// 릴리즈 노트는 일반 문자열과 프론트엔드 전달 카드 객체를 함께 지원한다.
const parseReleaseNoteChange = (value: unknown, where: string): ReleaseNoteChange => {
    if (typeof value === 'string') return value
    if (!isRecord(value) || value.type !== 'handoff') {
        throw new Error(`[content] ${where}: 문자열 또는 handoff 객체여야 합니다.`)
    }
    const mode = value.mode
    if (typeof mode !== 'string' || !isReleaseNoteHandoffMode(mode)) {
        throw new Error(`[content] ${where} > mode: diff|new|overwrite 중 하나여야 합니다.`)
    }
    if (typeof value.title !== 'string' || value.title.length === 0) {
        throw new Error(`[content] ${where} > title: 비어 있지 않은 문자열이어야 합니다.`)
    }
    if (!Array.isArray(value.details)) {
        throw new Error(`[content] ${where} > details: 배열이어야 합니다.`)
    }

    const details = value.details.map((detail, index) => {
        if (!isRecord(detail) || typeof detail.label !== 'string' || typeof detail.value !== 'string') {
            throw new Error(`[content] ${where} > details[${index}]: label·value 문자열이 필요합니다.`)
        }
        return {label: detail.label, value: detail.value}
    })

    return {
        type: 'handoff',
        mode,
        title: value.title,
        details,
    }
}

const parsePublishingIndexContent = (raw: typeof publishingIndexJson): PublishingIndexContent => ({
    releaseNotes: releaseNotesGenerated.releases.map((release): ReleaseNote => ({
        version: release.version,
        releasedAt: release.releasedAt,
        changes: release.changes.map((change, index) =>
            parseReleaseNoteChange(change, `releaseNotes > ${release.version} > changes[${index}]`),
        ),
    })),
    assetVersions: raw.assetVersions.map((asset): AssetVersion => {
        const {version, isCurrent} = findGeneratedVersion(asset.name)
        return {
            name: asset.name,
            kind: parseAssetKind(asset.kind, `publishing-index.json > assetVersions > ${asset.name} > kind`),
            description: asset.description,
            version,
            isCurrent,
        }
    }),
    commonLayouts: raw.commonLayouts.map(parseCommonLayout),
    iaVersions: parseIaVersions(raw),
    structureGroups: raw.structureGroups.map((group) => {
        const userType = parseUserType(
            'userType' in group ? group.userType : undefined,
            `publishing-index.json > ${group.name} > userType`,
        )
        return {
            name: group.name,
            children: group.children.map((child, i) =>
                parseStructureNode(child, `publishing-index.json > ${group.name}[${i}]`),
            ),
            ...(userType !== undefined ? {userType} : {}),
        }
    }),
})

export const HOME_CONTENT: HomeContent = parseHomeContent(homeJson)

export const PUBLISHING_INDEX_CONTENT: PublishingIndexContent = parsePublishingIndexContent(publishingIndexJson)

const SCREEN_REGISTRY_SOURCE = screenRegistryJson.screens.map(parseScreenRegistryItem)

export const SCREEN_REGISTRY: ScreenRegistryItem[] = SCREEN_REGISTRY_SOURCE.map((screen) => {
    const generated = screenRegistryGenerated.screens.find((item) => item.key === screen.key)
    if (
        generated === undefined ||
        typeof generated.implemented !== 'boolean' ||
        !isScreenImplementationStatus(generated.implementationStatus) ||
        typeof generated.version !== 'string' ||
        typeof generated.isCurrent !== 'boolean'
    ) {
        throw new Error(
            `[content] screen-registry.generated.json: key "${screen.key}"의 구현 상태가 유효하지 않습니다.`,
        )
    }
    return {
        ...screen,
        implemented: generated.implemented,
        implementationStatus: generated.implementationStatus,
        version: generated.version,
        isCurrent: generated.isCurrent,
    }
})

const assertUniqueScreenRegistryField = (field: 'key' | 'path') => {
    const values = SCREEN_REGISTRY.map((screen) => screen[field])
    const duplicate = values.find((value, index) => values.indexOf(value) !== index)
    if (duplicate !== undefined) {
        throw new Error(`[content] screen-registry.json: ${field} "${duplicate}" 이(가) 중복되었습니다.`)
    }
}

assertUniqueScreenRegistryField('key')
assertUniqueScreenRegistryField('path')

type IndexedScreenReference = {
    key: string
    userType: UserType
}

const collectIndexedScreenReferences = (): IndexedScreenReference[] => {
    const collectNode = (node: StructureNode, inheritedUserType?: UserType): IndexedScreenReference[] => {
        const nodeUserType = node.userType ?? inheritedUserType
        if ('children' in node) {
            const ownScreen =
                node.screen?.key !== undefined
                    ? [{key: node.screen.key, userType: node.screen.userType ?? nodeUserType}]
                    : []
            const children = node.children.flatMap((child) => collectNode(child, nodeUserType))
            return [...ownScreen, ...children].filter(
                (screen): screen is IndexedScreenReference => screen.userType !== undefined,
            )
        }
        return node.key !== undefined && nodeUserType !== undefined ? [{key: node.key, userType: nodeUserType}] : []
    }

    return PUBLISHING_INDEX_CONTENT.structureGroups.flatMap((group) =>
        group.children.flatMap((node) => collectNode(node, group.userType)),
    )
}

const INDEXED_SCREEN_REFERENCES = collectIndexedScreenReferences()

const duplicateIndexedKey = INDEXED_SCREEN_REFERENCES.map((screen) => screen.key).find(
    (key, index, keys) => keys.indexOf(key) !== index,
)
if (duplicateIndexedKey !== undefined) {
    throw new Error(`[content] publishing-index.json: key "${duplicateIndexedKey}" 이(가) 중복되었습니다.`)
}

SCREEN_REGISTRY.forEach((registeredScreen) => {
    const indexedScreen = INDEXED_SCREEN_REFERENCES.find((screen) => screen.key === registeredScreen.key)
    if (indexedScreen === undefined) {
        throw new Error(
            `[content] screen-registry.json: key "${registeredScreen.key}"에 대응하는 퍼블리싱 인덱스 화면이 없습니다.`,
        )
    }
    if (indexedScreen.userType !== registeredScreen.userType) {
        throw new Error(
            `[content] ${registeredScreen.key}: 퍼블리싱 인덱스와 경로 레지스트리의 userType이 일치하지 않습니다.`,
        )
    }
})

INDEXED_SCREEN_REFERENCES.forEach((indexedScreen) => {
    // 외부 프로젝트 IA(탄소)는 이 저장소가 화면을 만들지 않는다 — key 만 두고 경로는 externalHref 로 연결한다.
    if (isExternalUserType(indexedScreen.userType)) return
    if (!SCREEN_REGISTRY.some((registeredScreen) => registeredScreen.key === indexedScreen.key)) {
        throw new Error(
            `[content] publishing-index.json: key "${indexedScreen.key}"에 대응하는 화면 경로가 등록되지 않았습니다.`,
        )
    }
})

export {
    USER_TYPE_VALUES,
    isExternalUserType,
    isStructureBranch,
    SCREEN_IMPLEMENTATION_STATUS_VALUES,
    STATUS_VALUES,
} from './types'
export type {
    UserType,
    CommonLayout,
    ReleaseNoteChange,
    ReleaseNoteHandoff,
    ScreenImplementationStatus,
    ScreenRegistryItem,
    Status,
    StructureGroup,
    StructureNode,
} from './types'
