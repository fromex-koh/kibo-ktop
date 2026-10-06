// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

import type {Metadata} from 'next'
import Link from 'next/link'
import {BaseCard} from '@/components/composite/base-card'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'
import {Table} from '@/components/custom/table'
import {FormCard} from '@/components/composite/form-card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/composite/select-field'

export const metadata: Metadata = {title: '폼 카드 (FormCard)'}

const LINK_CLASS = 'text-primary-strong underline underline-offset-4'

const USAGE_CODE = `import {FormCard} from '@/components/composite/form-card'

<FormCard
  title="기업정보"
  subtitle={<><span aria-hidden="true" className="text-error-500">*</span><span className="sr-only">별표</span> 표시 항목은 필수 입력 항목입니다.</>}
  action={<Button variant="tertiary" size="sm">최근 입력 정보 불러오기</Button>}
>
  {/* 본문 — 2열 폼 필드. 라벨은 다른 폼(Input/Select/Textarea)과 동일 스타일, 필수 * 는 text-error-500 */}
  <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="corp-type" className="text-foreground gap-1 font-bold">기업형태 <span aria-hidden="true" className="text-error-500">*</span><span className="sr-only"> (필수)</span></Label>
      <Select required>
        <SelectTrigger id="corp-type" className="w-full">
          <SelectValue placeholder="선택해 주세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="corp">주식회사</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="corp-name" className="text-foreground gap-1 font-bold">기업명 <span aria-hidden="true" className="text-error-500">*</span><span className="sr-only"> (필수)</span></Label>
      <Input id="corp-name" defaultValue="(주)테크놀로지" required disabled />
    </div>
  </div>
</FormCard>`

const PADDING_COLUMNS = [
    {key: 'width', header: '화면 폭', align: 'start', rowHeader: true},
    {key: 'x', header: '좌우 여백', align: 'start'},
    {key: 'y', header: '상하 여백', align: 'start'},
] as const

const PADDING_ROWS = [
    {key: 'base', cells: ['768px 미만', '16px', '24px']},
    {key: 'md', cells: ['768px 이상', '40px', '40px']},
    {key: 'xl', cells: ['1280px 이상', '102px', '40px']},
]

const CHOICE_COLUMNS = [
    {key: 'case', header: '사용 상황', align: 'start', rowHeader: true},
    {key: 'component', header: '선택', align: 'start'},
    {key: 'note', header: '기준', align: 'start', wrap: true},
] as const

const CHOICE_ROWS = [
    {
        key: 'form-card',
        cells: [
            '입력 폼 섹션 하나',
            <code key="component">FormCard</code>,
            '제목 · 설명 · 액션과 폼 본문을 한 장에 담습니다. 좌우 여백이 화면 폭에 따라 넓어집니다.',
        ],
    },
    {
        key: 'base-card',
        cells: [
            '일반 콘텐츠 컨테이너',
            <Link key="component" href="/component-guide/base-card" className={LINK_CLASS}>
                BaseCard
            </Link>,
            '폼이 아닌 구획에 씁니다. 여백은 24px · 32px 두 가지입니다.',
        ],
    },
    {
        key: 'repeat-card',
        cells: [
            '폼 카드 안에서 반복되는 입력 묶음',
            <Link key="component" href="/component-guide/repeat-card" className={LINK_CLASS}>
                RepeatCard
            </Link>,
            '“경력1”처럼 번호가 붙고 접기 · 삭제가 필요한 묶음은 FormCard 본문 안에 RepeatCard 를 둡니다.',
        ],
    },
] as const

const PROPS_ITEMS = [
    ['FormCard', 'title', '카드 제목입니다. h2 로 렌더링됩니다.', '-', 'ReactNode'],
    ['FormCard', 'subtitle', '제목 아래 설명 또는 필수 입력 안내입니다.', '-', 'ReactNode'],
    [
        'FormCard',
        'subtitleAsChild',
        'true 이면 subtitle 을 p 로 감싸지 않고 넘긴 요소 그대로 렌더링합니다. subtitle 이 ul 목록일 때 씁니다.',
        '-',
        'boolean',
    ],
    ['FormCard', 'action', '헤더 오른쪽 액션입니다. 여러 개를 넘기면 16px 간격으로 놓입니다.', '-', 'ReactNode'],
    [
        'FormCard',
        'stackActionOnMobile',
        'true 이면 768px 미만에서 액션을 제목·설명 아래 줄로 내립니다. 버튼이 여럿이거나 이름이 길 때 씁니다.',
        'false',
        'boolean',
    ],
    [
        'FormCard',
        'descriptionFullWidth',
        'true 이면 액션은 제목 줄에만 두고 설명은 그 아래 전체 폭으로 펼칩니다. 설명이 길 때 씁니다.',
        'false',
        'boolean',
    ],
    ['FormCard', 'children', '헤더 아래 폼 본문입니다. 필수입니다.', '-', 'ReactNode'],
    ['FormCard', 'className', '카드 바깥 요소에 클래스를 추가합니다.', '-', 'string'],
] as const

const FormCardGuidePage = () => (
    <GuidePageShell title="폼 카드 (FormCard)" description="폼 섹션의 제목·설명·액션과 본문을 하나로 묶는 카드입니다.">
        <BaseCard>
            <section aria-labelledby="form-card-demo" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="form-card-demo" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        <code>title</code>·<code>subtitle</code>·<code>action</code>을 넘기면 헤더가 표시되고,{' '}
                        <code>children</code>이 그 아래 본문이 됩니다. 셋을 모두 생략하면 본문만 표시됩니다.
                    </p>
                </div>
                <div className="bg-background rounded-xl p-4 md:p-6">
                    <FormCard
                        title="기업정보"
                        subtitle={
                            <>
                                <span aria-hidden="true" className="text-error-500">
                                    *
                                </span>
                                <span className="sr-only">별표</span> 표시 항목은 필수 입력 항목입니다.
                            </>
                        }
                        action={
                            <Button variant="tertiary" size="sm">
                                최근 입력 정보 불러오기
                            </Button>
                        }
                    >
                        {/* 한 행에 2개씩(2열 그리드), 좁은 폭에선 1열 */}
                        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="corp-type" className="text-foreground gap-1 font-bold">
                                    기업형태
                                    <span aria-hidden="true" className="text-error-500">
                                        *
                                    </span>
                                    <span className="sr-only"> (필수)</span>
                                </Label>
                                <Select required>
                                    <SelectTrigger id="corp-type" className="w-full">
                                        <SelectValue placeholder="선택해 주세요" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="corp">주식회사</SelectItem>
                                        <SelectItem value="llc">유한회사</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="corp-name" className="text-foreground gap-1 font-bold">
                                    기업명
                                    <span aria-hidden="true" className="text-error-500">
                                        *
                                    </span>
                                    <span className="sr-only"> (필수)</span>
                                </Label>
                                <Input id="corp-name" defaultValue="(주)테크놀로지" required disabled />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="corp-reg" className="text-foreground gap-1 font-bold">
                                    사업자번호
                                    <span aria-hidden="true" className="text-error-500">
                                        *
                                    </span>
                                    <span className="sr-only"> (필수)</span>
                                </Label>
                                <Input id="corp-reg" defaultValue="123-45-67890" required />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="corp-corp-no" className="text-foreground gap-1 font-bold">
                                    법인번호
                                </Label>
                                <Input id="corp-corp-no" defaultValue="110111-1234567" />
                            </div>
                        </div>
                    </FormCard>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="form-card-padding" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="form-card-padding" className="typo-h4-bold">
                        여백
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        여백은 화면 폭에 따라 자동으로 바뀝니다. 헤더와 본문 사이 간격은 40px 입니다.
                    </p>
                </div>
                <Table caption="화면 폭별 FormCard 안쪽 여백" columns={PADDING_COLUMNS} rows={PADDING_ROWS} size="md" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="form-card-choice" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="form-card-choice" className="typo-h4-bold">
                        컴포넌트 선택
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">담는 내용에 따라 카드를 고릅니다.</p>
                </div>
                <Table
                    caption="FormCard · BaseCard · RepeatCard 사용 기준"
                    columns={CHOICE_COLUMNS}
                    rows={CHOICE_ROWS}
                    size="md"
                />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="form-card-accessibility" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="form-card-accessibility" className="typo-h4-bold">
                        접근성
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        제목 · 설명 마크업은 컴포넌트가 처리합니다. 폼 필드의 레이블과 오류 연결은 사용처 몫입니다.
                    </p>
                </div>
                <ul className="typo-body-l-regular text-label-foreground flex list-disc flex-col gap-2 pl-5">
                    <li>
                        제목은 <code>h2</code>, 설명은 <code>p</code>로 렌더링됩니다[6.4.2]. 설명에 <code>ul</code>{' '}
                        목록을 넘길 때는 <code>subtitleAsChild</code>를 함께 줘야 유효한 마크업이 됩니다[8.1.1].
                    </li>
                    <li>
                        필수 표시 <code>*</code>는 <code>aria-hidden</code> 으로 숨기고 <code>sr-only</code> 문구를 함께
                        둡니다[5.3.1].
                    </li>
                    <li>
                        필드마다 <code>Label htmlFor</code> 와 <code>id</code>를 연결합니다[7.4.1].
                    </li>
                </ul>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="form-card-props" className="flex flex-col gap-6">
                <h2 id="form-card-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="FormCard Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default FormCardGuidePage
