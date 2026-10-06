// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import CheckToastDemo from './check-toast-demo'

export const metadata: Metadata = {title: '확인 토스트 (CheckToast)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {showCheckToast} from '@/components/custom/check-toast'

const handleSave = async () => {
  await save()
  showCheckToast('저장되었습니다.')
}`

const MOUNT_CODE = `import {CheckToastOnMount} from '@/components/custom/check-toast'

{/* 완료 화면으로 넘어오자마자 한 번 띄우는 자리 */}
<CheckToastOnMount message="하위계정이 등록되었습니다." />`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'alert',
        cells: [
            '폼·화면 안에서 상태를 알리는 한두 줄 메시지',
            <Link key="component" href="/component-guide/alert" className={LINK_CLASS}>
                Alert
            </Link>,
            '정보 · 성공 · 주의 · 오류 색과 아이콘으로 상태를 구분하는 인라인 메시지입니다. 접거나 닫지 않습니다.',
        ],
    },
    {
        key: 'info-box',
        cells: [
            '화면 하단의 안내 · 유의사항 목록',
            <Link key="component" href="/component-guide/info-box" className={LINK_CLASS}>
                InfoBox
            </Link>,
            '제목과 불릿 목록을 항상 펼쳐 둡니다. 상태 색이 없는 중립 패널입니다.',
        ],
    },
    {
        key: 'notice-accordion',
        cells: [
            '모달 · 화면 위쪽에서 접어 둘 수 있는 안내 목록',
            <Link key="component" href="/component-guide/notice-accordion" className={LINK_CLASS}>
                NoticeAccordion
            </Link>,
            '제목 줄을 눌러 목록을 여닫습니다. 처음 상태는 화면 폭을 따릅니다.',
        ],
    },
    {
        key: 'toast',
        cells: [
            '저장 · 등록처럼 끝난 일을 잠깐 알림',
            <code key="component">Toast · CheckToast</code>,
            '화면 위에 떴다가 스스로 사라집니다. 반드시 읽어야 할 내용에는 쓰지 않습니다.',
        ],
    },
    {
        key: 'dialog',
        cells: [
            '사용자가 확인 · 결정해야 하는 알림',
            <Link key="component" href="/component-guide/dialog" className={LINK_CLASS}>
                Dialog
            </Link>,
            '흐름을 멈추고 응답을 받습니다. 되돌릴 수 없는 일의 결과는 여기서 알립니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['showCheckToast', 'message', '띄울 문구입니다.', '-', 'string'],
    [
        'showCheckToast',
        'options.id',
        '같은 id 로 다시 띄우면 앞의 토스트를 대체해 쌓이지 않습니다.',
        'undefined',
        'string',
    ],
    ['showCheckToast', 'options.duration', '떠 있는 시간(ms)입니다.', '4000', 'number'],
    ['CheckToastOnMount', 'message', '화면이 열리자마자 띄울 문구입니다.', '-', 'string'],
    [
        'CheckToastOnMount',
        'id',
        'showCheckToast 의 options.id 와 같습니다. 있으면 화면을 떠날 때 함께 닫습니다.',
        'undefined',
        'string',
    ],
    [
        'CheckToastOnMount',
        'duration',
        'showCheckToast 의 options.duration 과 같습니다. Number.POSITIVE_INFINITY 면 사라지지 않습니다.',
        '4000',
        'number',
    ],
] as const

const CheckToastGuidePage = () => (
    <GuidePageShell
        title="확인 토스트 (CheckToast)"
        description="저장 · 등록처럼 끝났다는 것만 알리면 되는 동작에 쓰는 토스트입니다. 화면 위쪽 가운데에 체크 표시와 함께 떴다가 스스로 사라집니다."
    >
        <BaseCard>
            <section aria-labelledby="check-toast-usage" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="check-toast-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        동작이 끝난 자리에서 <code>showCheckToast</code> 를 부릅니다. 화면을 옮긴 뒤 알려야 하면 옮겨 간
                        화면에 <code>CheckToastOnMount</code> 를 둡니다. 루트 레이아웃의 <code>Toaster</code> 가
                        렌더합니다.
                    </p>
                </div>
                <div>
                    <CheckToastDemo />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={MOUNT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="check-toast-behavior" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="check-toast-behavior" className="typo-h4-bold">
                        동작
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        위치는 <code>top-center</code> 이고 기본 4초 뒤 사라집니다.
                    </li>
                    <li>
                        헤더에 가려지지 않도록 호출 시점에 헤더(모바일은 폼 탭 줄 포함)의 아래끝을 재서 그 아래에
                        띄웁니다. 좁은 화면에서는 간격을 줄입니다.
                    </li>
                    <li>
                        <code>CheckToastOnMount</code> 는 글꼴이 로드된 뒤 한 번만 띄웁니다. 같은 화면을 다시 그려도 두
                        번 뜨지 않습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="check-toast-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="check-toast-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        일반 토스트는{' '}
                        <Link href="/component-guide/toast" className={LINK_CLASS}>
                            Toast
                        </Link>
                        를 씁니다.
                    </p>
                </div>
                <Table caption="알림 계열 컴포넌트 사용 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="check-toast-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="check-toast-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        토스트 영역은 스크린리더가 읽는 알림 영역입니다. 문구만으로 무엇이 끝났는지 알 수 있게
                        적습니다[8.2.1].
                    </li>
                    <li>
                        체크 아이콘은 <code>aria-hidden=&quot;true&quot;</code> 입니다. 뜻은 문구가 전합니다[5.1.1].
                    </li>
                    <li>포커스를 옮기지 않아 하던 입력을 끊지 않습니다[7.2.1].</li>
                    <li>스스로 사라지므로 되돌릴 수 없는 일이나 반드시 확인해야 하는 결과는 모달로 알립니다[6.2.1].</li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="check-toast-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="check-toast-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="CheckToast Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default CheckToastGuidePage
