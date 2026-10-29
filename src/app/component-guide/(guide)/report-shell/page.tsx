// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {ReactNode} from 'react'
import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {renderReportEmphasis} from '@/components/custom/report-emphasis'
import {Table} from '@/components/custom/table'
import tokens from '@tokens'

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

// K-BIGx PDF 템플릿 전용 토큰 — 목록은 tokens.json 의 kbigxPrint 를 그대로 읽는다(추가하면 여기에도 바로 보인다).
const KBX = tokens.kbigxPrint
const KBX_COLOR_ENTRIES = Object.entries(KBX.color)
// 색 값 글자 — 참조('blue.500') 그대로, 섞은 색은 'mint.700 45% + common.white'.
const formatKbxColorValue = (value: string | {mix: string; amount: number; base: string}) =>
    typeof value === 'string' ? value : `${value.mix} ${value.amount}% + ${value.base}`

const KBX_KIND_COLUMNS = [
    {key: 'kind', header: '종류', align: 'start', rowHeader: true},
    {key: 'class', header: '클래스', align: 'start'},
    {key: 'values', header: '값', align: 'start', wrap: true},
] as const

const KBX_KIND_ROWS = [
    {
        key: 'color',
        cells: [
            '색',
            <code key="c">text-kbx-* · bg-kbx-* · border-kbx-*</code>,
            `역할 ${KBX_COLOR_ENTRIES.length}개(아래 목록). 모두 primitive 참조(Tailwind 팔레트에 없는 색은 extra.*). 막대 채움처럼 옅은 등급 색은 두 색을 미리 섞은 불투명 색(grade-*-fill).`,
        ],
    },
    {
        key: 'text',
        cells: ['글자 크기', <code key="c">kbx-text-&lt;px&gt;</code>, `${KBX.fontSize.join(' · ')}px`],
    },
    {
        key: 'leading',
        cells: [
            '행간',
            <code key="c">leading-kbx-&lt;이름&gt;</code>,
            Object.entries(KBX.lineHeight)
                .map(([name, value]) => `${name}(${value})`)
                .join(' · '),
        ],
    },
    {
        key: 'spacing',
        cells: [
            '간격',
            <code key="c">p-kbx-&lt;px&gt; · gap-kbx-&lt;px&gt; · m-kbx-&lt;px&gt;</code>,
            `${KBX.spacing.join(' · ')}px (4의 배수는 기본 p-4 등)`,
        ],
    },
    {
        key: 'radius',
        cells: ['모서리', <code key="c">rounded-kbx-&lt;px&gt;</code>, `${KBX.radius.join(' · ')}px`],
    },
    {
        key: 'weight',
        cells: [
            '굵기',
            <code key="c">font-kbx-&lt;이름&gt;</code>,
            Object.entries(KBX.fontWeight)
                .map(([name, value]) => `${name}(${value})`)
                .join(' · '),
        ],
    },
    {
        key: 'tracking',
        cells: [
            '자간',
            <code key="c">tracking-kbx-&lt;이름&gt;</code>,
            Object.entries(KBX.letterSpacing)
                .map(([name, value]) => `${name}(${value})`)
                .join(' · '),
        ],
    },
    {
        key: 'border',
        cells: [
            '선 두께',
            <code key="c">kbx-border-&lt;이름&gt; · kbx-border-b-&lt;이름&gt;</code>,
            Object.entries(KBX.borderWidth)
                .map(([name, value]) => `${name}(${value}px)`)
                .join(' · '),
        ],
    },
] as const

// K-BIGx PDF 템플릿 쪽 부품 — components/custom/kbigx-print-parts.tsx
const KBX_PART_COLUMNS = [
    {key: 'part', header: '부품', align: 'start', rowHeader: true},
    {key: 'role', header: '하는 일', align: 'start', wrap: true},
] as const

const KBX_PART_ROWS = [
    {
        key: 'page',
        cells: [<code key="p">KbxPage</code>, '쪽 틀. 장 첫 쪽은 장 제목 박스, 나머지 쪽은 머리말 · 바닥글(쪽 번호).'],
    },
    {
        key: 'page-body',
        cells: [
            <code key="p">KbigxPrintPageBody</code>,
            '쪽 본문 상자. 내용이 쪽 높이를 넘으면 화면에만 빨간 점선 + 넘친 높이를 보입니다(인쇄 제외).',
        ],
    },
    {key: 'chapter', cells: [<code key="p">KbxChapterTitle</code>, '장 제목 박스. subtitle 은 장 이름 옆 부제.']},
    {
        key: 'header',
        cells: [
            <code key="p">KbxPageHeader</code>,
            '머리말(장 이름 · 기업명). 기업명이 길면 21 → 19 → 17 로 줄이고 줄을 접습니다(잘리지 않음).',
        ],
    },
    {key: 'footer', cells: [<code key="p">KbxPageFooter</code>, '바닥글(K-BIGx · 보고서 이름 · 쪽 번호).']},
    {
        key: 'block',
        cells: [
            <code key="p">KbxBlock</code>,
            "중제목 + 오른쪽 단위. unitPosition='below' 는 단위를 제목 아래 줄로, tag 는 제목 줄 오른쪽 알약.",
        ],
    },
    {
        key: 'sub',
        cells: [
            <code key="p">KbxSubBlock</code>,
            '소제목 + 오른쪽 단위. headerClassName 으로 제목 줄 폭을 줄여 단위를 표 끝에 맞춥니다.',
        ],
    },
    {key: 'unit', cells: [<code key="p">KbxUnit</code>, '제목 줄 오른쪽 끝 글(기준일자 · 안내 · 범례).']},
    {
        key: 'unit-below',
        cells: [<code key="p">KbxUnitBelow</code>, '소제목 아래 줄 오른쪽 단위(소제목 → 12 → 단위 → 8 → 내용).'],
    },
    {
        key: 'grid',
        cells: [
            <code key="p">KbxLabelValueGrid</code>,
            "이름: 값 두 열(compact 는 진단브리핑용). fitLabels 에 든 이름의 값만 글자를 줄이다 2줄 말줄임, 나머지는 한 줄 말줄임. 빈 값 '-'.",
        ],
    },
    {
        key: 'stat',
        cells: [
            <code key="p">KbxStatCard</code>,
            '수치 카드(size lg · xl). 숫자가 길면 40 → 34 → 28 로 줄여 단위가 떨어지지 않게 합니다.',
        ],
    },
    {key: 'kv', cells: [<code key="p">KbxKeyValueList</code>, '이름 — 값 한 줄 목록.']},
    {key: 'note', cells: [<code key="p">KbxNote</code>, '차트 · 표 아래 각주.']},
    {key: 'chapter-notice', cells: [<code key="p">KbxChapterNotice</code>, '장 첫머리 안내문(위아래 선).']},
    {
        key: 'category-colors',
        cells: [
            <code key="p">kbxCategoryColor · KBX_CATEGORY_COLORS</code>,
            "분류 비중 조각 색 — 큰 분류부터 남색 → 옅은 파랑 7단계, '기타'는 회색.",
        ],
    },
    {
        key: 'legend',
        cells: [<code key="p">KbxLegend</code>, "색 칸 + 이름 범례. density 'compact' · 'unit'(단위 자리용)."],
    },
    {
        key: 'table',
        cells: [
            <code key="p">KbxTable</code>,
            '표. density default · compact · dense · narrow · snug · list · stacked. 열 옵션 isNarrow · headerClassName · hasHeaderDivider · group(두 단 머리), 합계 줄 isTotal, 빈 표 emptyText.',
        ],
    },
    {
        key: 'stair-table',
        cells: [
            <code key="p">KbxStairTable</code>,
            '2단 계단식 표(특허). 항목 하나가 tbody 하나라 쪽 경계에서 갈라지지 않습니다. 줄 글자 색은 rows[].titleClassName.',
        ],
    },
    {
        key: 'chart-empty',
        cells: [
            <code key="p">KbxChartBox · KbxChartEmpty · KBX_CHART_EMPTY_TEXT</code>,
            "차트 빈 상태 — KbxChartBox isEmpty 면 emptyClassName 크기의 옅은 면 + '데이터가 없습니다.', 아니면 차트(children)를 그대로 그립니다. 빈 상태를 내장한 차트(RankBarList · DonutListChart · InsideLabelPieChart)에는 emptyText · emptyClassName 으로 넘깁니다.",
        ],
    },
    {
        key: 'clamp',
        cells: [
            <code key="p">KbxClampArea · KbxClampText</code>,
            '글 묶음이 영역을 넘으면 줄 수가 많은 글부터 한 줄씩 말줄임(글자 크기 그대로).',
        ],
    },
    {
        key: 'fit-value',
        cells: [
            <code key="p">KbxFitText · KbxFitValue</code>,
            'KbxFitText — 정해진 줄 수(maxLines)에 들어가는 가장 큰 글자로 줄입니다(clampWhenFull 이면 최소 크기로도 넘칠 때 말줄임). KbxFitValue — 이름: 값 목록의 값 칸, 2줄에 맞추고 넘치면 말줄임.',
        ],
    },
    {
        key: 'fit-text',
        cells: [
            <code key="p">fitKbxText · KbxFitName</code>,
            '글자 폭을 어림해 한 줄 크기를 고르고(20 → 18 → 16), 그래도 넘치면 줄을 접습니다(잘리지 않음).',
        ],
    },
    {
        key: 'sales-bar-list',
        cells: [
            <code key="p">KbxSalesBarList</code>,
            "인당 매출액 막대 목록. 최근 연도는 남색 · 굵게. 값은 천원 단위 정수(496,750), 값이 없는 해는 막대 없이 '-'.",
        ],
    },
    {key: 'sub-text', cells: [<code key="p">KbxSubText</code>, '칸 안 둘째 줄 괄호 값(19px 옅은 글자).']},
    {
        key: 'tag',
        cells: [
            <code key="p">KbxGradeTag</code>,
            '등급 알약. tone 을 주면 등급 색 바탕(getTechIndexGrade), 기업신용등급은 className 에 KBX_CREDIT_TAG_CLASS(getCriGradeBand 9단계), 현금흐름등급은 KBX_CASH_FLOW_TAG_CLASS.',
        ],
    },
    {
        key: 'measure',
        cells: [
            <code key="p">k-bigx-print-measure.ts</code>,
            '쪽 치수(KBX_PAGE_BODY_HEIGHT · KBX_PAGE_CONTENT_BOTTOM 등) · 글자 줄이기 단계(KBX_FIT_TEXT_SIZES) · 글자 폭 어림 — 서버 행 수 어림과 화면 글자 맞추기가 같은 값을 씁니다.',
        ],
    },
    {
        key: 'format',
        cells: [
            <code key="p">kbigx-print-format.ts</code>,
            "값 표시 공통 — KBX_EMPTY_VALUE('-') · formatKbxNumber(값, 포맷) · isKbxNumber · sumKbxNumbers · orKbxEmpty, 포맷 kbxNumberFormat(1,234) · kbxIntegerFormat(정수 반올림 — 천원 금액 496,750) · kbxFixed1Format(0.0) · kbxFixed2Format(0.00).",
        ],
    },
    {
        key: 'preparing',
        cells: [
            <code key="p">KbigxPrintPreparing</code>,
            "준비 안내 — 주소에 ?print=1 이 붙은 바로 인쇄 흐름에서만 쓰입니다(지금 K-BIGx 서비스 흐름은 [보고서 미리보기] → 문서 화면 → [PDF 다운로드]라 쓰지 않음). 차트가 그려지고 인쇄 대화상자가 뜰 때까지 화면을 덮습니다(LoadingState · 'PDF로 받을 보고서를 준비하고 있습니다.'). 인쇄물에는 나오지 않고, 같은 탭에서 열린 경우 인쇄가 끝나면 걷힙니다. loading.tsx 는 두지 않습니다(스트리밍 빈 표가 남음).",
        ],
    },
    {
        key: 'private',
        cells: [
            <code key="p">KbxPrivateContent</code>,
            "비공개 — 웹 PrivateContent 와 같은 모양(흐린 가짜 값 + 흰 면 80% + 안내). 신용/재무정보의 열람 케이스(?case=)별 가림에 씁니다. 기업신용정보 표는 흐리지 않고(법인열람 · 개인열람) 값 줄을 '비공개' 한 줄로 바꾸고 상태 알약을 뺍니다(상태가 '해당없음' 이면 그대로).",
        ],
    },
    {
        key: 'issue-words',
        cells: [
            <code key="p">getKbxIssueWords</code>,
            '워드클라우드 키워드 정리 — 빈 글자 · 중요도가 0 이하이거나 숫자가 아닌 키워드를 뺍니다.',
        ],
    },
] as const

// K-BIGx PDF 템플릿 파일 구성 — 쪽 종류별로 어느 파일이 그리고, 어떤 차트 컴포넌트를 쓰는지.
const KBX_FILE_COLUMNS = [
    {key: 'file', header: '파일', align: 'start', rowHeader: true},
    {key: 'role', header: '그리는 쪽', align: 'start', wrap: true},
    {key: 'charts', header: '쓰는 차트', align: 'start', wrap: true},
] as const

const chartLink = (label: string, href: string) => (
    <Link key={href} href={href} className={LINK_CLASS}>
        {label}
    </Link>
)
const joinNodes = (nodes: readonly ReactNode[]) =>
    nodes.flatMap((node, index) => (index ? [<span key={`sep-${index}`}> · </span>, node] : [node]))

const KBX_FILE_ROWS = [
    {
        key: 'page',
        cells: [
            <code key="f">kbigx-print-page.tsx</code>,
            'PDF 템플릿 페이지 본문 — 보고서 조회 · 장 고르기 · 자동 인쇄. 기업 · 기관 report-print/page.tsx 가 함께 씁니다.',
            '-',
        ],
    },
    {
        key: 'document',
        cells: [<code key="f">kbigx-print-document.tsx</code>, '쪽 종류 → 그림(PAGE_CONTENT)을 용지에 담습니다.', '-'],
    },
    {
        key: 'cover',
        cells: [<code key="f">kbigx-print-cover.tsx</code>, '표지 · 목차(장 첫 쪽 번호 자동) · 뒷표지', '-'],
    },
    {
        key: 'briefing',
        cells: [
            <code key="f">kbigx-print-briefing.tsx</code>,
            '진단브리핑 3쪽 — 기업 정보 · 기술혁신 / Tech-Index · 신용/재무 / 활동성',
            joinNodes([
                chartLink('CalloutPieChart', '/component-guide/callout-pie-chart'),
                chartLink('WordCloud', '/component-guide/word-cloud'),
                chartLink('ScoreScaleBar', '/component-guide/score-scale-bar'),
                chartLink('ComparisonRadarChart', '/component-guide/comparison-radar-chart'),
                chartLink('ValueColumnChart', '/component-guide/value-column-chart'),
                chartLink('ValueLineChart', '/component-guide/value-line-chart'),
            ]),
        ],
    },
    {
        key: 'company',
        cells: [
            <code key="f">kbigx-print-company.tsx</code>,
            '기업현황 3쪽 — 개요 · 경영진 및 주주 · 관계기업 · 특허 및 인증 / 재무현황 / 거래처',
            joinNodes([
                chartLink('NestedColumnChart', '/component-guide/nested-column-chart'),
                chartLink('MarkerLineChart', '/component-guide/marker-line-chart'),
            ]),
        ],
    },
    {
        key: 'innovation',
        cells: [
            <code key="f">kbigx-print-innovation.tsx</code>,
            '기술혁신정보 8쪽 — 보유기술 / 특허 보유현황 / 특허기술 분석 / 경쟁기업 / 우수특허 / 이머징 기술 · R&D 이슈 / R&D 전문기관 / 정부 R&D 과제',
            joinNodes([
                chartLink('DonutListChart', '/component-guide/donut-list-chart'),
                chartLink('DualBarTable', '/component-guide/dual-bar-table'),
                chartLink('ComboValueChart', '/component-guide/combo-value-chart'),
                chartLink('RankBarList', '/component-guide/rank-bar-list'),
                chartLink('WordCloud', '/component-guide/word-cloud'),
            ]),
        ],
    },
    {
        key: 'tech-index',
        cells: [
            <code key="f">kbigx-print-tech-index.tsx</code>,
            'Tech-Index 2쪽 — 지수 · 표준정보 분포 · 부문별 지표 비교 / 유형별 비교 · 4대 혁신역량',
            joinNodes([
                chartLink('DistributionValueChart', '/component-guide/distribution-value-chart'),
                chartLink('ValueColumnChart', '/component-guide/value-column-chart'),
                chartLink('RankBarList', '/component-guide/rank-bar-list'),
                chartLink('ComparisonRadarChart', '/component-guide/comparison-radar-chart'),
            ]),
        ],
    },
    {
        key: 'credit',
        cells: [
            <code key="f">kbigx-print-credit.tsx</code>,
            '신용/재무정보 6쪽 — 신용 · 현금흐름등급 / 기업신용정보 / 재무비율진단 2쪽 / 차입금 분석 / 차입금 현황',
            joinNodes([
                chartLink('RatingTrendChart', '/component-guide/rating-trend-chart'),
                chartLink('MarkerLineChart', '/component-guide/marker-line-chart'),
                chartLink('ValueLineChart', '/component-guide/value-line-chart'),
                chartLink('DualLineChart', '/component-guide/dual-line-chart'),
                chartLink('InsideLabelPieChart', '/component-guide/inside-label-pie-chart'),
                chartLink('DonutListChart', '/component-guide/donut-list-chart'),
            ]),
        ],
    },
    {
        key: 'activity',
        cells: [
            <code key="f">kbigx-print-activity.tsx</code>,
            '활동성정보 2쪽 — 인적자원 / 에너지 사용',
            joinNodes([
                chartLink('ValueLineChart', '/component-guide/value-line-chart'),
                chartLink('MarkerLineChart', '/component-guide/marker-line-chart'),
            ]),
        ],
    },
    {
        key: 'reference',
        cells: [
            <code key="f">kbigx-print-reference.tsx</code>,
            '참고자료 — 신용 · 현금흐름등급 정의(cri-grades.ts · cash-flow-grades.ts). 웹 보고서 참고자료 탭(innovation-growth-report-reference.tsx)도 같은 표를 씁니다.',
            '-',
        ],
    },
    {
        key: 'placeholder',
        cells: [
            <code key="f">kbigx-print-page-placeholder.tsx</code>,
            '새 쪽 종류의 임시 자리 표시(지금은 안 씀)',
            '-',
        ],
    },
    {
        key: 'parts',
        cells: [
            <code key="f">kbigx-print-parts.tsx · kbigx-print-fit-value.tsx · kbigx-print-format.ts</code>,
            '공용 부품(아래 표)',
            '-',
        ],
    },
] as const

// K-BIGx PDF 템플릿 단독 HTML — 백엔드가 데이터를 넣어 PDF 를 대량 생성하는 전달물(templates/kbigx-report-template.html).
const STANDALONE_COLUMNS = [
    {key: 'item', header: '항목', align: 'start', rowHeader: true},
    {key: 'detail', header: '내용', align: 'start', wrap: true},
] as const

const STANDALONE_ROWS = [
    {
        key: 'file',
        cells: [
            '파일',
            'templates/kbigx-report-template.html 한 장에 화면 코드 · 스타일 · 글꼴(Pretendard) · 이미지 · 목업 데이터가 모두 들어 있습니다. 인터넷 없이 열리고, OS 다크 설정과 관계없이 늘 라이트로 그립니다.',
        ],
    },
    {
        key: 'use',
        cells: [
            '쓰는 법',
            '백엔드가 파일 안 데이터(JSON) 칸을 실데이터로 바꿔 헤드리스 브라우저로 열고, data-ready 가 붙으면 PDF 로 저장합니다. 데이터 넣는 법 · 값 · 순서 · 개수 규칙은 파일 맨 위 주석에 있습니다.',
        ],
    },
    {
        key: 'rebuild',
        cells: [
            '다시 만들기',
            "원본 퍼블리싱 저장소에서 만들어 전달하는 결과물입니다. 'bigx print template' 배지가 붙은 컴포넌트 · kbigx-print-* 파일 · K-BIGx 목업을 바꿔도 이 HTML 은 저절로 바뀌지 않으므로, 인쇄 템플릿을 바꿀 때는 원본 저장소에 새 HTML 을 요청합니다.",
        ],
    },
    {
        key: 'source',
        cells: [
            '고치는 곳',
            '결과 파일은 손으로 고치지 않습니다. 파일 맨 위 안내 주석과 화면 코드는 원본 저장소의 생성기에서 고칩니다.',
        ],
    },
    {
        key: 'version',
        cells: [
            '버전 · 전달',
            '퍼블리싱 인덱스 마이페이지 › K-BIGx 보고서 이력 › [보고서 템플릿 다운로드](기업 · 기관)로 받습니다(/downloads/kbigx-report-template.html — 빌드 때 정적 파일로 만듦). git 으로 버전을 관리하고 퍼블리싱 인덱스 자산 버전에 표시됩니다. frontend-handoff 전달본의 templates/ 에도 함께 들어갑니다. 입력과 Chrome 버전이 같으면 결과가 똑같아 git diff 로 바뀐 여부를 바로 볼 수 있습니다.',
        ],
    },
] as const

const STANDALONE_CODE = `# 이 HTML 은 원본 퍼블리싱 저장소에서 만들어 전달합니다 — 전달본에서는 다시 만들지 않습니다.
# 받는 곳: 퍼블리싱 인덱스 › 마이페이지 › K-BIGx 보고서 이력 › [보고서 템플릿 다운로드]
# 파일 위치: templates/kbigx-report-template.html (손으로 고치지 않음)`

// PDF 템플릿 데이터 표시 공통 규칙 — 모든 쪽에 같이 적용된다.
const KBX_RULE_COLUMNS = [
    {key: 'rule', header: '규칙', align: 'start', rowHeader: true},
    {key: 'detail', header: '내용', align: 'start', wrap: true},
] as const

const KBX_RULE_ROWS = [
    {
        key: 'one-page',
        cells: [
            '한 쪽 맞춤',
            '모든 쪽은 한 장에 들어가고 바닥글 선과 40 이상 띄웁니다. 긴 글은 아래 말줄임 규칙으로 줄여 높이를 지킵니다.',
        ],
    },
    {
        key: 'empty',
        cells: [
            "빈 값 '-' · 0",
            "값이 없거나 숫자가 아니면 '-', 0 은 현행 포맷대로(0 · 0.0 · 0.00 · 0%). 합계 · 기타는 숫자인 값만 더하고 하나도 없으면 '-'.",
        ],
    },
    {
        key: 'chart',
        cells: [
            '차트 빈 값',
            '값이 없는 막대 · 점은 그리지 않고 선은 끊습니다. 값이 하나도 없으면 같은 크기 빈 상태(KbxChartEmpty).',
        ],
    },
    {
        key: 'fixed',
        cells: [
            '고정 라벨 · 개수',
            "구분 · 연도(3개년) · 지표 · 업권 · 분기 · 기업 수 등은 데이터와 관계없이 고정, 받지 못한 항목은 '-'.",
        ],
    },
    {
        key: 'rows',
        cells: ['목록 행 수', "특허 · 거래처 · R&D 과제 · 전문기관 표는 10행 자리. 모자라면 '-' 줄로 채웁니다."],
    },
    {
        key: 'alpha',
        cells: [
            '옅은 색',
            '투명도(/45 등) 대신 tokens.json kbigxPrint 의 섞은 색(grade-*-fill 처럼 mix · amount · base)을 씁니다. 투명한 색은 Safari PDF 에서 Chrome 과 다르게 칠해집니다. 뒤가 비쳐야 하는 비공개 가림막만 투명도를 씁니다.',
        ],
    },
] as const

// 긴 글자 처리 — 어떤 값이 어떻게 줄어드는지.
const KBX_TEXT_COLUMNS = [
    {key: 'how', header: '처리', align: 'start', rowHeader: true},
    {key: 'target', header: '대상', align: 'start', wrap: true},
] as const

const KBX_TEXT_ROWS = [
    {
        key: 'truncate',
        cells: [
            '한 줄 말줄임',
            '거래처 · 경쟁기업 · 경영진 및 주주 · 관계기업 칸, 특허명 · 출원인 · 권리자, 보유기술 분류 이름, 이머징 기술분야, 부처명 · 전문기관, 개요의 나머지 값, Tech-Index 요약의 기업명. 권리자 · 전문기관은 닫는 괄호를 남깁니다.',
        ],
    },
    {
        key: 'clamp-2',
        cells: [
            '두 줄 말줄임',
            '특허 기술분야, 맞춤형 기술분야 설명, 전문기관명, 공고명, 진단브리핑 보유기술 원형 라벨',
        ],
    },
    {
        key: 'fit-clamp',
        cells: [
            '글자 줄임 → 2줄 말줄임',
            '표지 기업명 · 대표자(35 → 30 → 26), 개요 · 기업 정보의 기업명 · 대표자 · 주소 · 대표기술분야 · 주요제품',
        ],
    },
    {key: 'fit', cells: ['글자 줄임(다 보임)', '머리말 기업명, R&D 과제 담당자(줄마다), 수치 카드 숫자']},
    {
        key: 'area',
        cells: ['남는 높이 나눠 말줄임', '특허기술 분석의 특허 개요 · 판단 근거(아래 맞춤형 기술정보는 줄지 않음)'],
    },
    {
        key: 'row-count',
        cells: [
            '행 수 조절',
            '기업현황 1 경영진 · 주주 · 관계기업(기본 5 · 5 · 3행, 1 ~ 10행), 정부 R&D 접수기간 도래 과제(남은 높이만큼)',
        ],
    },
] as const

const KBX_CODE = `// 보고서 문서를 .kbigx-print 상자로 감싼다 — 이 안에서만 kbx 값이 있다.
<div className="kbigx-print">
  <ReportPrintShell
    title="K-BIGx 기업혁신성장 보고서"
    primaryAction="pdf-download"
    pdfFileName="K-BIGx 기업혁신성장 보고서_프롬엑스테크"
  >
    <ReportSheet page={3} total={31}>
      <h2 className="kbx-text-36 text-kbx-primary font-kbx-extrabold">진단브리핑</h2>
      <p className="kbx-text-21 leading-kbx-160 text-kbx-foreground-subtle">본문</p>
      <table className="border-kbx-border">…</table>
    </ReportSheet>
  </ReportPrintShell>
</div>`

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
                            연동] 주석). 서버용으로는 아래 &lsquo;K-BIGx PDF 템플릿 단독 HTML&rsquo; 을 씁니다.
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
            <section aria-labelledby="report-kbx-tokens" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="report-kbx-tokens" className="typo-h4-bold">
                        K-BIGx PDF 템플릿 전용 토큰 (kbx)
                    </h2>
                    <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-1 pl-5">
                        <li>K-BIGx PDF 템플릿 전용 값입니다. 웹 화면 토큰과 따로 둡니다.</li>
                        <li>
                            <code>.kbigx-print</code> 상자 안에서만 동작합니다.
                        </li>
                        <li>
                            값 변경 · 추가: <code>tokens.json</code> 의 <code>kbigxPrint</code> →{' '}
                            <code>yarn tokens</code>
                        </li>
                        <li>
                            <code>cn()</code> 은 kbx 클래스와 기본 클래스(<code>p-4</code> 등)의 겹침을 정리하지 않으니
                            한 요소에 같은 속성을 두 번 주지 않습니다.
                        </li>
                    </ul>
                </div>
                <Table
                    caption="K-BIGx PDF 템플릿 전용 토큰 종류"
                    columns={KBX_KIND_COLUMNS}
                    rows={KBX_KIND_ROWS}
                    size="md"
                />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>chart-*</code> — PDF 템플릿 그래프 명도 3단계: subject(신청 · 조회기업, 진남) ·
                        general(일반 · 유형, 파랑) · average-base/line(평균, 옅은 바탕 + 사선) · series-1/2(주체 없는
                        2계열) · track · trend(꺾은선, halo 흰 테두리).
                    </li>
                    <li>
                        <code>credit-tag-*</code> — 기업신용등급 알약(<code>KBX_CREDIT_TAG_CLASS</code>, 등급 단계마다
                        한 색).
                    </li>
                </ul>
                <ul
                    aria-label="K-BIGx PDF 템플릿 색 목록"
                    className="kbigx-print grid gap-3 md:grid-cols-2 xl:grid-cols-3"
                >
                    {KBX_COLOR_ENTRIES.map(([name, value]) => (
                        <li key={name} className="flex items-center gap-3">
                            {/* 토큰을 목록으로 그리는 가이드라 인라인 CSS 변수를 쓴다(PB-12). */}
                            <span
                                aria-hidden="true"
                                className="border-subtle-3 size-8 shrink-0 rounded-sm border"
                                style={{background: `var(--kbx-color-${name})`}}
                            />
                            <span className="flex flex-col">
                                <code className="typo-body-m-medium text-foreground">kbx-{name}</code>
                                <span className="typo-caption-regular text-foreground-subtle">
                                    {formatKbxColorValue(value)}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
                <CodeBlock code={KBX_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="report-kbx-parts" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="report-kbx-parts" className="typo-h4-bold">
                        K-BIGx PDF 템플릿 쪽 부품
                    </h2>
                    <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-1 pl-5">
                        <li>
                            쪽 목록은 <code>buildKbigxPrintPages</code> 가 만들고, 쪽 번호 · 목차 번호는 그 목록에서
                            계산합니다.
                        </li>
                        <li>
                            새 쪽은 <code>kbigx-print-document.tsx</code> 의 <code>PAGE_CONTENT</code> 에 쪽 종류로
                            더합니다. 확인 화면:{' '}
                            <Link
                                href="/corp/k-bigx-report/innovation-growth-report/report-print"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={LINK_CLASS}
                            >
                                K-BIGx 보고서 PDF 템플릿
                                <span className="sr-only"> (새 창)</span>
                            </Link>
                        </li>
                        <li>
                            PDF 템플릿이 가이드가 있는 컴포넌트를 새로 쓰기 시작하면 메뉴 목록(
                            <code>constants/publishing-guide.ts</code>)의 그 항목에 <code>isKbigxPrint: true</code> 를
                            더합니다. 가이드 제목 옆 bigx print template 배지와 가이드 홈 목록에 함께 나옵니다.
                        </li>
                    </ul>
                </div>
                <Table
                    caption="K-BIGx PDF 템플릿 파일 구성"
                    columns={KBX_FILE_COLUMNS}
                    rows={KBX_FILE_ROWS}
                    size="md"
                />
                <Table caption="K-BIGx PDF 템플릿 쪽 부품" columns={KBX_PART_COLUMNS} rows={KBX_PART_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="report-kbx-rules" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="report-kbx-rules" className="typo-h4-bold">
                        K-BIGx PDF 템플릿 표시 규칙
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        데이터 길이 · 빈 값과 관계없이 쪽 배치가 깨지지 않도록 모든 쪽에 같이 적용합니다. 비공개 열람
                        화면은 확인 화면 주소에 <code>?case=partner-corp</code> · <code>?case=partner-person</code> 을
                        붙여 봅니다.
                    </p>
                </div>
                <Table
                    caption="K-BIGx PDF 템플릿 공통 규칙"
                    columns={KBX_RULE_COLUMNS}
                    rows={KBX_RULE_ROWS}
                    size="md"
                />
                <Table
                    caption="K-BIGx PDF 템플릿 긴 글자 처리"
                    columns={KBX_TEXT_COLUMNS}
                    rows={KBX_TEXT_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="report-kbx-standalone" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="report-kbx-standalone" className="typo-h4-bold">
                        K-BIGx PDF 템플릿 단독 HTML (백엔드 전달)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        서버에서 보고서 PDF 를 대량으로 만들 때 쓰는 HTML 한 장입니다. 이 화면의 PDF 템플릿과 같은
                        코드로 만들어 결과가 똑같습니다.
                    </p>
                </div>
                <Table
                    caption="K-BIGx PDF 템플릿 단독 HTML"
                    columns={STANDALONE_COLUMNS}
                    rows={STANDALONE_ROWS}
                    size="md"
                />
                <CodeBlock code={STANDALONE_CODE} language="bash" copyLabel="복사" />
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
