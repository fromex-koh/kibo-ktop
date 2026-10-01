import type {NextRequest} from 'next/server'
import {SCREEN_OPEN_TARGET_PARAM} from '@/constants/screen-open'

// [원본 저장소 전용] 퍼블리싱 인덱스가 화면을 새 탭으로 열 때 거쳐 가는 주소.
// 서비스 화면은 이 주소를 쓰지 않으며, 프론트엔드 전달본(frontend-handoff)에는 포함되지 않는다 —
// scripts/build-frontend-handoff.mjs 가 이 파일을 지우고 인덱스의 링크를 화면 주소로 되돌린다.
//
// 왜 거쳐 가는가 — Safari 는 링크로 연 같은 사이트의 새 탭을 연 탭과 한 웹 프로세스에 둔다(rel="noopener" 여도 같다).
// 그러면 인덱스 탭이 뒤에 가려진 채 새 탭 · 그 탭이 연 새 창과 한 묶음이 된다. 그 묶음에서 window.print() 로
// 인쇄 대화상자가 뜨면 Safari 는 프로세스를 '응답 없음'으로 보고, 가려진 탭이 섞여 있다는 이유로 통째로 종료한다 —
// 인쇄하던 리포트 창과 그 창을 연 탭이 함께 빈 화면("무제")이 된다. 주소를 직접 쳐서 연 탭에서는 일어나지 않는다.
//
// 이 응답의 Cross-Origin-Opener-Policy 가 새 탭을 다른 프로세스에서 시작하게 만든다.
// 그 뒤로는 화면 주소로 넘겨 주기만 한다 — 주소창에는 화면 주소가 남는다.

const INVALID_TARGET_STATUS = 400
const REDIRECT_STATUS = 307

// 이 사이트 안의 경로만 넘긴다 — '//host' · '/\host' 처럼 다른 사이트로 읽히는 값은 받지 않는다.
const isInternalPath = (target: string): boolean => /^\/(?![/\\])/.test(target)

export const GET = (request: NextRequest) => {
    const target = request.nextUrl.searchParams.get(SCREEN_OPEN_TARGET_PARAM)
    if (!target || !isInternalPath(target)) return new Response(null, {status: INVALID_TARGET_STATUS})

    return new Response(null, {
        status: REDIRECT_STATUS,
        headers: {Location: target, 'Cross-Origin-Opener-Policy': 'same-origin'},
    })
}
