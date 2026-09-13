'use client'

import {useState, type ReactNode} from 'react'
import {CircleAlert} from 'lucide-react'
import {FieldLabel} from '@/components/composite/form-fields'
import {
    FormValuesProvider,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    useFieldError,
} from '@/components/composite/form-values'
import {SubAccountForm} from '@/components/composite/sub-account-form'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {Field, FieldError} from '@/components/ui/field'
import {
    SUB_ACCOUNT_STATUS_FILTERS,
    type SubAccountItem,
    type SubAccountServiceUsage,
    type SubAccountStatus,
} from '@/constants/sub-account'

// 하위 계정 수정 — Figma "마이페이지_하위계정 현황_하위계정 수정".
// 카드의 [⋮] > [수정] 이 여는 모달이다. 등록 모달과 같은 칸(계정 ID·담당자 이름·구분/소속·상태·메모)이 지금 값으로
// 채워져 열리고, 비밀번호 칸 대신 서비스별 배분 이용건수 구획이 아래에 붙는다(비밀번호는 [⋮] > [비밀번호 초기화] 몫이다).
//
// 칸과 검사 규칙은 등록 모달과 한 조각(SubAccountForm)을 쓴다. 계정 ID 는 로그인에 쓰는 값이라 바꿀 수 없어
// 잠근 칸으로 보여 준다 — 그래서 [중복확인] 도 없다.
//
// 유효성검사 — [저장하기] 를 누르면 걸린 칸마다 밑에 문구가 뜨고 첫 칸으로 이동한다.
//   · 담당자 이름·구분/소속 — 비었거나 띄어쓰기만 있으면 막는다(SubAccountForm).
//   · 서비스별 건수 — 비워 두면 막는다. 지금 값이 채워진 채 열리므로 비었다면 실수로 지운 것이라, 말없이
//     0건으로 저장하지 않고 다시 적게 한다. 배분하지 않으려면 0 을 적는다. 숫자 말고는 입력되지 않는다.
// 서비스 건수 칸은 시안에 필수 표시(*)가 가려져 있어 그대로 둔다 — 필수라는 사실은 칸의 required 가
// 스크린리더에 알리고, 비웠을 때의 문구가 무엇을 적을지 알린다.

const ID_PREFIX = 'sub-account-edit'

// 안내 박스 문구 — 시안 그대로다.
const SERVICE_USAGE_NOTICE =
    '마스터 계정은 서비스별 이용건수 한도를 지정하지 않습니다. 각 하위 계정에 필요한 만큼 이용건수를 배분하면, 배분한 건수만큼 하위 계정이 해당 서비스를 이용합니다. 단, 평가사업에서 지정한 이용기간이 만료된 서비스는 배분할 수 없습니다.'

const COUNT_UNIT = '건'

// 건수 칸을 비웠을 때의 문구 — 라벨이 서비스 이름이라 라벨로 만든 기본 문구("KTRS-FM 평가를 입력해 주세요.")로는
// 무엇을 적어야 하는지 드러나지 않는다.
const COUNT_REQUIRED_MESSAGE = '배분할 건수를 입력해 주세요. 배분하지 않으면 0을 입력합니다.'

// 건수 칸은 숫자만 받는다 — 붙여 넣은 글자와 앞자리 0 은 입력하는 자리에서 걷어 낸다(다른 건수 칸과 같은 방식).
const formatCount = (value: string) => value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')

// 서비스 한 가지의 건수 칸 이름 — 서비스 이름에는 띄어쓰기·괄호가 섞여 있어 순서로 붙인다.
const serviceUsageName = (index: number) => `serviceUsage-${index}`

// 상태 칸에서 온 값이 고를 수 있는 상태인지 — 폼 값은 문자열이라 계정에 넣기 전에 가려낸다.
const isSubAccountStatus = (value?: string): value is SubAccountStatus =>
    SUB_ACCOUNT_STATUS_FILTERS.some((option) => option.value === value)

// 모달이 열릴 때 칸에 채울 값 — 칸의 name 이 키다. 구분/소속은 카드 제목(지점명)과 같은 값이다.
const toDefaultValues = (item: SubAccountItem): Record<string, string> => ({
    accountId: item.accountId,
    managerName: item.managerName,
    organization: item.name,
    status: item.status,
    memo: item.detail.memo,
    ...Object.fromEntries(
        item.detail.serviceUsages.map((usage, index) => [serviceUsageName(index), String(usage.count)]),
    ),
})

// 검사를 통과한 값으로 고친 계정 한 건을 만든다 — 목록은 이 계정으로 카드를 바꿔 끼우기만 한다.
// 계정 ID 는 잠근 칸이라 바뀌지 않으므로 원래 값을 그대로 둔다. 글자 칸의 앞뒤 띄어쓰기는 걷어 낸다.
const toUpdatedItem = (item: SubAccountItem, values: Record<string, string>): SubAccountItem => ({
    ...item,
    managerName: values.managerName?.trim() ?? item.managerName,
    name: values.organization?.trim() ?? item.name,
    status: isSubAccountStatus(values.status) ? values.status : item.status,
    detail: {
        ...item.detail,
        memo: values.memo?.trim() ?? item.detail.memo,
        serviceUsages: item.detail.serviceUsages.map((usage, index) => ({
            ...usage,
            count: Number(values[serviceUsageName(index)] ?? usage.count),
        })),
    },
})

// 서비스 한 가지의 건수 칸 — 서비스 이름(16 Bold) 왼쪽, 이용기간(14) 오른쪽이 한 줄이고 아래에 건수 칸이 온다.
// 이용기간은 칸의 설명으로 이어 두어 칸에 들어가면 함께 읽힌다. 건수는 오른쪽으로 붙고 단위(건)가 상자 안에 따른다.
// 좁은 화면에서 이용기간이 이름 옆에 들어가지 않으면 아래 줄로 내려간다.
//
// 걸리면 칸 밑에 문구가 뜬다 — 테두리 색·aria-invalid·문구 연결(aria-describedby)은 입력 래퍼가 같은 id 로
// 건다[7.4.2]. 공용 Field(form-fields)를 쓰지 않는 이유는 라벨 줄 오른쪽에 이용기간이 붙기 때문이다.
const ServiceUsageField = ({index, usage}: {index: number; usage: SubAccountServiceUsage}) => {
    const id = `${ID_PREFIX}-usage-${index}`
    const periodId = `${id}-period`
    const error = useFieldError(id)

    return (
        <Field data-invalid={error ? true : undefined}>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <FieldLabel htmlFor={id}>{usage.service}</FieldLabel>
                <p id={periodId} className="typo-body-l-regular text-foreground-subtle">
                    이용기간 {usage.period}
                </p>
            </div>
            <InputGroup>
                <InputGroupInput
                    id={id}
                    name={serviceUsageName(index)}
                    required
                    inputMode="numeric"
                    autoComplete="off"
                    format={formatCount}
                    data-required-message={COUNT_REQUIRED_MESSAGE}
                    aria-describedby={periodId}
                    className="text-right"
                />
                <InputGroupAddon align="inline-end" className="text-foreground">
                    {COUNT_UNIT}
                </InputGroupAddon>
            </InputGroup>
            {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
        </Field>
    )
}

type SubAccountEditDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 바깥(목록)이 열림을 쥘 때. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** 고칠 계정. 지금 값이 칸에 채워져 열린다. 없으면 칸을 그리지 않는다. */
    item?: SubAccountItem
    /** [저장하기] 가 검사를 모두 통과했을 때 — 고친 값을 담은 계정이 온다. 수정 API 를 붙이는 자리다. */
    onSubmit?: (item: SubAccountItem) => void
}

const SubAccountEditDialog = ({
    children,
    defaultOpen,
    open,
    onOpenChange,
    item,
    onSubmit,
}: SubAccountEditDialogProps) => {
    // 바깥이 열림을 쥐지 않을 때(트리거·단독 화면)는 스스로 든다 — [저장하기] 뒤에 모달을 닫아야 해서다.
    const [isOpenState, setIsOpenState] = useState(defaultOpen ?? false)
    const isOpen = open ?? isOpenState
    const setOpen = (next: boolean) => {
        setIsOpenState(next)
        onOpenChange?.(next)
    }

    // [프론트엔드 연동] 검사를 통과한 값이 온다 — 이 자리를 수정 API 호출로 바꾸고, 성공했을 때만
    // 모달을 닫은 뒤 목록을 다시 받아 온다.
    const handleValid = (values: Record<string, string>) => {
        if (!item) return

        console.log('[하위 계정 수정] 제출 데이터', values)
        onSubmit?.(toUpdatedItem(item, values))
        setOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            {/* 본문이 폼 칸의 나열이라 따로 설명 문단을 두지 않는다 — radix 에 설명 없음을 알린다. */}
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>하위 계정 수정</DialogTitle>
                </DialogHeader>
                {item ? (
                    // 다른 계정을 열면 그 계정의 값으로 새로 채운다(key 로 보관소를 새로 만든다).
                    <FormValuesProvider key={item.id} defaultValues={toDefaultValues(item)}>
                        <SubAccountForm idPrefix={ID_PREFIX} isAccountIdReadOnly onValid={handleValid}>
                            {/* 서비스별 배분 이용건수 — 제목 · 안내 박스 · 서비스별 건수 칸이 16 간격으로 쌓인다(시안).
                                서비스는 그 기관의 이용서비스에서 나온다(상세정보 모달의 이용건수와 같은 목록). */}
                            <section aria-labelledby={`${ID_PREFIX}-usage-title`} className="flex flex-col gap-4">
                                <h3 id={`${ID_PREFIX}-usage-title`} className="typo-title-m-bold text-foreground">
                                    서비스별 배분 이용건수
                                </h3>
                                {/* 시안의 옅은 파랑 안내 박스(blue.50)는 Alert solid·info 와 같은 값이다.
                                    열 때마다 읽어 줄 경고가 아니라 늘 놓인 안내라 role 을 note 로 낮춘다[8.2.1]. */}
                                <Alert variant="solid" color="info" role="note">
                                    <CircleAlert aria-hidden="true" />
                                    <AlertDescription>{SERVICE_USAGE_NOTICE}</AlertDescription>
                                </Alert>
                                {item.detail.serviceUsages.map((usage, index) => (
                                    <ServiceUsageField key={usage.service} index={index} usage={usage} />
                                ))}
                            </section>
                        </SubAccountForm>
                    </FormValuesProvider>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}

export {SubAccountEditDialog}
export type {SubAccountEditDialogProps}
