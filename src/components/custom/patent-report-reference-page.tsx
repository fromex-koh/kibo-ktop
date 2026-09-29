import {ListMarker} from '@/components/custom/list-marker'
import {PatentReportHeader} from '@/components/custom/patent-report-document'
import {ProcessFlow} from '@/components/custom/process-flow'
import {
    PATENT_INFLUENCE_GUIDE_TEXT,
    PATENT_INFLUENCE_GUIDE_TITLE,
    PATENT_PROCESS_FLOWS,
    PATENT_PROCESS_TITLE,
    PATENT_REFERENCE_SECTIONS,
    PATENT_REFERENCE_TITLE,
    PATENT_REPORT_COPYRIGHT,
} from '@/content/service/patent-grade'

// 특허평가 결과 보고서(인쇄용)의 마지막 쪽 — 제도 설명(참고자료)이다. 앞쪽들과 달리 보고서 값이 들어가지 않는다.
// 짜임(위에서 아래로): KPAS 소개 → 특허평가프로세스(설명 + 흐름도 두 줄) → 주요 영향요인 → 맨 아래 저작권 한 줄.
//
// 머리글 제목도 앞쪽과 다르다 — '특허평가 참고자료'.
//
// [프론트엔드 연동] 문구와 흐름도 단계는 content/service/patent-grade.ts 에 있다. 단계를 더하거나 빼면 원도 따라간다.

const PatentReportReferencePage = () => (
    <article className="flex h-full flex-col">
        <PatentReportHeader title={PATENT_REFERENCE_TITLE} />

        <div className="flex flex-1 flex-col gap-10 px-20 pt-15 pb-10">
            {PATENT_REFERENCE_SECTIONS.map((section) => (
                <section
                    key={section.id}
                    aria-labelledby={`patent-reference-${section.id}`}
                    className="flex flex-col gap-2"
                >
                    <h2 id={`patent-reference-${section.id}`} className="typo-title-l-bold text-foreground">
                        {section.title}
                    </h2>
                    <ul className="typo-body-xl-regular text-foreground-subtle flex list-none flex-col gap-1">
                        {section.items.map((item) => (
                            <li key={item} className="flex">
                                <ListMarker type="unordered-small" />
                                <span className="min-w-0 break-keep">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}

            {/* 특허평가프로세스 — 설명 한 문단과 흐름도 한 줄이 짝을 이룬다. */}
            <section aria-labelledby="patent-reference-process" className="flex flex-col gap-4">
                <h2 id="patent-reference-process" className="typo-title-l-bold text-foreground">
                    {PATENT_PROCESS_TITLE}
                </h2>
                {PATENT_PROCESS_FLOWS.map((flow) => (
                    <div key={flow.id} className="flex flex-col gap-6">
                        <p className="typo-body-xl-regular text-foreground-subtle break-keep">{flow.description}</p>
                        <ProcessFlow
                            ariaLabel={`${PATENT_PROCESS_TITLE} — ${flow.description}`}
                            steps={[...flow.steps]}
                        />
                    </div>
                ))}
            </section>

            <section aria-labelledby="patent-reference-influence" className="flex flex-col gap-2">
                <h2 id="patent-reference-influence" className="typo-title-l-bold text-foreground">
                    {PATENT_INFLUENCE_GUIDE_TITLE}
                </h2>
                <p className="typo-body-xl-regular text-foreground-subtle break-keep">{PATENT_INFLUENCE_GUIDE_TEXT}</p>
            </section>

            {/* 저작권 — 쪽 맨 아래에 가운데로 둔다. */}
            <p className="typo-body-xl-regular text-foreground-subtle mt-auto text-center">{PATENT_REPORT_COPYRIGHT}</p>
        </div>
    </article>
)

export {PatentReportReferencePage}
