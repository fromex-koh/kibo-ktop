// K-BIGx 인쇄본 공통 값 표시 — 모든 쪽이 같은 규칙을 쓴다.
//   · 값이 없거나(null · undefined) 숫자가 아니면(NaN · Infinity) '-', 0 은 값이라 포맷대로 적는다(0 · 0.0 · 0.00).
//   · 글자 값은 비었거나 공백뿐이면 '-'.
//   · 합계 · 기타는 숫자인 값만 더하고, 하나도 없으면 값 없음(NaN → '-').

const KBX_EMPTY_VALUE = '-'
// 비공개 · 해당 데이터가 없는 표 칸 문구(신용/재무정보 · 활동성정보).
const KBX_NOT_APPLICABLE_TEXT = '해당사항 없음'

// 천 단위 쉼표(1,234) · 소수 한 자리 고정(73.8 · 60.0) · 소수 둘째 자리 고정(10.00).
const kbxNumberFormat = new Intl.NumberFormat('ko-KR')
const kbxFixed1Format = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 1, maximumFractionDigits: 1})
const kbxFixed2Format = new Intl.NumberFormat('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2})

const isKbxNumber = (value: number | null | undefined): value is number =>
    typeof value === 'number' && Number.isFinite(value)

const formatKbxNumber = (value: number | null | undefined, format: Intl.NumberFormat = kbxNumberFormat) =>
    isKbxNumber(value) ? format.format(value) : KBX_EMPTY_VALUE

const orKbxEmpty = (value: string) => value.trim() || KBX_EMPTY_VALUE

const sumKbxNumbers = (values: readonly (number | null | undefined)[]) => {
    const numbers = values.filter(isKbxNumber)
    return numbers.length ? numbers.reduce((total, value) => total + value, 0) : Number.NaN
}

export {
    formatKbxNumber,
    isKbxNumber,
    KBX_EMPTY_VALUE,
    KBX_NOT_APPLICABLE_TEXT,
    kbxFixed1Format,
    kbxFixed2Format,
    kbxNumberFormat,
    orKbxEmpty,
    sumKbxNumbers,
}
