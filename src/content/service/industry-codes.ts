// 업종코드 조회 모달(IndustryCodeDialog)의 데이터.
//
// [프론트엔드 연동] 모달은 이 파일의 함수만 부른다 — 목업을 조회 API 로 바꿀 때 고칠 곳은 여기뿐이다.
//   · fetchIndustryCodeGroups(keyword)            중분류 목록(검색어가 비면 전체)
//   · fetchIndustrySubCodes(groupCode, keyword)   고른 중분류 아래 세분류 목록(검색어가 비면 전체)
//   1) 두 함수 안에서 API 를 await 하고 같은 모양(IndustryCode[])으로 돌려준다.
//   2) 목업 블록(INDUSTRY_CODE_GROUPS import · matchesKeyword · MOCK_RESPONSE_DELAY_MS · waitForMock)을 지운다.
// 빈 배열이면 목록 자리에 "검색내역이 없습니다." 안내가 나온다.

import INDUSTRY_CODE_GROUPS from '@/content/technology-evaluation/industry-codes.json'

// 코드 한 줄 — 중분류(두 자리)와 세분류(다섯 자리)가 같은 모양이다.
type IndustryCode = {code: string; name: string}

// ── 목업(API 연결 시 삭제) ──
// 한국표준산업분류(KSIC)의 중분류 77개와 그 아래 세분류 1,205개.
const INDUSTRY_CODE_TREE: readonly (IndustryCode & {items: readonly IndustryCode[]})[] = INDUSTRY_CODE_GROUPS

// 검색 — 코드는 앞자리 일치, 이름은 포함 검색이다.
const matchesKeyword = (target: IndustryCode, keyword: string) =>
    target.code.startsWith(keyword) || target.name.includes(keyword)

// 목업 응답 지연 — 서버 조회처럼 잠깐 기다렸다 돌려줘 모달의 로딩 안내("불러오는 중입니다.")를 확인할 수 있게 한다.
const MOCK_RESPONSE_DELAY_MS = 800
const waitForMock = () => new Promise((resolve) => window.setTimeout(resolve, MOCK_RESPONSE_DELAY_MS))
// ── 목업 끝 ──

const toCode = ({code, name}: IndustryCode): IndustryCode => ({code, name})

// 모달을 처음 열 때 보여 주는 중분류 전체 — 바로 돌려준다.
// [프론트엔드 연동] 처음 목록도 API 로 받는다면 모달이 열릴 때 fetchIndustryCodeGroups('') 를 부르게 바꾼다.
const INDUSTRY_CODE_GROUP_LIST: readonly IndustryCode[] = INDUSTRY_CODE_TREE.map(toCode)

// 중분류 조회 — 검색어가 비면 전체를 돌려준다.
const fetchIndustryCodeGroups = async (keyword: string): Promise<IndustryCode[]> => {
    await waitForMock()
    const trimmed = keyword.trim()

    return INDUSTRY_CODE_TREE.filter((group) => !trimmed || matchesKeyword(group, trimmed)).map(toCode)
}

// 세분류 조회 — 고른 중분류 아래 목록이다. 검색어가 비면 그 중분류의 세분류 전체를 돌려준다.
const fetchIndustrySubCodes = async (groupCode: string, keyword: string): Promise<IndustryCode[]> => {
    await waitForMock()
    const trimmed = keyword.trim()
    const group = INDUSTRY_CODE_TREE.find((candidate) => candidate.code === groupCode)

    return (group?.items ?? []).filter((item) => !trimmed || matchesKeyword(item, trimmed)).map(toCode)
}

export {fetchIndustryCodeGroups, fetchIndustrySubCodes, INDUSTRY_CODE_GROUP_LIST}
export type {IndustryCode}
