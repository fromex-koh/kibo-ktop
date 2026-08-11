'use client'

import {useEffect, useId, useRef, useState} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {Input} from '@/components/ui/input'
import {cn} from '@/lib/utils'

// 이메일 입력(EmailField) — 아이디 · @ · 도메인 · 도메인 셀렉트로 나눠 받고, 서버에는 합친 값 하나를 보낸다.
// 셋으로 쪼개는 건 자주 쓰는 도메인의 오타를 막기 위한 입력 편의일 뿐이고 데이터는 이메일 한 개다.
//
// 셀렉트는 '값 선택기'가 아니라 도메인 칸의 모드 스위치다.
//  - 직접입력  : 도메인 칸을 비우고 편집 가능 상태로 두며 포커스를 옮긴다.
//  - 도메인 선택: 고른 값을 도메인 칸에 채우고 readOnly 로 잠근다.
// 값을 숨기지 않고 그대로 보여주는 이유 — 사용자가 최종 주소를 눈으로 확인할 수 있어야 한다.
//
// 잠금은 disabled 가 아니라 readOnly 다. disabled 는 값이 폼 전송에서 빠지고 포커스도 못 받아
// 스크린리더가 건너뛴다. 잠긴 표면색(bg-field-disabled)은 Input 의 read-only 스타일이 이미 갖고 있다.
//
// 전송은 hidden input 하나(name=email)로 한다. 아이디·도메인 두 칸에는 name 을 두지 않아 폼 데이터에
// 주소 조각이 섞이지 않는다 — 개발자는 UI 를 건드리지 않고 submit 만 붙이면 FormData 에 최종 주소가 들어 있다.
// 백엔드 스펙이 아이디·도메인을 따로 받는다면 그때 name 을 나눠 단다.
//
// 도메인 셀렉트만 name 을 갖는다. radix 는 폼 안에 있는 Select 마다 전송용 숨은 select 를 하나 만드는데,
// name 이 없으면 브라우저가 "id 도 name 도 없는 입력" 으로 보고 자동완성 대상에서 제외한다(DevTools 안내).
// 주소 조각이 아니라 '도메인 칸의 모드' 값이라 받는 쪽은 무시해도 된다.

// 도메인을 직접 입력하는 모드. 실제 도메인 값과 겹치지 않도록 도메인 형식이 아닌 값을 쓴다.
const DIRECT_INPUT = 'direct'

const DEFAULT_EMAIL_DOMAINS = ['naver.com', 'gmail.com', 'daum.net', 'hanmail.net', 'nate.com'] as const

type EmailFieldProps = {
    // 서버로 보낼 필드명. 이 이름으로 합친 주소 하나가 전송된다.
    name?: string
    // 필수 여부. 보이는 두 칸에 걸린다 — hidden input 은 브라우저 유효성 검사 대상이 아니다.
    // 셀렉트에 나열할 도메인 목록. '직접입력'은 항상 맨 앞에 자동으로 들어간다.
    domains?: readonly string[]
    defaultLocalPart?: string
    defaultDomain?: string
    required?: boolean
    className?: string
}

const EmailField = ({
    name = 'email',
    domains = DEFAULT_EMAIL_DOMAINS,
    defaultLocalPart = '',
    defaultDomain = '',
    required,
    className,
}: EmailFieldProps) => {
    const fieldId = useId()
    const fieldRef = useRef<HTMLDivElement>(null)
    const domainRef = useRef<HTMLInputElement>(null)
    const [localPart, setLocalPart] = useState(defaultLocalPart)
    const [domain, setDomain] = useState(defaultDomain)
    // 처음 값이 목록에 있는 도메인이면 그 항목을, 아니면 직접입력을 고른 상태로 시작한다.
    const [preset, setPreset] = useState(domains.includes(defaultDomain) ? defaultDomain : DIRECT_INPUT)

    const isDirectInput = preset === DIRECT_INPUT

    // 도메인은 대소문자를 가리지 않으므로 소문자로 맞춘다. 둘 중 하나라도 비면 'abc@'·'@naver.com' 같은
    // 반쪽 주소가 서버로 가지 않도록 빈 값으로 둔다.
    const trimmedLocalPart = localPart.trim()
    const trimmedDomain = domain.trim().toLowerCase()
    const email = trimmedLocalPart && trimmedDomain ? `${trimmedLocalPart}@${trimmedDomain}` : ''

    // 직접입력을 고른 '이번 닫힘'에만 포커스를 옮기려는 표시. 값 변경과 목록 닫힘이 따로 일어나서
    // 상태가 아니라 ref 로 넘긴다 — 값을 바꾸지 않고 Esc·바깥 클릭으로 닫은 경우까지 포커스를 가로채면 안 된다.
    const shouldFocusDomainRef = useRef(false)

    const handlePresetChange = (value: string) => {
        setPreset(value)
        // 직접입력으로 돌아오면 고른 값을 지운다 — 남아 있으면 그 위에 덧쓰려다 헷갈린다.
        setDomain(value === DIRECT_INPUT ? '' : value)
        shouldFocusDomainRef.current = value === DIRECT_INPUT
    }

    // 포커스는 목록이 닫히는 시점에 옮긴다. 값이 바뀌자마자 옮기면 뒤이어 radix 가 목록을 닫으며
    // 포커스를 트리거로 되돌려 놓아, 도메인 칸에 들어갔다가 바로 빠져나온다.
    // preventDefault 로 그 '트리거 복귀'를 막고 대신 도메인 칸으로 보낸다.
    const handleCloseAutoFocus = (event: Event) => {
        if (!shouldFocusDomainRef.current) return
        shouldFocusDomainRef.current = false
        event.preventDefault()
        domainRef.current?.focus()
    }

    useEffect(() => {
        const field = fieldRef.current
        if (!field) return

        // Radix가 옵션 등록 과정에서 native select를 교체하므로 새로 생성된 요소에도 이름을 다시 연결한다.
        const labelNativeSelect = () => {
            field
                .querySelectorAll<HTMLSelectElement>('select[aria-hidden="true"]')
                .forEach((select) => select.setAttribute('aria-label', '이메일 도메인 선택'))
        }

        labelNativeSelect()
        const observer = new MutationObserver(labelNativeSelect)
        observer.observe(field, {childList: true, subtree: true})

        return () => observer.disconnect()
    }, [])

    return (
        // 모바일(768 미만) 시안은 [아이디 @ 도메인] 아래 줄에 셀렉트가 전체 폭으로 오고 간격이 8 이다.
        <div ref={fieldRef} className={cn('flex flex-wrap items-center gap-2 md:gap-6', className)}>
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <Input
                    id={`${fieldId}-local-part`}
                    value={localPart}
                    onChange={(event) => setLocalPart(event.target.value)}
                    required={required}
                    placeholder="이메일 아이디"
                    aria-label="이메일 아이디"
                    autoComplete="off"
                    className="min-w-0 flex-1"
                />
                <span className="typo-body-xl-regular text-label-foreground shrink-0">@</span>
                <Input
                    ref={domainRef}
                    id={`${fieldId}-domain`}
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                    readOnly={!isDirectInput}
                    required={required}
                    placeholder="도메인 직접입력"
                    aria-label="이메일 도메인"
                    autoComplete="off"
                    className="min-w-0 flex-1"
                />
            </div>
            <Select name={`${name}Preset`} value={preset} onValueChange={handlePresetChange}>
                {/* 시안 폭 — 모바일 전체 폭 · md 228 · xl 280. 남는 폭은 앞의 아이디·도메인 칸이 나눠 갖는다. */}
                <SelectTrigger className="w-full md:w-57 xl:w-70" aria-label="이메일 도메인 선택">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent onCloseAutoFocus={handleCloseAutoFocus}>
                    <SelectItem value={DIRECT_INPUT}>직접입력</SelectItem>
                    {domains.map((emailDomain) => (
                        <SelectItem key={emailDomain} value={emailDomain}>
                            {emailDomain}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {/* 실제로 전송되는 값. 유효성 검사도 조각이 아니라 이 합친 주소를 기준으로 한다. */}
            <input type="hidden" name={name} value={email} />
        </div>
    )
}

export {EmailField, DEFAULT_EMAIL_DOMAINS}
export type {EmailFieldProps}
