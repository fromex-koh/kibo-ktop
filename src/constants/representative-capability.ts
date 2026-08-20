// 대표자(경영자) 역량 — 학력 관련 선택 항목.
//
// 같은 목록을 두 화면이 쓴다. 기술평가 신청의 [대표자 역량 및 경력사항] 탭(Tech-Index)과
// 마이페이지의 [대표자(경영자) 역량 및 경력] 화면이다. 학력 구분은 화면마다 달라질 값이 아니라
// 여기 한 벌만 두고 양쪽이 가져다 쓴다 — 한쪽만 고쳐 두 화면의 선택지가 달라지는 일을 막는다.
//
// 시안에는 [선택] 자리만 있어 항목 값은 별도로 확인한 것이다. value 는 화면에 보이지 않는 제출용
// 키라 영문 소문자로 둔다 — 실제 코드값이 정해지면 이 키만 바꾼다.

export const EDUCATION_OPTIONS = [
    {value: 'high-school-or-below', label: '고졸'},
    {value: 'associate', label: '전문학사'},
    {value: 'bachelor', label: '학사'},
    {value: 'master', label: '석사'},
    {value: 'doctor', label: '박사'},
] as const

// 학교명 옆 학교구분.
export const SCHOOL_TYPE_OPTIONS = [
    {value: 'high-school', label: '고등학교'},
    {value: 'university', label: '대학교'},
    {value: 'graduate-school', label: '대학원'},
] as const

export const STUDY_STATUS_OPTIONS = [
    {value: 'graduated', label: '졸업'},
    {value: 'completed', label: '수료'},
    {value: 'enrolled', label: '재학'},
    {value: 'dropped', label: '중퇴'},
] as const

// 학위 취득 — [선택] 은 고르기 전 자리 표시라 항목이 아니다(SelectValue placeholder).
export const DEGREE_OPTIONS = [
    {value: 'none', label: '해당없음'},
    {value: 'bachelor', label: '학사'},
    {value: 'master', label: '석사'},
    {value: 'doctor', label: '박사'},
] as const

// 고졸은 전공이라 부를 것이 없다 — 이 학력일 때만 전공이 선택 항목이 된다.
// 나머지(전문학사 포함)는 학교에서 전공을 정해 마치는 과정이라 필수로 받는다.
export const EDUCATION_WITHOUT_MAJOR = 'high-school-or-below'

// 졸업년도 — 숫자 네 자리(연도)만 받는다.
//
// inputMode="numeric" 은 모바일 키보드를 숫자판으로 바꿔 줄 뿐 글자 입력을 막지 못하므로(데스크톱 키보드·
// 붙여넣기), 값에서 숫자가 아닌 것을 걷어내고 네 자리로 자른다(company-etc-form 의 수량 칸과 같은 방식).
// 자릿수가 덜 채워진 채 제출되는 것은 pattern 이 막고, 그때 띄울 문구는 data-pattern-message 로 함께 준다 —
// 브라우저 기본 문구는 무엇이 어긋났는지 알려 주지 않는다(form-tabs-submit 참고).
const GRADUATION_YEAR_LENGTH = 4
export const formatGraduationYear = (value: string) => value.replace(/\D/g, '').slice(0, GRADUATION_YEAR_LENGTH)
export const GRADUATION_YEAR_PATTERN = `\\d{${GRADUATION_YEAR_LENGTH}}`
export const GRADUATION_YEAR_MESSAGE = '졸업년도를 네 자리 숫자로 입력해 주세요. (예: 2020)'
