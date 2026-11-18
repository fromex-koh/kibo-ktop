// 서비스 예시 그림 — 서비스 카드 호버 렌즈(PlatformServiceCards) 안에 비쳐 보이는 꾸밈 그림 4장(기술평가 · 특허평가 · K-BIGx · 탄소중립).
// 렌즈 면(platform-lens) 위 짙은 남색 카드 · 선 · 아이콘(platform-lens-art-*)과 서비스 강조색(--art-acc)으로 그린다 — 라이트 · 다크 토큰이 나뉜다.
// 카드 전체에 깔리고(가운데 기준으로 잘림 — slice) 위에 렌즈 면 62% 막이 덮여 흰 글자가 읽힌다. 꾸밈이라 읽지 않는다(aria-hidden).
// 좌표는 기획 시안 그림(588 × 380) 그대로다 — 그림을 바꿀 때는 좌표째 교체한다.

import type {PlatformServiceKind} from '@/content/service/platform-intro'
import {cn} from '@/lib/utils'

// 서비스 강조색 — 그림 안 선 · 면 · 점이 --art-acc 를 쓴다.
// 쓰는 곳: custom/platform-service-cards.tsx(호버 렌즈 안 서비스 그림).
const ART_ACCENT_CLASS: Record<PlatformServiceKind, string> = {
    tech: '[--art-acc:var(--color-platform-lens-art-tech)]',
    patent: '[--art-acc:var(--color-platform-lens-art-patent)]',
    bigx: '[--art-acc:var(--color-platform-lens-art-bigx)]',
    carbon: '[--art-acc:var(--color-platform-lens-art-carbon)]',
}

const TechArt = () => (
    <>
        <rect
            className="fill-platform-lens-art-card stroke-platform-lens-art-card-line"
            x="20.0"
            y="126.0"
            width="169.0"
            height="167.0"
            rx="10"
            strokeWidth="1"
        />
        <rect className="fill-platform-lens-art-line" x="41.0" y="165.0" width="87.0" height="11" rx="5.5" />
        <circle className="fill-platform-lens-art-icon" cx="52.5" cy="204.5" r="11.5" />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="2.0"
            d="M48.1 204.7l3.0 3.0 5.8-5.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect className="fill-platform-lens-art-line" x="74.0" y="191.0" width="89.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="74.0" y="207.0" width="57.0" height="11" rx="5.5" />
        <circle className="fill-platform-lens-art-icon" cx="52.5" cy="238.5" r="11.5" />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="2.0"
            d="M48.1 238.7l3.0 3.0 5.8-5.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect className="fill-platform-lens-art-line" x="74.0" y="225.0" width="89.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="74.0" y="241.0" width="57.0" height="11" rx="5.5" />
        <circle className="fill-platform-lens-art-icon" cx="52.5" cy="272.5" r="11.5" />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="2.0"
            d="M48.1 272.7l3.0 3.0 5.8-5.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect className="fill-platform-lens-art-line" x="74.0" y="259.0" width="89.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="74.0" y="275.0" width="57.0" height="11" rx="5.5" />
        <rect
            className="fill-platform-lens-art-card stroke-platform-lens-art-card-line"
            x="134.0"
            y="66.0"
            width="326.0"
            height="264.0"
            rx="12"
            strokeWidth="1"
        />
        <circle className="fill-platform-lens-art-icon" cx="178.6" cy="113" r="26" />
        <rect
            className="fill-none stroke-(--art-acc)"
            x="167"
            y="101.5"
            width="23"
            height="23"
            rx="3"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect
            className="fill-none stroke-(--art-acc)"
            x="173"
            y="107.5"
            width="11"
            height="11"
            rx="1.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="2"
            d="M172 98v3.5M178.6 98v3.5M185 98v3.5M172 124.5v3.5M178.6 124.5v3.5M185 124.5v3.5M163.5 107h3.5M163.5 113h3.5M163.5 119h3.5M190 107h3.5M190 113h3.5M190 119h3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect className="fill-platform-lens-art-line" x="219.0" y="95.0" width="134.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="219.0" y="115.0" width="94.0" height="11" rx="5.5" />
        <path className="stroke-platform-lens-art-card-line fill-none" d="M152.0 136.0H441.0" strokeWidth="1.2" />
        <polygon
            className="stroke-platform-lens-art-grid fill-none"
            points="297.4,156.0 360.2,201.6 336.2,275.4 258.6,275.4 234.6,201.6"
            strokeWidth="1"
        />
        <polygon
            className="stroke-platform-lens-art-grid fill-none"
            points="297.4,178.0 339.2,208.4 323.3,257.6 271.5,257.6 255.6,208.4"
            strokeWidth="1"
        />
        <polygon
            className="stroke-platform-lens-art-grid fill-none"
            points="297.4,200.0 318.3,215.2 310.3,239.8 284.5,239.8 276.5,215.2"
            strokeWidth="1"
        />
        <path className="stroke-platform-lens-art-grid fill-none" d="M297.4 222L297.4 156.0" strokeWidth="1" />
        <path className="stroke-platform-lens-art-grid fill-none" d="M297.4 222L360.2 201.6" strokeWidth="1" />
        <path className="stroke-platform-lens-art-grid fill-none" d="M297.4 222L336.2 275.4" strokeWidth="1" />
        <path className="stroke-platform-lens-art-grid fill-none" d="M297.4 222L258.6 275.4" strokeWidth="1" />
        <path className="stroke-platform-lens-art-grid fill-none" d="M297.4 222L234.6 201.6" strokeWidth="1" />
        <polygon
            className="fill-(--art-acc)/24 stroke-(--art-acc)"
            strokeWidth="2.4"
            points="297.4,164.0 348.8,205.3 324.4,259.2 268.0,262.5 247.9,205.9"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="297.4"
            cy="164.0"
            r="4.5"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="348.8"
            cy="205.3"
            r="4.5"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="324.4"
            cy="259.2"
            r="4.5"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="268.0"
            cy="262.5"
            r="4.5"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="247.9"
            cy="205.9"
            r="4.5"
            strokeWidth="1.5"
        />
        <rect className="fill-platform-lens-art-line" x="277.0" y="147.0" width="41.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="152.5" y="210.0" width="35.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="407.0" y="210.0" width="35.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="178.6" y="276.0" width="41.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="375.7" y="276.0" width="41.0" height="11" rx="5.5" />
        <rect
            className="fill-platform-lens-art-card stroke-platform-lens-art-card-line"
            x="342.0"
            y="196.0"
            width="186.0"
            height="167.0"
            rx="10"
            strokeWidth="1"
        />
        <path
            className="stroke-platform-lens-art-icon fill-none"
            strokeWidth="14"
            fill="none"
            d="M383 278A52 52 0 0 1 487 278"
        />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="14"
            strokeLinecap="butt"
            d="M383 278A52 52 0 0 1 472.9 242.4"
            strokeLinejoin="round"
        />
        <rect className="fill-platform-lens-art-line" x="420.0" y="266.0" width="30.0" height="8" rx="4.0" />
        <path className="stroke-platform-lens-art-card-line fill-none" d="M357.0 285.0H513.0" strokeWidth="1.2" />
        <rect className="fill-platform-lens-art-line" x="357.0" y="296.0" width="38.0" height="9" rx="4.5" />
        <rect className="fill-platform-lens-art-icon" x="406.0" y="296.0" width="108.0" height="9" rx="4.5" />
        <rect className="fill-(--art-acc)" x="406.0" y="296.0" width="85.0" height="9" rx="4.5" />
        <rect className="fill-platform-lens-art-line" x="357.0" y="309.0" width="38.0" height="9" rx="4.5" />
        <rect className="fill-platform-lens-art-icon" x="406.0" y="309.0" width="108.0" height="9" rx="4.5" />
        <rect className="fill-(--art-acc)" x="406.0" y="309.0" width="68.0" height="9" rx="4.5" />
        <rect className="fill-platform-lens-art-line" x="357.0" y="322.0" width="38.0" height="9" rx="4.5" />
        <rect className="fill-platform-lens-art-icon" x="406.0" y="322.0" width="108.0" height="9" rx="4.5" />
        <rect className="fill-(--art-acc)" x="406.0" y="322.0" width="93.0" height="9" rx="4.5" />
    </>
)

const PatentArt = () => (
    <>
        <rect
            className="fill-platform-lens-art-card stroke-platform-lens-art-card-line"
            x="87.0"
            y="31.0"
            width="233.0"
            height="318.0"
            rx="12"
            strokeWidth="1"
        />
        <rect className="fill-platform-lens-art-line" x="111.6" y="55.0" width="111.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="111.6" y="75.0" width="78.0" height="11" rx="5.5" />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="3"
            d="M186.4 162c0-9-14-14-14-31a31 31 0 0 1 62 0c0 17-14 22-14 31z"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="3"
            d="M188.4 170h30M191.4 178h24M196.4 186h14"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="3"
            d="M195.4 162l-3-14h22l-3 14M183.4 132a20 20 0 0 1 12-14"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="3"
            d="M203.4 88v-10M169.4 102l-7-7M237.4 102l7-7M159.4 134h-10M247.4 134h10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect className="fill-platform-lens-art-line" x="111.6" y="212.7" width="155.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="111.6" y="251.9" width="155.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="111.6" y="291.0" width="111.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="111.6" y="322.0" width="89.0" height="11" rx="5.5" />
        <circle
            className="fill-none stroke-(--art-acc)"
            cx="288"
            cy="312"
            r="8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="2.2"
            d="M283 319l-4 12 6-3 3 5 2-9M293 319l4 12-6-3-3 5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect
            className="fill-platform-lens-art-card stroke-platform-lens-art-card-line"
            x="320.3"
            y="62.0"
            width="175.0"
            height="82.0"
            rx="10"
            strokeWidth="1"
        />
        <circle className="fill-platform-lens-art-icon" cx="359.0" cy="104.0" r="21.0" />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="3.0"
            d="M351.0 104.4l5.5 5.5 10.5-10.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect className="fill-platform-lens-art-line" x="391.0" y="80.0" width="62.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="391.0" y="100.0" width="46.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="391.0" y="120.0" width="55.0" height="11" rx="5.5" />
        <rect
            className="fill-platform-lens-art-card stroke-platform-lens-art-card-line"
            x="297.0"
            y="178.6"
            width="250.0"
            height="155.0"
            rx="10"
            strokeWidth="1"
        />
        <rect className="fill-platform-lens-art-line" x="315.5" y="197.0" width="111.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="315.5" y="217.0" width="64.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-icon" x="336" y="239" width="26" height="73" rx="3" />
        <rect className="fill-(--art-acc)" opacity={0.55} x="336" y="292" width="26" height="20" rx="3" />
        <rect className="fill-platform-lens-art-line" x="340.0" y="320.0" width="18.0" height="4" rx="2.0" />
        <rect className="fill-platform-lens-art-icon" x="372" y="239" width="26" height="73" rx="3" />
        <rect className="fill-(--art-acc)" opacity={0.66} x="372" y="283" width="26" height="29" rx="3" />
        <rect className="fill-platform-lens-art-line" x="376.0" y="320.0" width="18.0" height="4" rx="2.0" />
        <rect className="fill-platform-lens-art-icon" x="408" y="239" width="26" height="73" rx="3" />
        <rect className="fill-(--art-acc)" opacity={0.77} x="408" y="275" width="26" height="37" rx="3" />
        <rect className="fill-platform-lens-art-line" x="412.0" y="320.0" width="18.0" height="4" rx="2.0" />
        <rect className="fill-platform-lens-art-icon" x="444" y="239" width="26" height="73" rx="3" />
        <rect className="fill-(--art-acc)" opacity={0.88} x="444" y="266" width="26" height="46" rx="3" />
        <rect className="fill-platform-lens-art-line" x="448.0" y="320.0" width="18.0" height="4" rx="2.0" />
        <rect className="fill-platform-lens-art-icon" x="480" y="239" width="26" height="73" rx="3" />
        <rect className="fill-(--art-acc)" opacity={0.99} x="480" y="258" width="26" height="54" rx="3" />
        <rect className="fill-platform-lens-art-line" x="484.0" y="320.0" width="18.0" height="4" rx="2.0" />
        <circle
            className="fill-(--art-acc)/10 stroke-(--art-acc)"
            cx="92"
            cy="252"
            r="40"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="9"
            d="M122 282l32 44"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="3"
            d="M66 250a26 26 0 0 1 20-24"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </>
)

const BigxArt = () => (
    <>
        <rect
            className="fill-platform-lens-art-card stroke-platform-lens-art-card-line"
            x="13.0"
            y="186.0"
            width="157.0"
            height="167.0"
            rx="10"
            strokeWidth="1"
        />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="2.4"
            d="M66 270V224h28V210h22v60M116 270V234h16v36M58 270h82"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="2.4"
            d="M74 234h4M82 234h4M74 244h4M82 244h4M100 220h4M100 230h4M100 240h4M122 244h4M122 254h4M100 270v-12h6v12"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect className="fill-platform-lens-art-line" x="34.4" y="294.0" width="83.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="34.4" y="314.0" width="83.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="34.4" y="334.0" width="58.0" height="11" rx="5.5" />
        <rect
            className="fill-platform-lens-art-card stroke-platform-lens-art-card-line"
            x="134.0"
            y="81.5"
            width="326.0"
            height="248.5"
            rx="12"
            strokeWidth="1"
        />
        <rect className="fill-platform-lens-art-line" x="152.4" y="100.0" width="61.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="357" y="100" width="15" height="11" rx="5.5" />
        <circle className="fill-platform-lens-art-line" cx="386" cy="105.5" r="5" />
        <path className="stroke-platform-lens-art-card-line fill-none" d="M152.4 130.0H441.6" strokeWidth="1.2" />
        <path className="stroke-platform-lens-art-card-line fill-none" d="M197.7 131.5V225.6H398.7" strokeWidth="1.2" />
        <path
            className="stroke-platform-lens-art-grid fill-none"
            d="M197.7 150.3H398.7"
            strokeWidth="1"
            strokeDasharray="4 4"
        />
        <path
            className="stroke-platform-lens-art-grid fill-none"
            d="M197.7 173H398.7"
            strokeWidth="1"
            strokeDasharray="4 4"
        />
        <path
            className="stroke-platform-lens-art-grid fill-none"
            d="M197.7 195.8H398.7"
            strokeWidth="1"
            strokeDasharray="4 4"
        />
        <path
            className="stroke-platform-lens-art-grid fill-none"
            d="M197.7 218.5H398.7"
            strokeWidth="1"
            strokeDasharray="4 4"
        />
        <rect className="fill-(--art-acc)" opacity={0.55} x="201.4" y="209.6" width="25" height="16" rx="2" />
        <rect className="fill-(--art-acc)" opacity={0.66} x="242.5" y="198.6" width="25" height="27" rx="2" />
        <rect className="fill-(--art-acc)" opacity={0.77} x="283.6" y="187.6" width="25" height="38" rx="2" />
        <rect className="fill-(--art-acc)" opacity={0.88} x="324.6" y="173.6" width="25" height="52" rx="2" />
        <rect className="fill-(--art-acc)" opacity={0.99} x="365.7" y="159.6" width="25" height="66" rx="2" />
        <path
            className="stroke-platform-lens-art-highlight fill-none"
            strokeWidth="2.4"
            d="M212.4 193.4L253.5 181.8L294.5 169.4L335.6 157.8L376.7 142.8L388 138"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path className="fill-platform-lens-art-highlight" d="M392 133l-2 13-9-8z" />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="212.4"
            cy="193.4"
            r="4"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="253.5"
            cy="181.8"
            r="4"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="294.5"
            cy="169.4"
            r="4"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="335.6"
            cy="157.8"
            r="4"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="376.7"
            cy="142.8"
            r="4"
            strokeWidth="1.5"
        />
        <rect className="fill-platform-lens-art-icon" x="152.4" y="249" width="90.8" height="47" rx="8" />
        <rect className="fill-(--art-acc)" x="186.4" y="274" width="5.5" height="10" rx="1.5" />
        <rect className="fill-(--art-acc)" x="195.4" y="267" width="5.5" height="17" rx="1.5" />
        <rect className="fill-(--art-acc)" x="204.4" y="260" width="5.5" height="24" rx="1.5" />
        <rect className="fill-platform-lens-art-icon" x="252" y="249" width="90.8" height="47" rx="8" />
        <rect className="fill-(--art-acc)" x="286.0" y="274" width="5.5" height="10" rx="1.5" />
        <rect className="fill-(--art-acc)" x="295.0" y="267" width="5.5" height="17" rx="1.5" />
        <rect className="fill-(--art-acc)" x="304.0" y="260" width="5.5" height="24" rx="1.5" />
        <rect className="fill-platform-lens-art-icon" x="351.5" y="249" width="90.8" height="47" rx="8" />
        <rect className="fill-(--art-acc)" x="385.5" y="274" width="5.5" height="10" rx="1.5" />
        <rect className="fill-(--art-acc)" x="394.5" y="267" width="5.5" height="17" rx="1.5" />
        <rect className="fill-(--art-acc)" x="403.5" y="260" width="5.5" height="24" rx="1.5" />
        <circle
            className="fill-platform-lens-art-card stroke-platform-lens-art-card-line"
            cx="477.6"
            cy="71.8"
            r="40.8"
            strokeWidth="1"
        />
        <path
            className="stroke-platform-lens-art-highlight fill-none"
            strokeWidth="2.6"
            d="M459 84l11-12 9 7 16-18"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="459"
            cy="84"
            r="3.6"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="470"
            cy="72"
            r="3.6"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="479"
            cy="79"
            r="3.6"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="495"
            cy="61"
            r="3.6"
            strokeWidth="1.5"
        />
        <rect
            className="fill-platform-lens-art-card stroke-platform-lens-art-card-line"
            x="367.0"
            y="221.0"
            width="192.0"
            height="140.0"
            rx="10"
            strokeWidth="1"
        />
        <rect className="fill-platform-lens-art-line" x="382.5" y="237.0" width="77.6" height="11" rx="5.5" />
        <path className="stroke-platform-lens-art-card-line fill-none" d="M382.5 256.0H543.0" strokeWidth="1.2" />
        <circle
            className="stroke-platform-lens-art-icon fill-none"
            cx="423"
            cy="300"
            r="30"
            strokeWidth="16"
            fill="none"
        />
        <circle
            className="fill-none stroke-(--art-acc)"
            cx="423"
            cy="300"
            r="30"
            strokeWidth="16"
            strokeLinecap="butt"
            strokeDasharray="141 189"
            transform="rotate(-90 423 300)"
            strokeLinejoin="round"
        />
        <circle className="fill-(--art-acc)" cx="472" cy="284" r="4" />
        <rect className="fill-platform-lens-art-line" x="481.0" y="281.0" width="22.0" height="6" rx="3.0" />
        <circle className="fill-(--art-acc)" cx="472" cy="300" r="4" />
        <rect className="fill-platform-lens-art-line" x="481.0" y="297.0" width="22.0" height="6" rx="3.0" />
        <circle className="fill-(--art-acc)" cx="472" cy="316" r="4" />
        <rect className="fill-platform-lens-art-line" x="481.0" y="313.0" width="22.0" height="6" rx="3.0" />
    </>
)

const CarbonArt = () => (
    <>
        <rect
            className="fill-platform-lens-art-card stroke-platform-lens-art-card-line"
            x="17.0"
            y="112.0"
            width="192.0"
            height="147.5"
            rx="10"
            strokeWidth="1"
        />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="2.6"
            d="M41 194V166l20 -12v12l20 -12v12l20 -12V136h10v58M37 194h80"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect
            className="fill-none stroke-(--art-acc)"
            x="51"
            y="174"
            width="8"
            height="8"
            rx="1.5"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect
            className="fill-none stroke-(--art-acc)"
            x="67"
            y="174"
            width="8"
            height="8"
            rx="1.5"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect
            className="fill-none stroke-(--art-acc)"
            x="83"
            y="174"
            width="8"
            height="8"
            rx="1.5"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="2.4"
            d="M117 166c0-14 8-22 22-24 1 14-7 22-22 24zM117 166l12-12"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect className="fill-platform-lens-art-line" x="41.3" y="211.5" width="98.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="41.3" y="231.5" width="62.0" height="11" rx="5.5" />
        <rect
            className="fill-platform-lens-art-card stroke-platform-lens-art-card-line"
            x="151.4"
            y="77.6"
            width="320.0"
            height="248.5"
            rx="12"
            strokeWidth="1"
        />
        <rect className="fill-platform-lens-art-line" x="175.7" y="105.3" width="120.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="175.7" y="125.3" width="89.0" height="11" rx="5.5" />
        <circle className="fill-platform-lens-art-icon" cx="426.3" cy="120.8" r="21.8" />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="3.1"
            d="M418.0 121.2l5.7 5.7 10.9-10.9"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect className="fill-(--art-acc)" opacity={1.0} x="209.2" y="181.5" width="32.4" height="62.4" rx="2" />
        <rect className="fill-(--art-acc)" opacity={0.87} x="253.1" y="195.7" width="32.4" height="48.2" rx="2" />
        <rect className="fill-(--art-acc)" opacity={0.74} x="297" y="207.7" width="32.4" height="36.2" rx="2" />
        <rect className="fill-(--art-acc)" opacity={0.61} x="340.9" y="218.4" width="32.4" height="25.5" rx="2" />
        <rect className="fill-(--art-acc)" opacity={0.48} x="384.8" y="226.9" width="32.4" height="17" rx="2" />
        <path
            className="stroke-platform-lens-art-highlight fill-none"
            strokeWidth="2.2"
            d="M224.1 162.4L268 174.9L311.9 186.8L355.8 197.2L399.7 206.1"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="224.1"
            cy="162.4"
            r="4"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="268"
            cy="174.9"
            r="4"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="311.9"
            cy="186.8"
            r="4"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="355.8"
            cy="197.2"
            r="4"
            strokeWidth="1.5"
        />
        <circle
            className="fill-platform-lens-art-highlight stroke-(--art-acc)"
            cx="399.7"
            cy="206.1"
            r="4"
            strokeWidth="1.5"
        />
        <path className="stroke-platform-lens-art-card-line fill-none" d="M175.7 256.0H448.0" strokeWidth="1.2" />
        <rect className="fill-(--art-acc)/45" x="175.7" y="266.0" width="74.0" height="10" rx="5.0" />
        <rect className="fill-platform-lens-art-line" x="175.7" y="284.0" width="55.0" height="7" rx="3.5" />
        <rect className="fill-(--art-acc)/45" x="266.5" y="266.0" width="74.0" height="10" rx="5.0" />
        <rect className="fill-platform-lens-art-line" x="266.5" y="284.0" width="55.0" height="7" rx="3.5" />
        <rect className="fill-(--art-acc)/45" x="357.3" y="266.0" width="74.0" height="10" rx="5.0" />
        <rect className="fill-platform-lens-art-line" x="357.3" y="284.0" width="55.0" height="7" rx="3.5" />
        <path
            className="stroke-platform-lens-art-card-line fill-none"
            d="M266.5 260v36M357.3 260v36"
            strokeWidth="1.2"
        />
        <rect
            className="fill-platform-lens-art-card stroke-platform-lens-art-card-line"
            x="411.0"
            y="155.0"
            width="157.0"
            height="159.0"
            rx="10"
            strokeWidth="1"
        />
        <circle
            className="stroke-platform-lens-art-icon fill-none"
            cx="489"
            cy="212"
            r="30"
            strokeWidth="10"
            fill="none"
        />
        <circle
            className="fill-none stroke-(--art-acc)"
            cx="489"
            cy="212"
            r="30"
            strokeWidth="10"
            strokeLinecap="butt"
            strokeDasharray="132 189"
            transform="rotate(-90 489 212)"
            strokeLinejoin="round"
        />
        <path
            className="fill-none stroke-(--art-acc)"
            strokeWidth="2.2"
            d="M480 236c0-18 10-28 30-30 1 18-9 28-30 30zM480 236l15-15"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <rect className="fill-platform-lens-art-line" x="429.5" y="264.5" width="99.0" height="11" rx="5.5" />
        <rect className="fill-platform-lens-art-line" x="429.5" y="284.5" width="58.0" height="11" rx="5.5" />
    </>
)

const ART_BY_SERVICE = {tech: TechArt, patent: PatentArt, bigx: BigxArt, carbon: CarbonArt} as const

const PlatformServiceArt = ({service, className}: {service: PlatformServiceKind; className?: string}) => {
    const Art = ART_BY_SERVICE[service]
    return (
        <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 588 380"
            preserveAspectRatio="xMidYMid slice"
            className={cn(ART_ACCENT_CLASS[service], className)}
        >
            <Art />
        </svg>
    )
}

export {PlatformServiceArt}
