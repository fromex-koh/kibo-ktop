// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {ESignatureDialog, PREVIEW_BUSINESS_NUMBER} from '@/components/composite/e-signature-dialog'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '약정서 전자서명 (ESignatureDialog)'}

const USAGE_CODE = `import {ESignatureDialog} from '@/components/composite/e-signature-dialog'

<ESignatureDialog
  open={isSignatureOpen}
  onOpenChange={setIsSignatureOpen}
  businessType={member.isCorporation ? 'corporation' : 'individual'}
  businessNumber={member.businessNumber}
  // 인증 모듈 결과 — 성공 true · 실패 false(Promise 가능). 예외가 나도 실패로 처리한다.
  // residentNumber(대표자 주민등록번호)는 개인인증일 때만 있다 — 법인인증은 businessNumber 로 확인한다.
  onCertify={async ({method, certificate, residentNumber}) => certify({method, certificate, residentNumber})}
  // 고를 수 있는 인증을 모두 마쳐야 [제출하기]가 나타난다 — 완료 여부를 다시 확인할 필요 없다.
  onSubmit={() => router.push(nextHref)}
/>`

const FLOW_COLUMNS = [
    {key: 'step', header: '단계', align: 'start', rowHeader: true},
    {key: 'what', header: '화면', align: 'start', wrap: true},
] as const

const FLOW_ROWS = [
    {
        key: 'input',
        cells: [
            '인증 선택',
            '법인인증은 사업자등록번호(읽기 전용)만 보이고 바로 [인증서로 인증하기]를 누릅니다. 개인인증은 대표자 주민등록번호(앞 6 · 뒤 7)를 다 채워야 열립니다.',
        ],
    },
    {
        key: 'certificate',
        cells: [
            '인증서 선택',
            '[인증서로 인증하기]를 누르면 인증서 선택 모달(CertificateSelectDialog)이 위에 겹쳐 뜹니다.',
        ],
    },
    {
        key: 'success',
        cells: [
            '성공',
            "칩에 [인증완료] 배지 · '공동인증서로 인증했습니다.' 안내, 주민등록번호 칸은 읽기 전용으로 잠깁니다. 남은 인증이 있으면 그 칩으로 자동 전환합니다.",
        ],
    },
    {
        key: 'failure',
        cells: [
            '실패',
            '법인인증은 사업자등록번호 칸, 개인인증은 주민등록번호 칸이 빨간 테두리가 되고 인증별 오류 문구가 뜹니다. 주민등록번호를 고치면 지워집니다.',
        ],
    },
    {
        key: 'submit',
        cells: [
            '제출',
            '고를 수 있는 인증을 모두 마치면 버튼이 [제출하기]로 바뀝니다. 법인기업은 법인 · 개인 2건, 개인기업은 개인 1건입니다.',
        ],
    },
    {
        key: 'reopen',
        cells: [
            '다시 열기',
            '칩을 오가거나 모달을 닫았다 열어도 입력값 · 결과가 남고, 다시 열면 남은 인증 칩으로 엽니다(같은 화면에 있는 동안).',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'ESignatureDialog',
        'children',
        '모달을 여는 버튼입니다. 넘기지 않으면 open · defaultOpen 으로만 엽니다.',
        '-',
        'ReactNode',
    ],
    [
        'ESignatureDialog',
        'open · onOpenChange',
        '여는 시점을 바깥에서 정할 때 함께 넘깁니다.',
        '-',
        'boolean · (open) => void',
    ],
    ['ESignatureDialog', 'defaultOpen', '트리거 없이 처음부터 열어 둡니다(모달 단독 화면).', 'false', 'boolean'],
    [
        'ESignatureDialog',
        'businessType',
        "사업자 유형입니다. 'corporation' 은 법인 · 개인인증 2건, 'individual' 은 개인인증 1건입니다.",
        "'corporation'",
        "'corporation' | 'individual'",
    ],
    [
        'ESignatureDialog',
        'defaultMethod',
        '처음 고른 인증입니다(법인기업에서만 의미가 있습니다).',
        "'corporate'",
        "'corporate' | 'personal'",
    ],
    [
        'ESignatureDialog',
        'businessNumber',
        '사업자등록번호입니다(필수). 법인인증 화면에 읽기 전용으로 보입니다. 회원정보 값을 넘깁니다.',
        '-',
        'string',
    ],
    [
        'ESignatureDialog',
        'onCertify',
        '인증서를 고르면 불립니다. 인증 모듈을 열고 성공이면 true, 실패면 false 를 돌려줍니다. residentNumber 는 개인인증일 때만 있습니다. 넘기지 않으면 성공으로 봅니다.',
        '-',
        '({method, certificate, residentNumber?}) => boolean | Promise<boolean>',
    ],
    ['ESignatureDialog', 'onSubmit', '인증을 모두 마친 뒤 [제출하기]를 누르면 불립니다.', '-', '() => void'],
    [
        'ESignatureDialog',
        'previewResult · previewFailCertificate',
        '퍼블리싱 확인 화면 전용입니다(모든 인증을 시작할 결과 · 실패로 볼 인증서). 실서비스에서는 넘기지 않습니다.',
        '-',
        'object · CertificateType',
    ],
] as const

const ESignatureDialogGuidePage = () => (
    <GuidePageShell
        title="약정서 전자서명 (ESignatureDialog)"
        description="기업 고객정보활용동의(기술평가 4개 모형 · 마이페이지 대표자 이력)의 [동의 후 인증서명]에서 여는 모달입니다."
    >
        <BaseCard>
            <section aria-labelledby="esign-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="esign-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        사업자 유형 · 사업자등록번호 · 인증 결과 함수만 넘기면 됩니다. 법인인증은 사업자등록번호만
                        보이고, 개인인증은 대표자 주민등록번호만 받습니다. 칩 전환 · 결과 표시 · 포커스 이동은 모달이
                        처리합니다. 아래 버튼으로 경우마다 열어 볼 수 있습니다(인증서 선택에서 공동인증서는 성공,
                        금융인증서는 실패로 보입니다).
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <ESignatureDialog businessNumber={PREVIEW_BUSINESS_NUMBER} previewFailCertificate="financial">
                        <Button type="button" variant="tertiary" size="md">
                            법인기업 열기
                        </Button>
                    </ESignatureDialog>
                    <ESignatureDialog
                        businessType="individual"
                        businessNumber={PREVIEW_BUSINESS_NUMBER}
                        previewFailCertificate="financial"
                    >
                        <Button type="button" variant="tertiary" size="md">
                            개인기업 열기
                        </Button>
                    </ESignatureDialog>
                    <ESignatureDialog
                        businessNumber={PREVIEW_BUSINESS_NUMBER}
                        previewResult={{status: 'success', residentNumber: {front: '800101', back: '1234567'}}}
                    >
                        <Button type="button" variant="tertiary" size="md">
                            인증 완료 상태
                        </Button>
                    </ESignatureDialog>
                    <ESignatureDialog
                        businessNumber={PREVIEW_BUSINESS_NUMBER}
                        previewResult={{status: 'failure', residentNumber: {front: '800101', back: '1234567'}}}
                    >
                        <Button type="button" variant="tertiary" size="md">
                            인증 실패 상태
                        </Button>
                    </ESignatureDialog>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="esign-flow" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="esign-flow" className="typo-h4-bold">
                        흐름
                    </h2>
                </div>
                <Table caption="약정서 전자서명 흐름" columns={FLOW_COLUMNS} rows={FLOW_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="esign-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="esign-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>주민등록번호 칸은 앞자리 · 뒷자리마다 이름(aria-label)을 갖고, 뒷자리는 가립니다[7.4.1].</li>
                    <li>
                        실패하면 칸(법인인증은 사업자등록번호, 개인인증은 주민등록번호)에 aria-invalid 와 오류 문구
                        연결(aria-describedby)을 걸고 오류 문구는 role=&quot;alert&quot; 로 바로 읽힙니다[7.4.2].
                    </li>
                    <li>
                        결과가 나오면 그 자리로 스크롤 · 포커스를 옮깁니다 — 성공은 완료 안내, 실패와 자동 전환은 그
                        인증의 첫 칸(사업자등록번호 또는 주민등록번호 앞자리). 동작 줄이기 설정이면 바로
                        이동합니다[6.3.1].
                    </li>
                    <li>인증 칩은 라디오 그룹(이름 &apos;인증 방식&apos;)이라 방향키로 고릅니다[6.1.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="esign-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="esign-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="ESignatureDialog Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ESignatureDialogGuidePage
