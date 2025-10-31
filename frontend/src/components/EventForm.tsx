import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import DateTimePicker from "@/components/DateTimePicker"
import { CalendarIcon } from 'lucide-react'

const schema = z.object({
  title: z.string().min(1),
  startTime: z.date(),
  endTime: z.date(),
})

type FormData = z.infer<typeof schema>

export default function EventForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { title: '', startTime: new Date(), endTime: new Date() } })

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField name="title" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl><Input placeholder="Team sync" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField name="startTime" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Start</FormLabel>
            <FormControl>
              <DateTimePicker value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField name="endTime" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>End</FormLabel>
            <FormControl>
              <DateTimePicker value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit">Create Event</Button>
      </form>
    </Form>
  )
}
