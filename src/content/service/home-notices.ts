import type {StaticImageData} from 'next/image'
import mockNoticeImage4x3 from '@public/images/home-notice/mock-notice-image-4x3.webp'
import mockNoticeImage3x4 from '@public/images/home-notice/mock-notice-image-3x4.webp'

// 홈 공지 팝업(components/custom/home-notice-popup.tsx)이 보여 줄 공지 — 목업이다.
//
// 공지 한 건이 카드 한 장이고, 채운 값에 따라 모양이 정해진다.
//   · 글만       — title · body
//   · 그림 + 글  — image(4:3) · title · body
//   · 그림만     — image(3:4) · title. body 를 비우면 그림이 카드를 채우고, title 은 화면에 보이지 않는다
//
// 그림의 대체 텍스트는 따로 받지 않는다(백오피스에 입력 칸이 없다) — title 이 그 역할을 한다.
// 그림만 있는 공지에도 title 을 채우는 것이 원칙이고, 비어 있으면 팝업이 기본 문구를 넣는다.
//
// [프론트엔드 연동]
//   · getHomeNotices() 가 노출 중인 팝업 공지를 이 모양으로 돌려주면 화면과 팝업은 고치지 않아도 된다.
//     노출 기간 · 게시 여부는 서버가 거른다고 본다. 빈 배열이면 팝업이 뜨지 않는다.
//   · 그림을 서버 주소로 받으면 image 에 그 주소 문자열을 넣고,
//     next.config 의 images.remotePatterns 에 그 호스트를 등록한다.

type HomeNotice = {
    id: string
    /**
     * 제목. 그림만 있는 공지에서는 화면에 보이지 않고 그림의 대체 텍스트로 쓰인다.
     * 비어 있으면 팝업이 '공지 n 이미지'를 대신 넣는다 — 대체 텍스트가 빈 채로 나가지는 않는다.
     */
    title?: string
    /** 본문. 줄바꿈(\n)은 그대로 줄을 나눈다. 길면 카드 안에서 스크롤된다. */
    body?: string
    /** 그림. 본문이 함께 있으면 4:3, 없으면 카드를 채운 3:4 로 잘라 보여 준다. */
    image?: StaticImageData | string
}

// 목업 그림(public/images/home-notice/mock-notice-image-*.webp)은 실제 서비스 그림이 아니다 —
// 그림 칸의 비율을 확인하기 위한 예시다. 4:3(960×720) · 3:4(960×1280).
// 실제 그림도 이 비율로 받아야 잘리지 않는다(다른 비율은 가운데 기준으로 잘린다).
const MOCK_HOME_NOTICES: readonly HomeNotice[] = [
    {
        id: 'notice-001',
        title: '시스템 정기 점검 안내',
        body: [
            '안정적인 서비스 제공을 위해 시스템 정기 점검을 실시합니다.',
            '',
            '점검 일시',
            '2026년 10월 17일(토) 00:00 ~ 06:00',
            '',
            '점검 중 이용이 제한되는 서비스',
            '· 기술평가 자가진단 신청 및 평가결과 조회',
            '· 특허평가 등급 조회 및 결과 보고서 출력',
            '· K-BIGx 보고서 조회 및 이용권 결제',
            '',
            '작성 중이던 자가진단 내용은 점검 시작 전에 임시저장해 주시기 바랍니다. 점검 시간은 작업 상황에 따라 앞당겨 끝나거나 늦어질 수 있습니다.',
            '',
            '이용에 불편을 드려 죄송합니다. 문의 사항은 마이페이지 > 1:1 문의로 남겨 주시면 순서대로 답변드리겠습니다.',
        ].join('\n'),
    },
    {
        id: 'notice-002',
        title: 'K-BIGx 기업혁신성장 보고서 개편 안내',
        body: [
            'K-BIGx 기업혁신성장 보고서의 구성과 조회 화면이 새로워졌습니다.',
            '',
            '· Tech-Index 표준정보 비교와 혁신역량별 분석 항목이 추가되었습니다.',
            '· 보고서를 화면에서 확인한 뒤 바로 인쇄하거나 PDF 로 저장할 수 있습니다.',
            '· 이전에 조회한 보고서는 마이페이지 > K-BIGx 보고서 이력에서 그대로 확인할 수 있습니다.',
        ].join('\n'),
        image: mockNoticeImage4x3,
    },
    {
        id: 'notice-003',
        title: '자가진단 서비스 안내 — 우리 기업 기술력, 자가진단으로 확인하세요',
        image: mockNoticeImage3x4,
    },
]

const getHomeNotices = async (): Promise<readonly HomeNotice[]> => MOCK_HOME_NOTICES

export {getHomeNotices}
export type {HomeNotice}
