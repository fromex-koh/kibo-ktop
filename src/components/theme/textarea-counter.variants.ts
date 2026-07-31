const textareaCounterContainerClassName = 'flex w-full min-w-0 flex-col gap-2'
const textareaCounterControlClassName = 'min-h-30'
const textareaCounterFooterClassName = 'flex items-start gap-2'
const textareaCounterMessageClassName = 'min-w-0 flex-1'
const textareaCounterCountClassName = 'shrink-0'
// PROJECT-STYLE: 시안 text_area(40006650:29706)의 카운터는 "80 / 100" 전체가 한 색의 텍스트 노드지만,
// 현재 글자수만 info 로 강조해 남은 여유를 한눈에 알 수 있게 한다(프로젝트 결정).
// 시안은 상태마다 카운터 색이 gray.500 과 green.800 으로 갈리는데, green.800 은 프로젝트 success(success.700)가
// 아니라 브랜드 팔레트 값이고 disabled 에서도 초록이라 기준으로 삼지 않는다.
const textareaCounterCurrentClassName = 'text-info'
const textareaCounterLimitClassName = 'text-foreground-subtle'

export {
    textareaCounterContainerClassName,
    textareaCounterControlClassName,
    textareaCounterFooterClassName,
    textareaCounterMessageClassName,
    textareaCounterCountClassName,
    textareaCounterCurrentClassName,
    textareaCounterLimitClassName,
}
