import type {Metadata} from 'next'
import CodeBlock from '@/components/guide/code-block'
import GuidePage from '@/components/guide/guide-page'
import {Separator} from '@/components/kit/separator'

export const metadata: Metadata = {title: '구분선 (Separator)'}

const DIVIDER_CLASS = 'border-subtle-3 my-10 border-t bg-transparent'

// 사용법 스니펫 — CopyChip 의 label 로 짧게 노출하고 클립보드엔 이 전체를 복사한다.
const USAGE_CODE = `<p>위 콘텐츠</p>
<Separator className="border-subtle-3 my-10 border-t bg-transparent" />
<p>아래 콘텐츠</p>`

// 구분선 — shadcn Separator(src/components/ui/separator.tsx) 원본을 그대로 쓰고 className 으로만
// 스타일을 확장한다([SC-02] vendored 컴포넌트는 확장만, 감싸지 않는다 — 별도 Divider 래퍼를 만들지 않는다).
// Separator 원형은 배경색(bg-border)으로 1px 선을 그리지만, 이 프로젝트의 구분선은 실제 border-top 으로
// 선을 그려 border-subtle-3 를 테두리 색으로 쓴다(box-sizing: border-box 라 1px 높이 안에서 1px
// border-top 이 그대로 두께 1px 을 유지). 위아래 40px 간격(my-10)을 함께 준다.
const SeparatorGuidePage = () => (
    <GuidePage
        title="구분선 (Separator)"
        description="shadcn Separator 원본에 className 만 얹어 만드는 구분선 패턴입니다."
    >
        <section aria-labelledby="dv-demo" className="flex flex-col gap-4">
            <div>
                <h2 id="dv-demo" className="typo-h4-bold">
                    사용 예시
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    두께 1px, 색상 <code className="font-mono">border-subtle-3</code>, 위아래 간격{' '}
                    <code className="font-mono">my-10</code>(40px)을 클래스로 직접 지정합니다.
                </p>
            </div>
            <div className="border-border rounded-md border p-6">
                <p className="typo-body-l-regular text-foreground">위 콘텐츠</p>
                <Separator className={DIVIDER_CLASS} />
                <p className="typo-body-l-regular text-foreground">아래 콘텐츠</p>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="dv-recipe" className="flex flex-col gap-4">
            <div>
                <h2 id="dv-recipe" className="typo-h4-bold">
                    클래스 레시피
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Separator 원형은 배경색(<code className="font-mono">bg-border</code>)으로 선을 그리는데, 아래 네
                    클래스로 실제 <code className="font-mono">border-top</code> 선으로 바꾼다.
                </p>
            </div>
            <div className="bg-background border-border overflow-x-auto rounded-md border">
                <table className="w-full text-left">
                    <caption className="sr-only">클래스 레시피 목록</caption>
                    <thead>
                        <tr className="border-border border-b bg-gray-100/25">
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                클래스
                            </th>
                            <th scope="col" className="typo-body-l-medium px-4 py-3">
                                역할
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                border-t
                            </th>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                1px 두께의 실제 테두리 선을 그린다.
                            </td>
                        </tr>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                border-subtle-3
                            </th>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                테두리 색을 시맨틱 토큰 subtle-3 로 지정한다.
                            </td>
                        </tr>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                bg-transparent
                            </th>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                Separator 원형의 기본 배경(bg-border)을 지운다.
                            </td>
                        </tr>
                        <tr className="border-border bg-background border-b last:border-b-0">
                            <th
                                scope="row"
                                className="typo-body-l-regular border-border text-primary border-r px-4 py-3 align-top font-mono font-normal"
                            >
                                my-10
                            </th>
                            <td className="typo-body-l-regular text-muted-foreground px-4 py-3">
                                위아래 40px 간격을 준다.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section aria-labelledby="dv-props" className="flex flex-col gap-4">
            <div>
                <h2 id="dv-props" className="typo-h4-bold">
                    Props
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    Separator(Radix)의 props 를 그대로 받습니다.
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
                                orientation
                            </th>
                            <td className="px-4 py-3">
                                <div className="flex flex-col gap-2">
                                    <p className="typo-body-l-regular text-muted-foreground">가로/세로 방향</p>
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        &apos;horizontal&apos; | &apos;vertical&apos;
                                    </span>
                                </div>
                            </td>
                            <td className="typo-caption-regular text-muted-foreground px-4 py-3 font-mono">
                                &apos;horizontal&apos;
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        horizontal
                                    </span>
                                    <span className="text-primary inline-block w-fit rounded bg-gray-100 px-2 py-1 font-mono text-xs">
                                        vertical
                                    </span>
                                </div>
                            </td>
                        </tr>
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

export default SeparatorGuidePage
