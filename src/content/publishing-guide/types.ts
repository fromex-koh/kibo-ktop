// src/content/publishing-guide/*.json 의 구조를 기술하는 퍼블리싱 가이드 콘텐츠 스키마 타입.
// JSON 은 열거형 문자열을 넓은 string 으로 추론하므로, 열거값(Status·Note)은 타입가드로 좁힌다. [ST-002]

import type {IconName} from '@/constants/publishing-guide'

// ── 퍼블리싱 진행 상태 ──
// 색/아이콘 매핑은 화면(컴포넌트)이 담당하고, 여기선 '값의 집합'만 정의한다.
export type Status = '대기중' | '진행중' | '수정요청' | '보완' | '완료' | '최종완료'

export const STATUS_VALUES: readonly Status[] = ['대기중', '진행중', '수정요청', '보완', '완료', '최종완료']

export const isStatus = (value: string): value is Status => STATUS_VALUES.some((status) => status === value)

// ── 사용자 유형(화면을 볼 수 있는 대상) ──
// 그룹·브랜치에 지정하면 하위 화면이 상속하고, 하위에서 다시 지정하면 그 값이 우선한다.
// 화면 필터(기업/기관/탄소)의 기준이 된다.
//
// 탄소는 이 저장소가 퍼블리싱하는 화면이 아니라 별도 프로젝트(탄소중립 플랫폼 FO)의 IA다 —
// 화면을 만들지 않고 인덱스에 구조와 key 만 두며, 각 화면은 externalHref 로 그 프로젝트를 가리킨다.
export type UserType = '기업' | '기관' | '탄소'

export const USER_TYPE_VALUES: readonly UserType[] = ['기업', '기관', '탄소']

// 화면을 이 저장소에서 만들지 않는 사용자 유형 — 경로 레지스트리와 짝을 맞추지 않는다.
export const EXTERNAL_USER_TYPES: readonly UserType[] = ['탄소']

export const isExternalUserType = (userType: UserType): boolean =>
    EXTERNAL_USER_TYPES.some((external) => external === userType)

export const isUserType = (value: string): value is UserType => USER_TYPE_VALUES.some((userType) => userType === value)

// ── 실제 서비스 화면 경로 레지스트리 ──
// 화면 ID와 페이지 구현 여부에 의존하지 않는 key로 화면을 추적한다.
export type ScreenImplementationStatus = 'planned' | 'in-progress'

export const SCREEN_IMPLEMENTATION_STATUS_VALUES: readonly ScreenImplementationStatus[] = ['planned', 'in-progress']

export const isScreenImplementationStatus = (value: string): value is ScreenImplementationStatus =>
    SCREEN_IMPLEMENTATION_STATUS_VALUES.some((status) => status === value)

export type ScreenRegistryItem = {
    key: string
    screenId: string | null
    userType: UserType
    path: string
    name: string
    implemented: boolean
    implementationStatus: ScreenImplementationStatus
    version: string
    isCurrent: boolean
}

// 자산이 단일 파일인지 디렉터리인지 — 컬럼 헤더에 파일/폴더 아이콘으로 표시한다.
export type AssetKind = 'file' | 'folder'

export const isAssetKind = (value: string): value is AssetKind => value === 'file' || value === 'folder'

// ── 홈 화면 ──
export type HomeCard = {
    icon: IconName
    title: string
    description: string
    href: string
    linkLabel: string
}

export type HomeContent = {
    badge: string
    projectInfo: {
        icon: IconName
        title: string
        author: string
    }
    guide: HomeCard
}

// ── 퍼블리싱 인덱스 ──
// 화면에 최종적으로 쓰이는 형태 — version·isCurrent는 커밋된 릴리스 메타데이터에서 온다.
export type AssetVersion = {
    name: string
    kind: AssetKind
    description: string
    version: string
    isCurrent: boolean // 이번 릴리스(최신 버전)에서 바뀐 자산이면 true — 하이라이트 표시에 쓰인다.
}

// 릴리즈 노트의 일반 변경사항 또는 프론트엔드 전달 항목.
export type ReleaseNoteHandoffMode = 'diff' | 'overwrite' | 'new'

export type ReleaseNoteHandoff = {
    type: 'handoff'
    mode: ReleaseNoteHandoffMode
    title: string
    details: {label: string; value: string}[]
}

export type ReleaseNoteChange = string | ReleaseNoteHandoff

// main 릴리스마다 GitHub Actions가 누적하는 변경 내역.
export type ReleaseNote = {
    version: string
    releasedAt: string
    changes: ReleaseNoteChange[]
}

// publishing-index.json 원본의 assetVersions 항목 형태 — path 는 버전 계산용이라 화면엔 노출하지 않는다.
export type AssetVersionSource = {
    name: string
    path: string
    kind: AssetKind
    description: string
}

// 사이트 구조는 뎁스 제한 없는 트리다 — 자식이 있으면 branch(더 깊은 메뉴), 없으면 leaf(실제 화면 1건).
// leaf 만 screenId·status·version 을 가진다. 화면 ID가 발급되기 전에는 null로 관리한다.
export type StructureLeaf = {
    label: string
    key?: string // 경로가 확정된 화면은 screen-registry.json과 연결하는 영구 key를 가진다.
    screenId: string | null
    status: Status
    application2Status?: Status // 응용2 진행 상태. 미지정 시 대기중으로 표시한다.
    version: string
    // IA 원본에서 꺾쇠·빨간색으로 표시한 삭제 항목 — 인덱스에는 포함하되 취소선·빨간색으로 표시한다.
    isRed?: boolean
    userType?: UserType // 없으면 상위에서 상속(최종적으로 없으면 공통).
    externalHref?: string // 외부 프로젝트 화면의 주소 — 이 저장소에 화면이 없는 유형(탄소)에서 쓴다.
}

// 화면(leaf)의 상세 정보 — StructureLeaf 와 StructureBranch.screen 이 공유하는 형태.
// label 은 branch.screen(하이브리드) 전용 — branch 자신의 화면을 하위 뎁스 칸에 어떤 이름으로
// 보여줄지 정한다(예: 결과조회 branch 의 자기 화면은 '목록'). 없으면 빈 칸이 '-' 로 남는다.
export type ScreenInfo = {
    key?: string
    screenId: string | null
    status: Status
    application2Status?: Status
    version: string
    label?: string
    // IA 원본에서 꺾쇠·빨간색으로 표시한 삭제 항목.
    isRed?: boolean
    userType?: UserType
    externalHref?: string // 외부 프로젝트 화면의 주소 — 이 저장소에 화면이 없는 유형(탄소)에서 쓴다.
}

export type StructureBranch = {
    label: string
    children: StructureNode[]
    // 화면이 아닌 소계/구분 행이면 표에서 뎁스 배지를 숨긴다(예: 일반용·창업용).
    // 이 행도 하나의 뎁스로 세므로 아래 화면의 뎁스 번호는 그만큼 내려간다.
    isSubtotal?: boolean
    // 뎁스가 아니라 보기 좋게 묶기만 한 행이면 배지를 숨기고 뎁스 번호에서도 빼 준다
    // (예: 페이지 두 갈래를 모달 목록과 구분하려고 묶은 '업종코드 선택').
    isGroupOnly?: boolean
    // branch 자신도 독립된 화면인 경우 채운다(예: '(1) 고객정보활용동의' 자체가 화면이면서
    // 하위에 상세보기·전자서명을 더 갖는 경우). 없으면 순수 메뉴 그룹(화면이 아님).
    screen?: ScreenInfo
    userType?: UserType // 지정하면 이 branch 아래 모든 화면이 상속(하위에서 재지정 가능).
}

export type StructureNode = StructureLeaf | StructureBranch

export const isStructureBranch = (node: StructureNode): node is StructureBranch => 'children' in node

export type StructureGroup = {
    name: string
    children: StructureNode[]
    userType?: UserType // 지정하면 이 그룹(1뎁스) 아래 모든 화면이 상속(하위에서 재지정 가능).
}

// 화면을 찍어내는 틀(내부 콘텐츠만 바뀌는 공통 레이아웃) — 독립 화면이 아니라 screenId 가 없다.
// version은 릴리스 시 path 기준 Git 이력으로 생성된 메타데이터에서 가져온다.
export type CommonLayout = {
    label: string
    href?: string
    status: Status
    version: string
}

export type PublishingIndexContent = {
    releaseNotes: ReleaseNote[]
    assetVersions: AssetVersion[]
    commonLayouts: CommonLayout[]
    iaVersions: Record<UserType, string>
    structureGroups: StructureGroup[]
}
