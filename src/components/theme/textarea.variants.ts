// PROJECT-STYLE: 시안 text_area(40006650:29706)의 안쪽 여백은 위아래도 16 이다(상자 위 52142 → 글자 52158).
// 좌우와 같은 값이라 px-4 py-4 로 맞춘다.
//
// 스크롤바는 테두리 안쪽 끝에 붙어 그려지는데, 상자에 8px 라운드가 있어 위아래 모서리에서 잘려
// 밖으로 삐져나온 것처럼 보인다. 전역 스크롤바(globals.css)를 그대로 두고 이 컨트롤에서만
// 트랙을 위아래로 8px 씩 띄우고(my-2) 회색 트랙 기둥을 없애 thumb 만 남긴다.
// [SC-01] 예외 아님: ::-webkit-scrollbar-* 는 값이 아니라 선택자를 표현하는 arbitrary variant 다.
const textareaClassName =
    'border-control bg-surface text-label-foreground min-h-30 w-full min-w-0 resize-none rounded-sm border px-4 py-4 text-base transition-colors outline-none focus-visible:border-primary outline-ring focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid placeholder:text-placeholder disabled:placeholder:text-disabled aria-invalid:border-destructive read-only:bg-field-disabled disabled:border-control disabled:bg-field-disabled disabled:text-disabled disabled:cursor-not-allowed disabled:opacity-100 [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-track]:my-2 [&::-webkit-scrollbar-track]:bg-transparent'
export {textareaClassName}
