'use client'

import {useMemo, useRef, useState, type ReactNode} from 'react'
import {CircleCheck, Eye, EyeOff} from 'lucide-react'
import {ActionBar, ActionBarCenter} from '@/components/composite/action-bar'
import {EditCancelConfirmDialog} from '@/components/composite/edit-cancel-confirm-dialog'
import {Field, FieldGrid, LockedField} from '@/components/composite/form-fields'
import {FormCard} from '@/components/composite/form-card'
import {useFormTabsSubmit} from '@/components/composite/form-tabs-submit'
import {
    ClearableInput,
    FormValuesProvider,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    TelInput,
    useFormValues,
} from '@/components/composite/form-values'
import {SaveConfirmDialog} from '@/components/composite/save-confirm-dialog'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {Button} from '@/components/ui/button'
import {InputGroupButton} from '@/components/ui/input-group'
import {
    ORG_MEMBER_BIZ_NO_FIELD,
    ORG_MEMBER_ID_FIELD,
    ORG_MEMBER_JOINED_AT_FIELD,
    ORG_MEMBER_KIND_FIELD,
    ORG_MEMBER_KINDS,
    ORG_MEMBER_MANAGER_FIELD,
    ORG_MEMBER_MASTER_FIELD,
    ORG_MEMBER_NAME_FIELD,
    ORG_MEMBER_PASSWORD_FIELD,
    ORG_MEMBER_PROGRAM_FIELD,
    ORG_MEMBER_PERIOD_FIELD,
    ORG_MEMBER_PROGRAMS,
    ORG_MEMBER_STATUS_FIELD,
    ORG_MEMBER_STATUSES,
    ORG_MEMBER_TEL_FIELD,
    type OrgMemberVoucher,
} from '@/constants/mypage-profile'

// 기관 마이페이지 내 정보 — 회원 계정 정보 묶음(시안 "① 기본 정보").
//
// 기업 화면(mypage-profile-form)과는 다른 폼이다. 기관 계정은 가입할 때 담당자가 만들어 주므로
// 회원이 직접 고칠 수 있는 것은 [담당자]·[전화번호]·[비밀번호] 셋뿐이고, 나머지는 보여 주기만 한다.
// 그 규칙을 칸 위 안내에 적어 두고, 고칠 수 없는 칸은 잠긴 모양(회색)으로 둔다 — 눌러도 바뀌지 않는
// 칸에 커서가 들어가면 왜 안 써지는지 알 수 없다.

const PROFILE_SECTION = 'org-profile'

// 기관구분·상태는 회원이 고르는 값이 아니라 서버가 정해 주는 값이다 — 눌러도 열리지 않게 두고,
// 제출에도 싣지 않는다(고칠 수 없는 값을 보내면 서버가 다시 검증해야 한다).
const LockedSelect = ({
    id,
    label,
    value,
    options,
    required,
    fullWidth,
}: {
    id: string
    label: string
    value: string
    options: readonly {value: string; label: string}[]
    required?: boolean
    fullWidth?: boolean
}) => (
    <Field id={id} label={label} required={required} className={fullWidth ? 'md:col-span-2' : undefined}>
        <Select value={value} disabled>
            <SelectTrigger id={id} className="w-full">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </Field>
)

// 비밀번호 — 가린 채로 두되 눈 아이콘으로 확인할 수 있게 한다. 길게 친 비밀번호를 눈으로 확인할
// 방법이 없으면 오타를 잡을 수 없다. 아이콘만 있는 버튼이라 이름을 따로 준다[5.1.1].
const PasswordField = () => {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <Field id={ORG_MEMBER_PASSWORD_FIELD} label="PW" required>
            <InputGroup>
                <InputGroupInput
                    id={ORG_MEMBER_PASSWORD_FIELD}
                    name={ORG_MEMBER_PASSWORD_FIELD}
                    type={isVisible ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                />
                {/* inline-end-fill — 버튼이 상자 오른쪽 끝을 꽉 채우는 배치(theme/input-group.variants). */}
                <InputGroupAddon align="inline-end-fill">
                    {/* icon-sm — 아이콘만 있는 버튼의 규격이다(정사각·최소 너비 없음·아이콘 20).
                        기본 size(xs)는 글자 버튼용이라 최소 너비 61 이 걸려 입력 칸을 밀어낸다.
                        aria-pressed 로 켜짐/꺼짐을 알리고, 이름은 누르면 일어날 일을 가리킨다. */}
                    <InputGroupButton
                        size="icon-sm"
                        aria-label={isVisible ? '비밀번호 가리기' : '비밀번호 표시'}
                        aria-pressed={isVisible}
                        onClick={() => setIsVisible((previous) => !previous)}
                    >
                        {isVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </Field>
    )
}

// 구획 카드 — 카드·제목·안쪽 여백은 기업 마이페이지 내 정보와 같다. 같은 화면의 다른 유형이라
// 생김새가 달라질 이유가 없다. FormCard 의 xl 기본 여백(102)은 폭 1200 카드에 맞춘 값이라 40 으로 덮는다.
const ProfileCard = ({title, children}: {title: string; children: ReactNode}) => (
    <FormCard title={title} className="[&_[data-slot=card-content]]:xl:px-10 [&_[data-slot=section-header]]:xl:px-10">
        {children}
    </FormCard>
)

const BasicSection = ({account}: {account: Record<string, string>}) => (
    <ProfileCard title="기본 정보">
        <div className="flex flex-col gap-4">
            {/* 무엇을 고칠 수 있는지 먼저 알린다 — 잠긴 칸이 여섯이라, 안내가 없으면 화면이 고장 난 것으로
                읽힌다. 잠긴 칸을 설명하는 안내라 기업 기업정보 탭의 "자동 입력되며 수정할 수 없습니다"
                안내와 같은 모양을 쓴다. */}
            <Alert variant="solid" color="info">
                <CircleCheck aria-hidden="true" />
                <AlertDescription>
                    기관회원 정보는 가입 시 담당자가 등록·관리합니다. 회원이 직접 수정할 수 있는 항목은 담당자 ·
                    전화번호 · 비밀번호(PW)이며, 그 외 항목의 변경이 필요할 경우 담당자에게 요청해 주세요.
                </AlertDescription>
            </Alert>

            <FieldGrid>
                <LockedField
                    id={ORG_MEMBER_NAME_FIELD}
                    label="기관명"
                    value={account[ORG_MEMBER_NAME_FIELD]}
                    required
                />
                <LockedField
                    id={ORG_MEMBER_BIZ_NO_FIELD}
                    label="사업자번호"
                    value={account[ORG_MEMBER_BIZ_NO_FIELD]}
                    required
                />

                <Field id={ORG_MEMBER_MANAGER_FIELD} label="담당자" required>
                    <ClearableInput
                        id={ORG_MEMBER_MANAGER_FIELD}
                        name={ORG_MEMBER_MANAGER_FIELD}
                        placeholder="담당자명을 입력해 주세요"
                        required
                        autoComplete="name"
                    />
                </Field>
                <Field id={ORG_MEMBER_TEL_FIELD} label="전화번호" required>
                    {/* 전화번호는 숫자만 받아 하이픈을 자동으로 넣는다 — 사람마다 다르게 적은 값이
                        그대로 제출되면 뒤에서 다시 정리해야 한다. */}
                    <TelInput
                        id={ORG_MEMBER_TEL_FIELD}
                        name={ORG_MEMBER_TEL_FIELD}
                        placeholder="전화번호를 입력해 주세요"
                        required
                        autoComplete="tel"
                    />
                </Field>

                <LockedSelect
                    id={ORG_MEMBER_KIND_FIELD}
                    label="기관구분"
                    value={account[ORG_MEMBER_KIND_FIELD]}
                    options={ORG_MEMBER_KINDS}
                    required
                />
                <LockedSelect
                    id={ORG_MEMBER_STATUS_FIELD}
                    label="상태"
                    value={account[ORG_MEMBER_STATUS_FIELD]}
                    options={ORG_MEMBER_STATUSES}
                    required
                />

                <LockedField id={ORG_MEMBER_ID_FIELD} label="ID" value={account[ORG_MEMBER_ID_FIELD]} required />
                <PasswordField />

                {/* 평가사업 선택 — 협약기관에만 있는 칸이다. 값이 없는 유형(협약은행 등)에서는 자리도
                    만들지 않는다 — 빈 칸을 잠긴 채로 두면 "있는데 안 채운 칸"으로 읽힌다. */}
                {account[ORG_MEMBER_PROGRAM_FIELD] ? (
                    <LockedSelect
                        id={ORG_MEMBER_PROGRAM_FIELD}
                        label="평가사업 선택"
                        value={account[ORG_MEMBER_PROGRAM_FIELD]}
                        options={ORG_MEMBER_PROGRAMS}
                        required
                        fullWidth
                    />
                ) : null}
            </FieldGrid>
        </div>
    </ProfileCard>
)

// 하위 계정 구획 — 상위 마스터 기관이 만들어 준 계정이라 보여 주는 칸이 다르다.
// 사업자번호·상태·평가사업 대신 [상위 마스터 기관]·[사업기간]·[가입/생성 일시]가 온다.
const SubAccountBasicSection = ({account}: {account: Record<string, string>}) => (
    <div className="flex flex-col gap-4">
        <Alert variant="solid" color="info">
            <CircleCheck aria-hidden="true" />
            <AlertDescription>
                하위 계정 정보는 상위 마스터 기관의 담당자가 등록·관리합니다. 이용권·사업기간은 상위 마스터 기관을
                따르며, 회원이 직접 수정할 수 있는 항목은 담당자 · 전화번호 · 비밀번호(PW)입니다.
            </AlertDescription>
        </Alert>

        <FieldGrid>
            <LockedField id={ORG_MEMBER_NAME_FIELD} label="기관명" value={account[ORG_MEMBER_NAME_FIELD]} required />
            {/* 기관구분은 상위 기관을 따르는 값이라 고르는 칸이 아니다 — 글자로만 보여 준다. */}
            <LockedField id={ORG_MEMBER_KIND_FIELD} label="기관구분" value={account[ORG_MEMBER_KIND_FIELD]} required />

            <LockedField id={ORG_MEMBER_ID_FIELD} label="ID" value={account[ORG_MEMBER_ID_FIELD]} required />
            <LockedField
                id={ORG_MEMBER_MASTER_FIELD}
                label="상위 마스터 기관"
                value={account[ORG_MEMBER_MASTER_FIELD]}
                required
            />

            <LockedField
                id={ORG_MEMBER_PERIOD_FIELD}
                label="사업기간"
                value={account[ORG_MEMBER_PERIOD_FIELD]}
                required
            />
            <LockedField
                id={ORG_MEMBER_JOINED_AT_FIELD}
                label="가입/생성 일시"
                value={account[ORG_MEMBER_JOINED_AT_FIELD]}
                required
            />

            <Field id={ORG_MEMBER_MANAGER_FIELD} label="담당자" required>
                <ClearableInput
                    id={ORG_MEMBER_MANAGER_FIELD}
                    name={ORG_MEMBER_MANAGER_FIELD}
                    placeholder="담당자명을 입력해 주세요"
                    required
                    autoComplete="name"
                />
            </Field>
            <Field id={ORG_MEMBER_TEL_FIELD} label="전화번호" required>
                <TelInput
                    id={ORG_MEMBER_TEL_FIELD}
                    name={ORG_MEMBER_TEL_FIELD}
                    placeholder="전화번호를 입력해 주세요"
                    required
                    autoComplete="tel"
                />
            </Field>

            <PasswordField />
        </FieldGrid>
    </div>
)

// 이용권 정보 — 배분받은 모형별 건수. 고칠 수 없는 값이라 입력 칸이 아니라 목록으로 둔다.
// 계정마다 다른 조회 값이라 화면(page)이 읽어 내려 준다 — 폼은 값의 출처를 알지 않는다.
const VoucherSection = ({vouchers}: {vouchers: readonly OrgMemberVoucher[]}) => (
    <div className="flex flex-col gap-4">
        <Alert variant="solid" color="info">
            <CircleCheck aria-hidden="true" />
            <AlertDescription>
                상위 마스터 기관으로부터 배분받은 모형별 지급 이용건입니다. 하위 계정은 마스터 계정이 배분한 건수만큼
                이용할 수 있습니다.
            </AlertDescription>
        </Alert>

        {/* 모형과 건수가 짝을 이루는 목록이라 dl 로 둔다 — 표로 만들 만큼 열이 많지 않다. */}
        <dl className="border-subtle-3 divide-subtle-3 divide-y rounded-sm border">
            {vouchers.map(({model, count}) => (
                <div key={model} className="flex items-center justify-between gap-4 px-6 py-4">
                    <dt className="typo-body-xl-bold text-foreground">{model}</dt>
                    <dd className="typo-body-l-regular text-foreground-subtle flex items-baseline gap-1">
                        지급 이용건
                        {/* 건수는 강조하되 본문 크기(16)를 넘기지 않는다 — 짧고 굵고 큰 글은 제목이 아닌데도
                            제목으로 읽혀(WAVE "Possible heading") 문서 구조를 어지럽힌다. */}
                        <span className="typo-body-xl-bold text-primary tabular-nums">{count}</span>건
                    </dd>
                </div>
            ))}
        </dl>
    </div>
)

// 화면에 들어올 때 꽂힌 값과 지금 값이 다른지 — [취소]·[저장] 이 함께 쓴다.
const useIsDirty = () => {
    const {values, defaultValues} = useFormValues()

    return useMemo(
        () =>
            [...new Set([...Object.keys(defaultValues), ...Object.keys(values)])].some(
                (name) => (values[name] ?? '') !== (defaultValues[name] ?? ''),
            ),
        [values, defaultValues],
    )
}

// 저장 버튼 — 고친 것이 있으면 연다. 값이 규칙에 맞는지는 누른 뒤에 본다(기업 화면과 같은 규칙).
const SaveButton = () => {
    const isDirty = useIsDirty()

    return (
        <Button type="submit" size="xl" disabled={!isDirty}>
            저장
        </Button>
    )
}

const CancelButton = () => {
    const {values, defaultValues, setValue, setFieldErrors} = useFormValues()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const isDirty = useIsDirty()

    const handleConfirm = () => {
        new Set([...Object.keys(defaultValues), ...Object.keys(values)]).forEach((name) =>
            setValue(name, defaultValues[name] ?? ''),
        )
        setFieldErrors({})
        setIsConfirmOpen(false)
    }

    return (
        <EditCancelConfirmDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen} onConfirm={handleConfirm}>
            <Button type="button" variant="tertiary" size="xl" disabled={!isDirty}>
                취소
            </Button>
        </EditCancelConfirmDialog>
    )
}

const OrgProfileFormBody = ({children}: {children: ReactNode}) => {
    const {handleSubmit} = useFormTabsSubmit({defaultTab: PROFILE_SECTION})
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const submittedValues = useRef<Record<string, string>>({})

    const handleValid = (values: Record<string, string>) => {
        submittedValues.current = values
        setIsConfirmOpen(true)
    }

    const handleSave = () => {
        // [프론트엔드 연동][저장] 회원정보 수정 API 는 이 자리에서 호출한다.
        console.log('[프론트엔드 연동][저장] 기관 마이페이지 내 정보', submittedValues.current)
        setIsConfirmOpen(false)
    }

    return (
        // id 는 화면의 "입력 폼 바로가기" 스킵 링크가 가리키는 자리다[6.4.1].
        <form
            id="profile-form"
            noValidate
            onSubmit={(event) => handleSubmit(event, handleValid)}
            className="flex flex-col"
        >
            {children}
            <SaveConfirmDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen} onSave={handleSave} />
        </form>
    )
}

// account — 화면(page)이 회원 계정 정보를 읽어 내려 준다. 폼은 값의 출처를 알지 않는다.
// variant — 하위 계정은 상위 기관이 만들어 준 계정이라 보여 주는 칸과 구획이 다르다.
// vouchers — 하위 계정에서만 쓰는 [이용권 정보] 목록. 그 화면이 함께 내려 준다.
const OrgMypageProfileForm = ({
    account,
    variant = 'default',
    vouchers = [],
}: {
    account: Record<string, string>
    variant?: 'default' | 'sub-account'
    vouchers?: readonly OrgMemberVoucher[]
}) => (
    <FormValuesProvider defaultValues={account}>
        <OrgProfileFormBody>
            {variant === 'sub-account' ? (
                // 구획 사이 60 — 기업 마이페이지의 [기업정보]·[기업 담당자 정보] 두 카드와 같은 간격이다.
                <div className="flex flex-col gap-15">
                    <ProfileCard title="기본 정보">
                        <SubAccountBasicSection account={account} />
                    </ProfileCard>
                    <ProfileCard title="이용권 정보">
                        <VoucherSection vouchers={vouchers} />
                    </ProfileCard>
                </div>
            ) : (
                <BasicSection account={account} />
            )}

            {/* 시안: 마지막 칸과 CTA 사이 100, 버튼 짝은 16 간격이다. */}
            <ActionBar className="mt-25">
                <ActionBarCenter className="gap-4">
                    <CancelButton />
                    <SaveButton />
                </ActionBarCenter>
            </ActionBar>
        </OrgProfileFormBody>
    </FormValuesProvider>
)

export default OrgMypageProfileForm
