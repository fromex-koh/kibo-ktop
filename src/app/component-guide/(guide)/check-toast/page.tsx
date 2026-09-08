import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '확인 토스트 (CheckToast)'}

const USAGE_CODE = `import {showCheckToast} from '@/components/custom/check-toast'

const handleSave = async () => {
  await save()
  showCheckToast('저장되었습니다.')
}`

const MOUNT_CODE = `import {CheckToastOnMount} from '@/components/custom/check-toast'

{/* 완료 화면으로 넘어오자마자 한 번 띄우는 자리 */}
<CheckToastOnMount message="하위계정이 등록되었습니다." />`

const PROPS_ITEMS = [
    ['showCheckToast', 'message', '띄울 문구입니다.', '-', 'string'],
    [
        'showCheckToast',
        'id',
        '같은 토스트를 두 번 띄우지 않게 하는 식별자입니다. 같은 id 면 앞의 것을 대체합니다.',
        'undefined',
        'string | number',
    ],
    ['showCheckToast', 'duration', '떠 있는 시간(ms)입니다.', '4000', 'number'],
    ['CheckToastOnMount', 'message', '화면이 열리자마자 띄울 문구입니다.', '-', 'string'],
    ['CheckToastOnMount', 'id', 'showCheckToast 와 같습니다.', 'undefined', 'string | number'],
    ['CheckToastOnMount', 'duration', 'showCheckToast 와 같습니다.', '4000', 'number'],
] as const

const CheckToastGuidePage = () => (
    <GuidePageShell
        title="확인 토스트 (CheckToast)"
        description="저장·등록처럼 끝났다는 것만 알리면 되는 동작에 쓰는 토스트입니다. 화면 위쪽 가운데에 체크 표시와 함께 떴다가 스스로 사라집니다."
    >
        <BaseCard>
            <section aria-labelledby="check-toast-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="check-toast-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        동작이 끝난 자리에서 <code className="font-mono">showCheckToast</code> 를 부릅니다. 화면을 옮긴
                        뒤 알려야 하면 옮겨 간 화면에서 <code className="font-mono">CheckToastOnMount</code> 를 둡니다.
                    </p>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <CodeBlock code={MOUNT_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="check-toast-rule" className="flex flex-col gap-3">
                <h2 id="check-toast-rule" className="typo-h4-bold">
                    구현 기준
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        위치는 화면 위쪽 가운데(<code className="font-mono">top-center</code>)이고 기본 4초 뒤
                        사라집니다.
                    </li>
                    <li>
                        헤더에 가리지 않도록 헤더 아래에서 시작합니다 — 헤더가 화면에 고정된 상태인지에 따라 시작 위치를
                        다시 계산하고, 좁은 화면에서는 여백을 줄입니다.
                    </li>
                    <li>
                        <code className="font-mono">CheckToastOnMount</code> 는 화면이 그려진 직후 한 번만 띄웁니다 —
                        같은 화면을 다시 그려도 두 번 뜨지 않습니다.
                    </li>
                    <li>
                        되돌릴 수 없는 일이나 사용자가 반드시 확인해야 하는 결과는 토스트가 아니라 모달로 알립니다 —
                        토스트는 스스로 사라져 놓칠 수 있습니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="check-toast-a11y" className="flex flex-col gap-3">
                <h2 id="check-toast-a11y" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        토스트 영역은 화면을 보지 않아도 알 수 있도록 알림 영역으로 읽힙니다 — 문구만으로 무엇이
                        끝났는지 알 수 있게 적습니다[8.2.1].
                    </li>
                    <li>체크 아이콘은 장식이라 감춥니다. 뜻은 문구가 전합니다[5.1.1].</li>
                    <li>포커스를 빼앗지 않습니다 — 하던 일을 끊지 않고 알리는 것이 토스트의 역할입니다[7.2.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="check-toast-props" className="flex flex-col gap-4">
                <h2 id="check-toast-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="CheckToast Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default CheckToastGuidePage
