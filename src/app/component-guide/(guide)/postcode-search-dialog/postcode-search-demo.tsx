'use client'

// [퍼블리싱 가이드 전용] 우편번호 검색 데모 — 주소를 고르면 아래 입력칸이 채워지는 흐름까지 보인다.

import {useState} from 'react'
import {PostcodeSearchDialog, type PostcodeAddress} from '@/components/composite/postcode-search-dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

const PostcodeSearchDemo = () => {
    const [address, setAddress] = useState<PostcodeAddress | null>(null)

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label htmlFor="postcode-demo-zonecode">우편번호</Label>
                <div className="flex gap-2">
                    <Input id="postcode-demo-zonecode" readOnly value={address?.zonecode ?? ''} className="max-w-40" />
                    <PostcodeSearchDialog mockSearch title="주소 검색" onSelect={setAddress}>
                        <Button type="button" variant="tertiary" size="lg">
                            주소 검색
                        </Button>
                    </PostcodeSearchDialog>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="postcode-demo-road">도로명주소</Label>
                <Input id="postcode-demo-road" readOnly value={address?.roadAddress ?? ''} />
            </div>
        </div>
    )
}

export {PostcodeSearchDemo}
