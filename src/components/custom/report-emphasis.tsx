import type {ReactNode} from 'react'

// 리포트 요약 문장의 **강조** 를 굵은 글자로 바꾼다.
//
// [프론트엔드 연동] 기업명·점수·등급이 섞인 한 문장이라 조각내지 않고 한 덩어리로 받는다 —
// 굵게 세울 곳만 별 두 개로 감싸면 된다(예: '… **상위 2.2% 이내** 수준입니다.').
const EMPHASIS_PATTERN = /\*\*(.+?)\*\*/g

const renderReportEmphasis = (text: string): ReactNode[] =>
    text.split(EMPHASIS_PATTERN).map((part, index) =>
        // split 의 홀수 자리가 별표로 묶인 강조 부분이다.
        index % 2 === 1 ? (
            <strong key={`${part}-${index}`} className="font-bold">
                {part}
            </strong>
        ) : (
            <span key={`${part}-${index}`}>{part}</span>
        ),
    )

export {renderReportEmphasis}
