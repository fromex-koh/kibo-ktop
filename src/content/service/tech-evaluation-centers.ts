// 보증추천 모달의 두 검색(추천 영업점 · 은행 영업점)이 쓰는 목록.
//
// [프론트엔드 연동] 각 배열을 조회 API 응답으로 바꾸면 모달은 그대로 동작한다.
// 지역본부는 센터 목록에서 뽑아 쓰므로 따로 받을 필요가 없고, 은행은 영업점이 없는 은행도 골라야 해
// 별도 목록으로 둔다(고른 은행에 영업점이 없으면 모달이 "검색된 영업점이 없습니다." 를 보여 준다).

type TechEvaluationCenter = {
    /** 센터를 구분하는 값 — 응답의 코드가 있으면 그 값을 쓴다. */
    code: string
    /** 지역본부 이름. */
    region: string
    /** 기술평가센터(지점) 이름. */
    name: string
}

// 지역본부별 기술평가센터 — 기존 시안(1-fo)의 목록을 그대로 옮겼다.
// 지역본부 이름은 검색 모달의 [전체 지역본부] 셀렉트 항목과 같고, 화면에는 뒤에 "지역본부" 를 붙여 보여 준다.
const CENTERS_BY_REGION: Record<string, readonly string[]> = {
    서울서부: ['서울지점', '구로지점', '종로지점', '가산지점', '의정부지점', '일산지점', '강서지점', '마포지점'],
    서울동부: [
        '강남지점',
        '송파지점',
        '서초지점',
        '성남지점',
        '판교지점',
        '경기광주지점',
        '원주지점',
        '춘천지점',
        '강릉지점',
        '성수지점',
    ],
    인천: ['인천지점', '부천지점', '부평지점', '인천중앙지점', '시화지점', '김포지점'],
    경기: ['수원지점', '안양지점', '안산지점', '평택지점', '화성지점', '용인지점', '오산지점', '화성동지점'],
    충청: ['대전지점', '청주지점', '천안지점', '충주지점', '대전동지점', '아산지점', '진천지점', '세종지점'],
    부울경: [
        '부산지점',
        '사상지점',
        '동래지점',
        '사하지점',
        '녹산지점',
        '창원지점',
        '울산지점',
        '진주지점',
        '김해지점',
        '양산지점',
        '마산지점',
        '해운대지점',
    ],
    대구경북: ['대구지점', '대구서지점', '대구북지점', '구미지점', '포항지점', '경산지점', '달성지점'],
    호남: ['광주지점', '익산지점', '순천지점', '목포지점', '전주지점', '광주서지점', '광주북지점'],
}

const TECH_EVALUATION_CENTERS: readonly TechEvaluationCenter[] = Object.entries(CENTERS_BY_REGION).flatMap(
    ([region, names]) => names.map((name) => ({code: `${region}-${name}`, region, name})),
)

/** 지역본부 목록 — 센터 목록에서 나온 순서 그대로 뽑는다. */
const TECH_EVALUATION_REGIONS: readonly string[] = [...new Set(TECH_EVALUATION_CENTERS.map((center) => center.region))]

// 은행 목록 — [은행 영업점 조회] 모달의 은행 셀렉트가 쓴다.
const BANKS: readonly {code: string; name: string}[] = [
    {code: 'kb', name: '국민은행'},
    {code: 'shinhan', name: '신한은행'},
    {code: 'woori', name: '우리은행'},
    {code: 'hana', name: '하나은행'},
    {code: 'nh', name: '농협은행'},
    {code: 'ibk', name: '기업은행'},
    {code: 'kdb', name: '산업은행'},
    {code: 'sc', name: 'SC제일은행'},
    {code: 'citi', name: '한국씨티은행'},
    {code: 'busan', name: '부산은행'},
    {code: 'kyongnam', name: '경남은행'},
    {code: 'daegu', name: '아이엠뱅크'},
    {code: 'gwangju', name: '광주은행'},
    {code: 'jeonbuk', name: '전북은행'},
    {code: 'jeju', name: '제주은행'},
]

/** 은행 영업점 — 시안 표의 세 칸(은행명·지로코드·영업점명)을 그대로 담는다. */
type BankBranch = {
    /** 줄을 구분하는 값 — 응답의 코드가 있으면 그 값을 쓴다. */
    code: string
    bankName: string
    /** 은행 영업점을 가리키는 일곱 자리 번호(지로코드). 표의 가운데 칸이다. */
    giroCode: string
    name: string
}

// 영업점 목록 — [은행 영업점 조회] 모달의 표가 쓴다. 앞의 다섯 줄은 시안에 적힌 값 그대로다.
const BANK_BRANCHES: readonly BankBranch[] = [
    {code: 'ibk-seoul', bankName: '기업은행', giroCode: '0202412', name: '서울지점'},
    {code: 'kb-gangnam', bankName: '국민은행', giroCode: '0123456', name: '강남지점'},
    {code: 'shinhan-busan', bankName: '신한은행', giroCode: '9876543', name: '부산지점'},
    {code: 'hana-daegu', bankName: '하나은행', giroCode: '5647382', name: '대구지점'},
    {code: 'woori-incheon', bankName: '우리은행', giroCode: '2233445', name: '인천지점'},
    {code: 'kb-yeouido', bankName: '국민은행', giroCode: '0123457', name: '여의도지점'},
    {code: 'shinhan-jongno', bankName: '신한은행', giroCode: '9876544', name: '종로지점'},
    {code: 'shinhan-pangyo', bankName: '신한은행', giroCode: '9876545', name: '판교지점'},
    {code: 'ibk-guro', bankName: '기업은행', giroCode: '0202413', name: '구로디지털지점'},
    {code: 'ibk-daejeon', bankName: '기업은행', giroCode: '0202414', name: '대전지점'},
    {code: 'nh-cheongju', bankName: '농협은행', giroCode: '3344556', name: '청주지점'},
    {code: 'busan-seomyeon', bankName: '부산은행', giroCode: '6677889', name: '서면지점'},
    {code: 'busan-ulsan', bankName: '부산은행', giroCode: '6677890', name: '울산지점'},
    {code: 'busan-haeundae', bankName: '부산은행', giroCode: '6677891', name: '해운대지점'},
    {code: 'busan-gimhae', bankName: '부산은행', giroCode: '6677892', name: '김해지점'},
    {code: 'gwangju-sangmu', bankName: '광주은행', giroCode: '7788990', name: '상무지점'},
]

export {BANKS, BANK_BRANCHES, TECH_EVALUATION_CENTERS, TECH_EVALUATION_REGIONS}
export type {BankBranch, TechEvaluationCenter}
