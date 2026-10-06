// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {FileUpload} from '@/components/composite/file-upload'
import {FileUploadField} from '@/components/composite/file-upload-field'
import {FormCard} from '@/components/composite/form-card'
import {Button} from '@/components/ui/button'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import FileUploadFormDemo from './file-upload-form-demo'
import {FileUploadResultDemo} from './file-upload-result-demo'

export const metadata: Metadata = {title: '파일 업로드 (FileUpload)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const SECTION_HEAD = 'flex max-w-4xl flex-col gap-2'
const SUB_LIST = 'border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t'
const SUB_BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

const USAGE_CODE = `<FormCard title="정보이용동의서 업로드">
  <FileUpload
    name="informationConsentFile"
    accept=".pdf,.zip,.rar,.7z"
    maxSizeMb={50}
    hint="PDF, ZIP, RAR, 7Z 파일 1개 첨부 가능 (파일당 최대 50MB)"
  />
</FormCard>`

const FIELD_CODE = `<FormCard title="평가내역조회 필수 양식">
  <div className="flex flex-col gap-10">
    <FileUploadField
      label="평가내역조회용 표준엑셀 업로드"
      required
      action={<Button type="button" variant="secondary" size="xs">표준양식 다운로드</Button>}
      name="bulkDataStandardExcel"
      accept=".xlsx,.xls,.csv"
      maxSizeMb={50}
      hint="지원 형식: XLSX, XLS, CSV (최대 50MB)"
    />
    <FileUploadField
      label="정보 제공 동의서 압축파일 업로드"
      required
      action={<Button type="button" variant="secondary" size="xs">동의서 양식 다운로드</Button>}
      name="informationConsentArchive"
      accept=".zip,.rar,.7z"
      maxSizeMb={1024}
      hint="지원 형식: ZIP, RAR, 7Z (최대 1GB)"
    />
  </div>
</FormCard>`

const SUBMIT_CODE = `{/* 값은 숨은 <input type="file"> 이 그대로 들고 있다 */}
const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
  const formData = new FormData(event.currentTarget)
  formData.get('informationConsentFile') // File — 고르지 않았으면 빈 File
}

{/* 상위 화면이 선택 여부를 알아야 하면(CTA 활성화·검사 등) onFileChange 를 받는다 */}
<FileUpload
  name="informationConsentFile"
  onFileChange={(file) => setFileName(file?.name ?? '')}
  error={isSubmitted && !fileName ? '정보이용동의서 파일을 첨부해 주세요.' : undefined}
/>`

const PROPS_ITEMS = [
    ['FileUpload', 'name', '폼에 담길 이름입니다. 이 이름으로 선택된 File 이 전송됩니다.', '—', 'string'],
    ['FileUpload', 'inputLabel', '숨은 file input 의 이름(스크린리더 · 자동 검사용).', "'첨부파일'", 'string'],
    [
        'FileUpload',
        'accept',
        '받을 확장자·MIME 입니다(<input accept>). 확장자로 적으면 고른 파일의 확장자도 같은 목록으로 검사합니다. 사람이 읽는 안내는 hint 로 따로 적습니다.',
        'undefined',
        'string',
    ],
    [
        'FileUpload',
        'maxSizeMb',
        '파일 한 개의 최대 용량(MB)입니다. 넘으면 첨부하지 않고 안내를 띄웁니다.',
        'undefined',
        'number',
    ],
    ['FileUpload', 'required', '숨은 input 의 필수 여부입니다.', 'false', 'boolean'],
    [
        'FileUpload',
        'description',
        '비어 있을 때 상자 안의 안내 문구입니다.',
        "'첨부할 파일을 여기에 끌어다 놓거나, …'",
        'ReactNode',
    ],
    [
        'FileUpload',
        'hint',
        '안내 문구 아래 보조 문구입니다. 첨부 정책을 사람이 읽는 문장으로 적습니다.',
        'undefined',
        'ReactNode',
    ],
    [
        'FileUpload',
        'completeTitle',
        '업로드 완료 상태의 제목입니다.',
        "'파일이 정상적으로 업로드되었어요'",
        'ReactNode',
    ],
    [
        'FileUpload',
        'completeDescription',
        '완료 상태의 설명입니다. 화면의 CTA 이름에 맞춰 바꿔 씁니다.',
        "'파일 내용을 검토한 후 [신청] 버튼을 눌러주세요.'",
        'ReactNode',
    ],
    [
        'FileUpload',
        'onFileChange',
        '파일을 고르거나 지웠을 때 호출됩니다. 상위 화면의 검사·CTA 상태에 씁니다.',
        'undefined',
        '(file: File | null) => void',
    ],
    [
        'FileUpload',
        'error',
        '제출 검사에서 걸린 안내 문구입니다. 상자 아래에 띄우고 [파일선택] 버튼에 잇습니다. 첨부 정책에 걸린 안내가 있으면 그쪽이 먼저 표시됩니다.',
        'undefined',
        'string',
    ],
    ['FileUpload', 'className', '바깥 상자에 덧붙일 클래스입니다.', 'undefined', 'string'],
] as const

const RESULT_CODE = `{/* 파일을 고르면 컴포넌트가 스스로 성공 결과로 바꾼다 — 화면은 파일만 받아 둔다 */}
<FileUploadField
  label="평가내역조회용 표준엑셀 업로드"
  required
  action={<Button type="button" variant="secondary" size="xs">표준양식 다운로드</Button>}
  name="bulkDataStandardExcel"
  accept=".xlsx,.xls,.csv"
  maxSizeMb={50}
  hint="지원 형식: XLSX, XLS, CSV (최대 50MB)"
  completeDetails={[{label: '데이터 건수', value: '248건'}]}
  onFileChange={setExcelFile}
  error={isSubmitted && !excelFile ? '표준엑셀 파일을 첨부해 주세요.' : undefined}
/>

{/* 서버 검증 결과가 오면 result 로 넘긴다 — 그때는 이 값이 컴포넌트의 상태보다 우선한다 */}
<FileUploadField
  …
  result={{
    status: 'error',
    title: <><span className="text-error-500">2건</span>의 문제가 발견되었어요</>,
    fileName: '대량정보조회_표준양식_대상기업목록.xlsx',
    fileSize: '856.0KB',
    downloadHref: '/files/…',
    details: [
      {label: '3행', value: '올바르지 않은 데이터 형식입니다.'},
      {label: '5행 F9열', value: '데이터가 입력되지 않았습니다.'},
    ],
  }}
/>`

const RESULT_PROPS_ITEMS = [
    [
        'FileUploadSuccess · FileUploadError',
        'fileName · fileSize',
        '검사한 파일 이름과 용량입니다. 용량은 사람이 읽는 문자열로 넘깁니다. 지목할 파일이 없으면 파일 줄을 두지 않습니다.',
        'undefined',
        'string',
    ],
    [
        'FileUploadSuccess · FileUploadError',
        'details',
        '파일 아래 항목입니다. 성공은 한 줄로 이어 붙고, 오류는 줄마다 쌓입니다. 넘기지 않으면 목록을 두지 않습니다.',
        'undefined',
        '{label, value}[]',
    ],
    [
        'FileUploadSuccess · FileUploadError',
        'title · description',
        '결과 제목·설명입니다. 생략하면 상태별 기본 문구를 씁니다.',
        '상태별 기본 문구',
        'ReactNode',
    ],
    [
        'FileUploadSuccess · FileUploadError',
        'downloadHref',
        '파일 내려받기 경로입니다. 없으면 다운로드 버튼을 두지 않습니다.',
        'undefined',
        'string',
    ],
    [
        'FileUploadSuccess · FileUploadError',
        'onReupload',
        '[다시 업로드] 동작입니다. 없으면 버튼을 두지 않습니다.',
        'undefined',
        '() => void',
    ],
    [
        'FileUploadSuccess · FileUploadError',
        'reuploadLabel',
        '되돌리기 버튼 글자입니다. 처리 결과 화면에서는 [새 조회]처럼 바꿔 씁니다.',
        "'다시 업로드'",
        'ReactNode',
    ],
    [
        'FileUploadSuccess',
        'isDetailsCentered',
        '성공 상세 한 줄을 가운데 둡니다. 파일 줄 없이 건수만 보여 주는 처리 결과(대량정보조회 완료)에 켭니다.',
        'false',
        'boolean',
    ],
] as const

const FIELD_PROPS_ITEMS = [
    ['FileUploadField', 'label', '업로드 자리의 이름입니다. 상자 위에 놓입니다.', '—', 'ReactNode'],
    [
        'FileUploadField',
        'action',
        '레이블 오른쪽 보조 액션입니다. 양식 다운로드 버튼처럼 이 자리에서만 필요한 버튼을 넘깁니다.',
        'undefined',
        'ReactNode',
    ],
    ['FileUploadField', 'name', '폼에 담길 이름입니다. 이 이름으로 선택된 File 이 전송됩니다.', '—', 'string'],
    [
        'FileUploadField',
        'accept · maxSizeMb',
        '첨부 정책입니다. 확장자·용량에 걸리면 상자 아래 문구가 아니라 오류 결과 패널로 알립니다.',
        'undefined',
        'string · number',
    ],
    [
        'FileUploadField',
        'required',
        '필수 여부입니다. 레이블에 * 를 붙이고 입력에도 그대로 전달합니다.',
        'false',
        'boolean',
    ],
    [
        'FileUploadField',
        'description · hint',
        '비어 있을 때 상자 안 안내 문구와 그 아래 보조 문구(지원 형식 등)입니다.',
        '기본 문구',
        'ReactNode',
    ],
    [
        'FileUploadField',
        'completeDescription · completeDetails',
        '성공 결과의 설명과 파일 줄 아래 항목입니다. 업로드 일시는 이 컴포넌트가 붙입니다.',
        'undefined',
        'ReactNode · {label, value}[]',
    ],
    [
        'FileUploadField',
        'onFileChange',
        '파일을 고르거나 비웠을 때 알립니다. 정책에 걸린 파일은 null 로 옵니다.',
        'undefined',
        '(file: File | null) => void',
    ],
    [
        'FileUploadField',
        'hasFormatError',
        '표준 양식 포맷 위반 여부입니다. 켜면 고른 파일을 행·열 오류 목록이 있는 오류 결과로 보여 줍니다. 첨부 정책 위반과는 다른 케이스입니다.',
        'false',
        'boolean',
    ],
    [
        'FileUploadField',
        'attachedView',
        "정책을 통과한 파일을 보여 주는 방식입니다. 'panel' 은 성공 결과 패널, 'file' 은 파일명 + 삭제(X) 한 줄입니다. 올린 뒤 따로 [조회 실행]을 눌러야 처리가 시작되는 화면(대량정보조회)은 'file' 을 씁니다. 정책 위반·result 는 어느 쪽이든 결과 패널입니다.",
        "'panel'",
        "'panel' | 'file'",
    ],
    [
        'FileUploadField',
        'result',
        '서버 검증 결과입니다. 넘기면 컴포넌트가 스스로 만든 상태 대신 이 값을 보여 줍니다.',
        'undefined',
        'FileUploadSuccessProps | FileUploadErrorProps',
    ],
    [
        'FileUploadField',
        'error',
        '제출 검사에서 걸린 안내 문구입니다. 상자 아래에 띄우고 [파일선택] 버튼에 잇습니다.',
        'undefined',
        'string',
    ],
] as const

const CHOICE_COLUMNS = [
    {key: 'part', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'shape', header: '모양', align: 'start', wrap: true},
    {key: 'use', header: '쓰는 곳', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'upload',
        cells: [
            <code key="part">FileUpload</code>,
            '끌어다 놓는 큰 상자',
            '파일 하나를 받는 일반 화면. 고르면 같은 상자가 완료 상태로 바뀝니다.',
        ],
    },
    {
        key: 'attach',
        cells: [
            <Link key="part" href="/component-guide/attach-field" className={LINK_CLASS}>
                AttachField
            </Link>,
            '레이블 + 낮은 한 줄 칸',
            '서류 여러 개를 나란히 받는 화면',
        ],
    },
    {
        key: 'field',
        cells: [
            <code key="part">FileUploadField</code>,
            '레이블 · 보조 액션 + 큰 상자 + 결과 패널',
            '대량정보 조회 신청 전용. 공통 FileUpload 와 별개라 서로 영향을 주지 않습니다.',
        ],
    },
    {
        key: 'result',
        cells: [
            <code key="part">FileUploadSuccess · FileUploadError</code>,
            '성공 · 오류 결과 패널',
            'FileUploadField 가 쓰고, 처리 결과 화면에서 단독으로도 씁니다.',
        ],
    },
] as const

const STATE_COLUMNS = [
    {key: 'state', header: '상태', align: 'start', rowHeader: true},
    {key: 'surface', header: '면 · 테두리', align: 'start', wrap: true},
    {key: 'content', header: '내용', align: 'start', wrap: true},
] as const

const STATE_ROWS = [
    {
        key: 'empty',
        cells: [
            '비어 있음',
            <code key="surface">bg-surface · border-control</code>,
            '안내 문구 + 보조 문구 + [파일선택] 버튼',
        ],
    },
    {
        key: 'dragging',
        cells: [
            '끌어다 놓는 중',
            <code key="surface">bg-file-upload-complete · border-primary</code>,
            '비어 있음과 같음(면 색만 바뀜)',
        ],
    },
    {
        key: 'complete',
        cells: [
            '업로드 완료',
            <code key="surface">bg-file-upload-complete · border-file-upload-complete-border</code>,
            '완료 표식 + 완료 문구 + 첨부된 파일 한 줄(삭제 버튼)',
        ],
    },
] as const

const POLICY_COLUMNS = [
    {key: 'check', header: '검사', align: 'start', rowHeader: true},
    {key: 'basis', header: '기준', align: 'start', wrap: true},
    {key: 'message', header: '걸렸을 때 문구', align: 'start', wrap: true},
] as const

const POLICY_ROWS = [
    {key: 'extension', cells: ['확장자', 'accept 에 적은 확장자 목록', 'PDF, ZIP, RAR, 7Z 파일만 첨부할 수 있습니다.']},
    {key: 'size', cells: ['용량', 'maxSizeMb (파일당)', '파일 용량은 50MB 이하만 첨부할 수 있습니다.']},
    {key: 'count', cells: ['개수', '항상 1개', '파일은 1개만 첨부할 수 있습니다.']},
] as const

const BULK_DATA_SEARCH_PATH = '/org/k-bigx-report/bulk-data-search'

// 대량정보조회(K-BIGx 보고서 · 기관) 케이스 큐레이션 — 같은 카드가 상태에 따라 어떤 컴포넌트로 바뀌는지.
const BULK_DATA_SEARCH_CASES = [
    {
        state: '① 업로드 전',
        component: 'FileUploadField (비어 있음)',
        cta: '[조회 실행] 꺼짐',
        href: BULK_DATA_SEARCH_PATH,
    },
    {
        state: '② 업로드 후',
        component: "FileUploadField attachedView='file' — 파일명 + 삭제(X)",
        cta: '[조회 실행] 켜짐',
        href: BULK_DATA_SEARCH_PATH,
    },
    {
        state: '③ 처리 중',
        component: 'LoadingState title · description (카드 전체를 대신함)',
        cta: '없음',
        href: `${BULK_DATA_SEARCH_PATH}?state=processing`,
    },
    {
        state: '④ 완료',
        component: "FileUploadSuccess isDetailsCentered · reuploadLabel='새 조회'",
        cta: '[결과 파일 다운로드]',
        href: `${BULK_DATA_SEARCH_PATH}/complete`,
    },
    {
        state: '⑤ 오류',
        component: 'FileUploadError — 파일 줄 + 행·열 오류 목록 + [다시 업로드]',
        cta: '[결과 파일 다운로드]',
        href: `${BULK_DATA_SEARCH_PATH}/failure`,
    },
] as const

const BULK_CASE_COLUMNS = [
    {key: 'state', header: '상태', align: 'start', rowHeader: true},
    {key: 'component', header: '컴포넌트', align: 'start', wrap: true},
    {key: 'cta', header: '아래 버튼', align: 'start'},
    {key: 'link', header: '화면', align: 'start'},
] as const

const FileUploadGuidePage = () => (
    <GuidePageShell
        title="파일 업로드 (FileUpload)"
        description="끌어다 놓기와 [파일선택] 버튼으로 파일을 받는 첨부 영역입니다."
    >
        <BaseCard>
            <section aria-labelledby="file-upload-demo" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="file-upload-demo" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        파일을 끌어다 놓거나 [파일선택]을 누르면 완료 상태로 바뀌고, 삭제 버튼으로 되돌립니다. 파일은 한
                        개만 받습니다.
                    </p>
                </div>
                <FormCard title="정보이용동의서 업로드">
                    <FileUpload
                        name="guideConsentFile"
                        accept=".pdf,.zip,.rar,.7z"
                        maxSizeMb={50}
                        hint="PDF, ZIP, RAR, 7Z 파일 1개 첨부 가능 (파일당 최대 50MB)"
                    />
                </FormCard>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="file-upload-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="file-upload-variants" className="typo-h4-bold">
                        상태와 예시
                    </h2>
                </div>
                <div className={SUB_LIST}>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">FileUpload 상태</h3>
                        <Table
                            caption="파일 선택 여부에 따른 상자의 상태"
                            columns={STATE_COLUMNS}
                            rows={STATE_ROWS}
                            size="md"
                        />
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">첨부 정책</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>accept</code> 는 파일 선택창의 필터일 뿐이라 고른 뒤 한 번 더 검사합니다. 걸린 파일은
                            첨부하지 않고 상자 아래에 이유를 띄웁니다.
                        </p>
                        <Table
                            caption="첨부 정책과 걸렸을 때의 안내"
                            columns={POLICY_COLUMNS}
                            rows={POLICY_ROWS}
                            size="md"
                        />
                        <ul className={LIST_CLASS}>
                            <li>
                                <code>accept</code> 에는 MIME 이 아니라 확장자(<code>.zip</code> 형태)로 적습니다.
                                확장자 안내 문구는 여기서 자동으로 만듭니다.
                            </li>
                            <li>화면의 검사는 1차 확인입니다. 서버에서 다시 확인합니다.</li>
                        </ul>
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">폼 제출과 서버 전송</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            파일은 <code>name</code> 으로 제출되며 끌어다 놓은 파일도 같습니다. 비어 있으면{' '}
                            <code>error</code> 로 넘긴 안내가 상자 아래에 붙습니다.
                        </p>
                        <FileUploadFormDemo />
                        <CodeBlock code={SUBMIT_CODE} language="tsx" copyLabel="복사" />
                        <ul className={LIST_CLASS}>
                            <li>여러 개를 받아야 하면 컴포넌트를 여러 번 놓습니다.</li>
                            <li>업로드 API 는 붙어 있지 않습니다. 연동할 때 폼 제출 쪽에서 파일을 보냅니다.</li>
                        </ul>
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">FileUploadField</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            레이블 · 보조 액션(양식 다운로드 등) 아래에 첨부 상자를 두고, 파일을 고르면 성공 · 오류 결과
                            패널로 바뀝니다. 정책에 걸린 파일도 상자 아래 문구가 아니라 오류 결과 패널로 알립니다.
                        </p>
                        <FormCard title="평가내역조회 필수 양식">
                            <div className="flex flex-col gap-10">
                                <FileUploadField
                                    label="평가내역조회용 표준엑셀 업로드"
                                    required
                                    action={
                                        <Button type="button" variant="secondary" size="xs">
                                            표준양식 다운로드
                                        </Button>
                                    }
                                    name="guideBulkDataStandardExcel"
                                    accept=".xlsx,.xls,.csv"
                                    maxSizeMb={50}
                                    hint="지원 형식: XLSX, XLS, CSV (최대 50MB)"
                                />
                                <FileUploadField
                                    label="정보 제공 동의서 압축파일 업로드"
                                    required
                                    action={
                                        <Button type="button" variant="secondary" size="xs">
                                            동의서 양식 다운로드
                                        </Button>
                                    }
                                    name="guideInformationConsentArchive"
                                    accept=".zip,.rar,.7z"
                                    maxSizeMb={1024}
                                    hint="지원 형식: ZIP, RAR, 7Z (최대 1GB)"
                                />
                            </div>
                        </FormCard>
                        <CodeBlock code={FIELD_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">업로드 결과 패널</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            서버 검증 결과(용량 · 건수 · 오류 상세)는 화면이 <code>result</code> 로 넘깁니다. 넘기면
                            컴포넌트가 만든 상태보다 우선합니다.
                        </p>
                        <FormCard title="평가내역조회 필수 양식">
                            <FileUploadResultDemo />
                        </FormCard>
                        <CodeBlock code={RESULT_CODE} language="tsx" copyLabel="복사" />
                        <ul className={LIST_CLASS}>
                            <li>
                                오류는 두 갈래이고 섞지 않습니다. 첨부 정책 위반(종류 · 용량 · 개수)은 설명 줄에 사유만
                                적습니다.
                            </li>
                            <li>
                                표준 양식 위반(행 · 열 단위)은 <code>details</code> 에 위치와 사유를 넘깁니다. 제목은
                                &quot;N건의 문제가 발견되었어요&quot;가 됩니다.
                            </li>
                            <li>
                                <code>hasFormatError</code> 는 검증 API 연동 전에 양식 위반 화면을 확인하는
                                스위치입니다. 연동 후에는 실제 결과를 <code>result</code> 로 넘깁니다.
                            </li>
                            <li>
                                <code>downloadHref</code> · <code>onReupload</code> 를 주지 않으면 그 버튼은 나오지
                                않습니다.
                            </li>
                        </ul>
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">대량정보조회 상태별 구성</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            올린 뒤 [조회 실행]을 눌러야 처리가 시작되는 화면입니다. ② 는 아래 상자에 파일을 골라
                            확인합니다.
                        </p>
                        <FileUploadField
                            label="대량정보조회 표준양식 업로드"
                            required
                            name="guideBulkDataSearchExcel"
                            accept=".xlsx,.xls,.csv"
                            maxSizeMb={50}
                            hint="지원 형식: XLSX, XLS, CSV (최대 50MB)"
                            attachedView="file"
                        />
                        <Table
                            caption="대량정보조회 상태별 컴포넌트와 버튼"
                            columns={BULK_CASE_COLUMNS}
                            rows={BULK_DATA_SEARCH_CASES.map((item) => ({
                                key: item.state,
                                cells: [
                                    item.state,
                                    item.component,
                                    item.cta,
                                    <Link key="link" href={item.href} className={LINK_CLASS}>
                                        {item.state} 화면 열기
                                    </Link>,
                                ],
                            }))}
                            size="md"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="file-upload-choice" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="file-upload-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        파일 첨부 컴포넌트가 여럿이라 화면 구성으로 고릅니다. 일반 화면은 FileUpload 를 씁니다.
                    </p>
                </div>
                <Table caption="파일 첨부 컴포넌트 사용 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="file-upload-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="file-upload-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아래는 컴포넌트가 처리하므로 사용처에서 따로 넣지 않습니다.
                    </p>
                </div>
                <ul className={LIST_CLASS}>
                    <li>끌어다 놓기와 같은 일을 [파일선택] 버튼으로 키보드만으로 할 수 있습니다[6.1.1].</li>
                    <li>
                        <code>FileUploadField</code> 는 레이블을 <code>role=&quot;group&quot;</code> 의 이름으로 이어
                        여러 업로드 칸의 [파일선택]을 구분하고, 필수 표시는 &quot;(필수)&quot; 문구로 읽힙니다[7.4.1 ·
                        5.3.1].
                    </li>
                    <li>
                        업로드 결과는 <code>role=&quot;status&quot;</code>(오류 결과는{' '}
                        <code>role=&quot;alert&quot;</code>)로 알립니다[8.2.1].
                    </li>
                    <li>삭제하면 포커스가 [파일선택] 버튼으로 돌아갑니다[6.1.2].</li>
                    <li>
                        <code>error</code> 를 주면 문구가 버튼의 <code>aria-describedby</code> 로 이어지고{' '}
                        <code>aria-invalid</code> 가 걸립니다[7.4.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="file-upload-props" className="flex flex-col gap-6">
                <div className={SECTION_HEAD}>
                    <h2 id="file-upload-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <div className={SUB_LIST}>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">FileUpload</h3>
                        <PropsTable items={PROPS_ITEMS} caption="FileUpload Props 목록" />
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">FileUploadField</h3>
                        <PropsTable items={FIELD_PROPS_ITEMS} caption="FileUploadField Props 목록" />
                    </div>
                    <div className={SUB_BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">FileUploadSuccess · FileUploadError</h3>
                        <PropsTable
                            items={RESULT_PROPS_ITEMS}
                            caption="FileUploadSuccess / FileUploadError Props 목록"
                        />
                    </div>
                </div>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FileUploadGuidePage
