import {cva} from 'class-variance-authority'

// PROJECT-STYLE: Figma 선택 카드 기준 — 선택 시 primary 테두리 + primary-subtle 배경.
// 라벨 타이포는 control 마다 다르다(아래 selectableCardTitleVariants 참고). checkbox 라벨만
// 선택 시 Bold 로 바뀌는데, typo-* 는 variant 를 붙일 수 없는 일반 클래스라 카드 루트에서
// title 슬롯을 내려 찍는다(선택자 특정성이 typo-* 보다 높아 순서와 무관하게 이긴다).
const selectableCardVariants = cva(
    'bg-surface flex cursor-pointer items-center gap-2 rounded-lg border-2 border-transparent px-10 py-6 transition-colors has-[>[data-slot=field]]:border-2 *:data-[slot=field]:p-0 has-data-checked:border-primary has-data-checked:bg-primary-subtle has-[:focus-visible]:outline-ring has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-solid',
    {
        variants: {
            disabled: {
                true: 'bg-control-disabled text-disabled has-data-checked:border-disabled-subtle has-data-checked:bg-control-disabled cursor-not-allowed opacity-100',
                // PROJECT-STYLE: Figma 라벨 색은 본문(foreground)이 아닌 gray.700 이므로
                // text-label-foreground 를 쓴다. disabled 와의 충돌을 피해 variant 로 분기한다.
                false: 'text-label-foreground',
            },
            control: {
                radio: '',
                checkbox: 'has-data-checked:[&_[data-slot=selectable-card-title]]:font-bold',
            },
        },
    },
)

// PROJECT-STYLE: 같은 카드지만 Figma 사양이 control 마다 다르다.
//  - radio(동의 선택): 20px Bold 고정 — 선택 여부와 무관하게 제목처럼 보인다.
//  - checkbox(확인 동의): 16px Regular 본문이고 선택했을 때만 Bold 로 강조된다.
const selectableCardTitleVariants = cva('text-current', {
    variants: {
        control: {
            radio: 'typo-title-l-bold',
            checkbox: 'typo-body-xl-regular',
        },
    },
    defaultVariants: {control: 'checkbox'},
})

// 시안은 컨트롤(24)과 글자 줄(라디오 30 · 체크박스 24)의 세로 중심이 정확히 맞는다.
// 가로 Field 는 안에 field-content 가 있으면 items-start 로 바뀌고 컨트롤을 1px 내려(mt-px) 여러 줄 라벨의
// 첫 줄에 맞추는데, 이 카드는 한 줄짜리라 가운데 정렬로 되돌린다. 그때 남는 mt-px 가 컨트롤을 0.5px
// 아래로 밀어 중심이 어긋나므로 같은 선택자로 mt-0 을 덮어 지운다(cn 의 twMerge 가 mt-px 를 걷어낸다).
const selectableCardFieldClassName =
    'items-center gap-2 has-[>[data-slot=field-content]]:items-center has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-0'
const selectableCardControlClassName = 'focus-visible:outline-none'
const selectableCardContentClassName = 'gap-0'
// 뱃지는 카드 오른쪽 끝에 붙고 뱃지끼리는 4px(gap-1) 간격이다(Figma "타이틀+뱃지").
const selectableCardBadgesClassName = 'flex shrink-0 items-center gap-1'

export {
    selectableCardVariants,
    selectableCardFieldClassName,
    selectableCardControlClassName,
    selectableCardContentClassName,
    selectableCardTitleVariants,
    selectableCardBadgesClassName,
}
