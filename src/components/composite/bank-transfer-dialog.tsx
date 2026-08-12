'use client'

import {useState, type ReactNode} from 'react'
import {Field} from '@/components/composite/form-fields'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {cn} from '@/lib/utils'

// 은행 전송 모달 — 평가결과를 받을 은행과 지점을 고른다
// (Figma "[신속표준모형 KTRS-FM] m_은행 전송"). 5단계 완료 화면의 [은행전송] 이 연다.
//
// [전송하기] 를 누르면 이 모달이 닫히고 전송 결과 모달이 이어서 뜬다(현행 서비스 흐름) —
// 보낸 은행·지점을 다시 보여 주고 [확인] 으로 닫는다. 전송 API 는 handleSubmit 에 붙인다.

const BANK_FIELD = 'bank-transfer-bank'
const BRANCH_FIELD = 'bank-transfer-branch'

// 현행 서비스의 은행 목록·순서를 그대로 옮긴 것이다. 보내는 값도 현행과 같이 은행명 자체다
// (은행 코드가 아니다) — 연동할 때 백엔드가 받는 값이 달라지지 않도록 목록을 손대지 않는다.
const BANKS: readonly string[] = [
    '국민은행',
    '신한은행',
    '하나은행',
    '우리은행',
    'IBK기업은행',
    '농협은행',
    'SC제일은행',
]

type BankTransferDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** [전송하기] 를 눌렀을 때 함께 부를 동작(전송 API 등). 결과 모달은 이 컴포넌트가 띄운다. */
    onSubmit?: () => void
}

// 전송 결과 — 보낸 값을 그대로 되짚어 준다. 지점을 비웠으면 "-" 로 표시한다(현행 서비스와 같다).
type BankTransferResult = {bank: string; branch: string}

type BankTransferResultDialogProps = {
    /** 보낸 값(은행·지점). */
    result: BankTransferResult
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 여는 시점을 바깥에서 정할 때. open 과 onOpenChange 를 함께 넘긴다. */
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

// 전송 완료 — Figma "[신속표준모형 KTRS-FM] m_은행 전송완료".
// 위 전송 모달에서 [전송하기] 를 누르면 이어서 뜨고, 화면정의서의 하위 화면(단독 확인 화면)에서도 쓴다.
// 물음이 아니라 알림이라 닫기(X)를 두지 않고, 버튼은 [확인] 하나가 전체 폭을 쓴다.
// 화면에 보이는 알림 문구가 곧 이 대화상자의 이름이다(DialogTitle) — 대화상자에는 이름이 있어야 한다[8.2.1].
const BankTransferResultDialog = ({result, defaultOpen, open, onOpenChange}: BankTransferResultDialogProps) => (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {/* 시안 카드 높이는 273 이다 — 제목을 화면에서 빼도 그 자리(머리 구획)를 비워 둔 채 높이를 지킨다.
            min-h-68(272)은 spacing 스케일에서 그 높이에 가장 가까운 값이다. */}
        {/* 알림 문구가 제목이고 그 아래는 보낸 값이라 따로 설명을 두지 않는다 — aria-describedby 를 비우지
            않으면 Radix 가 설명이 빠졌다고 경고한다. */}
        <DialogContent showCloseButton={false} className="min-h-68" aria-describedby={undefined}>
            {/* 머리 구획은 비워 둔다 — 시안의 위쪽 여백이자, CTA 가 자동 배치라 첫 행을 채워 두어야
                버튼이 본문 위로 올라오지 않는다(dialog.variants 참고). */}
            <DialogHeader />
            {/* 알림 문구와 보낸 값 사이 8(시안). */}
            <div className={cn(dialogBodyClassName, 'gap-2 pt-0')}>
                {/* 이 문구가 곧 모달의 제목이라 DialogTitle(h2)로 둔다 — 크기·굵기만 제목처럼인 문단으로
                    두면 "제목처럼 보이는데 제목이 아닌 글"이 된다(WAVE "Possible heading").
                    pe-0 은 닫기(X) 자리를 비우는 기본 여백을 되돌린다(이 모달은 X 를 두지 않는다). */}
                <DialogTitle className="typo-title-l-bold text-foreground pe-0 text-center">
                    결과가 전송되었습니다.
                </DialogTitle>
                {/* 보낸 값 — 라벨은 옅은 색, 값은 본문색 Medium 이고 은행·지점 사이에 세로선을 둔다(시안). */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                    <p className="flex items-center gap-2">
                        <span className="typo-body-xl-regular text-foreground-subtle">은행</span>
                        <span className="typo-body-xl-medium text-foreground">{result.bank}</span>
                    </p>
                    <span aria-hidden="true" className="bg-border h-3 w-px" />
                    <p className="flex items-center gap-2">
                        <span className="typo-body-xl-regular text-foreground-subtle">지점</span>
                        <span className="typo-body-xl-medium text-foreground">{result.branch}</span>
                    </p>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button size="xl" className="w-full">
                        확인
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

const BankTransferDialog = ({children, defaultOpen, onSubmit}: BankTransferDialogProps) => {
    // 은행명은 필수라 고르기 전에는 [전송하기] 를 누를 수 없다. 지점명은 선택 입력이라 보지 않는다.
    const [bankName, setBankName] = useState('')
    const [branchName, setBranchName] = useState('')
    const [isOpen, setIsOpen] = useState(defaultOpen ?? false)
    const [result, setResult] = useState<BankTransferResult | null>(null)

    const handleSubmit = () => {
        // [프론트엔드 연동] 이 자리에 전송 API 를 붙이고, 성공했을 때 결과 모달을 띄운다.
        console.log('[은행 전송] 제출 데이터', {bankName, bankBranch: branchName})
        onSubmit?.()
        setIsOpen(false)
        setResult({bank: bankName, branch: branchName.trim() || '-'})
    }

    // 결과를 확인하고 나면 입력값을 비운다 — 한 번 보낸 폼이므로 다시 열었을 때 빈 상태에서 시작해야 한다.
    const closeResult = () => {
        setResult(null)
        setBankName('')
        setBranchName('')
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
                {/* 안내 문장을 제목(h3)으로 두어 설명이 남지 않으므로 aria-describedby 를 비운다 —
                    넘기지 않으면 Radix 가 설명이 빠졌다고 경고한다. */}
                <DialogContent aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle>은행 전송</DialogTitle>
                    </DialogHeader>
                    {/* 안내 문장과 입력 묶음 사이 24 · 칸 사이 16(시안). */}
                    <div className={cn(dialogBodyClassName, 'gap-6')}>
                        {/* 아래 입력 묶음을 이끄는 머리라 heading 으로 둔다 — 크기·굵기만 제목처럼인 문단으로
                            두면 "제목처럼 보이는데 제목이 아닌 글"이 된다(WAVE "Possible heading").
                            모달 제목(h2) 아래 단계라 h3 이다[6.4.2]. */}
                        <h3 className="typo-title-l-bold text-foreground">평가결과를 보낼 은행을 입력해 주세요</h3>
                        <div className="flex flex-col gap-4">
                            <Field id={BANK_FIELD} label="은행명 입력" required>
                                <Select name="bankName" required value={bankName} onValueChange={setBankName}>
                                    <SelectTrigger id={BANK_FIELD} className="w-full">
                                        <SelectValue placeholder="은행 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BANKS.map((bank) => (
                                            <SelectItem key={bank} value={bank}>
                                                {bank}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            {/* 선택 입력이라 라벨에 (선택사항)을 적고 필수 표시를 두지 않는다(시안). */}
                            <Field id={BRANCH_FIELD} label="지점명 입력 (선택사항)">
                                <Input
                                    id={BRANCH_FIELD}
                                    name="bankBranch"
                                    autoComplete="off"
                                    placeholder="지점명을 입력해 주세요"
                                    value={branchName}
                                    onChange={(event) => setBranchName(event.target.value)}
                                />
                            </Field>
                        </div>
                    </div>
                    <DialogFooter>
                        {/* 은행명을 고르기 전에는 누를 수 없다 — 왜 못 누르는지는 위 필수 표시(*)가 알린다. */}
                        <Button size="xl" disabled={!bankName} onClick={handleSubmit}>
                            전송하기
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 전송 결과가 생겼을 때만 붙인다 — 열림 상태가 곧 결과의 유무다. */}
            {result ? (
                <BankTransferResultDialog result={result} open onOpenChange={(open) => !open && closeResult()} />
            ) : null}
        </>
    )
}

export {BankTransferDialog, BankTransferResultDialog}
export type {BankTransferDialogProps, BankTransferResult, BankTransferResultDialogProps}
