// src/content/*.json 의 구조를 기술하는 콘텐츠 스키마 타입.
// JSON 은 열거형 문자열을 넓은 string 으로 추론하므로, 열거값(Status·Note)은 타입가드로 좁힌다. [ST-002]

import type {IconName} from '@/constants/icon-registry'

// ── 퍼블리싱 진행 상태 ──
// 색/아이콘 매핑은 화면(컴포넌트)이 담당하고, 여기선 '값의 집합'만 정의한다.
export type Status = '대기중' | '진행중' | '수정요청' | '보완' | '완료' | '최종완료'

export const STATUS_VALUES: readonly Status[] = ['대기중', '진행중', '수정요청', '보완', '완료', '최종완료']

export const isStatus = (value: string): value is Status => STATUS_VALUES.some((status) => status === value)

// ── 사용자 유형(화면을 볼 수 있는 대상) ──
// 없으면 공통(기업·기관 둘 다 노출). 그룹·브랜치에 지정하면 하위 화면이 상속하고,
// 하위에서 다시 지정하면 그 값이 우선한다. 화면 필터(전체/기업/기관)의 기준이 된다.
export type UserType = '기업' | '기관'

export const USER_TYPE_VALUES: readonly UserType[] = ['기업', '기관']

export const isUserType = (value: string): value is UserType => USER_TYPE_VALUES.some((userType) => userType === value)

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
// 화면에 최종적으로 쓰이는 형태 — version·isCurrent 는 asset-versions.generated.json(자동 계산)에서 온다.
export type AssetVersion = {
    name: string
    kind: AssetKind
    version: string
    isCurrent: boolean // 이번 릴리스(최신 버전)에서 바뀐 자산이면 true — 하이라이트 표시에 쓰인다.
}

// publishing-index.json 원본의 assetVersions 항목 형태 — path 는 버전 계산용이라 화면엔 노출하지 않는다.
export type AssetVersionSource = {
    name: string
    path: string
    kind: AssetKind
}

// 사이트 구조는 뎁스 제한 없는 트리다 — 자식이 있으면 branch(더 깊은 메뉴), 없으면 leaf(실제 화면 1건).
// leaf 만 screenId·status·version 을 가진다(화면이 있어야 상태를 매길 수 있으므로).
export type StructureLeaf = {
    label: string
    screenId: string
    status: Status
    version: string
    userType?: UserType // 없으면 상위에서 상속(최종적으로 없으면 공통).
}

// 화면(leaf)의 상세 정보 — StructureLeaf 와 StructureBranch.screen 이 공유하는 형태.
// label 은 branch.screen(하이브리드) 전용 — branch 자신의 화면을 하위 뎁스 칸에 어떤 이름으로
// 보여줄지 정한다(예: 결과조회 branch 의 자기 화면은 '목록'). 없으면 빈 칸이 '-' 로 남는다.
export type ScreenInfo = {
    screenId: string
    status: Status
    version: string
    label?: string
    userType?: UserType
}

export type StructureBranch = {
    label: string
    children: StructureNode[]
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
export type CommonLayout = {
    label: string
    status: Status
    version: string
}

export type PublishingIndexContent = {
    assetVersions: AssetVersion[]
    commonLayouts: CommonLayout[]
    structureGroups: StructureGroup[]
}
