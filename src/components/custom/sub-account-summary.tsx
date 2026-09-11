import {FileDigit, FileSearchCorner, UserSearch} from 'lucide-react'
import {SummaryList, SummaryListItem} from '@/components/composite/summary-list'
import type {SubAccountAgreement, SubAccountSummary} from '@/constants/sub-account'

// 협약 정보 — Figma "마이페이지_하위계정 현황" 의 첫 구획.
// 협약 한 건의 값(매칭 사업·사업기간·이용서비스)이 요약 목록으로, 그 아래에 계정 수 세 칸이 놓인다.
// 비협약 기관은 맺은 사업이 없어 매칭 사업·사업기간 줄이 통째로 빠지고 이용서비스만 남는다.

// 칸마다 다른 시안 아이콘 — 시안의 이름(icon-line/user-search · file-search-corner · file-digit)이
// lucide 이름과 그대로 이어진다. 값이 아니라 종류가 정하는 것이라 데이터는 이름만 넘긴다.
const SUMMARY_ICONS = {total: UserSearch, active: FileSearchCorner, usage: FileDigit} as const

// 계정 수 한 칸 — 아이콘과 이름이 위, 값이 아래 오른쪽이다(시안 253×85 · 여백 20).
const SummaryCard = ({item}: {item: SubAccountSummary}) => {
    const Icon = SUMMARY_ICONS[item.icon]

    return (
        <li className="bg-surface border-subtle-3 flex flex-col gap-0 rounded-sm border px-5 py-4">
            <p className="typo-body-l-regular text-label-foreground flex items-center gap-2">
                <Icon aria-hidden="true" className="size-icon-sm shrink-0" />
                {item.label}
            </p>
            {/* 값과 단위가 한 덩어리("12 건")로 읽히도록 읽을 문장을 따로 두고 보이는 두 조각은 감춘다
                (role 이 없는 p 에는 aria-label 을 쓸 수 없다 [8.1.1]). */}
            <p className="flex items-baseline justify-end gap-1">
                <span className="sr-only">{`${item.count} 건`}</span>
                <span aria-hidden="true" className="typo-title-l-bold text-foreground">
                    {item.count}
                </span>
                <span aria-hidden="true" className="typo-body-xl-regular text-label-foreground">
                    건
                </span>
            </p>
        </li>
    )
}

type SubAccountAgreementInfoProps = {
    agreement: SubAccountAgreement
    summaries: readonly SubAccountSummary[]
}

const SubAccountAgreementInfo = ({agreement, summaries}: SubAccountAgreementInfoProps) => (
    // 시안: 요약 목록과 계정 수 사이 24.
    <div className="flex flex-col gap-6">
        <SummaryList>
            {/* 값이 없으면 "-" 를 채우지 않고 줄 자체를 두지 않는다 — 비협약 기관에는 없는 항목이지
                아직 안 정해진 값이 아니다. */}
            {agreement.projectName ? <SummaryListItem term="매칭 사업">{agreement.projectName}</SummaryListItem> : null}
            {agreement.period ? <SummaryListItem term="사업기간">{agreement.period}</SummaryListItem> : null}
            {/* 이용서비스는 케이스별로 노출 내용이 다르다(시안 주석) — 받은 목록을 그대로 이어 붙인다. */}
            <SummaryListItem term="이용서비스">{agreement.services.join(', ')}</SummaryListItem>
        </SummaryList>

        {/* 세 칸이 줄을 고르게 나눈다. 좁은 화면에서는 하나씩 쌓인다. */}
        <ul className="grid gap-4 sm:grid-cols-3">
            {summaries.map((item) => (
                <SummaryCard key={item.icon} item={item} />
            ))}
        </ul>
    </div>
)

export {SubAccountAgreementInfo}
export type {SubAccountAgreementInfoProps}
