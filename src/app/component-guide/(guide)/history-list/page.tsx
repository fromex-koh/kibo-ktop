// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {ChartArea, FolderSearch} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {HistoryAction, HistoryItem, HistoryList} from '@/components/composite/history-list'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '이력 목록 (HistoryList)'}

const BASIC_CODE = `import {HistoryList, HistoryItem, HistoryAction} from '@/components/composite/history-list'

{/* meta 는 세로 구분선으로 이어진다. 값마다 색이 다르면 사용처에서 span 에 색을 준다 */}
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

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'review-list',
        cells: [
            '입력·판정된 항목을 번호 순서로 확인',
            <Link key="component" href="/component-guide/review-list" className={LINK_CLASS}>
                ReviewList
            </Link>,
            '번호·본문·상태 배지 행입니다. 번호는 자동으로 매겨집니다.',
        ],
    },
    {
        key: 'history-list',
        cells: [
            '날짜·상태·제목·동작 버튼이 있는 건별 이력',
            <code key="component">HistoryList</code>,
            '마이페이지 조회 결과처럼 한 건이 한 줄 묶음입니다. 구분선으로 항목을 나눕니다.',
        ],
    },
    {
        key: 'summary-list',
        cells: [
            '라벨과 값 쌍을 카드 하나에 나열',
            <Link key="component" href="/component-guide/summary-list" className={LINK_CLASS}>
                SummaryList
            </Link>,
            '<dl> 정의 목록입니다. 값은 오른쪽 정렬이며 편집은 하지 않습니다.',
        ],
    },
    {
        key: 'selectable-summary-list',
        cells: [
            '요약 카드 여럿 중 하나를 라디오로 선택',
            <Link key="component" href="/component-guide/selectable-summary-list" className={LINK_CLASS}>
                SelectableSummaryList
            </Link>,
            'SummaryList 카드에 라디오를 더한 형태입니다.',
        ],
    },
    {
        key: 'info-table',
        cells: [
            '항목과 값을 한 줄에 두 쌍씩 촘촘히 표시',
            <Link key="component" href="/component-guide/info-table" className={LINK_CLASS}>
                InfoTable
            </Link>,
            '이름 칸과 값 칸이 있는 조회용 표입니다.',
        ],
    },
    {
        key: 'list-patterns',
        cells: [
            '공지·자료실·FAQ 같은 게시형 목록',
            <Link key="component" href="/component-guide/list-patterns" className={LINK_CLASS}>
                List 패턴
            </Link>,
            '화면별 목록 골격 규칙을 모아 둔 문서입니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'HistoryList',
        'className',
        'ul 에 덧붙일 클래스입니다. 위쪽 굵은 선과 항목 구분선이 이미 들어 있습니다.',
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
        'undefined',
        'readonly ReactNode[]',
    ],
    [
        'HistoryItem',
        '...props',
        'li 의 네이티브 속성(className 포함)입니다. title 은 ReactNode 로 따로 받습니다.',
        '-',
        'LiHTMLAttributes',
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
    ['HistoryAction', 'children', '버튼 글자입니다. 뒤에 아이콘이 자동으로 붙습니다.', '-', 'ReactNode'],
    ['HistoryAction', 'disabled', '아직 실행할 수 없는 동작입니다. 꺼진 버튼으로 그려집니다.', 'false', 'boolean'],
] as const

const HistoryListGuidePage = () => (
    <GuidePageShell
        title="이력 목록 (HistoryList)"
        description="날짜·상태로 시작해 제목, 버튼, 동작 버튼으로 이어지는 이력 항목의 목록입니다."
    >
        <BaseCard>
            <section aria-labelledby="hl-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="hl-basic" className="typo-h4-bold">
                        기본 사용과 변형
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        마이페이지 조회 화면처럼 건별 이력을 구분선으로 나눠 보여 줍니다. 값만 보여 주므로 필터와 페이지
                        상태는 사용처가 가집니다.
                    </p>
                </div>
                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">기본</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>meta</code> 는 제목 위 한 줄의 값들입니다. 세로 구분선으로 이어지고 값마다 색은
                            사용처가 span 에 줍니다.
                        </p>
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
                                    title={
                                        <h3 className="typo-title-m-bold text-foreground min-w-0">창업용 Tech-Index</h3>
                                    }
                                >
                                    <HistoryAction>전송내역</HistoryAction>
                                </HistoryItem>
                            </HistoryList>
                        </div>
                        <CodeBlock code={BASIC_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">제목 옆 버튼</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>action</code> 은 제목 오른쪽 버튼 묶음이며 좁아지면 제목 아래로 내려갑니다. 앞머리만
                            굵게 하려면 뒷부분을 <code>typo-title-m-regular</code> span 으로 감쌉니다.
                        </p>
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
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">앞 배지</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>badge</code> 는 메타 줄 맨 앞에 오며 구분선 없이 간격만 둡니다. 배지를 쓰지 않는 건은
                            제목에 모형명까지 적습니다.
                        </p>
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
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">비활성 동작</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            실행할 수 없는 건은 버튼과 <code>HistoryAction</code> 에 <code>disabled</code> 를 줍니다.
                        </p>
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
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">제목만</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            <code>meta</code> · <code>action</code> · 동작 버튼은 선택이며 넘기지 않으면 그 줄을 그리지
                            않습니다.
                        </p>
                        <div className="border-border rounded-md border p-6">
                            <HistoryList>
                                <HistoryItem
                                    title={
                                        <h3 className="typo-title-m-bold text-foreground">
                                            2026년 1분기 기술평가 보고서
                                        </h3>
                                    }
                                />
                                <HistoryItem
                                    title={
                                        <h3 className="typo-title-m-bold text-foreground">
                                            2025년 4분기 기술평가 보고서
                                        </h3>
                                    }
                                />
                            </HistoryList>
                        </div>
                        <CodeBlock code={MINIMAL_CODE} language="tsx" copyLabel="복사" />
                    </div>
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">카드에 담기</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            목록은 배경 위에 놓이는 것이 기본입니다. 카드가 필요하면 <code>BaseCard</code> 로 감싸고 맨
                            위 선은 <code>border-t-0</code> 으로 끕니다.
                        </p>
                        <div className="bg-background rounded-md p-6">
                            <BaseCard>
                                <HistoryList className="border-t-0">
                                    <HistoryItem
                                        meta={[
                                            <span key="date" className="typo-body-l-regular text-foreground-subtle">
                                                2026-05-15
                                            </span>,
                                        ]}
                                        title={
                                            <h3 className="typo-title-m-bold text-foreground">평가 신청 오류 문의</h3>
                                        }
                                    />
                                    <HistoryItem
                                        meta={[
                                            <span key="date" className="typo-body-l-regular text-foreground-subtle">
                                                2026-05-14
                                            </span>,
                                        ]}
                                        title={
                                            <h3 className="typo-title-m-bold text-foreground">
                                                자가진단 결과 오류 문의
                                            </h3>
                                        }
                                    />
                                </HistoryList>
                            </BaseCard>
                        </div>
                        <CodeBlock code={CARD_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="hl-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="hl-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        이름이 비슷한 목록이 많습니다. 담는 내용으로 고릅니다.
                    </p>
                </div>
                <Table caption="목록 컴포넌트 선택 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="hl-a11y" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="hl-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        구조와 읽기 순서는 컴포넌트가 처리합니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        <code>ul</code> · <code>li</code> 로 마크업합니다. 제목의 헤딩 단계는 <code>title</code> 에
                        요소째 넘겨 사용처가 정합니다[6.4.2].
                    </li>
                    <li>
                        <code>HistoryAction</code> 은 <code>button</code> 이며 비활성은 <code>disabled</code> 로 눌리지
                        않는 상태를 보여 줍니다[6.1.1].
                    </li>
                    <li>
                        상태·등급 색은 글자와 함께 전달합니다[5.3.1]. 아이콘은 <code>aria-hidden</code> 입니다.
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="hl-props" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="hl-props" className="typo-h4-bold">
                        Props API
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>HistoryList</code> · <code>HistoryItem</code> · <code>HistoryAction</code> 의 속성입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="HistoryList와 HistoryItem, HistoryAction Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default HistoryListGuidePage
