'use client'

import type {ReactNode} from 'react'
import {SummaryList, SummaryListItem} from '@/components/composite/summary-list'
import {Badge} from '@/components/ui/badge'
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
import {dialogBodyClassName} from '@/components/theme/dialog.variants'
import {CORP_PREVIEW_USER, ORG_PREVIEW_USER} from '@/constants/preview-user'
import {cn} from '@/lib/utils'

// 보증이력 모달 — 보증추천을 마친 건의 [보증이력] 이 연다(Figma "마이페이지_평가결과 조회_보증이력").
// 고칠 수 없는 값만 보여 주는 조회 화면이라 입력 칸이 아니라 요약 목록(SummaryList)으로 둔다.
//
// [프론트엔드 연동] values 를 보증이력 조회 API 응답으로 바꾸면 화면은 그대로다.
// 넘기지 않으면 아래 목업이 나온다(모달만 확인하는 화면에서 쓴다).
//
// 이름 칸(기업명·은행·영업점명·추천 영업점)은 가장 긴 경우로 채워 두었다 — 16자짜리 기관 이름이
// 들어와도 줄이 밀리거나 잘리지 않는지 이 화면에서 바로 확인할 수 있다.
// 길이 기준은 헤더가 이름 칸에 넣고 자르는 그 이름이라, 값을 따로 적지 않고 같은 목업을 가져다 쓴다.

type GuaranteeHistoryValues = {
    companyName: string
    /** 상단 카드의 상태 배지 — 시안은 "보증완료" 하나다. */
    status: string
    businessNumber: string
    industryCode: string
    manager: {name: string; tel: string; email: string; position: string; address: string; companyTel: string}
    /** 대출희망 금액(백만원) — 합계는 두 값을 더해 보여 준다. */
    loan: {working: number; facility: number}
    branch: string
    /** 현재 다른 보증기관 이용 — 시안 표기는 "이용"·"미이용" 이다. */
    otherGuarantee: string
    bank: {name: string; tel: string; position: string; bankName: string; branchName: string}
}

const GUARANTEE_HISTORY_SAMPLE: GuaranteeHistoryValues = {
    companyName: CORP_PREVIEW_USER.name,
    status: '보증완료',
    businessNumber: '457-69-00378',
    industryCode: 'C26299',
    manager: {
        name: '박민정',
        tel: '010-2345-6789',
        email: 'minjung.park@company.co.kr',
        position: '경영지원팀 과장',
        address: '부산광역시 해운대구 센텀중앙로 90 3층',
        companyTel: '051-720-3300',
    },
    loan: {working: 150, facility: 50},
    branch: '대구경북 지역본부 > 대구북지점',
    otherGuarantee: '미이용',
    bank: {
        name: '김성호',
        tel: '010-8765-4321',
        position: '기업금융팀 대리',
        bankName: '한국미래은행',
        branchName: ORG_PREVIEW_USER.name,
    },
}

// 구획 — 소제목(18 Bold) 아래 요약 카드가 8 간격으로 붙는다(시안).
const Section = ({title, children}: {title: string; children: ReactNode}) => (
    <section className="flex flex-col gap-2">
        <h3 className="typo-title-m-bold text-foreground">{title}</h3>
        {children}
    </section>
)

// 상단 카드의 상세 한 줄 — 아래 요약 목록보다 한 단계 작은 글자다(시안 14/21).
const TopDetail = ({term, children}: {term: string; children: ReactNode}) => (
    <div className="flex items-start justify-between gap-4">
        <dt className="typo-body-l-regular text-foreground-subtle">{term}</dt>
        <dd className="typo-body-l-regular text-foreground m-0 text-right">{children}</dd>
    </div>
)

// 금액 한 칸 — 옅은 회색 면에 이름(14)과 값(20 Bold)+단위(16)가 오른쪽으로 붙는다(시안).
// 합계만 값이 파랗다 — 두 금액을 더한 결과라는 것이 색으로도 드러난다.
// 좁은 화면에서는 셋을 세로로 쌓고 한 줄 안에서 이름(좌)·금액(우)으로 둔다 — 한 줄에 셋을 두면
// 칸이 80 남짓이라 금액과 단위가 상자를 넘는다.
const LoanAmountBox = ({label, amount, isTotal}: {label: string; amount: number; isTotal?: boolean}) => (
    <div className="bg-surface-subtle flex items-baseline justify-between gap-2 rounded-sm px-5 py-4 sm:flex-col sm:items-stretch sm:gap-0">
        <p className="typo-body-l-regular text-label-foreground shrink-0">{label}</p>
        <p className="flex items-baseline justify-end gap-1">
            <span className={cn('typo-title-l-bold', isTotal ? 'text-primary-strong' : 'text-foreground')}>
                {amount.toLocaleString('ko-KR')}
            </span>
            <span className="typo-body-xl-regular text-label-foreground">백만원</span>
        </p>
    </div>
)

type GuaranteeHistoryDialogProps = {
    /** 모달을 여는 버튼. Radix 가 이 요소에 열기 동작과 aria 를 얹는다. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** 보여 줄 값. 넘기지 않으면 시안의 값이 그대로 나온다. */
    values?: GuaranteeHistoryValues
}

const GuaranteeHistoryDialog = ({
    children,
    defaultOpen,
    values = GUARANTEE_HISTORY_SAMPLE,
}: GuaranteeHistoryDialogProps) => (
    <Dialog defaultOpen={defaultOpen}>
        {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
        {/* 본문이 요약 목록의 나열이라 따로 설명 문단을 두지 않는다 — radix 에 설명 없음을 알린다. */}
        <DialogContent aria-describedby={undefined}>
            <DialogHeader>
                <DialogTitle>보증이력</DialogTitle>
            </DialogHeader>
            <div className={cn(dialogBodyClassName, 'gap-6')}>
                {/* 상단 — 어느 기업의 이력인지와 그 상태. 다른 구획과 달리 파란 면으로 두어 머리로 읽힌다. */}
                <div className="bg-primary-subtle border-navy-200 flex flex-col gap-4 rounded-lg border p-6">
                    {/* 좁은 화면에서는 배지를 이름 위로 올린다 — 옆에 두면 이름에 남는 폭이 125 밖에 되지
                        않아 긴 이름이 석 줄로 접힌다(신청 카드의 상태 배지와 같은 배치다). */}
                    <div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:justify-between sm:gap-4">
                        {/* 이름은 줄여 보이지 않는다 — 어느 기업의 이력인지가 이 모달의 첫 정보라, 길면
                            말줄임 대신 줄을 바꾼다. 줄바꿈은 폭에 맡긴다 — 괄호 뒤에서만 끊으면
                            "(주)" 한 조각이 첫 줄에 남는다. */}
                        <h3 className="typo-title-l-bold text-foreground min-w-0 flex-1">{values.companyName}</h3>
                        <Badge variant="outline" color="info" shape="pill" size="sm">
                            {values.status}
                        </Badge>
                    </div>
                    <dl className="flex flex-col gap-2">
                        <TopDetail term="사업자번호">{values.businessNumber}</TopDetail>
                        <TopDetail term="업종코드">{values.industryCode}</TopDetail>
                    </dl>
                </div>

                <Section title="기업 담당자">
                    <SummaryList>
                        <SummaryListItem term="이름">{values.manager.name}</SummaryListItem>
                        <SummaryListItem term="연락처">{values.manager.tel}</SummaryListItem>
                        <SummaryListItem term="이메일">{values.manager.email}</SummaryListItem>
                        <SummaryListItem term="직위">{values.manager.position}</SummaryListItem>
                        <SummaryListItem term="사업장 주소">{values.manager.address}</SummaryListItem>
                        <SummaryListItem term="회사전화번호">{values.manager.companyTel}</SummaryListItem>
                    </SummaryList>
                </Section>

                <Section title="보증추천 정보">
                    <div className="flex flex-col gap-2">
                        <p className="typo-body-xl-medium text-foreground">대출희망 금액</p>
                        <div className="grid gap-2 sm:grid-cols-3">
                            <LoanAmountBox label="운전자금" amount={values.loan.working} />
                            <LoanAmountBox label="시설자금" amount={values.loan.facility} />
                            <LoanAmountBox label="합계" amount={values.loan.working + values.loan.facility} isTotal />
                        </div>
                    </div>
                    <SummaryList>
                        <SummaryListItem term="추천 영업점">{values.branch}</SummaryListItem>
                        <SummaryListItem term="현재 다른 보증기관 이용">{values.otherGuarantee}</SummaryListItem>
                    </SummaryList>
                </Section>

                <Section title="은행담당자">
                    <SummaryList>
                        <SummaryListItem term="이름">{values.bank.name}</SummaryListItem>
                        <SummaryListItem term="연락처">{values.bank.tel}</SummaryListItem>
                        <SummaryListItem term="직위">{values.bank.position}</SummaryListItem>
                        <SummaryListItem term="은행">{values.bank.bankName}</SummaryListItem>
                        <SummaryListItem term="영업점명">{values.bank.branchName}</SummaryListItem>
                    </SummaryList>
                </Section>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="tertiary" size="xl" className="w-full">
                        닫기
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export {GUARANTEE_HISTORY_SAMPLE, GuaranteeHistoryDialog}
export type {GuaranteeHistoryDialogProps, GuaranteeHistoryValues}
