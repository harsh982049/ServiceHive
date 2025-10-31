import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Props = {
  title: string
  startTime: string
  endTime: string
  status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING'
  onMakeSwappable?: () => void
  onMakeBusy?: () => void
}

export default function EventCard(p: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{p.title}</span>
          <Badge variant={p.status === 'SWAPPABLE' ? 'default' : p.status === 'SWAP_PENDING' ? 'secondary' : 'outline'}>
            {p.status}
          </Badge>
        </CardTitle>
        <CardDescription>
          {new Date(p.startTime).toLocaleString()} – {new Date(p.endTime).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        {p.status === 'BUSY' && <Button size="sm" onClick={p.onMakeSwappable}>Make Swappable</Button>}
        {p.status === 'SWAPPABLE' && <Button size="sm" variant="outline" onClick={p.onMakeBusy}>Make Busy</Button>}
      </CardContent>
    </Card>
  )
}
