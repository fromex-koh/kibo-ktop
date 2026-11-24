import type {ReactNode} from 'react'
import {FormCard} from '@/components/composite/form-card'

// 마이페이지 구획 카드 — 시안의 "타이틀 + 리스트" 한 덩어리다. 제목(24) 배치와 카드 면·라운드는
// 공통 FormCard 가 갖고, 이 조각은 마이페이지 폭에 맞춘 안쪽 여백만 정한다.
//
// 여백은 inset="compact"(md 이상 상하좌우 32px).
// 사이드바 옆이라 폭(792)이 좁아, 좌우 기본값(xl 102px)을 쓰면 입력 칸이 너무 좁아진다.
const MypageFormCard = ({title, subtitle, children}: {title: ReactNode; subtitle?: ReactNode; children: ReactNode}) => (
    <FormCard title={title} subtitle={subtitle} inset="compact">
        {children}
    </FormCard>
)

export {MypageFormCard}
