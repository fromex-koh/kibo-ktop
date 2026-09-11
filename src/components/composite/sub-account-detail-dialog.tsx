'use client'

import {useId, useState, type ReactNode} from 'react'
import {EmptyState} from '@/components/composite/empty-state'
import {SegmentedControl, SegmentedControlItem} from '@/components/composite/segmented-control'
import {SubAccountStatusBadge} from '@/components/composite/sub-account-status-badge'
import {SummaryList, SummaryListItem} from '@/components/composite/summary-list'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {
    SUB_ACCOUNT_DETAIL_TABS,
    type SubAccountDetailTab,
    type SubAccountItem,
    type SubAccountServiceUsage,
} from '@/constants/sub-account'
import {cn} from '@/lib/utils'

// 하위 계정 상세정보 — Figma "마이페이지_하위계정 현황_하위 계정 상세정보".
// 계정 요약(옅은 파랑 카드) → 서비스별 배분 이용건수(2열) → 내역 갈래(접속 일시 / 활동) → [닫기] 순이다.
//
// 고른 갈래를 들고 있어야 해서 client 로 둔다. 값은 넘겨받은 것만 그린다 — 어떤 서비스가 몇 건인지,
// 내역이 몇 줄인지는 데이터(content/service/org-sub-accounts.ts)가 정한다.

// 서비스별 배분 이용건수 한 칸 — 옅은 회색 면에 이름(14)과 값(20 Bold)+단위(16)가 오른쪽으로 붙는다.
// 보증이력 모달의 금액 칸과 같은 짜임이라 그 값을 그대로 쓴다 — 좁은 화면에서는 한 줄 안에서
// 이름(좌)·값(우)으로 두고, sm 이상에서 시안대로 위아래로 쌓는다.
//
// 값과 단위가 한 덩어리("20 건")로 읽히도록 읽을 문장을 따로 두고 보이는 두 조각은 감춘다
// (role 이 없는 p 에는 aria-label 을 쓸 수 없다 [8.1.1]).
const ServiceUsageCard = ({item}: {item: SubAccountServiceUsage}) => (
    <li className="bg-surface-subtle flex items-baseline justify-between gap-2 rounded-sm px-5 py-4 sm:flex-col sm:items-stretch sm:gap-0">
        <p className="typo-body-l-regular text-label-foreground min-w-0">{item.service}</p>
        <p className="flex shrink-0 items-baseline justify-end gap-1">
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

// 계정 요약 카드의 상세 한 줄 — 아래 내역 목록보다 한 단계 작은 글자다(시안 14/21).
// 보증이력 모달의 상단 카드와 같은 짜임이다.
const AccountDetailRow = ({term, children}: {term: string; children: ReactNode}) => (
    <div className="flex items-start justify-between gap-4">
        <dt className="typo-body-l-regular text-foreground-subtle shrink-0 break-keep">{term}</dt>
        <dd className="typo-body-l-regular text-foreground m-0 min-w-0 text-right break-words">{children}</dd>
    </div>
)

type SubAccountDetailDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 보여 줄 계정. 카드가 들고 있는 값과 상세값을 함께 쓴다. */
    item: SubAccountItem
}

const SubAccountDetailDialog = ({children, defaultOpen, item}: SubAccountDetailDialogProps) => {
    const [tab, setTab] = useState<SubAccountDetailTab>(SUB_ACCOUNT_DETAIL_TABS[0].value)
    const tabLabelId = useId()
    const panelId = useId()
    const {detail} = item
    const logs = tab === 'access' ? detail.accessLogs : detail.activityLogs
    // 비었을 때 안내 문구에 쓸 갈래 이름 — 탭 이름을 그대로 가져와 두 곳이 어긋나지 않게 한다.
    const tabLabel = SUB_ACCOUNT_DETAIL_TABS.find((option) => option.value === tab)?.label ?? '내역'

    return (
        <Dialog defaultOpen={defaultOpen}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>하위 계정 상세정보</DialogTitle>
                </DialogHeader>

                <div className={cn(dialogBodyClassName, 'gap-6')}>
                    {/* 계정 요약 — 시안은 옅은 파랑 면에 navy 테두리다. 지점명 옆에 지금 상태가 붙는다. */}
                    <section
                        aria-label="계정 정보"
                        className="bg-primary-subtle border-navy-200 flex flex-col gap-4 rounded-lg border p-6"
                    >
                        {/* 좁은 화면에서는 배지를 이름 위로 올린다 — 옆에 두면 이름에 남는 폭이 얼마 되지
                            않아 긴 이름이 여러 줄로 접힌다(보증이력 모달의 상단 카드와 같은 배치다). */}
                        <div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:justify-between sm:gap-4">
                            <h3 className="typo-title-l-bold text-foreground min-w-0 flex-1">{item.name}</h3>
                            {/* 시안의 상태 표시는 테두리 배지다 — 옅은 파랑 카드 위라 면을 채우면 카드와
                                뭉개진다. 색은 목록 카드와 같은 값에서 나온다(사용 하늘색 · 사용정지 회색). */}
                            <SubAccountStatusBadge status={item.status} tone="outline" />
                        </div>
                        <dl className="flex flex-col gap-2">
                            <AccountDetailRow term="계정 ID">{item.accountId}</AccountDetailRow>
                            <AccountDetailRow term="담당자">{item.managerName}</AccountDetailRow>
                            <AccountDetailRow term="생성일">{detail.createdAt}</AccountDetailRow>
                            <AccountDetailRow term="메모">{detail.memo || '미입력'}</AccountDetailRow>
                        </dl>
                    </section>

                    <section aria-labelledby={`${panelId}-usage`} className="flex flex-col gap-2">
                        <h3 id={`${panelId}-usage`} className="typo-title-m-bold text-foreground">
                            서비스별 배분 이용건수
                        </h3>
                        {/* 두 칸씩 나란히 놓인다(시안 250·250 · 사이 8). 좁은 화면에서는 하나씩 쌓인다. */}
                        <ul className="grid gap-2 sm:grid-cols-2">
                            {detail.serviceUsages.map((usage) => (
                                <ServiceUsageCard key={usage.service} item={usage} />
                            ))}
                        </ul>
                    </section>

                    <section className="flex flex-col gap-4">
                        <span id={tabLabelId} className="sr-only">
                            내역 종류
                        </span>
                        <SegmentedControl
                            type="radio"
                            variant="solid"
                            size="lg"
                            name="subAccountDetailTab"
                            value={tab}
                            onValueChange={(value) => setTab(value === 'activity' ? 'activity' : 'access')}
                            aria-labelledby={tabLabelId}
                            // 글자 수가 제각각이라(접속 일시 내역·활동 내역) 폭을 글자에 맡기고 좌우 여백만 24 로
                            // 준다(시안 139·108). 좁은 화면에서는 한 줄을 고르게 나눈다.
                            className="*:w-auto *:px-6 max-sm:w-full max-sm:*:flex-1 max-sm:*:px-0"
                        >
                            {SUB_ACCOUNT_DETAIL_TABS.map((option) => (
                                <SegmentedControlItem key={option.value} value={option.value}>
                                    {option.label}
                                </SegmentedControlItem>
                            ))}
                        </SegmentedControl>

                        {/* 고른 갈래의 내역 — 한 건이 요약 목록 카드 한 장이다(시안 흰 면·테두리·반경 12).
                            아직 남은 기록이 없는 계정도 있어, 비었을 때는 같은 자리를 안내가 대신한다. */}
                        {logs.length > 0 ? (
                            <ul id={panelId} className="flex flex-col gap-4">
                                {tab === 'access'
                                    ? detail.accessLogs.map((log) => (
                                          <li key={log.id}>
                                              <SummaryList>
                                                  <SummaryListItem term="접속 일시">{log.accessedAt}</SummaryListItem>
                                                  <SummaryListItem term="접속 IP">{log.ip}</SummaryListItem>
                                              </SummaryList>
                                          </li>
                                      ))
                                    : detail.activityLogs.map((log) => (
                                          <li key={log.id}>
                                              <SummaryList>
                                                  <SummaryListItem term="활동 일시">{log.actedAt}</SummaryListItem>
                                                  <SummaryListItem term="활동 구분">{log.category}</SummaryListItem>
                                                  <SummaryListItem term="활동 내용">{log.detail}</SummaryListItem>
                                                  <SummaryListItem term="처리 결과">{log.result}</SummaryListItem>
                                              </SummaryList>
                                          </li>
                                      ))}
                            </ul>
                        ) : (
                            // 빈 상태는 내역 카드와 같은 흰 면·테두리·모서리로 그 자리를 대신한다.
                            <EmptyState
                                id={panelId}
                                title={`${tabLabel}이 없습니다.`}
                                className="bg-surface border-subtle-3 min-h-40 rounded-md border"
                            />
                        )}
                    </section>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="tertiary" size="xl">
                            닫기
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {SubAccountDetailDialog}
export type {SubAccountDetailDialogProps}
