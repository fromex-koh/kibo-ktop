// 전화번호 표시 형식 — 숫자만 남기고 자릿수에 맞춰 하이픈을 넣는다.
//
// 화면에서는 이 파일을 직접 쓰지 않는다. composite/form-values 의 `TelInput` 이 물고 있어
// `<TelInput name="companyTel" />` 한 줄이면 된다.
//
// 입력할 때마다 값 전체를 다시 계산하는 순수 함수다 — 상태도 DOM 도 건드리지 않으므로 그대로 단위 테스트할 수 있다.
// 국제 번호를 받아야 하면 이 함수 안쪽만 libphonenumber-js 의 AsYouType 으로 바꾼다(사용처는 그대로).

const toDigits = (value: string) => value.replace(/\D/g, '')

// 자릿수 나누기 — 앞자리로 국번 길이가 갈린다. 위에서부터 먼저 맞는 규칙을 쓴다.
//   02       02-123-4567 · 02-1234-5678     서울만 국번 2자리. 021 지역번호는 없어 아래 규칙과 겹치지 않는다
//   050X     0507-1234-5678                 안심·평생번호. 국번 4자리에 전체도 하나 더 길다
//   1로 시작  1544-1120 · 1330               대표번호는 지역번호가 없다. 일반 번호는 모두 0 으로 시작하므로
//                                           1 로 시작하면 대표번호로 본다(10~12 는 휴대폰 앞 0 누락 오타로 남겨둔다)
//   그 밖     031-123-4567 · 010-1234-5678   국번 3자리
// 가운데 묶음이 3자리인지 4자리인지는 전체 자릿수로 갈린다.
const getGroupSizes = (digits: string) => {
    if (digits.startsWith('02')) return [2, digits.length > 9 ? 4 : 3, 4]
    if (digits.startsWith('050')) return [4, 4, 4]
    if (/^1[3-9]/.test(digits)) return [4, 4]

    return [3, digits.length > 10 ? 4 : 3, 4]
}

// 최대 자릿수는 형태마다 다르다(대표번호 8 · 서울 10 · 휴대폰 11 · 안심번호 12).
// 상수로 박지 않고 나눈 자리의 합에서 구한다 — 위 규칙을 늘려도 여기는 고칠 게 없다.
const getMaxDigitCount = (digits: string) => getGroupSizes(digits).reduce((total, size) => total + size, 0)

// 하이픈 위에서 지우기를 눌렀는지 — 길이는 한 글자 줄었는데 숫자가 그대로면 지워진 것은 하이픈이다.
const isSeparatorDeleted = (value: string, previousValue: string) =>
    previousValue.length - value.length === 1 && toDigits(value) === toDigits(previousValue)

// 하이픈 대신 그 앞 숫자를 지운다. 하이픈만 지우면 숫자가 그대로라 같은 형식이 다시 나와,
// 사용자에게는 지우기가 먹지 않는 것처럼 보인다.
const removeDigitBeforeSeparator = (value: string, previousValue: string) => {
    // 앞에서부터 처음 달라지는 자리가 지워진 하이픈의 자리다.
    const cut = [...previousValue].findIndex((char, index) => char !== value[index])

    return toDigits(previousValue.slice(0, cut)).slice(0, -1) + toDigits(previousValue.slice(cut))
}

/**
 * 전화번호 형식으로 바꿔 돌려준다. 숫자가 아닌 글자는 버리고, 자릿수를 넘으면 자른다.
 *
 * ```ts
 * formatPhoneNumber('01012345678')  // '010-1234-5678'
 * formatPhoneNumber('02 1234 5678') // '02-1234-5678'
 * formatPhoneNumber('15441120')     // '1544-1120'
 * ```
 *
 * @param value 지금 입력된 값
 * @param previousValue 직전 값. 하이픈을 지웠는지 판단하는 데 쓴다 —
 *   넘기지 않으면 하이픈 위에서 지우기를 눌러도 아무 일이 없어 보인다.
 */
const formatPhoneNumber = (value: string, previousValue = '') => {
    const typed = isSeparatorDeleted(value, previousValue)
        ? removeDigitBeforeSeparator(value, previousValue)
        : toDigits(value)
    const digits = typed.slice(0, getMaxDigitCount(typed))
    if (!digits) return ''

    // 나눈 자릿수대로 잘라 하이픈으로 잇는다. 아직 못 채운 뒤 묶음은 건너뛰어 하이픈이 먼저 붙지 않게 한다.
    const {parts} = getGroupSizes(digits).reduce<{index: number; parts: string[]}>(
        (acc, size) => {
            const part = digits.slice(acc.index, acc.index + size)

            return part ? {index: acc.index + size, parts: [...acc.parts, part]} : acc
        },
        {index: 0, parts: []},
    )

    return parts.join('-')
}

export {formatPhoneNumber}
