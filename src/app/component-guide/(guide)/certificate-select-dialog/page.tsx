// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {CertificateSelectDialog} from '@/components/composite/certificate-select-dialog'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '인증서 선택 (CertificateSelectDialog)'}

const USAGE_CODE = `import {CertificateSelectDialog} from '@/components/composite/certificate-select-dialog'

// 약정서 전자서명(ESignatureDialog) 안에서는 이미 연결돼 있다 — 따로 쓸 때만 아래처럼 쓴다.
<CertificateSelectDialog
  open={isCertificateOpen}
  onOpenChange={setIsCertificateOpen}
  target="법인인증 — 사업장(법인) 인증서로 인증합니다."
  onSelect={(certificate) => startCertify(certificate)} // 'joint' | 'financial'
/>`

const PROPS_ITEMS = [
    [
        'CertificateSelectDialog',
        'children',
        '모달을 여는 버튼입니다. 넘기지 않으면 open · defaultOpen 으로만 엽니다.',
        '-',
        'ReactNode',
    ],
    [
        'CertificateSelectDialog',
        'open · onOpenChange',
        '여는 시점을 바깥에서 정할 때 함께 넘깁니다.',
        '-',
        'boolean · (open) => void',
    ],
    ['CertificateSelectDialog', 'defaultOpen', '트리거 없이 처음부터 열어 둡니다(모달 단독 화면).', 'false', 'boolean'],
    [
        'CertificateSelectDialog',
        'target',
        '안내 문단 아래 점 한 줄로 보이는 지금 하는 인증 안내입니다. 넘기지 않으면 그 줄이 없습니다.',
        '-',
        'string',
    ],
    [
        'CertificateSelectDialog',
        'onSelect',
        '인증서 항목을 누르면 불립니다. 누르는 것이 곧 선택이라 아래 확인 버튼은 없습니다.',
        '-',
        "(certificate: 'joint' | 'financial') => void",
    ],
    [
        'CertificateSelectDialog',
        'onCloseAutoFocus',
        '닫힌 뒤 포커스를 옮길 자리를 바꿀 때 씁니다(Radix onCloseAutoFocus) — 전자서명 모달이 결과 자리로 옮깁니다.',
        '-',
        '(event: Event) => void',
    ],
] as const

const CertificateSelectDialogGuidePage = () => (
    <GuidePageShell
        title="인증서 선택 (CertificateSelectDialog)"
        description="약정서 전자서명의 [인증서로 인증하기]를 누르면 위에 겹쳐 뜨는 모달입니다. 공동인증서 · 금융인증서 중 하나를 고릅니다."
    >
        <BaseCard>
            <section aria-labelledby="cert-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="cert-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        안내 문단 → 지금 하는 인증 안내 한 줄(target) → [공동인증서 로그인] · [금융인증서 로그인]입니다.
                        항목에 마우스를 올리거나 누르면 파란 테두리 · 옅은 파랑 면이 되고, 키보드 포커스는 포커스 링만
                        그립니다(열리며 첫 항목에 포커스가 가도 고른 것처럼 보이지 않게).
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <CertificateSelectDialog target="법인인증 — 사업장(법인) 인증서로 인증합니다.">
                        <Button type="button" variant="tertiary" size="md">
                            법인인증 차례로 열기
                        </Button>
                    </CertificateSelectDialog>
                    <CertificateSelectDialog target="개인인증 — 대표자 개인 인증서로 인증합니다.">
                        <Button type="button" variant="tertiary" size="md">
                            개인인증 차례로 열기
                        </Button>
                    </CertificateSelectDialog>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cert-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="cert-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>항목은 button 이라 Tab · Enter/Space 로 고릅니다. 아이콘은 장식이라 숨깁니다[5.1.1][6.1.1].</li>
                    <li>
                        큰 안내 문단은 제목처럼 보여도 제목이 아니라 설명(DialogDescription)으로 두어 검사 도구가
                        제목으로 오인하지 않게 합니다[6.4.2].
                    </li>
                    <li>포커스 가두기 · Esc 닫기 · 포커스 복귀는 Dialog(Radix)가 처리합니다[8.2.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="cert-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="cert-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="CertificateSelectDialog Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default CertificateSelectDialogGuidePage
