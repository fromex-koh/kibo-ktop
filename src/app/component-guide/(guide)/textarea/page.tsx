import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'

export const metadata: Metadata = {title: '텍스트에어리어 (Textarea)'}

const USAGE_CODE = `<div className="flex w-full max-w-90 flex-col gap-2">
  <Label htmlFor="msg" className="gap-1 font-bold text-foreground">
    레이블
    <span aria-hidden="true" className="text-error-500">*</span>
    <span className="sr-only"> (필수)</span>
  </Label>
  <Textarea id="msg" required placeholder="내용을 입력하세요" aria-describedby="msg-hint" />
  {/* 힌트(왼쪽) + 글자수 카운터(오른쪽) */}
  <div className="flex justify-between gap-2">
    <p id="msg-hint" className="typo-caption-regular text-muted-foreground">
      메시지를 입력해 주세요
    </p>
    <span className="typo-body-m-regular shrink-0">
      <span className="text-info">80</span>
      <span className="text-foreground-subtle"> / 100</span>
    </span>
  </div>
</div>`

// label+textarea 를 감싸는 폼 필드 wrapper — Figma 폭 360 을 max-w-90(상한)으로.
const FIELD_CLASS = 'flex w-full max-w-90 flex-col gap-2'

const TextareaGuidePage = () => (
    <GuidePageShell
        title="텍스트에어리어 (Textarea)"
        description="shadcn Textarea 프리미티브입니다. Label 과 조합해 여러 줄 입력을 구성합니다."
    >
        <section aria-labelledby="textarea-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="textarea-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">Label</code> + <code className="font-mono">Textarea</code> 조합입니다.
                    필요하면 하단에 힌트(왼쪽)와 글자수 카운터(오른쪽)를{' '}
                    <code className="font-mono">flex justify-between</code> 으로 나란히 둡니다. 높이는 120px 고정이고(
                    <code className="font-mono">rows=4</code>), 손잡이 리사이즈는 막았습니다(
                    <code className="font-mono">resize-none</code>). 내용이 넘치면 스크롤됩니다.
                </p>
            </div>
            <div className={FIELD_CLASS}>
                <Label htmlFor="demo-msg" className="text-foreground gap-1 font-bold">
                    레이블
                    <span aria-hidden="true" className="text-error-500">
                        *
                    </span>
                    <span className="sr-only"> (필수)</span>
                </Label>
                <Textarea id="demo-msg" required placeholder="내용을 입력하세요" aria-describedby="demo-msg-hint" />
                <div className="flex justify-between gap-2">
                    <p id="demo-msg-hint" className="typo-caption-regular text-muted-foreground">
                        메시지를 입력해 주세요
                    </p>
                    <span className="typo-body-m-regular shrink-0">
                        <span className="text-info">80</span>
                        <span className="text-foreground-subtle"> / 100</span>
                    </span>
                </div>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="textarea-state" className="flex flex-col gap-4">
            <div>
                <h2 id="textarea-state" className="typo-h4-bold">
                    상태 (State)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    기본·값 입력됨·오류·비활성·읽기전용 상태입니다.{' '}
                    <span className="text-foreground font-medium">포커스</span> 시 점선 outline(
                    <code className="font-mono">outline-ring</code>)이 표시됩니다.
                </p>
            </div>
            <div className="flex flex-col gap-6">
                <div className={FIELD_CLASS}>
                    <Label htmlFor="st-default" className="text-foreground font-bold">
                        기본 (default)
                    </Label>
                    <Textarea id="st-default" placeholder="내용을 입력하세요" />
                </div>
                <div className={FIELD_CLASS}>
                    <Label htmlFor="st-completed" className="text-foreground font-bold">
                        값 입력됨 (completed)
                    </Label>
                    <Textarea id="st-completed" defaultValue="입력된 내용입니다." />
                </div>
                <div className={FIELD_CLASS}>
                    <Label htmlFor="st-error" className="text-foreground font-bold">
                        오류 (error)
                    </Label>
                    <Textarea
                        id="st-error"
                        placeholder="내용을 입력하세요"
                        aria-invalid="true"
                        aria-describedby="st-error-msg"
                    />
                    <p id="st-error-msg" role="alert" className="typo-caption-regular text-error-500">
                        필수 항목입니다.
                    </p>
                </div>
                <div className={FIELD_CLASS}>
                    <Label htmlFor="st-disabled" className="text-foreground font-bold">
                        비활성 (disabled)
                    </Label>
                    <Textarea id="st-disabled" defaultValue="비활성 입력 내용입니다." disabled />
                </div>
                <div className={FIELD_CLASS}>
                    <Label htmlFor="st-view" className="text-foreground font-bold">
                        읽기전용 (view)
                    </Label>
                    <Textarea id="st-view" defaultValue="수정 불가한 내용입니다." readOnly />
                </div>
            </div>
        </section>

        <section aria-labelledby="textarea-props" className="flex flex-col gap-4">
            <div>
                <h2 id="textarea-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Textarea(네이티브 textarea)에서 자주 쓰는 속성입니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Props 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Name
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Default
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Control
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            {
                                name: 'placeholder',
                                desc: '비어 있을 때 표시되는 안내 문구(레이블을 대체하지 않음).',
                                def: '-',
                                control: 'string',
                            },
                            {
                                name: 'rows',
                                desc: '기본 표시 줄 수. min-h-30(120px) 이 최소 높이라 그 이상만 유효합니다.',
                                def: '2',
                                control: 'number',
                            },
                            {
                                name: 'disabled',
                                desc: '비활성. 회색 배경 + 상호작용 차단.',
                                def: 'false',
                                control: 'boolean',
                            },
                            {
                                name: 'readOnly',
                                desc: '읽기전용(view). 회색 배경으로 값만 보여줍니다.',
                                def: 'false',
                                control: 'boolean',
                            },
                            {
                                name: 'aria-invalid',
                                desc: '오류 상태. 테두리가 error 색으로 바뀝니다(메시지는 aria-describedby 로 연결).',
                                def: '-',
                                control: 'boolean',
                            },
                            {
                                name: 'className',
                                desc: '추가 클래스명으로 스타일 확장.',
                                def: '""',
                                control: 'string',
                            },
                        ].map((prop) => (
                            <tr key={prop.name} className="border-border bg-background border-b last:border-b-0">
                                <th
                                    scope="row"
                                    className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal whitespace-nowrap"
                                >
                                    {prop.name}
                                </th>
                                <td className="typo-body-l-regular text-muted-foreground px-4 py-3">{prop.desc}</td>
                                <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                    {prop.def}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        {prop.control}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePageShell>
)

export default TextareaGuidePage
