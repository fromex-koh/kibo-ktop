import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {FileUpload} from '@/components/composite/file-upload'
import {FileUploadField} from '@/components/composite/file-upload-field'
import {FormCard} from '@/components/composite/form-card'
import {Button} from '@/components/ui/button'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {FileUploadResultDemo} from './file-upload-result-demo'

export const metadata: Metadata = {title: '파일 업로드 (FileUpload)'}

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

// 파일 업로드 — 끌어다 놓기와 [파일선택] 버튼을 함께 받는 첨부 영역. 상태를 들고 있어 client 컴포넌트다.
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
        '시안 문구',
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

const FileUploadGuidePage = () => (
    <GuidePageShell
        title="파일 업로드 (FileUpload)"
        description="공통 FileUpload의 파일 선택 동작과, 대량정보 조회 신청에서만 사용하는 성공·실패 결과 UI를 구분해 안내합니다."
    >
        <BaseCard>
            <section aria-labelledby="file-upload-demo" className="flex flex-col gap-4">
                <div>
                    <h2 id="file-upload-demo" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        파일을 상자 위로 끌어다 놓거나 <strong className="text-foreground">파일선택</strong>을 누르면
                        완료 상태로 바뀝니다. 오른쪽 삭제 버튼을 누르면 비어 있는 상태로 돌아갑니다.
                    </p>
                    <p className="typo-body-l-regular text-muted-foreground mt-2">
                        이 기본 동작은 기존 화면에서 그대로 사용합니다. 대량정보 조회 신청의 결과 UI 때문에 공통
                        FileUpload의 상태나 Props를 변경하지 않습니다.
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
            <section aria-labelledby="file-upload-field" className="flex flex-col gap-4">
                <div>
                    <h2 id="file-upload-field" className="typo-h4-bold">
                        전용 업로드 — FileUploadField
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        대량정보 조회 신청 화면 전용 업로드입니다. [레이블 + 우측 보조 액션] 한 줄 아래에 첨부 상자를
                        두고, 파일을 고르면 성공·오류 결과 패널로 바뀝니다.{' '}
                        <strong className="text-foreground">
                            위 공통 FileUpload 와는 별개 컴포넌트이며 서로 코드를 공유하지 않습니다
                        </strong>{' '}
                        — 결과 패널·다시 업로드·다운로드처럼 이 흐름에만 필요한 것이 계속 늘어서, 공통 상자에 옵션을
                        얹는 대신 독립적으로 갖습니다. 그래서 공통 FileUpload 를 쓰는 다른 화면은 이 컴포넌트의 변경에
                        영향을 받지 않습니다. 첨부 상자의 겉모습·문구·첨부 정책 검사 방식은 같은 시안이라 값이 같습니다.
                    </p>
                </div>
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
                <PropsTable items={FIELD_PROPS_ITEMS} caption="FileUploadField Props 목록" />
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        묶음은 <code className="font-mono">role=&quot;group&quot;</code>이고 레이블을{' '}
                        <code className="font-mono">aria-labelledby</code>로 잇습니다 — 보조기기에서 &quot;…업로드
                        (필수) 그룹 안의 파일선택 버튼&quot;으로 읽힙니다([7.4.1]).
                    </li>
                    <li>
                        레이블을 <code className="font-mono">label htmlFor</code>로 두지 않습니다 — input 이{' '}
                        <code className="font-mono">hidden</code> 이라 숨은 컨트롤을 가리키는 label 은 아무 데도 닿지
                        않습니다.
                    </li>
                    <li>
                        필수 표시 * 는 장식이라 aria-hidden 이고, 보조기기에는 &quot;(필수)&quot; 문구를
                        줍니다([5.3.1]).
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="file-upload-result" className="flex flex-col gap-4">
                <div>
                    <h2 id="file-upload-result" className="typo-h4-bold">
                        업로드 결과 — FileUploadSuccess / FileUploadError
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        FileUploadSuccess와 FileUploadError는 대량정보 조회 신청 전용 업로드에서 사용합니다. 로컬 검사와
                        신청 후 서버 검증을 성공·실패 두 결과로 통일하되, 공통 FileUpload를 사용하는 다른 화면에는
                        적용하지 않습니다. 서버의 파일 용량·데이터 건수·오류 상세는 화면이 넘깁니다.
                    </p>
                </div>
                <FormCard title="평가내역조회 필수 양식">
                    <FileUploadResultDemo />
                </FormCard>
                <CodeBlock code={RESULT_CODE} language="tsx" copyLabel="복사" />
                <PropsTable items={RESULT_PROPS_ITEMS} caption="FileUploadSuccess / FileUploadError Props 목록" />
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        성공은 <code className="font-mono">role=&quot;status&quot;</code>, 오류는{' '}
                        <code className="font-mono">role=&quot;alert&quot;</code>로 알립니다 — 오류는 바로 고쳐야 하는
                        내용이라 즉시 전달합니다([7.4.2] · [8.2.1]).
                    </li>
                    <li>
                        원형 표식은 장식이라 뜻은 제목 문구가 전달합니다 — 색만으로 성공·오류를 가르지
                        않습니다([5.3.1]).
                    </li>
                    <li>
                        <strong className="text-foreground">오류는 두 갈래이고 섞지 않습니다.</strong> 제목 아래 설명
                        자리에 들어갈 말이 서로 다릅니다.
                        <ul className="mt-2 flex list-[circle] flex-col gap-1 pl-5">
                            <li>
                                <strong className="text-foreground">첨부 정책 위반</strong>(파일 종류 · 용량 · 개수) —
                                목록 없이 설명 줄에 그 사유를 적습니다. 예: 제목 &quot;문제가 발견되었어요&quot; · 설명
                                &quot;XLSX, XLS, CSV 파일만 첨부할 수 있습니다.&quot;
                            </li>
                            <li>
                                <strong className="text-foreground">표준 양식 포맷 위반</strong>(행 · 열 단위 검증 실패)
                                — <code className="font-mono">details</code>에 위치와 사유를 넘기고, 설명은 목록을
                                가리키는 기본 문구 &quot;아래 오류를 수정한 후 다시 업로드해 주세요.&quot;를 그대로
                                씁니다. 제목은 &quot;N건의 문제가 발견되었어요&quot;(숫자만 강조)입니다.
                            </li>
                        </ul>
                        파일 종류가 틀린 파일에 행·열 오류를 함께 보여 주면 무엇을 고쳐야 할지 어긋납니다.
                    </li>
                    <li>
                        표준 양식 포맷 위반은 아직 화면에서 재현할 수 없어{' '}
                        <code className="font-mono">hasFormatError</code> 스위치로 확인합니다 — 켜면 고른 파일에 시안
                        문구(3행 · 5행 F9열) 목록이 붙은 오류 결과가 나옵니다. 검증 API 가 붙으면 이 스위치 대신 실제
                        결과를 <code className="font-mono">result</code>로 넘깁니다.
                    </li>
                    <li>
                        <code className="font-mono">downloadHref</code>·<code className="font-mono">onReupload</code>를
                        주지 않으면 해당 버튼을 두지 않습니다 — 아직 연결할 경로나 동작이 없을 때 빈 버튼을 남기지
                        않습니다.
                    </li>
                    <li>
                        두 결과 컴포넌트는 대량정보 조회 신청 경로의 전용 업로드 컴포넌트에서 조합합니다. 공통{' '}
                        <code className="font-mono">FileUpload</code>에 결과 전환 옵션을 추가하지 않습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="file-upload-state" className="flex flex-col gap-4">
                <div>
                    <h2 id="file-upload-state" className="typo-h4-bold">
                        공통 FileUpload 상태
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        공통 FileUpload는 기존처럼 하나의 상자가 선택 여부에 따라 모양을 바꿉니다. 아래 상태는
                        FileUploadSuccess·FileUploadError와 별개이며 기존 사용 화면에 그대로 유지됩니다.
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max border-collapse text-left">
                        <caption className="sr-only">파일 선택 여부에 따른 상자의 상태</caption>
                        <thead>
                            <tr className="border-subtle-3 border-b">
                                <th scope="col" className="typo-body-l-bold text-foreground py-3 pr-6">
                                    상태
                                </th>
                                <th scope="col" className="typo-body-l-bold text-foreground py-3 pr-6">
                                    면·테두리
                                </th>
                                <th scope="col" className="typo-body-l-bold text-foreground py-3">
                                    내용
                                </th>
                            </tr>
                        </thead>
                        <tbody className="typo-body-l-regular text-muted-foreground">
                            <tr className="border-subtle-3 border-b">
                                <th scope="row" className="typo-body-l-regular text-foreground py-3 pr-6 font-normal">
                                    비어 있음
                                </th>
                                <td className="py-3 pr-6">bg-surface · border-control</td>
                                <td className="py-3">안내 문구 + 보조 문구 + [파일선택] 버튼</td>
                            </tr>
                            <tr className="border-subtle-3 border-b">
                                <th scope="row" className="typo-body-l-regular text-foreground py-3 pr-6 font-normal">
                                    끌어다 놓는 중
                                </th>
                                <td className="py-3 pr-6">bg-file-upload-complete · border-primary</td>
                                <td className="py-3">비어 있음과 같음(면 색만 바뀜)</td>
                            </tr>
                            <tr>
                                <th scope="row" className="typo-body-l-regular text-foreground py-3 pr-6 font-normal">
                                    업로드 완료
                                </th>
                                <td className="py-3 pr-6">
                                    bg-file-upload-complete · border-file-upload-complete-border
                                </td>
                                <td className="py-3">완료 표식 + 완료 문구 + 첨부된 파일 한 줄(삭제 버튼)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="file-upload-policy" className="flex flex-col gap-4">
                <div>
                    <h2 id="file-upload-policy" className="typo-h4-bold">
                        첨부 정책 — 확장자 · 용량 · 개수
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        브라우저의 <code className="font-mono">accept</code>는 파일 선택창의 필터일 뿐이라 끌어다 놓기나
                        &quot;모든 파일&quot;로 고른 경우를 막지 못합니다. 그래서 고른 뒤에 한 번 더 봅니다 — 걸린
                        파일은 값으로 남기지 않고 상자 아래에 이유를 띄웁니다.
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max border-collapse text-left">
                        <caption className="sr-only">첨부 정책과 걸렸을 때의 안내</caption>
                        <thead>
                            <tr className="border-subtle-3 border-b">
                                <th scope="col" className="typo-body-l-bold text-foreground py-3 pr-6">
                                    검사
                                </th>
                                <th scope="col" className="typo-body-l-bold text-foreground py-3 pr-6">
                                    기준
                                </th>
                                <th scope="col" className="typo-body-l-bold text-foreground py-3">
                                    걸렸을 때 문구
                                </th>
                            </tr>
                        </thead>
                        <tbody className="typo-body-l-regular text-muted-foreground">
                            <tr className="border-subtle-3 border-b">
                                <th scope="row" className="typo-body-l-regular text-foreground py-3 pr-6 font-normal">
                                    확장자
                                </th>
                                <td className="py-3 pr-6">accept 에 적은 확장자 목록</td>
                                <td className="py-3">PDF, ZIP, RAR, 7Z 파일만 첨부할 수 있습니다.</td>
                            </tr>
                            <tr className="border-subtle-3 border-b">
                                <th scope="row" className="typo-body-l-regular text-foreground py-3 pr-6 font-normal">
                                    용량
                                </th>
                                <td className="py-3 pr-6">maxSizeMb (파일당)</td>
                                <td className="py-3">파일 용량은 50MB 이하만 첨부할 수 있습니다.</td>
                            </tr>
                            <tr>
                                <th scope="row" className="typo-body-l-regular text-foreground py-3 pr-6 font-normal">
                                    개수
                                </th>
                                <td className="py-3 pr-6">항상 1개</td>
                                <td className="py-3">파일은 1개만 첨부할 수 있습니다.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        확장자 문구는 <code className="font-mono">accept</code>에서 그대로 만듭니다 — 목록을 바꾸면
                        안내도 함께 바뀝니다.
                    </li>
                    <li>
                        zip · rar · 7z 는 브라우저·OS 마다 MIME 이 달라 MIME 만으로 거를 수 없습니다. accept 에 확장자(
                        <code className="font-mono">.zip</code> 형태)로 적습니다.
                    </li>
                    <li>이 검사는 화면 단의 1차 방어입니다 — 실제 제한은 서버에서 다시 확인해야 합니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="file-upload-submit" className="flex flex-col gap-4">
                <div>
                    <h2 id="file-upload-submit" className="typo-h4-bold">
                        서버 전송·검사
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        선택한 파일은 숨은 <code className="font-mono">input[type=file]</code>이 들고 있습니다. 끌어다
                        놓은 파일도 같은 input 에 넣으므로 두 방법 모두 FormData 에 그대로 실립니다.
                    </p>
                </div>
                <CodeBlock code={SUBMIT_CODE} language="tsx" copyLabel="복사" />
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>파일 한 개만 받습니다. 여러 개가 필요하면 이 컴포넌트를 여러 번 놓습니다.</li>
                    <li>
                        업로드 API 는 붙어 있지 않습니다 — 화면 상태만 바꾸므로, 연동할 때 폼 제출 쪽에서 파일을
                        보냅니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="file-upload-a11y" className="flex flex-col gap-4">
                <div>
                    <h2 id="file-upload-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        끌어다 놓기는 마우스 전용 보조 수단이고, 같은 일을 [파일선택] 버튼으로 키보드만으로도 할 수
                        있습니다([6.1.1]).
                    </li>
                    <li>
                        input 은 <code className="font-mono">hidden</code> 이라 포커스를 받지 않습니다 — 접근 이름은
                        버튼이 갖고 input 은 값을 담는 그릇입니다. 같은 동작이 두 번 읽히지 않습니다.
                    </li>
                    <li>
                        업로드 결과는 화면 일부만 바뀌므로 <code className="font-mono">role=&quot;status&quot;</code>로
                        알립니다([8.2.1]).
                    </li>
                    <li>삭제 버튼을 누르면 포커스가 사라지지 않도록 다시 나타난 [파일선택] 버튼으로 옮깁니다.</li>
                    <li>
                        완료 표식은 장식이라 <code className="font-mono">aria-hidden</code> 이고, 뜻은 옆 문구가
                        전달합니다([5.1.1] · [5.3.1]).
                    </li>
                    <li>
                        <code className="font-mono">error</code>를 주면 안내 문구를 버튼의{' '}
                        <code className="font-mono">aria-describedby</code>로 잇고{' '}
                        <code className="font-mono">aria-invalid</code>를 답니다([7.4.2]).
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="file-upload-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="file-upload-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">FileUpload 에 전달하는 속성입니다.</p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="FileUpload Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FileUploadGuidePage
