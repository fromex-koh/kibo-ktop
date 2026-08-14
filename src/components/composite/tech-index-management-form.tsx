'use client'

import {Plus} from 'lucide-react'
import {FormCard} from '@/components/composite/form-card'
import {Field, FieldGrid} from '@/components/composite/form-fields'
import {
    ClearableInput,
    FormCardScope,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    useFormValues,
} from '@/components/composite/form-values'
import {RepeatCard, useRepeatCards} from '@/components/composite/repeat-card'
import {Button} from '@/components/ui/button'

// Tech-Index 창업용 [경영진 역량 및 구성] 탭 본문 —
// Figma "[혁신성장지수 (창업) Tech-Index] 2단계_경영진 역량 및 구성".
//
// 인력 카드가 반복되는 모양은 [기술 인력 현황](tech-staff-form)과 같지만 카드 안의 칸이 전혀 달라
// (이름 · 전문분야 · 최종학력 · 일치여부 · 자격증 · 경력년수) 별도 조각으로 둔다.
//
// 이 탭만의 규칙 — 카드 안내 문구 그대로다.
//   · 대표자 제외 최대 5명 → 다 채우면 [행추가] 가 비활성이 된다.
//   · 전문분야 중복 선택 불가 → 다른 카드가 이미 고른 전문분야는 그 카드의 목록에서 비활성으로 보인다.
//     목록에서 감추지 않고 비활성으로 두는 이유는, 사라지면 "왜 없지?" 가 되고 비활성이면 "이미 쓴 값" 이
//     그대로 보이기 때문이다(고른 카드를 지우면 다시 고를 수 있게 풀린다).

// 대표자를 제외한 경영진은 시안 안내대로 최대 5명까지다.
const MAX_MANAGEMENT_COUNT = 5

// 아래 세 목록은 시안에 [선택] 자리만 있어 따로 정한 값이다. value 는 화면에 보이지 않는 제출용 키라
// 영문 소문자로 둔다 — 실제 코드값이 정해지면 이 키만 바꾼다.
//
// [확인 필요] 전문분야 — 중복 선택을 막는 칸이라 값의 목록이 고정되어 있어야 한다. 경영진 구성을 보는
// 자리이므로 회사의 기능 영역으로 뒀다. 발주처 목록이 오면 이 배열만 바꾸면 화면·중복 규칙은 그대로 쓴다.
const SPECIALTY_OPTIONS = [
    {value: 'rnd', label: '기술·연구개발'},
    {value: 'production', label: '생산·품질'},
    {value: 'sales', label: '영업·마케팅'},
    {value: 'finance', label: '재무·회계'},
    {value: 'hr', label: '인사·총무'},
    {value: 'etc', label: '기타'},
] as const

// 최종학력 — 같은 모형의 [기술 인력 현황] 카드와 같은 항목이다.
const EDUCATION_OPTIONS = [
    {value: 'highSchool', label: '고졸'},
    {value: 'associate', label: '전문학사'},
    {value: 'bachelor', label: '학사'},
    {value: 'master', label: '석사'},
    {value: 'doctor', label: '박사'},
] as const

// 전공과 평가대상 기술 분야 일치여부 — 시안에는 고른 뒤의 모습(일치함)만 그려져 있어 두 갈래로 둔다.
const MAJOR_MATCH_OPTIONS = [
    {value: 'match', label: '일치함'},
    {value: 'mismatch', label: '일치하지 않음'},
] as const

// 자격증 — 기존 시스템의 셀렉트 옵션 그대로다(기술사·기능장·기사·산업기사·기능사·없음).
const CERTIFICATE_OPTIONS = [
    {value: 'professionalEngineer', label: '기술사'},
    {value: 'masterCraftsman', label: '기능장'},
    {value: 'engineer', label: '기사'},
    {value: 'industrialEngineer', label: '산업기사'},
    {value: 'craftsman', label: '기능사'},
    {value: 'none', label: '없음'},
] as const

// 경력년수 — 햇수만 받는다. inputMode="numeric" 은 모바일 키보드를 숫자판으로 바꿔 줄 뿐 글자 입력을
// 막지 못하므로(데스크톱 키보드·붙여넣기), 숫자가 아닌 것을 걷어내고 앞자리 0 도 정리한다.
const formatYears = (value: string) => value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')
const YEARS_PLACEHOLDER = '0'
const YEARS_UNIT = '년'

const managementField = (id: number, name: string) => `management-${id}-${name}`
const SPECIALTY = 'specialty'

type ManagementEntryProps = {
    id: number
    label: string
    /** "행추가" 로 늘린 카드인지 — 그 카드는 비어 있어도 처음부터 모두 필수다. */
    isAdded: boolean
    focusOnMount?: boolean
    /** 마지막 한 장 — 지우면 카드가 사라지는 대신 값만 비워진다. */
    isLastCard?: boolean
    onDelete: () => void
    cardRef: (node: HTMLDivElement | null) => void
    /** 다른 카드가 이미 고른 전문분야 — 이 카드의 목록에서 비활성으로 둔다. */
    takenSpecialties: ReadonlySet<string>
}

const ManagementEntry = ({
    id,
    label,
    isAdded,
    focusOnMount,
    isLastCard,
    onDelete,
    cardRef,
    takenSpecialties,
}: ManagementEntryProps) => {
    const field = (name: string) => managementField(id, name)
    const {setValue} = useFormValues()

    return (
        <RepeatCard
            ref={cardRef}
            title={label}
            // 이 탭은 폼 카드 제목(h2) 아래에 카드가 바로 온다 — 소제목이 없으므로 카드 제목이 h3 다.
            headingLevel={3}
            focusOnMount={focusOnMount}
            clearOnly={isLastCard}
            onDelete={onDelete}
        >
            <FormCardScope namePrefix={`management-${id}-`} alwaysRequired={isAdded}>
                {/* 시안은 카드 안이 2열 세 줄이다 — [이름 · 전문분야] / [최종학력 · 일치여부] / [자격증 · 경력년수]. */}
                <FieldGrid>
                    <Field id={field('name')} label="이름" required>
                        <ClearableInput
                            id={field('name')}
                            name={field('name')}
                            required
                            autoComplete="off"
                            placeholder="이름"
                        />
                    </Field>

                    {/* 전문분야 — 다른 카드가 고른 값은 비활성이다(카드 안내의 "전문분야 중복 선택 불가"). */}
                    <Field id={field(SPECIALTY)} label="전문분야" required>
                        <Select name={field(SPECIALTY)} required>
                            <SelectTrigger id={field(SPECIALTY)} className="w-full">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {SPECIALTY_OPTIONS.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        disabled={takenSpecialties.has(option.value)}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field id={field('education')} label="최종학력" required>
                        <Select name={field('education')} required>
                            <SelectTrigger id={field('education')} className="w-full">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {EDUCATION_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field id={field('majorMatch')} label="전공과 평가대상 기술 분야 일치여부" required>
                        <Select name={field('majorMatch')} required>
                            <SelectTrigger id={field('majorMatch')} className="w-full">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {MAJOR_MATCH_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field id={field('certificate')} label="자격증" required>
                        <Select name={field('certificate')} required>
                            <SelectTrigger id={field('certificate')} className="w-full">
                                <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {CERTIFICATE_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    {/* 경력년수 — 시안은 값을 오른쪽에 붙이고 단위를 상자 안에 둔다(같은 모형의 수량 칸과 같은 처리).
                        지워서 비운 칸은 벗어날 때 0 으로 돌려놓는다 — 자리 안내가 "0" 이라 비워 두면 화면에는
                        0 으로 보이는데 값은 비어 있어, 다 채운 것처럼 보이는데도 탭이 [작성중] 으로 남는다. */}
                    <Field id={field('careerYears')} label="경력년수" required>
                        <InputGroup>
                            <InputGroupInput
                                id={field('careerYears')}
                                name={field('careerYears')}
                                required
                                inputMode="numeric"
                                autoComplete="off"
                                placeholder={YEARS_PLACEHOLDER}
                                format={formatYears}
                                onBlur={(event) => {
                                    if (!event.currentTarget.value) setValue(field('careerYears'), YEARS_PLACEHOLDER)
                                }}
                                className="text-right"
                            />
                            <InputGroupAddon align="inline-end" className="text-foreground">
                                {YEARS_UNIT}
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>
                </FieldGrid>
            </FormCardScope>
        </RepeatCard>
    )
}

const TechIndexManagementForm = () => {
    const {values, clearValues} = useFormValues()
    const {ids, addedId, addCard, removeCard, setCardRef, addButtonRef, isLastCard, isAddDisabled} = useRepeatCards({
        maxCount: MAX_MANAGEMENT_COUNT,
        // 지운 칸의 값도 함께 버린다 — 남겨두면 제출 데이터에 유령 값이 섞이고, 그 카드가 잡고 있던
        // 전문분야도 계속 막혀 다시 고를 수 없게 된다.
        onRemove: (id) => clearValues(`management-${id}-`),
    })

    // 카드마다 "나를 뺀 나머지 카드가 고른 전문분야" 를 넘긴다 — 내가 고른 값은 내 목록에서 막지 않는다
    // (막으면 이미 고른 값이 비활성으로 보여 바꾸려 할 때 무엇이 선택돼 있는지 알기 어렵다).
    const takenSpecialtiesOf = (cardId: number) =>
        new Set(
            ids
                .filter((otherId) => otherId !== cardId)
                .map((otherId) => values[managementField(otherId, SPECIALTY)])
                .filter((value) => Boolean(value)),
        )

    return (
        <FormCard
            title="경영진 역량 및 구성"
            subtitle="현재 귀사에 재직중인 기술인력의 최종학력, 동업종 경력년수를 입력해 주세요. 대표자 제외 최대 5명 / 전문분야 중복 선택 불가"
        >
            <div className="flex flex-col gap-6">
                {ids.map((id, index) => (
                    <ManagementEntry
                        key={id}
                        id={id}
                        cardRef={setCardRef(id)}
                        label={`구분${index + 1}`}
                        isAdded={index > 0}
                        focusOnMount={id === addedId}
                        isLastCard={isLastCard}
                        onDelete={() => removeCard(id)}
                        takenSpecialties={takenSpecialtiesOf(id)}
                    />
                ))}
                {/* 행추가 — 시안은 카드 폭 전체를 채우는 primary 버튼이다. */}
                <Button
                    type="button"
                    ref={addButtonRef}
                    size="sm"
                    className="w-full"
                    disabled={isAddDisabled}
                    onClick={addCard}
                >
                    행추가
                    <Plus aria-hidden="true" />
                </Button>
            </div>
        </FormCard>
    )
}

export default TechIndexManagementForm
