import {DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {ListMarker} from '@/components/custom/list-marker'
import {dialogBodyClassName, dialogBodyEndClassName} from '@/components/theme/dialog.variants'
import {
    ITEM_DESCRIPTIONS,
    ITEM_DESCRIPTION_GUIDE,
    ITEM_DESCRIPTION_TITLE,
    type ItemDescription,
    type ItemDescriptionLine,
} from '@/content/service/item-descriptions'
import {cn} from '@/lib/utils'

// 품목설명 모달 — 기업·기술정보 입력의 [품목설명]이 여는 안내 모달. 240개 품목의 정의·예시를 훑어본다.
// 본문은 content/service/item-descriptions 에서 가져오고, Dialog 루트와 트리거는 사용처에서 구성한다
// (필수/선택 동의 팝업(consent-terms-dialog)과 같은 구조 — 제목 · 스크롤 본문 · CTA).
//
// 품목이 240개라 목록이 길다. 훑어 내려가는 것 말고도 위치를 잡을 수 있도록 품목명을 heading 으로 두어
// 스크린리더의 제목 이동으로 건너뛸 수 있게 한다[6.4.2].

// 줄 종류별 생김새 — 원문의 줄머리 기호를 프로젝트 마커·글자로 옮긴다.
//   paragraph  본문 한 덩이(원문 ▣) — 점 마커
//   bullet     그 아래 세부 항목(원문 -) — 대시 마커에 한 칸 들여쓰기
//   example    예시 줄 — 마커 없이 옅은 색
//   note       용어 풀이·유의사항(원문 *·※) — 예시보다 한 단계 작은 글
//   text       앞줄에서 이어지는 문장 — 예시와 같은 모양으로 그 아래 붙는다
const ItemDescriptionLineItem = ({line}: {line: ItemDescriptionLine}) => {
    if (line.kind === 'paragraph' || line.kind === 'bullet') {
        const isBullet = line.kind === 'bullet'

        return (
            <li className={cn('typo-body-xl-regular text-label-foreground flex', isBullet && 'ps-4')}>
                <ListMarker type="unordered" level={isBullet ? 2 : 1} />
                <span className="min-w-0">{line.text}</span>
            </li>
        )
    }

    // 예시·이어지는 문장·용어 풀이는 마커 없이 글자만으로 구분한다 — 원문에도 기호가 없다.
    return (
        <li
            className={cn(
                'ps-4',
                line.kind === 'note'
                    ? 'typo-body-l-regular text-foreground-subtle'
                    : 'typo-body-xl-regular text-foreground-subtle',
            )}
        >
            {line.text}
        </li>
    )
}

const ItemDescriptionArticle = ({item}: {item: ItemDescription}) => (
    <div className="flex flex-col gap-2">
        {/* 모달 제목(h2) 아래 품목 하나하나가 구획이라 h3 이다. 원문의 번호를 제목에 함께 둔다. */}
        <h3 className="typo-title-m-bold text-foreground">
            {item.no}. {item.name}
        </h3>
        <ul className="flex list-none flex-col gap-2">
            {item.lines.map((line, index) => (
                <ItemDescriptionLineItem key={`${item.no}-${index}`} line={line} />
            ))}
        </ul>
    </div>
)

// 모달 안내문(감춰 둠)의 id — 한 화면에 이 모달은 하나뿐이라 고정값으로 둔다.
const ITEM_DESCRIPTION_GUIDE_ID = 'item-description-dialog-guide'

// 트리거·열림 상태는 사용처가 정한다 — 이 조각은 열렸을 때의 내용만 갖는다(동의 약관 모달과 같은 방식).
const ItemDescriptionDialogContent = () => (
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
        {/* 본문만 스크롤하고 제목·버튼은 고정한다 — 동의 약관 모달과 같은 높이·여백을 쓴다. */}
        <div className={cn(dialogBodyClassName, 'max-h-112 [scrollbar-gutter:stable_both-edges] gap-6')}>
            {ITEM_DESCRIPTIONS.map((item) => (
                <ItemDescriptionArticle key={item.no} item={item} />
            ))}
        </div>
        {/* CTA 가 없어도 아래 여백은 스크롤 영역 밖에 둔다 — 본문이 카드 맨 가장자리에서 끊기지 않는다
            (피인용 확인 메뉴얼 모달과 같은 처리). 닫기는 오른쪽 위 X 로 한다. */}
        <div aria-hidden="true" className={dialogBodyEndClassName} />
    </DialogContent>
)

export {ItemDescriptionDialogContent}
