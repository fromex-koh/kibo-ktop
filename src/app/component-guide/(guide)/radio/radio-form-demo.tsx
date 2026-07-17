'use client'

import {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'

const RadioFormDemo = () => {
    const [submittedData, setSubmittedData] = useState('아직 제출하지 않았습니다.')

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                setSubmittedData(JSON.stringify({paymentMethod: formData.get('paymentMethod')}))
            }}
        >
            <fieldset className="flex flex-col gap-3">
                <legend id="payment-method-label" className="typo-title-l-medium text-foreground">
                    결제 수단
                </legend>
                <p className="typo-body-l-regular text-muted-foreground">결제에 사용할 수단을 선택해 주세요.</p>
                <RadioGroup name="paymentMethod" defaultValue="card" aria-labelledby="payment-method-label" required>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem id="form-payment-card" value="card" aria-labelledby="form-payment-card-label" />
                        <Label id="form-payment-card-label" htmlFor="form-payment-card">
                            신용카드
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem
                            id="form-payment-transfer"
                            value="transfer"
                            aria-labelledby="form-payment-transfer-label"
                        />
                        <Label id="form-payment-transfer-label" htmlFor="form-payment-transfer">
                            계좌이체
                        </Label>
                    </div>
                </RadioGroup>
            </fieldset>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Button type="submit">결제 수단 확인</Button>
                    <span className="typo-body-l-regular text-muted-foreground">
                        선택된 라디오의 value 하나가 제출됩니다.
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
