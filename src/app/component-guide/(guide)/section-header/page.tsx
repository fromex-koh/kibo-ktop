import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {Button} from '@/components/ui/button'
import {BaseCard} from '@/components/composite/base-card'
import {
    SectionHeader,
    SectionHeaderAction,
    SectionHeaderDescription,
    SectionHeaderTitle,
} from '@/components/composite/section-header'

export const metadata: Metadata = {title: '섹션 헤더 (SectionHeader)'}

// 사용법 스니펫 — CopyChip 의 label 로 짧게 노출하고 클립보드엔 이 전체를 복사한다.
const USAGE_CODE = `<SectionHeader>
  <SectionHeaderTitle>기업 정보</SectionHeaderTitle>
  <SectionHeaderDescription>
    사업자등록증 기준으로 정확히 입력해 주세요.
  </SectionHeaderDescription>
</SectionHeader>`

const USAGE_CODE_ACTION = `<SectionHeader>
  <SectionHeaderTitle>기업정보</SectionHeaderTitle>
  <SectionHeaderDescription>
    * 표시 항목은 필수 입력 항목입니다.
  </SectionHeaderDescription>
  <SectionHeaderAction>
    <Button variant="tertiary" size="small">수정</Button>
  </SectionHeaderAction>
</SectionHeader>`

// 섹션 헤더 — 페이지 안 개별 섹션의 제목+설명 묶음 컴포넌트.
// 섹션 타이틀이므로 h2 를 쓰고, text-foreground·text-foreground-subtle 토큰을 사용한다.
const SectionHeaderGuidePage = () => (
    <GuidePageShell
        title="섹션 헤더 (SectionHeader)"
        description="페이지 안 개별 섹션 최상단의 제목+설명 묶음 컴포넌트입니다."
    >
        <section aria-labelledby="sh-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="sh-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Heading/H4/bold 제목 + Body/XL/Regular 설명, 간격은 gap-2(8px) 고정입니다.
                </p>
            </div>
            <BaseCard>
                <SectionHeader>
                    <SectionHeaderTitle>기업 정보</SectionHeaderTitle>
                    <SectionHeaderDescription>사업자등록증 기준으로 정확히 입력해 주세요.</SectionHeaderDescription>
                </SectionHeader>
            </BaseCard>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />

            <div className="flex flex-col gap-2">
                <h3 className="typo-body-l-medium text-foreground">SectionHeaderAction — 오른쪽 액션(선택)</h3>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">SectionHeaderAction</code> 을 넣으면 자동으로 제목/설명은 왼쪽, 액션은
                    오른쪽 2열 레이아웃이 된다(CSS <code className="font-mono">has-data-[slot=...]</code> 선택자 — JS
                    분기 없음). 넣지 않으면 위 예시처럼 세로로만 쌓인다. 액션 버튼은 Figma 기준{' '}
                    <code className="font-mono">variant=&quot;tertiary&quot;</code> ·{' '}
                    <code className="font-mono">size=&quot;small&quot;</code>(40px) 이다.
                </p>
            </div>
            <BaseCard>
                <SectionHeader>
                    <SectionHeaderTitle>기업정보</SectionHeaderTitle>
                    <SectionHeaderDescription>* 표시 항목은 필수 입력 항목입니다.</SectionHeaderDescription>
                    <SectionHeaderAction>
                        <Button variant="tertiary" size="small">
                            수정
                        </Button>
                    </SectionHeaderAction>
                </SectionHeader>
            </BaseCard>
            <CodeBlock code={USAGE_CODE_ACTION} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="sh-composition" className="flex flex-col gap-4">
            <div>
                <h2 id="sh-composition" className="typo-h4-bold">
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
                                SectionHeaderTitle
                            </th>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                섹션 제목을 표시합니다. 내부적으로 h2 요소를 렌더링합니다.
                            </td>
                        </tr>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                SectionHeaderDescription
                            </th>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                섹션의 추가 설명을 표시합니다. 내부적으로 p 요소를 렌더링합니다.
                            </td>
                        </tr>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                SectionHeaderAction
                            </th>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                제목 오른쪽에 배치하는 선택적 액션(버튼 등) 영역입니다. 넣지 않아도 됩니다.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="sh-props" className="flex flex-col gap-4">
            <div>
                <h2 id="sh-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    SectionHeader(최상위)에서 커스터마이징 가능한 속성입니다.
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
    </GuidePageShell>
)

export default SectionHeaderGuidePage
