import {InnovationGrowthReportLookup} from '@/components/custom/innovation-growth-report-lookup'
import {
    getInnovationGrowthInitialResult,
    type InnovationGrowthReportPreview,
} from '@/components/custom/innovation-growth-report-screen'
import {KbigxReportIntro} from '@/components/custom/k-bigx-report-sections'
import {innovationReportPath} from '@/content/service/k-bigx-innovation-report'
import {BulkDataSearchForm, type BulkDataSearchFormProps} from './bulk-data-search/bulk-data-search-form'
import {OrgKbigxReportTabs} from './org-kbigx-report-tabs'

// 기관 K-BIGx 보고서 화면 — 기업혁신성장 조회와 대량정보조회를 한 화면의 탭 두 개로 보인다.
// 제목 · 브레드크럼(기업혁신성장) · K-BIGx 소개 → [기업혁신성장] [대량정보조회] 탭 → 고른 탭의 본문.
// 소개 띠의 [자세히보기]는 두 탭 모두에 보인다(K-BIGx 보고서 소개 화면으로 이동).
//
// 켜진 탭은 주소가 정한다(OrgKbigxReportTabs) — 헤더 메뉴 · 퍼블리싱 인덱스의 탭별 주소가 그대로 남는다.
//   /org/k-bigx-report/innovation-growth-report(+ search-result/…)  → [기업혁신성장] 탭
//   /org/k-bigx-report/bulk-data-search(+ complete · failure)        → [대량정보조회] 탭
// 탭을 누르면 주소만 그 탭 주소로 바뀌고 본문이 바뀐다. 다른 탭으로 갔다 오면 그 탭은 처음 상태로 다시 그려진다.
// [프론트엔드 연동] 탭별 주소의 page.tsx 는 모두 이 화면을 그린다. 퍼블리싱 확인용 처음 상태(innovationPreview · bulk)만 다르다.

type OrgKbigxReportScreenProps = {
    /** [퍼블리싱 확인용] 기업혁신성장 탭의 처음 케이스(search-result/…). 기본은 검색 전이다. */
    innovationPreview?: InnovationGrowthReportPreview
    /** [퍼블리싱 확인용] 대량정보조회 탭의 처음 상태(?state= · complete · failure). 기본은 업로드 전이다. */
    bulk?: BulkDataSearchFormProps
}

// 세로 간격 — 소개 · 탭 · 본문 사이 40, 아래 60(기업혁신성장 조회와 같은 틀).
const OrgKbigxReportScreen = ({innovationPreview = 'search', bulk}: OrgKbigxReportScreenProps) => (
    <main id="main" tabIndex={-1} className="bg-background flex-1">
        <div className="grid-layout gap-y-10 pt-10 pb-15 *:col-span-full">
            <KbigxReportIntro title="기업혁신성장" homeHref="/org/home" moreHref="/org/platform/k-bigx-report" />
            <OrgKbigxReportTabs
                innovationPanel={
                    <InnovationGrowthReportLookup
                        initialResult={getInnovationGrowthInitialResult(innovationPreview)}
                        reportHref={innovationReportPath('org')}
                    />
                }
                bulkPanel={
                    <BulkDataSearchForm
                        // 주소로 상태를 바꾸면 처음 상태부터 다시 그린다.
                        key={bulk?.initialStatus ?? 'idle'}
                        {...bulk}
                    />
                }
            />
        </div>
    </main>
)

export {OrgKbigxReportScreen}
export type {OrgKbigxReportScreenProps}
