import type {Metadata} from 'next'
import {BaseCard} from '@/components/composite/base-card'
import {
    QuestionGroupHeader,
    QuestionGroupHeaderDescription,
    QuestionGroupHeaderTitle,
} from '@/components/composite/question-group-header'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '문항 그룹 헤더 (QuestionGroupHeader)'}

const USAGE_CODE = `<QuestionGroupHeader>
  <QuestionGroupHeaderTitle>신청기술의 기술 구분을 선택해 주세요.</QuestionGroupHeaderTitle>
  <QuestionGroupHeaderDescription>
    선택에 따라 아래 기술의 차별성 문항이 분기 노출됩니다
  </QuestionGroupHeaderDescription>
</QuestionGroupHeader>`

const TITLE_ONLY_CODE = `<QuestionGroupHeader>
  <QuestionGroupHeaderTitle>신청기술의 기술 구분을 선택해 주세요.</QuestionGroupHeaderTitle>
</QuestionGroupHeader>`

const PROPS_ITEMS = [
    [
        'QuestionGroupHeader',
        'className · div props',
        '그룹 레이아웃과 네이티브 div 속성을 전달합니다.',
        'undefined',
        'HTMLAttributes',
    ],
    ['QuestionGroupHeaderTitle', 'children', '문항 그룹의 안내 제목입니다.', '-', 'ReactNode'],
    [
        'QuestionGroupHeaderTitle',
        'className · p props',
        '제목 스타일과 네이티브 p 속성을 전달합니다.',
        'undefined',
        'HTMLAttributes',
    ],
    ['QuestionGroupHeaderDescription', 'children', '제목 아래 분기 조건이나 보조 설명입니다.', '-', 'ReactNode'],
    [
        'QuestionGroupHeaderDescription',
        'className · p props',
        '설명 스타일과 네이티브 p 속성을 전달합니다.',
        'undefined',
        'HTMLAttributes',
    ],
] as const

const QuestionGroupHeaderGuidePage = () => (
    <GuidePageShell
        title="문항 그룹 헤더 (QuestionGroupHeader)"
        description="연관된 문항 묶음 앞에서 질문 주제와 분기 조건을 안내하는 헤더입니다. 페이지 구획용 SubSectionHeader와 달리 p 기반의 보조 구조로 사용합니다."
    >
        <BaseCard>
            <section aria-labelledby="question-group-header-basic" className="flex flex-col gap-4">
                <div>
                    <h2 id="question-group-header-basic" className="typo-h4-bold">
                        제목과 설명
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        제목은 Body/XL/Bold, 설명은 Caption/Regular 시맨틱 색상으로 표시합니다.
                    </p>
                </div>
                <div className="border-subtle-3 rounded-md border p-6">
                    <QuestionGroupHeader>
                        <QuestionGroupHeaderTitle>신청기술의 기술 구분을 선택해 주세요.</QuestionGroupHeaderTitle>
                        <QuestionGroupHeaderDescription>
                            선택에 따라 아래 기술의 차별성 문항이 분기 노출됩니다
                        </QuestionGroupHeaderDescription>
                    </QuestionGroupHeader>
                </div>
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="question-group-header-title-only" className="flex flex-col gap-4">
                <div>
                    <h2 id="question-group-header-title-only" className="typo-h4-bold">
                        제목만 사용
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        별도 분기 안내가 없다면 Description을 생략합니다.
                    </p>
                </div>
                <div className="border-subtle-3 rounded-md border p-6">
                    <QuestionGroupHeader>
                        <QuestionGroupHeaderTitle>신청기술의 기술 구분을 선택해 주세요.</QuestionGroupHeaderTitle>
                    </QuestionGroupHeader>
                </div>
                <CodeBlock code={TITLE_ONLY_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="question-group-header-props" className="flex flex-col gap-4">
                <div>
                    <h2 id="question-group-header-props" className="typo-h4-bold">
                        Props
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        제목과 설명의 역할을 분리한 compound component입니다.
                    </p>
                </div>
                <PropsTable items={PROPS_ITEMS} caption="QuestionGroupHeader Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default QuestionGroupHeaderGuidePage
