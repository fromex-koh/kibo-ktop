'use client'

import {useState} from 'react'
import {FormCard} from '@/components/composite/form-card'
import {Field, FieldGrid} from '@/components/composite/form-fields'
import {InputGroupInput, useFieldError, useFormValues} from '@/components/composite/form-values'
import {NoticeDialog} from '@/components/composite/notice-dialog'
import {Button} from '@/components/ui/button'
import {FieldError} from '@/components/ui/field'
import {InputGroup, InputGroupAddon} from '@/components/ui/input-group'
import {repeatCardClassName, repeatCardTitleClassName} from '@/components/theme/repeat-card.variants'

// Tech-Index 일반용 [재무정보] 탭 본문 —
// Figma "[혁신성장지수 (일반) Tech-Index] 2단계_재무정보".
//
// 화면은 두 층이다.
//   위: [최근 재무기준일] 한 줄. 연·월을 적고 [기준일 적용] 을 누르면 아래 연도 묶음이 그 기준으로 다시 잡히고,
//       [재무제표 미작성] 은 세 해의 모든 칸을 0 으로 채운다.
//   아래: 연도 묶음 세 개(과거 3개년). 묶음마다 같은 계정 여덟 칸이 2열로 온다.
//
// [연동 지점] 지금은 화면만 있다. 실제로는 아래 두 가지가 붙는다.
//   · [재무정보 불러오기] — 아래 handleFinanceLookup 의 목업 한 줄을 재무 DB 호출로 바꾸면 된다.
//     받아 온 값을 화면에 담는 일은 applyFinanceValues 하나가 맡으므로 그쪽은 손대지 않아도 된다.
//   · [기준일 적용] — 적은 연·월을 기준으로 최근 3개년을 잡고 재무제표를 불러온다.

const AMOUNT_UNIT = '백만원'
const AMOUNT_ZERO = '0'
// 화면에 함께 두는 과거 연도 수 — 시안은 2023~2025 세 해다.
const FINANCE_YEAR_COUNT = 3

// 한 해에 적는 계정 여덟 칸 — 시안의 2열 순서 그대로다(왼쪽 → 오른쪽, 위 → 아래).
//
// [확인 필요] 시안에 [복리후생비] 가 한 해 안에서 두 번 나온다(2행 오른쪽 · 4행 오른쪽). 보이는 이름이
// 같아 무엇으로 구분되는 값인지 시안만으로는 알 수 없어, 보이는 글자는 시안 그대로 두고 값 이름만
// 순서로 구분한다(welfareExpense · welfareExpense2). 구분이 확정되면 두 이름을 그 뜻으로 바꾼다.
const FINANCE_ACCOUNTS = [
    {key: 'intangibleAssets', label: '무형자산'},
    {key: 'salary', label: '급여'},
    {key: 'retirementBenefitLiability', label: '퇴직급여충당부채'},
    {key: 'welfareExpense', label: '복리후생비'},
    {key: 'advertisingExpense', label: '광고선전비'},
    {key: 'developmentCost', label: '개발비 (대차대조표)'},
    {key: 'researchDevelopmentCost', label: '연구개발비 (제조원가명세서)'},
    {key: 'welfareExpense2', label: '복리후생비'},
] as const

// 값 이름·컨트롤 id — 연도가 이름에 들어간다. 기준일을 바꿔 대상 연도가 달라져도 이미 적은 해의 값은
// 그 해의 값으로 그대로 남는다(2023~2025 → 2022~2024 로 옮겨도 2023·2024 는 다시 적지 않아도 된다).
const FINANCE_FIELD_PREFIX = 'finance-'
const financeField = (year: number, key: string) => `${FINANCE_FIELD_PREFIX}${year}-${key}`
// 값 이름에서 연도를 되읽는다 — 화면에서 빠진 해의 값을 골라 버릴 때 쓴다.
const FINANCE_FIELD_YEAR = /^finance-(\d{4})-/

// 금액 칸에 들어갈 수 있는 것은 숫자뿐이다. inputMode="numeric" 은 모바일 키보드를 숫자판으로 바꿔 줄 뿐
// 글자 입력을 막지 못하므로(데스크톱 키보드·붙여넣기), 값에서 숫자가 아닌 것을 걷어낸다.
// 앞자리 0 도 함께 정리한다 — "007백만원" 같은 값이 그대로 제출되면 뒤에서 다시 다듬어야 한다.
const formatAmount = (value: string) => value.replace(/\D/g, '').replace(/^0+(?=\d)/, '')

// 기준일의 연·월 — 자릿수만 맞으면 되는 것이 아니라 달력에 있는 달이어야 한다(특허 등록일과 같은 처리).
// 형식은 pattern 이 막고(제출할 때), 그때 띄울 문구는 data-pattern-message 로 함께 준다 —
// 브라우저 기본 문구는 무엇이 어긋났는지 알려 주지 않는다(form-tabs-submit 참고).
// 앞자리 0 은 지우지 않는다 — 월은 "01" 처럼 두 자리로 적는 값이라 formatAmount 를 쓰지 않는다.
const formatDatePart = (length: number) => (value: string) => value.replace(/\D/g, '').slice(0, length)

const BASE_YEAR_FIELD = 'financeBaseYear'
const BASE_MONTH_FIELD = 'financeBaseMonth'

// 재무기준일이 될 수 있는 연도의 범위 — 이미 지난 결산이라 올해를 넘길 수 없다.
// 아래 끝은 회사가 있기 전 연도를 걸러 내는 정도로만 둔다.
const MIN_BASE_YEAR = 1900
// 모듈이 읽힐 때 한 번만 센다 — 한 번의 렌더 안에서 값이 흔들리지 않게 하기 위해서다.
// (해가 바뀌는 그 순간에 열려 있던 화면은 새로고침해야 새 연도를 받는다.)
const CURRENT_YEAR = new Date().getFullYear()
// 아무것도 적지 않았을 때 보여 주는 기준 연도 — 시안의 안내대로 "현재 연도 기준 과거 3개년" 의 마지막 해다.
const DEFAULT_BASE_YEAR = CURRENT_YEAR - 1

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

const BASE_DATE_PARTS = [
    {
        key: BASE_YEAR_FIELD,
        unit: '년',
        placeholder: 'YYYY',
        label: '재무기준 연도',
        length: 4,
        pattern: buildYearPattern(CURRENT_YEAR),
        message: `재무기준 연도를 ${MIN_BASE_YEAR}~${CURRENT_YEAR} 사이로 입력해 주세요.`,
    },
    {
        key: BASE_MONTH_FIELD,
        unit: '월',
        placeholder: 'MM',
        label: '재무기준 월',
        length: 2,
        pattern: '0[1-9]|1[0-2]',
        message: '재무기준 월을 01~12 사이로 입력해 주세요.',
    },
] as const

// 연도 없이 [기준일 적용] 을 눌렀을 때 — 어느 해를 기준으로 잡을지 알 길이 없으니 무엇이 빠졌는지 알려 준다.
const BASE_DATE_EMPTY_MESSAGE = '적용할 재무기준일이 없습니다. 연도와 월을 모두 입력해주세요.'

// [연동 지점] 조회 API 가 붙기 전까지 쓰는 예시 응답 — 버튼을 눌렀을 때 화면이 어떻게 채워지는지 보여 준다.
// 오래된 해부터 세 해분이고, 실제 응답으로 바꿀 때 이 상수는 지우면 된다.
const FINANCE_LOOKUP_SAMPLE: readonly Record<string, string>[] = [
    {
        intangibleAssets: '120',
        salary: '1450',
        retirementBenefitLiability: '210',
        welfareExpense: '180',
        advertisingExpense: '95',
        developmentCost: '140',
        researchDevelopmentCost: '320',
        welfareExpense2: '60',
    },
    {
        intangibleAssets: '150',
        salary: '1680',
        retirementBenefitLiability: '245',
        welfareExpense: '205',
        advertisingExpense: '130',
        developmentCost: '175',
        researchDevelopmentCost: '410',
        welfareExpense2: '75',
    },
    {
        intangibleAssets: '190',
        salary: '1930',
        retirementBenefitLiability: '280',
        welfareExpense: '240',
        advertisingExpense: '160',
        developmentCost: '220',
        researchDevelopmentCost: '505',
        welfareExpense2: '90',
    },
]

// 시안 안내 문구 — 카드 제목 아래에 불릿 목록으로 온다.
const NOTICES = [
    '최근 재무정보를 자동으로 불러올 수 있습니다.',
    `금액 단위는 ${AMOUNT_UNIT}입니다.`,
    '재무제표를 미작성하는 경우 모두 0으로 입력하시기 바랍니다.',
] as const

// 기준 연도에서 화면에 놓을 세 해를 만든다 — 오래된 해가 위로 온다(시안 2023 → 2024 → 2025).
const toYears = (baseYear: number) =>
    Array.from({length: FINANCE_YEAR_COUNT}, (_, index) => baseYear - (FINANCE_YEAR_COUNT - 1 - index))

const DEFAULT_YEARS = toYears(DEFAULT_BASE_YEAR)

// 3개년 표기 — 안내 문구들이 같은 값을 본다. 해가 바뀌거나 기준일을 옮기면 문구도 함께 따라간다.
const toYearRange = (targetYears: readonly number[]) => `${targetYears[0]}~${targetYears[targetYears.length - 1]}년`
const DEFAULT_YEAR_RANGE = toYearRange(DEFAULT_YEARS)
// 기준일 줄 아래 보조 안내([재무제표 미작성] 을 누르면 무엇이 일어나는지 미리 알려 준다).
const NO_STATEMENT_HELPER = `재무제표 미작성 — 현재 연도 기준 과거 3개년(${DEFAULT_YEAR_RANGE})이 모두 0으로 자동 입력됩니다.`
// [재무제표 미작성] 을 누른 뒤 뜨는 안내 — Figma "[신속표준모형 KTRS-FM] m_재무제표 미작성" 문구 그대로다.
// 줄바꿈 자리도 시안을 따른다 — 상자 폭에 맡기면 문장 중간(3개년 / (2023~2025년)이)에서 접혀 시안과 다르다.
// 좁은 화면에서는 각 줄이 한 번 더 접힌다(끊는 자리만 고정하고 폭은 상자에 맡긴다).
const NO_STATEMENT_DONE_MESSAGE = (
    <>
        재무제표 미작성으로 설정되었습니다.
        <br />
        현재 연도 기준 과거 3개년({DEFAULT_YEAR_RANGE})이
        <br />
        모두 0으로 자동 입력됩니다.
    </>
)

// [재무정보 불러오기] 를 누른 뒤 뜨는 안내 — 어느 해가 채워졌는지 알려 준다.
// 대상 연도는 기준일에 따라 달라지므로 화면에 놓인 해에서 그때그때 만든다(기본 3개년으로 굳히지 않는다).
const lookupDoneMessage = (targetYears: readonly number[]) => (
    <>
        재무정보를 불러왔습니다.
        <br />
        {toYearRange(targetYears)} 3개년 데이터가 자동 입력되었습니다.
        <br />
        필요 시 수정 후 저장하세요.
    </>
)

// 한 칸의 검사 메시지 — Field 안에 있지만 id 가 달라 Field 가 대신 그려 주지 못하는 칸에 쓴다
// (기준일의 월. 특허 등록일의 월·일과 같은 처리).
const PartFieldError = ({id}: {id: string}) => {
    const message = useFieldError(id)

    return message ? <FieldError id={`${id}-error`}>{message}</FieldError> : null
}

// 단위가 붙는 금액 입력 — 시안은 단위를 상자 안 오른쪽에 두고 값을 오른쪽 정렬한다.
// 시안에 필수 표시(*)가 없어 required 는 두지 않는다.
const AmountField = ({year, account}: {year: number; account: (typeof FINANCE_ACCOUNTS)[number]}) => {
    const name = financeField(year, account.key)
    const {setValue} = useFormValues()

    return (
        <Field id={name} label={account.label}>
            <InputGroup>
                <InputGroupInput
                    id={name}
                    name={name}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={AMOUNT_ZERO}
                    format={formatAmount}
                    // 지워서 비운 칸은 벗어날 때 0 으로 돌려놓는다 — 자리 안내가 "0" 이라 비워 두면 화면에는
                    // 0 으로 보이는데 값은 비어 있다(수량 칸 공통 처리).
                    onBlur={(event) => {
                        if (!event.currentTarget.value) setValue(name, AMOUNT_ZERO)
                    }}
                    className="text-right"
                />
                <InputGroupAddon align="inline-end" className="text-foreground">
                    {AMOUNT_UNIT}
                </InputGroupAddon>
            </InputGroup>
        </Field>
    )
}

// 한 해 묶음 — 시안은 폼 카드의 흰 면 위에 테두리로만 구분되는 상자다(반복 카드와 같은 상자·여백·간격).
// 접기·삭제가 없어 RepeatCard 를 쓰지 않고 상자 스타일만 함께 쓴다.
// 제목은 카드 제목(h2) 바로 아래라 h3 다 — 레벨을 건너뛰면 스크린리더의 제목 목록에서 한 단계가 비어 보인다[6.4.2].
const FinanceYearGroup = ({year, showYearUnit}: {year: number; showYearUnit?: boolean}) => (
    <section aria-labelledby={`finance-${year}`} className={repeatCardClassName}>
        <h3 id={`finance-${year}`} className={repeatCardTitleClassName}>
            {showYearUnit ? `${year}년` : year}
        </h3>
        <FieldGrid>
            {FINANCE_ACCOUNTS.map((account) => (
                <AmountField key={account.key} year={year} account={account} />
            ))}
        </FieldGrid>
    </section>
)

type TechIndexFinanceFormProps = {
    /**
     * 연도 묶음 제목에 "년" 을 붙일지 — 창업용 시안은 "2023년", 일반용 시안은 "2023" 이다.
     * 두 시안의 차이라 옵션으로 두었다. 한쪽으로 통일하기로 정해지면 이 옵션은 걷어낸다.
     */
    showYearUnit?: boolean
}

const TechIndexFinanceForm = ({showYearUnit}: TechIndexFinanceFormProps) => {
    const {values, setValue, clearValues} = useFormValues()
    // 화면에 놓인 세 해 — [기준일 적용] 을 누르기 전에는 시안대로 현재 연도 기준 과거 3개년이다.
    const [years, setYears] = useState<readonly number[]>(DEFAULT_YEARS)
    const [isBaseDateBlocked, setIsBaseDateBlocked] = useState(false)
    const [isNoStatementNoticeOpen, setIsNoStatementNoticeOpen] = useState(false)
    const [isLookupNoticeOpen, setIsLookupNoticeOpen] = useState(false)

    // 여러 해의 값을 한 번에 담는다 — 불러오기와 미작성이 같은 길로 화면을 채운다.
    const applyFinanceValues = (targetYears: readonly number[], valueOf: (index: number, key: string) => string) => {
        targetYears.forEach((year, index) => {
            FINANCE_ACCOUNTS.forEach((account) => {
                setValue(financeField(year, account.key), valueOf(index, account.key))
            })
        })
    }

    // [연동 지점] 실제로는 기준일을 보내 재무제표를 받아 온다. 지금은 예시 응답을 그대로 담는다.
    const handleFinanceLookup = () => {
        console.log('[재무정보 불러오기]', {
            기준일: {연도: values[BASE_YEAR_FIELD], 월: values[BASE_MONTH_FIELD]},
            대상연도: years,
            자동인입: FINANCE_LOOKUP_SAMPLE,
        })
        applyFinanceValues(years, (index, key) => FINANCE_LOOKUP_SAMPLE[index]?.[key] ?? AMOUNT_ZERO)
        setIsLookupNoticeOpen(true)
    }

    // 화면에서 빠진 해의 값은 함께 버린다 — 남겨두면 보이지도 않는 연도가 제출 데이터에 섞인다.
    // 남는 해의 값은 건드리지 않는다(2023~2025 → 2022~2024 로 옮겨도 2023·2024 는 다시 적지 않아도 된다).
    const dropYearsOutside = (nextYears: readonly number[]) => {
        const keptYears = new Set(nextYears)
        const storedYears = new Set(Object.keys(values).flatMap((name) => FINANCE_FIELD_YEAR.exec(name)?.[1] ?? []))
        storedYears.forEach((year) => {
            if (!keptYears.has(Number(year))) clearValues(`${FINANCE_FIELD_PREFIX}${year}-`)
        })
    }

    // 적은 연·월을 기준으로 세 해를 다시 잡고, 그 기준일의 재무정보를 불러온다.
    const handleBaseDateApply = () => {
        const baseYear = Number(values[BASE_YEAR_FIELD])
        const baseMonth = Number(values[BASE_MONTH_FIELD])
        if (!baseYear || !baseMonth) {
            setIsBaseDateBlocked(true)

            return
        }

        const nextYears = toYears(baseYear)
        dropYearsOutside(nextYears)
        setYears(nextYears)
        applyFinanceValues(nextYears, (index, key) => FINANCE_LOOKUP_SAMPLE[index]?.[key] ?? AMOUNT_ZERO)
        // [프론트엔드 연동] 기준일 적용 API 호출·응답 처리로 교체한다.
        console.log('[재무정보] 기준일 적용', {
            기준일: {baseYear, baseMonth},
            대상연도: nextYears,
        })
    }

    // 시안의 [재무제표 미작성] — 안내 문구 그대로 현재 연도 기준 과거 3개년으로 되돌리고 모두 0 으로 채운다.
    const handleNoStatement = () => {
        dropYearsOutside(DEFAULT_YEARS)
        setYears(DEFAULT_YEARS)
        applyFinanceValues(DEFAULT_YEARS, () => AMOUNT_ZERO)
        setIsNoStatementNoticeOpen(true)
        // [프론트엔드 연동] 재무제표 미작성 상태 저장 API 호출로 교체한다.
        console.log('[재무정보] 재무제표 미작성', {
            기준연도: CURRENT_YEAR,
            대상연도: DEFAULT_YEARS,
            자동입력값: AMOUNT_ZERO,
        })
    }

    return (
        <FormCard
            title="재무정보"
            // 안내가 세 줄짜리 목록이라 <p> 가 아닌 <ul> 로 그린다.
            subtitleAsChild
            subtitle={
                <ul className="flex list-disc flex-col gap-1 pl-5">
                    {NOTICES.map((notice) => (
                        <li key={notice}>{notice}</li>
                    ))}
                </ul>
            }
            action={
                <Button type="button" variant="secondary" size="sm" onClick={handleFinanceLookup}>
                    재무정보 불러오기
                </Button>
            }
        >
            <div className="flex flex-col gap-10">
                {/* 최근 재무기준일 — 시안은 달력이 아니라 연·월 두 칸이고 오른쪽에 버튼 두 개가 붙는다.
                    칸마다 보이는 라벨이 없어 aria-label 로 이름을 준다[7.4.1]. */}
                <Field id={BASE_YEAR_FIELD} label="최근 재무기준일" helper={NO_STATEMENT_HELPER}>
                    <div className="flex flex-col gap-2 md:flex-row">
                        {BASE_DATE_PARTS.map((part) => (
                            <InputGroup key={part.key} className="md:flex-1">
                                <InputGroupInput
                                    id={part.key}
                                    name={part.key}
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
                        <Button
                            type="button"
                            variant="tertiary"
                            size="md"
                            className="shrink-0"
                            onClick={handleBaseDateApply}
                        >
                            기준일 적용
                        </Button>
                        <Button
                            type="button"
                            variant="tertiary"
                            size="md"
                            className="shrink-0"
                            onClick={handleNoStatement}
                        >
                            재무제표 미작성
                        </Button>
                        {/* 연도가 비어 기준을 잡을 수 없을 때 뜨는 안내. 버튼을 잠그지 않고 눌렀을 때
                            알려 준다 — 잠긴 버튼은 왜 못 누르는지 말해 주지 못한다. */}
                        <NoticeDialog
                            title="기준일 적용"
                            message={BASE_DATE_EMPTY_MESSAGE}
                            open={isBaseDateBlocked}
                            onOpenChange={setIsBaseDateBlocked}
                        />
                        {/* [재무제표 미작성] 을 누른 결과를 알려 주는 안내 — 시안은 두 문장이 모두 본문이다.
                            title 은 화면에 보이지 않는 대화상자 이름이라 무엇에 대한 안내인지만 짧게 적는다[8.2.1]. */}
                        <NoticeDialog
                            title="재무제표 미작성"
                            message={NO_STATEMENT_DONE_MESSAGE}
                            open={isNoStatementNoticeOpen}
                            onOpenChange={setIsNoStatementNoticeOpen}
                        />
                        {/* [재무정보 불러오기] 를 누른 결과를 알려 주는 안내 — 어느 해가 채워졌는지 함께 말해 준다. */}
                        <NoticeDialog
                            title="재무정보 불러오기"
                            message={lookupDoneMessage(years)}
                            open={isLookupNoticeOpen}
                            onOpenChange={setIsLookupNoticeOpen}
                        />
                    </div>
                    {/* 월의 검사 메시지 — Field 는 대표 id(연도) 하나만 그려 주므로 여기서 잇는다. */}
                    <PartFieldError id={BASE_MONTH_FIELD} />
                </Field>

                {years.map((year) => (
                    <FinanceYearGroup key={year} year={year} showYearUnit={showYearUnit} />
                ))}
            </div>
        </FormCard>
    )
}

export default TechIndexFinanceForm
