import type {Metadata} from 'next'
import {CircleAlert, CircleCheck, Info, TriangleAlert} from 'lucide-react'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'

export const metadata: Metadata = {title: '알림 (Alert)'}

const USAGE_CODE = `<Alert variant="info">
  <Info />
  <AlertDescription>
    기업명, 사업자번호, 법인번호는 회원정보 기준으로 자동 입력되며 수정할 수 없습니다.
  </AlertDescription>
</Alert>`

// 상태 케이스 — [variant, 아이콘, 메시지]
const VARIANTS = [
    {
        variant: 'info',
        Icon: Info,
        msg: '기업명, 사업자번호, 법인번호는 회원정보 기준으로 자동 입력되며 수정할 수 없습니다.',
    },
    {variant: 'success', Icon: CircleCheck, msg: '제출이 정상적으로 완료되었습니다.'},
    {
        variant: 'warning',
        Icon: TriangleAlert,
        msg: '입력한 정보가 저장되지 않았습니다. 저장 후 다음 단계로 이동하세요.',
    },
    {variant: 'error', Icon: CircleAlert, msg: '사업자번호 형식이 올바르지 않습니다. 다시 확인해 주세요.'},
] as const

const COMPOSITION = [
    ['Alert', '컨테이너(role="alert"). variant 로 상태색을 정한다. 아이콘은 <svg> 자식으로 넣는다.'],
    ['AlertTitle', '제목(선택). 굵게 + foreground.'],
    ['AlertDescription', '본문 메시지. label-foreground.'],
    ['AlertAction', '우측 상단 액션(닫기 버튼 등, 선택).'],
] as const

// 알림 — shadcn Alert 를 상태색 변형(info/success/warning/error)으로 승격한 styled copy.
const AlertGuidePage = () => (
    <GuidePageShell
        title="알림 (Alert)"
        description="폼·화면에서 정보·성공·주의·오류를 아이콘과 함께 알리는 인라인 메시지입니다. variant 로 상태를 구분합니다."
    >
        <section aria-labelledby="al-variant" className="flex flex-col gap-4">
            <div>
                <h2 id="al-variant" className="typo-h4-bold">
                    상태 (variant)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">info</code>·<code className="font-mono">success</code>·
                    <code className="font-mono">warning</code>·<code className="font-mono">error</code> 네 가지입니다.
                    배경·테두리·아이콘 색이 상태를 나타내고, 메시지 텍스트는 읽기 쉽게 회색으로 둡니다.
                </p>
            </div>
            <div className="flex flex-col gap-3">
                {VARIANTS.map(({variant, Icon, msg}) => (
                    <Alert key={variant} variant={variant}>
                        <Icon aria-hidden="true" />
                        <AlertDescription>{msg}</AlertDescription>
                    </Alert>
                ))}
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="al-title" className="flex flex-col gap-4">
            <div>
                <h2 id="al-title" className="typo-h4-bold">
                    제목 + 설명
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    설명이 길면 <code className="font-mono">AlertTitle</code>로 제목을 얹습니다.
                </p>
            </div>
            <Alert variant="warning">
                <TriangleAlert aria-hidden="true" />
                <AlertTitle>제출 전 확인해 주세요</AlertTitle>
                <AlertDescription>
                    필수 항목 중 일부가 비어 있습니다. 모든 필수 항목을 입력해야 제출할 수 있습니다.
                </AlertDescription>
            </Alert>
        </section>

        <section aria-labelledby="al-composition" className="flex flex-col gap-4">
            <div>
                <h2 id="al-composition" className="typo-h4-bold">
                    구성
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">알림은 컨테이너 + 하위 요소로 조합합니다.</p>
            </div>
            <dl className="flex flex-col gap-2">
                {COMPOSITION.map(([name, desc]) => (
                    <div key={name} className="flex flex-col gap-0.5">
                        <dt className="typo-body-l-medium text-primary font-mono">{name}</dt>
                        <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                    </div>
                ))}
            </dl>
        </section>
    </GuidePageShell>
)

export default AlertGuidePage
