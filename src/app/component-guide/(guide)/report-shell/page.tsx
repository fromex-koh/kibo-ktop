// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {renderReportEmphasis} from '@/components/custom/report-emphasis'
import {Table} from '@/components/custom/table'

export const metadata: Metadata = {title: '리포트 공통 (Report)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

// 리포트 화면(새 창)들이 함께 쓰는 부품 — 미리보기는 실제 리포트 화면에서 본다(인쇄 · 배율 동작이 창 전체를 쓴다).
const PART_COLUMNS = [
    {key: 'part', header: '부품', align: 'start', rowHeader: true},
    {key: 'role', header: '하는 일', align: 'start', wrap: true},
    {key: 'where', header: '쓰는 곳', align: 'start', wrap: true},
] as const

const PART_ROWS = [
    {
        key: 'shell',
        cells: [
            <code key="p">ReportPrintShell · ReportSheet</code>,
            '도구 막대([인쇄하기] [닫기]) + 회색 바탕 위 A4 용지. 용지는 1360px 폭으로 그리고 화면 폭에 맞춰 줄여 보입니다. 주소에 ?print=1 이 붙으면 다 그려진 뒤 인쇄 대화상자를 엽니다.',
            '특허평가 결과 보고서',
        ],
    },
    {
        key: 'theme',
        cells: [
            <code key="p">ReportThemeScope</code>,
            '리포트 새 창의 테마 범위. 평가결과 · 특허 리포트는 라이트로 고정하고, K-BIGx 보고서는 화면 테마(라이트 · 다크)를 따릅니다. 인쇄는 늘 라이트입니다.',
            '기업 · 기관 (report) 레이아웃',
        ],
    },
    {
        key: 'emphasis',
        cells: [
            <code key="p">renderReportEmphasis</code>,
            '요약 문장 안의 **강조** 를 굵은 글자로 바꿉니다. 기업명 · 점수가 섞인 문장을 조각내지 않고 한 덩어리로 받습니다.',
            'Tech-Index 리포트 요약',
        ],
    },
] as const

const SHELL_CODE = `import {ReportPrintShell, ReportSheet} from '@/components/custom/report-print-shell'
// 용지 규격 · 인쇄 설정(@page) — 리포트 화면에서만 부른다(전역에 넣지 않는다).
import '@/styles/report-print.css'

<ReportPrintShell title="특허평가 결과 보고서">
  {pages.map((page, index) => (
    <ReportSheet key={page.id} page={index + 1} total={pages.length}>
      {page.content}
    </ReportSheet>
  ))}
</ReportPrintShell>`

const THEME_CODE = `// app/(user-type)/corp/(report)/layout.tsx — 기관도 같다
import {ReportThemeScope} from '@/components/custom/report-theme-scope'

export default function ReportLayout({children}: {children: ReactNode}) {
  return <ReportThemeScope>{children}</ReportThemeScope>
}

// 화면 테마를 따를 리포트 경로는 report-theme-scope.tsx 의 THEME_FOLLOWING_REPORT_PREFIXES 에 더한다.`

const EMPHASIS_SAMPLE = '프롬엑스테크의 혁신성장역량지수는 **상위 2.2% 이내** 수준입니다.'

const EMPHASIS_CODE = `import {renderReportEmphasis} from '@/components/custom/report-emphasis'

<p>{renderReportEmphasis('프롬엑스테크의 혁신성장역량지수는 **상위 2.2% 이내** 수준입니다.')}</p>`

const PROPS_ITEMS = [
    ['ReportPrintShell', 'title', '도구 막대 왼쪽 문서 이름입니다. 창 제목과 같은 말을 씁니다.', '-', 'string'],
    ['ReportPrintShell', 'children', '용지들(ReportSheet)입니다.', '-', 'ReactNode'],
    ['ReportSheet', 'page · total', '용지 아래 가운데 쪽수(3 / 5)입니다. 둘 다 있어야 보입니다.', '-', 'number'],
    ['ReportSheet', 'children', '용지 한 장의 내용입니다.', '-', 'ReactNode'],
    ['ReportThemeScope', 'children', '리포트 화면 전체입니다.', '-', 'ReactNode'],
    [
        'renderReportEmphasis',
        '(text)',
        '**강조** 표기가 섞인 문장입니다. 굵은 글자가 섞인 조각 배열을 돌려줍니다.',
        '-',
        'string',
    ],
] as const

const ReportShellGuidePage = () => (
    <GuidePageShell
        title="리포트 공통 (Report)"
        description="새 창으로 여는 리포트 화면들이 함께 쓰는 부품입니다. 인쇄 틀 · 테마 범위 · 요약 문장 강조를 다룹니다."
    >
        <BaseCard>
            <section aria-labelledby="report-parts" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="report-parts" className="typo-h4-bold">
                        부품 목록
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        인쇄 틀은 창 전체를 쓰므로 실제 화면에서 확인합니다 —{' '}
                        <Link
                            href="/corp/patent-evaluation/patent-grade-list/patent-grade-result/report"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={LINK_CLASS}
                        >
                            특허평가 결과 보고서
                            <span className="sr-only"> (새 창)</span>
                        </Link>
                        .
                    </p>
                </div>
                <Table caption="리포트 공통 부품" columns={PART_COLUMNS} rows={PART_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="report-shell-usage" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="report-shell-usage" className="typo-h4-bold">
                        인쇄 틀 (ReportPrintShell · ReportSheet)
                    </h2>
                    <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-1 pl-5">
                        <li>도구 막대와 안내 줄은 화면에서만 보이고 인쇄물에는 나오지 않습니다.</li>
                        <li>
                            용지 규격(A4 비율 · 배율)은 styles/report-print.css 가 정하고, 쓰는 쪽은 용지 안 내용만
                            그립니다.
                        </li>
                        <li>
                            화면의 [결과 보고서 출력]은 이 주소를 숨긴 프레임으로 ?print=1 을 붙여 열어, 미리보기 없이
                            인쇄 대화상자만 띄웁니다.
                        </li>
                    </ul>
                </div>
                <CodeBlock code={SHELL_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="report-theme" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="report-theme" className="typo-h4-bold">
                        테마 범위 (ReportThemeScope)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        리포트 새 창의 바깥 상자입니다. 경로로 라이트 고정 · 테마 따름을 정하고, 인쇄할 때는 둘 다
                        라이트로 찍습니다(종이에 어두운 면을 찍지 않습니다).
                    </p>
                </div>
                <CodeBlock code={THEME_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="report-emphasis" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="report-emphasis" className="typo-h4-bold">
                        요약 문장 강조 (renderReportEmphasis)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        연동 값에서 굵게 세울 곳만 별 두 개로 감싸 보내면 됩니다.
                    </p>
                </div>
                <p className="typo-body-xl-regular text-foreground border-subtle-3 rounded-md border p-5">
                    {renderReportEmphasis(EMPHASIS_SAMPLE)}
                </p>
                <CodeBlock code={EMPHASIS_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="report-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="report-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="리포트 공통 부품 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ReportShellGuidePage
