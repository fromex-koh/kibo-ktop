'use client'

// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import {useState} from 'react'
import {WordCloud, type WordCloudItem} from '@/components/custom/word-cloud'
import {Button} from '@/components/ui/button'

// 워드클라우드 가이드의 단어 수 데모 — 버튼으로 키워드 수를 바꿔 배치가 다시 계산되는 모습을 보여 준다.
const ISSUE_WORDS: WordCloudItem[] = [
    {text: '인공지능', weight: 100},
    {text: '학습', weight: 82},
    {text: '기술', weight: 70},
    {text: '이미지', weight: 64},
    {text: '이공', weight: 61},
    {text: '모델', weight: 56},
    {text: '신경망', weight: 51},
    {text: '지능', weight: 47},
    {text: '인식', weight: 42},
    {text: '기반', weight: 38},
    {text: '분석', weight: 34},
    {text: '분류', weight: 31},
    {text: '예측', weight: 29},
    {text: '서비스', weight: 27},
    {text: '영상', weight: 25},
    {text: '활용', weight: 23},
    {text: '네트워크', weight: 21},
    {text: '성능', weight: 19},
]

const WordCloudCountDemo = () => {
    const [scenario, setScenario] = useState<'large' | 'medium' | 'small'>('large')
    const scenarios = [
        {id: 'small' as const, label: '적음', wordCount: 6},
        {id: 'medium' as const, label: '중간', wordCount: 12},
        {id: 'large' as const, label: '많음', wordCount: ISSUE_WORDS.length},
    ]
    const selectedScenario = scenarios.find(({id}) => id === scenario) ?? scenarios[2]
    const visibleWords = ISSUE_WORDS.slice(0, selectedScenario.wordCount)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-end gap-3">
                <div className="flex gap-2" role="group" aria-label="워드클라우드 키워드 수 선택">
                    {scenarios.map(({id, label}) => (
                        <Button
                            key={id}
                            type="button"
                            size="xs"
                            variant={scenario === id ? 'default' : 'outline'}
                            aria-pressed={scenario === id}
                            onClick={() => setScenario(id)}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </div>
            <WordCloud
                words={visibleWords}
                ariaLabel={`최근 연구개발 이슈 ${visibleWords.length}개를 중요도순으로 나타낸 워드클라우드`}
            />
        </div>
    )
}

export {WordCloudCountDemo}
