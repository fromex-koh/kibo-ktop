'use client'

import {useId, useRef, useState, type ChangeEvent, type ComponentPropsWithoutRef, type KeyboardEvent} from 'react'
import {Search, X} from 'lucide-react'
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from '@/components/ui/input-group'
import {cn} from '@/lib/utils'

// 검색 바(SearchBar) — 텍스트 입력 + 원형 검색 버튼을 조립한 L2 composite. Figma "text_input"(검색창) 반영.
// shadcn 에 이 조합(인풋+addon 버튼)을 위한 프리미티브 InputGroup 이 있어([SC-03]), 새로 만들지 않고
// kit/InputGroup(승격) 위에 조립했다. 폭은 Figma 실측 그대로 max-w-147(=588px, spacingBase 4px 배수 — [PB-13]).
//
// PROJECT-STYLE: 컨테이너는 InputGroup의 control/surface/field-disabled 토큰을 따르고,
// 검색 버튼은 kit/Button default/icon 스타일을 그대로 사용한다. placeholder도 Input 기본 text-placeholder를 공유한다.
//
// 지우기(X) 버튼 — type="search" 의 네이티브 X 버튼은 브라우저마다 모양·클릭 영역이 다르고 Firefox 는
// 아예 안 그려지며, 무엇보다 키보드로 포커스가 안 가([6.1.1] 위반). globals.css 에서 네이티브 버튼 자체를
// 지우고(WebKit 전용 ::-webkit-search-cancel-button), 대신 kit Button(진짜 <button>이라 Tab 포커스·Enter/Space
// 모두 기본 지원)으로 만든 X 를 넣어 모든 브라우저에서 모양·동작이 동일하다. variant="ghost"(채움·테두리
// 없는 아이콘 버튼) + rounded-full(pill) + 아웃라인 X 글리프로, 파란 solid 검색 버튼과 강조를 구분한다.
// 입력값이 있을 때만 보이고, 누르면 값을 비우고 입력창에 포커스를 되돌린다. controlled(value+onChange)든
// uncontrolled 든 똑같이 동작해야 해서, 값을 직접 지울 때 React 의 값 추적을 우회하지 않도록 네이티브
// input value setter 로 값을 바꾼 뒤 input 이벤트를 발생시킨다(radix 의 RadioBubbleInput 이 checked 를
// 바꿀 때 쓰는 것과 같은 기법) — 그래야 controlled 인풋도 부모의 onChange 가 정상적으로 실행된다.
//
// onSearch 는 검색 버튼 클릭과 입력창 Enter 둘 다에서 호출된다 — <form> 으로 감싸지 않아도 동작한다.
// disabled 는 입력뿐 아니라 버튼(지우기·검색)에도 함께 넘긴다 — 인풋만 막으면 버튼은 여전히 클릭 가능해
// 상태가 어긋난다.
//
// label 은 필수다 — placeholder 는 레이블을 대체하지 못한다([7.4.1] MUST). 사용처가 aria-label 을 깜빡
// 넘기면 스크린리더가 이 입력창의 용도를 전혀 알릴 수 없으므로, 타입 레벨에서 강제하고 실제 <label htmlFor>
// 로 연결한다(불가피한 예외가 아니라 연결 가능한 경우라 aria-label 대신 진짜 label 을 우선한다, [7.4.1]).
// 화면에 보이는 텍스트(placeholder)와 중복되므로 sr-only 로 시각적으로만 숨긴다.
// id 는 넘기지 않으면 useId() 로 자동 생성 — 인풋에 id 가 없으면 브라우저가 자동완성 추론을 못 하고
// (Chrome DevTools "A form field element should have an id or name attribute") label 과도 연결할 수 없다.
type SearchBarProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'> & {
    // 스크린리더용 필드 이름(시각적으로는 sr-only 로 숨김, placeholder 와 별개로 항상 필요).
    label: string
    onSearch?: (value: string) => void
    // 검색 버튼의 접근성 라벨(아이콘 전용 버튼이라 필수, [5.1.1]).
    searchLabel?: string
    // 지우기 버튼의 접근성 라벨(아이콘 전용 버튼이라 필수, [5.1.1]).
    clearLabel?: string
}

const SearchBar = ({
    id,
    label,
    className,
    onSearch,
    searchLabel = '검색',
    clearLabel = '입력 지우기',
    onKeyDown,
    onChange,
    disabled,
    value,
    defaultValue,
    ...props
}: SearchBarProps) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const inputRef = useRef<HTMLInputElement>(null)
    // 지우기 버튼 표시 여부만 담당하는 값 — controlled 인풋이면 value prop 을 그대로 참조하고(부모가 값을
    // 바꿔도 항상 최신), uncontrolled 일 때만 이 state 로 직접 추적한다.
    const [uncontrolledHasValue, setUncontrolledHasValue] = useState(() => Boolean(defaultValue))
    const hasValue = value !== undefined ? Boolean(value) : uncontrolledHasValue

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event)
        if (event.key === 'Enter') onSearch?.(event.currentTarget.value)
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUncontrolledHasValue(event.currentTarget.value.length > 0)
        onChange?.(event)
    }

    const handleClear = () => {
        const input = inputRef.current
        if (!input) return
        const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
        nativeValueSetter?.call(input, '')
        input.dispatchEvent(new Event('input', {bubbles: true}))
        setUncontrolledHasValue(false)
        input.focus()
    }

    return (
        <>
            <label htmlFor={inputId} className="sr-only">
                {label}
            </label>
            <InputGroup
                className={cn(
                    'h-auto max-w-147 gap-6 rounded-full py-3 pr-3 pl-8',
                    'has-disabled:bg-field-disabled has-disabled:opacity-100',
                    className,
                )}
            >
                <InputGroupInput
                    ref={inputRef}
                    id={inputId}
                    type="search"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    value={value}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    {...props}
                />
                <InputGroupAddon align="inline-end" className="gap-1 p-0">
                    {hasValue && !disabled ? (
                        <InputGroupButton
                            variant="ghost"
                            size="icon-sm"
                            className="rounded-full"
                            aria-label={clearLabel}
                            onClick={handleClear}
                        >
                            <X aria-hidden="true" />
                        </InputGroupButton>
                    ) : null}
                    <InputGroupButton
                        variant="default"
                        size="icon-sm"
                        className="size-control-h-md min-h-11 min-w-11 rounded-full"
                        aria-label={searchLabel}
                        disabled={disabled}
                        onClick={() => onSearch?.(inputRef.current?.value ?? '')}
                    >
                        <Search aria-hidden="true" />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </>
    )
}

export {SearchBar}

export type {SearchBarProps}
