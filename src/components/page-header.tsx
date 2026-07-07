import type { ComponentPropsWithoutRef } from 'react';

// 페이지·섹션 최상단의 제목+설명 묶음 — shadcn 의 CardHeader·CardTitle·CardDescription 과 같은
// 합성(compound) 컴포넌트 API 다. PageHeader 로 감싸고 안에 PageHeaderTitle·PageHeaderDescription
// 을 둔다. className 으로 자유롭게 확장한다([NA-007] 내부 수정 대신 className/props 로 확장).
const PageHeader = ({ className = '', ...props }: ComponentPropsWithoutRef<'header'>) => (
  <header className={`flex flex-col gap-2 ${className}`.trim()} {...props} />
);

const PageHeaderTitle = ({
  className = '',
  children,
  ...props
}: ComponentPropsWithoutRef<'h1'>) => (
  <h1 className={`typo-display-m-bold ${className}`.trim()} {...props}>
    {children}
  </h1>
);

const PageHeaderDescription = ({ className = '', ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p className={`typo-body-l-regular text-subtle ${className}`.trim()} {...props} />
);

export { PageHeader, PageHeaderTitle, PageHeaderDescription };
