import type {ReactNode} from 'react'
import {FormCard} from '@/components/composite/form-card'

// 마이페이지 구획 카드 — 시안의 "타이틀 + 리스트" 한 덩어리다. 제목(24) 배치와 카드 면·라운드는
// 공통 FormCard 가 갖고, 이 조각은 마이페이지 폭에 맞춘 안쪽 여백만 정한다.
//
// 안쪽 여백은 40 으로 고정한다 — FormCard 의 xl 기본값(102)은 폭 1200 짜리 카드에 맞춘 값이라,
// 마이페이지처럼 폭 792(사이드바 옆) 카드에 그대로 쓰면 입력 칸이 지나치게 좁아진다.
const MypageFormCard = ({title, subtitle, children}: {title: ReactNode; subtitle?: ReactNode; children: ReactNode}) => (
    <FormCard
        title={title}
        subtitle={subtitle}
        className="[&_[data-slot=card-content]]:xl:px-10 [&_[data-slot=section-header]]:xl:px-10"
    >
        {children}
    </FormCard>
)

export {MypageFormCard}
