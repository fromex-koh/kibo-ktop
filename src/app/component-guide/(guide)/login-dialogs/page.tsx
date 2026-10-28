// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {LoginAgencySignUpGuideDialog} from '@/components/composite/login-agency-signup-guide-dialog'
import {LoginFindAccountDialog} from '@/components/composite/login-find-account-dialog'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '로그인 안내 모달 (LoginFindAccountDialog · LoginAgencySignUpGuideDialog)'}

const USAGE_CODE = `import {LoginAgencySignUpGuideDialog} from '@/components/composite/login-agency-signup-guide-dialog'
import {LoginFindAccountDialog} from '@/components/composite/login-find-account-dialog'

// 여는 버튼(children)을 감싸면 그 버튼이 모달을 연다 — 버튼을 감싼 문단 등이 아니라 버튼을 바로 감싼다.
<LoginFindAccountDialog>
  <Button type="button" variant="text-underline" size="md" aria-haspopup="dialog">아이디 · 비밀번호 찾기</Button>
</LoginFindAccountDialog>

<LoginAgencySignUpGuideDialog>
  <Button type="button" variant="text-underline" size="md" aria-haspopup="dialog">회원가입</Button>
</LoginAgencySignUpGuideDialog>`

const DIALOG_COLUMNS = [
    {key: 'name', header: '모달', align: 'start', rowHeader: true},
    {key: 'what', header: '본문', align: 'start', wrap: true},
    {key: 'text', header: '문구 위치', align: 'start', wrap: true},
] as const

const DIALOG_ROWS = [
    {
        key: 'find',
        cells: [
            '아이디 · 비밀번호 찾기',
            '기관회원은 계정을 담당자가 발급하므로 찾기 절차 대신 서비스별 담당자 연락처(기술평가 · K-BIGx 보고서)를 알립니다. 좁은 화면에서는 연락처가 서비스 단위로 줄바꿈됩니다.',
            'content/service/login.ts — FIND_ACCOUNT_MESSAGE · FIND_ACCOUNT_CONTACTS',
        ],
    },
    {
        key: 'signup',
        cells: [
            '기관회원 가입 안내',
            '안내 상자 → 가입 대상 표 → 1~5 절차 → 강조 안내. 가입 대상 표는 최소 폭 500 을 지키고, 모달이 그보다 좁으면(모바일) 표만 좌우로 스크롤됩니다.',
            'content/service/login.ts — AGENCY_SIGN_UP_* · LOGIN_CONTACT_NUMBER(임시 번호)',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'LoginFindAccountDialog',
        'children',
        '모달을 여는 버튼입니다. Radix 가 이 요소에 열기 동작과 aria 를 얹습니다.',
        '-',
        'ReactNode',
    ],
    ['LoginFindAccountDialog', 'defaultOpen', '트리거 없이 처음부터 열어 둡니다(모달 단독 화면).', 'false', 'boolean'],
    ['LoginAgencySignUpGuideDialog', 'children', '모달을 여는 버튼입니다.', '-', 'ReactNode'],
    [
        'LoginAgencySignUpGuideDialog',
        'defaultOpen',
        '트리거 없이 처음부터 열어 둡니다(모달 단독 화면).',
        'false',
        'boolean',
    ],
] as const

const LoginDialogsGuidePage = () => (
    <GuidePageShell
        title="로그인 안내 모달"
        description="기관회원 로그인의 [아이디 · 비밀번호 찾기] · [회원가입]에서 여는 읽기 전용 안내 모달입니다. 연동할 동작은 없고 문구만 관리합니다."
    >
        <BaseCard>
            <section aria-labelledby="login-dialogs-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="login-dialogs-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        여는 버튼을 children 으로 바로 감쌉니다. 버튼을 담은 문단 같은 다른 요소를 감싸면 여는 동작이
                        버튼에 닿지 않아 눌러도 열리지 않습니다.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <LoginFindAccountDialog>
                        <Button type="button" variant="tertiary" size="md" aria-haspopup="dialog">
                            아이디 · 비밀번호 찾기
                        </Button>
                    </LoginFindAccountDialog>
                    <LoginAgencySignUpGuideDialog>
                        <Button type="button" variant="tertiary" size="md" aria-haspopup="dialog">
                            기관회원 가입 안내
                        </Button>
                    </LoginAgencySignUpGuideDialog>
                </div>
                <Table caption="로그인 안내 모달 종류" columns={DIALOG_COLUMNS} rows={DIALOG_ROWS} size="md" />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="login-dialogs-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="login-dialogs-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>여는 버튼에 aria-haspopup=&quot;dialog&quot; 를 둬 모달이 열린다는 것을 알립니다[8.2.1].</li>
                    <li>
                        가입 대상 표의 스크롤 상자는 키보드로도 밀 수 있게 포커스를 받고 &apos;기관회원 가입 대상
                        표&apos;라는 이름을 갖습니다. 표는 caption · th scope 로 구조를 갖습니다[6.1.1][7.3.2].
                    </li>
                    <li>포커스 가두기 · Esc 닫기 · 포커스 복귀는 Dialog(Radix)가 처리합니다[8.2.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="login-dialogs-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="login-dialogs-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="로그인 안내 모달 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default LoginDialogsGuidePage
