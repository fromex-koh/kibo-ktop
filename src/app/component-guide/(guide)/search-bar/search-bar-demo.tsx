'use client'

import {useState} from 'react'
import {SearchBar} from '@/components/composite/search-bar'

// 사용 예시 — 검색 버튼을 누르거나 입력창에서 Enter 를 치면 아래에 결과가 표시된다.
export const SearchBarUsageDemo = () => {
    const [result, setResult] = useState<string | null>(null)
    return (
        <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                setResult(String(formData.get('keyword') ?? ''))
            }}
        >
            <SearchBar name="keyword" label="사업자번호 검색" placeholder="사업자번호 또는 법인등록번호를 입력하세요" />
            {result !== null ? (
                <p className="typo-body-l-regular text-muted-foreground">
                    검색어: <span className="text-foreground font-medium">{result || '(빈 값)'}</span>
                </p>
            ) : null}
        </form>
    )
}
