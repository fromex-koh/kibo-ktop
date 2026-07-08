'use client'

import {Highlight, themes, type Language} from 'prism-react-renderer'
import CopyChip from '@/components/guide/copy-chip'

// 코드 스니펫을 실제 문법 강조가 적용된 코드블럭으로 보여준다(MIT 라이선스 prism-react-renderer).
// 문법 강조 색은 라이브러리 내장 테마(themes.oneDark)를 그대로 쓴다 — 코드블럭은 대부분의 문서
// 사이트(Docusaurus·MDN 등)처럼 페이지 라이트/다크와 무관하게 항상 어두운 배경을 쓰는 관례를
// 따른다. 키워드·문자열 등 세분화된 문법 색까지 이 프로젝트의 시맨틱 팔레트로 옮기는 건
// 범위를 벗어난다고 판단해 라이브러리 팔레트를 그대로 둔다(PB-12 와 같은 결의 예외).
type CodeBlockProps = {code: string; language?: Language; copyLabel?: string}

const CodeBlock = ({code, language = 'tsx', copyLabel}: CodeBlockProps) => (
    <div className="border-gray-subtle-2 relative overflow-hidden rounded-md border">
        <div className="absolute top-3 right-3">
            <CopyChip value={code} label={copyLabel} />
        </div>
        <Highlight code={code.trim()} language={language} theme={themes.oneDark}>
            {({style, tokens, getLineProps, getTokenProps}) => (
                <pre className="typo-caption-regular overflow-x-auto p-4 pr-24 font-mono" style={style}>
                    {tokens.map((line, lineIndex) => (
                        <div key={lineIndex} {...getLineProps({line})}>
                            {line.map((token, tokenIndex) => (
                                <span key={tokenIndex} {...getTokenProps({token})} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    </div>
)

export default CodeBlock
