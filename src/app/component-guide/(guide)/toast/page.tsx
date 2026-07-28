import type {Metadata} from 'next'
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
