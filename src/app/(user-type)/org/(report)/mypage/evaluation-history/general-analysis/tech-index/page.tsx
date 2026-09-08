import type {Metadata} from 'next'

export const metadata: Metadata = {title: 'Tech-Index 일반분석'}

// 기관 평가결과 조회 > 일반분석 > Tech-Index — 아직 시안이 없어 빈 화면으로 둔다.
//
// 자리(주소·퍼블리싱 인덱스 행)만 잡아 둔 것이라 화면에 보이는 것은 없다. 시안이 나오면 KTRS-FM 화면
// (같은 폴더의 ktrs-fm/page.tsx)처럼 EvaluationReportScreen 에 이 모형의 리포트를 넘기면 된다 —
// 문서 꼬리표는 constants/evaluation-report.ts 의 getEvaluationReportLabel 이 모형과 분석 종류로 만든다.
const OrgMypageEvaluationHistoryGeneralAnalysisTechIndexPage = () => (
    <main id="main" tabIndex={-1} className="bg-background min-h-dvh">
        {/* 화면에 보이는 제목이 없어도 제목이 하나도 없는 페이지가 되지 않게 이름만 남긴다[6.4.2]. */}
        <h1 className="sr-only">Tech-Index 일반분석</h1>
    </main>
)

export default OrgMypageEvaluationHistoryGeneralAnalysisTechIndexPage
