import {DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {ListMarker} from '@/components/custom/list-marker'
import {dialogBodyClassName, dialogBodyEndClassName} from '@/components/theme/dialog.variants'
import {
    ITEM_DESCRIPTION_GUIDE,
    ITEM_DESCRIPTION_TITLE,
    type ItemDescription,
    type ItemDescriptionLine,
} from '@/content/service/item-descriptions'
import {cn} from '@/lib/utils'

// 품목설명 모달 — [기술분류] 표의 줄마다 붙는 [품목설명]이 여는 안내 모달. 그 줄의 품목 하나만 보여 준다.
// Figma "[신속표준모형 KTRS-FM] m_품목설명". 본문은 content/service/item-descriptions 에서 가져오고,
// Dialog 루트와 트리거는 사용처에서 구성한다(필수/선택 동의 팝업(consent-terms-dialog)과 같은 구조).
//
// 시안의 정보 구조는 세 층이다.
//   1. 카테고리 경로 — 이 품목이 속한 [테마 · 분야]. 표에서 눌러 들어오면 그 줄의 값이 그대로 온다.
//   2. 품목명 + 정의 — 원문 ▣/- 줄.
//   3. 예시 — 원문의 "(예시)" 줄부터. 시안은 [예시] 소제목 아래 불릿 목록이다.
//
// 품목은 넘겨받는다 — 이름으로 찾지 않는다. 240개 중 "사이버보안"·"소프트웨어정의(SDN)"처럼 이름이 겹치는
// 품목이 있어 이름은 열쇠가 되지 못한다. 테마·분야도 같은 이유로 넘겨받는다(품목만으로는 되짚을 수 없다).

// 원문의 예시 줄머리 — 240개 안에서 "(예시)"·"(활용 예시)"·"(활용예시)"·"예시)"·"( 예시 )" 다섯 꼴이 쓰였다.
// 시안은 이 자리에 [예시] 소제목을 두므로, 줄머리를 걷어내고 남는 글만 항목으로 싣는다.
const EXAMPLE_MARKER = /^\s*\(?\s*(?:활용\s*)?예시\s*\)\s*/
const EXAMPLE_HEADING = '예시'

// 한 덩이 — 정의 묶음이거나 예시 묶음이다. 시안의 [리스트] 안 블록 하나에 해당한다.
type ItemDescriptionSection = {
    isExample: boolean
    lines: readonly ItemDescriptionLine[]
}

/**
 * 원문 줄을 시안의 블록으로 묶는다.
 *
 * "(예시)" 줄이 나오면 예시 묶음이 시작되고, 그 뒤의 줄들(예시 항목·이어지는 문장)이 그 묶음에 들어간다.
 * 새 본문 덩이(▣ = paragraph)가 나오면 예시 묶음은 거기서 끝난다 — 예시 뒤에 설명이 더 이어지는
 * 품목이 있어(예: [15] 소프트웨어정의(SDN)) 끝을 정해 두지 않으면 정의가 예시 아래로 딸려 들어간다.
 */
const toSections = (lines: readonly ItemDescriptionLine[]): readonly ItemDescriptionSection[] =>
    lines.reduce<readonly ItemDescriptionSection[]>((sections, line) => {
        if (line.kind === 'example') {
            const text = line.text.replace(EXAMPLE_MARKER, '')

            // 줄머리만 있는 줄은 소제목 노릇만 한다 — 남는 글이 있을 때만 첫 항목으로 싣는다.
            return [...sections, {isExample: true, lines: text ? [{kind: 'bullet', text}] : []}]
        }

        const current = sections.at(-1)
        if (!current || (current.isExample && line.kind === 'paragraph')) {
            return [...sections, {isExample: false, lines: [line]}]
        }

        return [...sections.slice(0, -1), {...current, lines: [...current.lines, line]}]
    }, [])

// 줄 종류별 생김새 — 원문의 줄머리 기호를 프로젝트 마커·글자로 옮긴다.
//   paragraph  본문 한 덩이(원문 ▣) — 점 마커
//   bullet     그 아래 세부 항목(원문 -) — 대시 마커에 한 칸 들여쓰기
//   note       용어 풀이·유의사항(원문 *·※) — 마커 없이 한 단계 작은 글
//   text       앞줄에서 이어지는 문장 — 마커 없이 옅은 색
//
// 예시 묶음 안에서는 두 단계로 나누지 않는다(isExample). 그 안의 "-" 는 하위 항목이 아니라 예시 하나하나라,
// 시안도 정의 불릿과 같은 자리(들여쓰기 없는 점 마커)에 놓는다. 유의사항(note)만 예시 안에서도 그대로 둔다.
const ItemDescriptionLineItem = ({line, isExample}: {line: ItemDescriptionLine; isExample: boolean}) => {
    if (line.kind === 'note') {
        return <li className="typo-body-l-regular text-foreground-subtle ps-4">{line.text}</li>
    }

    if (line.kind === 'text' && !isExample) {
        return <li className="typo-body-xl-regular text-foreground-subtle ps-4">{line.text}</li>
    }

    const isSubItem = !isExample && line.kind === 'bullet'

    return (
        <li className={cn('typo-body-xl-regular text-label-foreground flex', isSubItem && 'ps-4')}>
            <ListMarker type="unordered" level={isSubItem ? 2 : 1} />
            <span className="min-w-0">{line.text}</span>
        </li>
    )
}

// 모달 안내문(감춰 둠)의 id — 한 번에 하나만 열리는 모달이라 고정값으로 둔다.
const ITEM_DESCRIPTION_GUIDE_ID = 'item-description-dialog-guide'

// 트리거·열림 상태는 사용처가 정한다 — 이 조각은 열렸을 때의 내용만 갖는다(동의 약관 모달과 같은 방식).
const ItemDescriptionDialogContent = ({
    item,
    theme,
    field,
}: {
    item: ItemDescription
    /** 이 품목이 속한 테마(대분류) — 시안의 카테고리 경로 왼쪽. */
    theme: string
    /** 이 품목이 속한 분야(중분류) — 카테고리 경로 오른쪽. */
    field: string
}) => (
    // 설명은 DialogDescription 이 아니라 순수 sr-only 문단으로 둔다 — DialogDescription 의 기본 글자가
    // 20px Bold 라, 보이지 않는 글인데도 "제목처럼 보이는 글"로 잡힌다(WAVE "Possible heading").
    // aria-describedby 는 그 문단의 id 를 직접 가리킨다 — undefined 를 넘겨 설명을 없애는 방법은 이
    // 파일이 서버 컴포넌트라 통하지 않는다(서버→클라이언트로 넘길 때 undefined 는 사라져, Radix 가
    // 만든 없는 id 를 가리키게 된다).
    <DialogContent aria-describedby={ITEM_DESCRIPTION_GUIDE_ID}>
        <DialogHeader>
            <DialogTitle>{ITEM_DESCRIPTION_TITLE}</DialogTitle>
            <p id={ITEM_DESCRIPTION_GUIDE_ID} className="sr-only">
                {ITEM_DESCRIPTION_GUIDE}
            </p>
        </DialogHeader>
        {/* 본문만 스크롤하고 제목·버튼은 고정한다 — 동의 약관 모달과 같은 높이·여백을 쓴다.
            카테고리 경로와 아래 목록 사이는 시안대로 24 를 둔다. */}
        <div className={cn(dialogBodyClassName, 'max-h-112 [scrollbar-gutter:stable_both-edges] gap-6')}>
            {/* 카테고리 경로 — 표의 [테마][분야] 칸과 같은 값이다. 어느 갈래를 보고 있는지 먼저 알려 준다.
                테마 색은 시안 값(navy.600)을 팔레트 유틸로 둔다 — 이 뜻을 담은 시맨틱 토큰이 아직 없어,
                필수 표시(*)와 같이 light/dark 색 정합 작업 때 시맨틱으로 함께 올린다[PB-05]. */}
            <p className="flex items-center gap-4">
                <span className="typo-body-xl-bold text-navy-600">{theme}</span>
                {/* 두 값을 가르는 선 — 읽어 줄 것이 없어 장식으로 둔다. */}
                <span aria-hidden="true" className="border-subtle-3 h-3 border-l" />
                <span className="typo-body-xl-regular text-label-foreground">{field}</span>
            </p>

            {/* 블록 사이는 시안대로 16 — 컨테이너의 8 에 블록의 위 여백 8 을 더한다. */}
            <div className="flex flex-col gap-2">
                {/* 모달 제목(h2)이 "품목설명"이라 어떤 품목인지는 이 h3 가 밝힌다. 원문의 항목 번호를
                    함께 두어 발주처 원문(품목설명_전체)에서 바로 찾을 수 있게 한다. */}
                <h3 className="typo-title-m-bold text-foreground">
                    {item.no}. {item.name}
                </h3>
                {toSections(item.lines).map((section, sectionIndex) => (
                    <div key={sectionIndex} className={cn('flex flex-col gap-2', sectionIndex > 0 && 'pt-2')}>
                        {/* 예시 소제목 — 품목명(h3) 아래 단계라 h4 다[6.4.2]. */}
                        {section.isExample ? (
                            <h4 className="typo-body-xl-medium text-foreground">{EXAMPLE_HEADING}</h4>
                        ) : null}
                        <ul className="flex list-none flex-col gap-2">
                            {section.lines.map((line, lineIndex) => (
                                <ItemDescriptionLineItem
                                    key={`${item.no}-${sectionIndex}-${lineIndex}`}
                                    line={line}
                                    isExample={section.isExample}
                                />
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
        {/* CTA 가 없어도 아래 여백은 스크롤 영역 밖에 둔다 — 본문이 카드 맨 가장자리에서 끊기지 않는다
            (피인용 확인 메뉴얼 모달과 같은 처리). 닫기는 오른쪽 위 X 로 한다. */}
        <div aria-hidden="true" className={dialogBodyEndClassName} />
    </DialogContent>
)

export {ItemDescriptionDialogContent}
