import {cn} from '@/lib/utils'
import {buttonVariants} from '@/components/theme/button.variants'

// 헤더 우측 아이콘 버튼(테마 전환·전체 메뉴) — 24px 아이콘만 두고 배경·패딩·호버 면은 만들지 않는다.
// 이 규칙(배경 없음 · 상자 = 아이콘 크기 · hover 는 아이콘 색만)은 Button 의 plain variant 가 공통으로
// 관리한다. hover 색은 모든 테마에서 모노톤 시맨틱 icon-interactive-hover 다 — 라이트는 기본 전경색과
// 충분히 구분되는 gray.300, 다크·메인페이지는 gray.200 을 토큰이 공급한다.
//
// 눌리는 범위는 보이는 24px 상자 그대로다. 최소 타깃 크기 수치는 강제하지 않으며, 인접 버튼끼리
// 겹치지 않도록 간격만 확보한다(아래 group 의 gap-5). [KWCAG 6.1.3]
export const headerIconButtonClassName = cn(buttonVariants({variant: 'plain', size: 'icon-md'}))

// 시안의 아이콘 간격 20px. 인접 버튼의 클릭 영역이 서로 겹치지 않는 간격이다. [KWCAG 6.1.3]
// 전경색을 그룹에 명시해 가이드의 .light/.dark/.mainpage 강제 테마 안에서도 아이콘 대비를 유지한다.
export const headerIconGroupClassName = 'text-foreground ml-auto flex items-center gap-5'
