// 마이페이지 대표자(경영자) 역량 및 경력 — 칸 이름과 화면에 꽂는 대표자 이력을 한곳에 둔다.
//
// 서버 컴포넌트(page)가 읽어야 하므로 'use client' 파일이 아니라 이 자리에 둔다
// (mypage-profile.ts 와 같은 이유).
//
// [프론트엔드 연동] 대표자 이력 조회 응답을 REPRESENTATIVE_HISTORY 자리에 넣으면 폼이 그 값으로 열린다.
// 경력은 여러 건이라 조회 응답의 건수만큼 카드가 그려진다(아래 toCareerValues 참고).

import {CORP_PREVIEW_USER} from '@/constants/preview-user'

// 값의 이름 — 폼의 입력 name·id 와 제출 데이터의 키가 같은 글자를 쓴다.
export const EDUCATION_FIELD = 'finalEducation'
export const MAJOR_FIELD = 'major'

// 경력 한 건의 칸 이름 — 앞에 카드 번호가 붙는다(career-1-start).
// 번호는 화면의 순서가 아니라 고유 번호다. 가운데 카드를 지워도 아래 카드의 값이 위로 밀려 올라가지
// 않는다(신청 화면의 경력사항과 같은 규칙).
export const CAREER_PREFIX = 'career'
export const careerField = (id: number, name: string) => `${CAREER_PREFIX}-${id}-${name}`

export const CAREER_START = 'start'
export const CAREER_END = 'end'
export const CAREER_WORKPLACE = 'workplace'
export const CAREER_INDUSTRY = 'industry'
export const CAREER_SAME_INDUSTRY = 'sameIndustry'
export const CAREER_DUTY = 'duty'
export const CAREER_RANK = 'rank'

export const SAME_INDUSTRY_OPTIONS = [
    {value: 'yes', label: '예'},
    {value: 'no', label: '아니오'},
] as const

type Career = {
    start: string
    end: string
    workplace: string
    industry: string
    sameIndustry: string
    duty: string
    rank: string
}

// 등록된 경력 — 최근 경력부터 과거순이다(화면 안내와 같은 순서).
const REGISTERED_CAREERS: readonly Career[] = [
    {
        start: '2018-01',
        end: '2026-07',
        workplace: CORP_PREVIEW_USER.name,
        industry: '소프트웨어 개발 및 공급업',
        sameIndustry: 'yes',
        duty: '경영총괄',
        rank: '대표이사',
    },
    {
        start: '2015-03',
        end: '2017-12',
        workplace: '(주)미래정밀',
        industry: '전자부품 제조업',
        sameIndustry: 'yes',
        duty: '기술개발',
        rank: '연구소장',
    },
    {
        start: '2008-03',
        end: '2015-02',
        workplace: '한국전자연구원',
        industry: '연구개발업',
        sameIndustry: 'no',
        duty: '반도체 소자 연구',
        rank: '선임연구원',
    },
]

// 처음 그릴 카드 수 — 등록된 경력 건수 그대로다.
export const REGISTERED_CAREER_COUNT = REGISTERED_CAREERS.length

// 경력 목록을 폼이 읽는 평평한 값으로 편다 — 카드 번호는 1 부터 순서대로 붙인다.
const toCareerValues = (careers: readonly Career[]): Record<string, string> =>
    careers.reduce<Record<string, string>>(
        (values, career, index) => ({
            ...values,
            [careerField(index + 1, CAREER_START)]: career.start,
            [careerField(index + 1, CAREER_END)]: career.end,
            [careerField(index + 1, CAREER_WORKPLACE)]: career.workplace,
            [careerField(index + 1, CAREER_INDUSTRY)]: career.industry,
            [careerField(index + 1, CAREER_SAME_INDUSTRY)]: career.sameIndustry,
            [careerField(index + 1, CAREER_DUTY)]: career.duty,
            [careerField(index + 1, CAREER_RANK)]: career.rank,
        }),
        {},
    )

// 화면을 열 때 이미 들어 있는 값 — 앞선 평가 신청에서 받아 둔 대표자 이력이다.
export const REPRESENTATIVE_HISTORY: Record<string, string> = {
    [EDUCATION_FIELD]: 'bachelor',
    graduationYear: '2008',
    schoolName: '한국대학교',
    schoolType: 'university',
    [MAJOR_FIELD]: '전자공학',
    studyStatus: 'graduated',
    degree: 'bachelor',
    ...toCareerValues(REGISTERED_CAREERS),
}

// 제출 데이터에서 빈 경력 카드를 걷어낸다.
//
// 화면에는 늘 카드가 한 장 이상 있다 — 경력이 없어도 어디에 적는지 보여야 해서다. 그 빈 카드를 그대로
// 보내면 근무지도 기간도 없는 경력 한 건이 등록된 것처럼 담긴다.
//
// 남는 카드의 번호도 화면에 보이는 순서(경력1·경력2…)로 다시 매긴다. 카드 번호는 값이 섞이지 않도록
// 붙인 고유 번호라, 가운데 카드를 지우면 2 가 빠진 채 1·3 이 남는다 — 화면에는 경력1·경력2 로 보이는데
// 제출 데이터만 1·3 이면 읽는 쪽이 두 번 헷갈린다.
const CAREER_KEY_PATTERN = new RegExp(`^${CAREER_PREFIX}-(\\d+)-(.+)$`)

export const withoutEmptyCareers = (values: Record<string, string>): Record<string, string> => {
    const entries = Object.entries(values)
    // 카드별로 값을 모은다 — 카드 번호는 화면에 놓인 순서대로 들어온다(FormData 는 DOM 순서다).
    const cards = entries.reduce<Map<string, [string, string][]>>((grouped, [name, value]) => {
        const matched = name.match(CAREER_KEY_PATTERN)
        if (!matched) return grouped

        const [, cardId, field] = matched

        return grouped.set(cardId, [...(grouped.get(cardId) ?? []), [field, value]])
    }, new Map())

    const filled = [...cards.values()].filter((fields) => fields.some(([, value]) => value !== ''))

    return Object.fromEntries([
        ...entries.filter(([name]) => !CAREER_KEY_PATTERN.test(name)),
        ...filled.flatMap((fields, index) =>
            fields.map(([field, value]): [string, string] => [careerField(index + 1, field), value]),
        ),
    ])
}
