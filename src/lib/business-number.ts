// 사업자등록번호 표시 형식 — 숫자만 남기고 3-2-5 자리로 하이픈을 넣는다(예: 123-45-67890).
//
// 화면에서는 이 파일을 직접 쓰지 않아도 된다. composite/form-values 의 `BusinessNumberInput` 이 물고 있어
// `<BusinessNumberInput name="bizNo" />` 한 줄이면 된다(전화번호의 `TelInput` 과 같은 구조).
//
// 입력할 때마다 값 전체를 다시 계산하는 순수 함수다 — 상태도 DOM 도 건드리지 않으므로 그대로 단위 테스트할 수 있다.

// 자릿수 나누기 — 사업자등록번호는 10자리 고정이라 전화번호와 달리 앞자리로 갈리지 않는다.
const GROUP_SIZES = [3, 2, 5]
const MAX_DIGIT_COUNT = GROUP_SIZES.reduce((total, size) => total + size, 0)

// 완성된 형식 — 제출 검사(input 의 pattern)와 여기가 같은 규칙을 보도록 한 곳에서 만든다.
const BUSINESS_NUMBER_PATTERN = `\\d{${GROUP_SIZES[0]}}-\\d{${GROUP_SIZES[1]}}-\\d{${GROUP_SIZES[2]}}`

const toDigits = (value: string) => value.replace(/\D/g, '')

// 하이픈 위에서 지우기를 눌렀는지 — 길이는 한 글자 줄었는데 숫자가 그대로면 지워진 것은 하이픈이다.
const isSeparatorDeleted = (value: string, previousValue: string) =>
    previousValue.length - value.length === 1 && toDigits(value) === toDigits(previousValue)

// 하이픈 대신 그 앞 숫자를 지운다. 하이픈만 지우면 숫자가 그대로라 같은 형식이 다시 나와,
// 사용자에게는 지우기가 먹지 않는 것처럼 보인다(전화번호와 같은 처리).
const removeDigitBeforeSeparator = (value: string, previousValue: string) => {
    const cut = [...previousValue].findIndex((char, index) => char !== value[index])

    return toDigits(previousValue.slice(0, cut)).slice(0, -1) + toDigits(previousValue.slice(cut))
}

/**
 * 사업자등록번호 형식으로 바꿔 돌려준다. 숫자가 아닌 글자는 버리고, 10자리를 넘으면 자른다.
 *
 * ```ts
 * formatBusinessNumber('1234567890')    // '123-45-67890'
 * formatBusinessNumber('123 45 6789')   // '123-45-6789'
 * ```
 *
 * @param value 지금 입력된 값
 * @param previousValue 직전 값. 하이픈을 지웠는지 판단하는 데 쓴다 —
 *   넘기지 않으면 하이픈 위에서 지우기를 눌러도 아무 일이 없어 보인다.
 */
const formatBusinessNumber = (value: string, previousValue = '') => {
    const typed = isSeparatorDeleted(value, previousValue)
        ? removeDigitBeforeSeparator(value, previousValue)
        : toDigits(value)
    const digits = typed.slice(0, MAX_DIGIT_COUNT)
    if (!digits) return ''

    // 나눈 자릿수대로 잘라 하이픈으로 잇는다. 아직 못 채운 뒤 묶음은 건너뛰어 하이픈이 먼저 붙지 않게 한다.
    const {parts} = GROUP_SIZES.reduce<{index: number; parts: string[]}>(
        (acc, size) => {
            const part = digits.slice(acc.index, acc.index + size)

            return part ? {index: acc.index + size, parts: [...acc.parts, part]} : acc
        },
        {index: 0, parts: []},
    )

    return parts.join('-')
}

export {BUSINESS_NUMBER_PATTERN, formatBusinessNumber}
