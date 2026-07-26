'use client'

import {Highlight, themes, type Language, type PrismTheme} from 'prism-react-renderer'
import {useTheme} from 'next-themes'
import {useSyncExternalStore} from 'react'
import {cn} from '@/lib/utils'

// 코드 스니펫을 실제 문법 강조가 적용된 코드블럭으로 보여준다(MIT 라이선스 prism-react-renderer).
// 페이지와 코드블럭의 명암을 반대로 둔다: 라이트 페이지에는 oneDark, 다크 페이지에는 vsLight.
// vsLight 의 attr-name 순수 빨강(rgb(255,0,0))만 흰 배경에서 4.0:1이라, 같은 계열의 진한 빨강으로
// 보정해 일반 텍스트 최소 대비 4.5:1을 넘긴다. 나머지는 라이브러리 내장 팔레트를 그대로 쓴다.
type CodeBlockProps = {code: string; language?: Language; copyLabel?: string}

const accessibleVsLight: PrismTheme = {
    ...themes.vsLight,
    styles: themes.vsLight.styles.map((entry) =>
        entry.types.includes('attr-name') ? {...entry, style: {...entry.style, color: 'rgb(192, 0, 0)'}} : entry,
    ),
}

// next-themes 의 resolvedTheme 은 서버에서 알 수 없다. 서버와 hydration 첫 렌더에서는 false를
// 반환하고, 구독이 시작된 클라이언트 렌더부터 true를 반환해 Prism 인라인 style 불일치를 막는다.
const subscribeToHydration = () => () => undefined
const getClientSnapshot = () => true
const getServerSnapshot = () => false

const CodeBlock = ({code, language = 'tsx'}: CodeBlockProps) => {
    const {resolvedTheme} = useTheme()
    const isHydrated = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot)
    const codeTheme = isHydrated && resolvedTheme === 'dark' ? accessibleVsLight : themes.oneDark

    return (
        <div className="border-border relative overflow-hidden rounded-md border">
            <Highlight code={code.trim()} language={language} theme={codeTheme}>
                {/* 줄 래퍼가 div 가 아니라 span 인 이유 — pre 안에는 문구 콘텐츠만 올 수 있어 div 를 넣으면
                    마크업 오류다(block 으로 줄바꿈은 그대로 유지). [KWCAG 8.1.1] */}
                {({style, tokens, getLineProps, getTokenProps}) => (
                    <pre className="typo-caption-regular overflow-x-auto p-4 font-mono" style={style}>
                        <code>
                            {tokens.map((line, lineIndex) => {
                                const {className: lineClassName, ...lineProps} = getLineProps({line})

                                return (
                                    <span key={lineIndex} className={cn('block', lineClassName)} {...lineProps}>
                                        {line.map((token, tokenIndex) => (
                                            <span key={tokenIndex} {...getTokenProps({token})} />
                                        ))}
                                    </span>
                                )
                            })}
                        </code>
                    </pre>
                )}
            </Highlight>
        </div>
    )
}

export default CodeBlock
