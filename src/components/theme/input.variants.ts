// PROJECT-STYLE: 검사에 걸린 칸(aria-invalid)은 focus-visible 이 아니라 focus 에도 포커스 표시를 낸다.
// 제출 버튼을 마우스로 누른 뒤 첫 오류 칸으로 포커스를 옮기면 브라우저가 :focus-visible 을 켜지 않아
// 표시가 보이지 않는다 — 어디로 이동했는지 알 수 없으면 안 된다[6.1.2].
//
// 포커스 표시는 InputGroup 안에 있을 때는 그리지 않는다(not-data-[slot=input-group-control]) — 이 컨트롤은
// 상자 안쪽에 놓이고 표시는 바깥 상자가 그리기 때문이다. 안쪽에도 그리면 outline 이 두 겹으로 보이고,
// 안쪽은 rounded-none 이라 모서리까지 어긋난다. 안쪽에서 끄는 방식(focus-visible:outline-none)은
// Tailwind 정렬 순서상 그리는 규칙보다 앞에 놓여 지지 않는다.
const inputClassName =
    'h-control-h-md border-control bg-surface text-label-foreground focus-visible:border-primary outline-ring focus-visible:outline-ring w-full min-w-0 rounded-sm border px-4 text-base transition-colors outline-none not-data-[slot=input-group-control]:focus-visible:outline-2 not-data-[slot=input-group-control]:focus-visible:outline-offset-2 not-data-[slot=input-group-control]:focus-visible:outline-solid not-data-[slot=input-group-control]:aria-invalid:focus:outline-2 not-data-[slot=input-group-control]:aria-invalid:focus:outline-offset-2 not-data-[slot=input-group-control]:aria-invalid:focus:outline-solid placeholder:text-placeholder disabled:placeholder:text-disabled aria-invalid:border-destructive read-only:bg-field-disabled disabled:border-control disabled:bg-field-disabled disabled:text-disabled disabled:cursor-not-allowed disabled:opacity-100 file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium'
export {inputClassName}
