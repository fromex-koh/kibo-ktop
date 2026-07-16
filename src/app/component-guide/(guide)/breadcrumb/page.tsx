import type {Metadata} from 'next'
import {ChevronDownIcon} from 'lucide-react'
import CodeBlock from '@/components/guide/code-block'
import GuidePageShell from '@/components/guide/guide-page-shell'
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/kit/breadcrumb'
import {BreadcrumbDotSeparator} from '@/components/composite/breadcrumb-dot-separator'

export const metadata: Metadata = {title: '브레드크럼 (Breadcrumb)'}

// Figma "브레드크럼" 컨테이너 — bg-surface 알약(rounded-full) + shadow-1 + 좌우 40px·상하 16px 패딩.
const PILL = 'inline-flex items-center rounded-full bg-surface px-10 py-4 shadow-1'

const USAGE_CODE = `<div className="inline-flex items-center rounded-full bg-surface px-10 py-4 shadow-1">
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">홈</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbDotSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/self">자가진단</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbDotSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>고객정보활용동의</BreadcrumbPage>
        {/* 현재 페이지에서 형제 페이지로 이동하는 드롭다운 표시 */}
        <ChevronDownIcon aria-hidden="true" className="text-foreground size-icon-sm shrink-0" />
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</div>`

// 조합 API 설명 — [이름, 설명]
const COMPOSITION = [
    ['Breadcrumb', '<nav aria-label="breadcrumb"> 래퍼.'],
    ['BreadcrumbList', '항목들을 감싸는 <ol>. typo-body-xl-regular·label-foreground·항목 간 12px.'],
    ['BreadcrumbItem', '한 항목 <li>.'],
    ['BreadcrumbLink', '이동 가능한 항목(<a>). hover 시 진해진다.'],
    ['BreadcrumbPage', '현재 페이지(이동 불가). typo-body-xl-bold + foreground, aria-current="page".'],
    ['BreadcrumbSeparator', '구분자. kit 은 원본 그대로(기본 chevron). children 으로 교체 가능.'],
    ['BreadcrumbDotSeparator', '프로젝트 표준 점(·) 구분자(composite). kit Separator 에 점을 주입한 조합.'],
    ['BreadcrumbEllipsis', '경로가 길 때 중간을 … 로 접는 표시.'],
] as const

// 브레드크럼 — shadcn Breadcrumb 를 프로젝트 스타일(점 구분자·토큰 타이포·현재 페이지 강조)로 승격한 styled copy.
// Figma 는 bg-surface 알약(rounded-full + shadow-1) 컨테이너에 담고, 현재 페이지에 드롭다운 화살표(⌄)를 붙인다.
const BreadcrumbGuidePage = () => (
    <GuidePageShell
        title="브레드크럼 (Breadcrumb)"
        description="현재 위치의 상위 경로를 보여주는 내비게이션입니다. bg-surface 알약(shadow-1) 안에 담고 항목은 점(·)으로 구분하며, 현재 페이지는 typo-body-xl-bold로 표시합니다."
    >
        <section aria-labelledby="bc-main" className="flex flex-col gap-4">
            <div>
                <h2 id="bc-main" className="typo-h4-bold">
                    기본 (Figma)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    <code className="font-mono">bg-surface</code> 알약(<code className="font-mono">rounded-full</code> +{' '}
                    <code className="font-mono">shadow-1</code>) 컨테이너 · 점 구분자 · 링크(중간)와 현재 페이지 강조 ·
                    현재 페이지의 드롭다운 화살표(⌄)까지 Figma 그대로입니다.
                </p>
            </div>
            <div>
                <div className={PILL}>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">자가진단</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>고객정보활용동의</BreadcrumbPage>
                                <ChevronDownIcon aria-hidden="true" className="text-foreground size-icon-sm shrink-0" />
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
            <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
        </section>

        <section aria-labelledby="bc-basic" className="flex flex-col gap-4">
            <div>
                <h2 id="bc-basic" className="typo-h4-bold">
                    2뎁스 (드롭다운 없음)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    단계가 적고 현재 페이지에 드롭다운이 필요 없으면 화살표를 뺍니다.
                </p>
            </div>
            <div>
                <div className={PILL}>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>자가진단</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
        </section>

        <section aria-labelledby="bc-ellipsis" className="flex flex-col gap-4">
            <div>
                <h2 id="bc-ellipsis" className="typo-h4-bold">
                    접힘 (Ellipsis)
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    경로가 길면 중간 단계를 <code className="font-mono">BreadcrumbEllipsis</code>(…)로 접습니다.
                </p>
            </div>
            <div>
                <div className={PILL}>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">홈</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbEllipsis />
                            </BreadcrumbItem>
                            <BreadcrumbDotSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>고객정보활용동의</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
        </section>

        <section aria-labelledby="bc-composition" className="flex flex-col gap-4">
            <div>
                <h2 id="bc-composition" className="typo-h4-bold">
                    구성
                </h2>
                <p className="typo-body-l-regular text-muted-foreground">
                    브레드크럼은 여러 하위 컴포넌트로 조합합니다.
                </p>
            </div>
            <dl className="flex flex-col gap-2">
                {COMPOSITION.map(([name, desc]) => (
                    <div key={name} className="flex flex-col gap-0.5">
                        <dt className="typo-body-l-medium text-primary font-mono">{name}</dt>
                        <dd className="typo-body-l-regular text-muted-foreground">{desc}</dd>
                    </div>
                ))}
            </dl>
        </section>
    </GuidePageShell>
)

export default BreadcrumbGuidePage
