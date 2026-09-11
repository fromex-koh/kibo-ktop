import Image from 'next/image'
import answerMarkDark from '@public/images/faq/faq-answer-mark-dark.webp'
import answerMark from '@public/images/faq/faq-answer-mark.webp'
import questionMarkDark from '@public/images/faq/faq-question-mark-dark.webp'
import questionMark from '@public/images/faq/faq-question-mark.webp'

// 문답 표시 — 시안이 그린 24×24 그림 "Q." · "A."(icon-etc/question · icon-etc/reply)다.
// 자주 묻는 질문과 1:1 문의 상세가 같은 그림을 쓰고 라이트·다크 짝도 같아, 두 곳에서 되풀이하지 않도록
// 여기로 모은다.
//
// 글꼴로 찍은 글자가 아니라 lucide 에도 없는 브랜드 그림이라 이미지로 둔다([NA-008]은 아이콘 세트를
// 손수 늘리지 말라는 규칙이라 이런 그림에는 해당하지 않는다).
//
// 그림 자체는 장식이라 alt 를 비운다 — 무엇을 가리키는 묶음인지는 사용처의 sr-only 문구가 알린다[5.1.1].
const QA_MARK_IMAGES = {
    question: {light: questionMark, dark: questionMarkDark},
    answer: {light: answerMark, dark: answerMarkDark},
} as const

type QaMarkType = keyof typeof QA_MARK_IMAGES

const QaMark = ({type}: {type: QaMarkType}) => {
    const {light, dark} = QA_MARK_IMAGES[type]

    // 색이 아니라 그림 파일 자체가 갈리므로 토큰으로 표현할 수 없다 — 라이트·다크 짝을 함께 두고 보이는
    // 쪽만 남긴다([PB-06]이 막는 것은 같은 의미의 색을 사용처에서 다시 분기하는 것이다).
    // 숨은 쪽은 display:none 이라 flex 칸을 차지하지 않아 옆 글과의 간격이 벌어지지 않는다.
    return (
        <>
            <Image src={light} alt="" sizes="24px" className="size-icon-lg shrink-0 dark:hidden" />
            <Image src={dark} alt="" sizes="24px" className="size-icon-lg hidden shrink-0 dark:block" />
        </>
    )
}

export {QaMark}
export type {QaMarkType}
