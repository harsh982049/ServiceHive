import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SwapRequestModal from '@/components/SwapRequestModal'

type Slot = { _id: string; title: string; startTime: string; endTime: string; ownerName: string }
type MySlot = { id: string; title: string; startTime: string; endTime: string }

export default function MarketplacePage() {
  const qc = useQueryClient()

  const swappableQ = useQuery({
    queryKey: ['market', 'swappable'],
    queryFn: async () => (await api.get<Slot[]>('/swappable-slots')).data
  })

  const mySwappableQ = useQuery({
    queryKey: ['events','swappable'],
    queryFn: async () => (await api.get<MySlot[]>('/events?status=SWAPPABLE')).data
  })

  const requestM = useMutation({
    mutationFn: ({ mySlotId, theirSlotId }: { mySlotId: string; theirSlotId: string }) =>
      api.post('/swap-request', { mySlotId, theirSlotId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['market','swappable'] })
      qc.invalidateQueries({ queryKey: ['events','swappable'] })
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Marketplace</h1>
        <p className="text-sm text-muted-foreground">Browse others’ swappable slots and make an offer.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {swappableQ.data?.map(s => (
          <Card key={s._id}>
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
              <CardDescription>By {s.ownerName}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div>{new Date(s.startTime).toLocaleString()}</div>
                <div className="text-muted-foreground">{new Date(s.endTime).toLocaleString()}</div>
              </div>
              <SwapRequestModal
                theirSlotId={s._id}
                mySwappableSlots={mySwappableQ.data ?? []}
                onConfirm={(mySlotId) => requestM.mutate({ mySlotId, theirSlotId: s._id })}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
