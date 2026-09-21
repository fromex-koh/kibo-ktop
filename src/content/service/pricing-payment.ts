// 결제하기 화면(PricingPayment)의 문구 — 시안 "SB-FOTA-CM4-0001_가격 정책_결제하기"(40007578:164378) 그대로다.
// 고른 이용권(상품명·제공횟수·금액)은 가격정책의 PAID_PLANS(content/service/pricing.ts)에서 가져온다.
//
// [프론트엔드 연동] 이용 기간은 결제 시점 기준으로 서버가 계산해 내려 준다 — 아래 USAGE_PERIOD 는 시안 표기
// 그대로의 목업이다(결제하기의 이용개시 줄과 결제 완료 모달이 함께 쓴다).

// 이용권 가격은 부가세 포함이다 — 공급가액 = 가격 ÷ 1.1, 부가세 = 가격 − 공급가액.
const VAT_RATE = 0.1

const USAGE_PERIOD = '2026-09-17 ~ 2026-10-16'
const USAGE_START = `결제 완료 시 즉시(${USAGE_PERIOD})`

// 결제 완료 모달(PaymentCompleteDialog) — 시안 "SB-FOTA-CM4-0001_가격 정책_결제하기_결제완료"(40007578:166348).
const PAYMENT_COMPLETE_TITLE = '결제가 완료되었습니다'

const PAYMENT_METHOD = {
    value: 'card',
    label: '신용카드',
    noticeTitle: '본 서비스의 이용권 결제는 신용카드 결제만 지원합니다.',
    notice: '결제가 완료되면 카드사에서 발급하는 카드매출전표가 결제에 대한 증빙서류가 됩니다. 회계 처리 또는 매입세액공제가 필요하신 경우, 해당 카드매출전표를 보관·활용해주시기 바랍니다.',
} as const

const PAYMENT_USAGE_GUIDE = {
    title: '이용 안내',
    items: [
        '이용기간은 이용권 개시일로부터 1개월간 이용하실 수 있습니다.',
        '만료 시 잔여 횟수는 소멸되며 이월되지 않습니다.',
        '자가 조회(본인 기업 조회), 기술혁신정보 미제공, 당일 재조회 등의 경우 이용 횟수가 차감되지 않습니다.',
        '본 보고서는 정보 제공을 목적으로 하며, 여신 등의 심사 근거나 조달청 입찰 등의 용도로 사용하실 수 없습니다.',
    ],
} as const

const REFUND_GUIDE = {
    title: '환불 안내',
    items: [
        '결제일로부터 7일 이내, 서비스를 이용하지 않으신 경우 전액 환불 가능합니다.',
        '7일 경과 또는 1회라도 이용하신 경우에는 환불되지 않습니다.',
        '본 서비스는 시스템상 이용 건수에 따른 부분(일할) 환불을 지원하지 않습니다. 이용권은 사용여부(미사용/1건 이상 사용)를 기준으로만 환불 가능 여부가 결정되는 점을 결제 전 반드시 확인하여 주시기 바랍니다.',
        '(환불 신청 경로) 마이페이지-유료 서비스 관리-환불하기',
    ],
} as const

// 판매자 정보 모달(SellerInfoDialog) — 시안 "SB-FOTA-CM4-0001_가격 정책_결제하기_판매자정보"(40007578:166316).
const SELLER_INFO: readonly {label: string; value: string}[] = [
    {label: '상호', value: '기술보증기금'},
    {label: '대표자', value: '권형택'},
    {label: '사업자등록번호', value: '601-82-03112'},
    {label: '주소', value: '부산광역시 남구 문현금융로 33'},
    {label: '대표 전화', value: '1544-1120'},
    {label: '이메일', value: '추후 확정'},
]

const PAYMENT_AGREEMENT = '주문 내용을 확인하였으며, 이용 안내 및 환불 안내에 동의합니다.(필수)'
const PAYMENT_AGREEMENT_HINT = '필수 동의 항목에 체크하시면 결제하실 수 있습니다.'

export {
    PAYMENT_AGREEMENT,
    PAYMENT_AGREEMENT_HINT,
    PAYMENT_COMPLETE_TITLE,
    PAYMENT_METHOD,
    PAYMENT_USAGE_GUIDE,
    REFUND_GUIDE,
    SELLER_INFO,
    USAGE_PERIOD,
    USAGE_START,
    VAT_RATE,
}
