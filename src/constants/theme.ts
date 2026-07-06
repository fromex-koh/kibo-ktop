// 테마 관련 공용 상수/타입 — layout.tsx(FOUC 스크립트)와 theme-toggle.tsx 가 공유한다.
// localStorage 키는 두 곳의 암묵적 계약이므로 여기서 단일 정의한다. [MD-010]

export const THEME_STORAGE_KEY = 'theme';

export type Theme = 'light' | 'dark';
