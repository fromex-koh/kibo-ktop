import type {ReactNode} from 'react'
import {cn} from '@/lib/utils'

// 이용중지 신청·변경 팝업과 확인 팝업이 함께 쓰는 정보 조각.

// 기간 표시 — 날짜가 중간에서 끊기지 않게 "~" 앞에서만 줄을 바꾼다. suffix(예: 일수)는 종료일에 붙어 다닌다.
const PeriodText = ({startDate, endDate, suffix}: {startDate: string; endDate: string; suffix?: string}) => (
    <>
        <span className="whitespace-nowrap">{startDate}</span>{' '}
        <span className="whitespace-nowrap">
            ~ {endDate}
            {suffix ? ` ${suffix}` : null}
        </span>
    </>
)

// 항목명 · 값 한 줄. isStacked(기간처럼 긴 값)는 좁은 화면에서 항목명 아래로 왼쪽 정렬해 쌓는다.
const InfoRow = ({term, isStacked, children}: {term: string; isStacked?: boolean; children: ReactNode}) => (
    <div
        className={cn(
            'flex gap-x-4 gap-y-1',
            isStacked
                ? 'flex-col sm:flex-row sm:flex-wrap sm:items-start sm:justify-between'
                : 'flex-wrap items-start justify-between',
        )}
    >
        <dt className="typo-body-xl-regular text-foreground-subtle shrink-0">{term}</dt>
        <dd
            className={cn(
                'typo-body-xl-medium text-label-foreground m-0 min-w-0 wrap-anywhere break-keep',
                isStacked ? 'text-left sm:ml-auto sm:text-right' : 'ml-auto text-right',
            )}
        >
            {children}
        </dd>
    </div>
)

export {InfoRow, PeriodText}
