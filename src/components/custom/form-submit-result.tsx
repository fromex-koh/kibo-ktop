'use client'

import {useState, type ComponentType} from 'react'
import {Braces, RotateCcw} from 'lucide-react'
import CodeBlock from '@/components/custom/code-block'
import {Button} from '@/components/ui/button'

// 컴포넌트 가이드의 "폼 제출" 데모가 함께 쓰는 조각 — 제출 결과 표시, 초기화 버튼, 초기화 동작.
// 가이드 전용이라 서비스 화면에서는 쓰지 않는다.

const JSON_INDENT = 2

/** 제출 값을 들여쓴 JSON 문자열로 바꾼다 — FormSubmitResult 가 코드 블록으로 그린다. */
const formatSubmitResult = (value: unknown) => JSON.stringify(value, null, JSON_INDENT)

const isJsonText = (text: string) => /^[[{]/.test(text)

type FormSubmitResultProps = {
    /** 제출 전에는 null. JSON 문자열이면 코드 블록으로, 그 밖의 문장(제출하지 못한 이유 등)이면 안내 글로 보여 준다. */
    data: string | null
    emptyMessage?: string
    emptyHint?: string
}

const FormSubmitResult = ({
    data,
    emptyMessage = '아직 제출하지 않았습니다.',
    emptyHint = '제출하면 값이 JSON 으로 표시됩니다.',
}: FormSubmitResultProps) => (
    <output aria-live="polite" className="block w-full">
        {data !== null && isJsonText(data) ? (
            <CodeBlock code={data} language="json" />
        ) : (
            // 결과가 들어올 자리임을 알리는 빈 상태 — 점선 상자로 "아직 비어 있음"을 드러낸다.
            <span className="border-foreground-subtle/40 bg-pastel-neutral/40 flex flex-col items-center gap-1 rounded-sm border border-dashed px-5 py-6 text-center">
                <Braces aria-hidden="true" className="text-foreground-subtle size-icon-lg" />
                <span className="typo-body-l-bold text-foreground">{data ?? emptyMessage}</span>
                {data === null ? <span className="typo-body-m-regular text-label-foreground">{emptyHint}</span> : null}
            </span>
        )}
    </output>
)

/** 제출 버튼 옆에 두는 초기화 버튼. form 의 onReset 에 withFormReset 이 준 onReset 을 연결해 쓴다. */
const FormResetButton = () => (
    <Button type="reset" variant="tertiary" size="icon-sm" aria-label="입력 내용 초기화">
        <RotateCcw aria-hidden="true" />
    </Button>
)

type FormResetProps = {
    /** form 의 onReset 에 넘긴다 — 데모를 처음 상태로 다시 만든다. */
    onReset: () => void
}

// 데모는 값 · 오류 · 결과를 각자 state 로 들고 있어 하나씩 되돌리기 번거롭다.
// 초기화할 때마다 key 를 바꿔 데모를 통째로 다시 만들면 모든 state 와 입력 컴포넌트가 처음 상태가 된다.
const withFormReset = <Props extends object>(Body: ComponentType<Props & FormResetProps>) => {
    const ResettableDemo = (props: Props) => {
        const [resetCount, setResetCount] = useState(0)

        return <Body key={resetCount} {...props} onReset={() => setResetCount((count) => count + 1)} />
    }

    return ResettableDemo
}

export {FormSubmitResult, FormResetButton, formatSubmitResult, withFormReset}
export type {FormResetProps}
