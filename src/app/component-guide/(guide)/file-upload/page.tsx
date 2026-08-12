import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {FileUpload} from '@/components/composite/file-upload'
import {FormCard} from '@/components/composite/form-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '파일 업로드 (FileUpload)'}

const USAGE_CODE = `<FormCard title="정보이용동의서 업로드">
  <FileUpload
    name="informationConsentFile"
    accept=".pdf,.zip,.rar,.7z"
    maxSizeMb={50}
    hint="PDF, ZIP, RAR, 7Z 파일 1개 첨부 가능 (파일당 최대 50MB)"
  />
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
const FileUploadGuidePage = () => (
    <GuidePageShell
        title="파일 업로드 (FileUpload)"
        description="파일 한 개를 첨부받는 영역입니다. 비어 있을 때는 안내 문구와 [파일선택] 버튼을, 파일을 고르면 완료 표식과 첨부된 파일 한 줄을 보여 줍니다. 실제 업로드는 하지 않고 선택된 파일을 폼에 담기만 합니다."
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
            <section aria-labelledby="file-upload-state" className="flex flex-col gap-4">
                <div>
                    <h2 id="file-upload-state" className="typo-h4-bold">
                        두 상태
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        하나의 상자가 선택 여부에 따라 모양을 바꿉니다 — 두 컴포넌트를 번갈아 쓰지 않습니다.
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
