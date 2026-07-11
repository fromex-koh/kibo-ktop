'use client'

import {useState} from 'react'
import {Check} from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {Button} from '@/components/button'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

// ── Stepper (shadcn 미제공 → 프로젝트 토큰으로 커스텀) ──
const STEPS = ['기본 정보', '기술 정보', '검토', '완료'] as const

const Stepper = ({current}: {current: number}) => (
    <ol className="flex items-center">
        {STEPS.map((label, index) => {
            const isDone = index < current
            const isCurrent = index === current
            return (
                <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
                    <span className="flex items-center gap-2" aria-current={isCurrent ? 'step' : undefined}>
                        <span
                            className={`typo-caption-regular flex size-7 shrink-0 items-center justify-center rounded-full font-semibold ${
                                isDone || isCurrent
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                            }`}
                        >
                            {isDone ? <Check aria-hidden="true" className="size-icon-sm" /> : index + 1}
                        </span>
                        <span
                            className={`typo-body-l-regular whitespace-nowrap ${isCurrent ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
                        >
                            {label}
                        </span>
                    </span>
                    {index < STEPS.length - 1 && (
                        <span aria-hidden="true" className={`h-px flex-1 ${isDone ? 'bg-primary' : 'bg-border'}`} />
                    )}
                </li>
            )
        })}
    </ol>
)

// ── 데이터 테이블 목업 ──
type Row = {id: string; name: string; role: string; status: '활성' | '대기' | '정지'}
const ROWS: readonly Row[] = [
    {id: 'U-1024', name: '김지훈', role: '관리자', status: '활성'},
    {id: 'U-1025', name: '박서연', role: '편집자', status: '대기'},
    {id: 'U-1026', name: '이도현', role: '뷰어', status: '활성'},
    {id: 'U-1027', name: '최유나', role: '편집자', status: '정지'},
]
// 상태색 — 이 프로젝트엔 success/warning 시맨틱 슬롯이 없어(shadcn 표준만) 프로젝트 팔레트 키를 쓴다(PB-05 보조).
const STATUS_CLASS: Record<Row['status'], string> = {
    활성: 'text-success-600',
    대기: 'text-warning-600',
    정지: 'text-error-600',
}

const Showcase = () => {
    const [step, setStep] = useState(1)
    const [page, setPage] = useState(2)
    const totalPages = 5

    return (
        <>
            {/* Stepper */}
            <div className="col-span-full flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Stepper</h2>
                <Stepper current={step} />
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        disabled={step === 0}
                    >
                        이전
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                        disabled={step === STEPS.length - 1}
                    >
                        다음
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="col-span-4 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Tabs</h2>
                <Tabs defaultValue="account">
                    <TabsList>
                        <TabsTrigger value="account">계정</TabsTrigger>
                        <TabsTrigger value="password">비밀번호</TabsTrigger>
                        <TabsTrigger value="team">팀</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account" className="typo-body-l-regular text-muted-foreground pt-3">
                        계정 정보를 관리하는 탭입니다.
                    </TabsContent>
                    <TabsContent value="password" className="typo-body-l-regular text-muted-foreground pt-3">
                        비밀번호를 변경하는 탭입니다.
                    </TabsContent>
                    <TabsContent value="team" className="typo-body-l-regular text-muted-foreground pt-3">
                        팀원을 초대·관리하는 탭입니다.
                    </TabsContent>
                </Tabs>
            </div>

            {/* Breadcrumb */}
            <div className="col-span-4 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Breadcrumb</h2>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">홈</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">신청 관리</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>기술평가 신청</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Confirm 모달 (AlertDialog) */}
            <div className="col-span-4 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Confirm 모달</h2>
                <p className="typo-caption-regular text-muted-foreground">AlertDialog — 되돌릴 수 없는 작업 전 확인.</p>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-fit">
                            신청 삭제
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-100">
                        <AlertDialogHeader>
                            <AlertDialogTitle>정말 삭제하시겠어요?</AlertDialogTitle>
                            <AlertDialogDescription>
                                삭제한 신청서는 되돌릴 수 없습니다. 계속하시겠습니까?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction>삭제</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Pagination */}
            <div className="col-span-4 flex flex-col gap-4">
                <h2 className="typo-title-l-bold">Pagination</h2>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                text="이전"
                                aria-disabled={page === 1}
                                onClick={(event) => {
                                    event.preventDefault()
                                    setPage((p) => Math.max(1, p - 1))
                                }}
                            />
                        </PaginationItem>
                        {Array.from({length: totalPages}, (_, index) => index + 1).map((n) => (
                            <PaginationItem key={n}>
                                <PaginationLink
                                    href="#"
                                    isActive={n === page}
                                    onClick={(event) => {
                                        event.preventDefault()
                                        setPage(n)
                                    }}
                                >
                                    {n}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                text="다음"
                                aria-disabled={page === totalPages}
                                onClick={(event) => {
                                    event.preventDefault()
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/* 데이터 테이블 */}
            <div className="col-span-full flex flex-col gap-4">
                <h2 className="typo-title-l-bold">데이터 테이블</h2>
                <div className="overflow-x-auto">
                    <Table>
                        <TableCaption className="sr-only">사용자 목록</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>이름</TableHead>
                                <TableHead>역할</TableHead>
                                <TableHead>상태</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ROWS.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="font-mono">{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.role}</TableCell>
                                    <TableCell className={`font-semibold ${STATUS_CLASS[row.status]}`}>
                                        {row.status}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}

export default Showcase
