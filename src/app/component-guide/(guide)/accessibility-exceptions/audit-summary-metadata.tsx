'use client'

import {useSyncExternalStore} from 'react'

const pad = (value: number) => String(value).padStart(2, '0')

const browserDateTime = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '검사 시간 기록 없음'

    const timestamp = [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-')
    const time = [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(':')
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    return `${timestamp} ${time}${timeZone ? ` (${timeZone})` : ''}`
}

type AuditSummaryMetadataProps = {
    checkedAt: string | null
    commit: string
    validatorVersion: string
}

const subscribe = () => () => undefined

const AuditSummaryMetadata = ({checkedAt, commit, validatorVersion}: AuditSummaryMetadataProps) => {
    const checkedAtLabel = useSyncExternalStore(
        subscribe,
        () => (checkedAt ? browserDateTime(checkedAt) : '검사 시간 기록 없음'),
        () => '검사 시간 확인 중',
    )

    return (
        <span>
            <time dateTime={checkedAt ?? undefined}>{checkedAtLabel}</time> · 커밋 {commit} 운영 빌드 · Nu Html Checker{' '}
            {validatorVersion}
        </span>
    )
}

export default AuditSummaryMetadata
