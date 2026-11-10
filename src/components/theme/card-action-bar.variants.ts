// 카드 액션 바(CardActionBar) 스타일 — 목록 카드 아래 버튼 묶음. 사용법은 composite/card-action-bar.tsx.
//   · sm 이상: 보조(secondary)는 왼쪽(Start), 주요(primary)는 오른쪽(End) 끝. 버튼 폭은 글자만큼.
//   · sm 미만: 주요 버튼이 맨 위 한 줄을 채우고, 나머지는 아래 줄을 같은 폭으로 나눈다.
//
// 구현 메모
//   · 모바일에서 Start · End 를 display: contents 로 풀어, 두 구역의 버튼이 한 줄에서 폭을 나눈다.
//   · 버튼은 구역의 직계 자식([&>*>[data-variant]])으로, 주요 버튼은 data-variant="default" 로 찾는다 —
//     data-slot 은 모달 트리거(asChild)가 dialog-trigger 로 덮어써 쓸 수 없다.
//   · 주요 버튼을 위로 올리는 것은 화면 순서(order)만 바꾼다. 키보드 · 스크린리더는 DOM 순서(보조 → 주요)[7.3.1].
//   · 클래스는 문자열 조립 없이 그대로 적는다 — Tailwind 가 소스 글자를 읽어 클래스를 만든다.

export const cardActionBarClassName = [
    'flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-between',
    // 모바일 — min-w-fit: 반 칸에 글자가 안 들어가면(개별평가 일반 결과 등) 넘치지 않고 다음 줄로 내려간다.
    // [data-variant] 로 선택자를 한 단계 구체적으로 둬 버튼의 min-w-control-* 를 이긴다.
    'max-sm:[&>*>[data-variant]]:min-w-fit',
    // flex-1(같은 폭 나눔)은 보조 버튼에만 — 주요 버튼에 주면 생성 CSS 순서상 basis-full 을 덮어써 반 칸에 머문다.
    'max-sm:[&>*>[data-variant]:not([data-variant=default])]:flex-1',
    'max-sm:[&>*>[data-variant=default]]:order-first',
    'max-sm:[&>*>[data-variant=default]]:basis-full',
].join(' ')

export const cardActionBarStartClassName = 'contents sm:flex sm:items-center sm:gap-2'

// ml-auto — 왼쪽 구역이 없어도 오른쪽 끝에 선다.
export const cardActionBarEndClassName = 'contents sm:ml-auto sm:flex sm:items-center sm:gap-2'
