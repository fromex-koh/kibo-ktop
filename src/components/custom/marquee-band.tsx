const MARQUEE_TEXT = 'Korea Technology-rating Open platform'

// 대형 장식 문구가 좌측으로 흐르는 밴드. 뷰포트 폭을 흐르는 전제라 좁은 컨테이너에 넣으면 잘린다.
// 장식이라 접근성 트리에서 제외한다. 흐름 정의는 globals.css 의 @theme --animate-marquee. [KWCAG 5.1.1 · 6.3.1]
const MarqueeBand = () => (
    <div aria-hidden="true" className="overflow-hidden py-16">
        <div className="animate-marquee flex w-max motion-reduce:animate-none">
            <span className="typo-marquee-band-black text-foreground/10 whitespace-nowrap">
                {MARQUEE_TEXT}&nbsp;&nbsp;&nbsp;
            </span>
            <span className="typo-marquee-band-black text-foreground/10 whitespace-nowrap">
                {MARQUEE_TEXT}&nbsp;&nbsp;&nbsp;
            </span>
        </div>
    </div>
)

export default MarqueeBand
