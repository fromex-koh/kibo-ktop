// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {Fragment} from 'react'
import {CircleAlert, CircleCheck, Info, TriangleAlert} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Alert, AlertAction, AlertDescription, AlertTitle} from '@/components/ui/alert'

export const metadata: Metadata = {title: '알림 (Alert)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {Info} from 'lucide-react'
import {Alert, AlertDescription} from '@/components/ui/alert'

<Alert color="info">
  <Info aria-hidden="true" />
  <AlertDescription>
    기업명, 사업자번호, 법인번호는 회원정보 기준으로 자동 입력되며 수정할 수 없습니다.
  </AlertDescription>
</Alert>

<Alert variant="solid" color="warning">
  <TriangleAlert aria-hidden="true" />
  <AlertTitle>제출 전 확인해 주세요</AlertTitle>
  <AlertDescription>필수 항목 중 일부가 비어 있습니다.</AlertDescription>
</Alert>`

// 색 케이스 — [color, 아이콘, 메시지]
const COLORS = [
    {
        color: 'info',
        Icon: Info,
        msg: '기업명, 사업자번호, 법인번호는 회원정보 기준으로 자동 입력되며 수정할 수 없습니다.',
    },
    {color: 'success', Icon: CircleCheck, msg: '제출이 정상적으로 완료되었습니다.'},
    {
        color: 'warning',
        Icon: TriangleAlert,
        msg: '입력한 정보가 저장되지 않았습니다. 저장 후 다음 단계로 이동하세요.',
    },
    {color: 'error', Icon: CircleAlert, msg: '사업자번호 형식이 올바르지 않습니다. 다시 확인해 주세요.'},
] as const

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'alert',
        cells: [
            '폼·화면 안에서 상태를 알리는 한두 줄 메시지(정보·성공·주의·오류)',
            <code key="component">Alert</code>,
            '색 · 아이콘으로 상태를 구분하는 인라인 메시지입니다. 닫거나 접지 않습니다.',
        ],
    },
    {
        key: 'info-box',
        cells: [
            '화면 하단의 안내·유의사항 목록',
            <Link key="component" href="/component-guide/info-box" className={LINK_CLASS}>
                InfoBox
            </Link>,
            '제목과 불릿 목록을 늘 펼쳐 둡니다. 상태 색이 없는 중립 패널입니다.',
        ],
    },
    {
        key: 'notice-accordion',
        cells: [
            '모달·화면 위쪽에서 접어 둘 수 있는 안내 목록',
            <Link key="component" href="/component-guide/notice-accordion" className={LINK_CLASS}>
                NoticeAccordion
            </Link>,
            '제목 줄을 눌러 목록을 여닫습니다. 처음 상태는 화면 폭을 따릅니다.',
        ],
    },
    {
        key: 'toast',
        cells: [
            '저장·등록처럼 끝난 일을 잠깐 알림',
            <Link key="component" href="/component-guide/toast" className={LINK_CLASS}>
                Toast · CheckToast
            </Link>,
            '화면 위에 떴다가 스스로 사라집니다. 반드시 읽어야 할 내용에는 쓰지 않습니다.',
        ],
    },
    {
        key: 'dialog',
        cells: [
            '사용자가 확인·결정해야 하는 알림',
            <Link key="component" href="/component-guide/dialog" className={LINK_CLASS}>
                Dialog
            </Link>,
            '흐름을 멈추고 응답을 받습니다. 되돌릴 수 없는 일의 결과는 여기서 알립니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'Alert',
        'variant',
        'outline 은 테두리 + 옅은 배경 + 상태색 아이콘, solid 는 테두리 없는 채움 + 중립 아이콘입니다.',
        "'outline'",
        "'outline' | 'solid'",
    ],
    ['Alert', 'color', '상태 색입니다.', "'info'", "'info' | 'success' | 'warning' | 'error'"],
    [
        'Alert',
        'className · div props',
        '컨테이너에 전달합니다. role="alert" 가 기본으로 붙습니다.',
        'undefined',
        "ComponentProps<'div'>",
    ],
    ['AlertTitle', 'children', '선택 제목입니다.', '-', 'ReactNode'],
    ['AlertDescription', 'children', '본문 메시지입니다.', '-', 'ReactNode'],
    ['AlertAction', 'children', '오른쪽 위에 놓는 선택 액션입니다. 있으면 오른쪽 여백이 늘어납니다.', '-', 'ReactNode'],
] as const

// 알림 — shadcn Alert 셸에 프로젝트 theme variant(스타일·색)를 연결한다.
const AlertGuidePage = () => (
    <GuidePageShell
        title="알림 (Alert)"
        description="폼 · 화면 안에서 정보 · 성공 · 주의 · 오류를 아이콘과 함께 알리는 인라인 메시지입니다."
    >
        <BaseCard>
            <section aria-labelledby="al-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="al-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        아이콘 → 제목(선택) → 본문 순으로 넣습니다. 아이콘 크기는 컴포넌트가 20px 로 맞춥니다.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <Alert color="info">
                        <Info aria-hidden="true" />
                        <AlertDescription>
                            기업명, 사업자번호, 법인번호는 회원정보 기준으로 자동 입력되며 수정할 수 없습니다.
                        </AlertDescription>
                    </Alert>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="al-variants" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="al-variants" className="typo-h4-bold">
                        변형
                    </h2>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">색 (color)</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            왼쪽은 <code>outline</code>, 오른쪽은 <code>solid</code> 입니다.
                        </p>
                        <div className="grid gap-3 md:grid-cols-2">
                            {COLORS.map(({color, Icon, msg}) => (
                                <Fragment key={color}>
                                    <Alert variant="outline" color={color}>
                                        <Icon aria-hidden="true" />
                                        <AlertDescription>{msg}</AlertDescription>
                                    </Alert>
                                    <Alert variant="solid" color={color}>
                                        <Icon aria-hidden="true" />
                                        <AlertDescription>{msg}</AlertDescription>
                                    </Alert>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">제목 + 설명</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            설명이 길면 <code>AlertTitle</code> 로 제목을 얹습니다.
                        </p>
                        <Alert variant="outline" color="warning">
                            <TriangleAlert aria-hidden="true" />
                            <AlertTitle>제출 전 확인해 주세요</AlertTitle>
                            <AlertDescription>
                                필수 항목 중 일부가 비어 있습니다. 모든 필수 항목을 입력해야 제출할 수 있습니다.
                            </AlertDescription>
                        </Alert>
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">액션</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>AlertAction</code> 은 오른쪽 위에 놓입니다.
                        </p>
                        <Alert variant="solid" color="info">
                            <Info aria-hidden="true" />
                            <AlertDescription>새 평가 모형이 적용되었습니다.</AlertDescription>
                            <AlertAction>
                                <Link href="/component-guide/alert" className={LINK_CLASS}>
                                    자세히 보기
                                </Link>
                            </AlertAction>
                        </Alert>
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="al-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="al-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        같은 “안내” 라도 목적에 따라 컴포넌트가 다릅니다.
                    </p>
                </div>
                <Table caption="알림 계열 컴포넌트 사용 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="al-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="al-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>Alert</code> 는 <code>role=&quot;alert&quot;</code> 라 나타나는 즉시 스크린리더가
                        읽습니다. 화면을 열 때부터 있는 고정 안내에는 <code>InfoBox</code> 를 쓰고, 입력 결과처럼
                        동적으로 나타나는 메시지에 씁니다[8.2.1].
                    </li>
                    <li>
                        상태는 색만으로 전하지 않습니다. 아이콘과 문구를 함께 두고 아이콘은{' '}
                        <code>aria-hidden=&quot;true&quot;</code> 로 숨깁니다[5.3.1].
                    </li>
                    <li>
                        폼 오류는 <code>Alert</code> 와 별개로 해당 필드에 <code>aria-invalid</code> ·{' '}
                        <code>aria-describedby</code> 를 연결합니다[7.4.2].
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="al-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="al-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="Alert 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default AlertGuidePage
