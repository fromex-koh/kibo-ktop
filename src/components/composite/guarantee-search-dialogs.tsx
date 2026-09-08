'use client'

import type {ReactNode} from 'react'
import {SearchSelectDialog} from '@/components/composite/search-select-dialog'
import {
    BANKS,
    BANK_BRANCHES,
    BANK_BRANCH_BANKS,
    TECH_EVALUATION_CENTERS,
    TECH_EVALUATION_REGIONS,
} from '@/content/service/tech-evaluation-centers'

// 보증추천 모달이 여는 세 검색 — 고르는 방식이 같아 공통 SearchSelectDialog 에 목록과 문구만 바꿔 넘긴다.
// 목록은 content/service/tech-evaluation-centers.ts 가 갖는다(연동 시 그 파일만 조회 API 로 바꾼다).

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

// 은행 — 묶음이 없어 이름 한 칸만 나온다.
const BankSearchDialog = ({children, defaultOpen, onSelect}: SearchDialogProps) => (
    <SearchSelectDialog
        title="은행 검색"
        steps={{search: '은행 검색', list: '은행 목록'}}
        keyword={{label: '은행명', placeholder: '은행명 입력'}}
        // 다른 검색 모달과 같이 이름은 왼쪽에 붙인다.
        columns={{name: '은행명', nameAlign: 'start'}}
        items={BANKS}
        defaultOpen={defaultOpen}
        onSelect={onSelect}
    >
        {children}
    </SearchSelectDialog>
)

// 영업점 — 은행을 고르고 영업점을 찾는다.
const BankBranchSearchDialog = ({children, defaultOpen, onSelect}: SearchDialogProps) => (
    <SearchSelectDialog
        title="영업점 검색"
        steps={{search: '은행 및 영업점 검색', list: '영업점 목록'}}
        groupFilter={{label: '은행', allLabel: '전체 은행', options: BANK_BRANCH_BANKS}}
        keyword={{label: '영업점명', placeholder: '영업점명 입력'}}
        // 업종코드 조회의 업종명 열처럼 이름은 왼쪽에 붙인다.
        columns={{group: '은행', name: '영업점명', nameAlign: 'start'}}
        items={BANK_BRANCHES.map(({code, region, name}) => ({code, group: region, name}))}
        defaultOpen={defaultOpen}
        onSelect={onSelect}
    >
        {children}
    </SearchSelectDialog>
)

export {BankBranchSearchDialog, BankSearchDialog, TechEvaluationCenterDialog}
export type {SearchDialogProps}
