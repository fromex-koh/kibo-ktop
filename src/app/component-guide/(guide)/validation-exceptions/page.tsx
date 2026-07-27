import type {Metadata} from 'next'
import {CircleAlert, CircleCheck, ExternalLink, Info} from 'lucide-react'
import {BaseCard} from '@/components/composite/base-card'
import {InfoBox, InfoBoxItem} from '@/components/composite/info-box'
import {SectionHeader, SectionHeaderDescription, SectionHeaderTitle} from '@/components/composite/section-header'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {Badge} from '@/components/ui/badge'
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'

export const metadata: Metadata = {title: '마크업 검증'}

const AUDIT_DATE = '2026-07-26'

const VALIDATION_RESULTS = [
    {
        route: '/component-guide/select',
        owner: 'shadcn/ui → Radix UI Select',
        message: 'Element “option” without attribute “label” must not be empty.',
        count: 6,
        evidence: 'Radix Select가 폼 연동을 위해 생성한 숨은 네이티브 select의 빈 option에서 재현',
        decision: '외부 라이브러리 원인 확인',
    },
    {
        route: '/component-guide/chart',
        owner: 'shadcn/ui Chart',
        message: 'Element “style” not allowed as child of element “div” in this context.',
        count: 11,
        evidence: 'shadcn ChartStyle이 ChartContainer 내부에 생성한 인라인 style 요소에서 재현',
        decision: '외부 라이브러리 원인 확인',
    },
    {
        route: '/component-guide/chart',
        owner: 'Recharts ResponsiveContainer',
        message: 'Attribute “width” not allowed on element “div” at this point.',
        count: 11,
        evidence: 'Recharts가 생성한 div.recharts-wrapper의 width 속성에서 재현',
        decision: '차트 라이브러리 원인 확인',
    },
    {
        route: '/component-guide/chart',
        owner: 'Recharts ResponsiveContainer',
        message: 'Attribute “height” not allowed on element “div” at this point.',
        count: 11,
        evidence: 'Recharts가 생성한 div.recharts-wrapper의 height 속성에서 재현',
        decision: '차트 라이브러리 원인 확인',
    },
] as const

const SCREEN_VALIDATION_RESULTS = [
    {
        route: '/component-guide/self-diagnosis/evaluation-model',
        errors: 1,
        warnings: 1,
        result: 'Invalid',
        detail: '빈 option 1건 — Footer의 “관련 사이트” Radix Select가 생성한 숨은 네이티브 select',
        cause: '고객사 요청 라이브러리',
        owner: 'shadcn/ui → Radix UI Select',
    },
    {
        route: '/component-guide/self-diagnosis/customer-consent',
        errors: 8,
        warnings: 5,
        result: 'Invalid',
        detail: 'label 안의 div 오류 4건 + label 안의 폼 컨트롤 중복 오류 4건 — SelectableCard 4개의 FieldLabel > Field 구조와 Radix 숨은 input 조합',
        cause: '고객사 요청 라이브러리 패턴과 프로젝트 조합',
        owner: 'shadcn/ui Choice Card + Radix UI Radio/Checkbox',
    },
    {
        route: '/component-guide/self-diagnosis/company-info',
        errors: 1,
        warnings: 1,
        result: 'Invalid',
        detail: '빈 option 1건 — “기업형태” Radix Select가 생성한 숨은 네이티브 select',
        cause: '고객사 요청 라이브러리',
        owner: 'shadcn/ui → Radix UI Select',
    },
    {
        route: '/component-guide/self-diagnosis/checklist',
        errors: 2,
        warnings: 1,
        result: 'Invalid',
        detail: '빈 option 2건 — “신청기술 유형”과 “해당 항목 선택” Radix Select의 숨은 네이티브 select',
        cause: '고객사 요청 라이브러리',
        owner: 'shadcn/ui → Radix UI Select',
    },
    {
        route: '/component-guide/self-diagnosis/complete',
        errors: 0,
        warnings: 1,
        result: 'Valid',
        detail: 'W3C Markup Validation Service error 없음',
        cause: '해당 없음',
        owner: '-',
    },
    {
        route: '/component-guide/main-page',
        errors: 1,
        warnings: 1,
        result: 'Invalid',
        detail: '빈 option 1건 — Footer의 “관련 사이트” Radix Select가 생성한 숨은 네이티브 select',
        cause: '고객사 요청 라이브러리',
        owner: 'shadcn/ui → Radix UI Select',
    },
] as const

const CLEAN_ROUTES = [
    '/component-guide/button',
    '/component-guide/checkbox',
    '/component-guide/dialog',
    '/component-guide/header',
    '/component-guide/tabs',
] as const

const ReferenceLink = ({href, children}: {href: string; children: string}) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary inline-flex items-center gap-1 underline underline-offset-4"
    >
        {children}
        <ExternalLink aria-hidden="true" className="size-icon-xs" />
        <span className="sr-only"> (새 창에서 열림)</span>
    </a>
)

const ValidationExceptionsPage = () => (
    <GuidePageShell
        title="마크업 검증"
        description="주요 화면과 외부 라이브러리 생성 마크업의 W3C 검사 결과를 원인과 소유 영역별로 기록합니다."
    >
        <Alert variant="solid" color="info">
            <Info aria-hidden="true" />
            <AlertDescription>
                동일 메시지를 운영 빌드에서 재현하고, 프로젝트 작성 코드가 아닌 라이브러리 생성 DOM에서 발생한 항목만
                외부 라이브러리 예외로 분류합니다.
            </AlertDescription>
        </Alert>

        <BaseCard title="검증 기준" subtitle={`${AUDIT_DATE} 운영 빌드 기준`}>
            <div className="flex flex-col gap-4">
                <dl className="grid gap-3 md:grid-cols-[10rem_1fr]">
                    <dt className="font-bold">검사 도구</dt>
                    <dd>
                        <ReferenceLink href="https://validator.w3.org/">W3C Markup Validation Service</ReferenceLink>
                        <span className="text-foreground-subtle"> · 파일 업로드 방식</span>
                    </dd>
                    <dt className="font-bold">검사 대상</dt>
                    <dd>
                        <code className="font-mono">next build</code>로 생성한 정적 운영 HTML
                    </dd>
                    <dt className="font-bold">사용 버전</dt>
                    <dd>Next.js 16.2.9 · React 19.2.4 · radix-ui 1.6.2 · Recharts 3.8.0</dd>
                    <dt className="font-bold">shadcn 구성</dt>
                    <dd>
                        <code className="font-mono">radix-nova</code> 스타일 · Radix UI 기반 컴포넌트
                    </dd>
                </dl>
                <p className="typo-body-m-regular text-foreground-subtle">
                    shadcn/ui는 Chart가 Recharts를 사용한다고 명시하고 있으며, Select의 Radix 변형은 Radix UI Select를
                    기반으로 합니다. 따라서 아래 결과는 각 컴포넌트의 실제 생성 DOM과 공식 구성 관계를 함께
                    대조했습니다.
                </p>
                <div className="flex flex-wrap gap-3">
                    <ReferenceLink href="https://ui.shadcn.com/docs/components/radix/chart">
                        shadcn/ui Chart 공식 문서
                    </ReferenceLink>
                    <ReferenceLink href="https://ui.shadcn.com/docs/components/radix/select">
                        shadcn/ui Select 공식 문서
                    </ReferenceLink>
                    <ReferenceLink href="https://www.radix-ui.com/primitives/docs/components/select">
                        Radix UI Select 공식 문서
                    </ReferenceLink>
                    <ReferenceLink href="https://ui.shadcn.com/docs/components/radix/field">
                        shadcn/ui Field·Choice Card 공식 문서
                    </ReferenceLink>
                </div>
            </div>
        </BaseCard>

        <BaseCard
            title="자가진단·메인 화면별 검사 결과"
            subtitle={`${AUDIT_DATE} W3C Markup Validation Service 파일 업로드 기준`}
        >
            <div className="flex flex-col gap-5">
                <p className="typo-body-m-regular text-foreground-subtle">
                    <ReferenceLink href="https://validator.w3.org/">W3C Markup Validation Service</ReferenceLink>에 각
                    경로의 운영 빌드 HTML 전체를 파일로 제출했습니다. 결과 상태와 error·warning 응답 헤더를 함께
                    기록했습니다.
                </p>
                <Table className="min-w-280">
                    <TableCaption className="sr-only">
                        자가진단 및 메인 화면별 W3C Markup Validation Service 오류와 원인 분류
                    </TableCaption>
                    <TableHeader>
                        <TableRow className="bg-muted hover:bg-muted">
                            <TableHead scope="col">경로</TableHead>
                            <TableHead scope="col">결과</TableHead>
                            <TableHead scope="col" className="text-center">
                                오류
                            </TableHead>
                            <TableHead scope="col" className="text-center">
                                경고
                            </TableHead>
                            <TableHead scope="col">오류 내용</TableHead>
                            <TableHead scope="col">원인 분류</TableHead>
                            <TableHead scope="col">생성 주체</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {SCREEN_VALIDATION_RESULTS.map((item) => (
                            <TableRow key={item.route}>
                                <TableCell className="align-top">
                                    <code className="font-mono">{item.route}</code>
                                </TableCell>
                                <TableCell className="align-top">
                                    <Badge color={item.result === 'Valid' ? 'success' : 'warning'}>{item.result}</Badge>
                                </TableCell>
                                <TableCell className="text-center align-top font-bold">{item.errors}</TableCell>
                                <TableCell className="text-center align-top">{item.warnings}</TableCell>
                                <TableCell className="max-w-90 align-top whitespace-normal">{item.detail}</TableCell>
                                <TableCell className="max-w-60 align-top font-bold whitespace-normal">
                                    {item.cause}
                                </TableCell>
                                <TableCell className="max-w-60 align-top whitespace-normal">{item.owner}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </BaseCard>

        <BaseCard title="화면 검사 오류 유형별 판정">
            <div className="flex flex-col gap-5">
                <section aria-labelledby="validation-empty-option" className="flex flex-col gap-2">
                    <SectionHeader>
                        <SectionHeaderTitle id="validation-empty-option">
                            1. 빈 option 오류 — 고객사 요청 라이브러리 원인
                        </SectionHeaderTitle>
                        <SectionHeaderDescription>Radix Select가 생성한 숨은 네이티브 폼 요소</SectionHeaderDescription>
                    </SectionHeader>
                    <CodeBlock code="Element “option” without attribute “label” must not be empty." language="text" />
                    <p>
                        화면 코드에는 빈 <code className="font-mono">&lt;option&gt;</code>이 없습니다. shadcn/ui의 Radix
                        Select가 폼 제출 호환을 위해 숨은 네이티브 <code className="font-mono">&lt;select&gt;</code>를
                        만들고, 선택 전 상태를 빈 option으로 직렬화하면서 발생합니다. 실제 출력은{' '}
                        <code className="font-mono">
                            &lt;select aria-hidden=&quot;true&quot;&gt;&lt;option value=&quot;&quot;
                            selected&gt;&lt;/option&gt;&lt;/select&gt;
                        </code>
                        입니다.
                    </p>
                </section>

                <section aria-labelledby="validation-label-div" className="flex flex-col gap-2">
                    <SectionHeader>
                        <SectionHeaderTitle id="validation-label-div">
                            2. label 안의 div 오류 — 고객사 요청 라이브러리 패턴과 프로젝트 조합
                        </SectionHeaderTitle>
                        <SectionHeaderDescription>shadcn/ui Choice Card의 FieldLabel 구조</SectionHeaderDescription>
                    </SectionHeader>
                    <CodeBlock
                        code="Element “div” not allowed as child of element “label” in this context."
                        language="text"
                    />
                    <p>
                        shadcn/ui 공식 Choice Card 문서는 클릭 가능한 카드 구성을 위해{' '}
                        <code className="font-mono">FieldLabel &gt; Field</code> 구조를 안내합니다. 프로젝트의
                        SelectableCard도 이 패턴을 적용했고, Field는 실제 div로 출력되므로 Validator 오류가 발생합니다.
                        공식 라이브러리 패턴에서 유래했지만 최종 조합은 프로젝트 composite에 있으므로 공동 원인으로
                        분류합니다.
                    </p>
                </section>

                <section aria-labelledby="validation-label-controls" className="flex flex-col gap-2">
                    <SectionHeader>
                        <SectionHeaderTitle id="validation-label-controls">
                            3. label 안의 폼 컨트롤 중복 오류 — 고객사 요청 라이브러리 패턴과 Radix 생성 DOM
                        </SectionHeaderTitle>
                        <SectionHeaderDescription>표시용 button과 폼 연동용 input의 동시 생성</SectionHeaderDescription>
                    </SectionHeader>
                    <CodeBlock
                        code={
                            'The “label” element may contain at most one “button”, “input”, “meter”, “output”, “progress”, “select”, or “textarea” descendant.'
                        }
                        language="text"
                    />
                    <p>
                        Choice Card의 label 안에는 눈에 보이는 Radix Radio/Checkbox 버튼이 있고, Radix가 폼 제출을 위해
                        숨은 input을 추가합니다. 결과적으로 하나의 label 안에 button과 input이 함께 들어가 제한을
                        초과합니다. 화면 작성자가 별도 input을 추가한 결과는 아닙니다.
                    </p>
                </section>
            </div>
        </BaseCard>

        <BaseCard title="확인된 외부 라이브러리 오류" subtitle="W3C Markup Validation Service의 error 등급만 집계">
            <Table className="min-w-240">
                <TableCaption className="sr-only">
                    외부 라이브러리별 W3C Markup Validation Service 오류와 판정
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-muted hover:bg-muted">
                        <TableHead scope="col">대상</TableHead>
                        <TableHead scope="col">소유 영역</TableHead>
                        <TableHead scope="col">Validator 메시지</TableHead>
                        <TableHead scope="col" className="text-center">
                            건수
                        </TableHead>
                        <TableHead scope="col">재현 근거</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {VALIDATION_RESULTS.map((result) => (
                        <TableRow key={`${result.owner}-${result.message}`}>
                            <TableCell className="align-top">
                                <code className="font-mono">{result.route}</code>
                            </TableCell>
                            <TableCell className="align-top">
                                <Badge color="warning">{result.owner}</Badge>
                            </TableCell>
                            <TableCell className="max-w-90 align-top font-mono whitespace-normal">
                                {result.message}
                            </TableCell>
                            <TableCell className="text-center align-top font-bold">{result.count}</TableCell>
                            <TableCell className="max-w-100 align-top whitespace-normal">
                                <p>{result.evidence}</p>
                                <p className="text-warning mt-1 font-bold">{result.decision}</p>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </BaseCard>

        <BaseCard title="오류가 확인되지 않은 대표 페이지" subtitle="같은 운영 빌드와 검사 방식으로 비교">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                    {CLEAN_ROUTES.map((route) => (
                        <Badge key={route} color="success">
                            <CircleCheck aria-hidden="true" />
                            {route}
                        </Badge>
                    ))}
                </div>
                <p className="typo-body-m-regular text-foreground-subtle">
                    Button, Checkbox, Dialog, Header, Tabs 대표 페이지는 W3C Markup Validation Service에서 모두 Valid,
                    error 0건이었습니다. 즉 shadcn/ui 기반이라는 사실 자체가 예외 사유는 아니며, Select와 Chart에서
                    재현된 특정 생성 마크업만 예외 검토 대상입니다.
                </p>
            </div>
        </BaseCard>

        <BaseCard title="charset 메시지 판정">
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2">
                    <CircleCheck aria-hidden="true" className="text-success size-icon-md mt-0.5 shrink-0" />
                    <p>
                        현재 운영 빌드의 <code className="font-mono">&lt;meta charSet=&quot;utf-8&quot;&gt;</code>은
                        문서 시작 후 64바이트 위치에 생성되어 1024바이트 제한을 충족합니다.
                    </p>
                </div>
                <div className="flex items-start gap-2">
                    <CircleAlert aria-hidden="true" className="text-warning size-icon-md mt-0.5 shrink-0" />
                    <p>
                        따라서 <q>charset attribute … after the first 1024 bytes</q> 메시지는 현재 기준으로 shadcn/ui
                        또는 Recharts 예외에 포함하지 않습니다. 개발 서버, 배포 전환 계층, HTML 붙여넣기 과정에서
                        재현되면 해당 응답 원문을 별도로 보존해야 합니다.
                    </p>
                </div>
            </div>
        </BaseCard>

        <BaseCard title="감리 전달용 판정 문구">
            <Alert variant="outline" color="info">
                <Info aria-hidden="true" />
                <AlertDescription>
                    <p>
                        본 프로젝트는 고객사 요청에 따라 shadcn/ui 기반 컴포넌트와 Recharts 차트 라이브러리를
                        사용했습니다. W3C Markup Validation Service 오류 중 본 문서에 기재된 항목은 운영 빌드에서 재현한
                        뒤 외부 라이브러리가 생성한 DOM임을 확인했습니다.
                    </p>
                    <p>
                        프로젝트 코드에서 수정 가능한 오류와 실제 접근성 저해 항목은 별도로 개선합니다. 버전 변경 시
                        동일 절차로 재검증합니다.
                    </p>
                </AlertDescription>
            </Alert>
        </BaseCard>

        <BaseCard title="재검증 및 증빙 보관">
            <InfoBox variant="outline" title="검사·보관 절차" icon={<Info />}>
                <InfoBoxItem>검사 전 커밋 해시와 Next.js·radix-ui·Recharts 버전을 기록합니다.</InfoBoxItem>
                <InfoBoxItem>
                    개발 서버가 아닌 운영 빌드 HTML을 W3C Markup Validation Service에 파일로 제출합니다.
                </InfoBoxItem>
                <InfoBoxItem>오류 메시지, 발생 횟수, 해당 HTML 발췌와 생성 소스 파일을 함께 보관합니다.</InfoBoxItem>
                <InfoBoxItem>라이브러리 업데이트 후 오류가 사라지면 예외 목록에서 제거합니다.</InfoBoxItem>
                <InfoBoxItem>
                    HTML 문법 오류와 실제 웹 접근성 적합 여부는 별도 점검하며, 키보드·스크린리더 검사를 생략하지
                    않습니다.
                </InfoBoxItem>
            </InfoBox>
        </BaseCard>
    </GuidePageShell>
)

export default ValidationExceptionsPage
