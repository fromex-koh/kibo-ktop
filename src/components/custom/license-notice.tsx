// 외부 라이브러리 라이선스 안내 — 컴포넌트 가이드에서 차트 라이브러리의 MIT 고지와 원문 링크를 보여 준다.
// 사용처: component-guide/network-graph · component-guide/word-cloud
type LicenseLink = {name: string; href: string}

const LicenseNotice = ({libraries}: {libraries: LicenseLink[]}) => (
    <div className="bg-muted border-border typo-body-m-regular text-foreground-subtle rounded-lg border p-4">
        <p>
            <strong className="text-foreground">라이선스: MIT · 상업적 사용 가능</strong>
            <br />
            상업 서비스에서 사용·수정·배포할 수 있습니다. 라이브러리 사본 또는 주요 부분을 배포할 때는 원문의 저작권 및
            라이선스 고지를 함께 유지해야 합니다.
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {libraries.map((library) => (
                <li key={library.name}>
                    <a
                        href={library.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline underline-offset-4"
                    >
                        {library.name} 공식 LICENSE
                    </a>
                </li>
            ))}
        </ul>
    </div>
)

export {LicenseNotice}
export type {LicenseLink}
