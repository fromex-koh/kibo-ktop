// 혁신성장영위기업 분류근거 — [기술분류] 모달의 표 데이터.
// 품목 이름과 순서는 품목설명 원문(content/service/item-descriptions)과 같은 240개다. 여기서는 그 품목을
// 시안의 [테마 > 분야] 로 묶는 정보만 더한다 — 이름을 두 번 적지 않도록 품목설명 목록을 그대로 잘라 쓴다.
//
// [테마] 혁신성장공동기준의 아홉 테마다. 기존 시스템의 [혁신성장영위기업품목] 셀렉트 옵션과 이름·순서가
// 같고, 품목설명 원문 240개의 나열 순서가 그 아홉 덩이와 그대로 맞아떨어진다(ICT·디지털 27 → 바이오헬스
// 31 → … → 환경·스마트농축수산 32). 그 경계로 끊어 테마를 붙였다.
//
// [분야] 시안 표에 그려진 다섯 분야(앞 33개 구간)는 시안 글자 그대로다. 나머지는 원문 안에서 품목이
// 가나다순으로 다시 시작하는 지점이 분야 경계라, 그 덩이의 내용을 보고 이름을 지었다 — 발주처 분류표가
// 오면 이름만 바로잡으면 되고 구간과 화면 코드는 그대로 쓴다.

import {ITEM_DESCRIPTIONS, type ItemDescription} from '@/content/service/item-descriptions'

type TechnologyCategoryRange = {
    theme: string
    field: string
    /** ITEM_DESCRIPTIONS 에서 잘라 올 구간(0-base, end 미포함). */
    start: number
    end: number
}

// 구간은 원문 항목 번호에서 1을 뺀 값이다(원문 [1]~[240] → 0~239). 주석의 번호가 원문 번호다.
const TECHNOLOGY_CATEGORY_RANGES: readonly TechnologyCategoryRange[] = [
    // ICT·디지털 27 — 시안에 그려진 구간이라 분야 이름도 시안 그대로다.
    {theme: 'ICT·디지털', field: '디지털전환', start: 0, end: 11}, // 1~11
    {theme: 'ICT·디지털', field: '소프트웨어응용/사이버보안', start: 11, end: 18}, // 12~18
    {theme: 'ICT·디지털', field: '통신·인프라', start: 18, end: 27}, // 19~27
    // 바이오헬스 31 — 뷰티테크·정밀의료는 시안 그대로, 신약은 개량신약~혁신신약 덩이다.
    {theme: '바이오헬스', field: '뷰티테크', start: 27, end: 29}, // 28~29
    {theme: '바이오헬스', field: '정밀의료(치료·진단)', start: 29, end: 49}, // 30~49
    {theme: '바이오헬스', field: '신약', start: 49, end: 58}, // 50~58
    // 반도체·디스플레이 13
    {theme: '반도체·디스플레이', field: '디스플레이', start: 58, end: 64}, // 59~64
    {theme: '반도체·디스플레이', field: '반도체', start: 64, end: 71}, // 65~71
    // 소재·부품 29
    {theme: '소재·부품', field: '첨단소재', start: 71, end: 91}, // 72~91
    {theme: '소재·부품', field: '센서·전자부품', start: 91, end: 100}, // 92~100
    // 에너지 39
    {theme: '에너지', field: '수소·연료전지', start: 100, end: 103}, // 101~103
    {theme: '에너지', field: '신재생에너지', start: 103, end: 109}, // 104~109
    {theme: '에너지', field: '에너지저장', start: 109, end: 111}, // 110~111
    {theme: '에너지', field: '에너지효율·전력망', start: 111, end: 128}, // 112~128
    {theme: '에너지', field: '원자력', start: 128, end: 134}, // 129~134
    {theme: '에너지', field: '이차전지', start: 134, end: 139}, // 135~139
    // 융합지식서비스 17
    {theme: '융합지식서비스', field: '콘텐츠', start: 139, end: 144}, // 140~144
    {theme: '융합지식서비스', field: '지식서비스', start: 144, end: 156}, // 145~156
    // 인공지능 22
    {theme: '인공지능', field: 'AI 응용서비스', start: 156, end: 163}, // 157~163
    {theme: '인공지능', field: 'AI 기반기술', start: 163, end: 169}, // 164~169
    {theme: '인공지능', field: '데이터·컴퓨팅', start: 169, end: 178}, // 170~178
    // 제조·모빌리티 30
    {theme: '제조·모빌리티', field: '로봇', start: 178, end: 180}, // 179~180
    {theme: '제조·모빌리티', field: '미래차·모빌리티', start: 180, end: 187}, // 181~187
    {theme: '제조·모빌리티', field: '첨단제조', start: 187, end: 199}, // 188~199
    {theme: '제조·모빌리티', field: '조선·해양', start: 199, end: 202}, // 200~202
    {theme: '제조·모빌리티', field: '항공·우주·방산', start: 202, end: 208}, // 203~208
    // 환경·스마트농축수산 32
    {theme: '환경·스마트농축수산', field: '그린바이오', start: 208, end: 214}, // 209~214
    {theme: '환경·스마트농축수산', field: '스마트농축수산', start: 214, end: 217}, // 215~217
    {theme: '환경·스마트농축수산', field: '자원순환', start: 217, end: 226}, // 218~226
    {theme: '환경·스마트농축수산', field: '미래식품', start: 226, end: 230}, // 227~230
    {theme: '환경·스마트농축수산', field: '환경관리', start: 230, end: 240}, // 231~240
] as const

type TechnologyCategoryGroup = {
    theme: string
    field: string
    items: readonly ItemDescription[]
}

// 표가 그대로 쓰는 모양 — 분야별 품목 목록.
// 이름만 잘라 오지 않고 품목을 통째로 담는다 — 줄마다 붙는 [품목설명]이 그 품목의 설명을 바로 열어야 하고,
// 이름은 열쇠가 되지 못하기 때문이다("사이버보안"·"소프트웨어정의(SDN)"은 두 분야에 각각 있다).
const TECHNOLOGY_CATEGORY_GROUPS: readonly TechnologyCategoryGroup[] = TECHNOLOGY_CATEGORY_RANGES.map((range) => ({
    theme: range.theme,
    field: range.field,
    items: ITEM_DESCRIPTIONS.slice(range.start, range.end),
}))

// 표의 첫 줄 품목 — 모달만 확인하는 화면이 [품목설명]까지 함께 열어 둘 때 쓴다.
const FIRST_TECHNOLOGY_CATEGORY_ITEM = TECHNOLOGY_CATEGORY_GROUPS[0].items[0]

// 검색 상자 옆 [혁신성장영위기업품목] 셀렉트에 쓰는 테마 목록 — 위 구간에서 그대로 뽑는다.
// 나온 아홉 개의 이름과 순서가 기존 시스템의 셀렉트 옵션과 같다. 표와 셀렉트가 한 곳을 보므로 분류가
// 바뀌어도 둘이 어긋나지 않는다.
//
// 값은 기존 시스템의 한 글자 코드(F·E·G…)를 쓰지 않고 테마 이름을 그대로 쓴다 — 그 코드가 무엇을
// 가리키는지 화면 어디에도 드러나지 않아 코드만 보고는 뜻을 알 수 없고[MD-010], 표의 테마 칸과 같은
// 값이라야 고른 값으로 바로 거를 수 있다. 연동할 때 여기서 코드 짝을 붙이면 된다.
const TECHNOLOGY_CATEGORY_THEMES = [...new Set(TECHNOLOGY_CATEGORY_RANGES.map((range) => range.theme))]

const TECHNOLOGY_CATEGORY_TOTAL = ITEM_DESCRIPTIONS.length

export {
    FIRST_TECHNOLOGY_CATEGORY_ITEM,
    TECHNOLOGY_CATEGORY_GROUPS,
    TECHNOLOGY_CATEGORY_THEMES,
    TECHNOLOGY_CATEGORY_TOTAL,
}
export type {TechnologyCategoryGroup}
