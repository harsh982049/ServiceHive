import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

type Slot = { id: string; title: string; startTime: string; endTime: string }

export default function SwapRequestModal({
  theirSlotId,
  mySwappableSlots,
  onConfirm,
}: {
  theirSlotId: string
  mySwappableSlots: Slot[]
  onConfirm: (mySlotId: string) => void
}) {
  const [mySlotId, setMySlotId] = useState("")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Request Swap</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Offer one of your swappable slots</DialogTitle>
        </DialogHeader>

        {/* The select must control value + onValueChange */}
        <Select value={mySlotId} onValueChange={setMySlotId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose my slot" />
          </SelectTrigger>
          <SelectContent>
            {mySwappableSlots.length === 0 && (
              <div className="p-2 text-sm text-muted-foreground">
                You have no swappable slots.
              </div>
            )}
            {mySwappableSlots.map((s) => (
              <SelectItem key={s._id} value={s._id}>
                {s.title} • {new Date(s.startTime).toLocaleString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-4 flex justify-end">
          <Button
            disabled={!mySlotId}
            onClick={() => {
              onConfirm(mySlotId)
              setMySlotId("") // reset for next time
            }}
          >
            Send Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
