import {cva} from 'class-variance-authority'

// PROJECT-STYLE: 시안 text_input(40006650:29684)의 라벨·입력·메시지 간격과 타이포를 반영한다.
// 바닐라 정의는 vendor/shadcn-baseline/field.variants.ts 에 보관한다.

// PROJECT-STYLE: 시안은 라벨 아랫변에서 입력 상자까지 16px, 입력 상자에서 메시지까지 8px 이다.
// gap 하나로는 두 값을 낼 수 없어 gap 은 8 로 두고 세로 배치에서만 라벨에 8 을 더한다
// (가로 배치는 체크박스·라디오처럼 라벨이 컨트롤 옆에 붙으므로 더하지 않는다).
const fieldVariants = cva('group/field flex w-full gap-2 data-[invalid=true]:text-destructive', {
    variants: {
        orientation: {
            vertical: 'flex-col *:w-full [&>.sr-only]:w-auto [&>[data-slot=field-label]]:mb-2',
            horizontal:
                'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
            responsive:
                'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        },
    },
    defaultVariants: {
        orientation: 'vertical',
    },
})

// PROJECT-STYLE: 시안 라벨은 16px Bold 에 행간 24 다. 바닐라의 leading-snug(1.375 → 22px)를 leading-6 으로 바꾼다.
// 바닐라의 dark:has-data-checked:* 두 줄은 뺐다 — 다크 값은 토큰이 자동 반사하므로 사용처에서 다시 분기하지 않는다([PB-06]).
const fieldLabelClassName =
    'group/field-label peer/field-label flex w-fit gap-2 leading-6 group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5'

// PROJECT-STYLE: 시안 도움말·오류 메시지는 13px/19.5 다(typo-body-m-*). 바닐라의 text-sm(14/20)과 다르다.
const fieldDescriptionClassName =
    'typo-body-m-regular text-muted-foreground text-left group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5'

// PROJECT-STYLE: 오류 메시지 글자는 error.500(#de3412)로, 입력 테두리의 destructive(error.600 #bd2c0f)보다 밝다.
// 시안이 둘을 다른 색으로 두었으므로 테두리 색을 그대로 쓰지 않고 전용 토큰을 둔다.
const fieldErrorClassName = 'typo-body-m-regular text-field-error-foreground'

export {fieldVariants, fieldLabelClassName, fieldDescriptionClassName, fieldErrorClassName}
