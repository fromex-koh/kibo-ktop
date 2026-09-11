import {NOTICE_CATEGORY, type NoticeCategory} from '@/components/custom/notice-category'

// 홈 공지 팝업이 보여 줄 공지 — 목업이다.
//
// [프론트엔드 연동] 화면(page.tsx)은 getHomeNotices() 하나만 부른다. 목업을 지우고 노출 기간이 살아 있는
// 팝업 공지를 이 모양으로 돌려주면 화면·팝업은 고치지 않아도 된다. 빈 배열이면 팝업이 아예 뜨지 않는다.
// 노출 기간·게시 여부는 서버가 걸러 준다고 보고 화면에서는 다시 보지 않는다.

type HomeNotice = {
    id: string
    category: NoticeCategory
    title: string
    /** 팝업에 보여 줄 짧은 안내. 본문 전체가 아니라 요약이다. */
    summary: string
    /** 게시일(YYYY-MM-DD). */
    postedAt: string
}

const MOCK_HOME_NOTICES: readonly HomeNotice[] = [
    {
        id: 'notice-001',
        category: 'system',
        title: '시스템 정기 점검 안내',
        summary:
            '2026년 9월 20일(토) 00:00 ~ 06:00 동안 서비스 이용이 제한됩니다. 점검 시간에는 평가 신청과 결과 조회가 되지 않습니다.',
        postedAt: '2026-09-08',
    },
    {
        id: 'notice-002',
        category: 'service',
        title: 'K-BIGx 보고서 서비스 개편 안내',
        summary:
            '보고서 항목과 조회 화면이 새로워졌습니다. 이전에 발급한 보고서는 마이페이지 > K-BIGx 보고서 이력에서 그대로 확인할 수 있습니다.',
        postedAt: '2026-09-05',
    },
    {
        id: 'notice-003',
        category: 'payment',
        title: '이용권 결제 수단 추가 안내',
        summary:
            '계좌이체와 가상계좌로도 이용권을 결제할 수 있습니다. 세금계산서는 결제일 기준 다음 달 10일에 발행됩니다.',
        postedAt: '2026-09-01',
    },
]

const getHomeNotices = async (): Promise<readonly HomeNotice[]> => MOCK_HOME_NOTICES

export {getHomeNotices, NOTICE_CATEGORY}
export type {HomeNotice}
