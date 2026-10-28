// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {KbigxPrintOutputSelectionDialog} from '@/components/composite/k-bigx-print-output-selection-dialog'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Button} from '@/components/ui/button'
import {
    MOCK_PRINT_OUTPUT_SELECTION_DEFAULT_SELECTED,
    MOCK_PRINT_OUTPUT_SELECTION_SUMMARY,
} from '@/content/service/k-bigx-print-output-selection'

export const metadata: Metadata = {title: '보고서 내용 선택 (KbigxPrintOutputSelectionDialog)'}

const USAGE_CODE = `import {KbigxPrintOutputSelectionDialog} from '@/components/composite/k-bigx-print-output-selection-dialog'
import {toPrintOutputSummary} from '@/content/service/k-bigx-print-output-selection'
import {getKbigxPrintHref, KBIGX_PRINT_CORP_PATH} from '@/content/service/k-bigx-print-report'
import {openReportTab} from '@/lib/open-report-print-tab'

<KbigxPrintOutputSelectionDialog
  summary={toPrintOutputSummary(report)}
  // [보고서 미리보기] — 고른 장만 담은 보고서 화면(report-print)을 새 탭으로 연다. 그 화면의 [PDF 다운로드]로 받는다.
  onPrint={(sections) => openReportTab(getKbigxPrintHref(KBIGX_PRINT_CORP_PATH, {reportId, sections}))}
>
  <Button type="button" variant="tertiary" size="md">보고서 다운로드</Button>
</KbigxPrintOutputSelectionDialog>`

// 마이페이지 K-BIGx 보고서 이력 카드 — 같은 모달을 카드 버튼에 붙인다(k-bigx-report-download-button.tsx).
const HISTORY_USAGE_CODE = `import {KBigxReportDownloadButton} from '@/components/custom/k-bigx-report-download-button'
import {KBIGX_PRINT_CORP_PATH} from '@/content/service/k-bigx-print-report'

// 기업 화면은 KBIGX_PRINT_CORP_PATH, 기관 화면은 KBIGX_PRINT_ORG_PATH
<KBigxReportDownloadButton item={item} printPath={KBIGX_PRINT_CORP_PATH} />`

const FLOW_COLUMNS = [
    {key: 'step', header: '단계', align: 'start', rowHeader: true},
    {key: 'what', header: '화면', align: 'start', wrap: true},
] as const

const FLOW_ROWS = [
    {
        key: 'open',
        cells: [
            '웹 보고서 · 보고서 이력',
            '웹 보고서 머리의 [보고서 다운로드], 또는 마이페이지 K-BIGx 보고서 이력 카드의 [보고서 다운로드]를 누르면 이 모달이 열립니다.',
        ],
    },
    {
        key: 'select',
        cells: [
            '보고서 내용 선택',
            '대상 요약(기업명 · 조회기준일) 아래에서 보고서에 넣을 내용(진단브리핑 · 기업현황 등 6개)을 고릅니다. 하나도 고르지 않으면 [보고서 미리보기]가 눌리지 않습니다.',
        ],
    },
    {
        key: 'preview',
        cells: [
            '보고서 미리보기',
            '고른 내용만 담은 보고서 화면(report-print)이 새 탭에 뜹니다. 표지 · 목차 · 참고자료 · 뒷표지는 늘 들어갑니다.',
        ],
    },
    {
        key: 'download',
        cells: [
            'PDF 다운로드',
            '새 탭 위쪽 막대의 [PDF 다운로드]로 PDF 파일을 받습니다(리포트 공통 참고). 새 탭은 주소의 보고서 id(?reportId=)로 보고서를 다시 조회해 그립니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'KbigxPrintOutputSelectionDialog',
        'summary',
        '대상 요약(항목명 · 값)입니다. 웹 보고서는 toPrintOutputSummary(report) 로, 보고서 이력 카드는 카드의 기업명 · 조회일시로 만듭니다.',
        '-',
        'readonly {label: string; value: string}[]',
    ],
    [
        'KbigxPrintOutputSelectionDialog',
        'defaultSelected',
        '열 때마다 골라 둘 항목입니다. 지난번에 고른 항목은 남기지 않습니다.',
        '[]',
        'readonly PrintOutputSectionId[]',
    ],
    ['KbigxPrintOutputSelectionDialog', 'children', '모달을 여는 버튼입니다.', '-', 'ReactNode'],
    [
        'KbigxPrintOutputSelectionDialog',
        'defaultOpen',
        '트리거 없이 처음부터 열어 둡니다(모달 단독 화면).',
        'false',
        'boolean',
    ],
    [
        'KbigxPrintOutputSelectionDialog',
        'onPrint',
        '[보고서 미리보기]를 누르면 고른 항목을 넘기고 모달을 닫습니다. 없으면 모달만 열려 있습니다(확인 화면).',
        '-',
        '(selected: PrintOutputSectionId[]) => void',
    ],
] as const

const KbigxPrintOutputSelectionDialogGuidePage = () => (
    <GuidePageShell
        title="보고서 내용 선택 (KbigxPrintOutputSelectionDialog)"
        description="K-BIGx 웹 보고서와 마이페이지 K-BIGx 보고서 이력 카드의 [보고서 다운로드]에서 여는 모달입니다. 한 부의 보고서에 넣을 내용을 고르고 미리보기를 엽니다."
    >
        <BaseCard>
            <section aria-labelledby="print-select-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="print-select-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        전체선택은 항목을 모두 켜고 끄며, 일부만 골라지면 &apos;일부&apos; 상태가 됩니다. 아래 데모는
                        onPrint 가 없어 [보고서 미리보기]를 눌러도 새 탭을 열지 않습니다.
                    </p>
                </div>
                <div>
                    <KbigxPrintOutputSelectionDialog
                        summary={MOCK_PRINT_OUTPUT_SELECTION_SUMMARY}
                        defaultSelected={MOCK_PRINT_OUTPUT_SELECTION_DEFAULT_SELECTED}
                    >
                        <Button type="button" variant="tertiary" size="md">
                            보고서 다운로드
                        </Button>
                    </KbigxPrintOutputSelectionDialog>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="print-select-history" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="print-select-history" className="typo-h4-bold">
                        보고서 이력 카드에서 쓰기
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        마이페이지 K-BIGx 보고서 이력(기업 · 기관)의 카드 버튼은 KBigxReportDownloadButton 이 이 모달을
                        엽니다. 모달 요약은 카드의 기업명 · 조회일시이고, 미리보기는 카드 id 로 보고서를 다시
                        조회합니다. 카드 값을 보고서로 넘기지 않으므로 카드와 PDF 의 같은 정보는 보고서 API 가 맞춰 내려
                        줍니다.
                    </p>
                </div>
                <CodeBlock code={HISTORY_USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="print-select-flow" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="print-select-flow" className="typo-h4-bold">
                        흐름
                    </h2>
                </div>
                <Table caption="보고서 다운로드 흐름" columns={FLOW_COLUMNS} rows={FLOW_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="print-select-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="print-select-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        항목 묶음은 fieldset · legend 로 이름을 갖고, 체크박스마다 보이는 이름표와 연결됩니다[7.4.1].
                    </li>
                    <li>전체선택은 일부만 골라지면 &apos;일부&apos;(indeterminate) 상태로 읽힙니다[8.2.1].</li>
                    <li>포커스 가두기 · Esc 닫기 · 포커스 복귀는 Dialog(Radix)가 처리합니다[8.2.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="print-select-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="print-select-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="KbigxPrintOutputSelectionDialog Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default KbigxPrintOutputSelectionDialogGuidePage
