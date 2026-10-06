'use client'

import {useState} from 'react'
import mockNoticeImage3x4 from '@public/images/home-notice/mock-notice-image-3x4.webp'
import mockNoticeImage4x3 from '@public/images/home-notice/mock-notice-image-4x3.webp'
import mockNoticeImageTall from '@public/images/home-notice/mock-notice-image-tall-9x16.webp'
import mockNoticeImageWide from '@public/images/home-notice/mock-notice-image-wide-16x9.webp'
import {HomeNoticePopup} from '@/components/custom/home-notice-popup'
import {Button} from '@/components/ui/button'
import type {HomeNotice} from '@/content/service/home-notices'

// 홈 공지 팝업 가이드의 케이스 목록 — [열기]를 누르면 그 케이스의 공지로 팝업을 띄운다.
// 팝업은 화면 폭에 따라 보이는 카드 수가 달라지므로, 창 폭을 바꿔 가며 같은 케이스를 다시 열어 본다.

const SHORT_BODY = '10월 17일(토) 00:00 ~ 06:00 동안 서비스 이용이 제한됩니다.'
const MEDIUM_BODY = [
    'K-BIGx 기업혁신성장 보고서의 구성과 조회 화면이 새로워졌습니다.',
    '',
    '· Tech-Index 표준정보 비교와 혁신역량별 분석 항목이 추가되었습니다.',
    '· 보고서를 화면에서 확인한 뒤 바로 인쇄하거나 PDF 로 저장할 수 있습니다.',
].join('\n')
const LONG_BODY = [
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
].join('\n')

const TEXT_SHORT: HomeNotice = {id: 'text-short', title: '시스템 정기 점검 안내', body: SHORT_BODY}
const TEXT_MEDIUM: HomeNotice = {id: 'text-medium', title: 'K-BIGx 기업혁신성장 보고서 개편 안내', body: MEDIUM_BODY}
const TEXT_LONG: HomeNotice = {id: 'text-long', title: '시스템 정기 점검 안내', body: LONG_BODY}
const IMAGE_TEXT: HomeNotice = {
    id: 'image-text',
    title: 'K-BIGx 기업혁신성장 보고서 개편 안내',
    body: MEDIUM_BODY,
    image: mockNoticeImage4x3,
}
// 본문을 비우면 그림만 보인다 — 제목은 화면에 나오지 않고 그림의 대체 텍스트가 된다.
const IMAGE_ONLY: HomeNotice = {
    id: 'image-only',
    title: '자가진단 서비스 안내 — 우리 기업 기술력, 자가진단으로 확인하세요',
    image: mockNoticeImage3x4,
}

// 같은 공지를 여러 장 넣을 때 id 만 바꾼다(id 는 한 팝업 안에서 겹치면 안 된다).
const withId = (notice: HomeNotice, id: string): HomeNotice => ({...notice, id})

type NoticeCase = {
    key: string
    title: string
    description: string
    items: readonly HomeNotice[]
}

const BASIC_CASES: readonly NoticeCase[] = [
    {
        key: 'mixed',
        title: '기본 — 글만 · 그림+글 · 그림만',
        description: '세 가지 카드 모양이 한 번에 뜨는 기본 구성입니다(메인 화면의 목업과 같습니다).',
        items: [TEXT_LONG, IMAGE_TEXT, IMAGE_ONLY],
    },
    {
        key: 'text-only',
        title: '글만 3건 — 긴 글 · 중간 · 짧은 글',
        description:
            '카드 높이는 글 길이와 무관하게 같습니다. 긴 글은 카드 안에서 스크롤되고, 짧은 글은 아래가 빈 채로 남습니다.',
        items: [TEXT_LONG, TEXT_MEDIUM, TEXT_SHORT],
    },
    {
        key: 'image-text',
        title: '그림+글 3건',
        description: '그림(4:3)이 위를 차지해 글 자리가 좁습니다. 글은 그림 아래에서 스크롤됩니다.',
        items: [
            IMAGE_TEXT,
            withId({...IMAGE_TEXT, body: SHORT_BODY}, 'image-text-2'),
            withId(IMAGE_TEXT, 'image-text-3'),
        ],
    },
    {
        key: 'image-only',
        title: '그림만 3건',
        description:
            '본문을 비우면 그림(3:4)이 카드 안쪽을 다 채웁니다. 제목은 화면에 보이지 않고 그림의 대체 텍스트로 읽힙니다.',
        items: [IMAGE_ONLY, withId(IMAGE_ONLY, 'image-only-2'), withId(IMAGE_ONLY, 'image-only-3')],
    },
    {
        key: 'two',
        title: '2건',
        description:
            'PC · 태블릿은 조작 줄 없이 두 장이 가운데에 모입니다. 모바일은 한 장씩 보여 조작 줄(1 / 2)이 나옵니다.',
        items: [TEXT_LONG, IMAGE_TEXT],
    },
    {
        key: 'one-text',
        title: '1건 — 글만',
        description: '모든 화면 폭에서 조작 줄 없이 한 장만 가운데에 놓입니다.',
        items: [TEXT_MEDIUM],
    },
    {
        key: 'one-image',
        title: '1건 — 그림만',
        description: '그림 한 장만 띄우는 포스터형 공지입니다.',
        items: [IMAGE_ONLY],
    },
]

const EDGE_CASES: readonly NoticeCase[] = [
    {
        key: 'long-title',
        title: '제목이 긴 경우',
        description:
            '제목은 줄여 쓰지 않고 여러 줄로 내려갑니다. 그림+글 카드에서는 제목만으로 글 자리가 차서 본문은 스크롤해야 보입니다.',
        items: [
            {
                id: 'long-title-text',
                title: '2026년 하반기 기술평가 통합 플랫폼 서비스 개편 및 평가모형 기준 변경에 따른 이용 안내',
                body: MEDIUM_BODY,
            },
            {
                ...IMAGE_TEXT,
                id: 'long-title-image',
                title: '2026년 하반기 기술평가 통합 플랫폼 서비스 개편 및 평가모형 기준 변경에 따른 이용 안내',
            },
        ],
    },
    {
        key: 'title-only',
        title: '본문이 없는 경우',
        description:
            '그림이 없으면 제목만 있는 글 카드가 되고, 그림이 있으면 그림만 있는 카드가 됩니다(제목은 대체 텍스트로만 쓰입니다).',
        items: [{id: 'title-only', title: '추석 연휴 고객센터 운영 안내'}, IMAGE_ONLY],
    },
    {
        key: 'no-title',
        title: '제목이 비어 있는 경우',
        description:
            '제목은 채우는 것이 원칙입니다. 비어 있어도 그림의 대체 텍스트가 빈 채로 나가지 않도록 "공지 n 이미지"를 대신 넣습니다. 글 카드는 본문만 보여 줍니다.',
        items: [
            {id: 'no-title-image-only', image: mockNoticeImage3x4},
            {id: 'no-title-image-text', body: MEDIUM_BODY, image: mockNoticeImage4x3},
            {id: 'no-title-text', body: MEDIUM_BODY},
        ],
    },
    {
        key: 'unbroken',
        title: '띄어쓰기 없는 긴 글(주소 · 영문)',
        description:
            '주소나 영문처럼 띄어쓰기가 없는 긴 글은 카드 폭에서 강제로 줄을 바꿉니다. 가로 스크롤은 생기지 않습니다.',
        items: [
            {
                id: 'unbroken',
                title: 'https://www.k-top.or.kr/notice/announcements/detail?id=20261017-system-maintenance',
                body: '자세한 내용은 아래 주소에서 확인해 주세요.\nhttps://www.k-top.or.kr/notice/announcements/detail?id=20261017-system-maintenance&utm_source=home-popup\n\nTechnologyEvaluationIntegratedPlatformServiceMaintenanceNotice',
            },
        ],
    },
    // 비율 확인용 그림에는 칸마다 보이는 범위(점선)와 잘리는 범위(빗금)가 그려져 있다.
    {
        key: 'image-wide',
        title: '비율이 맞지 않는 그림 — 가로로 긴 그림(16:9)',
        description:
            '그림은 찌그러지지 않고 가운데를 기준으로 좌우가 잘립니다. 4:3 칸(본문과 함께)에서는 양쪽 빨간 빗금만, 3:4 칸(그림만)에서는 주황 빗금까지 잘려 가운데 파란 범위만 남습니다.',
        items: [
            {
                id: 'wide-in-4x3',
                title: '16:9 그림을 4:3 칸에',
                body: '양쪽 빨간 빗금이 잘리고, 주황 빗금과 가운데 파란 범위가 보입니다.',
                image: mockNoticeImageWide,
            },
            {id: 'wide-in-3x4', title: '16:9 그림을 3:4 칸에 넣은 예시', image: mockNoticeImageWide},
        ],
    },
    {
        key: 'image-tall',
        title: '비율이 맞지 않는 그림 — 세로로 긴 그림(9:16)',
        description:
            '가운데를 기준으로 위아래가 잘립니다. 3:4 칸(그림만)에서는 위아래 빨간 빗금만, 4:3 칸(본문과 함께)에서는 주황 빗금까지 잘려 가운데 파란 범위만 남습니다.',
        items: [
            {
                id: 'tall-in-4x3',
                title: '9:16 그림을 4:3 칸에',
                body: '위아래 빗금이 모두 잘리고 가운데 파란 범위만 보입니다.',
                image: mockNoticeImageTall,
            },
            {id: 'tall-in-3x4', title: '9:16 그림을 3:4 칸에 넣은 예시', image: mockNoticeImageTall},
        ],
    },
    {
        key: 'over-limit',
        title: '4건 이상이 넘어온 경우',
        description:
            '백오피스 등록 한도는 3건입니다. 그보다 많이 넘어와도 앞 3건만 보여 줍니다(이 케이스는 5건을 넘깁니다).',
        items: [
            TEXT_SHORT,
            withId(TEXT_MEDIUM, 'over-2'),
            withId(IMAGE_TEXT, 'over-3'),
            withId(IMAGE_ONLY, 'over-4'),
            withId(TEXT_LONG, 'over-5'),
        ],
    },
    {
        key: 'empty',
        title: '공지가 없는 경우',
        description: '빈 배열이면 팝업을 그리지 않습니다. [열기]를 눌러도 아무것도 뜨지 않는 것이 정상입니다.',
        items: [],
    },
]

const NOTICE_CASE_GROUPS = {basic: BASIC_CASES, edge: EDGE_CASES}

const HomeNoticePopupCases = ({group}: {group: keyof typeof NOTICE_CASE_GROUPS}) => {
    const cases = NOTICE_CASE_GROUPS[group]
    const [activeKey, setActiveKey] = useState<string>()
    const activeCase = cases.find((noticeCase) => noticeCase.key === activeKey)

    return (
        <>
            <ul className="border-subtle-3 flex flex-col border-t">
                {cases.map((noticeCase) => (
                    <li
                        key={noticeCase.key}
                        className="border-subtle-3 flex items-center justify-between gap-4 border-b py-4"
                    >
                        <div className="flex min-w-0 flex-col gap-1">
                            <h3 className="typo-body-xl-bold text-foreground">{noticeCase.title}</h3>
                            <p className="typo-body-l-regular text-label-foreground break-keep">
                                {noticeCase.description}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="tertiary"
                            size="sm"
                            className="shrink-0"
                            onClick={() => setActiveKey(noticeCase.key)}
                        >
                            열기
                            <span className="sr-only">{` (${noticeCase.title})`}</span>
                        </Button>
                    </li>
                ))}
            </ul>

            {/* 닫히면 내려서, 같은 케이스를 다시 눌러도 처음 상태로 열린다. */}
            {activeCase ? (
                <HomeNoticePopup
                    key={activeCase.key}
                    items={activeCase.items}
                    onClose={() => setActiveKey(undefined)}
                />
            ) : null}
        </>
    )
}

export default HomeNoticePopupCases
