import Event from '../models/Event.js'
import { EVENT_STATUS } from '../utils/constants.js'

export async function listEvents(req, res, next) {
  try {
    const { status } = req.query
    const query = { userId: req.user.id }
    if (status) query.status = status
    const events = await Event.find(query).sort({ startTime: 1 })
    res.json(events)
  } catch (e) { next(e) }
}

export async function createEvent(req, res, next) {
  try {
    const { title, startTime, endTime } = req.body
    if (!title || !startTime || !endTime) return res.status(400).json({ message: 'Missing fields' })
    const ev = await Event.create({ title, startTime, endTime, userId: req.user.id, status: EVENT_STATUS.BUSY })
    res.status(201).json(ev)
  } catch (e) { next(e) }
}

export async function updateEvent(req, res, next) {
  try {
    const { id } = req.params
    const { title, startTime, endTime, status } = req.body
    const ev = await Event.findOne({ _id: id, userId: req.user.id })
    if (!ev) return res.status(404).json({ message: 'Event not found' })

    if (title !== undefined) ev.title = title
    if (startTime !== undefined) ev.startTime = startTime
    if (endTime !== undefined) ev.endTime = endTime
    if (status !== undefined) {
      if (![EVENT_STATUS.BUSY, EVENT_STATUS.SWAPPABLE, EVENT_STATUS.SWAP_PENDING].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' })
      }
      // forbid toggling to SWAP_PENDING manually
      if (status === EVENT_STATUS.SWAP_PENDING) return res.status(400).json({ message: 'Cannot set SWAP_PENDING directly' })
      ev.status = status
    }
    await ev.save()
    res.json(ev)
  } catch (e) { next(e) }
}

export async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params
    const ev = await Event.findOneAndDelete({ _id: id, userId: req.user.id })
    if (!ev) return res.status(404).json({ message: 'Event not found' })
    res.json({ ok: true })
  } catch (e) { next(e) }
}
