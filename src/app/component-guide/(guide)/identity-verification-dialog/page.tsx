// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {IdentityVerificationDialog} from '@/components/composite/identity-verification-dialog'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '본인 확인 (IdentityVerificationDialog)'}

const USAGE_CODE = `import {IdentityVerificationDialog} from '@/components/composite/identity-verification-dialog'

// 마이페이지 내 정보 — 가입 정보(items)와 비밀번호 칸
<IdentityVerificationDialog
  items={[{term: '기업명', value: member.companyName}, {term: '아이디', value: member.loginId}]}
  onSubmit={(password) => verifyPassword(password)}
>
  <Button type="button">내 정보</Button>
</IdentityVerificationDialog>

// K-BIGx 기업혁신성장보고서 조회 — 비밀번호 칸만(items 생략)
<IdentityVerificationDialog open={isOpen} onOpenChange={setIsOpen} onSubmit={verifyPassword} />`

const USE_COLUMNS = [
    {key: 'where', header: '쓰는 곳', align: 'start', rowHeader: true},
    {key: 'what', header: '본문', align: 'start', wrap: true},
] as const

const USE_ROWS = [
    {
        key: 'mypage',
        cells: [
            '마이페이지 내 정보(기업 · 기관)',
            '가입 정보(기업명 · 아이디)를 목록으로 보이고 그 아래 비밀번호 칸을 둡니다.',
        ],
    },
    {
        key: 'kbigx',
        cells: [
            'K-BIGx 기업혁신성장보고서 조회(기업 · 기관)',
            '화면에 들어올 때 뜹니다. 가입 정보 없이 비밀번호 칸만 둡니다.',
        ],
    },
] as const

const SAMPLE_ITEMS = [
    {term: '기업명', value: '프롬엑스테크'},
    {term: '아이디', value: 'fromx01'},
]

const PROPS_ITEMS = [
    [
        'IdentityVerificationDialog',
        'items',
        '확인용으로 보일 가입 정보(이름 · 값)입니다. 생략하면 목록 없이 비밀번호 칸만 그립니다.',
        '-',
        'readonly {term: string; value: ReactNode}[]',
    ],
    ['IdentityVerificationDialog', 'children', '모달을 여는 버튼입니다.', '-', 'ReactNode'],
    [
        'IdentityVerificationDialog',
        'open · onOpenChange',
        '여는 시점을 바깥에서 정할 때 함께 넘깁니다.',
        '-',
        'boolean · (open) => void',
    ],
    [
        'IdentityVerificationDialog',
        'defaultOpen',
        '트리거 없이 처음부터 열어 둡니다(모달 단독 화면).',
        'false',
        'boolean',
    ],
    [
        'IdentityVerificationDialog',
        'onSubmit',
        '비밀번호가 채워져 [확인]을 누르면 불립니다. 비어 있으면 모달이 오류 문구를 띄우고 부르지 않습니다.',
        '-',
        '(password: string) => void',
    ],
] as const

const IdentityVerificationDialogGuidePage = () => (
    <GuidePageShell
        title="본인 확인 (IdentityVerificationDialog)"
        description="비밀번호로 한 번 더 확인하는 모달입니다. 가입 정보 목록은 쓰는 곳에 따라 보이거나 빠집니다."
    >
        <BaseCard>
            <section aria-labelledby="identity-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="identity-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        비밀번호를 비운 채 [확인]을 누르면 칸 아래 오류 문구가 뜹니다. 서버가 &apos;비밀번호가 일치하지
                        않습니다&apos; 같은 답을 주면 같은 자리에 띄웁니다.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <IdentityVerificationDialog items={SAMPLE_ITEMS}>
                        <Button type="button" variant="tertiary" size="md">
                            가입 정보와 함께
                        </Button>
                    </IdentityVerificationDialog>
                    <IdentityVerificationDialog>
                        <Button type="button" variant="tertiary" size="md">
                            비밀번호 칸만
                        </Button>
                    </IdentityVerificationDialog>
                </div>
                <Table caption="본인 확인 모달 쓰는 곳" columns={USE_COLUMNS} rows={USE_ROWS} size="md" />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="identity-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="identity-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>비밀번호 칸은 보이는 이름표(label)와 연결된 필수 칸입니다[7.4.1].</li>
                    <li>
                        오류가 있으면 aria-invalid 와 오류 문구 연결(aria-describedby)을 겁니다. Enter 로도 같은 검사를
                        거칩니다[7.4.2].
                    </li>
                    <li>포커스 가두기 · Esc 닫기 · 포커스 복귀는 Dialog(Radix)가 처리합니다[8.2.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="identity-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="identity-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="IdentityVerificationDialog Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default IdentityVerificationDialogGuidePage
