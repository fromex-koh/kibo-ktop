// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.

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

const USAGE_CODE = `import {
  QuestionGroupHeader,
  QuestionGroupHeaderDescription,
  QuestionGroupHeaderTitle,
} from '@/components/composite/question-group-header'

<QuestionGroupHeader>
  <QuestionGroupHeaderTitle>신청기술의 기술 구분을 선택해 주세요.</QuestionGroupHeaderTitle>
  <QuestionGroupHeaderDescription>
    선택에 따라 아래 기술의 차별성 문항이 분기 노출됩니다
  </QuestionGroupHeaderDescription>
</QuestionGroupHeader>`

const TITLE_ONLY_CODE = `<QuestionGroupHeader>
  <QuestionGroupHeaderTitle>신청기술의 기술 구분을 선택해 주세요.</QuestionGroupHeaderTitle>
</QuestionGroupHeader>`

const PROPS_ITEMS = [
    ['QuestionGroupHeader', 'children', 'Title 과 Description 을 넣습니다.', '-', 'ReactNode'],
    ['QuestionGroupHeader', 'className · div 속성', '바깥 div 에 전달됩니다.', 'undefined', "ComponentProps<'div'>"],
    ['QuestionGroupHeaderTitle', 'children', '문항 묶음의 안내 제목입니다.', '-', 'ReactNode'],
    ['QuestionGroupHeaderTitle', 'className · p 속성', '제목 p 에 전달됩니다.', 'undefined', "ComponentProps<'p'>"],
    ['QuestionGroupHeaderDescription', 'children', '제목 아래 분기 조건 등 보조 설명입니다.', '-', 'ReactNode'],
    [
        'QuestionGroupHeaderDescription',
        'className · p 속성',
        '설명 p 에 전달됩니다.',
        'undefined',
        "ComponentProps<'p'>",
    ],
] as const

const QuestionGroupHeaderGuidePage = () => (
    <GuidePageShell
        title="문항 그룹 헤더 (QuestionGroupHeader)"
        description="연관된 문항 묶음 앞에서 질문 주제와 분기 조건을 안내하는 헤더입니다."
    >
        <BaseCard>
            <section aria-labelledby="question-group-header-basic" className="flex flex-col gap-6">
                <div className="flex max-w-4xl flex-col gap-2">
                    <h2 id="question-group-header-basic" className="typo-h4-bold">
                        기본 사용
                    </h2>
                    <p className="typo-body-l-regular text-label-foreground">
                        문항 목록이나 선택 컨트롤 위에 둡니다. 제목은 <code>typo-body-xl-medium</code>, 설명은{' '}
                        <code>typo-caption-regular</code> 이며 둘 다 헤딩이 아니라 <code>p</code> 입니다. 구획 제목에는
                        SubSectionHeader 를 씁니다.
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

                <div className="border-subtle-3 divide-subtle-3 flex flex-col divide-y border-t">
                    <div className="flex flex-col gap-4 py-8 last:pb-0">
                        <h3 className="typo-title-m-bold text-foreground">제목만 사용</h3>
                        <p className="typo-body-l-regular text-label-foreground">
                            보조 설명이 없으면 Description 을 생략합니다.
                        </p>
                        <div className="border-subtle-3 rounded-md border p-6">
                            <QuestionGroupHeader>
                                <QuestionGroupHeaderTitle>
                                    신청기술의 기술 구분을 선택해 주세요.
                                </QuestionGroupHeaderTitle>
                            </QuestionGroupHeader>
                        </div>
                        <CodeBlock code={TITLE_ONLY_CODE} language="tsx" copyLabel="복사" />
                    </div>
                </div>
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="question-group-header-props" className="flex flex-col gap-6">
                <h2 id="question-group-header-props" className="typo-h4-bold">
                    Props API
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="QuestionGroupHeader Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default QuestionGroupHeaderGuidePage
