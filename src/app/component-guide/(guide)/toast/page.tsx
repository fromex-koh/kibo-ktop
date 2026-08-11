import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable, {type PropsTableItem} from '@/components/custom/props-table'
import ToastDemo, {
    ToastActionDemo,
    ToastCompositionDemo,
    ToastEdgeCaseDemo,
    ToastLifecycleDemo,
    ToastPositionDemo,
} from './toast-demo'

export const metadata: Metadata = {title: '토스트 (Toast) (작업중)'}

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

const AUTOSAVE_CODE = `// 자동저장 안내 — 문구·위치·아이콘·노출 시간은 컴포넌트가 갖고 있다.
// 저장 요청이 끝날 때마다 저장된 시각만 넘기면 된다.
import {showAutosaveToast} from '@/components/custom/autosave-toast'

const saveDraft = async () => {
  await api.saveCompanyTechnologyInfo(values)
  showAutosaveToast(new Date())        // "오전 11:20 자동저장"
}

// 저장 기능이 붙기 전 화면 확인용 — 진입 시 한 번 띄운다.
<AutosaveToast />`

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

const PROPS = [
    [
        'Toaster',
        'theme',
        '현재 앱 테마에 맞춰 토스트 색상 체계를 전환합니다.',
        '현재 테마',
        "'light' | 'dark' | 'system'",
    ],
    ['Toaster', 'position', '토스트가 표시될 화면 위치입니다.', "'bottom-right'", 'ToasterProps[position]'],
    ['Toaster', 'closeButton', '각 토스트에 닫기 버튼을 표시합니다.', 'false', 'boolean'],
    ['Toaster', 'duration', '자동으로 닫히기까지의 시간(ms)입니다.', '4000', 'number'],
    ['toast', 'message', '사용자에게 전달할 짧은 상태 메시지입니다.', '—', 'ReactNode'],
    ['toast', 'position', '해당 토스트만 표시 위치를 변경합니다.', 'Toaster 위치', 'ToasterProps[position]'],
    ['toast', 'description', '메시지를 보충하는 선택적 설명입니다.', 'undefined', 'ReactNode'],
    ['toast', 'action', '토스트 안에서 즉시 실행할 수 있는 선택적 액션입니다.', 'undefined', 'Action'],
    ['toast', 'cancel', '실행한 변경을 취소하는 선택적 버튼입니다.', 'undefined', 'Action'],
    ['toast', 'duration', '해당 토스트가 유지되는 시간(ms)입니다.', 'Toaster 설정', 'number'],
    ['toast', 'id', '중복 방지·내용 갱신·수동 종료에 사용하는 식별자입니다.', '자동 생성', 'string | number'],
] satisfies readonly PropsTableItem[]

const ToastGuidePage = () => (
    <GuidePageShell
        title="토스트 (Toast) (작업중)"
        description="작업 결과나 짧은 상태 변화를 화면 흐름을 막지 않고 알리는 shadcn/ui 기반 피드백 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="toast-preview" className="flex flex-col gap-4">
                <div>
                    <h2 id="toast-preview" className="typo-h4-bold">
                        Preview
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        버튼을 선택하면 화면 우측 하단에 해당 상태의 토스트가 표시됩니다.
                    </p>
                </div>
                <ToastDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-lifecycle" className="flex flex-col gap-4">
                <div>
                    <h2 id="toast-lifecycle" className="typo-h4-bold">
                        비동기 상태와 수동 제어
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        요청 상태를 하나의 토스트에서 갱신하거나, 자동 종료 시간을 해제하고 반환된 ID로 직접 닫을 수
                        있습니다. 같은 ID를 다시 사용하면 새 토스트를 쌓지 않고 기존 내용을 갱신합니다.
                    </p>
                </div>
                <ToastLifecycleDemo />
                <CodeBlock code={LIFECYCLE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-edge-cases" className="flex flex-col gap-4">
                <div>
                    <h2 id="toast-edge-cases" className="typo-h4-bold">
                        추가 검증 사례
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        취소 동작, 긴 문구의 줄바꿈, 여러 알림이 연속으로 발생할 때의 쌓임 순서를 확인합니다.
                    </p>
                </div>
                <ToastEdgeCaseDemo />
                <CodeBlock code={EDGE_CASE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-composition" className="flex flex-col gap-4">
                <div>
                    <h2 id="toast-composition" className="typo-h4-bold">
                        콘텐츠 배치
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        메시지의 중요도와 보충 설명 유무에 맞춰 아이콘·타이틀·서브텍스트를 조합합니다.
                    </p>
                </div>
                <ToastCompositionDemo />
                <CodeBlock code={COMPOSITION_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-action" className="flex flex-col gap-4">
                <div>
                    <h2 id="toast-action" className="typo-h4-bold">
                        액션과 닫기
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        단순 결과 안내에는 액션을 두지 않고, 즉시 되돌릴 수 있는 안전한 작업에만 액션 버튼을 제공합니다.
                        사용자가 직접 닫아야 하는 안내에는 닫기 버튼을 선택적으로 표시할 수 있습니다.
                    </p>
                </div>
                <ToastActionDemo />
                <CodeBlock code={ACTION_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-position" className="flex flex-col gap-4">
                <div>
                    <h2 id="toast-position" className="typo-h4-bold">
                        렌더링 위치
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        개별 호출의 <code className="font-mono">position</code>으로 여섯 위치를 선택할 수 있습니다. 앱
                        전체의 기본 위치를 바꾸려면 <code className="font-mono">Toaster</code>에 같은 prop을 전달합니다.
                    </p>
                </div>
                <ToastPositionDemo />
                <CodeBlock code={POSITION_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-autosave" className="flex flex-col gap-4">
                <div>
                    <h2 id="toast-autosave" className="typo-h4-bold">
                        화면에서 쓰는 예 — 자동저장 안내
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        자가진단 2단계(기업·기술정보 입력)의 자동저장 토스트입니다. 같은 모양을 여러 곳에서 쓰게 되므로{' '}
                        <code className="font-mono">toast()</code> 를 화면마다 다시 조합하지 않고{' '}
                        <code className="font-mono">showAutosaveToast()</code> 한 곳에 모아 두었습니다 — 문구 형식(오전
                        11:20 자동저장) · 위치(상단 가운데, 헤더 아래 40) · 아이콘 · 노출 시간(1.5초)이 그 안에
                        있습니다. 부르는 쪽은 저장이 끝난 시각만 넘깁니다.
                    </p>
                </div>
                <CodeBlock code={AUTOSAVE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-setup" className="flex flex-col gap-4">
                <div>
                    <h2 id="toast-setup" className="typo-h4-bold">
                        설치 위치
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">Toaster</code>는 앱 공통 레이아웃에 한 번만 배치합니다. 각
                        화면에서는 <code className="font-mono">toast()</code> 함수로 메시지를 호출합니다. 알림은
                        <code className="font-mono"> z-toast</code> 위계로 모달·팝오버·전체 메뉴보다 앞에 표시됩니다.
                    </p>
                </div>
                <CodeBlock code={SETUP_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-guideline" className="flex flex-col gap-4">
                <div>
                    <h2 id="toast-guideline" className="typo-h4-bold">
                        사용 기준
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        저장·제출처럼 즉시 확인이 필요한 짧은 결과에 사용합니다. 사용자의 결정이나 긴 설명이 필요하면
                        Dialog 또는 Alert를 사용합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-foreground-subtle list-disc space-y-2 pl-6">
                    <li>메시지는 한 문장으로 간결하게 작성합니다.</li>
                    <li>오류 해결에 추가 설명이 필요하면 description을 함께 제공합니다.</li>
                    <li>중요한 확인이나 필수 입력을 토스트만으로 전달하지 않습니다.</li>
                    <li>되돌리기처럼 짧고 안전한 후속 동작만 action으로 제공합니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-validator" className="flex flex-col gap-2">
                <h2 id="toast-validator" className="typo-h4-bold">
                    W3C 검사기 메시지 (감리 참고)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    렌더된 DOM을 직렬화해 검사하면 sonner가 런타임에 주입하는 스타일시트 때문에{' '}
                    <code className="font-mono">CSS: Parse Error</code>와 charset 1024바이트 초과 메시지가 나타날 수
                    있습니다. 서버 전송 HTML에는 없는 오탐이며, 실측 근거와 판정은{' '}
                    <Link
                        href="/component-guide/validation-exceptions"
                        className="text-primary underline underline-offset-4"
                    >
                        마크업 검증
                    </Link>{' '}
                    페이지의 &ldquo;렌더된 DOM 직렬화 검사에서만 나타나는 메시지 판정&rdquo; 항목에 기록되어 있습니다.
                </p>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-spec" className="flex flex-col gap-4">
                <div>
                    <h2 id="toast-spec" className="typo-h4-bold">
                        면과 색
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        시안([자가진단] 2단계 자동저장 토스트)의 알약 한 벌을 그대로 쓰며, 값은
                        <code className="font-mono"> theme/sonner.variants.ts</code>에서 관리합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-foreground-subtle list-disc space-y-2 pl-6">
                    <li>
                        면은 <code className="font-mono">bg-toast</code>(반투명 검정 75%), 글자·아이콘은
                        <code className="font-mono"> text-toast-foreground</code>(흰색)입니다. 시안이 테마와 무관하게 한
                        벌이라 라이트·다크·메인 세 테마에서 같은 값입니다.
                    </li>
                    <li>
                        시안 치수는 1920 기준 높이 45(위아래 여백 12) · 좌우 여백 24 · 아이콘 20 · 아이콘과 글자 간격 8
                        · 글자 14px Medium 이고, 모서리는 알약(<code className="font-mono">rounded-full</code>)입니다.
                    </li>
                    <li>
                        폭은 내용만큼 늘어나고 긴 문구는 토스터 폭에서 줄바꿈합니다. 시안의 자동저장 토스트는 189px
                        입니다.
                    </li>
                    <li>
                        상태별 아이콘 색은 두지 않습니다 — 면이 어두워 라이트 테마용 상태색은 대비가 모자라고, 종류는
                        색이 아니라 아이콘 모양이 전합니다. [KWCAG 5.3.1]
                    </li>
                    <li>
                        실제 화면 적용 예시는 <code className="font-mono">자가진단 2단계(기업·기술정보 입력)</code>{' '}
                        화면에서 진입 시 뜨는 자동저장 토스트로 확인할 수 있습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="toast-props" className="flex flex-col gap-4">
                <h2 id="toast-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS} caption="Toast 주요 속성" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ToastGuidePage
