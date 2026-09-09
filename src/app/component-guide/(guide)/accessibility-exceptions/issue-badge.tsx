import {CircleAlert, TriangleAlert, Info} from 'lucide-react'
import {Badge} from '@/components/ui/badge'

export default function IssueBadge({level}: {level: string}) {
    const color = level === 'error' ? 'error' : level === 'warning' ? 'warning' : 'info'
    const Icon = level === 'error' ? CircleAlert : level === 'warning' ? TriangleAlert : Info
    const label = level === 'error' ? '오류 · Error' : level === 'warning' ? '경고 · Warning' : '정보 · Info'
    return (
        <Badge color={color} variant="outline" size="sm">
            <Icon aria-hidden="true" />
            {label}
        </Badge>
    )
}
