// 마케팅 정보 수신 동의 모달(KbigxMarketingConsentDialog)의 문구 — 시안
// "K-BIGx 보고서_K-BIGx 이용약관 (필수)/마케팅 알림 수신 동의 (선택)"(40007590:12112) 그대로다.
//
// [프론트엔드 연동] 동의 문구를 CMS 등에서 받게 되면 이 파일의 값만 같은 모양으로 바꿔 넣는다.

const MARKETING_CONSENT_TITLE = 'K-BIGx(기업혁신성장보고서) 서비스 마케팅 정보 수신 동의'

const MARKETING_CONSENT_NOTICE = {
    title: '[선택] 마케팅 정보 수신 동의',
    items: [
        '기술보증기금은 K-BIGx 서비스와 관련된 정보를 안내해 드리고자 아래와 같이 개인정보를 수집·이용하고 광고성 정보를 전송하고자 합니다.',
        '본 동의는 선택사항이며, 동의하지 않으셔도 K-BIGx 서비스를 정상적으로 이용하실 수 있습니다.',
    ],
} as const

const MARKETING_CONSENT_SECTIONS: readonly {title: string; items: readonly string[]}[] = [
    {
        title: '1. 개인정보의 수집·이용 (마케팅 목적)',
        items: [
            '수집·이용 목적: 신규 서비스 및 이용권 안내, 요금제 변경 안내, 이벤트·프로모션 정보 제공 등',
            '수집·이용 항목: 담당자 성명, 소속, 이메일 주소, 휴대전화번호 등',
            '보유·이용 기간: 동의일부터 동의 철회 시 또는 K-BIGx 서비스 이용계약 종료 시까지',
            '동의를 거부하실 권리가 있으며, 거부하시더라도 서비스 이용에 제한이 없습니다.',
        ],
    },
    {
        title: '2. 광고성 정보 수신',
        items: [
            '전송자: 기술보증기금',
            '전송 매체: 전자우편, 문자메시지, 카카오 알림톡 등 전자적 전송매체',
            '전송 내용: 위 1.의 수집·이용 목적과 동일',
            '수신 동의 후에도 언제든지 수신을 거부하실 수 있습니다.',
        ],
    },
]

const MARKETING_CONSENT_FOOTNOTES = [
    '※ 관련 법령에 따라 수신 동의일부터 2년마다 수신 동의 여부를 확인하는 안내를 발송합니다.',
    '※ 서비스 이용에 필요한 안내(보고서 발급, 결제, 약관 개정 등)는 본 동의 여부와 관계없이 전송됩니다.',
] as const

export {MARKETING_CONSENT_FOOTNOTES, MARKETING_CONSENT_NOTICE, MARKETING_CONSENT_SECTIONS, MARKETING_CONSENT_TITLE}
