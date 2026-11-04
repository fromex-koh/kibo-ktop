// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {SelectableListCardDemo} from './selectable-list-card-demo'

export const metadata: Metadata = {title: '선택 목록 카드 (SelectableListCard)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {SelectableListCard, SelectableListCardGroup} from '@/components/composite/selectable-list-card'

<SelectableListCardGroup value={companyId} onValueChange={setCompanyId} aria-labelledby="company-list-title">
  {companies.map((company) => (
    <SelectableListCard
      key={company.id}
      value={company.id}
      title={company.name}
      // 대표자명 · 번호는 가린 값(maskPersonName · getInnovationGrowthCompanyNumber)
      fieldRows={[[{label: '대표자명', value: maskPersonName(company.representativeName)}, getInnovationGrowthCompanyNumber(company)]]}
      trailing={<>특허 {company.patentCount}건</>}
      hasChevron
    />
  ))}
</SelectableListCardGroup>`

const EDGE_COLUMNS = [
    {key: 'case', header: '경우', align: 'start', rowHeader: true},
    {key: 'how', header: '처리', align: 'start', wrap: true},
    {key: 'where', header: '조회 화면에서 보는 법', align: 'start', wrap: true},
] as const

const EDGE_ROWS = [
    {
        key: 'short-name',
        cells: [
            '긴 회사명 · 띄어쓰기 있음',
            '띄어쓰기가 있으면 낱말 단위로, 없으면 줄을 채운 뒤 글자 사이에서 줄을 바꿉니다. 말줄임 없이 카드가 높아집니다.',
            "'테크' 검색 첫 쪽 — 주식회사 글로벌 인공지능…",
        ],
    },
    {
        key: 'long-name',
        cells: [
            '긴 회사명 · 띄어쓰기 없음',
            '칸 끝에서 글자 단위로 끊어 카드 밖으로 나가지 않습니다.',
            "'테크' 검색 첫 쪽 — 주식회사글로벌…",
        ],
    },
    {
        key: 'english',
        cells: ['긴 영문 대문자', '위와 같이 칸 안에서 끊습니다.', "'테크' 검색 첫 쪽 — GLOBALARTIFICIAL…"],
    },
    {
        key: 'count',
        cells: [
            '특허 수 3자리',
            '오른쪽 값은 줄지 않습니다. 375 폭은 같은 줄, 320 폭은 아래 줄로 내려갑니다.',
            "'테크' 검색 첫 쪽 — 특허 999건",
        ],
    },
    {
        key: 'long-patent',
        cells: [
            '긴 특허명 · 보유 기업명',
            '항목 이름은 한 줄을 지키고, 값은 값 칸 안에서 줄을 바꿉니다(둘째 줄도 값 첫 글자에 맞춰 섭니다).',
            "특허 999건 기업을 고른 뒤 목록 안 검색 '분산형', 또는 특허 검색 '분산형'",
        ],
    },
    {
        key: 'long-representative',
        cells: [
            '긴 대표자명',
            "값 줄바꿈은 제목과 같은 규칙입니다 — 띄어쓰기가 있으면 낱말 단위, 없으면 줄을 채운 뒤 글자 사이. 가린 이름('알*산더…')이 '*' 뒤에서 갈리지 않습니다.",
            "'테크' 검색 첫 쪽 — 남*민수 · 김*수 외 2명 · 알*산더크리스토퍼존슨 · C*ristopher Alexander Johnson",
        ],
    },
    {
        key: 'pages',
        cells: [
            '페이지가 아주 많음',
            '번호 · … 합쳐 최대 5개로 한 줄을 지킵니다(Pagination 가이드 참고).',
            "기업 검색 '페이징100'(129쪽) · '페이징1000'(1,281쪽), 특허는 999건 기업(100쪽)",
        ],
    },
] as const

const CHOICE_COLUMNS = [
    {key: 'component', header: '컴포넌트', align: 'start', rowHeader: true},
    {key: 'use', header: '쓰는 곳', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'list',
        cells: [<code key="c">SelectableListCard</code>, '건수가 많은 검색 결과에서 한 건 고르기(1열 · 라디오 표시)'],
    },
    {
        key: 'info',
        cells: [
            <Link key="c" href="/component-guide/selectable-info-card" className={LINK_CLASS}>
                SelectableInfoCard
            </Link>,
            '항목 이름 · 값을 여러 줄로 나란히 비교(2열 · 라디오 표시 없음)',
        ],
    },
    {
        key: 'card',
        cells: [
            <Link key="c" href="/component-guide/selectable-card" className={LINK_CLASS}>
                SelectableCard
            </Link>,
            '한 줄 라벨의 라디오 · 체크박스 선택',
        ],
    },
] as const

const PROPS_ITEMS = [
    [
        'SelectableListCardGroup',
        'value · onValueChange',
        '고른 카드의 value 와 바뀔 때 호출입니다.',
        '-',
        'string · (value) => void',
    ],
    [
        'SelectableListCardGroup',
        'aria-label · aria-labelledby',
        '목록의 이름입니다. 둘 중 하나를 줍니다.',
        '-',
        'string',
    ],
    ['SelectableListCardGroup', 'className · RadioGroup 속성', '그대로 전달합니다.', '-', 'ComponentProps<RadioGroup>'],
    ['SelectableListCard', 'value', '카드의 값입니다(필수).', '-', 'string'],
    ['SelectableListCard', 'title', '제목입니다(필수).', '-', 'string'],
    ['SelectableListCard', 'badge', '제목 옆 표시입니다.', '-', 'ReactNode'],
    [
        'SelectableListCard',
        'fieldRows',
        '제목 아래 줄입니다. 한 줄 안의 label 은 겹치지 않아야 합니다.',
        '-',
        'readonly (readonly {label: string; value: string}[])[]',
    ],
    ['SelectableListCard', 'trailing', '오른쪽 값입니다(건수 등).', '-', 'ReactNode'],
    ['SelectableListCard', 'hasChevron', '오른쪽 끝 화살표입니다. md 미만에서는 보이지 않습니다.', 'false', 'boolean'],
    ['SelectableListCard', 'disabled', '고를 수 없게 합니다.', 'false', 'boolean'],
    ['SelectableListCard', 'id · className', '라디오의 id, 카드에 덧붙일 클래스입니다.', '-', 'string'],
] as const

const SelectableListCardGuidePage = () => (
    <GuidePageShell
        title="선택 목록 카드 (SelectableListCard)"
        description="건수가 많은 검색 결과에서 한 건을 고르는 한 줄 카드입니다."
    >
        <BaseCard>
            <section aria-labelledby="slc-usage" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="slc-usage" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        카드 어디를 눌러도 고를 수 있습니다. 항목이 많으면 fieldRows 에 줄을 나눠 넘깁니다. 긴 제목 ·
                        값은 말줄임 없이 줄을 바꿔 카드 높이가 늘어납니다(예시의 긴 글 카드).
                    </p>
                </div>
                <SelectableListCardDemo />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="slc-edge" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h2 id="slc-edge" className="typo-h4-bold">
                        엣지 케이스
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        위 예시의 긴 글 카드로 바로 볼 수 있고, K-BIGx 기업혁신성장 조회 화면 목업에도 같은 경우가 들어
                        있습니다.
                    </p>
                </div>
                <Table caption="선택 목록 카드 엣지 케이스" columns={EDGE_COLUMNS} rows={EDGE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="slc-choice" className="flex flex-col gap-6">
                <h2 id="slc-choice" className="typo-h4-bold">
                    컴포넌트 선택
                </h2>
                <Table caption="선택 카드 고르는 기준" columns={CHOICE_COLUMNS} rows={CHOICE_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="slc-a11y" className="flex flex-col gap-6">
                <h2 id="slc-a11y" className="typo-h4-bold">
                    접근성
                </h2>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        방향키로 카드를 옮기고 고릅니다. 역할과 상태는 Radix RadioGroup 이 처리합니다[6.1.1][8.2.1].
                    </li>
                    <li>
                        카드 안 글이 라디오의 이름입니다[7.4.1]. 그룹에는 aria-label 또는 aria-labelledby 를 줍니다.
                    </li>
                    <li>고른 상태는 면 · 테두리 색뿐 아니라 라디오 표시로도 전합니다[5.3.1].</li>
                    <li>포커스는 카드 외곽선으로 표시됩니다[6.1.2]. 화살표는 꾸밈이라 aria-hidden 입니다.</li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="slc-props" className="flex flex-col gap-6">
                <h2 id="slc-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="SelectableListCard Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default SelectableListCardGuidePage
