'use client'

import {useRef, useState} from 'react'
import {cn} from '@/lib/utils'
import {FIELD_FOCUS_RING} from '@/constants/field-focus'
import {Button} from '@/components/ui/button'
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '@/components/ui/field'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'

const RadioFormDemo = () => {
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [receiptChannel, setReceiptChannel] = useState('')
    const [paymentError, setPaymentError] = useState(false)
    const [receiptError, setReceiptError] = useState(false)
    const paymentRef = useRef<HTMLButtonElement>(null)
    const receiptRef = useRef<HTMLButtonElement>(null)

    return (
        <form
            className="flex flex-col gap-6"
            noValidate
            onSubmit={(event) => {
                event.preventDefault()

                const nextPaymentError = paymentMethod === ''
                const nextReceiptError = receiptChannel === ''
                setPaymentError(nextPaymentError)
                setReceiptError(nextReceiptError)

                if (nextPaymentError || nextReceiptError) {
                    if (nextPaymentError) paymentRef.current?.focus()
                    else receiptRef.current?.focus()
                    return
                }

                const formData = new FormData(event.currentTarget)
                setSubmittedData(
                    JSON.stringify({
                        paymentMethod: formData.get('paymentMethod'),
                        receiptChannel: formData.get('receiptChannel'),
                    }),
                )
            }}
        >
            <FieldSet data-invalid={paymentError || undefined}>
                <FieldLegend id="payment-method-label" className="typo-title-l-medium text-foreground">
                    결제 수단 (필수)
                </FieldLegend>
                <RadioGroup
                    name="paymentMethod"
                    value={paymentMethod}
                    onValueChange={(value) => {
                        setPaymentMethod(value)
                        setPaymentError(false)
                    }}
                    required
                    aria-labelledby="payment-method-label"
                    aria-invalid={paymentError || undefined}
                    aria-describedby={paymentError ? 'payment-method-error' : undefined}
                >
                    <FieldGroup className="gap-3">
                        <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                            <RadioGroupItem ref={paymentRef} id="form-payment-card" value="card" />
                            <FieldLabel htmlFor="form-payment-card">신용카드</FieldLabel>
                        </Field>
                        <Field orientation="horizontal" className={cn('w-fit', FIELD_FOCUS_RING)}>
                            <RadioGroupItem id="form-payment-transfer" value="transfer" />
                            <FieldLabel htmlFor="form-payment-transfer">계좌이체</FieldLabel>
                        </Field>
                    </FieldGroup>
                </RadioGroup>
                {paymentError ? <FieldError id="payment-method-error">결제 수단을 선택해 주세요.</FieldError> : null}
            </FieldSet>

            <FieldSet data-invalid={receiptError || undefined}>
                <FieldLegend id="receipt-channel-label" className="typo-title-l-medium text-foreground">
                    영수증 수신 방법 (필수)
                </FieldLegend>
                <RadioGroup
                    name="receiptChannel"
                    value={receiptChannel}
                    onValueChange={(value) => {
                        setReceiptChannel(value)
                        setReceiptError(false)
                    }}
                    required
                    aria-labelledby="receipt-channel-label"
                    aria-invalid={receiptError || undefined}
                    aria-describedby={receiptError ? 'receipt-channel-error' : undefined}
                >
                    <FieldGroup className="gap-3">
                        <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                            <RadioGroupItem ref={receiptRef} id="form-receipt-email" value="email" />
                            <FieldContent>
                                <FieldLabel htmlFor="form-receipt-email" className="text-foreground font-bold">
                                    이메일
                                </FieldLabel>
                                <FieldDescription className="typo-body-xl-regular text-label-foreground">
                                    결제 완료 후 등록된 이메일로 영수증을 전송합니다.
                                </FieldDescription>
                            </FieldContent>
                        </Field>
                        <Field orientation="horizontal" className={cn('w-fit max-w-90', FIELD_FOCUS_RING)}>
                            <RadioGroupItem id="form-receipt-message" value="message" />
                            <FieldContent>
                                <FieldLabel htmlFor="form-receipt-message" className="text-foreground font-bold">
                                    문자 메시지
                                </FieldLabel>
                                <FieldDescription className="typo-body-xl-regular text-label-foreground">
                                    결제 완료 후 등록된 휴대전화 번호로 영수증 링크를 전송합니다.
                                </FieldDescription>
                            </FieldContent>
                        </Field>
                    </FieldGroup>
                </RadioGroup>
                {receiptError ? (
                    <FieldError id="receipt-channel-error">영수증 수신 방법을 선택해 주세요.</FieldError>
                ) : null}
            </FieldSet>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit" variant="default" size="md">
                        선택 내용 확인
                    </Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        그룹별로 선택된 value 하나가 제출됩니다.
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

export default RadioFormDemo
