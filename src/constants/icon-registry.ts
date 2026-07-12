// 콘텐츠 JSON 이 아이콘을 '이름'으로 참조할 때 실제 lucide 컴포넌트로 매핑하는 레지스트리. [NA-008]
// JSON 엔 하드코딩 SVG 대신 이 객체의 키(문자열)만 두고, 화면에서 이름 → 컴포넌트로 변환한다.
// 새 아이콘을 콘텐츠에서 쓰려면 여기 등록만 하면 된다(등록 안 된 이름은 검증에서 걸러진다).

import {Info, LayoutGrid, type LucideIcon} from 'lucide-react'

export const ICON_REGISTRY = {
    Info,
    LayoutGrid,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICON_REGISTRY

// JSON 에서 온 문자열이 등록된 아이콘 이름인지 좁히는 타입가드. [ST-002][NC-002]
export const isIconName = (value: string): value is IconName =>
    Object.keys(ICON_REGISTRY).some((name) => name === value)
