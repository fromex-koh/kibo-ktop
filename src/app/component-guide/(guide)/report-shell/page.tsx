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
            '도구 막대 + A4 용지. 용지는 1360px 폭으로 그려 화면 폭에 맞춰 줄입니다. 주된 버튼은 [인쇄하기](기본) 또는 [PDF 다운로드](primaryAction="pdf-download" — 쪽들을 PDF 한 파일로 바로 받음)입니다. ?print=1 이면 다 그린 뒤 인쇄 대화상자를 엽니다.',
            '특허평가 결과 보고서([인쇄하기]) · K-BIGx 기업혁신성장 보고서([PDF 다운로드])',
        ],
    },
    {
        key: 'theme',
        cells: [
            <code key="p">ReportThemeScope</code>,
            '평가결과 · 특허 리포트는 라이트 고정, K-BIGx 보고서는 화면 테마를 따릅니다. 인쇄는 늘 라이트입니다.',
            '기업 · 기관 (report) 레이아웃',
        ],
    },
    {
        key: 'emphasis',
        cells: [
            <code key="p">renderReportEmphasis</code>,
            '문장 속 **강조** 를 strong 으로 바꿉니다. 문장은 한 덩어리로 받습니다.',
            'Tech-Index 리포트 요약',
        ],
    },
    {
        key: 'document',
        cells: [
            <code key="p">ReportDocument · ReportSection · LabelValueTable</code>,
            'A4 한 장짜리 평가 리포트 문서의 뼈대 — 문서 머리 · 구획 제목 · 이름값 표. ReportDocument 의 spacing(normal · compact · tight)은 구획 사이 간격, startsNewPage 는 인쇄 때 새 장에서 시작. ReportSection 은 기본으로 쪽 경계에서 갈라지지 않고, 긴 표만 canSplit 으로 나눕니다.',
            'KTRS-FM · Tech-Index · 투자모형 리포트(custom/report-document.tsx)',
        ],
    },
    {
        key: 'page-style',
        cells: [
            <code key="p">ReportPageStyle</code>,
            '인쇄 용지를 A4 세로 · 여백 0 으로 맞춥니다. 리포트 화면의 <main> 안에 한 번 둡니다(화면을 떠나면 걷힘).',
            'KTRS-FM · Tech-Index · 투자모형 리포트',
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
    [
        'ReportPrintShell',
        'notice',
        '도구 막대 아래 안내 문구입니다. 없으면 특허평가 결과 보고서 문구, null 이면 안내 줄을 뺍니다(?print=1 바로 인쇄).',
        '-',
        'string | null',
    ],
    [
        'ReportPrintShell',
        'primaryAction',
        "도구 막대의 주된 버튼입니다. 'print' 는 [인쇄하기](인쇄 대화상자), 'pdf-download' 는 [PDF 다운로드](쪽들을 PDF 파일로 바로 내려받음 · 만드는 동안 'PDF 만드는 중…')입니다.",
        "'print'",
        "'print' | 'pdf-download'",
    ],
    [
        'ReportPrintShell',
        'pdfFileName',
        "pdf-download 로 받을 파일 이름(확장자 제외)입니다. 없으면 title. K-BIGx 는 '보고서 이름_기업명' 입니다.",
        'title',
        'string',
    ],
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
        description="새 창으로 여는 리포트 화면들이 함께 쓰는 부품입니다. 인쇄 틀 · 테마 범위 · 요약 문장 강조 · 평가 리포트 문서 뼈대를 다룹니다. K-BIGx 문서 안의 토큰 · 쪽 부품 · 표시 규칙은 K-BIGx PDF 템플릿 가이드에 있습니다."
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
                            주소에 ?print=1 이 붙으면 다 그려진 뒤 인쇄 대화상자를 엽니다. 특허평가 [결과 보고서 출력]은
                            숨긴 프레임으로 엽니다.
                        </li>
                        <li>
                            K-BIGx 웹 보고서 [보고서 다운로드] → 보고서 내용 선택 [보고서 미리보기]는 고른 장만 담은
                            보고서 화면을 새 탭으로 엽니다(<code>openReportTab</code> — 자동 인쇄 없음). 사용자는 그
                            화면의 [PDF 다운로드]로 받습니다.
                        </li>
                        <li>
                            [PDF 다운로드]는 브라우저에서 쪽마다 그림(JPEG, 용지의 1.5배 해상도)으로 떠 A4 한 쪽씩 묶어
                            PDF 한 파일로 내려받습니다(<code>lib/download-report-pdf.ts</code>). 인쇄 대화상자는 열지
                            않습니다. 라이브러리는 html-to-image · jsPDF(둘 다 MIT, 고지는{' '}
                            <code>THIRD_PARTY_LICENSES.md</code>)이고 누를 때 불러옵니다.
                        </li>
                        <li>
                            PDF 의 글자는 그림이라 선택 · 검색이 되지 않고, 9쪽 기준 약 3MB · 10초 안팎이 걸립니다.
                            글자가 살아 있는 PDF 가 필요하면 서버에서 만들어 내려주는 방식으로 바꿉니다(셸의 [프론트엔드
                            연동] 주석). 서버용 HTML 은{' '}
                            <Link href="/component-guide/kbigx-pdf-template" className={LINK_CLASS}>
                                K-BIGx PDF 템플릿
                            </Link>{' '}
                            가이드를 봅니다.
                        </li>
                        <li>
                            긴 글 넘침 — 자가진단 결과 리포트(KTRS-FM · Tech-Index 일반/창업 · 투자모형) 문서 틀에{' '}
                            <code>wrap-anywhere</code> 를 둬, 띄어쓰기 없는 긴 글(숫자 · 영문 1,000자 등)도 칸 폭 안에서
                            글자 단위로 줄을 바꿉니다. 칸 밖으로 넘치지 않지만 A4 한 장을 넘을 수는 있습니다. 위치만
                            잡힌 짧은 글(분포 그래프 세로 눈금 등)은 <code>whitespace-nowrap</code> 으로 한 줄을
                            지킵니다.
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
            <section aria-labelledby="report-shell-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="report-shell-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        도구 막대의 [인쇄하기](K-BIGx 는 [PDF 다운로드]) · [닫기] 는{' '}
                        <code>button type=&quot;button&quot;</code>
                        이고 글자 이름이 보입니다. 함께 놓인 Printer(Download) · X 아이콘과 안내 문구의 Info 아이콘은{' '}
                        <code>aria-hidden=&quot;true&quot;</code> 로 숨깁니다[5.1.1].
                    </li>
                    <li>
                        [PDF 다운로드]는 만드는 동안 눌리지 않고 아이콘이 도는 스피너(LoaderCircle)로, 글자가 &lsquo;PDF
                        만드는 중…&rsquo; 으로 바뀌며 <code>aria-busy</code> 로 진행 중임을 알립니다. 만들지 못하면 도구
                        막대 아래에 오류 문구를 <code>role=&quot;alert&quot;</code> 로 띄웁니다[7.4.2].
                    </li>
                    <li>
                        도구 막대와 템플릿 안내는 <code>.report-toolbar</code> 로 화면에서만 보이고 인쇄물에는 빠집니다.
                        문서 이름은 <code>p</code> 로 그려 헤딩이 아니므로, 보고서의 제목 계층은 용지 안 내용에서
                        정합니다[6.4.2].
                    </li>
                    <li>
                        <code>renderReportEmphasis</code> 는 <code>**강조**</code> 부분을 <code>strong</code> 으로
                        감쌉니다. 굵기만 바꾸는 것이 아니라 강조 의미가 마크업에 남습니다.
                    </li>
                    <li>
                        <code>ReportThemeScope</code> 는 경로에 따라 <code>light</code> 또는 <code>print-light</code>{' '}
                        클래스만 붙이는 바탕 상자입니다. 인쇄는 테마와 관계없이 라이트로 찍힙니다.
                    </li>
                </ul>
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
