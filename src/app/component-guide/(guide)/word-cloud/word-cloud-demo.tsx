'use client'

// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import {WordCloud, type WordCloudItem} from '@/components/custom/word-cloud'

// 워드클라우드 가이드의 단어 수 예시 — 같은 틀(보고서 R&D 이슈와 같은 높이 216)에 5 · 18 · 30개를 그려
// 글자 크기가 단어 수에 맞춰 자동으로 정해지는 모습을 보여 준다.
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
    {text: '알고리즘', weight: 18},
    {text: '데이터', weight: 17},
    {text: '센서', weight: 16},
    {text: '로봇', weight: 15},
    {text: '음성', weight: 14},
    {text: '자율주행', weight: 13},
    {text: '클라우드', weight: 12},
    {text: '보안', weight: 11},
    {text: '최적화', weight: 10},
    {text: '플랫폼', weight: 9},
    {text: '진단', weight: 8},
    {text: '추론', weight: 7},
]

const COUNT_CASES = [
    {count: 5, note: '적음 — 글자를 크게 키워 틀을 채운다.'},
    {count: 18, note: '보통 — 보고서 R&D 이슈 목업과 같은 수.'},
    {count: 30, note: '많음 — 글자를 줄여 모두 넣고 틀을 채운다.'},
] as const

const WordCloudCountDemo = () => (
    <div className="flex flex-col gap-8">
        {COUNT_CASES.map(({count, note}) => (
            <div key={count} className="flex flex-col gap-3">
                <p className="typo-body-l-regular text-label-foreground">
                    <strong className="typo-body-l-bold text-foreground">키워드 {count}개</strong> · {note}
                </p>
                <WordCloud
                    words={ISSUE_WORDS.slice(0, count)}
                    ariaLabel={`연구개발 이슈 ${count}개를 중요도순으로 나타낸 워드클라우드`}
                    className="h-54 w-full"
                />
            </div>
        ))}
    </div>
)

// 엣지 케이스 — 아주 긴 키워드 · 좁은 폭 · 아주 많은 키워드 · 키워드 하나. 모든 키워드가 빠짐없이 그려져야 한다.
const LONG_KEYWORD_WORDS: WordCloudItem[] = [
    {text: '인공지능기반다중모달의료영상분석및진단보조시스템고도화기술', weight: 100},
    {text: '학습', weight: 82},
    {text: '대규모언어모델경량화및온디바이스추론가속기술', weight: 70},
    ...ISSUE_WORDS.slice(3, 12),
]
const MANY_PREFIXES = ['AI', '데이터', '영상', '센서', '로봇', '보안', '통신', '배터리', '반도체', '소재']
const MANY_SUFFIXES = ['분석', '제어', '모델', '플랫폼', '장치', '처리', '학습', '인식']
const MANY_WORDS: WordCloudItem[] = MANY_PREFIXES.flatMap((prefix, prefixIndex) =>
    MANY_SUFFIXES.map((suffix, suffixIndex) => ({
        text: `${prefix}${suffix}`,
        weight: 100 - prefixIndex * 8 - suffixIndex,
    })),
)

const EDGE_CASES = [
    {
        key: 'long',
        title: '아주 긴 키워드',
        note: '한 단어가 영역 폭(92%)을 넘지 않게 그 단어만 글자를 줄인다. 나머지 단어 크기는 그대로다.',
        words: LONG_KEYWORD_WORDS,
        className: 'h-54 w-full',
    },
    {
        key: 'narrow',
        title: '좁은 폭 + 긴 키워드',
        note: '최소 크기(12px)로도 폭을 넘으면 화면에는 말줄임(…)으로 그리고, 올리면 툴팁에 전체 단어가 보인다. 화면 낭독기도 전체 단어를 읽는다.',
        words: LONG_KEYWORD_WORDS,
        className: 'h-54 w-full max-w-60',
    },
    {
        key: 'many',
        title: `아주 많은 키워드 (${MANY_WORDS.length}개)`,
        note: '빼지 않고 전체 글자를 줄여 모두 넣는다. 최소 크기에서도 모자라면 큰 · 작은 단어 크기 차이를 좁히고 간격을 촘촘히 한다.',
        words: MANY_WORDS,
        className: 'h-54 w-full',
    },
    {
        key: 'two',
        title: '키워드 둘',
        note: '큰 단어가 높이에 막혀 가로가 남으면 크기 차이를 좁혀 작은 단어를 키우고(중요도 순서는 유지), 두 단어 묶음을 가운데에 맞춘다. 글자 모양을 지키므로 짧은 단어 둘이면 좌우가 조금 남는다.',
        words: [
            {text: '이미지', weight: 100},
            {text: '기술', weight: 30},
        ],
        className: 'h-54 w-full',
    },
    {
        key: 'three',
        title: '키워드 셋',
        note: '같은 방식으로 작은 단어들을 키워 좌우 여백을 메운다.',
        words: ISSUE_WORDS.slice(0, 3),
        className: 'h-54 w-full',
    },
    {
        key: 'single',
        title: '키워드 하나',
        note: '글자 크기는 영역 높이까지 — 글자 모양을 지키므로 짧은 한 단어는 좌우가 남는다.',
        words: ISSUE_WORDS.slice(0, 1),
        className: 'h-54 w-full',
    },
] as const

const WordCloudEdgeCaseDemo = () => (
    <div className="flex flex-col gap-8">
        {EDGE_CASES.map((item) => (
            <div key={item.key} className="flex flex-col gap-3">
                <p className="typo-body-l-regular text-label-foreground">
                    <strong className="typo-body-l-bold text-foreground">{item.title}</strong> · {item.note}
                </p>
                <WordCloud
                    words={[...item.words]}
                    ariaLabel={`${item.title} 워드클라우드 예시`}
                    className={item.className}
                />
            </div>
        ))}
    </div>
)

export {WordCloudCountDemo, WordCloudEdgeCaseDemo}
