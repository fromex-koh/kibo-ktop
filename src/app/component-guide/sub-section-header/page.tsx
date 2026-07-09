import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePage from '@/components/guide/guide-page'
import {
    SubSectionHeader,
    SubSectionHeaderAction,
    SubSectionHeaderDescription,
    SubSectionHeaderTitle,
} from '@/components/sub-section-header'
import {Button} from '@/components/ui/button'

export const metadata: Metadata = {title: '서브섹션 헤더 (SubSectionHeader)'}

// 사용법 스니펫 — CopyChip 의 label 로 짧게 노출하고 클립보드엔 이 전체를 복사한다.
const USAGE_CODE = `<SubSectionHeader>
  <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
  <SubSectionHeaderDescription>
    담당자 정보를 정확히 입력해 주세요.
  </SubSectionHeaderDescription>
</SubSectionHeader>`

const USAGE_CODE_ACTION = `<SubSectionHeader>
  <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
  <SubSectionHeaderDescription>
    담당자 정보를 정확히 입력해 주세요.
  </SubSectionHeaderDescription>
  <SubSectionHeaderAction>
    <Button variant="outline" size="sm">
      초기화
    </Button>
  </SubSectionHeaderAction>
</SubSectionHeader>`

// 서브섹션 헤더 — SectionHeader(h2) 보다 한 단계 더 작은 섹션 안 하위 구획 타이틀 컴포넌트.
// 구조·색상(text-foreground/text-foreground-subtle)·액션 유무 조건은 SectionHeader 와 동일하고
// 타이포만 다르다(SectionHeader: Heading/H4/bold → SubSectionHeader: Title/L/bold). 헤딩 레벨도
// 한 단계 아래(h3).
const SubSectionHeaderGuidePage = () => (
    <GuidePage
        title="서브섹션 헤더 (SubSectionHeader)"
        description="섹션 안의 더 작은 하위 구획 최상단의 제목(+선택적 액션) 컴포넌트입니다."
    >
        <section aria-labelledby="ssh-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="ssh-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Title/L/bold 제목 + Body/XL/Regular 설명, 간격은 gap-y-1.5(6px)입니다.
                </p>
            </div>
            <div className="border-border rounded-md border p-6">
                <SubSectionHeader>
                    <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
                    <SubSectionHeaderDescription>담당자 정보를 정확히 입력해 주세요.</SubSectionHeaderDescription>
                </SubSectionHeader>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">SubSectionHeaderAction — 오른쪽 액션(선택)</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    SectionHeader 와 동일하게 <code className="font-mono">SubSectionHeaderAction</code> 을 넣으면
                    자동으로 제목은 왼쪽, 액션은 오른쪽 2열 레이아웃이 된다(CSS{' '}
                    <code className="font-mono">has-data-[slot=...]</code> 선택자 — JS 분기 없음).
                </p>
            </div>
            <div className="border-border rounded-md border p-6">
                <SubSectionHeader>
                    <SubSectionHeaderTitle>기업 담당자 정보</SubSectionHeaderTitle>
                    <SubSectionHeaderDescription>담당자 정보를 정확히 입력해 주세요.</SubSectionHeaderDescription>
                    <SubSectionHeaderAction>
                        <Button variant="outline" size="sm">
                            초기화
                        </Button>
                    </SubSectionHeaderAction>
                </SubSectionHeader>
            </div>
            <CodeBlock code={USAGE_CODE_ACTION} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="ssh-composition" className="flex flex-col gap-4">
            <div>
                <h2 id="ssh-composition" className="typo-h4-bold">
                    Composition
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    이 컴포넌트 내부에 들어갈 수 있는 요소들입니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Composition 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Name
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                SubSectionHeaderTitle
                            </th>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                하위 구획 제목을 표시합니다. 내부적으로 h3 요소를 렌더링합니다.
                            </td>
                        </tr>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                SubSectionHeaderDescription
                            </th>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                추가 설명을 표시합니다. 내부적으로 p 요소를 렌더링합니다.
                            </td>
                        </tr>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                SubSectionHeaderAction
                            </th>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                제목 오른쪽에 배치하는 선택적 액션(버튼 등) 영역입니다. 넣지 않아도 됩니다.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="ssh-props" className="flex flex-col gap-4">
            <div>
                <h2 id="ssh-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    SubSectionHeader(최상위)에서 커스터마이징 가능한 속성입니다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">Props 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Name
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Description
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Default
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                Control
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                className
                            </th>
                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-2">
                                    <p className="typo-body-l-regular text-muted-foreground">
                                        추가 클래스명으로 스타일 확장
                                    </p>
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        string
                                    </span>
                                </div>
                            </td>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                &quot;&quot;
                            </td>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </GuidePage>
)

export default SubSectionHeaderGuidePage
