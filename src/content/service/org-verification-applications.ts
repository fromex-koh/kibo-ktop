import {GUARANTEE_RECOMMENDATION_FIELD, type EvaluationResultAction} from '@/constants/evaluation-result'
import type {VerificationApplicationItem} from '@/constants/verification-application'

// 기관 평가검증 신청 조회 데이터.
//
// [프론트엔드 연동] 화면(page.tsx)은 getOrgVerificationApplications() 하나만 부른다 — 목업을 실제 조회
// API 로 바꿀 때 고칠 파일은 여기뿐이고 화면·목록 컴포넌트는 건드리지 않는다.
//   1) MOCK_VERIFICATION_APPLICATIONS 를 지우고
//   2) getOrgVerificationApplications 안에서 조회 API 를 부른 뒤
//   3) 응답을 VerificationApplicationItem(= 카드 한 장) 모양으로 맞춰 돌려준다.
// 응답이 빈 배열이면 목록 자리에 "검색내역이 없습니다." 안내가 나온다.
//
// 조회 조건(조회기간·기업명)은 지금 목록 컴포넌트가 화면 안에서 거른다. 서버 조회로 넘길 때는 이 함수에
// 조건을 받는 인자를 열고 목록의 [프론트엔드 연동] 주석 자리에서 부른다.

// 아직 화면이 없는 버튼은 자리를 비워 둔다.
const NOT_READY_PATH = '#'
const GENERAL_ANALYSIS_PATH = '/org/mypage/evaluation-history/general-analysis'

// [자가진단 일반 결과]·[평가검증 결과]는 같은 창이 아니라 시안 폭에 맞춘 새 창(인쇄용 리포트)으로 연다.
//
// [프론트엔드 연동] 리포트 화면은 모형마다 경로가 하나뿐이라, 어느 건의 결과인지는 쿼리(id)로 넘긴다.
// 카드마다 주소가 같으면 이웃한 링크가 같은 곳을 가리키는 셈이라 스크린리더가 같은 링크를 되풀이해 읽고
// WAVE 도 Redundant link 로 잡는다 — 공지 목록(notice/announcements)에서 쓴 방식과 같다.
//
// 주소가 길어 보이는 것은 id 가 그 건을 가리키는 값이기 때문이다. 지금은 목업이라 사람이 읽을 수 있는
// 이름(verification-2-history-2)을 쓰지만, 연동하면 조회 결과의 건 번호가 그대로 들어가 짧아진다 —
// 화면에 보이는 값이 아니라 리포트가 어느 건을 그릴지 고르는 열쇠다.
const selfCheckResult = (id: string): EvaluationResultAction => ({
    label: '자가진단 일반 결과',
    href: `${GENERAL_ANALYSIS_PATH}/ktrs-fm?id=${id}`,
    newWindow: true,
})

const verificationResult = (id: string): EvaluationResultAction => ({
    label: '평가검증 결과',
    href: `${GENERAL_ANALYSIS_PATH}/ktrs-fm?id=${id}`,
    newWindow: true,
})

// 보증추천은 화면 이동이 아니라 모달을 연다(opens). 입력을 마치면 버튼 이름이 [보증이력] 으로 바뀐다.
const GUARANTEE_RECOMMEND: EvaluationResultAction = {
    label: '보증추천',
    href: NOT_READY_PATH,
    opens: 'guarantee-recommendation',
}

const GUARANTEE_HISTORY: EvaluationResultAction = {
    label: '보증이력',
    href: NOT_READY_PATH,
    opens: 'guarantee-history',
}

// 시안 "마이페이지_평가검증 신청 조회"의 카드 두 장을 그대로 옮긴 것이다. 값(등급·접수일·기업명·
// 사업자번호·검증 팀·검증일)도 시안에 적힌 그대로다.
//   1) 이력 1건 — 카드 버튼은 [자가진단 일반 결과]·[보증이력]
//   2) 이력 2건 — 카드 버튼은 [자가진단 일반 결과]·[보증추천]
//   3) 시안에 없는 길이 확인용 — 기업명·검증 기관명이 칸을 넘는 경우를 화면에서 바로 볼 수 있게 둔다.
//      실제 데이터로 바꿀 때는 지운다.
const MOCK_VERIFICATION_APPLICATIONS: readonly VerificationApplicationItem[] = [
    {
        id: 'verification-1',
        model: 'ktrs-fm',
        grade: 'AA',
        receivedAt: '2026-05-15',
        companyName: '(주)테크놀로지',
        businessNumber: '683-68-00428',
        verifyHref: NOT_READY_PATH,
        actions: [selfCheckResult('verification-1'), GUARANTEE_HISTORY],
        history: [
            {
                id: 'verification-1-history-1',
                team: '부산은행 재무팀',
                verifiedAt: '2026-05-15',
                grade: 'AA',
                actions: [verificationResult('verification-1-history-1'), GUARANTEE_HISTORY],
            },
        ],
    },
    {
        id: 'verification-2',
        model: 'ktrs-fm',
        grade: 'AA',
        receivedAt: '2026-05-15',
        companyName: '(주)테크놀로지',
        businessNumber: '683-68-00428',
        verifyHref: NOT_READY_PATH,
        actions: [selfCheckResult('verification-2'), GUARANTEE_RECOMMEND],
        history: [
            {
                id: 'verification-2-history-1',
                team: '부산은행 재무팀',
                verifiedAt: '2026-05-15',
                grade: 'AA',
                actions: [verificationResult('verification-2-history-1'), GUARANTEE_HISTORY],
            },
            {
                id: 'verification-2-history-2',
                team: '부산은행 심사팀',
                verifiedAt: '2026-07-25',
                grade: 'B+',
                actions: [verificationResult('verification-2-history-2'), GUARANTEE_RECOMMEND],
            },
        ],
    },
    {
        id: 'verification-3',
        model: 'ktrs-fm',
        grade: 'B+',
        receivedAt: '2026-06-30',
        companyName: '주식회사 대한민국첨단기술융합연구개발센터',
        businessNumber: '683-68-00428',
        verifyHref: NOT_READY_PATH,
        actions: [selfCheckResult('verification-3'), GUARANTEE_RECOMMEND],
        history: [
            {
                id: 'verification-3-history-1',
                team: '부산은행 기술금융심사본부 제2기업여신심사팀',
                verifiedAt: '2026-06-30',
                grade: 'B+',
                actions: [verificationResult('verification-3-history-1'), GUARANTEE_RECOMMEND],
            },
        ],
    },
]

const getOrgVerificationApplications = async (): Promise<readonly VerificationApplicationItem[]> =>
    MOCK_VERIFICATION_APPLICATIONS

// [보증추천] 모달이 미리 채울 값 — 그 카드가 들고 있는 기업 정보다.
const getGuaranteeDefaults = (item: VerificationApplicationItem): Record<string, string> => ({
    [GUARANTEE_RECOMMENDATION_FIELD.companyName]: item.companyName,
    [GUARANTEE_RECOMMENDATION_FIELD.businessNumber]: item.businessNumber,
})

export {getOrgVerificationApplications, getGuaranteeDefaults}
