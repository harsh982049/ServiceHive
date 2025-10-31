import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'sonner'

type Req = {
  _id: string
  mySlotTitle: string
  theirSlotTitle: string
  status: 'PENDING'|'ACCEPTED'|'REJECTED'
  direction: 'INCOMING'|'OUTGOING'
}

export default function RequestsPage() {
  const qc = useQueryClient()

  const reqQ = useQuery({
    queryKey: ['requests'],
    queryFn: async () => (await api.get<{ incoming: Req[]; outgoing: Req[] }>('/swap-requests')).data
  })

  const respondM = useMutation({
    mutationFn: ({ id, accept }: { id: string; accept: boolean }) =>
      api.post(`/swap-response/${id}`, { accept }),
    onSuccess: () => {
      toast.success(accept ? 'Swap accepted' : 'Swap rejected')
      qc.invalidateQueries({ queryKey: ['requests'] })
      qc.invalidateQueries({ queryKey: ['events'] })
      qc.invalidateQueries({ queryKey: ['market','swappable'] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Swap response failed'
      toast.error(msg)
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Swap Requests</h1>

      <Tabs defaultValue="incoming">
        <TabsList>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-3">
          {reqQ.data?.incoming?.map(r => (
            <Card key={r._id}>
              <CardHeader>
                <CardTitle>Offer for your <b>{r.theirSlotTitle}</b></CardTitle>
                <CardDescription>They offered: {r.mySlotTitle}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button disabled={r.status !== 'PENDING'} onClick={() => respondM.mutate({ id: r._id, accept: true })}>
                  Accept
                </Button>
                <Button disabled={r.status !== 'PENDING'} onClick={() => respondM.mutate({ id: r._id, accept: false })}>
                  Reject
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-3">
          {reqQ.data?.outgoing?.map(r => (
            <Card key={r._id}>
              <CardHeader>
                <CardTitle>You offered <b>{r.mySlotTitle}</b></CardTitle>
                <CardDescription>For their {r.theirSlotTitle} • {r.status}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
