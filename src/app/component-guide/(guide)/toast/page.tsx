// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable, {type PropsTableItem} from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import ToastDemo, {
    ToastActionDemo,
    ToastCompositionDemo,
    ToastEdgeCaseDemo,
    ToastLifecycleDemo,
    ToastPositionDemo,
} from './toast-demo'

export const metadata: Metadata = {title: '토스트 (Toast) (작업중)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const H3_CLASS = 'typo-title-m-bold text-foreground'
const DESC_CLASS = 'typo-body-l-regular text-label-foreground'
const BLOCK_CLASS = 'flex flex-col gap-4 py-8 last:pb-0'

const SETUP_CODE = `import {Toaster} from '@/components/ui/sonner'

// 앱의 공통 레이아웃에 한 번만 배치합니다.
<ThemeProvider>
  {children}
  <Toaster />
</ThemeProvider>`

const USAGE_CODE = `import {toast} from 'sonner'

toast('변경사항을 저장했습니다.')

toast.success('제출이 완료되었습니다.', {
  description: '처리 결과는 진행현황에서 확인할 수 있습니다.',
})

toast.error('저장하지 못했습니다. 다시 시도해 주세요.')

toast('임시저장 내용을 삭제했습니다.', {
  action: {
    label: '되돌리기',
    onClick: restoreDraft,
  },
})`

const POSITION_CODE = `// 개별 토스트의 위치를 지정합니다.
toast('왼쪽 위에 표시됩니다.', {
  position: 'top-left',
})

// 모든 토스트의 기본 위치를 지정하려면 Toaster에 전달합니다.
<Toaster position="bottom-center" />`

const COMPOSITION_CODE = `toast('새로운 알림이 있습니다.', {
  icon: <Bell aria-hidden="true" />,
})

toast('변경사항을 저장했습니다.')

toast('제출이 완료되었습니다.', {
  description: '처리 결과는 진행현황에서 확인할 수 있습니다.',
})

toast('제출이 완료되었습니다.', {
  icon: <CircleCheck aria-hidden="true" />,
  description: '처리 결과는 진행현황에서 확인할 수 있습니다.',
})`

const ACTION_CODE = `// 액션 없음
toast('임시저장 내용을 삭제했습니다.')

// 액션 있음
toast('임시저장 내용을 삭제했습니다.', {
  action: {
    label: '되돌리기',
    onClick: restoreDraft,
  },
})

// 닫기 버튼 있음
toast('새로운 안내사항이 있습니다.', {
  closeButton: true,
})`

const LIFECYCLE_CODE = `toast.promise(request, {
  loading: '데이터를 불러오는 중입니다.',
  success: '최신 데이터로 갱신했습니다.',
  error: '데이터를 불러오지 못했습니다.',
})

const id = toast('확인이 필요한 안내사항입니다.', {
  duration: Infinity,
  closeButton: true,
})
toast.dismiss(id)

toast.loading('변경사항을 저장하는 중입니다.', {id: 'save'})
toast.success('변경사항을 저장했습니다.', {id: 'save'})`

const EDGE_CASE_CODE = `toast('변경사항을 적용했습니다.', {
  cancel: {
    label: '취소',
    onClick: cancelChange,
  },
})

toast('기술평가 신청 내용을 임시저장했습니다.', {
  description: '입력한 내용은 신청 완료 전까지 수정할 수 있습니다.',
})

toast.info('첫 번째 알림입니다.')
toast.success('두 번째 알림입니다.')
toast.warning('세 번째 알림입니다.')`

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'toast',
        cells: [
            '저장·제출 결과 같은 짧은 상태 변화',
            <code key="c">toast()</code>,
            '흐름을 막지 않고 자동으로 사라집니다. 알약 한 벌이며 위치·유지 시간을 호출마다 바꿀 수 있습니다.',
        ],
    },
    {
        key: 'check-toast',
        cells: [
            '완료를 체크 표식과 함께 화면 위 가운데에 알림(자동저장 등)',
            <Link key="c" href="/component-guide/check-toast" className={LINK_CLASS}>
                CheckToast
            </Link>,
            '문구·위치·아이콘이 고정된 완료 토스트입니다. 부르는 쪽은 문구만 넘깁니다.',
        ],
    },
    {
        key: 'dialog',
        cells: [
            '사용자의 결정이나 긴 설명이 필요함',
            <Link key="c" href="/component-guide/dialog" className={LINK_CLASS}>
                Dialog
            </Link>,
            '답을 해야 닫히는 모달입니다. 토스트만으로 중요한 확인이나 필수 입력을 전달하지 않습니다.',
        ],
    },
    {
        key: 'alert',
        cells: [
            '화면에 계속 남아야 하는 안내',
            <Link key="c" href="/component-guide/alert" className={LINK_CLASS}>
                Alert
            </Link>,
            '본문에 인라인으로 놓이고 닫히지 않습니다.',
        ],
    },
] as const

const PROPS = [
    ['Toaster', 'position', '토스트가 표시될 기본 위치입니다.', "'bottom-right'", 'ToasterProps[position]'],
    ['Toaster', 'closeButton', '모든 토스트에 닫기 버튼을 표시합니다.', 'false', 'boolean'],
    ['Toaster', 'duration', '자동으로 닫히기까지의 시간(ms)입니다.', '4000', 'number'],
    [
        'Toaster',
        'theme',
        '색상 체계입니다. 기본은 앱 테마(next-themes)를 따릅니다.',
        '현재 테마',
        "'light' | 'dark' | 'system'",
    ],
    ['toast', 'message', '사용자에게 전달할 짧은 메시지입니다.', '-', 'ReactNode'],
    ['toast', 'description', '메시지를 보충하는 설명입니다.', 'undefined', 'ReactNode'],
    ['toast', 'icon', '메시지 앞 아이콘입니다. 장식이면 aria-hidden 을 줍니다.', 'undefined', 'ReactNode'],
    ['toast', 'action', '토스트 안에서 즉시 실행할 수 있는 버튼입니다.', 'undefined', 'Action'],
    ['toast', 'cancel', '실행한 변경을 취소하는 버튼입니다.', 'undefined', 'Action'],
    ['toast', 'closeButton', '이 토스트에만 닫기 버튼을 표시합니다.', 'Toaster 설정', 'boolean'],
    ['toast', 'position', '이 토스트만 표시 위치를 바꿉니다.', 'Toaster 설정', 'ToasterProps[position]'],
    ['toast', 'duration', '이 토스트의 유지 시간(ms)입니다. Infinity 면 사라지지 않습니다.', 'Toaster 설정', 'number'],
    ['toast', 'id', '중복 방지 · 내용 갱신 · 수동 종료에 쓰는 식별자입니다.', '자동 생성', 'string | number'],
] satisfies readonly PropsTableItem[]

const SectionHead = ({id, title, description}: {id: string; title: string; description: string}) => (
    <div className="flex max-w-4xl flex-col gap-2">
        <h2 id={id} className="typo-h4-bold">
            {title}
        </h2>
        <p className="typo-body-l-regular text-label-foreground">{description}</p>
    </div>
)

const ToastGuidePage = () => (
    <GuidePageShell
        title="토스트 (Toast) (작업중)"
        description="작업 결과나 짧은 상태 변화를 화면 흐름을 막지 않고 알리는 sonner 기반 피드백 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="toast-basic" className="flex flex-col gap-6">
                <SectionHead
                    id="toast-basic"
                    title="기본 사용"
                    description="Toaster 는 앱 공통 레이아웃에 한 번만 두고, 각 화면에서는 toast() 를 호출합니다. 버튼을 누르면 기본 위치인 화면 오른쪽 아래에 표시됩니다."
                />
                <ToastDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={SETUP_CODE} language="tsx" copyLabel="복사" />

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK_CLASS}>
                        <h3 className={H3_CLASS}>면과 색</h3>
                        <p className={DESC_CLASS}>
                            값은 <code>theme/sonner.variants.ts</code> 에서 관리하며 종류와 관계없이 알약 한 벌입니다.
                        </p>
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                면은 <code>bg-toast</code>, 글자·아이콘은 <code>text-toast-foreground</code> 이며 테마와
                                무관하게 같은 값입니다.
                            </li>
                            <li>
                                폭은 내용만큼 늘어나고 긴 문구는 토스터 폭에서 줄바꿈합니다. 모서리는{' '}
                                <code>rounded-full</code> 입니다.
                            </li>
                            <li>
                                종류(success · info · warning · error)는 색이 아니라 아이콘 모양으로 구분합니다 [5.3.1].
                            </li>
                            <li>
                                <code>z-toast</code> 위계라 모달·팝오버·전체 메뉴보다 앞에 표시됩니다.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-variants" className="flex flex-col gap-6">
                <SectionHead
                    id="toast-variants"
                    title="변형 예시"
                    description="내용 구성, 액션, 위치, 비동기 상태를 호출 옵션으로 바꿉니다."
                />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK_CLASS}>
                        <h3 className={H3_CLASS}>콘텐츠 배치</h3>
                        <p className={DESC_CLASS}>
                            메시지 · <code>icon</code> · <code>description</code> 을 조합합니다.
                        </p>
                        <ToastCompositionDemo />
                        <CodeBlock code={COMPOSITION_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className={H3_CLASS}>액션과 닫기</h3>
                        <p className={DESC_CLASS}>
                            단순 결과 안내에는 액션을 두지 않고, 즉시 되돌릴 수 있는 안전한 작업에만 <code>action</code>{' '}
                            을 둡니다. 직접 닫아야 하는 안내에는 <code>closeButton</code> 을 표시합니다.
                        </p>
                        <ToastActionDemo />
                        <CodeBlock code={ACTION_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className={H3_CLASS}>렌더링 위치</h3>
                        <p className={DESC_CLASS}>
                            호출의 <code>position</code> 으로 여섯 위치 중 하나를 고릅니다. 앱 전체 기본값은{' '}
                            <code>Toaster</code> 에 같은 prop 을 줍니다.
                        </p>
                        <ToastPositionDemo />
                        <CodeBlock code={POSITION_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className={H3_CLASS}>비동기 상태와 수동 제어</h3>
                        <p className={DESC_CLASS}>
                            <code>toast.promise</code> 로 요청 상태를 한 토스트에서 갱신합니다. 같은 <code>id</code> 를
                            다시 쓰면 새로 쌓지 않고 내용을 갱신하고, <code>duration: Infinity</code> 토스트는{' '}
                            <code>toast.dismiss(id)</code> 로 닫습니다.
                        </p>
                        <ToastLifecycleDemo />
                        <CodeBlock code={LIFECYCLE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={BLOCK_CLASS}>
                        <h3 className={H3_CLASS}>취소 버튼 · 긴 문구 · 연속 발생</h3>
                        <p className={DESC_CLASS}>
                            <code>cancel</code> 버튼, 긴 문구의 줄바꿈, 여러 알림이 연속으로 뜰 때의 쌓임 순서를
                            확인합니다.
                        </p>
                        <ToastEdgeCaseDemo />
                        <CodeBlock code={EDGE_CASE_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-choice" className="flex flex-col gap-6">
                <SectionHead
                    id="toast-choice"
                    title="컴포넌트 선택"
                    description="사용자의 결정이 필요한지, 화면에 얼마나 남아야 하는지로 고릅니다."
                />
                <Table
                    caption="Toast · CheckToast · Dialog · Alert 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
                <p className={DESC_CLASS}>
                    자동저장처럼 반복되는 완료 안내는 <code>toast()</code> 를 화면마다 조합하지 않고{' '}
                    <Link href="/component-guide/check-toast" className={LINK_CLASS}>
                        CheckToast
                    </Link>{' '}
                    의 <code>showCheckToast</code> 를 씁니다.
                </p>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-a11y" className="flex flex-col gap-6">
                <SectionHead
                    id="toast-a11y"
                    title="접근성"
                    description="알림 영역의 읽어 주기와 표시·닫기 동작은 sonner 가 처리하고, 사용처는 문구와 유지 시간을 정합니다."
                />
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        토스트는 <code>aria-live</code> 영역으로 렌더되어 스크린리더가 포커스 이동 없이 읽습니다
                        [8.2.1]. 포커스를 가져오거나 입력을 막지 않습니다.
                    </li>
                    <li>
                        자동으로 사라지는 안내는 시간 제한이 있는 콘텐츠입니다. 중요한 확인이나 필수 입력을 토스트만으로
                        전달하지 않고, 오래 읽어야 하면 <code>duration: Infinity</code> + <code>closeButton</code> 을
                        씁니다[6.2.1].
                    </li>
                    <li>
                        닫기 버튼과 액션은 키보드로 조작되고 포커스 링이 표시됩니다. 닫기 버튼의 이름은 &quot;토스트
                        닫기&quot; 입니다[6.1.1 · 6.1.2].
                    </li>
                    <li>
                        <code>icon</code> 은 장식이므로 <code>aria-hidden=&quot;true&quot;</code> 를 줍니다. 상태는
                        색만이 아니라 문구로도 전합니다[5.1.1 · 5.3.1].
                    </li>
                    <li>
                        되돌리기처럼 짧고 안전한 후속 동작만 <code>action</code> 으로 제공합니다.
                    </li>
                    <li>
                        W3C 검사기의 <code>CSS: Parse Error</code> · charset 메시지는 sonner 가 런타임에 넣는 스타일
                        때문에 렌더된 DOM 검사에서만 나오는 오탐입니다.{' '}
                        <Link href="/component-guide/accessibility-exceptions" className={LINK_CLASS}>
                            접근성 검사 예외사항
                        </Link>
                        에 판정이 기록되어 있습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-props" className="flex flex-col gap-6">
                <SectionHead
                    id="toast-props"
                    title="Props API"
                    description="주요 속성입니다. 나머지는 sonner 의 Toaster · toast 옵션을 따릅니다."
                />
                <PropsTable items={PROPS} caption="Toast 주요 속성" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ToastGuidePage
