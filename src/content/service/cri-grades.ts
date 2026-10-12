import type {
    RatingGaugeDetail,
    SemicircleRatingData,
    SemicircleRatingTone,
} from '@/components/custom/semicircle-rating-gauge'

// CRI(기업신용등급) 등급 정의 · 등급명 — 기업신용등급 게이지(SemicircleRatingGauge)가 쓰는 단일 소스.
// 출처: CRI 등급 정의 및 등급명 표(24개 — 평가 등급 22개 + 평가 유보 R · 평가 제외 NR).
//
// 게이지 채움 비율 — 평가 등급 22개(AAA+ ~ D)를 위에서부터 100 → 한 단계(100 ÷ 22, 반올림해 D = 5)까지 고르게 나눈다.
//   맨 아래 D 도 0 이 아니라 한 단계만큼 차서 원호 끝이 보인다 — 등급이 있는데 빈 트랙만 보이면 평가가 없는 것처럼 보이기 때문이다.
//   R(유보) · NR(평가 제외)은 등급이 매겨지지 않았으므로 채움 없이(0) 등급명만 보인다.
// 게이지 가운데 설명은 '{등급명} 등급'(예: 우량 등급)이다. R · NR 은 등급이 아니므로 등급명만(유보 · 평가 제외) 둔다.
// 표에 없는 코드(예: 끝의 0 · + · - 가 빠진 'A', 오타)는 채움 없이 받은 코드를 그대로 두고, 설명 자리에
// '등급 코드 확인 필요'를 띄운다 — 개발 모드에서는 올바른 코드 예시와 함께 콘솔 경고도 남긴다.
// [프론트엔드 연동] API 가 등급 코드(예: 'BBB+')를 주면 toCriRatingData(코드, 날짜 목록)로 게이지 데이터를 만든다.

type CriGrade = {
    /** CRI 등급 코드(예: AAA+ · BB0 · NR). */
    grade: string
    /** 등급정의. */
    definition: string
    /** 등급명(예: 최우량 · 보통 이하 · 평가 제외). */
    name: string
    /** 평가 등급인지 — false 면 R(유보) · NR(평가 제외). */
    isRated: boolean
}

// 게이지 색 단계(CR-1 ~ CR-6) — 등급명으로 정한다: 최우량 · 우량 → CR-1(우수) / 양호 → CR-2 / 보통 → CR-3 /
// 보통 이하 → CR-4(미흡) / 낮음 · 매우 낮음 → CR-5 / 위험 → CR-6(취약). 유보 · 평가 제외는 표에 없어 tone 이 비고, 채움도 0 이라 색이 안 보인다.
// [프론트엔드 연동] 등급명 ↔ CR 단계 짝이 기획과 다르면 이 표만 고친다.
const CRI_TONE_BY_NAME: Record<string, SemicircleRatingTone> = {
    최우량: 'cr1',
    우량: 'cr1',
    양호: 'cr2',
    보통: 'cr3',
    '보통 이하': 'cr4',
    낮음: 'cr5',
    '매우 낮음': 'cr5',
    위험: 'cr6',
}

const DEFINITIONS = {
    top: '상거래를 위한 신용능력이 최우량급이며, 환경변화에 충분한 대처가 가능한 기업',
    aa: '상거래를 위한 신용능력이 우량하며, 환경변화에 적절한 대처가 가능한 기업',
    a: '상거래를 위한 신용능력이 양호하며, 환경변화에 대한 대처 능력이 제한적인 기업',
    bbb: '상거래를 위한 신용능력이 양호하나, 경제여건 및 환경악화에 따라 거래안정성 저하 가능성이 있는 기업',
    bb: '상거래를 위한 신용능력이 보통이며, 경제여건 및 환경악화에 따라 거래안정성 저하가 우려되는 기업',
    b: '상거래를 위한 신용능력이 보통이며, 경제여건 및 환경악화 시에는 거래안전성 저하가능이 높은 기업',
    ccc: '상거래를 위한 신용능력이 보통 이하이며, 거래안정성 저하가 예상되어 주의를 요하는 기업',
    cc: '상거래를 위한 신용능력이 매우 낮으며, 거래의 안정성이 낮은 기업',
    c: '상거래를 위한 신용능력이 최하위 수준이며, 거래위험 발생가능성이 매우 높은 기업',
    d: '현재 신용위험이 실제 발생하거나 신용위험에 준하는 상태에 처해있는 기업',
    r: '기업정보 미비 또는 당사와 특수관계자에 해당하여 평가를 유보하는 기업',
    nr: '피흡수합병, 휴폐업, 청산 등으로 인해 평가 제외하는 기업',
} as const

const rated = (grade: string, definition: string, name: string): CriGrade => ({grade, definition, name, isRated: true})

// 높은 등급 → 낮은 등급 순서(표 순서 그대로).
const CRI_GRADES: readonly CriGrade[] = [
    rated('AAA+', DEFINITIONS.top, '최우량'),
    rated('AA+', DEFINITIONS.aa, '우량'),
    rated('AA0', DEFINITIONS.aa, '우량'),
    rated('AA-', DEFINITIONS.aa, '우량'),
    rated('A+', DEFINITIONS.a, '양호'),
    rated('A0', DEFINITIONS.a, '양호'),
    rated('A-', DEFINITIONS.a, '양호'),
    rated('BBB+', DEFINITIONS.bbb, '양호'),
    rated('BBB0', DEFINITIONS.bbb, '양호'),
    rated('BBB-', DEFINITIONS.bbb, '양호'),
    rated('BB+', DEFINITIONS.bb, '보통'),
    rated('BB0', DEFINITIONS.bb, '보통'),
    rated('BB-', DEFINITIONS.bb, '보통'),
    rated('B+', DEFINITIONS.b, '보통'),
    rated('B0', DEFINITIONS.b, '보통'),
    rated('B-', DEFINITIONS.b, '보통'),
    rated('CCC+', DEFINITIONS.ccc, '보통 이하'),
    rated('CCC0', DEFINITIONS.ccc, '보통 이하'),
    rated('CCC-', DEFINITIONS.ccc, '보통 이하'),
    rated('CC+', DEFINITIONS.cc, '낮음'),
    rated('C+', DEFINITIONS.c, '매우 낮음'),
    rated('D', DEFINITIONS.d, '위험'),
    {grade: 'R', definition: DEFINITIONS.r, name: '유보', isRated: false},
    {grade: 'NR', definition: DEFINITIONS.nr, name: '평가 제외', isRated: false},
]

const RATED_GRADES = CRI_GRADES.filter((item) => item.isRated)
const MAX_PERCENTAGE = 100

// 게이지 채움 비율 — 평가 등급은 순서대로 100 → 5(100 ÷ 22 반올림), 유보 · 평가 제외는 0. 이전평가이력 원 높이도 이 값을 쓴다.
const criGradePercentage = (item: CriGrade) => {
    if (!item.isRated) return 0
    const index = RATED_GRADES.indexOf(item)
    return Math.round((MAX_PERCENTAGE * (RATED_GRADES.length - index)) / RATED_GRADES.length)
}

const findCriGrade = (grade: string) => CRI_GRADES.find((item) => item.grade === grade)

// 표에 없는 코드일 때 설명 자리에 띄우는 문구.
const CRI_UNKNOWN_GRADE_DESCRIPTION = '등급 코드 확인 필요'

// 같은 등급 계열의 올바른 코드 예시 — 'A' → A+ · A0 · A-(앞 글자가 같은 코드).
const suggestCriGrades = (grade: string) => {
    const base = grade.replace(/[+0-]$/, '')
    return CRI_GRADES.filter((item) => item.grade.replace(/[+0-]$/, '') === base).map((item) => item.grade)
}

// 등급 코드 → 게이지 데이터. 표에 없는 코드는 채움 없이 받은 코드와 '등급 코드 확인 필요'를 보인다.
const toCriRatingData = (grade: string, details: RatingGaugeDetail[] = []): SemicircleRatingData => {
    const item = findCriGrade(grade)
    if (!item) {
        // [개발 보조] 개발 모드에서만 잘못된 등급 코드를 콘솔로 알린다 — 운영 빌드에서는 실행되지 않으므로 그대로 둬도 된다.
        if (process.env.NODE_ENV !== 'production') {
            const suggestions = suggestCriGrades(grade)
            console.warn(
                `[cri-grades] CRI 등급표에 없는 코드 '${grade}'` +
                    (suggestions.length
                        ? ` — 올바른 예: ${suggestions.join(' · ')}`
                        : ' — CRI_GRADES 의 코드를 확인하세요.'),
            )
        }
        return {label: grade, description: CRI_UNKNOWN_GRADE_DESCRIPTION, percentage: 0, details}
    }
    return {
        label: item.grade,
        description: item.isRated ? `${item.name} 등급` : item.name,
        percentage: criGradePercentage(item),
        tone: CRI_TONE_BY_NAME[item.name],
        details,
    }
}

export {CRI_GRADES, CRI_UNKNOWN_GRADE_DESCRIPTION, criGradePercentage, findCriGrade, toCriRatingData}
export type {CriGrade}
