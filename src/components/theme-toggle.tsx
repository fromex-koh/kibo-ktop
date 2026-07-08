'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

// 구독할 외부 변화가 없는 스토어 — 서버 스냅샷(false)과 클라 스냅샷(true)이 갈리는 것만 이용해
// "마운트 이후(클라)" 여부를 하이드레이션-세이프하게 읽는다. (setState-in-effect 안티패턴 회피)
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * 라이트/다크 수동 토글 버튼.
 * - next-themes 가 .dark 클래스 전환 + localStorage 저장 + 탭 간 동기화를 담당한다.
 * - resolvedTheme 은 서버에서 알 수 없으므로(FOUC 방지 스크립트가 클라에서 결정) 마운트 전엔
 *   렌더를 비워 하이드레이션 불일치를 피한다.
 * - 접근성: 아이콘 버튼(보이는 텍스트 없음) → `aria-label` 로 접근성 이름을 제공해 스크린리더가 기능을 낭독하고,
 *   아이콘은 `aria-hidden` 처리. `<button>`·키보드 기본 동작·focus-visible·44px 타깃. [KWCAG 5.1.1]
 */
const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isMounted) {
    return <div className="min-h-11 min-w-11" aria-hidden="true" />;
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // 아이콘만 보이므로 이 문구를 aria-label/title 로 제공 → 스크린리더가 버튼 기능을 낭독.
  // '전환 대상'을 가리켜 클릭 시 무엇이 되는지 명확히 한다.
  const label = resolvedTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="text-subtle hover:text-bolder focus-visible:ring-focus focus-visible:ring-offset-background inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {resolvedTheme === 'dark' ? (
        <Sun aria-hidden="true" className="size-icon-sm" />
      ) : (
        <Moon aria-hidden="true" className="size-icon-sm" />
      )}
    </button>
  );
};

export default ThemeToggle;
