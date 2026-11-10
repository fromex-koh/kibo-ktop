import {
    Building2,
    CircleX,
    ClipboardCheck,
    ClipboardList,
    FileCheckCorner,
    FileDigit,
    FilePenLine,
    FileSearchCorner,
    FolderOpen,
    ShieldCheck,
    type LucideIcon,
} from 'lucide-react'
import type {EvaluationResultActionType} from '@/constants/evaluation-result'

// 평가 카드 버튼 종류(type)별 아이콘 · 주요/보조 · 자리. 글자는 constants/evaluation-result.ts.
//   · 주요(variant 'default')는 오른쪽 끝, 보조(secondary)는 왼쪽 — 은행 전송만 보조이면서 오른쪽.
//   · 아이콘은 시안의 icon-line 이름과 같은 lucide 글리프.
// 읽는 곳: EvaluationCardActions(evaluation-card.tsx) · 컴포넌트 가이드 evaluation-card 의 버튼 종류 표.
// 'use client' 파일에 두지 않는다 — 서버에서 그리는 가이드 화면이 값을 못 읽는다.
// [프론트엔드 연동] 종류를 늘리면 여기도 채운다(빠뜨리면 타입 검사가 알려 준다).
export type ActionStyle = {icon: LucideIcon; variant: 'default' | 'secondary'; placement: 'start' | 'end'}

export const ACTION_STYLE: Readonly<Record<EvaluationResultActionType, ActionStyle>> = {
    'self-diagnosis': {icon: FileCheckCorner, variant: 'secondary', placement: 'start'},
    'bank-transfer': {icon: Building2, variant: 'secondary', placement: 'end'},
    guarantee: {icon: ShieldCheck, variant: 'default', placement: 'end'},
    'general-result': {icon: FileCheckCorner, variant: 'secondary', placement: 'start'},
    'deep-result': {icon: FileSearchCorner, variant: 'secondary', placement: 'start'},
    'self-diagnosis-general': {icon: FileCheckCorner, variant: 'secondary', placement: 'start'},
    'verification-result': {icon: ClipboardCheck, variant: 'secondary', placement: 'start'},
    'guarantee-recommendation': {icon: ShieldCheck, variant: 'default', placement: 'end'},
    'guarantee-history': {icon: ClipboardList, variant: 'default', placement: 'end'},
    cancel: {icon: CircleX, variant: 'secondary', placement: 'start'},
    'excel-result': {icon: FileDigit, variant: 'secondary', placement: 'start'},
    'html-archive': {icon: FolderOpen, variant: 'secondary', placement: 'start'},
    're-register': {icon: FilePenLine, variant: 'secondary', placement: 'start'},
}
