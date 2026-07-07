'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

// 클릭하면 값(유틸리티 클래스명·토큰명 등)을 클립보드에 복사하는 모노 칩.
// 버튼이라 키보드(Enter/Space)로도 동작하고, 복사 성공은 아이콘 교체 + aria-live 로 알린다.
const COPIED_RESET_MS = 1500;

const CopyChip = ({ value }: { value: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 언마운트 시 남은 타이머 정리(복사 직후 이동하면 setState 경고 방지).
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsCopied(false), COPIED_RESET_MS);
    } catch {
      // 클립보드 API 미지원·권한 거부 시 조용히 무시(비보안 컨텍스트 등).
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={isCopied ? '복사됨' : `${value} 복사`}
      aria-label={`${value} 클래스 복사`}
      className="bg-gray-10 hover:bg-gray-30/40 text-brand-foreground focus-visible:ring-brand focus-visible:ring-offset-background typo-caption inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {value}
      {isCopied ? (
        <Check aria-hidden="true" className="text-success size-3.5 shrink-0" />
      ) : (
        <Copy aria-hidden="true" className="size-3.5 shrink-0 opacity-60" />
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {isCopied ? `${value} 복사됨` : ''}
      </span>
    </button>
  );
};

export default CopyChip;
