// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {Building2, Download, FileCheckCorner, NotepadText, Pause, ShieldCheck} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {CardActionBar, CardActionBarEnd, CardActionBarStart} from '@/components/composite/card-action-bar'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '카드 액션 바 (CardActionBar)'}

const SECTION_HEADER = 'flex flex-col gap-2'
const BLOCK = 'flex flex-col gap-4 py-8 last:pb-0'
const DEMO_BOX = 'border-border rounded-xl border p-6'
const LINK_CLASS = 'text-primary-strong underline underline-offset-4'
const LIST_CLASS = 'typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5'

const BASIC_CODE = `import {CardActionBar, CardActionBarEnd, CardActionBarStart} from '@/components/composite/card-action-bar'

{/* 보조(secondary)는 왼쪽, 주요(primary · variant 기본값)는 맨 오른쪽. 버튼마다 아이콘을 붙인다. */}
<CardActionBar>
  <CardActionBarStart>
    <Button variant="secondary" size="sm">
      <FileCheckCorner aria-hidden="true" />
      자가진단 결과
    </Button>
  </CardActionBarStart>
  <CardActionBarEnd>
    <Button variant="secondary" size="sm">
      <Building2 aria-hidden="true" />
      은행 전송
    </Button>
    <Button size="sm">
      <ShieldCheck aria-hidden="true" />
      보증신청
    </Button>
  </CardActionBarEnd>
</CardActionBar>`

const START_ONLY_CODE = `<CardActionBar>
  <CardActionBarStart>
    <Button variant="secondary" size="sm">
      <Download aria-hidden="true" />
      보고서 다운로드
    </Button>
  </CardActionBarStart>
</CardActionBar>`

const END_ONLY_CODE = `<CardActionBar>
  <CardActionBarEnd>
    <Button variant="secondary" size="sm">
      <Pause aria-hidden="true" />
      이용중지
    </Button>
    <Button size="sm">
      <NotepadText aria-hidden="true" />
      이용내역
    </Button>
  </CardActionBarEnd>
</CardActionBar>`

const PROPS_ITEMS = [
    [
        'CardActionBar',
        'div 속성',
        '버튼 줄 루트입니다. className 등 div 속성을 전달합니다.',
        '-',
        "ComponentPropsWithoutRef<'div'>",
    ],
    ['CardActionBarStart', 'div 속성', '왼쪽 구역 — 보조 버튼을 넣습니다.', '-', "ComponentPropsWithoutRef<'div'>"],
    [
        'CardActionBarEnd',
        'div 속성',
        '오른쪽 구역 — 보조 버튼 뒤에 주요 버튼을 맨 끝에 넣습니다. 왼쪽 구역이 없어도 오른쪽 끝에 섭니다.',
        '-',
        "ComponentPropsWithoutRef<'div'>",
    ],
] as const

const CardActionsGuidePage = () => (
    <GuidePageShell
        title="카드 액션 바 (CardActionBar)"
        description="목록 카드 아래의 버튼을 보조는 왼쪽, 주요는 오른쪽으로 나눠 놓는 레이아웃 컴포넌트입니다."
    >
        <BaseCard>
            <section aria-labelledby="card-action-bar-basic" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="card-action-bar-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        실제 화면 — 기업{' '}
                        <Link href="/corp/mypage/evaluation-results" className={LINK_CLASS}>
                            평가결과 조회
                        </Link>{' '}
                        ·{' '}
                        <Link href="/corp/mypage/k-bigx-report-history" className={LINK_CLASS}>
                            K-BIGx 보고서 이력
                        </Link>{' '}
                        ·{' '}
                        <Link href="/corp/mypage/paid-services/payment-history" className={LINK_CLASS}>
                            이용권 관리
                        </Link>
                        , 기관{' '}
                        <Link href="/org/mypage/evaluation-history" className={LINK_CLASS}>
                            평가결과 조회
                        </Link>{' '}
                        ·{' '}
                        <Link href="/org/mypage/verification-application" className={LINK_CLASS}>
                            평가검증 신청 조회
                        </Link>{' '}
                        ·{' '}
                        <Link href="/org/mypage/k-bigx-report-history" className={LINK_CLASS}>
                            K-BIGx 보고서 이력
                        </Link>
                        . 창 폭을 640 아래로 줄이면 모바일 배치를 볼 수 있습니다.
                    </p>
                </div>
                <div className={DEMO_BOX}>
                    <CardActionBar>
                        <CardActionBarStart>
                            <Button type="button" variant="secondary" size="sm">
                                <FileCheckCorner aria-hidden="true" />
                                자가진단 결과
                            </Button>
                        </CardActionBarStart>
                        <CardActionBarEnd>
                            <Button type="button" variant="secondary" size="sm">
                                <Building2 aria-hidden="true" />
                                은행 전송
                            </Button>
                            <Button type="button" size="sm">
                                <ShieldCheck aria-hidden="true" />
                                보증신청
                            </Button>
                        </CardActionBarEnd>
                    </CardActionBar>
                </div>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="card-action-bar-variants" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="card-action-bar-variants" className="typo-h4-bold">
                        구역 조합
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">쓰지 않는 구역은 생략합니다.</p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">보조 버튼만 — 왼쪽</h3>
                        <div className={DEMO_BOX}>
                            <CardActionBar>
                                <CardActionBarStart>
                                    <Button type="button" variant="secondary" size="sm">
                                        <Download aria-hidden="true" />
                                        보고서 다운로드
                                    </Button>
                                </CardActionBarStart>
                            </CardActionBar>
                        </div>
                        <CodeBlock code={START_ONLY_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className={BLOCK}>
                        <h3 className="typo-title-m-bold text-foreground">오른쪽만 — 보조 → 주요</h3>
                        <div className={DEMO_BOX}>
                            <CardActionBar>
                                <CardActionBarEnd>
                                    <Button type="button" variant="secondary" size="sm">
                                        <Pause aria-hidden="true" />
                                        이용중지
                                    </Button>
                                    <Button type="button" size="sm">
                                        <NotepadText aria-hidden="true" />
                                        이용내역
                                    </Button>
                                </CardActionBarEnd>
                            </CardActionBar>
                        </div>
                        <CodeBlock code={END_ONLY_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="card-action-bar-rules" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="card-action-bar-rules" className="typo-h4-bold">
                        배치 규칙 · 반응형
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>
                        주요 버튼은 <code>variant</code> 기본값(primary), 보조 버튼은 <code>secondary</code> 입니다.
                        크기는 <code>sm</code>, 버튼마다 lucide 아이콘을 글자 앞에 둡니다.
                    </li>
                    <li>버튼 폭은 글자만큼입니다 — 폭 클래스(w-*)를 주지 않습니다.</li>
                    <li>
                        버튼이 데이터로 오면 글자 대신 종류 코드로 받아 화면이 글자 · 아이콘 · 주요/보조 · 자리를
                        정합니다. 예: 평가 카드의 <code>type</code>(<code>EvaluationResultActionType</code>) → 글자는{' '}
                        <code>EVALUATION_RESULT_ACTION_LABEL</code>, 모양은 <code>EvaluationCardActions</code>(
                        <Link href="/component-guide/evaluation-card" className={LINK_CLASS}>
                            평가 카드
                        </Link>
                        )의 <code>ACTION_STYLE</code>(evaluation-card-action-style.ts).
                    </li>
                    <li>
                        구역 안에는 버튼을 감싸는 요소 없이 바로 넣습니다 — 모바일 배치가 구역의 직계 자식을 버튼으로
                        봅니다. 모달 트리거(<code>asChild</code>)로 감싼 버튼은 그대로 됩니다.
                    </li>
                    <li>
                        640 미만에서는 주요 버튼이 맨 위 한 줄을 가득 채우고, 나머지 버튼은 그 아래 한 줄을 같은 폭으로
                        나눕니다. 반 칸에 글자가 들어가지 않는 버튼(예: 개별평가 일반 결과)은 넘치지 않고 다음 줄로
                        내려가 한 줄을 다 씁니다. 주요 버튼은 <code>data-variant=&quot;default&quot;</code> 로 찾으므로
                        사용처에서 클래스를 더하지 않습니다.
                    </li>
                    <li>
                        화면 끝의 이전 · 다음 · 저장처럼 카드 밖의 버튼 줄은{' '}
                        <Link href="/component-guide/action-bar" className={LINK_CLASS}>
                            ActionBar
                        </Link>
                        를 씁니다.
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="card-action-bar-a11y" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="card-action-bar-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className={LIST_CLASS}>
                    <li>
                        아이콘은 꾸밈이라 <code>aria-hidden</code> 을 줍니다 — 버튼 이름은 글자입니다[5.1.1].
                    </li>
                    <li>
                        모바일에서 주요 버튼을 위로 올리는 것은 화면 순서만 바꿉니다. 키보드 · 스크린리더는 보조 → 주요
                        순서(데스크톱과 같음)로 지나갑니다[7.3.1].
                    </li>
                    <li>
                        같은 이름의 버튼이 카드마다 반복되면 어느 건인지 sr-only 로 덧붙입니다(예: 보고서 다운로드 뒤의
                        기업명)[6.4.3].
                    </li>
                </ul>
            </section>
        </BaseCard>
        <BaseCard>
            <section aria-labelledby="card-action-bar-props" className="flex flex-col gap-6">
                <div className={SECTION_HEADER}>
                    <h2 id="card-action-bar-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="CardActionBar 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default CardActionsGuidePage
