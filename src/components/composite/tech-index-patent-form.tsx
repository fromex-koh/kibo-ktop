'use client'

import {Plus} from 'lucide-react'
import {useEffect, useRef, useState} from 'react'
import {FormCard} from '@/components/composite/form-card'
import {NoticeDialog} from '@/components/composite/notice-dialog'
import {Field, FieldGrid, FieldRow3} from '@/components/composite/form-fields'
import {
    ClearableInput,
    CorporateNumberInput,
    FormCardScope,
    PatentNumberInput,
    InputGroupInput,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    useFieldError,
    useFormValues,
} from '@/components/composite/form-values'
import {RepeatCard, useRepeatCards} from '@/components/composite/repeat-card'
import {Button} from '@/components/ui/button'
import {FieldError} from '@/components/ui/field'
import {InputGroup, InputGroupAddon, InputGroupInput as BaseInputGroupInput} from '@/components/ui/input-group'
import {
    TECH_INDEX_PATENT_APPLIED_FIELD,
    TECH_INDEX_PATENT_CARD_COUNT_FIELDS,
    TECH_INDEX_PATENT_COUNT_DEFAULT,
    techIndexPatentField,
} from '@/constants/technology-evaluation'

// Tech-Index 일반용 [특허 보유현황] 탭 본문 —
// Figma "[혁신성장지수 (일반) Tech-Index] 2단계_특허 보유현황".
//
// 화면은 두 층이다.
//   위: 합계 요약 7칸. [출원중인 특허] 만 사람이 적고 나머지는 아래 특허 목록에서 계산해 채운다(읽기 전용).
//   아래: 특허 카드 반복. 카드마다 [특허정보 조회] 로 채우는 [자동 인입 항목] 묶음이 딸려 있다.
//
// [연동 지점] 지금은 화면만 있다. 실제로는 아래 두 가지가 붙는다.
//   · [특허정보 조회] — 아래 handlePatentLookup 의 목업 한 줄을 특허 DB 호출로 바꾸면 된다.
//     받아 온 값을 화면에 담는 일은 applyPatentLookupResult 하나가 맡으므로 그쪽은 손대지 않아도 된다.
//   · 합계 요약 — 아래 카드들의 값을 모아 계산한다(지금도 화면에서 계산해 보여 준다).

const PATENT_TYPES = [
    {value: 'domestic', label: '국내특허'},
    {value: 'overseas', label: '해외특허'},
    {value: 'pct', label: 'PCT'},
] as const

// 상태 — [등록] 인 카드 수가 위 [등록 특허] 합계가 된다(시안 안내 문구).
// [출원] 은 아직 등록되지 않은 건이라 등록번호·등록일이 아직 없다(카드 안내의 "미등록건 입력생략").
// 위 요약의 [출원중인 특허] 칸과는 무관하다 — 그 칸은 사람이 직접 적는 수량이고, 이 상태에서 세지 않는다.
const PATENT_STATUS_REGISTERED = 'registered'
const PATENT_STATUS_APPLIED = 'applied'
const PATENT_STATUSES = [
    {value: PATENT_STATUS_REGISTERED, label: '등록'},
    {value: PATENT_STATUS_APPLIED, label: '출원중'},
] as const

// 등록 정보 칸 — 상태가 [출원] 이면 아직 없는 값이라 선택 항목이 된다.
const REGISTRATION_FIELDS = ['registrationNumber', 'registeredYear', 'registeredMonth', 'registeredDay'] as const

// [특허정보 조회]가 특허를 찾을 때 보내는 칸 — 카드 위쪽에 사람이 적는 값 전부다.
const PATENT_LOOKUP_QUERY_FIELDS = ['type', 'status', 'name', ...REGISTRATION_FIELDS, 'holder', 'corpNo'] as const

// 조회로 받아 오는 값 — 카드의 [자동 인입 항목] 다섯 칸과 짝이다(이름이 같아 그대로 옮겨 담는다).
type PatentLookupResult = Record<(typeof TECH_INDEX_PATENT_CARD_COUNT_FIELDS)[number], string>

// 등록번호 없이 [특허정보 조회]를 눌렀을 때 — 특허를 찾을 열쇠가 없으니 무엇이 빠졌는지 알려 준다.
const PATENT_LOOKUP_EMPTY_MESSAGE = '조회할 특허가 없습니다. 등록번호를 먼저 입력해주세요.'

// [연동 지점] 조회 API 가 붙기 전까지 쓰는 예시 응답 — 버튼을 눌렀을 때 화면이 어떻게 채워지는지 보여 준다.
// 실제 응답으로 바꿀 때 이 상수는 지우면 된다.
const PATENT_LOOKUP_SAMPLE: PatentLookupResult = {
    claimCount: '12',
    registrationDays: '480',
    citingCount: '5',
    citedCount: '3',
    ipcCount: '4',
}

const COUNT_UNIT = '건'
const DAY_UNIT = '일'
// 값 이름·처음 값은 constants/technology-evaluation 이 갖는다 — 탭 구성(서버 모듈)도 같은 값을 봐야 한다.
const NUMBER_DEFAULT = TECH_INDEX_PATENT_COUNT_DEFAULT

// 수량 칸에 들어갈 수 있는 것은 숫자뿐이다. inputMode="numeric" 은 모바일 키보드를 숫자판으로 바꿔 줄 뿐
// 글자 입력을 막지 못하므로(데스크톱 키보드·붙여넣기), 값에서 숫자가 아닌 것을 걷어낸다.
const formatCount = (value: string) => value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')

// 등록일 세 칸 — 자릿수만 맞으면 되는 것이 아니라 달력에 있는 날이어야 한다.
// 형식은 pattern 이 막고(제출할 때), 그때 띄울 문구는 data-pattern-message 로 함께 준다 —
// 브라우저 기본 문구는 무엇이 어긋났는지 알려 주지 않는다(form-tabs-submit 참고).
// 앞자리 0 은 지우지 않는다 — 월·일은 "01" 처럼 두 자리로 적는 값이라 formatCount 를 쓰지 않는다.
const DATE_PART_LENGTHS = {year: 4, month: 2, day: 2} as const
const formatDatePart = (length: number) => (value: string) => value.replace(/\D/g, '').slice(0, length)

// 등록일 세 칸을 대표하는 id — 라벨(등록일)이 가리키는 칸이자 Field 가 메시지를 그려 주는 칸이다.
const REGISTERED_DATE_FIELD = 'registeredYear'

// 등록 연도의 범위 — 이미 등록된 날이라 올해를 넘길 수 없다(2027 같은 앞날은 등록일이 될 수 없다).
// 아래 끝은 특허 제도가 있기 전 연도를 걸러 내는 정도로만 둔다.
const MIN_REGISTERED_YEAR = 1900
// 모듈이 읽힐 때 한 번만 센다 — 한 번의 렌더 안에서 값이 흔들리지 않게 하기 위해서다.
// (해가 바뀌는 그 순간에 열려 있던 화면은 새로고침해야 새 연도를 받는다.)
const CURRENT_YEAR = new Date().getFullYear()

/**
 * 1900 부터 주어진 해까지만 통과하는 정규식을 만든다. `input` 의 pattern 은 숫자 비교를 못 하므로
 * 자릿수로 풀어 쓴다 — 예를 들어 2026 이면 `19\d{2}|20[01]\d|202[0-6]` 이 된다.
 *
 * 2000년대(20xx)만 다룬다 — 이 화면이 받는 값의 위 끝이 올해이기 때문이다.
 */
const buildYearPattern = (maxYear: number) => {
    const tens = Math.floor((maxYear % 100) / 10)
    const ones = maxYear % 10
    const decadesBefore = tens > 0 ? [`20[0-${tens - 1}]\\d`] : []

    return ['19\\d{2}', ...decadesBefore, `20${tens}[0-${ones}]`].join('|')
}

// 연도는 네 자리, 월은 01~12, 일은 01~31 이다. 달마다 다른 마지막 날(2월 30일 등)까지는 보지 않는다 —
// 세 칸이 서로를 알아야 해서 칸 하나의 pattern 으로는 표현할 수 없다(연동 때 서버 검사가 맡는다).
const REGISTERED_DATE_PARTS = [
    {
        key: 'registeredYear',
        unit: '년',
        placeholder: 'YYYY',
        label: '등록 연도',
        length: DATE_PART_LENGTHS.year,
        pattern: buildYearPattern(CURRENT_YEAR),
        message: `등록 연도를 ${MIN_REGISTERED_YEAR}~${CURRENT_YEAR} 사이로 입력해 주세요.`,
    },
    {
        key: 'registeredMonth',
        unit: '월',
        placeholder: 'MM',
        label: '등록 월',
        length: DATE_PART_LENGTHS.month,
        pattern: '0[1-9]|1[0-2]',
        message: '등록 월을 01~12 사이로 입력해 주세요.',
    },
    {
        key: 'registeredDay',
        unit: '일',
        placeholder: 'DD',
        label: '등록 일',
        length: DATE_PART_LENGTHS.day,
        pattern: '0[1-9]|[12]\\d|3[01]',
        message: '등록 일을 01~31 사이로 입력해 주세요.',
    },
] as const

// 한 칸의 검사 메시지 — Field 안에 있지만 id 가 달라 Field 가 대신 그려 주지 못하는 칸에 쓴다
// (등록일의 월·일. 기업정보의 상세주소와 같은 처리).
const PartFieldError = ({id}: {id: string}) => {
    const message = useFieldError(id)

    return message ? <FieldError id={`${id}-error`}>{message}</FieldError> : null
}

const toCount = (value: string | undefined) => Number(value || NUMBER_DEFAULT)

const patentField = techIndexPatentField

// 카드마다 [특허정보 조회] 로 채우는 칸들 — 위 합계 요약이 이 값들을 모아 계산한다.
const AUTO_FIELDS = {
    claim: 'claimCount',
    duration: 'registrationDays',
    citing: 'citingCount',
    cited: 'citedCount',
    ipc: 'ipcCount',
} as const

// 단위가 붙는 수량 입력 — 시안은 단위를 상자 안 오른쪽에 두고 값을 오른쪽 정렬한다.
//
// 지워서 비운 칸은 벗어날 때 0 으로 돌려놓는다 — 이 칸의 "없음" 은 빈칸이 아니라 0 이다.
// 자리 안내(placeholder)가 "0" 이라 비워 두면 화면에는 0 으로 보이는데 값은 비어 있어, 다 채운 것처럼
// 보이는데도 탭이 계속 [작성중] 으로 남는다(인원 요약·실적 건수 칸과 같은 처리).
const CountField = ({
    id,
    name,
    label,
    unit = COUNT_UNIT,
    required,
}: {
    id: string
    name: string
    label: string
    unit?: string
    required?: boolean
}) => {
    const {setValue} = useFormValues()

    return (
        <Field id={id} label={label} required={required}>
            <InputGroup>
                <InputGroupInput
                    id={id}
                    name={name}
                    required={required}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={NUMBER_DEFAULT}
                    format={formatCount}
                    onBlur={(event) => {
                        if (!event.currentTarget.value) setValue(name, NUMBER_DEFAULT)
                    }}
                    className="text-right"
                />
                <InputGroupAddon align="inline-end" className="text-foreground">
                    {unit}
                </InputGroupAddon>
            </InputGroup>
        </Field>
    )
}

// 계산해서 보여 주는 합계 칸 — 사용자가 고칠 수 없다. 읽기 전용 칸은 채울 방법이 없으므로 필수로 두지 않는다.
const TotalField = ({
    id,
    name,
    label,
    value,
    unit = COUNT_UNIT,
}: {
    id: string
    name: string
    label: string
    value: number
    unit?: string
}) => (
    <Field id={id} label={label}>
        <InputGroup>
            <BaseInputGroupInput
                id={id}
                name={name}
                readOnly
                value={String(value)}
                autoComplete="off"
                className="text-right"
            />
            <InputGroupAddon align="inline-end" className="text-foreground">
                {unit}
            </InputGroupAddon>
        </InputGroup>
    </Field>
)

type PatentEntryProps = {
    id: number
    label: string
    /** "특허 추가" 로 늘린 카드인지 — 그 카드는 비어 있어도 처음부터 모두 필수다. */
    isAdded: boolean
    focusOnMount?: boolean
    /** 마지막 한 장 — 지우면 카드가 사라지는 대신 값만 비워진다. */
    isLastCard?: boolean
    onDelete: () => void
    cardRef: (node: HTMLDivElement | null) => void
}

const PatentEntry = ({id, label, isAdded, focusOnMount, isLastCard, onDelete, cardRef}: PatentEntryProps) => {
    const field = (name: string) => patentField(id, name)
    const {values, setValue, clearFieldError} = useFormValues()
    // 등록번호 없이 조회를 눌렀을 때 뜨는 안내 — 카드마다 따로 연다.
    const [isLookupBlocked, setIsLookupBlocked] = useState(false)

    // 상태가 등록 정보의 필수 여부를 가른다. 아직 고르지 않았다면 필수로 둔다 —
    // [출원] 을 고르는 순간 풀린다(최종학력이 전공을 가르는 것과 같은 방식).
    const isRegistrationRequired = values[field('status')] !== PATENT_STATUS_APPLIED

    // [출원] 으로 바꾸면 등록번호·등록일은 더 이상 필수가 아니다 — 앞서 제출에서 걸린 메시지가 남아
    // 있으면 고칠 것이 없는데도 오류로 보이므로 함께 지운다.
    const handleStatusChange = (value: string) => {
        if (value !== PATENT_STATUS_APPLIED) return
        REGISTRATION_FIELDS.forEach((name) => clearFieldError(field(name)))
    }

    // 조회 결과를 이 카드의 [자동 인입 항목] 다섯 칸에 담는다.
    // 담긴 뒤에도 읽기 전용이 아니라 그대로 고칠 수 있다(카드 안내의 "자동 입력 · 수정 가능").
    // [연동 지점] 응답 모양만 PatentLookupResult 에 맞추면 이 함수는 그대로 쓴다.
    const applyPatentLookupResult = (result: PatentLookupResult) => {
        TECH_INDEX_PATENT_CARD_COUNT_FIELDS.forEach((name) => {
            setValue(field(name), result[name])
            clearFieldError(field(name))
        })
    }

    // [특허정보 조회] 누름 — 이 카드에 적힌 값으로 특허를 찾아 자동 인입 항목을 채운다.
    // [연동 지점] 아래 목업 한 줄을 특허 DB 호출로 바꾼다.
    //   const result = await fetchPatent(query)
    //   applyPatentLookupResult(result)
    const handlePatentLookup = () => {
        // 등록번호가 조회의 열쇠다 — 없으면 찾을 것이 없으므로 안내만 띄우고 멈춘다.
        if (!values[field('registrationNumber')]) {
            setIsLookupBlocked(true)

            return
        }

        const query = Object.fromEntries(PATENT_LOOKUP_QUERY_FIELDS.map((name) => [name, values[field(name)] ?? '']))

        // 개발자가 무엇이 오가는지 바로 볼 수 있게 남긴다 — 조회 API 를 붙일 때 이 줄을 지운다.
        console.log('[특허정보 조회]', {카드: label, 조회조건: query, 자동인입: PATENT_LOOKUP_SAMPLE})

        applyPatentLookupResult(PATENT_LOOKUP_SAMPLE)
    }

    // 늘린 카드의 수량 칸도 0 으로 시작한다. 처음 카드는 폼 보관소의 처음 값이 맡지만, 뒤에 늘린 카드는
    // 그 순간 생겨나므로 여기서 채운다 — 늘린 카드는 이미 "손댄 카드" 로 세므로 작성 상태가 흔들리지 않는다.
    const isSeeded = useRef(false)
    useEffect(() => {
        if (isSeeded.current || !isAdded) return
        isSeeded.current = true
        TECH_INDEX_PATENT_CARD_COUNT_FIELDS.forEach((name) =>
            setValue(techIndexPatentField(id, name), TECH_INDEX_PATENT_COUNT_DEFAULT),
        )
    }, [id, isAdded, setValue])

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
            <FormCardScope namePrefix={`patent-${id}-`} alwaysRequired={isAdded}>
                <div className="flex flex-col gap-6">
                    {/* 카드 안내 — 조회 버튼이 무엇을 채우는지 미리 알려 준다(시안 문구 그대로). */}
                    <p className="typo-body-l-regular text-foreground-subtle break-keep">
                        등록번호 입력 후 [특허정보 조회]를 누르면 모든 특허의 상세 정보(청구항 수·소요기간·인용·IPC)를
                        내부 특허 DB에서 일괄 자동 입력하며 입력 후 수정도 가능합니다.
                    </p>

                    <FieldRow3>
                        <Field id={field('type')} label="구분" required>
                            <Select name={field('type')} required>
                                <SelectTrigger id={field('type')} className="w-full">
                                    <SelectValue placeholder="선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PATENT_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field id={field('status')} label="상태" required>
                            <Select name={field('status')} required onValueChange={handleStatusChange}>
                                <SelectTrigger id={field('status')} className="w-full">
                                    <SelectValue placeholder="선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PATENT_STATUSES.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field id={field('name')} label="특허명" required>
                            <ClearableInput
                                id={field('name')}
                                name={field('name')}
                                required
                                autoComplete="off"
                                placeholder="특허명을 입력해주세요"
                            />
                        </Field>
                    </FieldRow3>

                    <FieldGrid>
                        {/* 등록번호 — 조회의 열쇠라 입력 칸과 [특허정보 조회] 버튼이 한 줄로 묶인다.
                            조회 동작은 아직 붙지 않았다(위 [연동 지점]). */}
                        <Field
                            id={field('registrationNumber')}
                            label="등록번호"
                            required={isRegistrationRequired}
                            helper="미등록건 입력생략"
                        >
                            <div className="flex items-start gap-2">
                                {/* 숫자만 받아 2-4-7 로 하이픈이 붙고, 13자리를 못 채우면 제출 때 걸린다
                                    (PatentNumberInput 이 pattern 과 안내 문구를 함께 들고 있다). */}
                                <PatentNumberInput
                                    id={field('registrationNumber')}
                                    name={field('registrationNumber')}
                                    required={isRegistrationRequired}
                                    autoComplete="off"
                                    placeholder="예: 10-2023-0000001"
                                    aria-describedby={`${field('registrationNumber')}-helper`}
                                    className="min-w-0 flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="tertiary"
                                    size="md"
                                    className="shrink-0"
                                    onClick={handlePatentLookup}
                                >
                                    특허정보 조회
                                </Button>
                                {/* 등록번호가 비어 조회할 수 없을 때 뜨는 안내. 버튼을 잠그지 않고
                                    눌렀을 때 알려 준다 — 잠긴 버튼은 왜 못 누르는지 말해 주지 못한다. */}
                                <NoticeDialog
                                    title="특허정보 조회"
                                    message={PATENT_LOOKUP_EMPTY_MESSAGE}
                                    open={isLookupBlocked}
                                    onOpenChange={setIsLookupBlocked}
                                />
                            </div>
                        </Field>

                        {/* 등록일 — 시안은 달력이 아니라 연·월·일 세 칸이다. 각 칸은 숫자만 받고 단위를 안에 둔다.
                            칸마다 보이는 라벨이 없어 aria-label 로 이름을 준다[7.4.1].
                            자리 안내에는 단위를 겹쳐 적지 않는다 — 오른쪽 단위와 같은 글자가 두 번 보이고,
                            값을 넣으면 자리 안내만 사라져 남는 것은 어차피 단위 하나다. */}
                        <Field
                            id={field(REGISTERED_DATE_FIELD)}
                            label="등록일"
                            required={isRegistrationRequired}
                            helper="미등록건 입력생략"
                        >
                            <FieldRow3>
                                {REGISTERED_DATE_PARTS.map((part) => (
                                    <InputGroup key={part.key}>
                                        <InputGroupInput
                                            id={field(part.key)}
                                            name={field(part.key)}
                                            required={isRegistrationRequired}
                                            inputMode="numeric"
                                            autoComplete="off"
                                            aria-label={part.label}
                                            placeholder={part.placeholder}
                                            pattern={part.pattern}
                                            data-pattern-message={part.message}
                                            format={formatDatePart(part.length)}
                                            className="text-right"
                                        />
                                        <InputGroupAddon align="inline-end" className="text-foreground">
                                            {part.unit}
                                        </InputGroupAddon>
                                    </InputGroup>
                                ))}
                            </FieldRow3>
                            {/* 월·일의 메시지 — Field 는 대표 id(연도) 하나만 그려 주므로 나머지는 여기서 잇는다.
                                그렇지 않으면 테두리만 빨개지고 무엇이 어긋났는지 알 수 없다[7.4.2]. */}
                            {REGISTERED_DATE_PARTS.filter((part) => part.key !== REGISTERED_DATE_FIELD).map((part) => (
                                <PartFieldError key={part.key} id={field(part.key)} />
                            ))}
                        </Field>

                        {/* 권리자는 선택이다 — 등록번호로 조회하면 따라오는 값이라 사람이 반드시 적을 것이 아니다. */}
                        <Field id={field('holder')} label="권리자">
                            <ClearableInput
                                id={field('holder')}
                                name={field('holder')}
                                autoComplete="off"
                                placeholder="권리자"
                            />
                        </Field>
                        {/* 시안의 placeholder 는 다른 칸에서 섞여 들어온 값("동업종…종사경력")이라 그대로 두지 않고
                            법인번호 형식 예시를 쓴다. */}
                        <Field id={field('corpNo')} label="법인번호" required>
                            {/* 기업정보 탭의 법인번호와 같은 처리 — 숫자만 받아 6-7 로 하이픈이 붙고,
                                13자리를 못 채우면 제출 때 걸린다. */}
                            <CorporateNumberInput
                                id={field('corpNo')}
                                name={field('corpNo')}
                                required
                                autoComplete="off"
                                placeholder="예: 110111-1234567"
                            />
                        </Field>
                    </FieldGrid>

                    {/* 자동 인입 항목 — 조회로 채우지만 손으로 고칠 수도 있어 읽기 전용이 아니다.
                        묶음이라는 것을 배경색으로 구분한다(시안 #f3f8ff = blue.50). */}
                    <div className="flex flex-col gap-6 rounded-md bg-blue-50 p-6">
                        <div className="flex flex-wrap items-baseline gap-2">
                            <h4 className="typo-body-xl-bold text-foreground">자동 인입 항목</h4>
                            <span className="typo-body-l-regular text-foreground-subtle">
                                [특허정보 조회] 시 자동 입력 · 수정 가능
                            </span>
                        </div>
                        <FieldRow3>
                            <CountField
                                id={field(AUTO_FIELDS.claim)}
                                name={field(AUTO_FIELDS.claim)}
                                label="청구항 수"
                                required
                            />
                            <CountField
                                id={field(AUTO_FIELDS.duration)}
                                name={field(AUTO_FIELDS.duration)}
                                label="특허등록 소요기간 (일)"
                                unit={DAY_UNIT}
                                required
                            />
                            <CountField
                                id={field(AUTO_FIELDS.citing)}
                                name={field(AUTO_FIELDS.citing)}
                                label="인용특허 수"
                                required
                            />
                        </FieldRow3>
                        <FieldGrid>
                            <CountField
                                id={field(AUTO_FIELDS.cited)}
                                name={field(AUTO_FIELDS.cited)}
                                label="피인용특허 수"
                                required
                            />
                            <CountField
                                id={field(AUTO_FIELDS.ipc)}
                                name={field(AUTO_FIELDS.ipc)}
                                label="IPC개수"
                                required
                            />
                        </FieldGrid>
                    </div>
                </div>
            </FormCardScope>
        </RepeatCard>
    )
}

// 카드들의 값을 모아 위 합계 요약을 만든다. 값 보관소에 따로 담지 않고 그때그때 계산해 보여 준다 —
// 담아 두면 카드를 고칠 때마다 두 값을 맞춰 주는 코드가 따로 필요하고, 어긋날 여지가 생긴다.
const usePatentTotals = (ids: readonly number[]) => {
    const {values} = useFormValues()
    const sum = (name: string) => ids.reduce((total, id) => total + toCount(values[patentField(id, name)]), 0)
    const registeredCount = ids.filter((id) => values[patentField(id, 'status')] === PATENT_STATUS_REGISTERED).length
    const durationTotal = sum(AUTO_FIELDS.duration)

    return {
        registeredCount,
        claimTotal: sum(AUTO_FIELDS.claim),
        // 평균은 등록된 특허를 기준으로 낸다 — 등록되지 않은 건은 소요기간이 아직 없다.
        averageDuration: registeredCount > 0 ? Math.round(durationTotal / registeredCount) : 0,
        citingTotal: sum(AUTO_FIELDS.citing),
        citedTotal: sum(AUTO_FIELDS.cited),
        ipcTotal: sum(AUTO_FIELDS.ipc),
    }
}

// 시안 안내 문구 — 카드 제목 아래에 불릿 목록으로 온다.
const NOTICES = [
    '법인 소유 특허만 입력해 주세요.',
    '국내 등록특허 및 출원특허 수량을 입력해주세요.',
    'PCT 및 해외 특허의 인정 여부는 평가 기준에 따라 달라질 수 있습니다.',
    '동일 기술에 대한 중복 특허는 1건으로 인정될 수 있습니다.',
    "등록 특허 건수는 아래 개별 특허 목록에서 상태가 '등록'인 건수로 자동 계산됩니다. (등록번호·등록일은 미등록건 입력 생략)",
] as const

type TechIndexPatentFormProps = {
    /**
     * 위 요약에 [특허정보 조회]로 채워지는 항목의 합계 다섯 칸(청구항 수·평균 소요기간·인용·피인용·IPC)을 둘지.
     * 일반용 시안에는 있고 창업용 시안에는 없다 — 창업용은 [등록 특허 · 출원중인 특허] 두 칸만 둔다.
     * 카드 안의 [자동 인입 항목] 다섯 칸은 두 모형 모두 그대로 있다(합계만 다르다).
     */
    showLookupTotals?: boolean
}

const TechIndexPatentForm = ({showLookupTotals = true}: TechIndexPatentFormProps) => {
    const {clearValues, setValue} = useFormValues()
    const {ids, addedId, addCard, removeCard, setCardRef, addButtonRef, isLastCard} = useRepeatCards({
        // 지운 칸의 값도 함께 버린다 — 남겨두면 제출 데이터에 유령 값이 섞인다.
        // 마지막 카드의 X는 탭 전체를 처음 상태로 되돌리는 동작이다. 사용자가 직접 적는 상단
        // [출원중인 특허]도 0으로 복원하고, 첫 카드의 자동 인입 항목은 최초 기본값과 같은 0을 다시 담는다.
        onRemove: (id, isLastCard) => {
            clearValues(`patent-${id}-`)
            if (!isLastCard) return

            setValue(TECH_INDEX_PATENT_APPLIED_FIELD, TECH_INDEX_PATENT_COUNT_DEFAULT)
            if (id === 1)
                TECH_INDEX_PATENT_CARD_COUNT_FIELDS.forEach((name) =>
                    setValue(techIndexPatentField(id, name), TECH_INDEX_PATENT_COUNT_DEFAULT),
                )
        },
    })
    const totals = usePatentTotals(ids)

    return (
        <FormCard
            title="특허 보유현황"
            // 안내가 다섯 줄짜리 목록이라 <p> 가 아닌 <ul> 로 그린다.
            subtitleAsChild
            subtitle={
                <ul className="flex list-disc flex-col gap-1 pl-5">
                    {NOTICES.map((notice) => (
                        <li key={notice}>{notice}</li>
                    ))}
                </ul>
            }
        >
            <div className="flex flex-col gap-6">
                <FieldGrid>
                    <TotalField
                        id="registered-patent-total"
                        name="registeredPatentTotal"
                        label="등록 특허"
                        value={totals.registeredCount}
                    />
                    {/* 출원중인 특허만 사람이 적는다 — 나머지 합계는 아래 카드에서 계산된다. */}
                    <CountField id="applied-patent-count" name="appliedPatentCount" label="출원중인 특허" required />
                    {showLookupTotals ? (
                        <TotalField
                            id="claim-total"
                            name="claimTotal"
                            label="청구항 수 합계"
                            value={totals.claimTotal}
                        />
                    ) : null}
                    {showLookupTotals ? (
                        <TotalField
                            id="average-registration-days"
                            name="averageRegistrationDays"
                            label="평균 특허등록 소요기간 (일)"
                            value={totals.averageDuration}
                            unit={DAY_UNIT}
                        />
                    ) : null}
                </FieldGrid>
                {showLookupTotals ? (
                    <FieldRow3>
                        <TotalField
                            id="citing-total"
                            name="citingTotal"
                            label="인용특허 수 합계"
                            value={totals.citingTotal}
                        />
                        <TotalField
                            id="cited-total"
                            name="citedTotal"
                            label="피인용특허 수 합계"
                            value={totals.citedTotal}
                        />
                        <TotalField id="ipc-total" name="ipcTotal" label="IPC개수 합계" value={totals.ipcTotal} />
                    </FieldRow3>
                ) : null}

                {ids.map((id, index) => (
                    <PatentEntry
                        key={id}
                        id={id}
                        cardRef={setCardRef(id)}
                        label={`특허${index + 1}`}
                        isAdded={index > 0}
                        focusOnMount={id === addedId}
                        isLastCard={isLastCard}
                        onDelete={() => removeCard(id)}
                    />
                ))}
                {/* 시안은 카드 폭 전체를 채우는 primary 버튼이고, 이름이 "행추가" 가 아니라 "특허 추가" 다. */}
                <Button type="button" ref={addButtonRef} size="sm" className="w-full" onClick={addCard}>
                    특허 추가
                    <Plus aria-hidden="true" />
                </Button>
            </div>
        </FormCard>
    )
}

export default TechIndexPatentForm
