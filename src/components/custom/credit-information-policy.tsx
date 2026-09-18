import type {ReactNode} from 'react'
import Link from 'next/link'
import {ArrowUpRight, ChevronRight} from 'lucide-react'
import {ListMarker} from '@/components/custom/list-marker'
import {dialogTableCellClassName, dialogTableHeaderCellClassName} from '@/components/theme/dialog-table.variants'
import {Button} from '@/components/ui/button'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import type {UserType} from '@/constants/header-navigation'
import {
    AUTO_COLLECTION_NOTE,
    AUTO_COLLECTION_TEXT,
    BASIC_PLAN,
    CREDIT_INFORMATION_POLICY_NOTICE,
    EFFECTIVE_DATE,
    MANAGED_INFORMATION,
    MANAGER_COLUMNS,
    MANAGER_ROWS,
    PROVISION_NOTE,
    PROVISION_ROWS,
    RETENTION,
    RIGHTS_ROWS,
    type PolicyCell,
} from '@/content/service/credit-information-policy'
import {cn} from '@/lib/utils'

// 신용정보 활용체제 — 시안 "[공통] 신용정보 활용체제"(40007578:163714). 기업·기관이 같은 화면이다.
// 문구는 content/service/credit-information-policy.ts 에 있고, 이 파일은 짜임(표·목록·링크 자리)만 갖는다.
//
// 간격(시안): 안내 상자·본문·시행일 사이 40 · 항목(1.~8.) 사이 24 · 항목 제목과 내용 8 · 목록 줄 사이 8.
// 글자: 항목 제목 18 Bold · 소제목 16 Medium · 본문 16 Regular · 표 14.

// 표는 모달의 데이터 표(dialog-table)와 같은 규격이다 — 행 45 · 좌우 16 · 옅은 파란 제목 칸 · 테두리 gray.100.
// 위쪽만 진한 선(gray.500)이다(시안 t-line) — 표(table)에 선을 주면 겹친 칸 테두리(gray.100)가 이겨 옅게 보여서
// 열 제목 칸의 윗 테두리 색을 바꾼다.
// 좁은 화면에서는 열이 글자 단위로 찌그러지지 않도록 최소 폭을 두고 표 상자가 좌우로 스크롤된다.
const policyTableClassName = 'min-w-200'
const columnHeadClassName = cn(dialogTableHeaderCellClassName, 'border-t-foreground-subtle typo-body-l-bold')
const rowHeadClassName = cn(dialogTableHeaderCellClassName, 'typo-body-l-medium')
const bodyCellClassName = cn(dialogTableCellClassName, 'text-label-foreground')

// 글 사이에 끼는 밑줄 링크 — 새 창으로 열린다(시안 icon-line/arrow-up-right).
const inlineLinkClassName =
    'text-label-foreground outline-ring rounded-2xs inline-flex items-center gap-1 underline decoration-1 underline-offset-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid'

const NewWindowLink = ({href, iconClassName, children}: {href: string; iconClassName: string; children: ReactNode}) => (
    <Link href={href} target="_blank" rel="noopener noreferrer" className={inlineLinkClassName}>
        {children}
        <ArrowUpRight aria-hidden="true" className={iconClassName} />
        <span className="sr-only"> (새 창)</span>
    </Link>
)

// 항목(1.~8.) — 제목(h2)과 내용. 페이지 h1(신용정보 활용체제) 바로 아래 단계다.
const PolicySection = ({title, action, children}: {title: string; action?: ReactNode; children?: ReactNode}) => (
    <section className="flex flex-col gap-2">
        {action ? (
            // 6번처럼 제목 오른쪽에 버튼이 서는 항목 — 좁아지면 버튼이 아래 줄로 내려간다.
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="typo-title-m-bold text-foreground">{title}</h2>
                {action}
            </div>
        ) : (
            <h2 className="typo-title-m-bold text-foreground">{title}</h2>
        )}
        {children}
    </section>
)

// 시안의 "- " 목록 — 대시는 글자로 보이지만 읽어 주지 않는다.
const DashList = ({items}: {items: readonly ReactNode[]}) => (
    <ul className="flex list-none flex-col gap-2">
        {items.map((item, index) => (
            <li key={index}>
                <span aria-hidden="true">- </span>
                {item}
            </li>
        ))}
    </ul>
)

// 소제목(16 Medium) + 대시 목록 묶음들. 묶음 사이도 8 이다.
const SubsectionList = ({groups}: {groups: readonly {title: string; items: readonly string[]}[]}) => (
    <div className="flex flex-col gap-2">
        {groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
                <h3 className="typo-body-xl-medium text-foreground">{group.title}</h3>
                <DashList items={group.items} />
            </div>
        ))}
    </div>
)

// 표 칸 내용 — 글 한 줄 · 점 목록 · 여러 줄(앞머리 굵은 표시).
const PolicyCellContent = ({cell}: {cell: PolicyCell}) => {
    if (typeof cell === 'string') return cell

    if ('bullets' in cell) {
        return (
            <ul className="flex list-none flex-col">
                {cell.bullets.map((bullet) => (
                    <li key={bullet} className="flex">
                        <ListMarker type="unordered-small" />
                        <span className="min-w-0">{bullet}</span>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="flex flex-col">
            {cell.lines.map((line) => (
                <p key={line.text}>
                    {line.label ? <strong className="typo-body-l-bold">{line.label} </strong> : null}
                    {line.text}
                </p>
            ))}
        </div>
    )
}

type CreditInformationPolicyProps = {
    /** 링크(이용약관·개인정보 처리방침)가 향할 서비스 — 기업·기관 화면이 자기 경로를 쓴다. */
    userType: UserType
}

const CreditInformationPolicy = ({userType}: CreditInformationPolicyProps) => (
    <div className="flex flex-col gap-10">
        {/* 공시 안내 — 옅은 회색 면 + 테두리 · 반경 8 · 여백 20 · 14px(시안 "인포"). */}
        <div className="bg-surface-subtle border-subtle-3 rounded-sm border p-5">
            <ul className="typo-body-l-regular text-foreground-subtle flex list-none flex-col gap-2 break-keep">
                <li className="flex">
                    <ListMarker type="unordered-small" />
                    <span className="min-w-0">{CREDIT_INFORMATION_POLICY_NOTICE}</span>
                </li>
            </ul>
        </div>

        <div className="typo-body-xl-regular text-label-foreground flex flex-col gap-6 break-keep">
            <PolicySection title="1. 개인신용정보 보호 및 관리에 관한 기본 계획">
                <p>{BASIC_PLAN}</p>
            </PolicySection>

            <PolicySection title="2. 관리하는 신용정보의 종류 및 이용 목적">
                <SubsectionList groups={MANAGED_INFORMATION} />
            </PolicySection>

            <PolicySection title="3. 신용정보를 제공받는 자, 제공되는 신용정보의 종류 및 이용 목적">
                <Table className={policyTableClassName}>
                    <caption className="sr-only">신용정보를 제공받는 자, 제공되는 신용정보의 종류 및 이용 목적</caption>
                    <TableHeader>
                        <TableRow className="border-0 hover:bg-transparent">
                            <TableHead scope="col" className={cn(columnHeadClassName, 'w-70')}>
                                구분
                            </TableHead>
                            <TableHead scope="col" className={columnHeadClassName}>
                                내용
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {PROVISION_ROWS.map(([label, content]) => (
                            <TableRow key={label} className="border-0 hover:bg-transparent">
                                <TableHead scope="row" className={rowHeadClassName}>
                                    {label}
                                </TableHead>
                                <TableCell className={bodyCellClassName}>
                                    <PolicyCellContent cell={content} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <p className="typo-body-m-regular text-foreground-subtle">
                    {PROVISION_NOTE.before}{' '}
                    <span className="typo-caption-regular">
                        <NewWindowLink href={`/${userType}/terms/k-bigx`} iconClassName="size-3">
                            {PROVISION_NOTE.linkLabel}
                        </NewWindowLink>
                    </span>
                    {PROVISION_NOTE.after}
                </p>
            </PolicySection>

            <PolicySection title="4. 신용정보주체의 권리의 종류 및 행사방법">
                <Table className={policyTableClassName}>
                    <caption className="sr-only">신용정보주체의 권리의 종류 및 행사방법</caption>
                    <TableHeader>
                        <TableRow className="border-0 hover:bg-transparent">
                            <TableHead scope="col" className={cn(columnHeadClassName, 'w-70')}>
                                구분
                            </TableHead>
                            <TableHead scope="col" className={columnHeadClassName}>
                                내용
                            </TableHead>
                            <TableHead scope="col" className={cn(columnHeadClassName, 'w-50')}>
                                관련법률
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {RIGHTS_ROWS.map(([label, content, law]) => (
                            <TableRow key={label} className="border-0 hover:bg-transparent">
                                <TableHead scope="row" className={rowHeadClassName}>
                                    {label}
                                </TableHead>
                                <TableCell className={bodyCellClassName}>
                                    <PolicyCellContent cell={content} />
                                </TableCell>
                                <TableCell className={cn(bodyCellClassName, 'text-center')}>{law}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </PolicySection>

            <PolicySection title="5. 신용정보 보유·이용 기간과 파기절차">
                <SubsectionList groups={RETENTION} />
            </PolicySection>

            <PolicySection
                title="6. 신용평가에 반영되는 신용정보의 종류, 반영비중 및 반영기간"
                action={
                    // [프론트엔드 연동] 상세내역 화면(또는 공시 자료) 주소를 연결한다.
                    <Button asChild variant="tertiary" size="sm" className="shrink-0">
                        <Link href="#">
                            상세내역 바로가기
                            <ChevronRight aria-hidden="true" />
                        </Link>
                    </Button>
                }
            />

            <PolicySection title="7. 개인정보 자동 수집 장치의 설치·운영 및 거부">
                <DashList
                    items={[
                        AUTO_COLLECTION_TEXT,
                        <>
                            {AUTO_COLLECTION_NOTE.before}
                            <NewWindowLink href={`/${userType}/privacy-policy`} iconClassName="size-4">
                                {AUTO_COLLECTION_NOTE.linkLabel}
                            </NewWindowLink>
                            {AUTO_COLLECTION_NOTE.after}
                        </>,
                    ]}
                />
            </PolicySection>

            <PolicySection title="8. 신용정보관리·보호인 및 개인정보 보호책임자">
                <Table className={policyTableClassName}>
                    <caption className="sr-only">신용정보관리·보호인 및 개인정보 보호책임자</caption>
                    <TableHeader>
                        <TableRow className="border-0 hover:bg-transparent">
                            {MANAGER_COLUMNS.map((column) => (
                                <TableHead key={column} scope="col" className={cn(columnHeadClassName, 'w-1/3')}>
                                    {column}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MANAGER_ROWS.map(([label, manager, department]) => (
                            <TableRow key={label} className="border-0 hover:bg-transparent">
                                <TableHead scope="row" className={rowHeadClassName}>
                                    {label}
                                </TableHead>
                                <TableCell className={cn(bodyCellClassName, 'text-center')}>{manager}</TableCell>
                                <TableCell className={cn(bodyCellClassName, 'text-center')}>{department}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </PolicySection>
        </div>

        <p className="typo-title-m-bold text-foreground">{EFFECTIVE_DATE}</p>
    </div>
)

export default CreditInformationPolicy
