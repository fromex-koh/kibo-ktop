// K-BIGx 기업혁신성장 보고서 인쇄본 — 쪽 차례 · 쪽마다 그릴 행 수 · 고정 문구.
// 확인용 화면: /corp · /org 의 k-bigx-report/innovation-growth-report/report-print
//
// 쪽 차례는 보고서 데이터로 만든다(buildKbigxPrintPages).
//   · 목록 표는 웹 화면과 같이 앞에서부터 최대 10건(KBIGX_PRINT_LIST_LIMIT)만 그린다. 나머지는 웹 화면에서 본다.
//   · 목록 표는 쪽을 넘기지 않는다 — 한 쪽에 행 자리를 두고 모자라면 '-' 줄로 채우며, 값이 길어 넘치면 들어가는 행까지만 그린다.
//     (특허 보유현황 · 우수특허 · 거래처현황 · 정부 R&D 과제 · 기업현황 첫 쪽 표). 쪽을 나누는 것은 기업신용정보뿐이다(heightPages).
//   · 쪽 번호 · 목차의 장 시작 번호 · 장 첫 쪽 여부(장 제목 박스 / 머리말)는 다 만든 목록에서 계산한다.
//
// [프론트엔드 연동]
//   · 담을 장 = 보고서 내용 선택 모달에서 고른 항목(PrintOutputSectionId). 확인용 화면은 ?sections= 로 받는다.
//   · 인쇄 주소 = getKbigxPrintHref(KBIGX_PRINT_CORP_PATH | KBIGX_PRINT_ORG_PATH, {reportId, sections}) — 보고서 내용 선택 모달의 [보고서 미리보기]가 새 탭으로 연다(문서 화면만, 자동 인쇄 없음).
//   · 표지 · 목차 · 참고자료(등급 정의) · 뒷표지는 고른 장과 관계없이 늘 들어간다 — 참고자료는 모달에서 고르는 항목이 아니다.
//   · 행 수는 서버에서 글자 수로 어림한다(아래 *_PAGE · *_AREA 상수). 이 값은 컴포넌트의 열 폭 · 글자 크기 · 여백과 맞물려 있어
//     쪽 모양을 바꾸면 같이 고친다. 어긋나면 확인 화면에 넘침 표시가 뜬다(kbigx-print-page-body.tsx).

import {
    PRINT_OUTPUT_SELECTION_SECTIONS,
    type PrintOutputSectionId,
} from '@/content/service/k-bigx-print-output-selection'
import {
    INNOVATION_REPORT_CASE_QUERY,
    INNOVATION_REPORT_EMPTY_QUERY,
    INNOVATION_REPORT_ID_QUERY,
    toExcellentPatentRows,
    type InnovationGrowthReport,
} from '@/content/service/k-bigx-innovation-report'
import {
    estimateLines,
    KBX_FIT_TEXT_SIZES,
    KBX_FOOTER_GAP,
    KBX_PAGE_BODY_HEIGHT,
    KBX_PAGE_CONTENT_BOTTOM,
} from '@/content/service/k-bigx-print-measure'

// 보고서 이름 — 바닥글은 두 조각을 나눠 찍고, 창 제목 · 표지는 이어 붙인 이름을 쓴다.
const KBIGX_PRINT_BRAND = 'K-BIGx'
const KBIGX_PRINT_REPORT_NAME = '기업혁신성장 보고서'
const KBIGX_PRINT_REPORT_TITLE = `${KBIGX_PRINT_BRAND} ${KBIGX_PRINT_REPORT_NAME}`

// 쪽 번호 표기 — 1 · 2 · 10 처럼 앞자리 0 없이(바닥글 · 목차 공통).
const formatKbigxPageNumber = (pageNumber: number) => String(pageNumber)

// 표지 · 뒷표지 · 목차 문구.
const KBIGX_PRINT_EYEBROW = 'AI-POWERED INSIGHT'
const KBIGX_PRINT_TAGLINE = 'AI 인사이트로 연결한 기업의 기술혁신 가이드'
const KBIGX_PRINT_TAGLINE_EN = 'Korea-Business Innovation Growth with AI'
const KBIGX_PRINT_NOTICE_TITLE = '유의사항'
const KBIGX_PRINT_NOTICE =
    '본 보고서는 어떠한 경우에도 기술보증기금의 서면동의 없이 무단전재, 복사, 배포될 수 없습니다. 또한 본 보고서에 수록된 내용은 기술보증기금이 수집한 정보와 AI 분석을 통해 작성된 것으로 그 정확성이나 완전성을 보장할 수 없으므로 분석기업의 기술혁신을 위한 참고용으로만 제공되는 것입니다. 따라서 어떠한 경우에도 본 보고서는 고객의 의사 결정에 대한 법적 책임소재의 증빙자료로 사용될 수 없습니다.'

// 날짜 표기 — 2026-09-30 → 2026.09.30(표지 발급일).
const formatKbigxPrintDate = (date: string) => date.replaceAll('-', '.')

// 도구 막대 아래 안내 — 화면에서만 보이고 인쇄물에는 나오지 않는다. 도구 막대의 [PDF 다운로드]와 짝이다.
const KBIGX_PRINT_PDF_NOTICE = '보고서를 인쇄하려면 PDF 파일을 다운로드한 후, 파일에서 인쇄해 주세요.'

// 고른 장을 받는 주소 쿼리 — ?sections=briefing,company
const KBIGX_PRINT_SECTIONS_QUERY = 'sections'

// 쪽이 속하는 장 — 보고서 내용 선택 항목 + 늘 들어가는 참고자료.
type KbigxPrintSectionId = PrintOutputSectionId | 'reference'

const REFERENCE_SECTION_LABEL = '참고자료'

// 목록 표 최대 건수 — 웹 화면과 같다(특허 · 거래처 · R&D 과제 등).
const KBIGX_PRINT_LIST_LIMIT = 10

// 특허 보유현황 · 우수특허 — 행 높이 어림(용지 px, 폭 1360 기준).
// 서버에서 행 수를 정해야 해 실제 높이를 잴 수 없다. 글자 수로 행마다 줄 수를 어림해 쌓고, 한 쪽 높이(rowsHeight)에
// 들어가는 행까지만 그린다(getKbigxPatentRows · getKbigxExcellentPatentRows).
//
// [주의] 아래 값은 지금 표 모양을 잰 숫자다. 다음을 바꾸면 같이 고친다.
//   · 열 폭(kbigx-print-innovation.tsx 의 PATENT_COLUMNS · EXCELLENT_PATENT_COLUMNS) → holderWidth · fieldWidth
//   · 칸 여백 · 글자 크기 · 행간 · 선 두께(kbigx-print-parts.tsx 의 KbxStairTable) → titleRow · detailRow · fontSize
//   · 쪽 머리말 · 바닥글 · 소제목 높이(KbxPage · KbxSubBlock) · 표 아래 각주 → rowsHeight
// 고친 뒤에는 특허명 · 출원인이 아주 긴 10건으로 확인 화면을 열어 넘침 표시가 없는지 본다.
const PATENT_PAGE = {
    /** 쪽 본문 높이 − 소제목(31 + 간격 16) − 표 머리 두 줄(101.5) − 바닥글 선과 띄우는 40. */
    rowsHeight: KBX_PAGE_BODY_HEIGHT - 47 - 101.5 - KBX_FOOTER_GAP,
    /** 1행 — 위아래 여백 22 + 줄 29(20px × 1.45). 폭은 본문 1168 − 좌우 여백 20. */
    titleRow: {padding: 22, lineHeight: 29, width: 1148},
    /** 2행 — 위아래 여백 14 + 선 1.5. 둘째 줄(괄호 값)은 19px × 1.45. */
    detailRow: {padding: 15.5, lineHeight: 29, subLineHeight: 27.55},
    /** 2행 칸 안쪽 폭(좌우 여백 20 을 뺀 값) — 출원인 · 기술분야. 출원번호 · 출원일은 값 한 줄 + 괄호 한 줄로 센다. */
    holderWidth: 322,
    fieldWidth: 240,
    fontSize: 20,
    subFontSize: 19,
} as const
// 우수특허 — 같은 계단식 표(행 치수는 PATENT_PAGE), 기술분야 열 대신 피인용 횟수 · 지수(늘 한 줄).
// 특허 보유현황보다 중제목(61 + 간격 24) · 표 아래 각주(간격 16 + 30)만큼 더 뺀다. 바닥글 선과 40 띄운다.
const EXCELLENT_PATENT_PAGE = {
    rowsHeight: KBX_PAGE_BODY_HEIGHT - 85 - 47 - 101.5 - 46 - KBX_FOOTER_GAP,
    /** 출원인 칸 안쪽 폭(나머지 열 334.6 − 좌우 여백 20). */
    holderWidth: 314,
    /** '기타' 줄 — 1행 한 줄 + 2행 한 줄('-'). */
    otherRowHeight: 22 + 29 + 15.5 + 29,
} as const

// 신용/재무정보 기업신용정보 — 표마다 값은 한 줄(없으면 '해당사항 없음' 한 줄)이다. 지금 데이터(표 6개)는 늘 한 쪽이고,
// 표가 늘어 budget 을 넘으면 heightPages 가 '(계속)' 쪽으로 나눈다.
// [주의] kbigx-print-credit.tsx 의 CreditInfoBlock · 표 간격(gap-10)을 바꾸면 이 값도 같이 고친다.
// 표 사이 간격 — 표마다 blockHeight 에 넣어 세므로, 마지막 표 아래에는 실제로 없는 이 몫을 budget 에 되돌려 준다.
const CREDIT_INFO_TABLE_GAP = 40
const CREDIT_INFO_PAGE = {
    /** 쪽 본문 − 중제목(61 + 24) − 바닥글 선과 띄우는 간격 + 마지막 표 아래 간격. */
    budget: KBX_PAGE_BODY_HEIGHT - 85 - KBX_FOOTER_GAP + CREDIT_INFO_TABLE_GAP,
    /** 표 하나 — 제목 줄 28 · 사이 10 · 위 선 3 · 머리 50.5 · 값 한 줄 49.5 · 다음 표까지. 표마다 값은 한 줄이다. */
    blockHeight: 28 + 10 + 3 + 50.5 + 49.5 + CREDIT_INFO_TABLE_GAP,
} as const
const creditInfoHeights = (report: InnovationGrowthReport) =>
    report.creditDetail.creditInfo.map(() => CREDIT_INFO_PAGE.blockHeight)

type PatentRowText = {title: string; applicant: string; rightHolder: string; field?: string}

// 기업현황 개요 이름 — 12개 고정 문구. 데이터(overview)는 이 이름(label)으로 찾고, 없거나 값이 비면 줄은 두고 값은 '-'.
const COMPANY_OVERVIEW_LABELS = [
    '기업명',
    '대표자',
    '법인등록번호',
    '사업자등록번호',
    '설립일',
    '종업원수',
    '기업유형/형태',
    '기업규모',
    '주소',
    '표준산업분류',
    '대표기술분야',
    '주요제품',
] as const
// 길이가 크게 달라지는 개요 값 — 2줄을 넘으면 글자를 줄이고, 줄인 글자로도 넘치면 2줄에서 말줄임한다.
// 나머지 값은 기본 크기 한 줄 말줄임이다(KbxLabelValueGrid 의 fitLabels). 높이 어림(overviewExtraHeight)도 이 목록만 센다.
const COMPANY_OVERVIEW_FIT_LABELS: ReadonlySet<string> = new Set([
    '기업명',
    '대표자',
    '주소',
    '대표기술분야',
    '주요제품',
])
// 기업현황 첫 쪽 표 기준 행 수 — 경영진 · 주주 5행 · 관계기업 3행(모자라면 '-' 줄). 개요 값 길이에 따라 1 ~ 10행 사이에서
// 늘리거나 줄인다(getKbigxCompanyFirstPageLayout). 다 못 그린 행은 웹 화면에서 본다.
const COMPANY_TABLE_ROWS = 5
const COMPANY_AFFILIATE_ROWS = 3
const COMPANY_MIN_ROWS = 1

// 기업현황 첫 쪽(개요 · 경영진 및 주주 · 관계기업 · 특허 및 인증 — 블록 사이 40) 높이 어림(용지 px).
//   · baseBottom: 개요 값이 모두 한 줄 · 경영진 · 주주 5행 · 관계기업 3행일 때 본문 끝(실측).
//   · 개요 값이 길어지면 그 줄 쌍(두 열 중 높은 쪽)만큼 높아진다(overviewExtraHeight).
//   · 표 한 행 43.5 — 표 칸 글은 한 줄 말줄임이라 행 높이가 늘 같다.
//   · overviewWidth 391 = 실제 칸 360 ÷ 0.92 — estimateLines 의 한글 1em 이 실제 Pretendard(약 0.92em)보다 넓어서.
// [주의] kbigx-print-company.tsx 의 블록 간격 · 표 행 높이 · KbxLabelValueGrid 치수를 바꾸면 같이 고친다.
const COMPANY_FIRST_PAGE = {
    baseBottom: 1732,
    // 내용이 끝나야 하는 선(바닥글 선 − 40).
    budgetBottom: KBX_PAGE_CONTENT_BOTTOM,
    overviewLine: 29,
    overviewWidth: 391,
    overviewFontSize: 24,
    overviewMaxLines: 2,
    tableRow: 43.5,
} as const

// Pretendard 기본 줄 높이 ≈ 글자 × 1.2. 줄인 글자는 이름(24px)과 기준선을 맞추느라 (24 − 글자) × 1.1 만큼 내려간다
// (실측: 24px 두 줄이면 칸 +29, 12px 두 줄이면 +13).
const NORMAL_LINE_RATIO = 1.2
const BASELINE_SHIFT_RATIO = 1.1
// 개요 값 하나가 한 줄일 때보다 칸을 얼마나 높이는지 — KbxFitValue 와 같이 2줄 높이에 들어갈 때까지 글자를 줄이고,
// 가장 작은 크기로도 넘치면 2줄에서 말줄임한다고 보고 센다.
const overviewExtraHeight = (text: string) => {
    const {overviewFontSize: base, overviewWidth: width, overviewMaxLines: maxLines} = COMPANY_FIRST_PAGE
    const baseLine = base * NORMAL_LINE_RATIO
    const size =
        KBX_FIT_TEXT_SIZES.find(
            (fontSize) => estimateLines(text, fontSize, width) * fontSize * NORMAL_LINE_RATIO <= baseLine * maxLines,
        ) ?? KBX_FIT_TEXT_SIZES[KBX_FIT_TEXT_SIZES.length - 1]
    const lines = Math.min(maxLines, estimateLines(text, size, width))
    return Math.max(0, (base - size) * BASELINE_SHIFT_RATIO + lines * size * NORMAL_LINE_RATIO - baseLine)
}

type KbigxCompanyFirstPageLayout = {
    /** 경영진 · 주주 표 행 수(1 ~ 10). */
    tableRows: number
    /** 관계기업 표 행 수(1 ~ 10). */
    affiliateRows: number
}

// 기업현황 첫 쪽 표 행 수 — 네 블록은 늘 한 쪽이다(특허 및 인증현황은 맨 아래, 바닥글 선과 40 띄움).
// 기준(5 · 3행)에서 넘치면 경영진 · 주주 → 관계기업 순으로 번갈아 한 행씩 줄이고(최소 1행),
// 남으면 같은 순서로 한 행씩 늘려(최대 10행) 남은 높이를 채운다. 데이터가 모자란 행은 '-' 줄.
const getKbigxCompanyFirstPageLayout = (report: InnovationGrowthReport): KbigxCompanyFirstPageLayout => {
    const {overview} = report.companyStatus
    // 한 줄 말줄임 값은 칸을 늘리지 않는다.
    const overviewHeights = COMPANY_OVERVIEW_LABELS.map((label) =>
        COMPANY_OVERVIEW_FIT_LABELS.has(label)
            ? overviewExtraHeight(overview.find((item) => item.label === label)?.value || '-')
            : 0,
    )
    // 두 열이라 한 줄 쌍의 높이는 둘 중 높은 쪽을 따른다.
    const overviewExtra = overviewHeights
        .filter((_, index) => index % 2 === 0)
        .reduce((sum, height, pairIndex) => sum + Math.max(height, overviewHeights[pairIndex * 2 + 1] ?? 0), 0)
    const bottom = (tableRows: number, affiliateRows: number) =>
        COMPANY_FIRST_PAGE.baseBottom +
        overviewExtra +
        (tableRows - COMPANY_TABLE_ROWS) * COMPANY_FIRST_PAGE.tableRow +
        (affiliateRows - COMPANY_AFFILIATE_ROWS) * COMPANY_FIRST_PAGE.tableRow
    const fits = (layout: {tableRows: number; affiliateRows: number}) =>
        bottom(layout.tableRows, layout.affiliateRows) <= COMPANY_FIRST_PAGE.budgetBottom
    // 줄이는 단계 — 번갈아 한 행씩(경영진 · 주주 먼저). 0단계가 기준 행 수다.
    const shrinkSteps = Array.from(
        {length: COMPANY_TABLE_ROWS - COMPANY_MIN_ROWS + COMPANY_AFFILIATE_ROWS - COMPANY_MIN_ROWS + 1},
        (_, step) => {
            const affiliateCut = Math.min(COMPANY_AFFILIATE_ROWS - COMPANY_MIN_ROWS, Math.floor(step / 2))
            const tableCut = Math.min(COMPANY_TABLE_ROWS - COMPANY_MIN_ROWS, step - affiliateCut)
            return {tableRows: COMPANY_TABLE_ROWS - tableCut, affiliateRows: COMPANY_AFFILIATE_ROWS - affiliateCut}
        },
    )
    // 늘리는 단계 — 번갈아 한 행씩(경영진 · 주주 먼저), 표마다 최대 10행.
    // 기준이 들어가면 들어가는 가장 큰 단계를, 안 들어가면 들어가는 가장 작은 줄임 단계를 고른다.
    const growSteps = Array.from(
        {length: KBIGX_PRINT_LIST_LIMIT - COMPANY_TABLE_ROWS + KBIGX_PRINT_LIST_LIMIT - COMPANY_AFFILIATE_ROWS},
        (_, index) => {
            const step = index + 1
            const affiliateAdd = Math.min(KBIGX_PRINT_LIST_LIMIT - COMPANY_AFFILIATE_ROWS, Math.floor(step / 2))
            const tableAdd = Math.min(KBIGX_PRINT_LIST_LIMIT - COMPANY_TABLE_ROWS, step - affiliateAdd)
            return {tableRows: COMPANY_TABLE_ROWS + tableAdd, affiliateRows: COMPANY_AFFILIATE_ROWS + affiliateAdd}
        },
    )
    const {tableRows, affiliateRows} = fits(shrinkSteps[0])
        ? (growSteps.filter(fits).at(-1) ?? shrinkSteps[0])
        : (shrinkSteps.find(fits) ?? shrinkSteps[shrinkSteps.length - 1])
    return {tableRows, affiliateRows}
}

// 정부 R&D 사업 현황 — 접수중과제 · 접수기간 도래 과제(미확정)가 한 쪽(소제목 위 221 ~ KBX_PAGE_CONTENT_BOTTOM)을 위아래로 나눈다.
//   · 칸마다 소제목 · 표 머리 98, 표 사이 40, 도래 과제 아래 각주 43 → 두 표의 행 자리 rowsHeight 1293.
//   · 값 행 80(값 + 둘째 줄) — 공고명 2줄 · 부처명 · 전문기관 1줄 말줄임, 담당자는 1줄에 맞춰 글자를 줄여 늘 80 이다.
//     '-' 줄은 51.
//   · 접수중과제는 늘 10행(800, 모자라면 '-' 줄). 도래 과제는 남은 493 에 들어가는 만큼(최대 10행) 그린다.
// [주의] kbigx-print-innovation.tsx 의 KbigxPrintInnovationRnd 표 치수를 바꾸면 같이 고친다.
const RND_PROJECT_AREA = {
    rowsHeight: KBX_PAGE_CONTENT_BOTTOM - 221 - 98 * 2 - 40 - 43,
    row: 80,
    emptyRow: 51,
    /** 두 표의 높이 비율(flex-grow)로 쓰는 칸 수 — 전체 16칸 중 접수중과제 10칸, 도래 과제 6칸. */
    slots: 16,
    openSlots: KBIGX_PRINT_LIST_LIMIT,
} as const
const rndProjectRowTotals = (projects: readonly unknown[]) =>
    Array.from({length: KBIGX_PRINT_LIST_LIMIT}, (_, index) =>
        projects[index] ? RND_PROJECT_AREA.row : RND_PROJECT_AREA.emptyRow,
    ).reduce<number[]>((acc, rowHeight) => [...acc, (acc.at(-1) ?? 0) + rowHeight], [])
const rndProjectRowsIn = (projects: readonly unknown[], height: number) =>
    Math.max(1, rndProjectRowTotals(projects).filter((total) => total <= height).length)

type KbigxRndProjectLayout = {openRows: number; upcomingRows: number; openSlots: number; upcomingSlots: number}

const getKbigxRndProjectLayout = (upcoming: readonly unknown[]): KbigxRndProjectLayout => {
    const {rowsHeight, row, slots, openSlots} = RND_PROJECT_AREA
    return {
        openRows: KBIGX_PRINT_LIST_LIMIT,
        upcomingRows: rndProjectRowsIn(upcoming, rowsHeight - openSlots * row),
        openSlots,
        upcomingSlots: slots - openSlots,
    }
}

// 특허 칸 값의 줄 수 상한 — 칸이 이 줄 수에서 말줄임하므로 어림도 상한까지만 센다.
// 특허명 · 출원인 · 권리자 1줄, 기술분야 2줄(출원번호 + 등록번호 두 줄 높이 안). 표 쪽 말줄임과 같이 바꾼다.
type PatentLineCaps = {title: number; holder: number; field: number}
const HOLDING_PATENT_LINE_CAPS: PatentLineCaps = {title: 1, holder: 1, field: 2}
const cappedLines = (text: string, fontSize: number, width: number, maxLines: number) =>
    Math.min(maxLines, estimateLines(text, fontSize, width))

// 특허 한 건(1행 + 2행) 높이 — 출원인 칸 폭은 표마다 다르다. 기술분야가 없는 표(우수특허)는 그 칸을 세지 않는다.
const estimatePatentRowHeight = (
    patent: PatentRowText,
    holderWidth: number = PATENT_PAGE.holderWidth,
    caps: PatentLineCaps = HOLDING_PATENT_LINE_CAPS,
) => {
    const {titleRow, detailRow, fontSize, subFontSize} = PATENT_PAGE
    const holderHeight =
        cappedLines(patent.applicant, fontSize, holderWidth, caps.holder) * detailRow.lineHeight +
        cappedLines(`(${patent.rightHolder})`, subFontSize, holderWidth, caps.holder) * detailRow.subLineHeight
    const fieldHeight = patent.field
        ? cappedLines(patent.field, fontSize, PATENT_PAGE.fieldWidth, caps.field) * detailRow.lineHeight
        : 0
    const numberHeight = detailRow.lineHeight + detailRow.subLineHeight

    return (
        titleRow.padding +
        cappedLines(patent.title, fontSize, titleRow.width, caps.title) * titleRow.lineHeight +
        detailRow.padding +
        Math.max(holderHeight, fieldHeight, numberHeight)
    )
}

// 특허 보유현황 — 한 쪽 · 10행. 앞에서부터 최대 10건(정렬은 데이터 순서 그대로 — 출원일 최근순으로 받는다), 모자라면
// '-' 줄(특허명 한 줄 + 값 한 줄)로 채운다. 10행이 rowsHeight 를 넘으면 들어가는 행까지만 그린다(적어도 1행).
const PATENT_EMPTY_ROW_HEIGHT =
    PATENT_PAGE.titleRow.padding +
    PATENT_PAGE.titleRow.lineHeight +
    PATENT_PAGE.detailRow.padding +
    PATENT_PAGE.detailRow.lineHeight
const PATENT_MAX_ROWS = KBIGX_PRINT_LIST_LIMIT

type KbigxPatentRows = {
    /** 그릴 특허 수(앞에서부터). */
    patentRows: number
    /** 뒤에 붙이는 '-' 줄 수. */
    emptyRows: number
}

const getKbigxPatentRows = (patents: readonly PatentRowText[]): KbigxPatentRows => {
    const listed = patents.slice(0, KBIGX_PRINT_LIST_LIMIT)
    const totals = Array.from({length: PATENT_MAX_ROWS}, (_, index) =>
        listed[index] ? estimatePatentRowHeight(listed[index]) : PATENT_EMPTY_ROW_HEIGHT,
    ).reduce<number[]>((acc, height) => [...acc, (acc.at(-1) ?? 0) + height], [])
    const rows = Math.max(1, totals.filter((total) => total <= PATENT_PAGE.rowsHeight).length)
    const patentRows = Math.min(rows, listed.length)
    return {patentRows, emptyRows: rows - patentRows}
}

// 우수특허 줄 — 웹 화면과 같은 규칙(toExcellentPatentRows: 피인용 지수 높은 순 10건 + '기타' 줄).
const excellentPatentRows = (report: InnovationGrowthReport) =>
    toExcellentPatentRows(report.techInnovation.excellentPatents, KBIGX_PRINT_LIST_LIMIT)
// 우수특허 — 한 쪽 · 10행(+ 11건 이상이면 '기타' 줄). 모자라면 '-' 줄로 채우고, 10행이
// rowsHeight − '기타' 줄 높이를 넘으면 들어가는 행까지만 그린다(적어도 1행).
type KbigxExcellentPatentRows = ReturnType<typeof excellentPatentRows> & {emptyRows: number}

const getKbigxExcellentPatentRows = (report: InnovationGrowthReport): KbigxExcellentPatentRows => {
    const {patents, otherCitations} = excellentPatentRows(report)
    const budget =
        EXCELLENT_PATENT_PAGE.rowsHeight - (otherCitations === null ? 0 : EXCELLENT_PATENT_PAGE.otherRowHeight)
    const totals = Array.from({length: KBIGX_PRINT_LIST_LIMIT}, (_, index) =>
        patents[index]
            ? estimatePatentRowHeight(patents[index], EXCELLENT_PATENT_PAGE.holderWidth)
            : PATENT_EMPTY_ROW_HEIGHT,
    ).reduce<number[]>((acc, height) => [...acc, (acc.at(-1) ?? 0) + height], [])
    const rows = Math.max(1, totals.filter((total) => total <= budget).length)
    const patentRows = Math.min(rows, patents.length)
    return {patents: patents.slice(0, patentRows), otherCitations, emptyRows: rows - patentRows}
}

// 높이로 쪽 나누기 — 앞에서부터 쌓다가 budget 을 넘는 항목부터 '(계속)' 쪽으로 넘긴다. 쪽마다 맡은 범위는 range 로
// 넘기고, 쪽 본문이 range 로 잘라 그린다. 지금은 기업신용정보만 쓴다.
const heightPages = (base: KbigxPrintPageSpec, heights: readonly number[], budget: number): KbigxPrintPageSpec[] => {
    const starts = heights.reduce<{starts: number[]; used: number}>(
        (acc, height, index) =>
            index && acc.used + height > budget
                ? {starts: [...acc.starts, index], used: height}
                : {starts: acc.starts, used: acc.used + height},
        {starts: [0], used: 0},
    ).starts

    return starts.map((start, index) => ({
        ...base,
        id: index ? `${base.id}-continued-${index + 1}` : base.id,
        title: index ? `${base.title} (계속)` : base.title,
        range: {start, end: starts[index + 1] ?? heights.length, total: heights.length},
    }))
}

// 쪽 종류 — 쪽 본문 컴포넌트를 고르는 키(kbigx-print-document.tsx 의 PAGE_CONTENT).
// 새 쪽: ① 여기에 kind 추가 → ② 아래 SECTION_PAGES 에 page(...) 추가 → ③ PAGE_CONTENT 에 본문 컴포넌트 연결.
// 이름의 숫자는 장 안의 쪽 순서다(기업신용정보 '(계속)' 쪽은 같은 kind 를 다시 쓴다).
const KBIGX_PRINT_PAGE_KINDS = [
    'cover',
    'toc',
    'briefing-1',
    'briefing-2',
    'briefing-3',
    'company-1',
    'company-2',
    'company-3',
    'innovation-1',
    'innovation-2',
    'innovation-3',
    'innovation-4',
    'innovation-5',
    'innovation-6',
    'innovation-7',
    'innovation-8',
    'tech-index-1',
    'tech-index-2',
    'credit-finance-1',
    'credit-finance-2',
    'credit-finance-3',
    'credit-finance-4',
    'credit-finance-5',
    'credit-finance-6',
    'activity-1',
    'activity-2',
    'reference-1',
    'back-cover',
] as const

type KbigxPrintPageKind = (typeof KBIGX_PRINT_PAGE_KINDS)[number]

// 쪽 틀(머리말 · 바닥글) 없이 그리는 쪽 — 표지 · 목차 · 뒷표지.
const KBIGX_PRINT_FRAMELESS_KINDS: readonly KbigxPrintPageKind[] = ['cover', 'toc', 'back-cover']
const isKbigxPrintFrameless = (kind: KbigxPrintPageKind) => KBIGX_PRINT_FRAMELESS_KINDS.includes(kind)

type KbigxPrintPageRange = {
    /** 이 쪽이 맡는 목록 범위(앞에서부터 start 이상 end 미만). */
    start: number
    end: number
    /** 목록 전체 건수. */
    total: number
}

type KbigxPrintPageSpec = {
    /** 쪽 식별자(React key) — 이어지는 쪽은 '-continued-2' 처럼 붙는다. */
    id: string
    /** 쪽 종류 — 같은 종류는 같은 쪽 컴포넌트로 그린다(이어지는 쪽도 같은 종류). */
    kind: KbigxPrintPageKind
    /** 이 쪽이 속한 장. 없으면 표지 · 목차 · 뒷표지다. */
    section?: KbigxPrintSectionId
    /** 쪽 제목(확인 · 접근성용). */
    title: string
    /** 바닥글에 쪽 번호를 찍는지. 표지 · 목차 · 뒷표지는 찍지 않는다. */
    isNumbered: boolean
    /** 목록을 여러 쪽으로 나눴을 때 이 쪽의 범위(heightPages 로 나눈 쪽만). */
    range?: KbigxPrintPageRange
}

type KbigxPrintPage = KbigxPrintPageSpec & {
    /** 바닥글 쪽 번호(1부터). 번호를 찍지 않는 쪽(isNumbered: false)은 undefined. */
    pageNumber?: number
    /** 장의 첫 쪽이면 장 제목 박스, 아니면 머리말을 그린다. */
    isSectionStart: boolean
}

const page = (
    kind: KbigxPrintPageKind,
    section: KbigxPrintSectionId | undefined,
    title: string,
    isNumbered = true,
): KbigxPrintPageSpec => ({id: kind, kind, section, title, isNumbered})

// 장별 쪽 — 배열 순서가 인쇄 순서다. 행 수를 정하는 쪽은 본문 컴포넌트가 get* 함수를 직접 부른다.
const SECTION_PAGES: Record<PrintOutputSectionId, (report: InnovationGrowthReport) => KbigxPrintPageSpec[]> = {
    briefing: () => [
        page('briefing-1', 'briefing', '기업 정보 · 기술혁신정보'),
        page('briefing-2', 'briefing', '혁신성장역량지수 · 신용/재무 현황'),
        page('briefing-3', 'briefing', '활동성 정보'),
    ],
    company: () => [
        // 네 블록이 늘 한 쪽 — 개요 값 길이에 따라 표 행 수를 늘리거나 줄인다(getKbigxCompanyFirstPageLayout).
        page('company-1', 'company', '개요 · 경영진 및 주주현황 · 관계기업 · 특허 및 인증현황'),
        page('company-2', 'company', '재무상태 · 손익 · 주요재무비율 · 현금흐름'),
        // 매출처 · 매입처는 늘 한 쪽 · 표마다 10행(최대 10건, 모자라면 '-' 줄).
        page('company-3', 'company', '거래처현황'),
    ],
    innovation: () => [
        page('innovation-1', 'innovation', '보유기술'),
        // 특허 보유현황은 늘 한 쪽 · 10행(getKbigxPatentRows).
        page('innovation-2', 'innovation', '특허 보유현황'),
        page('innovation-3', 'innovation', '특허기술 분석 · 기업·특허 현황'),
        page('innovation-4', 'innovation', '경쟁기업 및 우수기업'),
        // 우수특허는 늘 한 쪽 · 10행 + 기타(getKbigxExcellentPatentRows).
        page('innovation-5', 'innovation', '우수특허'),
        // 이머징 기술 · R&D 이슈는 늘 한 쪽 — 표는 최대 10건 + 기타 + 합계 줄, 기술분야 이름은 한 줄 말줄임.
        page('innovation-6', 'innovation', '이머징 기술 · R&D 이슈'),
        page('innovation-7', 'innovation', 'R&D 전문기관 현황'),
        // 접수중과제 · 접수기간 도래 과제는 늘 한 쪽(getKbigxRndProjectLayout).
        page('innovation-8', 'innovation', '정부 R&D 접수중과제 · 접수기간 도래 과제'),
    ],
    'tech-index': () => [
        page('tech-index-1', 'tech-index', '지수설명 · 혁신성장역량지수 · 부문별 지표 비교'),
        page('tech-index-2', 'tech-index', '유형별 비교 · 4대 혁신역량'),
    ],
    'credit-finance': (report) => [
        page('credit-finance-1', 'credit-finance', '기업신용등급 · 현금흐름등급'),
        ...heightPages(
            page('credit-finance-2', 'credit-finance', '기업신용정보'),
            creditInfoHeights(report),
            CREDIT_INFO_PAGE.budget,
        ),
        page('credit-finance-3', 'credit-finance', '재무비율진단 (성장성 · 수익성)'),
        page('credit-finance-4', 'credit-finance', '재무비율진단 (안정성 · 활동성)'),
        page('credit-finance-5', 'credit-finance', '차입금 분석'),
        page('credit-finance-6', 'credit-finance', '차입금 현황'),
    ],
    activity: () => [
        page('activity-1', 'activity', '인적자원 현황'),
        page('activity-2', 'activity', '에너지 사용 현황'),
    ],
}

const isPrintOutputSectionId = (value: string): value is PrintOutputSectionId =>
    PRINT_OUTPUT_SELECTION_SECTIONS.some((section) => section.id === value)

// ?sections= 값 → 고른 장. 값이 없거나 알 수 없는 id 뿐이면 전체 장이다.
const parseKbigxPrintSections = (value: string | string[] | undefined): readonly PrintOutputSectionId[] => {
    const raw = Array.isArray(value) ? value.join(',') : (value ?? '')
    const selected = raw.split(',').filter(isPrintOutputSectionId)

    return selected.length ? selected : PRINT_OUTPUT_SELECTION_SECTIONS.map((section) => section.id)
}

// 인쇄본 주소(기업 · 기관) — 웹 보고서 [보고서 다운로드] → 보고서 내용 선택 [보고서 미리보기]가 이 주소를 새 탭으로 연다(lib/open-report-print-tab.ts).
// 두 화면은 같은 인쇄본을 그린다. 각 사용자 유형의 웹 보고서 page.tsx 가 자기 주소를 printPath 로 넘긴다.
const KBIGX_PRINT_CORP_PATH = '/corp/k-bigx-report/innovation-growth-report/report-print'
const KBIGX_PRINT_ORG_PATH = '/org/k-bigx-report/innovation-growth-report/report-print'

// 인쇄본 주소 + 쿼리 — 보고서 id · 고른 장(?sections=), 퍼블리싱 확인용 열람 케이스(?case=) · 값 모양(?empty=)(둘 다 연동 후 지운다).
// 인쇄본 화면이 이 값으로 보고서를 다시 조회해 그린다 — 웹 화면을 찍는 것이 아니다.
const getKbigxPrintHref = (
    path: string,
    {
        reportId,
        sections,
        previewCase,
        previewEmpty,
    }: {
        reportId?: string | null
        sections: readonly PrintOutputSectionId[]
        previewCase?: string | null
        previewEmpty?: string | null
    },
) => {
    const params = new URLSearchParams()
    if (reportId) params.set(INNOVATION_REPORT_ID_QUERY, reportId)
    params.set(KBIGX_PRINT_SECTIONS_QUERY, sections.join(','))
    if (previewCase) params.set(INNOVATION_REPORT_CASE_QUERY, previewCase)
    if (previewEmpty) params.set(INNOVATION_REPORT_EMPTY_QUERY, previewEmpty)

    return `${path}?${params.toString()}`
}

// 인쇄할 쪽 — 표지 · 목차 → 고른 장(선택 모달 순서) → 참고자료 · 뒷표지. 번호는 번호를 찍는 쪽만 1부터 센다.
const buildKbigxPrintPages = (
    report: InnovationGrowthReport,
    sections: readonly PrintOutputSectionId[],
): KbigxPrintPage[] => {
    const specs = [
        page('cover', undefined, '표지', false),
        page('toc', undefined, '목차', false),
        ...PRINT_OUTPUT_SELECTION_SECTIONS.filter((section) => sections.includes(section.id)).flatMap((section) =>
            SECTION_PAGES[section.id](report),
        ),
        page('reference-1', 'reference', '등급 정의'),
        page('back-cover', undefined, '뒷표지', false),
    ]
    const numberedIds = specs.filter((spec) => spec.isNumbered).map((spec) => spec.id)

    return specs.map((spec, index) => {
        const numberIndex = numberedIds.indexOf(spec.id)
        return {
            ...spec,
            pageNumber: numberIndex >= 0 ? numberIndex + 1 : undefined,
            isSectionStart: Boolean(spec.section) && specs[index - 1]?.section !== spec.section,
        }
    })
}

// 장 제목 박스의 작은 부제(장 이름 옆) — 부제가 있는 장만.
const KBIGX_PRINT_SECTION_SUBTITLES: Partial<Record<KbigxPrintSectionId, string>> = {
    'tech-index': '(혁신성장 역량지수)',
}
const getKbigxPrintSectionSubtitle = (section: KbigxPrintSectionId | undefined) =>
    section ? KBIGX_PRINT_SECTION_SUBTITLES[section] : undefined

// 장 이름 — 장 제목 박스 · 머리말 · 목차에 쓴다. 보고서 내용 선택 항목의 label 을 그대로 쓴다.
const getKbigxPrintSectionLabel = (section: KbigxPrintSectionId | undefined) =>
    section === 'reference'
        ? REFERENCE_SECTION_LABEL
        : PRINT_OUTPUT_SELECTION_SECTIONS.find((item) => item.id === section)?.label

// 목차 — 인쇄되는 장과 그 장의 첫 쪽 번호.
const getKbigxPrintToc = (pages: readonly KbigxPrintPage[]) =>
    pages
        .filter((item) => item.isSectionStart && item.section)
        .map((item) => ({
            section: item.section,
            label: getKbigxPrintSectionLabel(item.section) ?? '',
            pageNumber: item.pageNumber,
        }))

export {
    getKbigxExcellentPatentRows,
    buildKbigxPrintPages,
    formatKbigxPageNumber,
    getKbigxPatentRows,
    getKbigxPrintHref,
    getKbigxRndProjectLayout,
    formatKbigxPrintDate,
    getKbigxPrintSectionLabel,
    getKbigxPrintSectionSubtitle,
    getKbigxPrintToc,
    COMPANY_OVERVIEW_FIT_LABELS,
    COMPANY_OVERVIEW_LABELS,
    getKbigxCompanyFirstPageLayout,
    isKbigxPrintFrameless,
    KBIGX_PRINT_BRAND,
    KBIGX_PRINT_EYEBROW,
    KBIGX_PRINT_LIST_LIMIT,
    KBIGX_PRINT_NOTICE,
    KBIGX_PRINT_NOTICE_TITLE,
    KBIGX_PRINT_PAGE_KINDS,
    KBIGX_PRINT_REPORT_NAME,
    KBIGX_PRINT_REPORT_TITLE,
    KBIGX_PRINT_CORP_PATH,
    KBIGX_PRINT_ORG_PATH,
    KBIGX_PRINT_SECTIONS_QUERY,
    KBIGX_PRINT_TAGLINE,
    KBIGX_PRINT_TAGLINE_EN,
    KBIGX_PRINT_PDF_NOTICE,
    parseKbigxPrintSections,
}
export type {
    KbigxCompanyFirstPageLayout,
    KbigxPatentRows,
    KbigxRndProjectLayout,
    KbigxPrintPage,
    KbigxPrintPageKind,
    KbigxPrintPageRange,
    KbigxPrintSectionId,
}
