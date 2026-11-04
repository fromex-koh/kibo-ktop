'use client'

// [퍼블리싱 가이드 전용] 선택 목록 카드 데모 — 눌러서 고른 모습을 확인한다.

import {useState} from 'react'
import {SelectableListCard, SelectableListCardGroup} from '@/components/composite/selectable-list-card'
import {Badge} from '@/components/ui/badge'

const SelectableListCardDemo = () => {
    const [company, setCompany] = useState('c-1')
    const [patent, setPatent] = useState('')

    return (
        <div className="flex flex-col gap-6">
            <SelectableListCardGroup value={company} onValueChange={setCompany} aria-label="기업 목록 예시">
                <SelectableListCard
                    value="c-1"
                    title="프롬엑스테크"
                    fieldRows={[
                        [
                            {label: '대표자명', value: '김*수'},
                            {label: '법인번호', value: '110111-*******'},
                        ],
                    ]}
                    trailing={
                        <>
                            특허 <span className="typo-body-xl-bold text-label-foreground">128</span>건
                        </>
                    }
                    hasChevron
                />
                <SelectableListCard
                    value="c-2"
                    title="한국미래기술"
                    badge={
                        <Badge variant="solid-pastel" color="secondary-purple" size="xs">
                            자사
                        </Badge>
                    }
                    fieldRows={[
                        [
                            {label: '대표자명', value: '조*비'},
                            {label: '법인번호', value: '110111-*******'},
                        ],
                    ]}
                    trailing={
                        <>
                            특허 <span className="typo-body-xl-bold text-label-foreground">0</span>건
                        </>
                    }
                    hasChevron
                />
                <SelectableListCard
                    value="c-3"
                    title="고를 수 없는 기업"
                    fieldRows={[
                        [
                            {label: '대표자명', value: '홍*민'},
                            {label: '사업자번호', value: '214-07-3****'},
                        ],
                    ]}
                    disabled
                />
                <SelectableListCard
                    value="c-4"
                    title="주식회사글로벌인공지능에너지솔루션테크놀로지스인터내셔널코리아홀딩스그룹유한회사연구개발센터"
                    badge={
                        <Badge variant="solid-pastel" color="secondary-purple" size="xs">
                            자사
                        </Badge>
                    }
                    fieldRows={[
                        [
                            {label: '대표자명', value: '알*산더크리스토퍼존슨 외 2명'},
                            {label: '법인번호', value: '110111-*******-110111-*******-110111-*******'},
                        ],
                    ]}
                    trailing={
                        <>
                            특허 <span className="typo-body-xl-bold text-label-foreground">1,234,567</span>건
                        </>
                    }
                    hasChevron
                />
            </SelectableListCardGroup>
            <SelectableListCardGroup value={patent} onValueChange={setPatent} aria-label="특허 목록 예시">
                <SelectableListCard
                    value="p-2"
                    title="인공지능 기반 분산형 에너지 자원의 통합 관리 플랫폼을 이용한 실시간 산업 데이터 분석 및 설비 고장 예측과 탄소 배출량 저감을 위한 최적 제어 시스템과 그 방법 및 이를 기록한 컴퓨터 판독 가능한 기록 매체"
                    fieldRows={[
                        // 보유 기업은 특허출원일자 오른쪽 — 좁으면 아래 줄로 내려간다.
                        [
                            {label: '출원번호', value: '10-2022-0077777'},
                            {label: '특허출원일자', value: '2022-06-15'},
                            {
                                label: '보유 기업',
                                value: '주식회사글로벌인공지능에너지솔루션테크놀로지스인터내셔널코리아홀딩스그룹유한회사',
                            },
                        ],
                    ]}
                />
                <SelectableListCard
                    value="p-1"
                    title="에너지 최적화 예측 플랫폼"
                    fieldRows={[
                        [
                            {label: '출원번호', value: '10-2022-0077777'},
                            {label: '특허출원일자', value: '2022-06-15'},
                            {label: '보유 기업', value: '프롬엑스테크'},
                        ],
                    ]}
                />
            </SelectableListCardGroup>
        </div>
    )
}

export {SelectableListCardDemo}
