// 개인정보 처리방침 화면(PrivacyPolicyTabs)의 버전 · 본문 데이터.
//
// · 개인정보 처리방침 탭: 버전 셀렉트 하나 → 고른 버전의 본문.
// · 알기 쉬운 개인정보 처리방침 탭: 항목 탭(수집 · 이용 · …)마다 자기 버전 셀렉트가 있다 → 항목별로 날짜마다 내용을 본다.
//
// [프론트엔드 연동] 화면은 그대로 두고 이 파일의 값만 바꾸면 된다(또는 API·CMS 응답을 같은 모양으로 넣는다).
//   · 본문: 지금은 모두 '추후 업데이트'(PRIVACY_POLICY_PLACEHOLDER)다. 원문 문단 목록으로 바꾼다 — 화면이 문단마다 한 줄씩 띄워 그린다.
//   · 버전: 개정되면 versions 와 byVersion 에 같은 value 로 함께 더한다. 최신 버전을 맨 앞에 둔다 — 첫 항목이 처음 보이는 버전이다.
//   · 알기 쉬운 처리방침은 항목마다 versions 를 따로 가진다 — 개정된 항목만 날짜를 늘려도 된다.
//   · byVersion 에 없는 버전 · 항목은 화면이 '추후 업데이트'를 보여 준다.
// 지금의 날짜 두 개(2026-06-19 · 2025-07-01)는 셀렉트 동작을 보이기 위한 예시다 — 실제 시행일로 바꾼다.

// 본문 — 문단 목록.
type PrivacyPolicyText = readonly string[]
type PrivacyPolicyVersion = {value: string; label: string}

// 본문이 아직 없을 때의 문구.
const PRIVACY_POLICY_PLACEHOLDER = '추후 업데이트'
const PLACEHOLDER_TEXT: PrivacyPolicyText = [PRIVACY_POLICY_PLACEHOLDER]

// 버전 — 최신이 맨 앞. 이름표는 '현재 (시행일)' · '이전 (시행일)'.
const PRIVACY_POLICY_VERSIONS = [
    {value: '2026-06-19', label: '현재 (2026-06-19)'},
    {value: '2025-07-01', label: '이전 (2025-07-01)'},
] as const

// ── 개인정보 처리방침 — 버전별 본문 ──
const PRIVACY_POLICY_BY_VERSION: Readonly<Record<string, PrivacyPolicyText | undefined>> = {
    '2026-06-19': PLACEHOLDER_TEXT,
    '2025-07-01': PLACEHOLDER_TEXT,
}

// ── 알기 쉬운 개인정보 처리방침 — 항목마다 버전 목록 · 버전별 본문 ──
type EasyPrivacyPolicySection = 'collection' | 'usage' | 'provision' | 'disposal' | 'user-rights'

const EASY_PRIVACY_POLICY_SECTIONS: readonly {
    value: EasyPrivacyPolicySection
    label: string
    versions: readonly PrivacyPolicyVersion[]
    byVersion: Readonly<Record<string, PrivacyPolicyText | undefined>>
}[] = [
    {
        value: 'collection',
        label: '개인정보 수집',
        versions: PRIVACY_POLICY_VERSIONS,
        byVersion: {'2026-06-19': PLACEHOLDER_TEXT, '2025-07-01': PLACEHOLDER_TEXT},
    },
    {
        value: 'usage',
        label: '개인정보 이용',
        versions: PRIVACY_POLICY_VERSIONS,
        byVersion: {'2026-06-19': PLACEHOLDER_TEXT, '2025-07-01': PLACEHOLDER_TEXT},
    },
    {
        value: 'provision',
        label: '개인정보 제공',
        versions: PRIVACY_POLICY_VERSIONS,
        byVersion: {'2026-06-19': PLACEHOLDER_TEXT, '2025-07-01': PLACEHOLDER_TEXT},
    },
    {
        value: 'disposal',
        label: '개인정보 파기',
        versions: PRIVACY_POLICY_VERSIONS,
        byVersion: {'2026-06-19': PLACEHOLDER_TEXT, '2025-07-01': PLACEHOLDER_TEXT},
    },
    {
        value: 'user-rights',
        label: '이용자 권리 보호',
        versions: PRIVACY_POLICY_VERSIONS,
        byVersion: {'2026-06-19': PLACEHOLDER_TEXT, '2025-07-01': PLACEHOLDER_TEXT},
    },
]

export {EASY_PRIVACY_POLICY_SECTIONS, PRIVACY_POLICY_BY_VERSION, PRIVACY_POLICY_PLACEHOLDER, PRIVACY_POLICY_VERSIONS}
export type {EasyPrivacyPolicySection, PrivacyPolicyText, PrivacyPolicyVersion}
