'use client'

import {useEffect, useId, useRef, useState, type ReactNode} from 'react'
import {Check} from 'lucide-react'
import {CertificateSelectDialog, type CertificateType} from '@/components/composite/certificate-select-dialog'
import {ChipRadio, ChipRadioGroup} from '@/components/composite/chip'
import {Icon} from '@/components/custom/icon'
import {ListMarker} from '@/components/custom/list-marker'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {FieldError} from '@/components/ui/field'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {dialogInfoBodyClassName} from '@/components/theme/dialog.variants'
import {cn} from '@/lib/utils'

// 약정서 전자서명 모달 — 기업 고객정보활용동의(기술평가 4개 모형 · 마이페이지 대표자 이력)에서
// [동의 후 인증서명]을 누르면 뜬다. 여는 곳: custom/customer-consent-agreement.tsx 의 CustomerConsentForm.
//
// [프론트엔드 연동] 아래 props 만 연결하면 된다. 화면과 상태 처리(칩 전환 · 결과 표시 · 포커스)는 그대로 둔다.
//   · businessType — 회원정보로 판단해 넘긴다.
//       'corporation'(법인기업, 기본) = 법인인증 + 개인인증 2건 / 'individual'(개인기업) = 개인인증 1건
//   · businessNumber — 회원정보의 사업자등록번호. 법인인증 화면에 읽기 전용으로 보인다(입력 칸 없음).
//   · onCertify({method, certificate, residentNumber}) — 인증서를 고르면 불린다. 여기서 인증 모듈을 열고
//       성공이면 true, 실패(정보 불일치 등)면 false 를 돌려준다. Promise 도 된다. 예외가 나면 실패로 처리한다.
//       residentNumber(대표자 주민등록번호)는 개인인증일 때만 있다 — 법인인증은 businessNumber 로 확인한다.
//       넘기지 않으면 항상 성공으로 본다(퍼블리싱 확인용).
//   · onSubmit — [제출하기]는 모든 인증을 마쳐야 나타나므로 여기서 완료 여부를 다시 확인할 필요가 없다.
//   · 주민등록번호 칸에는 name 이 없다 — 폼으로 보내지 않고 onCertify 인자로만 받는다.
//   · previewResult · previewFailCertificate 는 퍼블리싱 확인 화면 전용이다. 실서비스에서는 넘기지 않는다.
//
// 이미 구현된 동작
//   · 입력값 · 인증 결과는 인증마다 따로 기억한다 — 칩을 오가거나 모달을 닫았다 열어도 남는다(같은 화면에 있는 동안).
//   · 성공: 칩에 [인증완료] 배지 + "공동인증서로 인증했습니다." 안내, 주민등록번호 칸은 잠긴다(읽기 전용).
//     남은 인증이 있으면 그 칩으로 자동 전환한다. 모달을 다시 열 때도 남은 인증 칩으로 연다.
//   · 실패: 칸(법인인증은 사업자등록번호, 개인인증은 주민등록번호) 빨간 테두리 + 오류 문구.
//     주민등록번호를 고치면 지워진다.
//   · 인증하는 동안(onCertify 대기)에는 [인증서로 인증하기]를 막아 두 번 눌리지 않게 한다.
//   · 결과가 나오면 그 자리로 스크롤 · 포커스를 옮긴다(화면 낭독기 안내 포함).

type SignatureMethod = 'corporate' | 'personal'
type BusinessType = 'corporation' | 'individual'

// 대표자 주민등록번호 — 앞 6 · 뒤 7 자리.
type ResidentNumber = {front: string; back: string}

// onCertify 인자 — residentNumber 는 개인인증일 때만 있다.
type CertifyRequest = {method: SignatureMethod; certificate: CertificateType; residentNumber?: ResidentNumber}

// 사업자 유형별 안내 문구 · 고를 수 있는 인증.
// 안내 문단은 두 문장을 각자 한 줄에 둔다 — 한 문자열로 두면 폭에 따라 문장 중간에서 접힌다.
const BUSINESS_TYPES: Record<
    BusinessType,
    {notice: readonly [string, string]; guides: readonly string[]; methods: readonly SignatureMethod[]}
> = {
    corporation: {
        notice: ['약정서 제출을 위한 전자서명이 필요합니다.', '법인(사업자)인증과 개인인증을 진행해주시기 바랍니다.'],
        guides: [
            '법인인증은 사업장인증서로, 개인인증은 대표자인증서로 진행이 가능합니다.',
            '법인인증과 개인인증 모두 인증하셔야 완료됩니다.',
        ],
        methods: ['corporate', 'personal'],
    },
    individual: {
        notice: ['약정서 제출을 위한 전자서명이 필요합니다.', '대표자 개인인증을 진행해주시기 바랍니다.'],
        guides: ['개인인증은 대표자 인증서(공동인증서 또는 금융인증서)로 진행이 가능합니다.'],
        methods: ['personal'],
    },
}

// 인증별 화면 — 입력 칸(residentNumber)이 있는 인증은 개인인증뿐이다.
const SIGNATURE_METHODS: Record<
    SignatureMethod,
    {
        label: string
        guide: string
        certificateGuide: string
        /** 주민등록번호 입력 칸 — 없으면 사업자등록번호(읽기 전용)를 보인다. */
        residentNumber?: {label: string; placeholders: ResidentNumber}
        errorMessage: string
    }
> = {
    corporate: {
        label: '법인인증',
        guide: '사업자등록번호를 확인해 주세요.',
        certificateGuide: '법인인증 — 사업장(법인) 인증서로 인증합니다.',
        errorMessage:
            '사업자등록번호와 인증서 정보가 일치하지 않습니다. 사업장(법인) 인증서를 확인한 뒤 다시 인증해 주세요.',
    },
    personal: {
        label: '개인인증',
        guide: '대표자 주민등록번호를 입력해 주세요.',
        certificateGuide: '개인인증 — 대표자 개인 인증서로 인증합니다.',
        residentNumber: {label: '대표자 주민등록번호', placeholders: {front: '800101', back: '*******'}},
        errorMessage:
            '대표자 주민등록번호와 인증서 정보가 일치하지 않습니다. 주민등록번호를 확인한 뒤 다시 인증해 주세요.',
    },
}

const CERTIFICATE_NAMES: Record<CertificateType, string> = {joint: '공동인증서', financial: '금융인증서'}

// 결과 뒤 포커스 · 스크롤할 자리 — 완료 안내(success) · 오류 문구(failure) · 남은 인증의 첫 칸(next).
type RevealTarget = 'success' | 'failure' | 'next'

const NUMBER_FRONT_LENGTH = 6
const NUMBER_BACK_LENGTH = 7
const EMPTY_NUMBER: ResidentNumber = {front: '', back: ''}
// [퍼블리싱 확인용] 확인 화면 · 동의 화면이 넘기는 목업 사업자등록번호. 실서비스는 회원정보 값을 넘긴다.
const PREVIEW_BUSINESS_NUMBER = '123-45-67890'

const isSignatureMethod = (value: string): value is SignatureMethod => value === 'corporate' || value === 'personal'
const toDigits = (value: string, length: number) => value.replace(/\D/g, '').slice(0, length)

type ESignatureDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때. open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** 사업자 유형. 법인기업(기본)은 법인 · 개인인증 둘 다, 개인기업은 개인인증만. */
    businessType?: BusinessType
    /** 처음 고른 인증(법인기업일 때만 의미가 있다). 기본 법인인증. */
    defaultMethod?: SignatureMethod
    /** 사업자등록번호 — 법인인증 화면에 읽기 전용으로 보인다. [프론트엔드 연동] 회원정보 값을 넘긴다. */
    businessNumber: string
    /** 인증서를 골랐을 때(인증 연동 자리). 성공이면 true, 실패면 false. 넘기지 않으면 성공으로 본다. */
    onCertify?: (request: CertifyRequest) => boolean | Promise<boolean>
    /** 인증을 마친 뒤 [제출하기]를 눌렀을 때. */
    onSubmit?: () => void
    /** [퍼블리싱 확인용] onCertify 가 없을 때 이 인증서를 고르면 실패로 본다 — 확인 화면에서 실패 흐름을 눌러 보는 용도. */
    previewFailCertificate?: CertificateType
    /** [퍼블리싱 확인용] 모든 인증을 이 결과(성공 · 실패)로 시작한다 — 칩을 오가며 인증별 결과 화면을 본다. */
    previewResult?: {status: 'success' | 'failure'; residentNumber: ResidentNumber; certificate?: CertificateType}
}

const ESignatureDialog = ({
    children,
    defaultOpen,
    open,
    onOpenChange,
    businessType = 'corporation',
    defaultMethod = 'corporate',
    businessNumber,
    onCertify,
    onSubmit,
    previewResult,
    previewFailCertificate,
}: ESignatureDialogProps) => {
    const idPrefix = useId()
    const business = BUSINESS_TYPES[businessType]
    // 고를 수 없는 인증(개인기업의 법인인증)을 처음 값으로 받으면 그 유형의 첫 인증으로 시작한다.
    const [method, setMethod] = useState<SignatureMethod>(
        business.methods.includes(defaultMethod) ? defaultMethod : business.methods[0],
    )
    // 번호는 인증마다 따로 둔다 — 두 인증을 모두 해야 하므로 칩을 오가도 입력한 값이 남는다.
    const [numbers, setNumbers] = useState<Partial<Record<SignatureMethod, ResidentNumber>>>(() =>
        previewResult
            ? Object.fromEntries(
                  business.methods
                      .filter((value) => SIGNATURE_METHODS[value].residentNumber)
                      .map((value) => [value, previewResult.residentNumber]),
              )
            : {},
    )
    const [isCertificateOpen, setIsCertificateOpen] = useState(false)
    // onCertify 를 기다리는 동안 — 인증 버튼을 막는다.
    const [isCertifying, setIsCertifying] = useState(false)
    // 인증마다 마친 인증서 종류(완료 안내 문구에 쓴다).
    const [certified, setCertified] = useState<Partial<Record<SignatureMethod, CertificateType>>>(() =>
        previewResult?.status === 'success'
            ? Object.fromEntries(business.methods.map((value) => [value, previewResult.certificate ?? 'joint']))
            : {},
    )
    // 인증마다 실패 여부 — 칩을 오가도 그 인증의 오류 문구가 남는다(주민등록번호를 고치면 지워진다).
    const [failed, setFailed] = useState<Partial<Record<SignatureMethod, boolean>>>(() =>
        previewResult?.status === 'failure' ? Object.fromEntries(business.methods.map((value) => [value, true])) : {},
    )
    // 마지막 인증 결과 · 결과가 나온 횟수 — 횟수가 바뀔 때마다 결과 자리로 스크롤한다.
    // next — 성공했고 남은 인증으로 자동 전환한 경우(남은 인증의 첫 칸으로 간다).
    const lastResultRef = useRef<RevealTarget | null>(null)
    // 자동 전환을 화면 낭독기에 알리는 문구 — 전환하면 바뀐 화면에 완료 안내가 없어 따로 읽어 준다.
    const [announcement, setAnnouncement] = useState('')
    const [resultCount, setResultCount] = useState(0)
    const selected = SIGNATURE_METHODS[method]
    const certifiedCertificate = certified[method]
    const number = numbers[method] ?? EMPTY_NUMBER
    const isFailed = Boolean(failed[method])
    const isAllCertified = business.methods.every((value) => certified[value])
    // 입력 칸이 없는 법인인증은 바로 인증할 수 있다.
    const isComplete =
        !selected.residentNumber ||
        (number.front.length === NUMBER_FRONT_LENGTH && number.back.length === NUMBER_BACK_LENGTH)
    const errorId = `${idPrefix}-${method}-error`
    const successId = `${idPrefix}-${method}-success`

    const guideId = `${idPrefix}-guide`
    const businessNumberId = `${idPrefix}-business-number`
    const numberFrontId = `${idPrefix}-${method}-front`
    // 실패 · 다음 인증으로 넘어갈 때 포커스할 첫 칸.
    const firstFieldId = selected.residentNumber ? numberFrontId : businessNumberId

    const setNumber = (part: keyof ResidentNumber, value: string) => {
        setFailed((prev) => ({...prev, [method]: false}))
        lastResultRef.current = null
        setNumbers((prev) => ({
            ...prev,
            [method]: {
                ...(prev[method] ?? EMPTY_NUMBER),
                [part]: toDigits(value, part === 'front' ? NUMBER_FRONT_LENGTH : NUMBER_BACK_LENGTH),
            },
        }))
    }

    // 결과 자리를 보이게 하고 포커스를 옮긴다. 본문이 스크롤 상자라 block: 'nearest' 로 필요한 만큼만 움직인다.
    // 동작을 줄이도록 설정한 사용자에게는 즉시 이동한다([6.3.1]).
    const revealResult = (result: RevealTarget) => {
        const targetId = result === 'failure' ? errorId : result === 'success' ? successId : firstFieldId
        const target = document.getElementById(targetId)
        if (!target) return
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target.scrollIntoView({block: 'nearest', behavior: prefersReducedMotion ? 'auto' : 'smooth'})
        const focusTarget = result === 'success' ? target : document.getElementById(firstFieldId)
        focusTarget?.focus({preventScroll: true})
    }

    // 결과가 나온 뒤(인증 연동이 늦게 끝나도) 한 번 그려진 다음에 결과 자리로 간다.
    useEffect(() => {
        const result = lastResultRef.current
        if (!resultCount || !result) return
        const frame = requestAnimationFrame(() => revealResult(result))
        return () => cancelAnimationFrame(frame)
        // revealResult 는 렌더마다 새로 만들어진다 — 결과가 새로 나올 때(resultCount)만 움직인다.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultCount])

    const handleCertificateSelect = async (certificate: CertificateType) => {
        setIsCertificateOpen(false)
        setIsCertifying(true)
        // 인증 연동에서 예외가 나도 실패로 보고 오류 문구를 띄운다(버튼이 막힌 채 남지 않게).
        const certify = async () =>
            onCertify
                ? onCertify({method, certificate, residentNumber: selected.residentNumber ? number : undefined})
                : certificate !== previewFailCertificate
        const isSuccess = await certify().catch(() => false)
        setIsCertifying(false)
        setFailed((prev) => ({...prev, [method]: !isSuccess}))
        if (!isSuccess) {
            lastResultRef.current = 'failure'
            setResultCount((count) => count + 1)
            return
        }
        setCertified((prev) => ({...prev, [method]: certificate}))
        // 남은 인증(아직 안 마친 첫 건)이 있으면 그 칩으로 넘어간다.
        const nextMethod = business.methods.find((value) => value !== method && !certified[value])
        if (nextMethod) {
            setMethod(nextMethod)
            setAnnouncement(
                `${SIGNATURE_METHODS[method].label}이 완료되었습니다. ${SIGNATURE_METHODS[nextMethod].label}을 진행해 주세요.`,
            )
        }
        lastResultRef.current = nextMethod ? 'next' : 'success'
        setResultCount((count) => count + 1)
    }

    // 결과가 이미 있는 채로 열리면(실패 · 성공 케이스 확인 화면 등) 첫 칸 대신 결과 자리로 포커스 · 스크롤한다.
    // 화면이 다 그려진 뒤라야 스크롤 위치가 맞아 한 프레임 미룬다.
    // 닫았다 다시 열 때 지금 인증을 이미 마쳤고 남은 인증이 있으면, 남은 인증 칩으로 열고 그 첫 칸으로 간다.
    const handleOpenAutoFocus = (event: Event) => {
        const nextMethod = certifiedCertificate
            ? business.methods.find((value) => value !== method && !certified[value])
            : undefined
        if (nextMethod) {
            event.preventDefault()
            setMethod(nextMethod)
            setAnnouncement('')
            lastResultRef.current = 'next'
            setResultCount((count) => count + 1)
            return
        }
        const result = isFailed ? 'failure' : certifiedCertificate ? 'success' : null
        if (!result) return
        event.preventDefault()
        requestAnimationFrame(() => revealResult(result))
    }

    // 인증서 선택이 닫히면 Radix 는 포커스를 [인증서로 인증하기]로 돌린다 — 결과가 있으면 대신 결과 자리로 보낸다.
    const handleCertificateCloseAutoFocus = (event: Event) => {
        const result = lastResultRef.current
        if (!result) return
        event.preventDefault()
        revealResult(result)
    }

    const handleMethodChange = (value: string) => {
        if (!isSignatureMethod(value) || value === method || !business.methods.includes(value)) return
        setMethod(value)
        lastResultRef.current = null
        setAnnouncement('')
    }

    return (
        <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
            {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
            <DialogContent onOpenAutoFocus={handleOpenAutoFocus}>
                <DialogHeader>
                    <DialogTitle>약정서 전자서명</DialogTitle>
                </DialogHeader>
                <div className={cn(dialogInfoBodyClassName, 'gap-6')}>
                    {/* 안내 문단 · 안내 목록 · 인증 칩 사이 16. 개인기업은 목록과 칩 사이만 8(시안). */}
                    <div className={cn('flex flex-col gap-4', businessType === 'individual' && '[&>ul]:-mb-2')}>
                        {/* 큰 Bold 글자를 <p> 로 두면 WAVE 가 "Possible heading" 으로 잡아 블록 span 으로 그린다(설명 연결은 그대로). */}
                        <DialogDescription asChild>
                            <span className="typo-title-l-bold text-foreground block">
                                {business.notice[0]}
                                <br />
                                {business.notice[1]}
                            </span>
                        </DialogDescription>
                        {/* 순서가 뜻을 갖지 않는 안내라 점 목록이다. */}
                        <ul className="flex list-none flex-col gap-2">
                            {business.guides.map((guide) => (
                                <li key={guide} className="typo-body-xl-regular text-label-foreground flex">
                                    <ListMarker />
                                    <span className="min-w-0">{guide}</span>
                                </li>
                            ))}
                        </ul>
                        {/* 인증을 고르는 칩 — 같은 폭으로 나란히 둔다(간격 8). 개인기업은 칩 하나가 전체 폭이다. */}
                        <ChipRadioGroup
                            aria-label="인증 방식"
                            value={method}
                            onValueChange={handleMethodChange}
                            className={cn('grid w-full', business.methods.length > 1 && 'grid-cols-2')}
                        >
                            {business.methods.map((value) => (
                                <ChipRadio
                                    key={value}
                                    value={value}
                                    // 마친 인증은 고르지 않았어도 파란 테두리 · 글자로 둔다.
                                    // 좁은 화면(sm 미만)은 칩 폭이 모자라 이름이 두 줄로 깨지므로 배지를 이름 아래로 내린다.
                                    className={cn(
                                        certified[value] &&
                                            'border-primary text-secondary-foreground font-bold max-sm:flex-col max-sm:gap-1',
                                    )}
                                >
                                    <span className="whitespace-nowrap">{SIGNATURE_METHODS[value].label}</span>
                                    {certified[value] ? (
                                        <Badge
                                            variant="solid-pastel"
                                            color="info"
                                            shape="round"
                                            size="xs"
                                            className="whitespace-nowrap"
                                        >
                                            인증완료
                                        </Badge>
                                    ) : null}
                                </ChipRadio>
                            ))}
                        </ChipRadioGroup>
                        <p aria-live="polite" className="sr-only">
                            {announcement}
                        </p>
                    </div>

                    <section aria-labelledby={guideId} className="flex flex-col gap-6">
                        <h3 id={guideId} className="typo-title-l-bold text-foreground">
                            {selected.guide}
                        </h3>
                        {/* key 로 인증마다 칸을 새로 그린다 — 다른 인증의 칸 상태(포커스 등)가 섞이지 않는다. */}
                        <div key={method} className="flex flex-col gap-4">
                            {selected.residentNumber ? (
                                <>
                                    <Label htmlFor={numberFrontId} className="typo-body-xl-bold text-foreground">
                                        {selected.residentNumber.label}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id={numberFrontId}
                                            inputMode="numeric"
                                            autoComplete="off"
                                            maxLength={NUMBER_FRONT_LENGTH}
                                            placeholder={selected.residentNumber.placeholders.front}
                                            aria-label={`${selected.residentNumber.label} 앞자리`}
                                            value={number.front}
                                            onChange={(event) => setNumber('front', event.target.value)}
                                            readOnly={Boolean(certifiedCertificate)}
                                            aria-invalid={isFailed || undefined}
                                            aria-describedby={isFailed ? errorId : undefined}
                                            className="min-w-0 flex-1"
                                        />
                                        <span aria-hidden="true" className="typo-body-xl-regular text-foreground">
                                            -
                                        </span>
                                        {/* 주민등록번호 뒷자리는 화면에 드러나지 않게 가린다. */}
                                        <Input
                                            type="password"
                                            inputMode="numeric"
                                            autoComplete="off"
                                            maxLength={NUMBER_BACK_LENGTH}
                                            placeholder={selected.residentNumber.placeholders.back}
                                            aria-label={`${selected.residentNumber.label} 뒷자리`}
                                            value={number.back}
                                            onChange={(event) => setNumber('back', event.target.value)}
                                            readOnly={Boolean(certifiedCertificate)}
                                            aria-invalid={isFailed || undefined}
                                            aria-describedby={isFailed ? errorId : undefined}
                                            className="min-w-0 flex-1"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Label htmlFor={businessNumberId} className="typo-body-xl-bold text-foreground">
                                        사업자등록번호
                                    </Label>
                                    {/* 회원정보에 있는 값이라 고치지 않는다 — readOnly 는 값을 보이고 포커스도 받는다. */}
                                    <Input
                                        id={businessNumberId}
                                        value={businessNumber}
                                        readOnly
                                        aria-invalid={isFailed || undefined}
                                        aria-describedby={isFailed ? errorId : undefined}
                                    />
                                </>
                            )}
                            {/* 입력 칸과 오류 문구 사이 8 — 바깥 gap-4 에서 덜어 낸다. */}
                            {isFailed ? (
                                <FieldError id={errorId} className="-mt-2 scroll-my-6">
                                    {selected.errorMessage}
                                </FieldError>
                            ) : null}
                        </div>
                        {/* 완료 안내 — 옅은 파랑 상자에 체크 + 문구(높이 45). 문구가 바뀌면 화면 낭독기가 읽는다. */}
                        <div aria-live="polite" className="empty:hidden">
                            {certifiedCertificate ? (
                                <p
                                    id={successId}
                                    // 결과를 알리려 포커스를 받는 자리라 tabIndex -1(탭 순서에는 넣지 않는다).
                                    tabIndex={-1}
                                    className="bg-primary-subtle typo-body-l-medium text-secondary-foreground flex scroll-my-6 items-center justify-center gap-2 rounded-sm px-4 py-3 text-center outline-none"
                                >
                                    <Icon
                                        variant="solid"
                                        icon={Check}
                                        className="bg-primary text-primary-foreground size-icon-md"
                                    />
                                    {CERTIFICATE_NAMES[certifiedCertificate]}로 인증했습니다.
                                </p>
                            ) : null}
                        </div>
                    </section>
                </div>
                {/* 인증이 끝나야 닫히므로 DialogClose 로 감싸지 않는다.
                    이 모달만 버튼 아래 여백이 40 이다(다른 모달은 24) — sm 이상에서 넓힌다. */}
                <DialogFooter className="sm:pb-10">
                    {isAllCertified ? (
                        <Button type="button" size="xl" onClick={onSubmit}>
                            제출하기
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            size="xl"
                            // 이 인증을 이미 마쳤으면(다른 인증이 남은 경우) 다른 칩을 고를 때까지 막는다.
                            disabled={!isComplete || Boolean(certifiedCertificate) || isCertifying}
                            onClick={() => setIsCertificateOpen(true)}
                        >
                            인증서로 인증하기
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
            {/* 인증서 선택은 이 모달 위에 겹쳐 뜬다 — 닫으면(X · Esc) 전자서명 모달로 돌아온다. */}
            <CertificateSelectDialog
                open={isCertificateOpen}
                onOpenChange={setIsCertificateOpen}
                target={selected.certificateGuide}
                onSelect={(certificate) => void handleCertificateSelect(certificate)}
                onCloseAutoFocus={handleCertificateCloseAutoFocus}
            />
        </Dialog>
    )
}

export {ESignatureDialog, PREVIEW_BUSINESS_NUMBER}
export type {BusinessType, CertifyRequest, ESignatureDialogProps, ResidentNumber, SignatureMethod}
