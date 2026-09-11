import {Badge} from '@/components/ui/badge'
import {SUB_ACCOUNT_STATUS, type SubAccountStatus} from '@/constants/sub-account'

// 하위계정 상태 배지 — 목록 카드와 상세정보 모달이 같은 색으로 같은 상태를 알린다(사용 하늘색 · 사용정지 회색).
// 색은 한 곳(SUB_ACCOUNT_STATUS)에서만 정해지고, 놓이는 자리에 따라 채운 면과 테두리 두 모습이 있다.
//   solid   — 목록 카드. 이름 앞에 글자처럼 붙는 작은 배지다(시안).
//   outline — 상세정보 모달. 옅은 파랑 카드 위에 놓여 면을 채우면 카드와 뭉개지므로 테두리로 둔다(시안).

/** 배지의 모습 — 자리에 따라 다르고, 색은 상태가 정한다. */
const STATUS_BADGE_TONES = {
    solid: {variant: 'solid-pastel', shape: 'round', size: 'xs'},
    outline: {variant: 'outline', shape: 'pill', size: 'sm'},
} as const

type SubAccountStatusBadgeTone = keyof typeof STATUS_BADGE_TONES

type SubAccountStatusBadgeProps = {
    status: SubAccountStatus
    /** 기본은 목록 카드의 채운 배지다. */
    tone?: SubAccountStatusBadgeTone
    /** 놓이는 자리에 따른 여백·정렬만 사용처가 준다(카드는 이름 앞에 글자처럼 흘려 넣는다). */
    className?: string
}

const SubAccountStatusBadge = ({status, tone = 'solid', className}: SubAccountStatusBadgeProps) => {
    const {label, color} = SUB_ACCOUNT_STATUS[status]

    return (
        <Badge {...STATUS_BADGE_TONES[tone]} color={color} className={className}>
            {label}
        </Badge>
    )
}

export {SubAccountStatusBadge}
export type {SubAccountStatusBadgeProps, SubAccountStatusBadgeTone}
