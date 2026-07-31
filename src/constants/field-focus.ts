// checkbox·radio·switch 처럼 label 과 컨트롤이 한 행에서 하나의 선택 영역이 되는 Field 용 포커스링.
//
// horizontal Field 에서만 자식 컨트롤의 키보드 포커스를 감지해 wrapper 전체를 감싸고 컨트롤 outline 을 끈다.
// Input·Select·Combobox·Textarea가 쓰는 vertical Field 에서는 적용되지 않으므로 실제 입력 영역에만
// 각 컴포넌트의 focus-visible outline 이 표시된다.
//
// 색·두께·offset·style 은 Button focus 와 동일(outline-ring / outline-2 / outline-offset-2 / outline-solid).
// wrapper 모서리는 컨트롤 형태를 따른다: checkbox 는 rounded-2xs, radio·switch 는 pill 형태의 rounded-full.
export const FIELD_FOCUS_RING =
    'data-[orientation=horizontal]:has-[:focus-visible]:outline-2 data-[orientation=horizontal]:has-[:focus-visible]:outline-solid data-[orientation=horizontal]:has-[:focus-visible]:outline-ring data-[orientation=horizontal]:has-[:focus-visible]:outline-offset-2 data-[orientation=horizontal]:[&_:focus-visible]:outline-none has-[[data-slot=checkbox]]:rounded-2xs has-[[data-slot=radio-group-item]]:rounded-full has-[[data-slot=switch]]:rounded-full'
