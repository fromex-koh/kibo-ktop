import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {AttachFieldDemo} from './attach-field-demo'

export const metadata: Metadata = {title: '첨부 필드 (AttachField)'}

const USAGE_CODE = `<FormCard title="첨부파일" subtitle="평가 신청에 필요한 서류를 첨부해 주세요.">
  <div className="flex flex-col gap-10">
    <AttachField
      label="대표자 건강보험 자격 득실 확인서"
      name="ceoHealthInsuranceCertificate"
      required
      accept=".pdf,.zip,.rar,.7z"
      maxSizeMb={50}
      onFileChange={(file) => setFiles((prev) => ({...prev, ceoHealthInsuranceCertificate: file}))}
      error={isSubmitted && !files.ceoHealthInsuranceCertificate ? '파일을 첨부해 주세요.' : undefined}
    />
    <AttachField
      label="특허등록증"
      name="patentCertificate"
      required
      helper="※ 다수 특허의 경우 압축하여 업로드해 주세요."
    />
  </div>
</FormCard>`

const PROPS_ITEMS = [
    ['AttachField', 'label', '첨부 자리의 이름입니다. 상자 위에 놓이고 그룹의 접근 이름이 됩니다.', '—', 'ReactNode'],
    ['AttachField', 'name', '폼에 담길 이름입니다. 이 이름으로 선택된 File 이 전송됩니다.', '—', 'string'],
    [
        'AttachField',
        'accept · maxSizeMb',
        '첨부 정책입니다. 확장자·용량에 걸리면 파일을 값으로 남기지 않고 상자 아래에 이유를 띄웁니다.',
        'undefined',
        'string · number',
    ],
    [
        'AttachField',
        'required',
        '필수 여부입니다. 레이블에 * 를 붙이고 입력에도 그대로 전달합니다.',
        'false',
        'boolean',
    ],
    ['AttachField', 'helper', '상자 아래 보조 안내입니다. (예: 압축 업로드 안내)', 'undefined', 'ReactNode'],
    [
        'AttachField',
        'onFileChange',
        '파일을 고르거나 지웠을 때 알립니다. 정책에 걸린 파일은 null 로 옵니다.',
        'undefined',
        '(file: File | null) => void',
    ],
    [
        'AttachField',
        'error',
        '제출 검사에서 걸린 안내 문구입니다. 상자 아래에 띄우고 [파일선택] 버튼에 잇습니다.',
        'undefined',
        'string',
    ],
] as const

const AttachFieldGuidePage = () => (
    <GuidePageShell
        title="첨부 필드 (AttachField)"
        description="서류 여러 개를 나란히 받는 화면의 한 줄짜리 파일 첨부 칸입니다. 파일을 고르면 파일명과 삭제 버튼이 남고, 실제 업로드는 하지 않고 선택된 파일을 폼에 담기만 합니다."
    >
        <BaseCard>
            <section aria-labelledby="attach-field-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="attach-field-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        평가 신청하기 화면의 실제 구성입니다. [파일선택]으로 파일을 고르면 파일명 + 삭제로 바뀌고, 비운
                        채 [제출 검사]를 누르면 각 칸에 안내가 뜹니다.
                    </p>
                </div>
                <AttachFieldDemo />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="attach-field-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="attach-field-composition" className="typo-h4-bold">
                        Composition
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        끌어다 놓는 큰 첨부 상자(<code className="font-mono">FileUpload</code>)와 구분됩니다 — 서류
                        목록처럼 첨부 칸이 여러 개 쌓일 때 이 낮은 한 줄 칸을 씁니다. 값은 숨은{' '}
                        <code className="font-mono">input[type=file]</code>이 들고 있어 폼 제출에 그대로 실립니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="attach-field-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="attach-field-props" className="typo-h4-bold">
                        Props
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="AttachField Props 목록" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="attach-field-accessibility" className="flex flex-col gap-3">
                <h2 id="attach-field-accessibility" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground list-disc space-y-2 pl-6">
                    <li>
                        묶음은 <code className="font-mono">role=&quot;group&quot;</code>이고 레이블을{' '}
                        <code className="font-mono">aria-labelledby</code>로 잇습니다 — 첨부 칸이 여럿이라도
                        &quot;…확인서 (필수) 그룹 안의 파일선택 버튼&quot;으로 구분되어 읽힙니다([7.4.1]).
                    </li>
                    <li>
                        필수 표시 * 는 장식이라 aria-hidden 이고, 보조기기에는 &quot;(필수)&quot; 문구를
                        줍니다([5.3.1]).
                    </li>
                    <li>
                        첨부 결과는 화면 일부만 바뀌므로 <code className="font-mono">role=&quot;status&quot;</code>로
                        알립니다([8.2.1]).
                    </li>
                    <li>삭제 버튼을 누르면 포커스가 사라지지 않도록 [파일선택] 버튼으로 옮깁니다.</li>
                    <li>
                        <code className="font-mono">error</code>를 주면 안내 문구를 [파일선택] 버튼의{' '}
                        <code className="font-mono">aria-describedby</code>로 잇고{' '}
                        <code className="font-mono">aria-invalid</code>를 답니다([7.4.2]).
                    </li>
                </ul>
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default AttachFieldGuidePage
