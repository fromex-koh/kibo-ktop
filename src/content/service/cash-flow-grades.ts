// 현금흐름등급(CF1 ~ CF6) 등급내용 · 정의 — 현금흐름등급의 단일 소스.
// K-BIGx 보고서 참고자료 표(웹 탭 · PDF 템플릿), 현금흐름등급 배지 이름 · 정의 상자 · 척도 양 끝 이름이 모두 이 표에서 읽는다.
// 신용등급(CRI) 정의는 cri-grades.ts 에 있다.
//
// [프론트엔드 연동] 현금흐름등급 코드는 CF1(가장 높음) ~ CF6(가장 낮음)으로 보낸다. 표에 없는 코드는 배지 · 정의 없이 코드만 보인다.

type CashFlowGrade = {
    /** 현금흐름등급 코드(CF1 ~ CF6). */
    grade: string
    /** 등급내용(우수 · 양호 …). */
    name: string
    /** 현금등급의 정의. */
    definition: string
}

const CASH_FLOW_GRADES: readonly CashFlowGrade[] = [
    {grade: 'CF1', name: '우수', definition: '현금흐름창출능력이 최상급인 유동성 우수 기업'},
    {grade: 'CF2', name: '양호', definition: '영업활동의 수익성 양호하고, 투자수요를 충분히 감당할 수 있는 상태'},
    {
        grade: 'CF3',
        name: '보통',
        definition: '영업활동 현금흐름은 양호하나 신규투자를 위해서는 외부자금을 조달해야 하는 상태',
    },
    {
        grade: 'CF4',
        name: '열위',
        definition: '연간 창출한 현금흐름으로 운전자금 투자 수요금액을 충당하지 못하는 보통이하의 상태',
    },
    {grade: 'CF5', name: '위험', definition: '당기의 현금흐름 수익성이 적자인 위험상태'},
    {grade: 'CF6', name: '부실', definition: '현금흐름이 2년 연속 적자로서 수익성이 매우 열악한 상태'},
]

// 코드 → 등급 행(이름 · 정의). 표에 없는 코드면 undefined.
const findCashFlowGrade = (grade: string) => CASH_FLOW_GRADES.find((item) => item.grade === grade)

// 코드 → 단계 숫자(CF1 → 1 … CF6 → 6). 표에 없는 코드면 0 — 척도 · 색에서 '알 수 없음'으로 쓴다.
const cashFlowLevel = (grade: string) => {
    const item = findCashFlowGrade(grade)
    return item ? CASH_FLOW_GRADES.indexOf(item) + 1 : 0
}

// 낮은 등급부터(CF6 → CF1) — 척도 · 게이지 칸 순서.
const CASH_FLOW_GRADES_LOW_FIRST = [...CASH_FLOW_GRADES].reverse()

export {CASH_FLOW_GRADES, CASH_FLOW_GRADES_LOW_FIRST, cashFlowLevel, findCashFlowGrade}
export type {CashFlowGrade}
