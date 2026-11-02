import Image, {type StaticImageData} from 'next/image'
import {cn} from '@/lib/utils'

// ThemeImage — 라이트 · 다크 그림 파일이 따로인 꾸밈 그림(alt="").
// 색이 아니라 그림 파일 자체가 갈리므로 토큰으로 표현할 수 없다 — 둘 다 그리고 클래스로 한쪽만 남긴다.
// 숨은 쪽은 display:none 이라 칸을 차지하지 않는다.

type ThemeImageProps = {
    light: StaticImageData
    dark: StaticImageData
    className?: string
}

const ThemeImage = ({light, dark, className}: ThemeImageProps) => (
    <>
        <Image src={light} alt="" className={cn('dark:hidden', className)} />
        <Image src={dark} alt="" className={cn('hidden dark:block', className)} />
    </>
)

export {ThemeImage}
