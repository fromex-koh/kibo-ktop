import type {ComponentPropsWithoutRef} from 'react'
import {cn} from '@/lib/utils'

// 팝업 단독 확인 화면의 설명 — 모달·토스트만 띄워 두는 화면(화면정의서의 하위 화면)은 뒤 배경이 비어 있어,
// 지금 보고 있는 것이 어떤 팝업이고 언제 뜨는지 화면만 봐서는 알 수 없다. 그 한 줄을 여기 둔다.
// 실제 서비스 화면에는 이 문구가 없다 — 팝업을 띄우는 화면이 따로 있기 때문이다.
//
// 감싸는 <main> 은 화면이 갖는다(랜드마크는 화면 소유). 이 조각은 그 안에 들어가는 제목과 문단을 그린다.

// 설명을 놓는 높이 — 팝업이 뜨는 자리를 피한다. 팝업 종류마다 뜨는 자리가 달라 한 값으로는 둘 다 피할 수 없다.
//   modal — 화면 한가운데에 뜬다. 설명은 본문 위쪽에 그대로 두면 모달 위에 남는다.
//   toast — 헤더 바로 아래(헤더 아래 40)에 뜬다. 그 높이만큼 더 내려야 가려지지 않는다.
type PopupKind = 'modal' | 'toast'

const POPUP_NOTE_OFFSET: Record<PopupKind, string> = {modal: '', toast: 'mt-25'}

type PopupPreviewNoteProps = {
    /** 화면 이름. 화면에는 보이지 않고 제목 구조로만 남는다 — 그 화면 metadata.title 과 같은 말을 준다. */
    title: string
    /** 이 화면이 보여 주는 팝업의 종류. 설명이 그 팝업에 가리지 않도록 높이를 정한다. 기본 modal. */
    popup?: PopupKind
} & ComponentPropsWithoutRef<'p'>

const PopupPreviewNote = ({title, popup = 'modal', className, ...props}: PopupPreviewNoteProps) => (
    <>
        {/* 팝업만 띄우는 화면이라 시안에 보이는 제목이 없다. 그렇다고 제목을 하나도 두지 않으면 제목이
            없는 페이지가 되어(WAVE "No heading structure") 스크린리더의 제목 이동으로 이 화면이 무엇인지
            짚을 수 없다[6.4.2]. 화면 이름을 h1 으로 두되 sr-only 로 감춰 보이는 모습은 그대로 둔다. */}
        <h1 className="sr-only">{title}</h1>
        <p
            data-slot="popup-preview-note"
            className={cn(
                'typo-body-xl-regular text-foreground-subtle max-w-content text-center break-keep',
                POPUP_NOTE_OFFSET[popup],
                className,
            )}
            {...props}
        />
    </>
)

// 팝업 단독 확인 화면의 본문 자리 — 설명을 본문 위쪽 가운데에 놓는다(화면마다 같은 값을 다시 적지 않는다).
// 세로 가운데에 두지 않는 이유: 모달이 화면 한가운데에 떠서 설명을 그대로 덮는다.
const popupPreviewMainClassName = 'bg-background flex flex-1 items-start justify-center px-4 py-15'

export {PopupPreviewNote, popupPreviewMainClassName}
export type {PopupKind, PopupPreviewNoteProps}
