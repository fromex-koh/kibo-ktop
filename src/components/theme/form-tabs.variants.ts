import {cva} from 'class-variance-authority'

// PROJECT-STYLE: Figma "탭 타이틀" — 폼 섹션을 카드형 탭으로 나열하고, 그 아래 폼 카드에 그대로 얹힌다.
// shadcn 기본 탭(작은 pill/line)과 형태가 달라 사용처(FormTabs)에서 List·Trigger 스타일을 덮어쓴다.
//   · 활성   : 흰 카드(card) · 테두리 없음 · 제목 Bold(foreground) · 좌측 primary 액센트 바(4×38)
//   · 비활성 : 옅은 배경(background) · subtle-3 테두리 · 제목 Medium(label-foreground)
//   · 공통   : 위 모서리만 둥글다(rounded-t-sm). 아래쪽 32px 은 폼 카드가 위에 얹혀 가리므로 테두리도 없다.
// 상태 문구는 작성완료·작성중(foreground-subtle Medium) / 미작성(disabled Regular) 3종이다.
// 목록은 TabsList 의 plain variant(표면 스타일 없음)를 쓰므로 간격만 지정하면 된다.
const formTabsListClassName = 'gap-1'

// 제목 굵기는 typo-* 가 variant 를 못 받아(일반 클래스) 트리거에서 title 슬롯을 내려 찍는다.
// (선택자 특정성이 typo-* 보다 높아 순서와 무관하게 이긴다 — selectable-card 와 같은 방식)
const formTabsTriggerClassName =
    'group/form-tab bg-background border-subtle-3 text-label-foreground data-[state=active]:bg-card data-[state=active]:border-transparent data-[state=active]:text-foreground min-h-29 flex-1 flex-col items-start justify-start gap-0 rounded-t-sm border border-b-0 p-5 text-left whitespace-normal data-[state=active]:[&_[data-slot=form-tab-title]]:font-bold'

// 액센트 바 — 시안 실측 4×38, 끝이 둥근 막대이며 탭 위쪽에서 24px 내려온 자리(제목 글자 윗선)에서
// 상태 문구까지 이어진다. 비활성일 때 자리를 차지하지 않도록 absolute 로 두고,
// 활성일 때만 본문을 12px(바 4 + 간격 8) 들여쓴다.
const formTabsAccentClassName =
    'bg-primary absolute top-6 left-5 h-9.5 w-1 rounded-full opacity-0 group-data-[state=active]/form-tab:opacity-100'

const formTabsBodyClassName = 'flex w-full items-start justify-between gap-2 group-data-[state=active]/form-tab:pl-3'

const formTabsTitleClassName = 'typo-body-xl-medium'

const formTabsIconClassName =
    'text-label-foreground size-icon-md shrink-0 group-data-[state=active]/form-tab:text-foreground'

// 본문 — 시안은 폼 카드가 탭 아래쪽을 32px 덮는 구조다(카드 라운드는 그대로 유지). z-index 를 쓰지 않고
// DOM 순서(뒤에 오는 형제가 위)로 겹침을 만든다[CD-002] — relative 만 주면 탭 위에 그려진다.
const formTabsContentClassName = 'relative -mt-8'

const formTabsStatusVariants = cva('group-data-[state=active]/form-tab:text-foreground', {
    variants: {
        status: {
            done: 'typo-body-m-medium text-foreground-subtle',
            writing: 'typo-body-m-medium text-foreground-subtle',
            todo: 'typo-body-m-regular text-disabled',
        },
    },
    defaultVariants: {status: 'todo'},
})

export {
    formTabsAccentClassName,
    formTabsBodyClassName,
    formTabsContentClassName,
    formTabsIconClassName,
    formTabsListClassName,
    formTabsStatusVariants,
    formTabsTitleClassName,
    formTabsTriggerClassName,
}
