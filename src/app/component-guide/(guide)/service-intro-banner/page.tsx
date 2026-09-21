import type {Metadata} from 'next'
import Image from 'next/image'
import {BaseCard} from '@/components/composite/base-card'
import {ServiceIntroBanner} from '@/components/composite/service-intro-banner'
import CodeBlock from '@/components/custom/code-block'
import GuidePageShell from '@/components/custom/guide-page-shell'
import PropsTable from '@/components/custom/props-table'

export const metadata: Metadata = {title: '서비스 소개 띠 (ServiceIntroBanner)'}

const USAGE_CODE = `<ServiceIntroBanner
  eyebrow="KPAS (KIBO PATENT APPRAISAL SYSTEM)"
  title="특허등급, 이제 쉽고 편리하게 확인하세요!"
  descriptions={[
    '온라인 특허평가시스템(K-PAS)은 쉽고 빠른 특허평가 서비스를 제공합니다.',
    '특허출원번호 또는 특허등록번호를 입력 후 찾고자 하는 특허결과를 검색합니다.',
  ]}
  illustration={
    <Image src="/images/service-intro/robot-donut-chart.webp" alt="" width={1338} height={726} sizes="440px" className="h-auto w-full" />
  }
/>`

const PROPS_ITEMS = [
    ['ServiceIntroBanner', 'eyebrow', '제목 위 한 줄입니다. 서비스 약칭처럼 짧은 말에 씁니다.', '-', 'string'],
    ['ServiceIntroBanner', 'title', '소개 제목입니다.', '-', 'string'],
    [
        'ServiceIntroBanner',
        'descriptions',
        '설명입니다. 줄마다 한 항목으로 주면 시안처럼 줄이 나뉩니다.',
        '-',
        'readonly string[]',
    ],
    [
        'ServiceIntroBanner',
        'illustration',
        '오른쪽 그림입니다. 폭 440 안에서 제 비율대로 줄어듭니다. next/image 에 width·height 를 주어 넘깁니다.',
        '-',
        'ReactNode',
    ],
    [
        'ServiceIntroBanner',
        'action',
        '설명 아래 동작입니다(예: [자세히보기] 글자 버튼). 설명과 24 떨어집니다.',
        '-',
        'ReactNode',
    ],
    [
        'ServiceIntroBanner',
        'headingLevel',
        '제목의 문서 단계입니다. 화면 제목(h1) 아래에 놓이므로 기본은 2입니다.',
        '2',
        '2 | 3',
    ],
    ['ServiceIntroBanner', 'className', '바깥 영역 스타일을 확장합니다.', '-', 'string'],
] as const

const ServiceIntroBannerGuidePage = () => (
    <GuidePageShell
        title="서비스 소개 띠 (ServiceIntroBanner)"
        description="화면 제목 아래에서 그 서비스가 무엇인지 한눈에 알려 주는 영역입니다. 왼쪽에 분류어·제목·설명, 오른쪽에 일러스트가 옵니다."
    >
        <BaseCard>
            <section aria-labelledby="sib-usage" className="flex flex-col gap-4">
                <div>
                    <h2 id="sib-usage" className="typo-h4-bold">
                        사용 예시
                    </h2>
                    <p className="typo-body-l-regular text-muted-foreground">
                        바탕은 따로 칠하지 않고 화면 배경 위에 글과 그림만 놓입니다. 좁은 화면(768 미만)에서는 그림이 글
                        아래로 내려갑니다. 그림은 꾸밈이라 보조기기에는 읽히지 않습니다.
                    </p>
                </div>
                <ServiceIntroBanner
                    eyebrow="KPAS (KIBO PATENT APPRAISAL SYSTEM)"
                    title="특허등급, 이제 쉽고 편리하게 확인하세요!"
                    descriptions={[
                        '온라인 특허평가시스템(K-PAS)은 쉽고 빠른 특허평가 서비스를 제공합니다.',
                        '특허출원번호 또는 특허등록번호를 입력 후 찾고자 하는 특허결과를 검색합니다.',
                    ]}
                    illustration={
                        <Image
                            src="/images/service-intro/robot-donut-chart.webp"
                            alt=""
                            loading="eager"
                            width={1338}
                            height={726}
                            sizes="440px"
                            className="h-auto w-full"
                        />
                    }
                />
                <CodeBlock code={USAGE_CODE} language="tsx" copyLabel="복사" />
            </section>
        </BaseCard>

        <BaseCard>
            <section aria-labelledby="sib-props" className="flex flex-col gap-4">
                <h2 id="sib-props" className="typo-h4-bold">
                    Props
                </h2>
                <PropsTable items={PROPS_ITEMS} caption="ServiceIntroBanner 컴포넌트 Props 목록" />
            </section>
        </BaseCard>
    </GuidePageShell>
)

export default ServiceIntroBannerGuidePage
