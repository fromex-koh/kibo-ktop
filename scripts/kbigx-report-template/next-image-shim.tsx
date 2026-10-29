// next/image 대신 묶는 <img> — 단독 HTML 에는 Next.js 이미지 서버가 없어서, 정적 import 값(data URI)을 그대로 넣는다.
// build.mjs 가 esbuild alias 로 next/image 를 이 파일로 바꾼다(앱 빌드에는 쓰이지 않는다).
import type {ImgHTMLAttributes} from 'react'

type StaticImageData = {src: string; width?: number; height?: number}
type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
    src: string | StaticImageData
    priority?: boolean
    preload?: boolean
    fill?: boolean
    placeholder?: string
    quality?: number
}

// next/image 전용 props — <img> 에 넘기면 알 수 없는 속성이 되므로 뺀다.
const NEXT_IMAGE_ONLY_PROPS = new Set(['priority', 'preload', 'fill', 'placeholder', 'quality', 'sizes'])

const Image = ({src, alt, ...props}: ImageProps) => {
    const imgProps = Object.fromEntries(Object.entries(props).filter(([key]) => !NEXT_IMAGE_ONLY_PROPS.has(key)))

    // NA-005 예외: 단독 HTML 에는 next/image 최적화 서버가 없다.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={typeof src === 'string' ? src : src.src} alt={alt} {...imgProps} />
}

export default Image
export type {StaticImageData}
