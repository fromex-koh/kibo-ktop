import type {Metadata} from 'next'
import {findPatentGradeReport, MOCK_PATENT_SEARCH_DEFAULTS} from '@/content/service/patent-grade'
import {PatentGradeLookup} from '@/components/custom/patent-grade-lookup'
import {PatentGradeIntro, PatentGradeNotice} from '@/components/custom/patent-grade-sections'

export const metadata: Metadata = {title: '특허 등급조회 결과'}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// 특허 등급조회(기관) — 결과 화면 (org-patent-evaluation-patent-grade-list-patent-grade-result ·
// /org/patent-evaluation/patent-grade-list/patent-grade-result)
// 기업 결과 화면(/corp/patent-evaluation/patent-grade-list/patent-grade-result)과 같은 구성이며 브레드크럼 홈 주소만 다르다.
//
// 조회 화면(../page.tsx)과 같은 한 화면의 '검색 후' 상태다. 같은 컴포넌트(PatentGradeLookup)에
//   · 검색 칸 기본값(searchDefaults) — 목업 보고서의 특허등록번호 · 특허출원번호
//   · 처음부터 보일 결과(initialReport) — 그 번호로 조회한 목업 보고서
// 를 넘겨, 번호가 들어 있고 결과 보고서 · [결과 보고서 출력]이 보이는 상태로 시작한다.
// 여기서도 검색 · 초기화는 조회 화면과 똑같이 동작한다([초기화]하면 결과 영역이 사라진 검색 전 상태로 돌아간다).
//
// [프론트엔드 연동] 이 주소는 퍼블리싱 확인용이다. 실제 서비스는 조회 화면 하나에서 검색 결과로 바뀐다.
// 결과 화면을 주소로 따로 둔다면, 아래 목업 대신 주소의 검색 조건(기준 · 번호)으로 조회한 보고서를 initialReport 로,
// 그 번호를 searchDefaults 로 넘긴다. 따로 두지 않는다면 이 폴더(patent-grade-result)를 지운다.
// ─────────────────────────────────────────────────────────────────────────────────────────────

// 목업 — 조회 화면의 기본 검색 기준(특허등록번호)과 같은 번호로 조회한 결과.
const MOCK_INITIAL_REPORT = findPatentGradeReport({
    type: 'registration',
    number: MOCK_PATENT_SEARCH_DEFAULTS.registration,
})

const OrgPatentGradeResultPage = () => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <PatentGradeLookup
            intro={<PatentGradeIntro homeHref="/org/home" />}
            notice={<PatentGradeNotice />}
            searchDefaults={MOCK_PATENT_SEARCH_DEFAULTS}
            initialReport={MOCK_INITIAL_REPORT}
        />
    </main>
)

export default OrgPatentGradeResultPage
