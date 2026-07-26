const MARQUEE_TEXT = 'Korea Technology-rating Open platform'

// 대형 장식 문구가 좌측으로 흐르는 밴드. 뷰포트 폭을 흐르는 전제라 좁은 컨테이너에 넣으면 잘린다.
// 장식이라 접근성 트리에서 제외하고, 감속 모션 선호 시 정지한다(styles/… 의 main-marquee). [KWCAG 5.1.1 · 6.3.1]
const MarqueeBand = () => (
    <div aria-hidden="true" className="overflow-hidden py-16">
        {/* PROJECT-STYLE: 140px 대형 장식 타이포는 typo 스케일 밖의 화면 고유 그래픽 요소라
            clamp arbitrary 값을 제한적으로 사용한다(다른 화면에서 재사용 시 토큰 승격). */}
        <div className="main-marquee flex w-max">
            <span className="text-foreground/10 text-[clamp(4rem,7.3vw,8.75rem)] leading-[1.4] font-black whitespace-nowrap">
                {MARQUEE_TEXT}&nbsp;&nbsp;&nbsp;
            </span>
            <span className="text-foreground/10 text-[clamp(4rem,7.3vw,8.75rem)] leading-[1.4] font-black whitespace-nowrap">
                {MARQUEE_TEXT}&nbsp;&nbsp;&nbsp;
            </span>
        </div>
    </div>
)

export default MarqueeBand
