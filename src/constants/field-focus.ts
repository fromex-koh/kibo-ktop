// label + 폼 컨트롤(checkbox·radio·input·select) 을 감싸는 wrapper 에 얹는 공용 포커스링.
//
// 자식 컨트롤이 키보드 포커스(focus-visible)되면 wrapper 전체를 solid outline 이 감싸고
// (has-[:focus-visible]:outline-*), 컨트롤 자체 outline 은 끈다([&_:focus-visible]:outline-none).
// → label 까지 하나로 감싸는 포커스링이 된다. 단독 컨트롤(label 없이)은 이 wrapper 를 쓰지 않으므로
//   컴포넌트 자체 outline(focus-visible:outline-2 …)이 그대로 보인다.
//
// 색·두께·offset·style 은 Button focus 와 동일(outline-ring / outline-2 / outline-offset-2 / outline-solid).
// outline 모서리는 각지게 둔다(rounded 미적용).
export const FIELD_FOCUS_RING =
    'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-ring has-[:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-none'
