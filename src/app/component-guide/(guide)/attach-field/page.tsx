// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
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
    ['AttachField', 'label', '첨부 자리의 이름. 상자 위에 놓입니다.', '—', 'ReactNode'],
    ['AttachField', 'name', '폼에 담길 이름. 이 이름으로 고른 파일이 제출됩니다.', '—', 'string'],
    [
        'AttachField',
        'accept · maxSizeMb',
        '첨부 정책. 확장자 · 용량에 걸리면 첨부하지 않고 상자 아래에 이유를 띄웁니다.',
        'undefined',
        'string · number',
    ],
    ['AttachField', 'required', '필수 여부. 레이블에 * 를 붙이고 입력에도 전달합니다.', 'false', 'boolean'],
    ['AttachField', 'helper', '상자 아래 보조 안내(예: 압축 업로드 안내).', 'undefined', 'ReactNode'],
    [
        'AttachField',
        'onFileChange',
        '파일을 고르거나 지웠을 때 호출됩니다. 정책에 걸린 파일은 null 로 옵니다.',
        'undefined',
        '(file: File | null) => void',
    ],
    ['AttachField', 'error', '제출 검사에서 걸린 안내 문구. 상자 아래에 붙습니다.', 'undefined', 'string'],
    ['AttachField', 'className', '바깥 상자에 덧붙일 클래스.', 'undefined', 'string'],
] as const

const CHOICE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'shape', header: '모양', align: 'start', wrap: true},
    {key: 'use', header: '쓰는 곳', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'attach',
        cells: [<code key="component">AttachField</code>, '레이블 + 낮은 한 줄 칸', '서류 여러 개를 나란히 받는 화면'],
    },
    {
        key: 'upload',
        cells: [
            <Link
                key="component"
                href="/component-guide/file-upload"
                className="text-primary-strong underline underline-offset-4"
            >
                FileUpload
            </Link>,
            '끌어다 놓는 큰 상자',
            '파일 하나를 받는 일반 화면',
        ],
    },
] as const

const AttachFieldGuidePage = () => (
    <GuidePageShell
        title="첨부 필드 (AttachField)"
        description="서류 여러 개를 나란히 받는 화면의 한 줄짜리 파일 첨부 칸입니다."
    >
        <BaseCard>
            <section aria-labelledby="attach-field-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="attach-field-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        [파일선택]으로 파일을 고르면 파일명과 삭제 버튼으로 바뀝니다. 한 칸에 파일 하나를 받고, 실제
                        업로드는 폼 제출 때 합니다. 확장자(<code>accept</code>)와 용량(<code>maxSizeMb</code>)에 걸린
                        파일은 첨부하지 않고 칸 아래에 이유를 띄웁니다.
                    </p>
                </div>
                <AttachFieldDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="attach-field-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="attach-field-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        둘 다 파일 첨부이며 화면에 놓이는 개수와 모양으로 고릅니다.
                    </p>
                </div>
                <Table caption="AttachField 와 FileUpload 구분" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="attach-field-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="attach-field-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아래는 컴포넌트가 처리하므로 사용처에서 따로 넣지 않습니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        칸마다 레이블이 <code>role=&quot;group&quot;</code> 의 이름으로 이어져, 첨부 칸이 여럿이어도
                        [파일선택] 버튼이 어느 서류의 것인지 구분됩니다[7.4.1]. 필수 표시는 &quot;(필수)&quot; 문구로
                        읽힙니다[5.3.1].
                    </li>
                    <li>
                        첨부 결과는 <code>role=&quot;status&quot;</code> 로 알리고, 삭제하면 포커스가 [파일선택]
                        버튼으로 돌아갑니다[8.2.1 · 6.1.2].
                    </li>
                    <li>
                        <code>error</code> 를 주면 문구가 버튼의 <code>aria-describedby</code> 로 이어지고{' '}
                        <code>aria-invalid</code> 가 걸립니다[7.4.2].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="attach-field-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="attach-field-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="AttachField Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default AttachFieldGuidePage
