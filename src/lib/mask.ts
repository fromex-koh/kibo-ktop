// 개인정보 가리기(마스킹) — 화면에 보일 때 일부 글자를 * 로 바꾼다.
//
// 상태도 DOM 도 건드리지 않는 순수 함수라 그대로 단위 테스트할 수 있다.
// [프론트엔드 연동] API 가 이미 가린 값을 준다면 화면에서 이 함수를 빼고 받은 값을 그대로 보인다.
//   개인정보는 서버에서 가려 내려보내는 편이 안전하다(가리기 전 값이 브라우저로 오지 않는다).
//   지금 쓰는 곳: innovation-growth-report-lookup.tsx(대표자명) ·
//   content/service/innovation-growth-report.ts getInnovationGrowthCompanyNumber(사업자 · 법인번호).

const MASK_CHAR = '*'

/**
 * 사람 이름의 두 번째 글자를 가린다. 한 글자 이름은 그대로 둔다.
 *
 * ```ts
 * maskPersonName('김민수')   // '김*수'
 * maskPersonName('남궁민수') // '남*민수'
 * maskPersonName('이현')     // '이*'
 * ```
 */
const maskPersonName = (name: string) => {
    const chars = [...name.trim()]
    if (chars.length < 2) return chars.join('')

    return [chars[0], MASK_CHAR, ...chars.slice(2)].join('')
}

/**
 * 뒤에서부터 숫자 n 개를 가린다. 하이픈 등 숫자가 아닌 글자는 그대로 둔다.
 *
 * ```ts
 * maskTrailingDigits('123-45-67890', 4) // '123-45-6****'
 * ```
 */
const maskTrailingDigits = (value: string, count: number) =>
    [...value]
        .reduceRight<{chars: string[]; masked: number}>(
            (acc, char) =>
                /\d/.test(char) && acc.masked < count
                    ? {chars: [MASK_CHAR, ...acc.chars], masked: acc.masked + 1}
                    : {chars: [char, ...acc.chars], masked: acc.masked},
            {chars: [], masked: 0},
        )
        .chars.join('')

// 사업자등록번호 — 끝 4자리를 가린다.
const BUSINESS_NUMBER_MASKED_DIGITS = 4

/**
 * 사업자등록번호의 끝 4자리를 가린다.
 *
 * ```ts
 * maskBusinessNumber('123-45-67890') // '123-45-6****'
 * ```
 */
const maskBusinessNumber = (value: string) => maskTrailingDigits(value, BUSINESS_NUMBER_MASKED_DIGITS)

// 법인등록번호 — 끝 7자리(하이픈 뒤 전부)를 가린다.
const CORPORATE_NUMBER_MASKED_DIGITS = 7

/**
 * 법인등록번호의 끝 7자리를 가린다.
 *
 * ```ts
 * maskCorporateNumber('110111-1234567') // '110111-*******'
 * ```
 */
const maskCorporateNumber = (value: string) => maskTrailingDigits(value, CORPORATE_NUMBER_MASKED_DIGITS)

export {maskBusinessNumber, maskCorporateNumber, maskPersonName, maskTrailingDigits}
