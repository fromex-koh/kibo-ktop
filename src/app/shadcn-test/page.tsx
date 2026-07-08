import type {Metadata} from 'next'
import {Check, Search} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'

export const metadata: Metadata = {
    title: 'shadcn 통합 테스트',
}

const ShadcnTestPage = () => {
    return (
        <main id="main" className="max-w-content mx-auto px-4 py-10">
            <h1 className="typo-h4-bold">shadcn 통합 테스트</h1>
            <p className="typo-body-l-regular text-muted-foreground mt-2">
                shadcn Button·Input 이 프로젝트 디자인 토큰(--ds-*)으로 렌더되는지 확인하는 페이지.
            </p>

            {/* Button variants */}
            <section className="mt-10 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Button — variant</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <Button>기본 (primary)</Button>
                    <Button variant="secondary">보조 (secondary)</Button>
                    <Button variant="outline">아웃라인</Button>
                    <Button variant="ghost">고스트</Button>
                    <Button variant="destructive">삭제</Button>
                    <Button variant="link">링크</Button>
                </div>
            </section>

            {/* Button sizes */}
            <section className="mt-10 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Button — size</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon" aria-label="검색">
                        <Search aria-hidden="true" />
                    </Button>
                    <Button size="icon" variant="secondary" aria-label="확인">
                        <Check aria-hidden="true" />
                    </Button>
                </div>
            </section>

            {/* Button states */}
            <section className="mt-10 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Button — 상태</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <Button disabled>비활성</Button>
                    <Button variant="secondary" disabled>
                        비활성
                    </Button>
                    <Button>
                        <Check aria-hidden="true" />
                        아이콘 + 라벨
                    </Button>
                </div>
            </section>

            {/* Input */}
            <section className="mt-10 flex max-w-md flex-col gap-6">
                <h2 className="typo-title-l-bold">Input</h2>

                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="typo-body-m-medium">
                        이름
                    </label>
                    <Input id="name" name="name" placeholder="홍길동" autoComplete="name" />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="typo-body-m-medium">
                        이메일
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid="true"
                        aria-describedby="email-err"
                    />
                    <p id="email-err" role="alert" className="typo-caption-regular text-destructive">
                        올바른 이메일을 입력하세요.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="disabled-input" className="typo-body-m-medium">
                        비활성 입력
                    </label>
                    <Input id="disabled-input" name="disabled-input" placeholder="수정 불가" disabled />
                </div>
            </section>

            {/* Overlay — Tailwind 유틸리티가 아니라 var(--ds-overlay-*) 로 직접 참조(드로어 백드롭 등) */}
            <section className="mt-10 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Overlay</h2>
                <div className="flex flex-wrap items-center gap-6">
                    <div className="size-20 rounded-lg bg-[var(--ds-overlay-sm)]" />
                    <div className="size-20 rounded-lg bg-[var(--ds-overlay-md)]" />
                    <div className="size-20 rounded-lg bg-[var(--ds-overlay-lg)]" />
                </div>
            </section>
        </main>
    )
}

export default ShadcnTestPage
