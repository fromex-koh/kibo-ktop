'use client'

// [퍼블리싱 가이드 전용] 검색 선택 모달 데모 — 고른 값이 아래 입력칸에 채워지는 흐름까지 보인다.

import {useState} from 'react'
import {SearchSelectDialog} from '@/components/composite/search-select-dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {TECH_EVALUATION_CENTERS, TECH_EVALUATION_REGIONS} from '@/content/service/tech-evaluation-centers'

const SearchSelectDemo = () => {
    const [label, setLabel] = useState('')

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="search-select-demo-center">추천 영업점</Label>
            <div className="flex gap-2">
                <Input id="search-select-demo-center" readOnly value={label} placeholder="지점 검색으로 선택" />
                <SearchSelectDialog
                    title="기술평가센터 검색"
                    notices={['지역본부 선택 후 기술평가센터를 검색·선택하세요.']}
                    steps={{search: '지역본부 및 기술평가센터 검색', list: '기술평가센터 목록'}}
                    groupFilter={{label: '지역본부', allLabel: '전체 지역본부', options: TECH_EVALUATION_REGIONS}}
                    groupSuffix=" 지역본부"
                    keyword={{label: '기술평가센터명', placeholder: '기술평가센터명 입력'}}
                    columns={{group: '지역본부', name: '기술평가센터', nameAlign: 'start'}}
                    items={TECH_EVALUATION_CENTERS.map(({code, region, name}) => ({code, group: region, name}))}
                    onSelect={(value) => setLabel(value.label)}
                >
                    <Button type="button" variant="tertiary" size="lg" className="shrink-0">
                        지점 검색
                    </Button>
                </SearchSelectDialog>
            </div>
        </div>
    )
}

export {SearchSelectDemo}
