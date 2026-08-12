'use client'

import {useEffect, useRef, useState, type SubmitEvent} from 'react'
import {useFormValues} from '@/components/composite/form-values'

// FormTabs 폼의 제출 관문 — 먼저 검사하고, 모두 통과했을 때만 값을 넘긴다.
//
// 화면마다 통과한 뒤 하는 일이 다르다(가이드는 값을 화면에 그리고, 실제 화면은 다음 단계로 넘긴다).
// 그래서 "검사 → 메시지 표시 → 걸린 칸으로 이동" 까지만 여기서 맡고, 그 다음은 onValid 로 넘긴다.
//
// 검사 기준은 화면에 적어 둔 required · type="email" · DatePicker 의 max 다 — 규칙을 따로 만들지 않는다.

// 검사에 걸린 칸 하나. 메시지는 그 칸 밑에 Field 가 그리므로 여기서는 어디에 붙일지(focusId)와
// 어느 탭인지(section)만 알면 된다 — 안 보이는 탭에 걸렸으면 탭부터 바꿔야 하기 때문이다.
type FieldError = {message: string; focusId: string; section?: string}

const isFormControl = (element: Element): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement

// 값 전달용으로만 존재하는 숨은 입력(Select 의 native select · DatePicker 의 date input) 대신
// 사용자가 실제로 조작하는 컨트롤을 가리킨다. 숨은 입력에 포커스를 주면 아무 데도 가지 않는다.
const getFocusTarget = (control: HTMLElement) => {
    if (control.tabIndex >= 0 && !control.closest('[aria-hidden="true"]')) return control

    const sibling = control.parentElement?.querySelector<HTMLElement>(
        '[data-slot="select-trigger"], [data-slot="input-group-control"]',
    )
    if (sibling) return sibling

    // 라디오는 값을 나르는 input 이 하나씩 숨어 있고 id 도 없다 — 메시지도 포커스도 묶음 단위다.
    return control.closest<HTMLElement>('[role="radiogroup"]') ?? control
}

// 메시지 문구 — 브라우저 기본 문구("이 입력란을 작성하세요.")는 어느 칸인지 알려 주지 않고 브라우저마다
// 다르다. 라벨을 넣어 "무엇을 어떻게" 가 한 문장에 드러나게 다시 쓴다[7.4.2].
// 컴포넌트 가이드의 오류 예시("담당자명을 입력해 주세요.")와 같은 말투다.

// 라벨 문구만 뽑는다 — 필수 표시(* · "(필수)")는 뒤에 붙는 별도 요소라 첫 텍스트 노드만 읽으면 된다.
const getLabelText = (form: HTMLFormElement, id: string) =>
    (id ? form.querySelector(`label[for="${CSS.escape(id)}"]`)?.firstChild?.textContent : null)?.trim() ?? ''

// 목적격 조사 — 읽었을 때 받침이 있으면 '을', 없으면 '를'.
// 한글 음절은 0xAC00 부터 28개 종성 단위로 배열돼 있어 나머지가 0 이면 받침이 없다.
// 영문·숫자로 끝나는 이름("평가기술 IPC")은 읽는 소리로 판단한다 — L(엘)·M(엠)·N(엔)·R(알)·Z(제트)와
// 0(영)·1(일)·3(삼)·6(육)·7(칠)·8(팔)만 받침이 있다.
// "설립일(개업일)" 처럼 괄호로 끝나면 그 안의 마지막 글자를 본다.
const HANGUL_START = 0xac00
const HANGUL_END = 0xd7a3
const JONGSEONG_COUNT = 28
const FINAL_CONSONANT_LETTERS = 'LMNRZ'
const FINAL_CONSONANT_DIGITS = '013678'

const hasFinalConsonant = (char: string) => {
    const code = char.charCodeAt(0)
    if (code >= HANGUL_START && code <= HANGUL_END) return (code - HANGUL_START) % JONGSEONG_COUNT !== 0
    if (/[a-z]/i.test(char)) return FINAL_CONSONANT_LETTERS.includes(char.toUpperCase())
    if (/[0-9]/.test(char)) return FINAL_CONSONANT_DIGITS.includes(char)

    return null
}

const withObjectParticle = (word: string) => {
    // 뒤에서부터 읽을 수 있는 글자를 찾는다 — 괄호·따옴표 같은 기호는 소리가 없다.
    const spoken = [...word]
        .reverse()
        .map(hasFinalConsonant)
        .find((result) => result !== null)
    if (spoken === undefined) return `${word}을(를)`

    return `${word}${spoken ? '을' : '를'}`
}

// 고르는 칸인지 쓰는 칸인지 — "선택해 주세요" 와 "입력해 주세요" 가 갈린다.
const CHOICE_INPUT_TYPES = ['date', 'radio', 'checkbox']

const isChoiceControl = (control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) =>
    control instanceof HTMLSelectElement || CHOICE_INPUT_TYPES.includes(control.type)

// 읽기 전용 칸은 브라우저 기본 검사에서 빠진다(willValidate 가 false — 직접 입력하는 칸이 아니라서다).
// 그런데 업종코드처럼 [조회] 버튼으로 반드시 채워야 하는 필수 칸이 있어, 그 경우만 직접 본다.
const getLookupMessage = (control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, label: string) => {
    if (control instanceof HTMLSelectElement || !control.readOnly || !control.required || control.value) return null
    // 같은 칸에 붙어 있는 버튼 이름을 그대로 쓴다 — "[조회] 버튼으로 자동 입력됩니다" 안내와 말이 맞는다.
    const action = control.parentElement?.querySelector('button')?.textContent?.trim()
    if (!label) return action ? `[${action}] 버튼으로 입력해 주세요.` : '필수 입력 항목입니다.'

    return action
        ? `${withObjectParticle(label)} [${action}] 버튼으로 입력해 주세요.`
        : `${withObjectParticle(label)} 입력해 주세요.`
}

// 검사 기준은 화면에 적어 둔 required · type="email" · DatePicker 의 max 다 — 규칙을 따로 만들지 않는다.
// 자주 나오는 두 가지만 문구를 다시 쓰고, 나머지는 브라우저 문구를 그대로 둔다(잘못 옮기는 것보다 낫다).
const getValidationMessage = (control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, label: string) => {
    if (!control.willValidate) return getLookupMessage(control, label)
    if (control.checkValidity()) return null

    const {validity} = control
    if (validity.valueMissing && label) {
        return `${withObjectParticle(label)} ${isChoiceControl(control) ? '선택' : '입력'}해 주세요.`
    }
    if (validity.typeMismatch && control.type === 'email')
        return '이메일 형식이 올바르지 않습니다. (예: user@example.com)'
    // 형식(pattern)이 어긋난 칸 — 무엇을 어떻게 적어야 하는지는 칸마다 다르다. 브라우저 기본 문구는
    // "요청한 형식과 일치시키세요" 라 도움이 되지 않으므로, 칸이 적어 둔 안내(data-pattern-message)를 쓴다.
    if (validity.patternMismatch && control.dataset.patternMessage) return control.dataset.patternMessage
    if (validity.rangeOverflow && control.type === 'date') return '오늘 이후 날짜는 선택할 수 없습니다.'

    return control.validationMessage
}

const getFieldErrors = (form: HTMLFormElement, getSection: (name: string) => string | undefined): FieldError[] =>
    [...form.elements].filter(isFormControl).flatMap((control) => {
        // 이름도 라벨도 보이는 컨트롤에 걸려 있다 — 숨은 입력(Select·DatePicker·라디오)은 그쪽에서 찾는다.
        // 구획 제목이 곧 이름인 칸(평가기술명·라디오 묶음)은 라벨 요소가 없어 aria-label 을 쓴다.
        const target = getFocusTarget(control)
        const label = getLabelText(form, target.id) || target.getAttribute('aria-label') || ''
        const message = getValidationMessage(control, label)
        if (!message) return []

        return [{message, focusId: target.id, section: getSection(control.name)}]
    })

type FormTabsSubmitOptions = {
    /** 처음 열어 둘 탭. 검사에 걸린 칸이 다른 탭에 있으면 이 값이 그 탭으로 바뀐다. */
    defaultTab: string
}

const useFormTabsSubmit = ({defaultTab}: FormTabsSubmitOptions) => {
    const {fields, setFieldErrors} = useFormValues()
    // 검사에 걸린 칸으로 이동하려면 보고 있는 탭을 바꿔야 해서 선택 값을 여기서 들고 있는다.
    const [currentTab, setCurrentTab] = useState(defaultTab)
    // 첫 번째로 걸린 칸으로 포커스를 옮긴다. 그 칸은 아직 화면에 없을 수 있어(다른 탭·메시지가 방금 생김)
    // 값으로 적어 두고 화면에 그려진 다음(커밋 후)에 옮긴다.
    const pendingFocusId = useRef<string | null>(null)

    useEffect(() => {
        const focusId = pendingFocusId.current
        if (!focusId) return

        pendingFocusId.current = null
        const target = document.getElementById(focusId)
        // 화면 가운데로 옮긴 뒤 포커스한다 — 브라우저 기본 스크롤은 칸을 화면 가장자리에 딱 붙여 놓아,
        // 모바일의 고정 헤더에 가리거나 바로 밑의 오류 메시지가 잘려 보인다.
        // 동작을 줄이도록 설정한 사용자에게는 즉시 이동한다[6.3.1].
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target?.scrollIntoView({block: 'center', behavior: prefersReducedMotion ? 'auto' : 'smooth'})
        target?.focus({preventScroll: true})
    })

    // onValid — 검사를 모두 통과했을 때 모인 값(FormData 그대로)을 받는다.
    // 걸린 칸이 있으면 부르지 않는다.
    const handleSubmit = (event: SubmitEvent<HTMLFormElement>, onValid: (values: Record<string, string>) => void) => {
        event.preventDefault()
        const form = event.currentTarget
        const found = getFieldErrors(form, (name) => fields.getSnapshot().get(name)?.section)
        // 메시지는 각 칸 밑에 Field 가 그린다 — 여기서는 "어느 칸에 무슨 메시지" 만 넘긴다.
        setFieldErrors(Object.fromEntries(found.map((error) => [error.focusId, error.message])))

        if (found.length) {
            const [first] = found
            // 걸린 칸이 다른 탭에 있으면 그 탭을 먼저 연다 — 안 보이는 곳의 메시지는 없는 것과 같다.
            if (first.section && first.section !== currentTab) setCurrentTab(first.section)
            pendingFocusId.current = first.focusId

            return false
        }

        // FormData 의 값은 문자열 또는 File 이라, 문자열만 골라 넘긴다(이 폼엔 파일 입력이 없다).
        // 수량·금액 칸의 0 은 여기서 채우지 않는다 — 화면이 열릴 때부터 값이 0 이다(company-etc-form).
        const entries = [...new FormData(form).entries()].filter(
            (entry): entry is [string, string] => typeof entry[1] === 'string',
        )
        onValid(Object.fromEntries(entries))

        return true
    }

    return {currentTab, setCurrentTab, handleSubmit}
}

export {useFormTabsSubmit}
