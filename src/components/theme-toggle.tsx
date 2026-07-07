'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { THEME_STORAGE_KEY, type Theme } from '@/constants/theme';

// <html> 클래스는 React 밖의 외부 상태 → useSyncExternalStore 로 읽는다.
// (초기 클래스는 layout.tsx 인라인 스크립트가 심어둠 = FOUC 방지)
const subscribe = (callback: () => void) => {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
};

const getSnapshot = (): Theme =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';

// SSR·초기 하이드레이션 값(서버는 DOM 접근 불가) → 라이트로 가정, 이후 자동 동기화
const getServerSnapshot = (): Theme => 'light';

/**
 * 라이트/다크 수동 토글 버튼.
 * - 클래스 기반(.dark) 전환 + localStorage 저장 → 새로고침·재방문에도 선택 유지.
 * - 접근성: 아이콘 버튼(보이는 텍스트 없음) → `aria-label` 로 접근성 이름을 제공해 스크린리더가 기능을 낭독하고,
 *   아이콘은 `aria-hidden` 처리. `<button>`·키보드 기본 동작·focus-visible·44px 타깃. [KWCAG 5.1.1]
 */
const ThemeToggle = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    // class 변경을 MutationObserver 가 감지 → 위 store 가 자동 반영(재렌더)
  };

  // 아이콘만 보이므로 이 문구를 aria-label/title 로 제공 → 스크린리더가 버튼 기능을 낭독.
  // '전환 대상'을 가리켜 클릭 시 무엇이 되는지 명확히 한다.
  const label = theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="text-subtle hover:text-bolder focus-visible:ring-brand focus-visible:ring-offset-background inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {theme === 'dark' ? (
        <Sun aria-hidden="true" className="size-icon-sm" />
      ) : (
        <Moon aria-hidden="true" className="size-icon-sm" />
      )}
    </button>
  );
};

export default ThemeToggle;
