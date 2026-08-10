// PROJECT-STYLE: 시안 text_area(40006650:29706)의 안쪽 여백은 위아래도 16 이다(상자 위 52142 → 글자 52158).
// 좌우와 같은 값이라 px-4 py-4 로 맞춘다.
//
// 스크롤바는 테두리 안쪽 끝에 붙어 그려지는데, 상자에 8px 라운드가 있어 위아래 모서리에서 잘려
// 밖으로 삐져나온 것처럼 보인다. 전역 스크롤바(globals.css)를 그대로 두고 이 컨트롤에서만
// 트랙을 위아래로 8px 씩 띄우고(my-2) 회색 트랙 기둥을 없애 thumb 만 남긴다.
// [SC-01] 예외 아님: ::-webkit-scrollbar-* 는 값이 아니라 선택자를 표현하는 arbitrary variant 다.
// PROJECT-STYLE: 검사에 걸린 칸(aria-invalid)은 focus-visible 이 아니라 focus 에도 포커스 표시를 낸다.
// 제출 버튼을 마우스로 누른 뒤 첫 오류 칸으로 포커스를 옮기면 브라우저가 :focus-visible 을 켜지 않아
// 표시가 보이지 않는다 — 어디로 이동했는지 알 수 없으면 안 된다[6.1.2].
//
// 포커스 표시는 InputGroup 안에 있을 때는 그리지 않는다(not-data-[slot=input-group-control]) — 이 컨트롤은
// 상자 안쪽에 놓이고 표시는 바깥 상자가 그리기 때문이다. 안쪽에도 그리면 outline 이 두 겹으로 보이고,
// 안쪽은 rounded-none 이라 모서리까지 어긋난다. 안쪽에서 끄는 방식(focus-visible:outline-none)은
// Tailwind 정렬 순서상 그리는 규칙보다 앞에 놓여 지지 않는다.
const textareaClassName =
    'border-control bg-surface text-label-foreground min-h-30 w-full min-w-0 resize-none rounded-sm border px-4 py-4 text-base transition-colors outline-none focus-visible:border-primary outline-ring focus-visible:outline-ring not-data-[slot=input-group-control]:focus-visible:outline-2 not-data-[slot=input-group-control]:focus-visible:outline-offset-2 not-data-[slot=input-group-control]:focus-visible:outline-solid not-data-[slot=input-group-control]:aria-invalid:focus:outline-2 not-data-[slot=input-group-control]:aria-invalid:focus:outline-offset-2 not-data-[slot=input-group-control]:aria-invalid:focus:outline-solid placeholder:text-placeholder disabled:placeholder:text-disabled aria-invalid:border-destructive read-only:bg-field-disabled disabled:border-control disabled:bg-field-disabled disabled:text-disabled disabled:cursor-not-allowed disabled:opacity-100 [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-track]:my-2 [&::-webkit-scrollbar-track]:bg-transparent'
export {textareaClassName}
