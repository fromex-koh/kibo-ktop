// 수량 · 금액 표시 형식 — 숫자만 남기고 세 자리마다 쉼표를 넣는다(감리: 숫자 세 자리 구분 표시).
//
// 화면에서는 이 파일을 직접 쓰지 않는다. 입력 칸의 format 으로 물린다 — 기업·기술정보 입력의 UnitField(명 · 건 · 개 ·
// 백만원 · 원), Tech-Index 의 특허 · 실적 · 재무 칸, 자동 계산 칸(합계 · 인원 요약)이 같은 형식을 쓴다.
// 연도 · 월 · 개월 · 날짜 · 사업자번호 · 법인번호 · 특허 등록번호 · 전화번호는 수량이 아니라 쓰지 않는다.
//
// 값은 화면에 보이는 그대로(쉼표 포함) 보관한다 — 전화번호 · 사업자번호가 하이픈을 넣은 채 보관되는 것과 같다.
// [프론트엔드 연동] 보낼 때는 쉼표를 걷어 숫자로 바꾼다 — 폼 전체는 아래 withNumberValues, 값 하나는 parseThousands.
//
// 형식 함수(format · parse)는 입력할 때마다 값 전체를 다시 계산하는 순수 함수다 — 상태도 DOM 도 건드리지 않는다.

const NEGATIVE_SIGN = '-'

// 숫자만 남기고 앞자리 0 을 정리한 뒤("007" → "7") 세 자리마다 쉼표를 넣는다.
const formatThousands = (value: string) =>
    value
        .replace(/\D/g, '')
        .replace(/^0+(?=\d)/, '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

// 음수가 될 수 있는 금액(영업이익 · 순이익 · 자본총계) — 맨 앞의 '-' 하나만 남긴다. '-' 만 있는 상태는 입력하는
// 중이라 그대로 둔다(칸을 벗어날 때 사용처가 0 으로 되돌린다). '-0' 은 0 으로 본다.
const formatSignedThousands = (value: string) => {
    const digits = formatThousands(value)
    const isNegative = value.trimStart().startsWith(NEGATIVE_SIGN)
    if (!isNegative || digits === '0') return digits
    return `${NEGATIVE_SIGN}${digits}`
}

// 쉼표를 걷어 숫자로 바꾼다 — 합계 계산 · 보낼 값에 쓴다. 비었거나 '-' 만 있으면 0.
const parseThousands = (value: string | undefined) => {
    const number = Number((value ?? '').replace(/,/g, ''))
    return Number.isFinite(number) ? number : 0
}

// ─── [프론트엔드 연동] 보낼 값 만들기 ───────────────────────────────────────────────────────────────
// 쉼표가 들어가는 칸은 data-number-format="thousands" 표시를 단다(UnitField · 특허 · 실적 · 재무 칸 · 합계 칸).
// 제출할 때 withNumberValues(폼, 값) 를 부르면 그 칸들만 숫자로 바꾼 값 객체를 돌려준다 — 나머지 칸(이름 · 날짜 ·
// 번호 등)은 받은 그대로다. 자가진단 입력 폼(self-diagnosis-tabs-form)의 제출 자리가 이미 이 값을 만들어 둔다.
//   예) {salesLastYear: '1,234,567', ceoName: '홍길동'} → {salesLastYear: 1234567, ceoName: '홍길동'}
// 새 칸을 더할 때는 입력에 같은 표시만 달면 된다(칸 이름 목록을 따로 관리하지 않는다).
const NUMBER_FORMAT_ATTRIBUTE = 'data-number-format'
const NUMBER_FORMAT_THOUSANDS = 'thousands'

const withNumberValues = (form: HTMLFormElement, values: Record<string, string>) => {
    const numberNames = new Set(
        [...form.querySelectorAll(`[${NUMBER_FORMAT_ATTRIBUTE}="${NUMBER_FORMAT_THOUSANDS}"]`)]
            .map((control) => control.getAttribute('name'))
            .filter((name): name is string => Boolean(name)),
    )
    return Object.fromEntries(
        Object.entries(values).map(([name, value]) => [name, numberNames.has(name) ? parseThousands(value) : value]),
    )
}

// ─── [프론트엔드 연동 · 자릿수 상한] ─────────────────────────────────────────────────────────────────
// 칸별 최대 자릿수는 아직 정해지지 않았다(현업 · 백엔드 확인 후 결정). 정해지면 UnitField 칸은 maxDigits 를 넘기고,
// 그 밖의 칸은 format 을 limitDigits 로 감싼다 — 그 자릿수를 넘는 숫자는 입력되지 않는다.
//   예) 6자리 → maxDigits={6} 또는 format={limitDigits(formatThousands, 6)} → 999,999 까지
// 음수 칸은 limitDigits(formatSignedThousands, 자릿수) — '-' 는 자릿수에 세지 않는다.
// 지금은 어느 칸에도 걸려 있지 않다(상한 없음).
const limitDigits = (format: (value: string) => string, maxDigits: number) => (value: string) => {
    const sign = value.trimStart().startsWith(NEGATIVE_SIGN) ? NEGATIVE_SIGN : ''
    const digits = value
        .replace(/\D/g, '')
        .replace(/^0+(?=\d)/, '')
        .slice(0, maxDigits)
    return format(`${sign}${digits}`)
}

export {
    NUMBER_FORMAT_ATTRIBUTE,
    NUMBER_FORMAT_THOUSANDS,
    formatSignedThousands,
    formatThousands,
    limitDigits,
    parseThousands,
    withNumberValues,
}
