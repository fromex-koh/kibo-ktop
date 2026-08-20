import type {Metadata} from 'next'
import {ChartArea, FolderSearch} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {HistoryAction, HistoryItem, HistoryList} from '@/components/composite/history-list'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '이력 목록 (HistoryList)'}

const BASIC_CODE = `{/* meta 는 세로 구분선으로 이어진다. 값마다 색이 다르면 사용처에서 span 에 색을 준다 */}
<HistoryList>
  <HistoryItem
    meta={[
      <span key="date" className="typo-body-l-regular text-foreground-subtle">2026-05-15 14:30:12</span>,
      <span key="status" className="typo-body-l-bold text-primary-strong">평가완료</span>,
      <span key="grade" className="typo-body-l-bold text-purple-600">AA</span>,
    ]}
    title={<h3 className="typo-title-m-bold text-foreground min-w-0">Tech-Index</h3>}
  >
    <HistoryAction>은행전송</HistoryAction>
    <HistoryAction>전송내역</HistoryAction>
  </HistoryItem>
</HistoryList>`

const ACTION_CODE = `{/* action — 제목 오른쪽 버튼 묶음. 좁아지면 제목 아래로 내려간다 */}
<HistoryItem
  meta={[...]}
  title={
    <h3 className="typo-title-m-bold text-foreground min-w-0">
      자가진단<span className="typo-title-m-regular"> KTRS-FM</span>
    </h3>
  }
  action={
    <>
      <Button asChild variant="secondary" size="xs">
        <Link href="#"><ChartArea aria-hidden="true" />일반분석</Link>
      </Button>
      <Button asChild variant="secondary" size="xs">
        <Link href="#"><FolderSearch aria-hidden="true" />심층분석</Link>
      </Button>
    </>
  }
>
  <HistoryAction>은행전송</HistoryAction>
</HistoryItem>`

const DISABLED_CODE = `{/* 아직 볼 것이 없는 건 — 분석 버튼과 동작 버튼을 모두 disabled 로 잠근다.
    눌리지 않는 이유가 화면에 그대로 보인다 */}
<HistoryItem
  meta={[
    <span key="date" className="typo-body-l-regular text-foreground-subtle">2026-05-08 10:15:58</span>,
    <span key="status" className="typo-body-l-bold text-disabled">진행중</span>,
  ]}
  title={<h3 className="typo-title-m-bold text-foreground min-w-0">투자모형</h3>}
  action={
    <Button type="button" variant="secondary" size="xs" disabled>
      <ChartArea aria-hidden="true" />일반분석
    </Button>
  }
>
  <HistoryAction disabled>은행전송</HistoryAction>
  <HistoryAction disabled>전송내역</HistoryAction>
</HistoryItem>`

const BADGE_CODE = `{/* badge — 메타 줄 맨 앞의 표(평가 모형 등). 뒤 값들과 달리 구분선 없이 간격만 두고 놓인다.
    모형을 배지가 알려 주므로 제목은 종류만 남는다("자가진단"). 배지를 두지 않는 건은 제목에 모형까지
    함께 적는다("KTRS-FM 기술평가") */}
<HistoryItem
  badge={<Badge variant="outline" color="info" shape="pill">KTRS-FM</Badge>}
  meta={[
    <span key="date" className="typo-body-l-regular text-foreground-subtle">2026.05.15 14:30</span>,
    <span key="status" className="typo-body-l-bold text-primary-strong">평가완료</span>,
    <span key="grade" className="typo-body-l-bold text-purple-600">AA</span>,
  ]}
  title={<h3 className="typo-title-m-bold text-foreground">자가진단</h3>}
  action={…}
>
  <HistoryAction>은행전송</HistoryAction>
</HistoryItem>`

const MINIMAL_CODE = `{/* meta·action·동작 버튼은 모두 선택이다. 제목만 넘기면 한 줄짜리 목록이 된다 */}
<HistoryList>
  <HistoryItem title={<h3 className="typo-title-m-bold text-foreground">2026년 1분기 기술평가 보고서</h3>} />
  <HistoryItem title={<h3 className="typo-title-m-bold text-foreground">2025년 4분기 기술평가 보고서</h3>} />
</HistoryList>`

const CARD_CODE = `{/* 카드에 담아야 하는 목록은 사용처에서 BaseCard 로 감싼다 — 목록 자체는 줄 구성만 갖는다.
    안쪽 여백은 BaseCard 가 가진 값(24)을 그대로 쓰고, 카드 맨 위에는 시작을 긋는 선이 필요 없으므로
    border-t-0 으로 끈다 */}
<BaseCard>
  <HistoryList className="border-t-0">…</HistoryList>
</BaseCard>`

const PROPS_ITEMS = [
    [
        'HistoryList',
        'className',
        'ul 에 덧붙일 클래스입니다. 항목 사이 구분선과 여백은 이미 들어 있습니다.',
        '-',
        'string',
    ],
    [
        'HistoryItem',
        'badge',
        '메타 줄 맨 앞에 오는 배지(평가 모형 등)입니다. 뒤 값들과 달리 구분선 없이 간격만 두고 놓입니다.',
        'undefined',
        'ReactNode',
    ],
    [
        'HistoryItem',
        'meta',
        '제목 위 한 줄에 오는 값들입니다. 세로 구분선으로 이어 그립니다. 넘기지 않으면 그 줄을 그리지 않습니다.',
        '-',
        'ReactNode[]',
    ],
    ['HistoryItem', 'title', '항목 제목입니다. 헤딩 단계는 쓰는 화면이 정하도록 요소째 넘깁니다.', '-', 'ReactNode'],
    [
        'HistoryItem',
        'action',
        '제목 오른쪽에 오는 버튼 묶음입니다. 좁아지면 제목 아래로 내려갑니다.',
        'undefined',
        'ReactNode',
    ],
    [
        'HistoryItem',
        'children',
        '아래 줄의 동작 버튼(HistoryAction)입니다. 없으면 그 줄을 그리지 않습니다.',
        'undefined',
        'ReactNode',
    ],
    [
        'HistoryAction',
        'onClick',
        '눌렀을 때 할 일입니다. 넘기지 않으면 아무 일도 하지 않습니다.',
        'undefined',
        '() => void',
    ],
    ['HistoryAction', 'disabled', '아직 실행할 수 없는 동작입니다. 꺼진 버튼으로 그려집니다.', 'false', 'boolean'],
] as const

const HistoryListGuidePage = () => (
    <GuidePageShell
        title="이력 목록 (HistoryList)"
        description="날짜·상태로 시작해 제목·액션·동작 버튼으로 이어지는 이력 항목의 목록입니다. 마이페이지의 조회 화면들이 같은 짜임을 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="hl-basic" className="flex flex-col gap-4">
                <div>
                    <h2 id="hl-basic" className="typo-h4-bold">
                        기본
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">meta</code> 는 등록 일시·진행 상태·등급처럼 제목 위에 놓이는 값들로,
                        세로 구분선으로 이어 그립니다. 값마다 색이 다르므로 색은 사용처에서 정합니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <HistoryList>
                        <HistoryItem
                            meta={[
                                <span key="date" className="typo-body-l-regular text-foreground-subtle">
                                    2026-05-15 14:30:12
                                </span>,
                                <span key="status" className="typo-body-l-bold text-primary-strong">
                                    평가완료
                                </span>,
                                <span key="grade" className="typo-body-l-bold text-purple-600">
                                    AA
                                </span>,
                            ]}
                            title={<h3 className="typo-title-m-bold text-foreground min-w-0">Tech-Index</h3>}
                        >
                            <HistoryAction>은행전송</HistoryAction>
                            <HistoryAction>전송내역</HistoryAction>
                        </HistoryItem>
                        <HistoryItem
                            meta={[
                                <span key="date" className="typo-body-l-regular text-foreground-subtle">
                                    2026-05-14 11:02:44
                                </span>,
                                <span key="status" className="typo-body-l-bold text-purple-600">
                                    분석완료
                                </span>,
                                <span key="grade" className="typo-body-l-bold text-purple-600">
                                    6.6
                                </span>,
                            ]}
                            title={<h3 className="typo-title-m-bold text-foreground min-w-0">창업용 Tech-Index</h3>}
                        >
                            <HistoryAction>전송내역</HistoryAction>
                        </HistoryItem>
                    </HistoryList>
                </div>
                <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="hl-action" className="flex flex-col gap-4">
                <div>
                    <h2 id="hl-action" className="typo-h4-bold">
                        액션 버튼
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        제목 오른쪽에 버튼이 붙는 케이스입니다. 모형 이름처럼 앞머리만 굵게 두려면 뒤에 오는 부분을{' '}
                        <code className="font-mono">typo-title-m-regular</code> span 으로 감쌉니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <HistoryList>
                        <HistoryItem
                            meta={[
                                <span key="date" className="typo-body-l-regular text-foreground-subtle">
                                    2026-05-15 14:30:12
                                </span>,
                                <span key="status" className="typo-body-l-bold text-primary-strong">
                                    평가완료
                                </span>,
                            ]}
                            title={
                                <h3 className="typo-title-m-bold text-foreground min-w-0">
                                    자가진단<span className="typo-title-m-regular"> KTRS-FM</span>
                                </h3>
                            }
                            action={
                                <>
                                    <Button type="button" variant="secondary" size="xs">
                                        <ChartArea aria-hidden="true" />
                                        일반분석
                                    </Button>
                                    <Button type="button" variant="secondary" size="xs">
                                        <FolderSearch aria-hidden="true" />
                                        심층분석
                                    </Button>
                                </>
                            }
                        >
                            <HistoryAction>은행전송</HistoryAction>
                            <HistoryAction>기관전송</HistoryAction>
                        </HistoryItem>
                    </HistoryList>
                </div>
                <CodeBlock code={ACTION_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="hl-badge" className="flex flex-col gap-4">
                <div>
                    <h2 id="hl-badge" className="typo-h4-bold">
                        모형 배지
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        평가 모형처럼 그 건이 무엇인지 가르는 표는 <code className="font-mono">badge</code> 슬롯에
                        넣습니다. 값과 값 사이가 아니라 표와 값 사이라, 뒤에 오는 메타 값들과 달리 구분선 없이
                        간격(12)만 두고 놓입니다. 배지가 모형을 알려 주므로 제목에는 종류만 남고, 배지를 두지 않는 건은
                        제목에 모형까지 함께 적습니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <HistoryList>
                        <HistoryItem
                            badge={
                                <Badge variant="outline" color="info" shape="pill">
                                    KTRS-FM
                                </Badge>
                            }
                            meta={[
                                <span key="date" className="typo-body-l-regular text-foreground-subtle">
                                    2026.05.15 14:30
                                </span>,
                                <span key="status" className="typo-body-l-bold text-primary-strong">
                                    평가완료
                                </span>,
                                <span key="grade" className="typo-body-l-bold text-purple-600">
                                    AA
                                </span>,
                            ]}
                            title={<h3 className="typo-title-m-bold text-foreground">자가진단</h3>}
                            action={
                                <>
                                    <Button type="button" variant="secondary" size="xs">
                                        <ChartArea aria-hidden="true" />
                                        일반분석
                                    </Button>
                                    <Button type="button" variant="secondary" size="xs">
                                        <FolderSearch aria-hidden="true" />
                                        심층분석
                                    </Button>
                                </>
                            }
                        >
                            <HistoryAction>은행전송</HistoryAction>
                            <HistoryAction>기관전송</HistoryAction>
                        </HistoryItem>
                        <HistoryItem
                            badge={
                                <Badge variant="outline" color="info" shape="pill">
                                    KTRS-FM
                                </Badge>
                            }
                            meta={[
                                <span key="date" className="typo-body-l-regular text-foreground-subtle">
                                    2026.05.15 14:30
                                </span>,
                                <span key="status" className="typo-body-l-bold text-primary-strong">
                                    평가완료
                                </span>,
                                <span key="grade" className="typo-body-l-bold text-purple-600">
                                    AA
                                </span>,
                            ]}
                            title={<h3 className="typo-title-m-bold text-foreground">기술평가</h3>}
                            action={
                                <Button type="button" variant="secondary" size="xs">
                                    <ChartArea aria-hidden="true" />
                                    일반분석
                                </Button>
                            }
                        >
                            <HistoryAction>전송내역</HistoryAction>
                        </HistoryItem>
                        <HistoryItem
                            meta={[
                                <span key="date" className="typo-body-l-regular text-foreground-subtle">
                                    2026.05.15 14:30
                                </span>,
                                <span key="status" className="typo-body-l-bold text-primary-strong">
                                    평가완료
                                </span>,
                                <span key="grade" className="typo-body-l-bold text-purple-600">
                                    AA
                                </span>,
                            ]}
                            title={<h3 className="typo-title-m-bold text-foreground">KTRS-FM 기술평가</h3>}
                            action={
                                <Button type="button" variant="secondary" size="xs">
                                    <ChartArea aria-hidden="true" />
                                    일반분석
                                </Button>
                            }
                        >
                            <HistoryAction>전송내역</HistoryAction>
                        </HistoryItem>
                    </HistoryList>
                </div>
                <CodeBlock code={BADGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="hl-disabled" className="flex flex-col gap-4">
                <div>
                    <h2 id="hl-disabled" className="typo-h4-bold">
                        아직 볼 것이 없는 항목
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        결과가 나오기 전이라 눌러도 열 것이 없는 건입니다. 버튼은{' '}
                        <code className="font-mono">disabled</code>, 링크는{' '}
                        <code className="font-mono">HistoryAction</code> 의 <code className="font-mono">disabled</code>{' '}
                        로 잠급니다. 잠긴 링크는 <code className="font-mono">a</code> 가 아니라 흐린 글자로 그려집니다 —
                        눌리지 않는데 링크처럼 보이면 고장으로 읽힙니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <HistoryList>
                        <HistoryItem
                            meta={[
                                <span key="date" className="typo-body-l-regular text-foreground-subtle">
                                    2026-05-08 10:15:58
                                </span>,
                                <span key="status" className="typo-body-l-bold text-disabled">
                                    진행중
                                </span>,
                            ]}
                            title={<h3 className="typo-title-m-bold text-foreground min-w-0">투자모형</h3>}
                            action={
                                <Button type="button" variant="secondary" size="xs" disabled>
                                    <ChartArea aria-hidden="true" />
                                    일반분석
                                </Button>
                            }
                        >
                            <HistoryAction disabled>은행전송</HistoryAction>
                            <HistoryAction disabled>전송내역</HistoryAction>
                        </HistoryItem>
                    </HistoryList>
                </div>
                <CodeBlock code={DISABLED_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="hl-minimal" className="flex flex-col gap-4">
                <div>
                    <h2 id="hl-minimal" className="typo-h4-bold">
                        제목만
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        <code className="font-mono">meta</code>·<code className="font-mono">action</code>·동작 버튼은
                        모두 선택입니다. 넘기지 않은 줄은 자리를 만들지 않습니다.
                    </p>
                </div>
                <div className="border-border rounded-md border p-6">
                    <HistoryList>
                        <HistoryItem
                            title={<h3 className="typo-title-m-bold text-foreground">2026년 1분기 기술평가 보고서</h3>}
                        />
                        <HistoryItem
                            title={<h3 className="typo-title-m-bold text-foreground">2025년 4분기 기술평가 보고서</h3>}
                        />
                    </HistoryList>
                </div>
                <CodeBlock code={MINIMAL_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="hl-card" className="flex flex-col gap-4">
                <div>
                    <h2 id="hl-card" className="typo-h4-bold">
                        카드 안에 담기
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        평가결과 조회처럼 배경 위에 그대로 놓이는 목록이 기본입니다. 공지사항·1:1 문의처럼 카드가 필요한
                        화면은 사용처에서 <code className="font-mono">BaseCard</code> 로 감쌉니다 — 목록 자체는 줄
                        구성만 갖습니다.
                    </p>
                </div>
                <div className="bg-background rounded-md p-6">
                    <BaseCard>
                        <HistoryList className="border-t-0">
                            <HistoryItem
                                meta={[
                                    <span key="date" className="typo-body-l-regular text-foreground-subtle">
                                        2026-05-15
                                    </span>,
                                ]}
                                title={<h3 className="typo-title-m-bold text-foreground">평가 신청 오류 문의</h3>}
                            />
                            <HistoryItem
                                meta={[
                                    <span key="date" className="typo-body-l-regular text-foreground-subtle">
                                        2026-05-14
                                    </span>,
                                ]}
                                title={<h3 className="typo-title-m-bold text-foreground">자가진단 결과 오류 문의</h3>}
                            />
                        </HistoryList>
                    </BaseCard>
                </div>
                <CodeBlock code={CARD_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="hl-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="hl-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        HistoryList / HistoryItem / HistoryAction 에 넘기는 속성입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="HistoryList와 HistoryItem, HistoryAction Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default HistoryListGuidePage
