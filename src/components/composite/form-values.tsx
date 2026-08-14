'use client'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    useSyncExternalStore,
    type ReactNode,
} from 'react'
import {format, parseISO} from 'date-fns'
import {DatePicker as BaseDatePicker} from '@/components/composite/date-picker'
import {ClearableInput as BaseClearableInput} from '@/components/composite/clearable-input'
import {Select as BaseSelect, SelectTrigger as BaseSelectTrigger} from '@/components/composite/select-field'
import {Input as BaseInput} from '@/components/ui/input'
import {InputGroupInput as BaseInputGroupInput} from '@/components/ui/input-group'
import {RadioGroup as BaseRadioGroup} from '@/components/ui/radio-group'
import {Textarea as BaseTextarea} from '@/components/ui/textarea'
import {BUSINESS_NUMBER_PATTERN, formatBusinessNumber} from '@/lib/business-number'
import {CORPORATE_NUMBER_PATTERN, formatCorporateNumber} from '@/lib/corporate-number'
import {PATENT_NUMBER_PATTERN, formatPatentNumber} from '@/lib/patent-number'
import {formatPhoneNumber} from '@/lib/phone'

// 폼 값 보관소(FormValues) — 입력값을 `name` 을 키로 한 객체 하나에 모아 둔다.
//
// 왜 필요한가 — FormTabs 는 화면 폭에 따라 가로 탭 / 세로 펼침 목록 / 모바일 고정 한 줄로 형태가 바뀌고,
// xl(1280) 을 넘나들 때는 그 안쪽이 다시 그려진다. 값이 DOM 에만 있으면(비제어 입력) 그때 사라지므로,
// 값을 이렇게 바깥 상태로 올려 두면 다시 그려져도 그대로 복원된다.
//
// 프론트엔드 연동 시 — 이 파일은 퍼블리싱 데모용 최소 구현이다. 실제로는
//   1) FormValuesProvider 를 react-hook-form 의 FormProvider 등으로 바꾸고,
//   2) 아래 입력 래퍼(Input · ClearableInput · DatePicker · Select)의 value/onChange 연결만
//      register/Controller 로 바꾸면 된다.
// 화면(JSX)은 손대지 않아도 된다 — 화면은 이 래퍼들을 `name` 만 주고 쓰기 때문이다.
// 값의 키는 각 입력의 `name` 이라 FormData 로 제출했을 때의 키와 정확히 같다.
//
// ⚠️ 검사 기준이 두 갈래라는 점에 유의 — 탭의 작성 상태(미작성·작성중·작성완료)는 이 보관소의
// 등록 정보(useRegisterField)를 보고, [다음] 의 제출 검사(form-tabs-submit)는 DOM 의 required·validity 를
// 본다. 지금은 모든 컨트롤이 이 파일의 래퍼를 거치며 두 곳에 같은 정보를 심으므로 어긋나지 않지만,
// 래퍼를 거치지 않은 컨트롤(ui/input 직접 사용 등)을 탭 화면에 추가하면 "제출은 통과하는데 탭은
// 작성중" 같은 어긋남이 생긴다. 탭 화면의 입력은 반드시 이 래퍼를 쓰고, 폼 라이브러리 이관 시에는
// 스키마 하나(react-hook-form + zod 등)에서 두 검사가 함께 파생되도록 통합할 것.
type FormValuesState = {
    values: Record<string, string>
    // 화면이 처음 열릴 때 들어 있던 값(기업 기타 정보의 0 등) — 작성 상태에서 "손댄 칸" 을 가릴 때 쓴다.
    defaultValues: Record<string, string>
    setValue: (name: string, value: string) => void
    // 반복 항목을 지울 때 그 항목의 값도 함께 버린다 — 이름이 접두사로 시작하는 값을 모두 지운다.
    clearValues: (namePrefix: string) => void
    // 값 말고 "칸" 목록 — 작성 상태를 세려면 어느 섹션에 몇 칸이 있는지 알아야 한다(아래 참고).
    fields: FieldRegistry
    // 유효성 검사 메시지 — 제출할 때 채우고, 그 칸을 고치면 지운다.
    // 키는 입력의 id 다(라벨의 htmlFor 가 가리키는 그 id) — 메시지를 그 칸 바로 밑에 붙여야 하기 때문이다.
    errors: Record<string, string>
    setFieldErrors: (errors: Record<string, string>) => void
    // 한 칸의 메시지만 더한다 — 칸을 벗어날 때(blur) 형식 검사에 걸린 칸이 스스로 붙일 때 쓴다.
    // setFieldErrors 는 제출이 전체를 갈아끼우는 용도라, 개별 칸이 쓰면 다른 칸의 메시지가 지워진다.
    setFieldError: (id: string, message: string) => void
    clearFieldError: (id: string) => void
}

// 칸 목록(fields) — 값이 아니라 "어떤 칸이 어느 섹션에 있고 필수인지" 를 모은다.
// 값만으로는 작성 상태를 셀 수 없다 — 아직 아무것도 안 쓴 칸은 값 객체에 아예 없기 때문에,
// "미작성 / 작성중 / 작성완료" 를 가르려면 전체 칸 수를 알아야 한다.
// 등록은 각 입력이 화면에 붙을 때(마운트) 스스로 하고, 사라지면 함께 빠진다 — 반복 카드를 추가·삭제해도
// 자동으로 따라온다. React 상태가 아니라 작은 보관소(구독형)로 둔 이유는, 칸 수십 개가 한꺼번에
// 등록될 때 상태 갱신이 연쇄되지 않게 하기 위해서다.
// invalid — 값은 채웠지만 형식·규칙이 어긋난 상태. 작성 상태를 "작성완료" 로 넘기지 않기 위해 함께 센다.
// addedCard — 사용자가 "행추가" 로 늘린 카드에 속한 칸(FormCardScope 참고). 비어 있어도 손댄 탭으로 본다.
type FormFieldMeta = {section: string; required: boolean; invalid: boolean; addedCard: boolean}
type FormFieldMap = ReadonlyMap<string, FormFieldMeta>

const EMPTY_FIELDS: FormFieldMap = new Map()

const createFieldRegistry = () => {
    const fields = new Map<string, FormFieldMeta>()
    const listeners = new Set<() => void>()
    let snapshot: FormFieldMap = EMPTY_FIELDS

    const emit = () => {
        snapshot = new Map(fields)
        listeners.forEach((listener) => listener())
    }

    return {
        subscribe: (listener: () => void) => {
            listeners.add(listener)

            return () => {
                listeners.delete(listener)
            }
        },
        getSnapshot: () => snapshot,
        register: (name: string, meta: FormFieldMeta) => {
            fields.set(name, meta)
            emit()

            return () => {
                fields.delete(name)
                emit()
            }
        },
    }
}

type FieldRegistry = ReturnType<typeof createFieldRegistry>

const FormValuesContext = createContext<FormValuesState | null>(null)

// 섹션 이름 — 이 아래에 놓인 입력들이 한 섹션(폼 탭 한 개)에 속한다. FormTabs 가 탭마다 씌운다.
const FormFieldSectionContext = createContext<string | null>(null)

// 날짜 입력이 상태에 담기는 형식 — FormData 로 제출되는 값과 같게 맞춘다.
// 월 단위 칸(granularity="month")은 연월까지만 담는다 — 브라우저의 month 입력이 보내는 값과 같은 형식이다.
const DATE_VALUE_FORMAT = 'yyyy-MM-dd'
const MONTH_VALUE_FORMAT = 'yyyy-MM'

const FormValuesProvider = ({
    defaultValues,
    children,
}: {
    defaultValues?: Record<string, string>
    children: ReactNode
}) => {
    const [values, setValues] = useState<Record<string, string>>(defaultValues ?? {})
    // 처음 값은 한 번만 붙잡아 둔다 — 뒤에 부모가 다른 객체를 넘겨도 기준이 흔들리지 않는다.
    const [initialValues] = useState(() => defaultValues ?? {})
    const setValue = useCallback((name: string, value: string) => {
        setValues((previous) => ({...previous, [name]: value}))
    }, [])
    const [fields] = useState(createFieldRegistry)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const clearValues = useCallback((namePrefix: string) => {
        setValues((previous) =>
            Object.fromEntries(Object.entries(previous).filter(([name]) => !name.startsWith(namePrefix))),
        )
        // 값과 함께 그 칸의 검사 메시지도 거둔다 — 비운 칸에 빨간 문구가 남으면 무엇을 고치라는 건지 알 수 없다.
        // 카드의 값 이름과 컨트롤 id 는 같은 앞부분을 쓴다(career-1-…).
        setErrors((previous) =>
            Object.fromEntries(Object.entries(previous).filter(([id]) => !id.startsWith(namePrefix))),
        )
    }, [])
    const clearFieldError = useCallback((id: string) => {
        setErrors((previous) =>
            previous[id] ? Object.fromEntries(Object.entries(previous).filter(([key]) => key !== id)) : previous,
        )
    }, [])
    const setFieldError = useCallback((id: string, message: string) => {
        setErrors((previous) => (previous[id] === message ? previous : {...previous, [id]: message}))
    }, [])
    const state = useMemo(
        () => ({
            values,
            defaultValues: initialValues,
            setValue,
            clearValues,
            fields,
            errors,
            setFieldErrors: setErrors,
            setFieldError,
            clearFieldError,
        }),
        [values, initialValues, setValue, clearValues, fields, errors, setFieldError, clearFieldError],
    )

    return <FormValuesContext.Provider value={state}>{children}</FormValuesContext.Provider>
}

// 섹션 한 칸 — 이 안의 입력이 어느 섹션 소속인지 알린다.
const FormFieldSection = ({name, children}: {name: string; children: ReactNode}) => (
    <FormFieldSectionContext.Provider value={name}>{children}</FormFieldSectionContext.Provider>
)

// 반복 카드 한 장의 범위 — 그 안의 "필수" 를 칸이 아니라 카드 단위로 해석한다.
//
// 규칙(경력사항·핵심 기술 인력 현황·기술 개발 실적) — 카드는 전부 비우거나 전부 채우거나 둘 중 하나다.
//   · 기본으로 주어지는 첫 카드는 손대지 않았으면 검사하지 않는다. 쓸 것이 없는 사용자가 빈 카드
//     하나 때문에 다음 단계로 못 넘어가면 안 되기 때문이다. 한 칸이라도 채우면 그때부터 나머지 칸이
//     모두 필수가 된다 — 반쯤 적힌 경력은 그 자체로 쓸 수 없는 값이다.
//   · "행추가" 로 늘린 카드는 처음부터 모두 필수다(alwaysRequired). 사용자가 일부러 만든 카드를 빈 채로
//     통과시키면 화면에는 있고 제출 데이터에는 없는 카드가 된다. 쓰지 않을 카드는 비우는 게 아니라 지운다.
//
// 라벨의 * 는 늘 보인다 — 카드를 채우기 시작하면 필수가 되는 칸이 무엇인지 미리 알려 준다.
type FormCardScopeState = {namePrefix: string; alwaysRequired: boolean}

const FormCardScopeContext = createContext<FormCardScopeState | null>(null)

const FormCardScope = ({
    namePrefix,
    alwaysRequired,
    children,
}: {
    /** 이 카드에 속한 값의 이름 앞부분(예: career-1-). 카드가 비었는지 판단하는 데 쓴다. */
    namePrefix: string
    /** 사용자가 추가한 카드인지. 참이면 비어 있어도 처음부터 모두 필수다. */
    alwaysRequired?: boolean
    children: ReactNode
}) => {
    const scope = useMemo(() => ({namePrefix, alwaysRequired: Boolean(alwaysRequired)}), [namePrefix, alwaysRequired])

    return <FormCardScopeContext.Provider value={scope}>{children}</FormCardScopeContext.Provider>
}

// 이 칸에 실제로 걸리는 필수 여부 — 카드 밖에서는 받은 값을 그대로 쓴다.
//
// "손댔다" 의 기준은 빈칸이 아닌 것이 아니라 처음 값과 달라진 것이다. 카드 안에 처음부터 값이 들어 있는
// 칸이 있으면(특허 카드의 수량 0) 그 값 때문에 카드가 손댄 것으로 잡혀, 아무것도 하지 않은 사용자에게
// 나머지 칸이 모두 필수가 된다 — 쓸 특허가 없는 기업이 빈 카드 하나 때문에 막히면 안 된다.
const useCardRequired = (required?: boolean) => {
    const scope = useContext(FormCardScopeContext)
    const state = useContext(FormValuesContext)
    if (!required || !scope || scope.alwaysRequired) return required

    return Object.entries(state?.values ?? {}).some(
        ([name, value]) => name.startsWith(scope.namePrefix) && value !== '' && value !== state?.defaultValues[name],
    )
}

// 값을 담는 칸을 섹션 목록에 등록한다. 보관소 밖(단독 예시)이나 섹션 밖에서는 아무것도 하지 않는다.
// 읽기 전용·비활성 칸은 사용자가 쓰는 칸이 아니므로 세지 않는다(자동 입력 주소·계산된 연환산 매출액 등).
// 단, 읽기 전용이어도 필수라면 센다 — 업종코드처럼 [조회] 버튼으로 반드시 채워야 하는 칸이다.
const useRegisterField = (
    name: string | undefined,
    options: {required?: boolean; readOnly?: boolean; invalid?: boolean},
) => {
    const registry = useContext(FormValuesContext)?.fields
    const section = useContext(FormFieldSectionContext)
    const addedCard = useContext(FormCardScopeContext)?.alwaysRequired ?? false
    // 작성완료 판정에 세는 것은 required 를 붙인 칸뿐이다 — 화면에 필수라고 표시한 것과 같은 기준이다.
    // 지정하지 않은 칸까지 필수로 보면, 필수 칸이 하나도 없는 탭만 "전부 채워야 완료" 가 되어
    // 탭마다 기준이 달라진다.
    const required = Boolean(options.required)
    const invalid = Boolean(options.invalid)
    const isTracked = Boolean(name && section && registry) && (!options.readOnly || Boolean(options.required))

    useEffect(() => {
        if (!isTracked || !registry || !name || !section) return

        return registry.register(name, {section, required, invalid, addedCard})
    }, [isTracked, registry, name, section, required, invalid, addedCard])
}

// 섹션별 작성 상태 — 시안의 탭 상태 세 가지를 값에서 그대로 계산한다.
//   미작성  : 이 탭에 손댄 흔적이 없음 — 처음 값 그대로이고 늘린 카드도 없다
//   작성중  : 쓰다 만 상태(필수 칸이 남았거나, 채웠어도 어긋난 값이 있음)
//   작성완료: 필수 칸을 모두 채웠고 어긋난 값이 없음
type FormSectionStatus = 'done' | 'writing' | 'todo'

const getSectionStatuses = (
    fields: FormFieldMap,
    values: Record<string, string>,
    defaultValues: Record<string, string>,
) => {
    const entries = [...fields.entries()]
    const sections = [...new Set(entries.map(([, meta]) => meta.section))]
    const isFilled = ([name]: [string, FormFieldMeta]) => (values[name] ?? '') !== ''
    // 손댄 칸 — 처음 값과 달라진 칸만 센다. 기본으로 넣어 둔 값(수량 칸의 0)은 사용자가 쓴 것이 아니라서,
    // 그대로 두면 열자마자 "작성중" 으로 보인다.
    // 카드를 늘려 놓고 비워 둔 것도 손댄 것으로 센다 — 그 카드는 채워야 다음으로 넘어갈 수 있는데
    // 탭만 "미작성" 으로 보이면 왜 막히는지 알 수 없다.
    const isTouched = ([name, meta]: [string, FormFieldMeta]) =>
        (values[name] ?? '') !== (defaultValues[name] ?? '') || meta.addedCard
    const statuses: [string, FormSectionStatus][] = sections.map((section) => {
        const sectionFields = entries.filter(([, meta]) => meta.section === section)
        if (!sectionFields.some(isTouched)) return [section, 'todo']
        // 어긋난 값이 하나라도 있으면 아직 끝난 게 아니다 — 다 채웠어도 고쳐야 할 것이 남아 있다.
        if (sectionFields.some(([, meta]) => meta.invalid)) return [section, 'writing']

        return [section, sectionFields.filter(([, meta]) => meta.required).every(isFilled) ? 'done' : 'writing']
    })

    return Object.fromEntries(statuses)
}

const subscribeToNothing = () => () => undefined
const getEmptyFields = () => EMPTY_FIELDS

const useSectionStatuses = (): Record<string, FormSectionStatus> => {
    const state = useContext(FormValuesContext)
    const registry = state?.fields
    // 등록은 마운트 이후(클라이언트)에 일어나므로 서버 렌더에서는 빈 목록이다 — 그때는 상태를 계산하지 않는다.
    const fields = useSyncExternalStore(
        registry?.subscribe ?? subscribeToNothing,
        registry?.getSnapshot ?? getEmptyFields,
        getEmptyFields,
    )
    const values = state?.values
    const defaultValues = state?.defaultValues

    return useMemo(() => getSectionStatuses(fields, values ?? {}, defaultValues ?? {}), [fields, values, defaultValues])
}

// 보관소 전체 — 제출 화면처럼 모인 값을 한꺼번에 봐야 할 때 쓴다.
const useFormValues = () => {
    const state = useContext(FormValuesContext)
    if (!state) throw new Error('useFormValues 는 FormValuesProvider 안에서만 쓸 수 있습니다.')

    return state
}

// 입력 한 칸이 쓰는 값과 갱신 함수. 보관소 밖에서 쓰면 비제어 입력 그대로 동작한다
// (가이드의 단독 예시처럼 값을 모을 필요가 없는 곳).
const useFieldValue = (name?: string) => {
    const state = useContext(FormValuesContext)
    if (!state || !name) return null

    return {value: state.values[name] ?? '', setValue: (value: string) => state.setValue(name, value)}
}

// 입력 형식 보정 — 저장하기 전에 값을 다듬는다(전화번호 하이픈·숫자만 남기기 등).
// 보정한 값이 그대로 상태에 담기므로 화면 표시와 제출 값이 항상 같다.
// react-hook-form 으로 옮길 때는 register 의 setValueAs 나 Controller 의 onChange 자리에 그대로 넣으면 된다.
type FormatValue = (value: string, previousValue: string) => string

const applyFormat = (value: string, previousValue: string, format?: FormatValue) =>
    format ? format(value, previousValue) : value

// 값은 채웠지만 형식이 어긋났는지 — 브라우저 기본 검사(type="email" 등)를 그대로 읽는다.
// checkValidity() 는 invalid 이벤트를 함께 쏘므로 부작용 없는 validity.valid 를 본다.
const useInvalidState = () => {
    const [invalid, setInvalid] = useState(false)
    // format 이 있는 입력은 브라우저가 받은 원본 값과 화면에 저장될 보정값이 다를 수 있다.
    // 등록번호처럼 숫자를 입력한 뒤 하이픈을 붙이는 칸을 원본 값으로 검사하면, 화면 값은 정상이어도
    // 중간 입력 상태의 patternMismatch 가 남아 탭이 계속 "작성중" 으로 표시된다.
    const check = (control: HTMLInputElement | HTMLTextAreaElement, formattedValue = control.value) => {
        if (formattedValue === control.value) {
            setInvalid(!control.validity.valid)

            return
        }

        const originalValue = control.value
        control.value = formattedValue
        const nextInvalid = !control.validity.valid
        control.value = originalValue
        setInvalid(nextInvalid)
    }

    return {invalid, check}
}

// 이 칸의 검사 메시지. Field 가 입력 밑에 메시지를 그릴 때 쓴다.
const useFieldError = (id?: string) => {
    const state = useContext(FormValuesContext)

    return id ? state?.errors[id] : undefined
}

// 이 칸의 제출 검사 메시지를 지운다 — 칸이 스스로 "이제 문제없다" 를 알 때 쓴다.
// 값을 고치면 입력 래퍼가 알아서 지우지만, 짝이 되는 칸을 고쳐 이 칸이 함께 맞게 된 경우에는
// 이 칸의 값이 그대로라 지워지지 않는다.
const useClearFieldError = (id?: string) => {
    const clearFieldError = useContext(FormValuesContext)?.clearFieldError

    return useCallback(() => {
        if (id) clearFieldError?.(id)
    }, [id, clearFieldError])
}

// 메시지가 있는 동안 입력에 붙일 것들 — 오류 표시와 메시지 연결[7.4.2].
// clear 는 값을 고치는 순간 메시지를 거두는 데 쓴다(고쳤는데 빨간 문구가 남아 있으면 안 된다).
// 이메일 형식 문구 — blur 검사와 제출 검사(form-tabs-submit)가 같은 문장을 쓴다.
const EMAIL_FORMAT_MESSAGE = '이메일 형식이 올바르지 않습니다. (예: user@example.com)'

const useFieldValidation = (id?: string, describedBy?: string) => {
    const state = useContext(FormValuesContext)
    const message = id ? state?.errors[id] : undefined
    const clearFieldError = state?.clearFieldError
    const setFieldError = state?.setFieldError
    const clear = useCallback(() => {
        if (id) clearFieldError?.(id)
    }, [id, clearFieldError])

    // 칸을 벗어날 때(blur) 형식 검사 — 값은 채웠는데 형식이 어긋난 칸은 제출 전까지 아무 표시가 없어,
    // 화면상으로는 다 채운 것 같은데 탭만 [작성중] 으로 남는다("1월" 처럼 자릿수가 모자란 등록 월 등).
    // 그 칸을 떠나는 순간 무엇이 어긋났는지 바로 알려 준다[7.4.2]. 빈 칸은 여기서 다루지 않는다 —
    // "필수" 는 아직 쓰는 중일 수 있어, 제출할 때 한꺼번에 검사한다(form-tabs-submit).
    // 값을 고치기 시작하면 메시지는 걷힌다(onChange 의 clear).
    const checkOnBlur = useCallback(
        (control: HTMLInputElement | HTMLTextAreaElement) => {
            if (!id || !setFieldError || !control.value || control.validity.valid) return

            const patternMessage = control.dataset.patternMessage
            if (control.validity.patternMismatch && patternMessage) setFieldError(id, patternMessage)
            else if (control.validity.typeMismatch && control.type === 'email') setFieldError(id, EMAIL_FORMAT_MESSAGE)
        },
        [id, setFieldError],
    )

    return {
        props: message
            ? {'aria-invalid': true, 'aria-describedby': [describedBy, `${id}-error`].filter(Boolean).join(' ')}
            : {},
        clear,
        checkOnBlur,
    }
}

type InputProps = Parameters<typeof BaseInput>[0] & {format?: FormatValue}

const Input = ({name, format, onChange, onBlur, ...props}: InputProps) => {
    const field = useFieldValue(name)
    const invalidState = useInvalidState()
    const required = useCardRequired(props.required)
    useRegisterField(name, {required, readOnly: props.readOnly ?? props.disabled, invalid: invalidState.invalid})
    const validation = useFieldValidation(props.id, props['aria-describedby'])

    return (
        <BaseInput
            {...props}
            required={required}
            {...validation.props}
            name={name}
            value={field ? field.value : props.value}
            onChange={(event) => {
                const nextValue = applyFormat(event.currentTarget.value, field?.value ?? '', format)
                field?.setValue(nextValue)
                invalidState.check(event.currentTarget, nextValue)
                validation.clear()
                onChange?.(event)
            }}
            onBlur={(event) => {
                validation.checkOnBlur(event.currentTarget)
                onBlur?.(event)
            }}
        />
    )
}

type ClearableInputProps = Parameters<typeof BaseClearableInput>[0] & {format?: FormatValue}

const ClearableInput = ({name, format, onChange, onBlur, ...props}: ClearableInputProps) => {
    const field = useFieldValue(name)
    const invalidState = useInvalidState()
    const required = useCardRequired(props.required)
    useRegisterField(name, {required, readOnly: props.readOnly ?? props.disabled, invalid: invalidState.invalid})
    const validation = useFieldValidation(props.id, props['aria-describedby'])

    return (
        <BaseClearableInput
            {...props}
            required={required}
            {...validation.props}
            name={name}
            value={field ? field.value : props.value}
            onChange={(event) => {
                const nextValue = applyFormat(event.currentTarget.value, field?.value ?? '', format)
                field?.setValue(nextValue)
                invalidState.check(event.currentTarget, nextValue)
                validation.clear()
                onChange?.(event)
            }}
            onBlur={(event) => {
                validation.checkOnBlur(event.currentTarget)
                onBlur?.(event)
            }}
        />
    )
}

// 전화번호 입력 — 숫자만 받아 하이픈을 자동으로 넣는다(02-1234-5678 · 010-1234-5678 · 1588-1234).
// 형식 보정 함수를 사용처가 아니라 여기에 두는 이유 — 함수는 서버 컴포넌트에서 클라이언트 컴포넌트로
// 넘길 수 없다. 이렇게 감싸 두면 화면이 서버 컴포넌트여도 <TelInput name="..."/> 한 줄로 쓸 수 있다.
//
// maxLength 는 두지 않는다 — 자릿수 제한은 formatPhoneNumber 한 곳에서만 한다. 브라우저의 글자 수 제한을
// 함께 걸면 형식에 맞지 않아 곧 버려질 글자까지 세어, 정작 필요한 숫자가 막힌다.
const TelInput = (props: Omit<ClearableInputProps, 'format' | 'type' | 'maxLength'>) => (
    <ClearableInput inputMode="tel" {...props} format={formatPhoneNumber} />
)

// 사업자등록번호 입력 — 숫자만 받아 3-2-5 로 하이픈을 넣는다(123-45-67890). TelInput 과 같은 구조다.
// 형식이 덜 채워진 채로 제출되는 것은 pattern 이 막고, 그때 띄울 문구는 data-pattern-message 로 함께 준다
// (브라우저 기본 문구는 무엇이 어긋났는지 알려 주지 않는다 — form-tabs-submit 참고).
const BUSINESS_NUMBER_MESSAGE = '사업자번호 10자리를 모두 입력해 주세요. (예: 123-45-67890)'

const BusinessNumberInput = (props: Omit<ClearableInputProps, 'format' | 'type' | 'maxLength' | 'pattern'>) => (
    <ClearableInput
        inputMode="numeric"
        {...props}
        pattern={BUSINESS_NUMBER_PATTERN}
        data-pattern-message={BUSINESS_NUMBER_MESSAGE}
        format={formatBusinessNumber}
    />
)

// 법인등록번호 입력 — 숫자만 받아 6-7 로 하이픈을 넣는다(110111-1234567). BusinessNumberInput 과 같은 구조다.
const CORPORATE_NUMBER_MESSAGE = '법인번호 13자리를 모두 입력해 주세요. (예: 110111-1234567)'

const CorporateNumberInput = (props: Omit<ClearableInputProps, 'format' | 'type' | 'maxLength' | 'pattern'>) => (
    <ClearableInput
        inputMode="numeric"
        {...props}
        pattern={CORPORATE_NUMBER_PATTERN}
        data-pattern-message={CORPORATE_NUMBER_MESSAGE}
        format={formatCorporateNumber}
    />
)

// 특허번호 입력 — 숫자만 받아 2-4-7 로 하이픈을 넣는다(10-2023-0000001). 위 둘과 같은 구조다.
const PATENT_NUMBER_MESSAGE = '등록번호 13자리를 모두 입력해 주세요. (예: 10-2023-0000001)'

const PatentNumberInput = (props: Omit<ClearableInputProps, 'format' | 'type' | 'maxLength' | 'pattern'>) => (
    <ClearableInput
        inputMode="numeric"
        {...props}
        pattern={PATENT_NUMBER_PATTERN}
        data-pattern-message={PATENT_NUMBER_MESSAGE}
        format={formatPatentNumber}
    />
)

type DatePickerProps = Parameters<typeof BaseDatePicker>[0]

// 날짜는 상태에 문자열(yyyy-MM-dd)로 담고 여기서 Date 로 되돌린다 — 상태 한 벌로 값을 다루기 위해서다.
const DatePicker = ({name, onChange, ...props}: DatePickerProps) => {
    const field = useFieldValue(name)
    const required = useCardRequired(props.required)
    // 달력은 글자를 받지 않으니 브라우저 형식 검사가 걸릴 일이 없다 — 대신 화면이 넘겨 준 규칙 위반
    // (짝이 되는 칸과의 앞뒤 순서·기간)을 어긋난 값으로 센다.
    useRegisterField(name, {
        required,
        readOnly: props.readOnly ?? props.disabled,
        invalid: Boolean(props.validationMessage),
    })
    const validation = useFieldValidation(props.id, props['aria-describedby'])
    const valueFormat = props.granularity === 'month' ? MONTH_VALUE_FORMAT : DATE_VALUE_FORMAT

    return (
        <BaseDatePicker
            {...props}
            controlled={Boolean(field)}
            required={required}
            {...validation.props}
            name={name}
            value={field ? (field.value ? parseISO(field.value) : undefined) : props.value}
            onChange={(date) => {
                field?.setValue(date ? format(date, valueFormat) : '')
                validation.clear()
                onChange?.(date)
            }}
        />
    )
}

type InputGroupInputProps = Parameters<typeof BaseInputGroupInput>[0] & {format?: FormatValue}

// 단위(명·건·백만원)가 붙는 입력 — 상자 안 오른쪽에 단위를 두는 InputGroup 안에서 쓴다.
const InputGroupInput = ({name, format, onChange, onBlur, ...props}: InputGroupInputProps) => {
    const field = useFieldValue(name)
    const invalidState = useInvalidState()
    const required = useCardRequired(props.required)
    useRegisterField(name, {required, readOnly: props.readOnly ?? props.disabled, invalid: invalidState.invalid})
    const validation = useFieldValidation(props.id, props['aria-describedby'])

    return (
        <BaseInputGroupInput
            {...props}
            required={required}
            {...validation.props}
            name={name}
            value={field ? field.value : props.value}
            onChange={(event) => {
                const nextValue = applyFormat(event.currentTarget.value, field?.value ?? '', format)
                field?.setValue(nextValue)
                invalidState.check(event.currentTarget, nextValue)
                validation.clear()
                onChange?.(event)
            }}
            onBlur={(event) => {
                validation.checkOnBlur(event.currentTarget)
                onBlur?.(event)
            }}
        />
    )
}

type TextareaProps = Parameters<typeof BaseTextarea>[0]

const Textarea = ({name, onChange, ...props}: TextareaProps) => {
    const field = useFieldValue(name)
    const invalidState = useInvalidState()
    const required = useCardRequired(props.required)
    useRegisterField(name, {required, readOnly: props.readOnly ?? props.disabled, invalid: invalidState.invalid})
    const validation = useFieldValidation(props.id, props['aria-describedby'])

    return (
        <BaseTextarea
            {...props}
            required={required}
            {...validation.props}
            name={name}
            value={field ? field.value : props.value}
            onChange={(event) => {
                field?.setValue(event.currentTarget.value)
                invalidState.check(event.currentTarget)
                validation.clear()
                onChange?.(event)
            }}
        />
    )
}

type RadioGroupProps = Parameters<typeof BaseRadioGroup>[0]

const RadioGroup = ({name, onValueChange, ...props}: RadioGroupProps) => {
    const field = useFieldValue(name)
    const required = useCardRequired(props.required)
    useRegisterField(name, {required, readOnly: props.disabled})
    const validation = useFieldValidation(props.id, props['aria-describedby'])

    return (
        <BaseRadioGroup
            {...props}
            required={required}
            {...validation.props}
            name={name}
            value={field ? field.value : props.value}
            onValueChange={(value) => {
                field?.setValue(value)
                validation.clear()
                onValueChange?.(value)
            }}
        />
    )
}

type SelectTriggerProps = Parameters<typeof BaseSelectTrigger>[0]

// 검사 메시지는 값을 고르는 트리거에 붙는다 — 라벨의 htmlFor 가 가리키는 것도 이 요소다.
// 값을 고르면(Select 의 onValueChange) 메시지가 남지 않도록 다음 검사 때 다시 계산된다.
const SelectTrigger = (props: SelectTriggerProps) => {
    const validation = useFieldValidation(props.id, props['aria-describedby'])

    return <BaseSelectTrigger {...props} {...validation.props} />
}

type SelectProps = Parameters<typeof BaseSelect>[0]

// Select 의 뿌리(Root)에는 id 가 없다 — id 는 트리거에 붙으므로 검사 표시도 아래 SelectTrigger 가 맡는다.
const Select = ({name, onValueChange, ...props}: SelectProps) => {
    const field = useFieldValue(name)
    const required = useCardRequired(props.required)
    useRegisterField(name, {required, readOnly: props.disabled})

    return (
        <BaseSelect
            {...props}
            required={required}
            name={name}
            value={field ? field.value : props.value}
            onValueChange={(value) => {
                field?.setValue(value)
                onValueChange?.(value)
            }}
        />
    )
}

export {
    BusinessNumberInput,
    ClearableInput,
    EMAIL_FORMAT_MESSAGE,
    CorporateNumberInput,
    PatentNumberInput,
    DatePicker,
    FormCardScope,
    FormFieldSection,
    FormValuesProvider,
    Input,
    InputGroupInput,
    RadioGroup,
    Select,
    SelectTrigger,
    TelInput,
    Textarea,
    useClearFieldError,
    useFieldError,
    useFieldValue,
    useFormValues,
    useSectionStatuses,
}
export type {FormatValue, FormSectionStatus}
export {InputGroup, InputGroupAddon} from '@/components/ui/input-group'
export {RadioGroupItem} from '@/components/ui/radio-group'
export {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectValue,
} from '@/components/composite/select-field'
