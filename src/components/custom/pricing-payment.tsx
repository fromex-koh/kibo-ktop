'use client'

import {useId, useState, type ReactNode} from 'react'
import Link from 'next/link'
import {ArrowUpRight} from 'lucide-react'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import {PaymentCompleteDialog} from '@/components/composite/payment-complete-dialog'
import {SellerInfoDialog} from '@/components/composite/seller-info-dialog'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {Field, FieldLabel} from '@/components/ui/field'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {Separator} from '@/components/ui/separator'
import type {UserType} from '@/constants/header-navigation'
import type {PricingPlan} from '@/content/service/pricing'
import {
    PAYMENT_AGREEMENT,
    PAYMENT_AGREEMENT_HINT,
    PAYMENT_METHOD,
    PAYMENT_USAGE_GUIDE,
    REFUND_GUIDE,
    USAGE_START,
    VAT_RATE,
} from '@/content/service/pricing-payment'
import {cn} from '@/lib/utils'

// 결제하기 — 시안 "SB-FOTA-CM4-0001_가격 정책_결제하기"(40007578:164378). 기업·기관이 같은 화면이다.
// 문구는 content/service/pricing-payment.ts, 고른 이용권은 가격정책의 PAID_PLANS 에서 온다.
//
// 간격(시안): 카드 사이 24 · 결제 수단과 안내 상자 사이 40 · 안내 상자와 동의 카드 40 · 동의 카드와 결제 버튼 40.
// 카드: 흰 면 · 반경 16 · 여백 40·32 · 제목 24 Bold · 제목과 내용 24 · 줄 사이 12.
// [결제하기]는 필수 동의에 체크해야 눌린다.

const PRICE_FORMATTER = new Intl.NumberFormat('ko-KR')

const cardClassName = 'bg-card flex flex-col gap-6 rounded-lg px-5 py-8 md:px-10'

const PaymentCard = ({title, children}: {title: string; children: ReactNode}) => {
    const titleId = useId()

    return (
        <section aria-labelledby={titleId} className={cardClassName}>
            <h2 id={titleId} className="typo-h4-bold text-foreground">
                {title}
            </h2>
            {children}
        </section>
    )
}

// 항목명(왼쪽 · gray.500)과 값(오른쪽)을 한 줄에 둔다. 좁아지면 값이 아래로 내려간다.
const SummaryRow = ({label, children}: {label: string; children: ReactNode}) => (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <dt className="typo-body-xl-regular text-foreground-subtle">{label}</dt>
        <dd className="text-right">{children}</dd>
    </div>
)

// 금액 — 숫자는 굵게, "원"은 보통 굵기(시안). 줄마다 크기가 달라(16 · 총액 24) 크기별 typo 짝을 둔다.
const AMOUNT_TYPO = {
    md: {number: 'typo-body-xl-bold', unit: 'typo-body-xl-regular'},
    lg: {number: 'typo-h4-bold', unit: 'typo-h4-regular'},
} as const

const Amount = ({value, size}: {value: number; size: keyof typeof AMOUNT_TYPO}) => (
    <span>
        <span className={cn(AMOUNT_TYPO[size].number, 'text-foreground')}>{PRICE_FORMATTER.format(value)}</span>
        <span className={cn(AMOUNT_TYPO[size].unit, 'text-label-foreground')}>원</span>
    </span>
)

type PricingPaymentProps = {
    plan: PricingPlan
    userType: UserType
}

const PricingPayment = ({plan, userType}: PricingPaymentProps) => {
    const [isAgreed, setIsAgreed] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const agreementId = useId()
    const hintId = useId()
    const supplyPrice = Math.round(plan.price / (1 + VAT_RATE))
    const vat = plan.price - supplyPrice

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
                <PaymentCard title="주문상품">
                    <dl className="typo-body-xl-medium text-label-foreground flex flex-col gap-3">
                        <SummaryRow label="상품명">{plan.name}</SummaryRow>
                        <SummaryRow label="제공횟수">{`${plan.quota}건`}</SummaryRow>
                        <SummaryRow label="이용기간">{plan.period}</SummaryRow>
                        <SummaryRow label="이용개시">{USAGE_START}</SummaryRow>
                    </dl>
                </PaymentCard>

                <PaymentCard title="결제 금액">
                    <div className="flex flex-col gap-6">
                        <dl className="flex flex-col gap-3">
                            <SummaryRow label="공급가액">
                                <Amount value={supplyPrice} size="md" />
                            </SummaryRow>
                            <SummaryRow label="부가세">
                                <Amount value={vat} size="md" />
                            </SummaryRow>
                        </dl>
                        <Separator />
                        <dl className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                            <dt className="typo-title-l-medium text-label-foreground">총 결제금액</dt>
                            <dd>
                                <Amount value={plan.price} size="lg" />
                            </dd>
                        </dl>
                    </div>
                </PaymentCard>

                <PaymentCard title="결제 수단">
                    <div className="flex flex-col gap-4">
                        {/* 수단이 하나뿐이라 처음부터 골라 둔다(시안). */}
                        <RadioGroup defaultValue={PAYMENT_METHOD.value} name="paymentMethod" aria-label="결제 수단">
                            <Field orientation="horizontal" className="w-fit">
                                {/* 라디오·체크박스는 radix 가 <button> 으로 그린다. <label for> 만으로는 WAVE 가 이름 없는
                                    버튼(Empty button)으로 보므로 aria-labelledby 로 글자를 이름에 직접 잇는다[5.1.1]. */}
                                <RadioGroupItem
                                    id={`${agreementId}-method`}
                                    value={PAYMENT_METHOD.value}
                                    aria-labelledby={`${agreementId}-method-label`}
                                />
                                <FieldLabel
                                    id={`${agreementId}-method-label`}
                                    htmlFor={`${agreementId}-method`}
                                    className="typo-body-xl-bold text-foreground"
                                >
                                    {PAYMENT_METHOD.label}
                                </FieldLabel>
                            </Field>
                        </RadioGroup>
                        <div className="text-foreground flex flex-col gap-1 break-keep">
                            <p className="typo-body-l-bold">{PAYMENT_METHOD.noticeTitle}</p>
                            <p className="typo-body-l-regular">{PAYMENT_METHOD.notice}</p>
                        </div>
                    </div>
                </PaymentCard>
            </div>

            {/* 안내 상자 — InfoBox outline(흰 면 · 테두리 · 반경 16 · 여백 40·32)과 같은 규격이다. */}
            <div className="flex flex-col gap-6">
                {[PAYMENT_USAGE_GUIDE, REFUND_GUIDE].map((guide) => (
                    <InfoBox key={guide.title} variant="outline" title={guide.title} headingLevel={2}>
                        {guide.items.map((item) => (
                            <InfoBoxItem key={item}>
                                <span className="break-keep">{item}</span>
                            </InfoBoxItem>
                        ))}
                    </InfoBox>
                ))}
            </div>

            {/* 필수 동의 — 체크박스 줄 오른쪽에 [판매자 정보] [이용약관 ↗]. 좁아지면 버튼이 아래로 내려간다. */}
            <div className="bg-card flex flex-col gap-4 rounded-lg px-5 py-7 md:flex-row md:items-center md:justify-between md:px-10">
                <Field orientation="horizontal" className="items-start">
                    <Checkbox
                        id={agreementId}
                        checked={isAgreed}
                        onCheckedChange={(checked) => setIsAgreed(checked === true)}
                        aria-labelledby={`${agreementId}-label`}
                        aria-describedby={isAgreed ? undefined : hintId}
                    />
                    <FieldLabel
                        id={`${agreementId}-label`}
                        htmlFor={agreementId}
                        className="typo-body-xl-bold text-foreground break-keep"
                    >
                        {PAYMENT_AGREEMENT}
                    </FieldLabel>
                </Field>
                <div className="flex shrink-0 gap-2">
                    <SellerInfoDialog>
                        <Button type="button" variant="tertiary" size="xs">
                            판매자 정보
                        </Button>
                    </SellerInfoDialog>
                    <Button asChild variant="tertiary" size="xs">
                        <Link href={`/${userType}/terms`} target="_blank" rel="noopener noreferrer">
                            이용약관
                            <ArrowUpRight aria-hidden="true" />
                            <span className="sr-only"> (새 창)</span>
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-center gap-2">
                {/* [프론트엔드 연동] 결제 요청(카드 결제창 호출)을 연결하고, 결제가 끝나면 완료 모달을 연다.
                    지금은 누르면 바로 완료 모달을 띄운다. */}
                <Button
                    type="button"
                    size="xl"
                    disabled={!isAgreed}
                    className="w-full md:w-auto"
                    onClick={() => setIsComplete(true)}
                >
                    {`${PRICE_FORMATTER.format(plan.price)}원 결제하기`}
                </Button>
                {isAgreed ? null : (
                    <p id={hintId} className="typo-body-m-regular text-foreground-subtle text-center break-keep">
                        {PAYMENT_AGREEMENT_HINT}
                    </p>
                )}
            </div>

            <PaymentCompleteDialog plan={plan} open={isComplete} onOpenChange={setIsComplete} />
        </div>
    )
}

export default PricingPayment
