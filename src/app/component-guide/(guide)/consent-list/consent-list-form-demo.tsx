'use client'

import {useRef, useState} from 'react'
import {ChevronRight} from 'lucide-react'
import {ConsentItem, ConsentList} from '@/components/composite/consent-list'
import {Button} from '@/components/ui/button'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {cn} from '@/lib/utils'

// 동의 목록 폼 데모 — 실제 자가진단 1단계처럼 필수 동의를 검증하고 FormData 로 제출한다.
// 필수 항목은 "동의"를 선택해야 통과하고, 선택 항목은 비워 두거나 비동의여도 제출된다.
const AGREE = 'agree'
const DISAGREE = 'disagree'

const CONSENT_ITEMS = [
    {
        name: 'consentCollect',
        title: '1. 수집·이용에 관한 사항',
        description: '위 고유식별정보 수집·이용에 동의하십니까?',
        isRequired: true,
    },
    {
        name: 'consentThirdParty',
        title: '2. 제3자 제공에 관한 사항',
        description: '위 고유식별정보 제3자 제공에 동의하십니까?',
        isRequired: true,
    },
    {
        name: 'consentTax',
        title: '4. 세무회계자료의 온라인 제출에 관한 사항',
        description: '위 세무회계자료의 온라인 제출에 동의하십니까?',
        isRequired: false,
    },
] as const

// 필수 항목의 오류 문구 — 미선택과 비동의를 구분해 정정 방법을 알려준다[7.4.2].
const getErrorMessage = (value: string) =>
    value ? '필수 항목입니다. 동의를 선택해 주세요.' : '동의 여부를 선택해 주세요.'

const ConsentListFormDemo = () => {
    const [values, setValues] = useState<Record<string, string>>({})
    const [invalidNames, setInvalidNames] = useState<readonly string[]>([])
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')
    // 오류가 있는 첫 항목의 "동의" 라디오로 포커스를 옮기기 위한 참조.
    const agreeRefs = useRef<Record<string, HTMLButtonElement | null>>({})

    return (
        <form
            className="flex flex-col gap-6"
            noValidate
            onSubmit={(event) => {
                event.preventDefault()

                const nextInvalidNames = CONSENT_ITEMS.filter(
                    (item) => item.isRequired && values[item.name] !== AGREE,
                ).map((item) => item.name)
                setInvalidNames(nextInvalidNames)

                if (nextInvalidNames.length) {
                    agreeRefs.current[nextInvalidNames[0]]?.focus()
                    setSubmittedData('필수 동의 항목이 남아 있어 제출하지 않았습니다.')
                    return
                }

                const entries = Array.from(new FormData(event.currentTarget).entries())
                setSubmittedData(JSON.stringify(Object.fromEntries(entries)))
            }}
        >
            <ConsentList>
                {CONSENT_ITEMS.map((item) => {
                    const value = values[item.name] ?? ''
                    const hasError = invalidNames.includes(item.name)
                    const errorId = `${item.name}-error`

                    return (
                        <ConsentItem
                            key={item.name}
                            requirement={item.isRequired ? 'required' : 'optional'}
                            title={item.title}
                            description={item.description}
                            action={
                                <Button variant="text" size="lg">
                                    내용보기
                                    <ChevronRight aria-hidden="true" />
                                </Button>
                            }
                            control={
                                // ConsentItem 에는 오류 슬롯이 없어 컨트롤 슬롯에 라디오와 오류 문구를 세로로 넣는다.
                                <div className="flex flex-col items-end gap-1">
                                    <RadioGroup
                                        name={item.name}
                                        value={value}
                                        onValueChange={(nextValue) => {
                                            setValues((previous) => ({...previous, [item.name]: nextValue}))
                                            setInvalidNames((previous) => previous.filter((name) => name !== item.name))
                                        }}
                                        required={item.isRequired}
                                        aria-label={`${item.title} 동의 여부`}
                                        aria-invalid={hasError || undefined}
                                        aria-describedby={hasError ? errorId : undefined}
                                        className="flex w-fit flex-row gap-6"
                                    >
                                        <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                                            <RadioGroupItem
                                                ref={(node) => {
                                                    agreeRefs.current[item.name] = node
                                                }}
                                                value={AGREE}
                                                id={`${item.name}-agree`}
                                                aria-labelledby={`${item.name}-agree-label`}
                                            />
                                            <FieldLabel id={`${item.name}-agree-label`} htmlFor={`${item.name}-agree`}>
                                                동의
                                            </FieldLabel>
                                        </Field>
                                        <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                                            <RadioGroupItem
                                                value={DISAGREE}
                                                id={`${item.name}-disagree`}
                                                aria-labelledby={`${item.name}-disagree-label`}
                                            />
                                            <FieldLabel
                                                id={`${item.name}-disagree-label`}
                                                htmlFor={`${item.name}-disagree`}
                                            >
                                                비동의
                                            </FieldLabel>
                                        </Field>
                                    </RadioGroup>
                                    {hasError ? (
                                        <FieldError id={errorId} className="text-right">
                                            {getErrorMessage(value)}
                                        </FieldError>
                                    ) : null}
                                </div>
                            }
                        />
                    )
                })}
            </ConsentList>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="md">
                        동의하고 다음 단계
                    </Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        항목별 name 과 선택값(agree·disagree)이 하나의 FormData 로 제출됩니다.
                    </span>
                </div>
                <output
                    className="typo-body-l-regular bg-surface border-border text-muted-foreground min-h-10 rounded-md border px-3 py-2 break-all"
                    aria-live="polite"
                >
                    {submittedData}
                </output>
            </div>
        </form>
    )
}

export default ConsentListFormDemo
