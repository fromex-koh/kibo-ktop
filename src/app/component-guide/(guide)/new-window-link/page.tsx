// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {NewWindowLink} from '@/components/composite/new-window-link'
import {Button} from '@/components/ui/button'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {EVALUATION_REPORT_WINDOW_HEIGHT, EVALUATION_REPORT_WINDOW_WIDTH} from '@/constants/evaluation-report'

export const metadata: Metadata = {title: '새 창 열기 (NewWindowLink)'}

const SECTION_HEADER = 'flex max-w-4xl flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {NewWindowLink} from '@/components/composite/new-window-link'

<Button asChild variant="tertiary" size="sm">
  <NewWindowLink
    href="/org/mypage/evaluation-history/deep-analysis"
    width={EVALUATION_REPORT_WINDOW_WIDTH}
    height={EVALUATION_REPORT_WINDOW_HEIGHT}
    windowName="evaluation-report"
  >
    개별평가 심층 결과
  </NewWindowLink>
</Button>`

const PROPS_ITEMS = [
    ['NewWindowLink', 'href', '새 창에 띄울 주소입니다(필수).', '-', 'string'],
    [
        'NewWindowLink',
        'width',
        '문서 폭입니다(필수). 세로 스크롤바 폭을 더해 창을 열고, 화면보다 넓으면 화면 폭까지 줄입니다.',
        '-',
        'number',
    ],
    [
        'NewWindowLink',
        'height',
        '창 높이입니다(필수). 화면보다 높으면 화면 높이까지만 열고 나머지는 창 안에서 스크롤합니다.',
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
        'fitToScreen',
        '창 크기를 화면 크기까지 줄일지 정합니다. false 면 width · height 그대로 엽니다.',
        'true',
        'boolean',
    ],
    [
        'NewWindowLink',
        'onClick',
        '창을 열기 전에 부를 동작입니다. preventDefault() 를 부르면 창이 열리지 않습니다.',
        '-',
        '(event) => void',
    ],
    [
        'NewWindowLink',
        'className · a 속성',
        'target · rel 을 뺀 a 속성을 그대로 전달합니다.',
        '-',
        'AnchorHTMLAttributes',
    ],
] as const

const NewWindowLinkGuidePage = () => (
    <GuidePageShell
        title="새 창 열기 (NewWindowLink)"
        description="폭이 정해진 인쇄용 문서를 그 크기에 맞춘 새 창으로 여는 링크입니다."
    >
        <BaseCard>
            <section aria-labelledby="new-window-link-usage" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="new-window-link-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>href</code> · <code>width</code> · <code>height</code> 를 넘깁니다. 버튼 모양이 필요하면{' '}
                        <code>Button</code> 의 <code>asChild</code> 로 감쌉니다.
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
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">동작</h3>
                        <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                            <li>
                                새 창은 지금 보고 있는 창의 가운데에 열립니다. 크기는 <code>width</code> ·{' '}
                                <code>height</code> 가 정하되 화면보다 클 수 없습니다. 그대로 지켜야 하면{' '}
                                <code>fitToScreen={'{false}'}</code> 를 줍니다.
                            </li>
                            <li>
                                같은 문서를 여러 번 눌러도 창이 쌓이지 않게 하려면 <code>windowName</code> 을 줍니다.
                            </li>
                            <li>
                                팝업이 차단되면 일반 링크처럼 새 탭으로 열립니다. ⌘ · Ctrl · Shift 클릭과 가운데 클릭은
                                브라우저 기본 동작을 따릅니다.
                            </li>
                            <li>
                                열리는 문서에서 인쇄가 필요하면{' '}
                                <Link href="/component-guide/print-button" className={LINK_CLASS}>
                                    PrintButton
                                </Link>{' '}
                                을 문서 머리에 둡니다.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="new-window-link-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="new-window-link-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        링크 글자 뒤에 스크린리더용 &quot;(새 창에서 열림)&quot;이 붙습니다. 링크 글자에 같은 안내를
                        다시 적지 않습니다[6.4.3].
                    </li>
                    <li>
                        링크 텍스트는 열리는 문서의 이름을 담아 목적을 알 수 있게 씁니다(예: &quot;개별평가 심층
                        결과&quot;)[6.4.3].
                    </li>
                    <li>
                        <code>a</code> 요소라 키보드 · 가운데 클릭 · 새 탭 열기가 그대로 동작합니다[6.1.1].{' '}
                        <code>target</code> · <code>rel</code> 은 컴포넌트가 정합니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="new-window-link-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="new-window-link-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="NewWindowLink Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default NewWindowLinkGuidePage
