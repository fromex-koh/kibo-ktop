// 필수 동의사항 본문 — 시안 "[공통] 모달"의 내부 스크롤 케이스(40006522:18538) 전문을 옮긴 것이다.
// 화면 코드에 긴 약관 문구를 섞지 않으려고 데이터만 분리했다. 렌더는 dialog 가이드의 '내부 스크롤' 케이스가 한다.
// 타이포는 시안 그대로 섹션 20 Bold · 소제목 18 Bold · 그룹명 16 Medium · 본문 16 Regular 로 대응한다.

// label = 항목 묶음의 이름(16 Medium), text = 본문 한 줄(16 Regular)
type ConsentLine = {kind: 'label' | 'text'; text: string}
type ConsentBlock = {heading: string; lines: readonly ConsentLine[]}
// 화면에서 항목 하나만 골라 보여줄 수 있도록 섹션마다 id 를 둔다.
// 필수는 앞 세 개가 기업(신용)정보, 뒤 세 개가 개인(고유식별)정보 사항이고, corp-tax 는 선택 사항이다.
type ConsentSectionId =
    | 'corp-collect'
    | 'corp-provide'
    | 'corp-inquiry'
    | 'personal-collect'
    | 'personal-provide'
    | 'personal-inquiry'
    | 'corp-tax'
// question — 그 절 하나만 여는 '내용보기' 모달 맨 아래에 큰 글자로 묻는 한 줄.
// 전문을 통째로 보는 모달은 절마다 묻지 않고 끝에서 한 번만 묻는다(CONSENT_QUESTION).
type ConsentSection = {
    id: ConsentSectionId
    heading: string
    question: string
    blocks: readonly ConsentBlock[]
}

const CONSENT_TITLE = '필수 동의사항'
const CONSENT_QUESTION = '모든 필수 항목 제공에 동의하십니까?'

// 선택 동의사항 — 필수 동의를 마친 뒤 이어서 묻는다. 화면의 '4.세무회계자료의 온라인 제출에 관한 사항'
// 항목이 여기에 해당하며, 그 항목의 '내용보기'도 같은 절을 보여준다.
const OPTIONAL_CONSENT_TITLE = '선택 동의사항'
const OPTIONAL_CONSENT_QUESTION = '모든 선택 항목 제공에 동의하십니까?'

const OPTIONAL_CONSENT_SECTIONS: readonly ConsentSection[] = [
    {
        id: 'corp-tax',
        heading: '1.세무회계자료의 온라인 제출에 관한 사항 (선택 사항)',
        question: '위 세무회계자료의 온라인 제출에 동의하십니까?',
        blocks: [
            {
                heading: '제출목적',
                lines: [
                    {kind: 'text', text: '기술평가 등 진행'},
                    {kind: 'text', text: '분쟁 해결, 민원 처리, 법령상 의무이행, 통계업무'},
                ],
            },
            {
                heading: '동의의 효력기간',
                lines: [{kind: 'text', text: '기술평가가 완료된 날부터 5년까지'}],
            },
            {
                heading: '거부 권리 및 불이익',
                lines: [
                    {
                        kind: 'text',
                        text: '기업은 동의를 거부할 권리가 있으며, 동의를 거부한 경우에는 고객께서 관련 서류를 직접 발급받아 제출하셔야 합니다.',
                    },
                ],
            },
            {
                heading: '제출항목',
                lines: [{kind: 'text', text: '결산확정 재무제표, 표준재무제표증명 등'}],
            },
            {
                heading: '동의내용',
                lines: [
                    {
                        kind: 'text',
                        text: '위 업무의 처리를 위해 기보가 세무회계자료의 온라인 제출을 요청한 경우, 귀사가 직접 또는 귀사의 별도 동의없이 귀사의 기장 대행 세무사(회계사)가 기보에 세무회계자료를 전송',
                    },
                    {kind: 'text', text: '온라인 제출과 관련하여 비용이 발생하는 경우 귀사가 수수료를 부담'},
                ],
            },
        ],
    },
]

const CONSENT_SECTIONS: readonly ConsentSection[] = [
    {
        id: 'corp-collect',
        heading: '1.수집, 이용에 관한 사항 (필수 사항)',
        question: '위 기업(신용)정보 수집·이용에 동의하십니까?',
        blocks: [
            {
                heading: '수집·이용 목적',
                lines: [
                    {kind: 'text', text: '기술평가와 관련된 업무 수행(경영주 본인확인 등)'},
                    {kind: 'text', text: '기술평가 관련 자료 관리 및 통계업무'},
                    {kind: 'text', text: '기술보증기금법 제28조제1항제6호 ‘기술평가’에 의한 업무 수행'},
                    {
                        kind: 'text',
                        text: '분쟁 해결, 민원 처리 및 법령상 의무 이행 등보유 및 이용기간기술평가가 완료된 날부터 5년까지 보유·이용거부',
                    },
                ],
            },
            {
                heading: '보유 및 이용기간',
                lines: [{kind: 'text', text: '기술평가가 완료된 날부터 5년까지 보유·이용'}],
            },
            {
                heading: '거부 권리 및 불이익',
                lines: [
                    {
                        kind: 'text',
                        text: '귀사는 동의를 거부하실 수 있습니다. 다만, 위 기업(신용)정보 수집·이용에 관한 동의는 “기술평가 진행을 위한” 필수사항으로, 거부하실 경우 기술평가를 받을 수 없는 불이익이 발생할 수 있습니다.',
                    },
                ],
            },
            {
                heading: '수집·이용 항목',
                lines: [
                    {kind: 'label', text: '기업(신용)정보'},
                    {kind: 'label', text: '기업정보'},
                    {
                        kind: 'text',
                        text: '상호, 법인등록번호, 사업자등록번호, 본점 및 사업장 주소, 대표자 성명 및 개인식별번호, 전화번호·Fax번호·E-mail주소 등 연락처, 기업 홈페이지·SNS 주소 등',
                    },
                    {kind: 'label', text: '신용거래정보'},
                    {
                        kind: 'text',
                        text: '대출, 보증, 투자, 채무보증, 담보제공, 당좌거래, 신용카드, 시설대여 및 할부금융 거래, 지식재산공제부금 등',
                    },
                    {kind: 'label', text: '신용능력정보'},
                    {
                        kind: 'text',
                        text: '기업의 연혁ㆍ영업실태ㆍ주식 또는 지분보유 현황 등 기업의 개황, 대표자 및 임원에 관한 사항, 재무제표 등 재무에 관한 사항, 소유부동산 정보(종류 및 면적정보, 부동산 권리내용 등) 등',
                    },
                    {kind: 'label', text: '※ 기타정보 등'},
                    {
                        kind: 'text',
                        text: '기업신용등급, 기술정보, 기술신용정보, 기술평가정보, 대안평가정보, 지식재산권정보 등',
                    },
                ],
            },
        ],
    },
    {
        id: 'corp-provide',
        heading: '2.제공에 관한 사항 (필수 사항)',
        question: '위 기업(신용)정보 제공에 동의하십니까?',
        blocks: [
            {
                heading: '제공받는 자',
                lines: [
                    {kind: 'text', text: '① 신용정보회사 : 한국평가데이터㈜, NICE평가정보㈜, 코리아크레딧뷰로㈜ 등'},
                    {kind: 'text', text: '② 신용정보집중기관 : 한국신용정보원 등'},
                    {
                        kind: 'text',
                        text: '③ 기술보증기금법 제2조제3호에 의한 금융회사 및 벤처(창업)투자회사·조합 및 기관 등',
                    },
                    {kind: 'text', text: '④ 여신전문금융업법에 따라 신기술사업금융업의 등록을 한 여신전문금융회사'},
                    {
                        kind: 'text',
                        text: '⑤ 국가(중소벤처기업부, 과학기술정보통신부 등), 지방자치단체, 국민건강보험공단,국민연금공단, 근로복지공단, 그 밖의 공공단체',
                    },
                    {
                        kind: 'text',
                        text: '⑥ 기금과 K-TOP 공동활용 협약을 체결 또는 K-TOP 프리미엄 회원 이용권을 보유한 공공기관 운영법 제4조에 따른 공공기관',
                    },
                    {
                        kind: 'text',
                        text: '⑦ 기금과 K-TOP 공동활용 협약을 체결 또는 K-TOP 프리미엄 회원 이용권을 보유한 연구개발특구의 육성에 관한 특별법 시행령 제3조에 의한 공공연구기관',
                    },
                    {
                        kind: 'text',
                        text: '⑧ 기금과 K-TOP 공동활용 협약을 체결 또는 K-TOP 프리미엄 회원 이용권을 보유한 기술의 이전 및 사업화 촉진에 관한 법률 제35조에 의한 기술평가기관',
                    },
                    {kind: 'text', text: '⑨ K-TOP 프리미엄 회원 이용권을 보유한 (중소기업기본법에 따른) 중소기업'},
                    {kind: 'text', text: '⑩ 업무수탁기관 : 고객만족도조사·고객센터·DM발송 업무 수탁업체'},
                ],
            },
            {
                heading: '제공받는 자의 이용목적',
                lines: [
                    {
                        kind: 'text',
                        text: '①~④ 당사의 신용을 판단하기 위한 자료로 활용, 신용정보회사의 경우 제3자에게 제공ㆍ활용, 여신 또는 투자 심사를 위한 판단자료로 이용',
                    },
                    {
                        kind: 'text',
                        text: '⑤ 해당기관 등의 고유업무 처리, 관련법에 따른 정당한 업무처리, 또는 정책자료로 활용 목적',
                    },
                    {kind: 'text', text: '⑥~⑦ 기업‧기술 등 집단 분석을 통한 정책자료로 활용 목적'},
                    {kind: 'text', text: '⑧ 기술평가 등 관련법에 따른 정당한 업무처리'},
                    {kind: 'text', text: '⑨ 타 중소기업의 K-TOP 내 평가정보 조회를 통한 신규거래처·관심기업 탐색 등'},
                    {kind: 'text', text: '⑩ 만족도 조사 등 수탁 업무 수행'},
                ],
            },
            {
                heading: '보유 및 이용기간',
                lines: [{kind: 'text', text: '기술평가가 완료된 날부터 5년까지 보유·이용'}],
            },
            {
                heading: '거부 권리 및 불이익',
                lines: [
                    {
                        kind: 'text',
                        text: '귀사는 동의를 거부하실 수 있습니다. 다만, 위 기업(신용)정보 제공에 관한 동의는 “기술평가 진행을 위한” 필수사항으로, 거부하실 경우 기술평가를 받을 수 없는 불이익이 발생할 수 있습니다.',
                    },
                ],
            },
            {
                heading: '수집·이용 항목',
                lines: [
                    {kind: 'label', text: '제공받는 자 ①~④ 제공 항목'},
                    {kind: 'label', text: '기업정보'},
                    {
                        kind: 'text',
                        text: '상호, 법인등록번호, 사업자등록번호, 본점 및 사업장 주소, 대표자 성명 및 개인식별번호, 전화번호·Fax번호·E-mail주소 등 연락처, 기업 홈페이지·SNS 주소 등',
                    },
                    {kind: 'label', text: '신용거래정보'},
                    {
                        kind: 'text',
                        text: '대출, 보증, 투자, 채무보증, 담보제공, 당좌거래, 신용카드, 시설대여 및 할부금융 거래, 지식재산공제부금 등',
                    },
                    {kind: 'label', text: '신용능력정보'},
                    {
                        kind: 'text',
                        text: '기업의 연혁ㆍ영업실태ㆍ주식 또는 지분보유 현황 등 기업의 개황, 대표자 및 임원에 관한 사항, 재무제표 등 재무에 관한 사항, 소유부동산 정보(종류 및 면적정보, 부동산 권리내용 등) 등',
                    },
                    {kind: 'label', text: '※ 기타정보 등'},
                    {
                        kind: 'text',
                        text: '기업신용등급, 기술정보, 기술신용정보, 기술평가정보, 대안평가정보, 지식재산권정보 등',
                    },
                    {kind: 'label', text: '제공받는 자 ⑤~⑦ 제공 항목'},
                    {
                        kind: 'text',
                        text: '상호, 법인등록번호, 사업자등록번호, 본점 및 사업장 주소, 대표자 성명 및 개인식별번호, 전화번호·Fax번호·E-mail주소 등 연락처 등, 업종, 기술정보, 기술신용정보, 기술평가정보, 대안평가정보, 지식재산권정보 등',
                    },
                    {kind: 'label', text: '제공받는 자 ⑧ 제공 항목'},
                    {
                        kind: 'text',
                        text: '상호, 법인등록번호, 사업자등록번호, 본점 및 사업장 주소, 대표자 성명 및 개인식별번호, 기술정보, 기술신용정보, 기술평가정보, 대안평가정보, 지식재산권정보 등 (자가진단 기술평가정보(기술사업평가정보, 기술혁신역량지수(Tech-Index) 정보, 기술의 원천성 판단정보 포함)',
                    },
                    {kind: 'label', text: '제공받는 자 ⑨ 제공 항목'},
                    {
                        kind: 'text',
                        text: '대상기업체 및 관계자 식별정보, 기술평가 진행 현황, 연락처 등 수탁업무에 필요한 정보에 한함',
                    },
                ],
            },
        ],
    },
    {
        id: 'corp-inquiry',
        heading: '3.조회에 관한 사항 (필수 사항)',
        question: '위 기업(신용)정보 조회에 동의하십니까?',
        blocks: [
            {
                heading: '조회 대상 기관',
                lines: [{kind: 'text', text: '제공받는 자와 동일'}],
            },
            {
                heading: '조회 목적',
                lines: [
                    {kind: 'text', text: '기술평가와 관련된 업무 수행(경영주 본인확인 등)'},
                    {kind: 'text', text: '기술평가 관련 자료 관리 및 통계업무'},
                    {kind: 'text', text: '기술보증기금법 제28조제1항제6호 ‘기술평가’에 의한 업무 수행'},
                    {kind: 'text', text: '분쟁 해결, 민원 처리 및 법령상 의무 이행 등'},
                ],
            },
            {
                heading: '조회 동의의 효력기간',
                lines: [
                    {
                        kind: 'text',
                        text: '기보의 조회 결과 귀사와의 기술평가 등이 진행된 경우 기술평가가 완료된 시점부터 5년까지 조회 동의의 효력이 지속됩니다.',
                    },
                ],
            },
            {
                heading: '거부 권리 및 불이익',
                lines: [
                    {
                        kind: 'text',
                        text: '귀사는 동의를 거부하실 수 있습니다. 다만, 위 기업(신용)정보 조회에 관한 동의는 “기술평가 진행을 위한” 필수사항으로, 거부하실 경우 기술평가를 받을 수 없는 불이익이 발생할 수 있습니다.',
                    },
                ],
            },
            {
                heading: '조회 항목',
                lines: [
                    {kind: 'label', text: '기업(신용)정보'},
                    {kind: 'text', text: '제공에 관한 사항의 제공 항목과 동일'},
                ],
            },
        ],
    },
    {
        id: 'personal-collect',
        heading: '4.수집, 이용에 관한 사항 (필수 사항)',
        question: '위 고유식별정보 수집·이용에 동의하십니까?',
        blocks: [
            {
                heading: '수집·이용 목적',
                lines: [
                    {kind: 'text', text: '기술평가와 관련된 업무 수행(경영주 본인확인 등)'},
                    {kind: 'text', text: '기술평가 관련 자료 관리 및 통계업무'},
                    {kind: 'text', text: '기술보증기금법 제28조제1항제6호 ‘기술평가’에 의한 업무 수행'},
                    {kind: 'text', text: '분쟁 해결, 민원 처리 및 법령상 의무 이행 등'},
                ],
            },
            {
                heading: '보유 및 이용기간',
                lines: [{kind: 'text', text: '기술평가가 완료된 날부터 5년까지 보유·이용'}],
            },
            {
                heading: '거부 권리 및 불이익',
                lines: [
                    {
                        kind: 'text',
                        text: '귀사는 동의를 거부하실 수 있습니다. 다만, 위 기업(신용)정보 수집·이용에 관한 동의는 “기술평가 진행을 위한” 필수사항으로, 거부하실 경우 기술평가를 받을 수 없는 불이익이 발생할 수 있습니다.',
                    },
                ],
            },
            {
                heading: '수집·이용 항목',
                lines: [
                    {kind: 'label', text: '고유식별정보'},
                    {kind: 'text', text: '주민등록번호, 외국인등록번호'},
                    {kind: 'label', text: '개인(신용)정보'},
                    {kind: 'label', text: '일반개인정보'},
                    {
                        kind: 'text',
                        text: '성명, 전화번호·Fax번호·E-mail주소 등 연락처, 경력 정보, 직장정보(사업장명, 대표자명, 사업장 주소, 사업장 전화번호, 자격취득일, 급여정보 등), 수상경력, 보유 자격증 등',
                    },
                    {kind: 'label', text: '※ 기타정보 등'},
                    {
                        kind: 'text',
                        text: '기술정보, 기술신용정보, 기술평가정보, 대안평가정보, 지식재산권정보, 기타 기술평가 등 진행을 통해 생성되는 정보',
                    },
                ],
            },
        ],
    },
    {
        id: 'personal-provide',
        heading: '5.제공에 관한 사항 (필수 사항)',
        question: '위 고유식별정보 제공에 동의하십니까? (단, ①②⑤에 한함)',
        blocks: [
            {
                heading: '제공받는 자',
                lines: [
                    {kind: 'text', text: '① 신용정보회사 : 한국평가데이터㈜, NICE평가정보㈜, 코리아크레딧뷰로㈜ 등'},
                    {kind: 'text', text: '② 신용정보집중기관 : 한국신용정보원 등'},
                    {
                        kind: 'text',
                        text: '③ 기술보증기금법 제2조제3호에 의한 금융회사 및 벤처(창업)투자회사·조합 및 기관 등',
                    },
                    {kind: 'text', text: '④ 여신전문금융업법에 따라 신기술사업금융업의 등록을 한 여신전문금융회사'},
                    {
                        kind: 'text',
                        text: '⑤ 국가(중소벤처기업부, 과학기술정보통신부 등), 지방자치단체, 국민건강보험공단,국민연금공단, 근로복지공단, 그 밖의 공공단체',
                    },
                    {
                        kind: 'text',
                        text: '⑥ 기금과 K-TOP 공동활용 협약을 체결 또는 K-TOP 프리미엄 회원 이용권을 보유한 공공기관 운영법 제4조에 따른 공공기관',
                    },
                    {
                        kind: 'text',
                        text: '⑦ 기금과 K-TOP 공동활용 협약을 체결 또는 K-TOP 프리미엄 회원 이용권을 보유한 연구개발특구의 육성에 관한 특별법 시행령 제3조에 의한 공공연구기관',
                    },
                    {
                        kind: 'text',
                        text: '⑧ 기금과 K-TOP 공동활용 협약을 체결 또는 K-TOP 프리미엄 회원 이용권을 보유한 기술의 이전 및 사업화 촉진에 관한 법률 제35조에 의한 기술평가기관',
                    },
                    {kind: 'text', text: '⑨ K-TOP 프리미엄 회원 이용권을 보유한 (중소기업기본법에 따른) 중소기업'},
                    {kind: 'text', text: '⑩ 업무수탁기관 : 고객만족도조사·고객센터·DM발송 업무 수탁업체'},
                ],
            },
            {
                heading: '제공받는 자의 이용목적',
                lines: [
                    {
                        kind: 'text',
                        text: '①~④ 당사의 신용을 판단하기 위한 자료로 활용, 신용정보회사의 경우 제3자에게 제공ㆍ활용, 여신 또는 투자 심사를 위한 판단자료로 이용',
                    },
                    {
                        kind: 'text',
                        text: '⑤ 해당기관 등의 고유업무 처리, 관련법에 따른 정당한 업무처리, 또는 정책자료로 활용 목적',
                    },
                    {kind: 'text', text: '⑥~⑦ 기업‧기술 등 집단 분석을 통한 정책자료로 활용 목적'},
                    {kind: 'text', text: '⑧ 기술평가 등 관련법에 따른 정당한 업무처리'},
                    {kind: 'text', text: '⑨ 타 중소기업의 K-TOP 내 평가정보 조회를 통한 신규거래처·관심기업 탐색 등'},
                    {kind: 'text', text: '⑩ 만족도 조사 등 수탁 업무 수행'},
                ],
            },
            {
                heading: '보유 및 이용기간',
                lines: [{kind: 'text', text: '기술평가가 완료된 날부터 5년까지 보유·이용'}],
            },
            {
                heading: '거부 권리 및 불이익',
                lines: [
                    {
                        kind: 'text',
                        text: '귀사는 동의를 거부하실 수 있습니다. 다만, 위 기업(신용)정보 제공에 관한 동의는 “기술평가 진행을 위한” 필수사항으로, 거부하실 경우 기술평가를 받을 수 없는 불이익이 발생할 수 있습니다.',
                    },
                ],
            },
            {
                heading: '수집·이용 항목',
                lines: [
                    {kind: 'label', text: '고유식별정보'},
                    {kind: 'text', text: '주민등록번호, 외국인등록번호'},
                    {kind: 'label', text: '제공받는 자 ①~⑧ 제공 항목'},
                    {kind: 'label', text: '일반개인정보'},
                    {
                        kind: 'text',
                        text: '성명, 생년월일, 전화번호·Fax번호·E-mail주소 등 연락처, 경력 정보, 직장정보(사업장명, 대표자명, 사업장 주소, 사업장 전화번호, 자격취득일, 급여정보 등), 수상경력, 보유 자격증 등',
                    },
                    {kind: 'label', text: '※ 기타정보 등'},
                    {
                        kind: 'text',
                        text: '기술정보, 기술신용정보, 기술평가정보, 대안평가정보, 지식재산권정보, 기타 기술평가 등 진행을 통해 생성되는 정보',
                    },
                    {kind: 'label', text: '제공받는 자 ⑨ 제공 항목'},
                    {
                        kind: 'text',
                        text: '성명, 생년월일, 전화번호·Fax번호·E-mail주소 등 연락처, 지식재산권 정보, 기술정보, 기술신용정보, 기술평가정보, 기타 기술평가 등 진행을 통해 생성되는 정보에 한함',
                    },
                    {kind: 'label', text: '제공받는 자 ⑩ 제공 항목'},
                    {
                        kind: 'text',
                        text: '성명, 전화번호·Fax번호·E-mail주소 등 연락처, 기술평가 진행 현황, 연락처 등 수탁업무에 필요한 정보에 한함',
                    },
                ],
            },
        ],
    },
    {
        id: 'personal-inquiry',
        heading: '6.조회에 관한 사항 (필수 사항)',
        question: '위 고유식별정보 조회에 동의하십니까?',
        blocks: [
            {
                heading: '조회 대상 기관',
                lines: [{kind: 'text', text: '제공받는 자와 동일'}],
            },
            {
                heading: '조회 목적',
                lines: [
                    {kind: 'text', text: '기술평가와 관련된 업무 수행(경영주 본인확인 등)'},
                    {kind: 'text', text: '기술평가 관련 자료 관리 및 통계업무'},
                    {kind: 'text', text: '기술보증기금법 제28조제1항제6호 ‘기술평가’에 의한 업무 수행'},
                    {kind: 'text', text: '분쟁 해결, 민원 처리 및 법령상 의무 이행 등'},
                ],
            },
            {
                heading: '조회 동의의 효력기간',
                lines: [
                    {
                        kind: 'text',
                        text: '기보의 조회 결과 귀사와의 기술평가 등이 진행된 경우 기술평가가 완료된 시점부터 5년까지 조회 동의의 효력이 지속됩니다.',
                    },
                ],
            },
            {
                heading: '거부 권리 및 불이익',
                lines: [
                    {
                        kind: 'text',
                        text: '귀사는 동의를 거부하실 수 있습니다. 다만, 위 기업(신용)정보 조회에 관한 동의는 “기술평가 진행을 위한” 필수사항으로, 거부하실 경우 기술평가를 받을 수 없는 불이익이 발생할 수 있습니다.',
                    },
                ],
            },
            {
                heading: '조회 항목',
                lines: [
                    {kind: 'label', text: '고유식별정보'},
                    {kind: 'text', text: '주민등록번호, 외국인등록번호'},
                    {kind: 'label', text: '개인(신용)정보'},
                    {kind: 'text', text: '제공에 관한 사항의 제공 항목과 동일'},
                ],
            },
        ],
    },
]

// 항목 하나짜리 '내용보기' 모달이 쓰는 조회 함수. 필수·선택 어느 쪽 절이든 찾는다.
const findConsentSection = (id: ConsentSectionId) =>
    [...CONSENT_SECTIONS, ...OPTIONAL_CONSENT_SECTIONS].find((section) => section.id === id)

// 그 절이 선택 사항인지 — 모달 제목을 '필수 동의사항'과 '선택 동의사항' 중에서 고르는 데 쓴다.
const isOptionalConsentSection = (id: ConsentSectionId) =>
    OPTIONAL_CONSENT_SECTIONS.some((section) => section.id === id)

export type {ConsentBlock, ConsentLine, ConsentSection, ConsentSectionId}
export {
    CONSENT_QUESTION,
    CONSENT_SECTIONS,
    CONSENT_TITLE,
    OPTIONAL_CONSENT_QUESTION,
    OPTIONAL_CONSENT_SECTIONS,
    OPTIONAL_CONSENT_TITLE,
    findConsentSection,
    isOptionalConsentSection,
}
