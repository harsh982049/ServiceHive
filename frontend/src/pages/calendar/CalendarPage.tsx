import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import api from '@/lib/axios'
import EventForm from '@/components/EventForm'
import EventCard from '@/components/EventCard'
import { Separator } from '@/components/ui/separator'

type Event = {
  _id: string
  title: string
  startTime: string
  endTime: string
  status: 'BUSY'|'SWAPPABLE'|'SWAP_PENDING'
}

export default function CalendarPage() {
  const qc = useQueryClient()

  const eventsQ = useQuery({
    queryKey: ['events'],
    queryFn: async () => (await api.get<Event[]>('/events')).data
  })

  const createM = useMutation({
    mutationFn: (payload: { title: string; startTime: Date; endTime: Date }) => api.post('/events', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] })
  })

  const patchM = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Event['status'] }) => api.patch(`/events/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] })
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Events</h1>
        <p className="text-sm text-muted-foreground">Create and manage your slots.</p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button><Plus className="mr-2 h-4 w-4" /> New Event</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader><DialogTitle>Create Event</DialogTitle></DialogHeader>
          <EventForm onSubmit={(d)=>createM.mutate(d)} />
        </DialogContent>
      </Dialog>

      <EventForm onSubmit={(d)=>createM.mutate(d)} />
      <Separator />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {eventsQ.data?.map(ev => (
          <EventCard
            key={ev._id}
            title={ev.title}
            startTime={ev.startTime}
            endTime={ev.endTime}
            status={ev.status}
            onMakeSwappable={() => patchM.mutate({ id: ev._id, status: 'SWAPPABLE' })}
            onMakeBusy={() => patchM.mutate({ id: ev._id, status: 'BUSY' })}
          />
        ))}
      </div>
    </div>
  )
}
