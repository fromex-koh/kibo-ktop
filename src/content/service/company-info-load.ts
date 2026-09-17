// 기관 개별평가 기업정보 [기업정보 관리] → 기업정보 불러오기 모달의 데이터.
//
// [프론트엔드 연동] 모달(CompanyInfoLoadDialog)은 이 파일이 돌려주는 값만 그린다 — 목업을 조회 API 로
// 바꿀 때 고칠 곳은 여기뿐이고 모달·화면 컴포넌트는 건드리지 않는다.
//   1) MOCK_ROWS · MOCK_MODEL_NAMES 를 지우고
//   2) getCompanyInfoLoadResult 안에서 조회 API 를 부른 뒤(평가모형 · 조회 조건 · 쪽 번호가 인자로 온다)
//   3) 응답을 CompanyInfoLoadResult(모형 이름 · 목록 한 쪽 · 전체 건수 · 전체 쪽수) 모양으로 맞춰 돌려준다.
// items 가 빈 배열이면 목록 자리에 "이력이 없습니다." 안내가 나온다.
// 줄을 고르고 [선택]을 누르면 companyInfo 가 기업정보 폼 칸에 그대로 들어간다(org-company-info-form 의 fillCompanyInfo).

// 평가모형 — 화면이 어느 모형의 기업정보를 불러오는지 알려 주는 키. 표에 보이는 이름은 응답의 modelName 이다.
export type CompanyInfoLoadModel = 'ktrs-fm' | 'tech-index-general' | 'tech-index-startup' | 'investment-model'

// 고른 기업으로 채우는 기업정보 폼 값 — 키마다 폼의 칸 하나에 대응한다.
export type CompanyInfoLoadCompanyInfo = {
    /** 기업형태 — individual(개인) · corporation(법인) · etc(기타). */
    corpType: 'individual' | 'corporation' | 'etc'
    /** 기업명 표기(법인만) — prefix(앞) · suffix(뒤). 법인이 아니면 빈 문자열. */
    companyNameMark: '' | 'prefix' | 'suffix'
    /** 사업자번호(123-45-67890). */
    bizNo: string
    /** 법인번호(법인만, 110111-1234567). 법인이 아니면 빈 문자열. */
    corpNo: string
    /** 기업명 — 법인 표기((주))를 뺀 이름. */
    companyName: string
    /** 설립일(개업일) — YYYY-MM-DD. */
    foundDate: string
    ceoName: string
    companyTel: string
    /** 업종코드(한국표준산업분류 세세분류)와 업종명 — 칸에는 "코드 업종명" 으로 보인다. */
    industryCode: string
    industryName: string
    /** 주소 — "(우편번호) 도로명주소". */
    address: string
    addressDetail: string
}

// 목록 한 줄 — 시안 항목 순서(기업명 · 기업 사업자번호 · 조회 기관 · 평가일) + 고르면 채울 기업정보.
export type CompanyInfoLoadItem = {
    id: string
    companyName: string
    businessNumber: string
    inquiryAgency: string
    evaluatedAt: string
    companyInfo: CompanyInfoLoadCompanyInfo
}

// 조회 조건 — 모달의 필터 폼이 [검색] 때 넘기는 값. 이름은 폼 칸의 name 과 같다.
//   loadPeriodPreset : today · 1month · 3months · all (빠른 기간)
//   loadPeriodFrom · loadPeriodTo : 시작·종료일(YYYY-MM-DD, 비면 빈 문자열)
//   loadCompanyName : 기업명 검색어
export type CompanyInfoLoadFilters = Record<string, string>

export type CompanyInfoLoadResult = {
    /** 결과 줄 앞에 붙는 평가모형 이름 — 응답이 내려 주는 값을 그대로 쓴다(예: KTRS-FM). */
    modelName: string
    /** 지금 쪽에 보여 줄 줄(서버가 쪽 단위로 잘라 준다). */
    items: CompanyInfoLoadItem[]
    /** 조건에 맞는 전체 건수 — "총 N건". */
    totalCount: number
    /** 전체 쪽수 — 페이지 이동. */
    totalPages: number
}

// 목업 — 모형 키별 이름(시안 메모 "평가모형 명칭 노출 케이스").
const MOCK_MODEL_NAMES: Record<CompanyInfoLoadModel, string> = {
    'ktrs-fm': 'KTRS-FM',
    'tech-index-general': 'Tech-Index (일반)',
    'tech-index-startup': 'Tech-Index (창업)',
    'investment-model': '투자모형',
}

// 목업 한 줄의 원본 — 법인번호가 있으면 법인, 없으면 개인이다. 업종은 "코드 업종명" 한 문자열로 적는다.
type MockRow = Omit<CompanyInfoLoadItem, 'companyInfo'> & {
    corpNo: string
    foundDate: string
    ceoName: string
    companyTel: string
    industry: string
    address: string
    addressDetail: string
}

const CORPORATION_MARK = '㈜'

const toItem = ({corpNo, foundDate, ceoName, companyTel, industry, address, addressDetail, ...row}: MockRow) => {
    const isCorporation = corpNo !== ''
    const [industryCode, ...industryNameParts] = industry.split(' ')
    const companyInfo: CompanyInfoLoadCompanyInfo = {
        corpType: isCorporation ? 'corporation' : 'individual',
        companyNameMark: !isCorporation ? '' : row.companyName.startsWith(CORPORATION_MARK) ? 'prefix' : 'suffix',
        bizNo: row.businessNumber,
        corpNo,
        companyName: row.companyName.replace(CORPORATION_MARK, ''),
        foundDate,
        ceoName,
        companyTel,
        industryCode,
        industryName: industryNameParts.join(' '),
        address,
        addressDetail,
    }
    return {...row, companyInfo}
}

// 목업 — 한 쪽 10줄에 5줄을 더해 두 쪽(10줄 + 5줄)이 나오게 한다. 페이지 이동을 눌러 볼 수 있어야 해서다.
const MOCK_ROWS: MockRow[] = [
    {
        id: '1',
        companyName: '㈜바이오랩',
        businessNumber: '683-68-00428',
        inquiryAgency: '부산은행 울산지점',
        evaluatedAt: '2026-09-06',
        corpNo: '230111-0123456',
        foundDate: '2015-03-02',
        ceoName: '김민준',
        companyTel: '052-123-4567',
        industry: '21100 기초 의약 물질 제조업',
        address: '(44543) 울산광역시 중구 종가로 405',
        addressDetail: '바이오센터 3층',
    },
    {
        id: '2',
        companyName: '㈜그린바이오',
        businessNumber: '123-45-67890',
        inquiryAgency: '국민은행 서울지점',
        evaluatedAt: '2025-12-15',
        corpNo: '110111-2345678',
        foundDate: '2012-07-16',
        ceoName: '이서연',
        companyTel: '02-3456-7890',
        industry: '20111 석유화학계 기초 화학물질 제조업',
        address: '(06164) 서울특별시 강남구 테헤란로 521',
        addressDetail: '12층',
    },
    {
        id: '3',
        companyName: '에코테크솔루션글로벌스마트제조혁신연구개발센터',
        businessNumber: '987-65-43210',
        inquiryAgency: '신한은행 대전지점',
        evaluatedAt: '2024-07-20',
        corpNo: '',
        foundDate: '2019-05-10',
        ceoName: '박도윤',
        companyTel: '042-234-5678',
        industry: '72111 건축설계 및 관련 서비스업',
        address: '(34126) 대전광역시 유성구 대학로 99',
        addressDetail: '창업보육센터 204호',
    },
    {
        id: '4',
        companyName: '한빛에너지',
        businessNumber: '456-78-90123',
        inquiryAgency: '우리은행 광주광역시 첨단산업단지 기업금융센터 영업부',
        evaluatedAt: '2027-03-18',
        corpNo: '',
        foundDate: '2017-11-01',
        ceoName: '최하은',
        companyTel: '062-345-6789',
        industry: '28111 전동기 및 발전기 제조업',
        address: '(61011) 광주광역시 북구 첨단과기로 208',
        addressDetail: '2동 101호',
    },
    {
        id: '5',
        companyName: '미래소프트인공지능빅데이터플랫폼솔루션㈜',
        businessNumber: '321-54-98765',
        inquiryAgency: '하나은행 대구광역시 수성구 범어동 중앙기업금융지점',
        evaluatedAt: '2024-11-02',
        corpNo: '',
        foundDate: '2020-02-17',
        ceoName: '정시우',
        companyTel: '053-456-7890',
        industry: '62010 컴퓨터 프로그래밍 서비스업',
        address: '(41585) 대구광역시 북구 호암로 51',
        addressDetail: '5층 501호',
    },
    {
        id: '6',
        companyName: '서울메디컬',
        businessNumber: '234-56-78901',
        inquiryAgency: '기업은행 인천지점',
        evaluatedAt: '2026-01-30',
        corpNo: '',
        foundDate: '2016-08-22',
        ceoName: '강지우',
        companyTel: '032-567-8901',
        industry: '70111 물리, 화학 및 생물학 연구개발업',
        address: '(21984) 인천광역시 연수구 송도과학로 32',
        addressDetail: 'M동 1502호',
    },
    {
        id: '7',
        companyName: '넥스트제너레이션',
        businessNumber: '789-01-23456',
        inquiryAgency: '농협은행 강남지점',
        evaluatedAt: '2025-05-12',
        corpNo: '',
        foundDate: '2021-04-05',
        ceoName: '윤서준',
        companyTel: '02-678-9012',
        industry: '62010 컴퓨터 프로그래밍 서비스업',
        address: '(06236) 서울특별시 강남구 테헤란로 152',
        addressDetail: '20층',
    },
    {
        id: '8',
        companyName: '알파시스템',
        businessNumber: '654-32-10987',
        inquiryAgency: '카카오뱅크 판교지점',
        evaluatedAt: '2027-08-22',
        corpNo: '',
        foundDate: '2018-09-12',
        ceoName: '임수아',
        companyTel: '031-789-0123',
        industry: '26111 메모리용 전자집적회로 제조업',
        address: '(13494) 경기도 성남시 분당구 판교역로 235',
        addressDetail: '에이치스퀘어 N동 7층',
    },
    {
        id: '9',
        companyName: '오션바이오',
        businessNumber: '890-12-34567',
        inquiryAgency: '부산은행 해운대지점',
        evaluatedAt: '2024-09-14',
        corpNo: '',
        foundDate: '2014-06-30',
        ceoName: '한예준',
        companyTel: '051-890-1234',
        industry: '21100 기초 의약 물질 제조업',
        address: '(48058) 부산광역시 해운대구 센텀중앙로 78',
        addressDetail: '센텀그린타워 9층',
    },
    {
        id: '10',
        companyName: '인피니티테크',
        businessNumber: '567-89-01234',
        inquiryAgency: '신한은행 강북지점',
        evaluatedAt: '2025-03-28',
        corpNo: '',
        foundDate: '2022-01-10',
        ceoName: '오지호',
        companyTel: '02-901-2345',
        industry: '29111 내연기관 제조업',
        address: '(01000) 서울특별시 강북구 도봉로 315',
        addressDetail: '3층',
    },
    {
        id: '11',
        companyName: '㈜스마트팩토리',
        businessNumber: '345-67-89012',
        inquiryAgency: '국민은행 수원지점',
        evaluatedAt: '2026-04-11',
        corpNo: '135811-3456789',
        foundDate: '2013-10-07',
        ceoName: '서하준',
        companyTel: '031-234-5678',
        industry: '28111 전동기 및 발전기 제조업',
        address: '(16229) 경기도 수원시 영통구 광교로 107',
        addressDetail: '경기R&DB센터 4층',
    },
    {
        id: '12',
        companyName: '그린모빌리티',
        businessNumber: '901-23-45678',
        inquiryAgency: '우리은행 창원지점',
        evaluatedAt: '2025-08-03',
        corpNo: '194211-4567890',
        foundDate: '2011-05-23',
        ceoName: '문지안',
        companyTel: '055-345-6789',
        industry: '29111 내연기관 제조업',
        address: '(51395) 경상남도 창원시 의창구 창원대로 18',
        addressDetail: '본관 2층',
    },
    {
        id: '13',
        companyName: '㈜에이아이랩스',
        businessNumber: '112-34-56789',
        inquiryAgency: '하나은행 판교지점',
        evaluatedAt: '2026-06-19',
        corpNo: '131111-5678901',
        foundDate: '2019-12-02',
        ceoName: '배서윤',
        companyTel: '031-456-7890',
        industry: '70111 물리, 화학 및 생물학 연구개발업',
        address: '(13487) 경기도 성남시 분당구 대왕판교로 660',
        addressDetail: '유스페이스1 A동 8층',
    },
    {
        id: '14',
        companyName: '블루오션머티리얼',
        businessNumber: '223-45-67891',
        inquiryAgency: '기업은행 청주지점',
        evaluatedAt: '2024-12-27',
        corpNo: '',
        foundDate: '2016-03-14',
        ceoName: '신유준',
        companyTel: '043-567-8901',
        industry: '20111 석유화학계 기초 화학물질 제조업',
        address: '(28116) 충청북도 청주시 흥덕구 오송생명로 123',
        addressDetail: '2공장',
    },
    {
        id: '15',
        companyName: '한결로보틱스',
        businessNumber: '334-56-78902',
        inquiryAgency: '농협은행 전주지점',
        evaluatedAt: '2027-01-08',
        corpNo: '',
        foundDate: '2020-09-28',
        ceoName: '황채원',
        companyTel: '063-678-9012',
        industry: '26111 메모리용 전자집적회로 제조업',
        address: '(54852) 전북특별자치도 전주시 덕진구 기린대로 1000',
        addressDetail: '첨단벤처단지 3동',
    },
]

const MOCK_ITEMS: CompanyInfoLoadItem[] = MOCK_ROWS.map(toItem)

// 한 쪽에 보여 줄 줄 수.
const PAGE_SIZE = 10
const FIRST_PAGE = 1

// 조회 — 목업에서 쪽 번호에 맞는 줄만 잘라 돌려준다(1쪽 10줄 · 2쪽 5줄). 건수·쪽수는 목업 줄 수로 센다.
// 모형 이름은 모형 키로 찾는다. 조회 조건(filters)은 목업에서는 거르지 않는다.
export const getCompanyInfoLoadResult = (
    model: CompanyInfoLoadModel = 'ktrs-fm',
    // [프론트엔드 연동] 조회 API 로 바꿀 때 모형 · 조회 조건 · 쪽 번호를 요청에 싣는다.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filters: CompanyInfoLoadFilters = {},
    page = FIRST_PAGE,
): CompanyInfoLoadResult => {
    const totalCount = MOCK_ITEMS.length
    const totalPages = Math.max(FIRST_PAGE, Math.ceil(totalCount / PAGE_SIZE))
    const currentPage = Math.min(Math.max(FIRST_PAGE, page), totalPages)
    const start = (currentPage - FIRST_PAGE) * PAGE_SIZE

    return {
        modelName: MOCK_MODEL_NAMES[model],
        items: MOCK_ITEMS.slice(start, start + PAGE_SIZE),
        totalCount,
        totalPages,
    }
}
