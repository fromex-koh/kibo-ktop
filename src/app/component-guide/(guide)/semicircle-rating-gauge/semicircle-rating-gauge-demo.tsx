'use client'

// [퍼블리싱 가이드 전용] 이 파일은 /component-guide 문서 화면이다. 서비스 화면과 무관하며 이식하지 않아도 된다.
import {useState} from 'react'
import {SemicircleRatingGauge} from '@/components/custom/semicircle-rating-gauge'
import {Button} from '@/components/ui/button'
import {CRI_GRADES, toCriRatingData} from '@/content/service/cri-grades'

// 등급 원호 게이지 가이드의 등급별 데모 — 버튼으로 CRI 24개 등급을 바꿔 채움 길이 · 등급 · 등급명을 확인한다.
// 색은 등급과 무관하게 파랑 하나이고, 채움 길이만 달라진다. R(유보) · NR(평가 제외)은 채움 없이 등급명만 보인다.
const DEMO_DETAILS = [
    {label: '평가일자', value: '2025-05-20'},
    {label: '결산일자', value: '2024-12-31'},
]
const DEFAULT_GRADE = 'A0'

const RatingScenarioDemo = () => {
    const [grade, setGrade] = useState(DEFAULT_GRADE)
    const data = toCriRatingData(grade, DEMO_DETAILS)
    const definition = CRI_GRADES.find((item) => item.grade === grade)?.definition

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2" role="group" aria-label="CRI 등급 선택">
                {CRI_GRADES.map((item) => (
                    <Button
                        key={item.grade}
                        type="button"
                        size="xs"
                        variant={grade === item.grade ? 'default' : 'outline'}
                        aria-pressed={grade === item.grade}
                        onClick={() => setGrade(item.grade)}
                    >
                        {item.grade}
                    </Button>
                ))}
            </div>
            <div className="grid items-center gap-6 md:grid-cols-2">
                <SemicircleRatingGauge
                    data={data}
                    title="기업신용등급"
                    ariaLabel={`기업신용등급 ${data.label}, ${data.description}`}
                    className="max-w-84"
                />
                <dl className="typo-body-l-regular flex flex-col gap-2">
                    <div className="flex gap-3">
                        <dt className="text-foreground-subtle w-20 shrink-0">채움 비율</dt>
                        <dd className="text-foreground tabular-nums">{data.percentage}%</dd>
                    </div>
                    <div className="flex gap-3">
                        <dt className="text-foreground-subtle w-20 shrink-0">등급정의</dt>
                        <dd className="text-foreground break-keep">{definition}</dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}

export {RatingScenarioDemo}
