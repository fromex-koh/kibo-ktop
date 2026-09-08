import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {NewWindowLink} from '@/components/composite/new-window-link'
import {PrintButton} from '@/components/composite/print-button'
import {Button} from '@/components/ui/button'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {EVALUATION_REPORT_WINDOW_HEIGHT, EVALUATION_REPORT_WINDOW_WIDTH} from '@/constants/evaluation-report'

export const metadata: Metadata = {title: '새 창 열기 (NewWindowLink)'}

const USAGE_CODE = `<Button asChild variant="tertiary" size="sm">
  <NewWindowLink
    href="/org/mypage/evaluation-history/deep-analysis"
    width={EVALUATION_REPORT_WINDOW_WIDTH}
    height={EVALUATION_REPORT_WINDOW_HEIGHT}
    windowName="evaluation-report"
  >
    개별평가 심층 결과
  </NewWindowLink>
</Button>

{/* 새 창으로 열리는 문서의 머리 */}
<PrintButton />`

const PROPS_ITEMS = [
    ['NewWindowLink', 'href', '새 창에 띄울 주소입니다.', '-', 'string'],
    [
        'NewWindowLink',
        'width',
        '시안 문서 폭입니다. 세로 스크롤바가 먹는 폭을 더해 창을 열어 문서가 잘리지 않게 하고, 화면보다 넓으면 화면 크기까지 줄입니다.',
        '-',
        'number',
    ],
    [
        'NewWindowLink',
        'height',
        '시안 문서 높이입니다. 문서가 길면 화면 높이까지만 열고 나머지는 창 안에서 스크롤합니다.',
        '-',
        'number',
    ],
    [
        'NewWindowLink',
        'windowName',
        '창 이름입니다. 같은 이름으로 다시 열면 새 창을 만들지 않고 그 창을 다시 씁니다.',
        "'_blank'",
        'string',
    ],
    [
        'NewWindowLink',
        'onClick',
        '창을 열기 전에 함께 부를 동작입니다. 여기서 막으면 창도 열리지 않습니다.',
        '-',
        '(event) => void',
    ],
    ['PrintButton', 'className', '자리에서 정할 배치 조정입니다.', 'undefined', 'string'],
] as const

const NewWindowLinkGuidePage = () => (
    <GuidePageShell
        title="새 창 열기 (NewWindowLink)"
        description="폭이 정해진 인쇄용 문서를 그 크기에 맞춘 새 창으로 여는 링크입니다. 평가결과 리포트(심층분석)처럼 사이트 내비게이션 없이 문서 한 장만 보여 주는 화면에 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="new-window-link-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="new-window-link-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        버튼 모양이 필요하면 <code className="font-mono">Button</code> 의{' '}
                        <code className="font-mono">asChild</code> 로 감쌉니다. 새 창으로 열리는 문서의 머리에는{' '}
                        <code className="font-mono">PrintButton</code> 을 두어 보고 있는 문서를 그대로 인쇄하게 합니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button asChild variant="tertiary" size="sm">
                        <NewWindowLink
                            href="/org/mypage/evaluation-history/deep-analysis"
                            width={EVALUATION_REPORT_WINDOW_WIDTH}
                            height={EVALUATION_REPORT_WINDOW_HEIGHT}
                            windowName="evaluation-report"
                        >
                            개별평가 심층 결과
                        </NewWindowLink>
                    </Button>
                    <PrintButton />
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="new-window-link-a11y" className="flex flex-col gap-3">
                <h2 id="new-window-link-a11y" className="typo-h4-bold">
                    동작과 접근성
                </h2>
                <ul className="typo-body-l-regular text-muted-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        버튼이 아니라 링크(<code className="font-mono">a</code>)입니다 — 자바스크립트가 막히거나 창
                        열기가 차단돼도 같은 주소로 이동할 수 있고, 가운데 클릭·새 탭에서 열기 같은 브라우저 기본 동작이
                        살아 있습니다[6.1.1].
                    </li>
                    <li>
                        창이 실제로 열렸을 때만 기본 이동을 막습니다. ⌘·Ctrl·Shift 를 누른 클릭은 브라우저에 맡깁니다.
                    </li>
                    <li>
                        링크 글자 뒤에 &quot;(새 창에서 열림)&quot; 을 감춰 두어, 눌렀을 때 새 창이 뜬다는 사실을
                        소리로도 알 수 있게 합니다[6.4.3].
                    </li>
                    <li>
                        창 크기는 <code className="font-mono">width</code> ·<code className="font-mono">height</code> 가
                        정하되 화면보다 클 수 없습니다 — 문서가 길면 창 안에서 스크롤합니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="new-window-link-props" className="flex flex-col gap-4">
                <h2 id="new-window-link-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="NewWindowLink · PrintButton Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default NewWindowLinkGuidePage
