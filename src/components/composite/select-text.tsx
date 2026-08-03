import type {ComponentProps} from 'react'
import {ChevronDown} from 'lucide-react'
import {
    selectTextControlClassName,
    selectTextIconClassName,
    selectTextWrapperClassName,
} from '@/components/theme/select.variants'
import {cn} from '@/lib/utils'

type SelectTextOption = {value: string; label: string; disabled?: boolean}

// PROJECT-COMPOSITE: 시안 select_text — 면·테두리 없이 글자와 화살표만 두는 선택 컨트롤이다.
// 목록은 시스템 드롭다운이 그린다(네이티브 select). Radix 기반 Select 와 마크업·동작이 완전히 달라
// 같은 컴포넌트의 variant 로 두지 않고 분리했다 — 스타일만 theme/select.variants 에서 함께 관리한다.
//
// 열린 목록의 모양은 OS 가 정하므로 CSS 로 꾸밀 수 없다. 목록까지 시안대로 맞춰야 하면 Select(상자형/Radix)를 쓴다.
// 대신 모바일 네이티브 UI 와 키보드·스크린리더 대응을 브라우저 기본으로 얻는다([8.2.1]).
type SelectTextProps = Omit<ComponentProps<'select'>, 'size' | 'children'> & {
    options: SelectTextOption[]
    /** 시안 크기 3단 — lg 24/36 Bold · md 20/30 · sm 16/24 */
    size?: 'lg' | 'md' | 'sm'
    /** 값이 없을 때 첫 항목으로 넣는 안내 문구. 고르면 다시 선택할 수 없다(빈 값). */
    placeholder?: string
    /** 바깥 상자에 얹을 클래스 — select 요소에는 selectClassName 을 쓴다 */
    className?: string
    selectClassName?: string
}

const SelectText = ({options, size = 'lg', placeholder, className, selectClassName, ...props}: SelectTextProps) => (
    <span data-project-size={size} className={cn(selectTextWrapperClassName, className)}>
        <select className={cn(selectTextControlClassName, selectClassName)} {...props}>
            {placeholder ? (
                <option value="" disabled>
                    {placeholder}
                </option>
            ) : null}
            {options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                </option>
            ))}
        </select>
        <ChevronDown aria-hidden="true" className={selectTextIconClassName} />
    </span>
)

export {SelectText}
export type {SelectTextProps, SelectTextOption}
