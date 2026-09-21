import {useSyncExternalStore} from 'react'

// 브라우저에서 화면이 붙었는지(하이드레이션이 끝났는지) 알려 준다 — 서버 렌더와 하이드레이션 중에는 false, 그 뒤에는 true.
// 차트(recharts)처럼 브라우저에서 칸의 폭을 잰 뒤에야 그려지는 요소가, 새로고침 직후 빈 칸으로 보이지 않도록
// 그 전까지 스켈레톤을 보이는 데 쓴다. 바뀌는 값이 없어 구독은 아무것도 하지 않는다.
const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

const useIsHydrated = () => useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)

export {useIsHydrated}
