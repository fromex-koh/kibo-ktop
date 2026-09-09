'use client'

import type {ReactNode} from 'react'
import {SearchSelectDialog} from '@/components/composite/search-select-dialog'
import {TECH_EVALUATION_CENTERS, TECH_EVALUATION_REGIONS} from '@/content/service/tech-evaluation-centers'

// 보증추천 모달이 여는 [지점 검색] — 공통 SearchSelectDialog 에 목록과 문구만 바꿔 넘긴다.
// 목록은 content/service/tech-evaluation-centers.ts 가 갖는다(연동 시 그 파일만 조회 API 로 바꾼다).
//
// 은행·영업점은 한 모달에서 함께 고른다 — composite/bank-branch-search-dialog.tsx 를 쓴다.

type SearchDialogProps = {
    /** 모달을 여는 버튼. */
    children?: ReactNode
    /** 트리거 없이 처음부터 열어 둘 때(모달 단독 화면). */
    defaultOpen?: boolean
    /** [선택 완료] 로 고른 값. label 은 입력칸에 넣을 표기다. */
    onSelect?: (value: {code: string; name: string; label: string}) => void
}

// 추천 영업점 — 지역본부를 고르고 기술평가센터를 찾는다.
const TechEvaluationCenterDialog = ({children, defaultOpen, onSelect}: SearchDialogProps) => (
    <SearchSelectDialog
        title="기술평가센터 검색"
        notices={['지역본부 선택 후 기술평가센터를 검색·선택하세요.']}
        steps={{search: '지역본부 및 기술평가센터 검색', list: '기술평가센터 목록'}}
        groupFilter={{label: '지역본부', allLabel: '전체 지역본부', options: TECH_EVALUATION_REGIONS}}
        groupSuffix=" 지역본부"
        keyword={{label: '기술평가센터명', placeholder: '기술평가센터명 입력'}}
        // 업종코드 조회의 업종명 열처럼 이름은 왼쪽에 붙인다.
        columns={{group: '지역본부', name: '기술평가센터', nameAlign: 'start'}}
        items={TECH_EVALUATION_CENTERS.map(({code, region, name}) => ({code, group: region, name}))}
        defaultOpen={defaultOpen}
        onSelect={onSelect}
    >
        {children}
    </SearchSelectDialog>
)

export {TechEvaluationCenterDialog}
export type {SearchDialogProps}
