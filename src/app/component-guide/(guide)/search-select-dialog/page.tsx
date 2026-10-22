// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import {DialogNotice} from '@/components/composite/dialog-notice'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {SearchSelectDemo} from './search-select-demo'

export const metadata: Metadata = {title: '검색 선택 모달 (SearchSelectDialog)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {SearchSelectDialog} from '@/components/composite/search-select-dialog'

<SearchSelectDialog
  title="기술평가센터 검색"
  notices={['지역본부 선택 후 기술평가센터를 검색·선택하세요.']}
  steps={{search: '지역본부 및 기술평가센터 검색', list: '기술평가센터 목록'}}
  groupFilter={{label: '지역본부', allLabel: '전체 지역본부', options: regions}}
  groupSuffix=" 지역본부"
  keyword={{label: '기술평가센터명', placeholder: '기술평가센터명 입력'}}
  columns={{group: '지역본부', name: '기술평가센터', nameAlign: 'start'}}
  items={centers.map(({code, region, name}) => ({code, group: region, name}))}
  onSelect={(value) => setCenter(value.label)}
>
  <Button type="button" variant="tertiary" size="lg">지점 검색</Button>
</SearchSelectDialog>`

const NOTICE_CODE = `import {DialogNotice} from '@/components/composite/dialog-notice'

<DialogNotice notices={['지역본부 선택 후 기술평가센터를 검색·선택하세요.']} />`

const FLOW_COLUMNS = [
    {key: 'step', header: '순서', align: 'start', rowHeader: true},
    {key: 'what', header: '하는 일', align: 'start', wrap: true},
] as const

const FLOW_ROWS = [
    {
        key: 'search',
        cells: ['① 검색', '묶음(지역본부 등)을 고르고 이름으로 검색합니다. 묶음이 없는 목록은 이름만 검색합니다.'],
    },
    {key: 'list', cells: ['② 목록', '검색 결과에서 한 줄을 고릅니다. 줄 전체가 라디오라 클릭 · 화살표 키로 고릅니다.']},
    {
        key: 'confirm',
        cells: ['③ 확인', '고른 값을 확인하고 [선택 완료]를 누르면 onSelect 로 값이 넘어가고 모달이 닫힙니다.'],
    },
] as const

const PROPS_ITEMS = [
    ['SearchSelectDialog', 'title', '모달 제목입니다.', '-', 'string'],
    ['SearchSelectDialog', 'notices', '모달 맨 위 안내입니다(DialogNotice).', '-', 'readonly string[]'],
    ['SearchSelectDialog', 'steps', '① 검색 · ② 목록 줄의 안내 문구입니다.', '-', '{search: string; list: string}'],
    [
        'SearchSelectDialog',
        'groupFilter',
        '왼쪽 묶음 셀렉트입니다. 묶음이 없는 목록(은행 등)에서는 넘기지 않습니다.',
        '-',
        '{label; allLabel; options: readonly string[]}',
    ],
    [
        'SearchSelectDialog',
        'groupSuffix',
        '목록 · 선택 줄의 묶음 이름 뒤에 붙일 말입니다(예: " 지역본부").',
        "''",
        'string',
    ],
    [
        'SearchSelectDialog',
        'columns',
        '표 머리 열 이름입니다. nameAlign 으로 이름 칸 정렬을 고릅니다(기본 가운데).',
        '-',
        "{group?: string; name: string; nameAlign?: 'center' | 'start'}",
    ],
    [
        'SearchSelectDialog',
        'keyword',
        '검색어 칸의 이름표와 안내 문구입니다.',
        '-',
        '{label: string; placeholder: string}',
    ],
    [
        'SearchSelectDialog',
        'items',
        '목록입니다. 조회 API 응답으로 바꾸면 그대로 동작합니다.',
        '-',
        'readonly {code: string; group?: string; name: string}[]',
    ],
    [
        'SearchSelectDialog',
        'onSelect',
        '[선택 완료] 때 고른 줄을 넘깁니다. label 은 입력칸에 넣을 표기입니다.',
        '-',
        '(value: SearchSelectItem & {label: string}) => void',
    ],
    ['SearchSelectDialog', 'children', '모달을 여는 버튼입니다.', '-', 'ReactNode'],
    ['DialogNotice', 'notices', '모달 맨 위 회색 안내 패널의 문장 목록입니다.', '-', 'readonly string[]'],
] as const

const SearchSelectDialogGuidePage = () => (
    <GuidePageShell
        title="검색 선택 모달 (SearchSelectDialog)"
        description="목록을 검색해 한 줄을 고르는 모달입니다. 보증추천의 지점 검색처럼 목록과 문구만 바꿔 씁니다."
    >
        <BaseCard>
            <section aria-labelledby="search-select-basic" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="search-select-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        고르는 순서는{' '}
                        <Link href="/component-guide/dialog" className={LINK_CLASS}>
                            업종코드 조회
                        </Link>{' '}
                        와 같습니다. [지점 검색]을 눌러 고르면 입력칸이 채워집니다.
                    </p>
                </div>
                <SearchSelectDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="search-select-flow" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="search-select-flow" className="typo-h4-bold">
                        고르는 순서
                    </h2>
                </div>
                <Table caption="검색 선택 모달의 고르는 순서" columns={FLOW_COLUMNS} rows={FLOW_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="search-select-notice" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="search-select-notice" className="typo-h4-bold">
                        모달 안내 패널 (DialogNotice)
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        모달 맨 위에서 무엇을 하는 자리인지 한두 줄로 알립니다. 페이지 하단의 InfoBox 보다 작은 모달
                        규격(14px · 여백 20)입니다.
                    </p>
                </div>
                <DialogNotice notices={['지역본부 선택 후 기술평가센터를 검색·선택하세요.']} />
                <CodeBlock code={NOTICE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="search-select-a11y" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="search-select-a11y" className="typo-h4-bold">
                        접근성
                    </h2>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        표처럼 보이지만 하는 일이 &apos;여럿 중 하나 고르기&apos; 라 라디오 묶음입니다. 줄 클릭 · 화살표
                        이동 · 읽어 주기가 기본으로 됩니다[6.1.1][8.2.1].
                    </li>
                    <li>검색어 칸 · 묶음 셀렉트에는 이름표가 붙어 있습니다[7.4.1].</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="search-select-props" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="search-select-props" className="typo-h4-bold">
                        Props API
                    </h2>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="SearchSelectDialog · DialogNotice Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SearchSelectDialogGuidePage
