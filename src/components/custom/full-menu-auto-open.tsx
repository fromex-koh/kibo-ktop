'use client'

import {useEffect} from 'react'

// 전체메뉴 화면 전용 조각 — 화면정의서의 '전체메뉴'는 별도 화면이 아니라 홈 위에 덮이는 오버레이라,
// 홈 화면을 그대로 두고 헤더의 전체 메뉴만 열어 둔다.
//
// Header 는 여닫는 상태를 스스로 들고 있고 밖에서 초깃값을 넣을 창구가 없다. 그렇다고 이 한 화면 때문에
// Header·PageLayout·MainPageScreen 에 prop 을 뚫으면, 전체메뉴 화면과 무관한 화면들이 모두 그 변경을
// 함께 받는다. 그래서 화면 쪽에서 메뉴 버튼을 한 번 눌러 주는 방식으로 둔다.
//
// 처음 그림에는 닫힌 헤더가 잠깐 보이고 하이드레이션 뒤 메뉴가 열린다. 연 뒤로는 손대지 않으므로
// 닫으면 그대로 닫히고, 그 아래 홈이 드러난다.
const FullMenuAutoOpen = () => {
    useEffect(() => {
        const trigger = document.querySelector<HTMLButtonElement>('[data-header-menu-trigger]')
        // 이미 열려 있으면(되돌아온 경우 등) 다시 누르지 않는다 — 누르면 닫힌다.
        if (trigger?.getAttribute('aria-expanded') === 'true') return

        trigger?.click()
    }, [])

    return null
}

export default FullMenuAutoOpen
