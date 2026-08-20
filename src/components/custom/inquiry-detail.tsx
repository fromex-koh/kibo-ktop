import Link from 'next/link'
import {Paperclip} from 'lucide-react'
import {ActionBar, ActionBarCenter} from '@/components/composite/action-bar'
import {BaseCard} from '@/components/composite/base-card'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {InlineSeparator} from '@/components/composite/inline-separator'
import {Separator} from '@/components/ui/separator'
import {INQUIRY_STATUS, type InquiryStatus, type InquiryType} from '@/constants/inquiry'

// 1:1 문의 상세 — Figma "[마이페이지] 1:1 문의내역_상세".
// 카드 한 장에 [문의 요약 · 문의 내용 · 첨부파일 · 답변]이 구분선으로 나뉘어 들어가고, 아래에
// [목록으로 돌아가기]가 온다. 문의 요약 줄은 목록의 한 행과 같은 구성이다(화살표만 없다).
//
// 값을 보여 주기만 하므로 client 로 두지 않는다 — 화면(page.tsx)이 넘긴 것을 그대로 그린다.
// 기업·기관이 같은 화면을 쓴다. 다른 것은 문의 내용과 목록 경로뿐이라 화면이 props 로 넘긴다.

// 첨부파일 — 파일 이름 한 벌로 받는다(다른 화면의 첨부와 같은 모양이다 — file-upload 도 이름 문자열
// 하나에서 확장자를 뽑아 쓴다). 화면에 그릴 때만 이름과 확장자로 나눈다(아래 splitFileName).
type InquiryAttachment = {
    name: string
}

type InquiryDetailItem = {
    /** 문의 유형. 제목 앞에 세로 구분선과 함께 놓인다 — 문의하기 화면의 [유형 선택]과 같은 값이다. */
    category: InquiryType
    title: string
    status: InquiryStatus
    /** 등록일(YYYY-MM-DD). */
    date: string
    /** 문의 본문. 줄바꿈(\n)은 그대로 살린다. */
    question: string
    attachments?: readonly InquiryAttachment[]
    /**
     * 답변 본문. 답변이 등록되기 전에는 넘기지 않는다 — 그때는 아래 대기 안내가 대신 보인다.
     * 시안에는 답변대기 상태만 있어, 답변이 달린 모습은 문의 본문과 같은 짜임(A. 표시 + 본문)으로 둔다.
     */
    answer?: string
}

// 답변이 아직 없을 때 그 자리에 두는 안내(시안 문구).
const ANSWER_WAITING_NOTICE = '답변 대기 중입니다.\n빠른 시일 내에 답변 드리겠습니다.'

// 파일 이름을 [이름 · 확장자]로 나눈다 — 자리가 모자랄 때 이름만 줄이고 확장자는 남기기 위해서다.
// 이름째로 말줄임하면 무슨 형식의 파일인지가 먼저 사라져, 정작 필요한 정보가 안 보인다.
// 점이 없거나 맨 앞에 있으면(.gitignore 같은 이름) 확장자로 보지 않는다.
const splitFileName = (name: string) => {
    const dotIndex = name.lastIndexOf('.')
    if (dotIndex <= 0) return {baseName: name, extension: ''}

    return {baseName: name.slice(0, dotIndex), extension: name.slice(dotIndex)}
}

// Q.·A. 표시 — 시안은 24×24 아이콘이지만 그려진 것이 글자 "Q." 라서 글자로 둔다.
// 아이콘으로 만들면 스크린리더에서 사라지고, 단일 아이콘 라이브러리 원칙([NA-008])과도 어긋난다.
// 표시 자체는 장식이라 감추고, 무엇을 가리키는 묶음인지는 옆의 sr-only 문구가 알린다.
const QaMarker = ({mark, label, children}: {mark: string; label: string; children: string}) => (
    <div className="flex gap-2">
        <span aria-hidden="true" className="typo-title-l-bold w-6 shrink-0 text-blue-800">
            {mark}
        </span>
        <p className="typo-body-xl-regular text-label-foreground min-w-0 flex-1 whitespace-pre-line">
            <span className="sr-only">{label} </span>
            {children}
        </p>
    </div>
)

type InquiryDetailProps = {
    inquiry: InquiryDetailItem
    /** [목록으로 돌아가기] 가 가는 화면. */
    listHref: string
}

const InquiryDetail = ({inquiry, listHref}: InquiryDetailProps) => {
    const status = INQUIRY_STATUS[inquiry.status]

    return (
        <div className="flex flex-col">
            {/* 카드 여백 32·24 와 구획 사이 구분선은 목록 카드와 같은 값이다(시안). */}
            <BaseCard className="py-8">
                {/* 문의 요약 — 목록의 한 행과 같은 내용이지만 제목을 자르지 않는다.
                    목록은 행 높이를 맞추려고 말줄임하지만, 여기는 이 문의 한 건만 보는 자리라 제목이
                    길면 줄을 늘려 끝까지 보여 준다.

                    분류·구분선·상태 배지를 모두 제목 안에 글자처럼 흘려 넣는다 — 칸(flex 아이템)으로
                    나누면 제목이 두 줄이 될 때 분류만 남은 줄이 생기거나 배지가 아래로 떨어져 나간다.
                    이렇게 두면 분류 다음에 제목이 이어지고, 배지는 마지막 낱말 뒤에 붙어 함께 흐른다. */}
                <h3 className="typo-title-m-medium text-foreground">
                    <span className="typo-body-xl-regular text-label-foreground align-middle">{inquiry.category}</span>
                    <InlineSeparator inline />
                    {inquiry.title}
                    <Badge variant="solid-pastel" color={status.color} shape="round" className="ms-1 align-middle">
                        {status.label}
                    </Badge>
                </h3>
                <p className="typo-body-l-regular text-foreground-subtle mt-2">{inquiry.date}</p>

                <Separator className="my-6" />

                <QaMarker mark="Q." label="문의 내용">
                    {inquiry.question}
                </QaMarker>

                {inquiry.attachments?.length ? (
                    // 첨부파일 — 내려받기 동작이 붙기 전이라 파일 이름만 보여 준다.
                    // 누를 수 없는 자리에 버튼·링크 모양을 두면 눌리지 않는 컨트롤이 된다[6.1.1].
                    <ul className="mt-6 flex flex-col gap-2">
                        {inquiry.attachments.map((file) => {
                            const {baseName, extension} = splitFileName(file.name)

                            return (
                                <li
                                    key={file.name}
                                    className="bg-surface-subtle flex items-center gap-2 rounded-sm px-6 py-4"
                                >
                                    <Paperclip
                                        aria-hidden="true"
                                        className="size-icon-sm text-label-foreground shrink-0"
                                    />
                                    {/* 이름만 줄이고 확장자는 끝까지 남긴다(위 splitFileName 참고). */}
                                    <span className="typo-body-xl-regular text-label-foreground flex min-w-0">
                                        <span className="truncate">{baseName}</span>
                                        <span className="shrink-0">{extension}</span>
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                ) : null}

                <Separator className="my-6" />

                {inquiry.answer ? (
                    <QaMarker mark="A." label="답변">
                        {inquiry.answer}
                    </QaMarker>
                ) : (
                    // 답변 전 안내 — 시안에는 Q. 같은 표시가 없고 본문과 같은 자리에서 시작한다.
                    <p className="typo-body-xl-regular text-label-foreground whitespace-pre-line">
                        {ANSWER_WAITING_NOTICE}
                    </p>
                )}
            </BaseCard>

            {/* 시안: 카드와 CTA 사이 40. */}
            <ActionBar className="mt-10">
                <ActionBarCenter>
                    <Button asChild variant="tertiary" size="xl">
                        <Link href={listHref}>목록으로 돌아가기</Link>
                    </Button>
                </ActionBarCenter>
            </ActionBar>
        </div>
    )
}

export {InquiryDetail}
export type {InquiryDetailItem, InquiryAttachment, InquiryDetailProps}
