import type {Metadata} from 'next'
import {PatentGradeLookup} from '@/components/custom/patent-grade-lookup'
import {PatentGradeIntro, PatentGradeNotice} from '@/components/custom/patent-grade-sections'

export const metadata: Metadata = {title: '특허 등급조회'}

// ─────────────────────────────────────────────────────────────────────────────────────────────
// 특허 등급조회(기관) — 조회 화면 (org-patent-evaluation-patent-grade-list · /org/patent-evaluation/patent-grade-list)
// 기업 조회 화면(/corp/patent-evaluation/patent-grade-list)과 같은 구성이며 브레드크럼 홈 주소만 다르다.
//
// 한 화면의 두 상태를 퍼블리싱 확인용으로 두 주소에 나눠 두었다.
//   ① 조회 화면(이 파일)   — 검색 칸이 빈 '최초' 상태. 검색 결과 영역은 아직 없다(검색 칸 아래 바로 주의사항).
//   ② 결과 화면(patent-grade-result/page.tsx) — 검색이 끝난 상태. 번호가 들어 있고 결과 보고서가 보인다.
// 두 주소는 같은 컴포넌트(PatentGradeLookup)를 쓰고, 넘기는 처음 값만 다르다. 어느 쪽에서든 검색 · 초기화는 똑같이 동작한다.
//
// [프론트엔드 연동] 실제 서비스는 이 조회 화면 하나로 충분하다(검색하면 같은 자리에서 결과로 바뀐다).
// 결과 화면은 '검색 후' 모습을 보여 주려는 퍼블리싱용 주소이므로, 결과 화면을 따로 두지 않는다면 그 폴더를 지운다.
// ─────────────────────────────────────────────────────────────────────────────────────────────
//
// KPAS 소개 → 검색(기준 + 번호) → [검색하기]를 누르면 특허평가 결과 보고서 → 주의사항 → [결과 보고서 출력].
// SkipNav의 #main 도착 대상이며 tabIndex={-1}로 키보드 포커스를 받을 수 있다.
// 퍼블리싱 확인용 — 주소에 ?loading=1 을 붙이면 처음부터 결과 자리에 검색 중 안내를 보인다.
const LOADING_PREVIEW_QUERY = 'loading'

type OrgPatentGradeListPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

const OrgPatentGradeListPage = async ({searchParams}: OrgPatentGradeListPageProps) => {
    const isLoadingPreview = (await searchParams)[LOADING_PREVIEW_QUERY] === '1'

    return (
        <main id="main" tabIndex={-1} className="bg-background flex-1">
            <PatentGradeLookup
                isLoadingPreview={isLoadingPreview}
                intro={<PatentGradeIntro homeHref="/org/home" />}
                notice={<PatentGradeNotice />}
            />
        </main>
    )
}

export default OrgPatentGradeListPage
