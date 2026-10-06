import {CircleAlert, TriangleAlert, Info} from 'lucide-react'
import {Badge} from '@/components/ui/badge'

export default function IssueBadge({level}: {level: string}) {
    const color = level === 'error' ? 'error' : level === 'warning' ? 'warning' : 'info'
    const Icon = level === 'error' ? CircleAlert : level === 'warning' ? TriangleAlert : Info
    const label = level === 'error' ? '오류' : level === 'warning' ? '경고' : '정보'
    return (
        <Badge color={color} variant="outline" size="xs">
            <Icon aria-hidden="true" />
            {label}
        </Badge>
    )
}
