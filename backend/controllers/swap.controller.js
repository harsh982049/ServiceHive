import mongoose from 'mongoose'
import Event from '../models/Event.js'
import SwapRequest from '../models/SwapRequest.js'
import User from '../models/User.js'
import { EVENT_STATUS, SWAP_STATUS } from '../utils/constants.js'

/**
 * GET /api/swappable-slots
 * Return swappable slots from other users (include ownerName)
 */
export async function listSwappableSlots(req, res, next) {
  try {
    const slots = await Event.aggregate([
      { $match: { status: EVENT_STATUS.SWAPPABLE, userId: { $ne: new mongoose.Types.ObjectId(req.user.id) } } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'owner'
        }
      },
      { $unwind: '$owner' },
      {
        $project: {
          title: 1, startTime: 1, endTime: 1,
          ownerName: '$owner.name'
        }
      }
    ])
    res.json(slots)
  } catch (e) { next(e) }
}

/**
 * POST /api/swap-request
 * body: { mySlotId, theirSlotId }
 * Creates a PENDING request, locks both slots to SWAP_PENDING
 */
export async function createSwapRequest(req, res, next) {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { mySlotId, theirSlotId } = req.body
    if (!mySlotId || !theirSlotId) return res.status(400).json({ message: 'mySlotId and theirSlotId required' })

    const mySlot = await Event.findById(mySlotId).session(session)
    const theirSlot = await Event.findById(theirSlotId).session(session)
    if (!mySlot || !theirSlot) throw new Error('Slot not found')

    if (String(mySlot.userId) !== req.user.id) return res.status(403).json({ message: 'You must offer your own slot' })
    if (String(theirSlot.userId) === req.user.id) return res.status(400).json({ message: 'Cannot swap with your own slot' })

    if (mySlot.status !== EVENT_STATUS.SWAPPABLE || theirSlot.status !== EVENT_STATUS.SWAPPABLE) {
      return res.status(400).json({ message: 'Both slots must be SWAPPABLE' })
    }

    const swap = await SwapRequest.create([{
      requesterId: req.user.id,
      receiverId: theirSlot.userId,
      mySlotId,
      theirSlotId,
      status: SWAP_STATUS.PENDING,
    }], { session })

    mySlot.status = EVENT_STATUS.SWAP_PENDING
    theirSlot.status = EVENT_STATUS.SWAP_PENDING
    await mySlot.save({ session })
    await theirSlot.save({ session })

    await session.commitTransaction()
    res.status(201).json(swap[0])
  } catch (e) {
    await session.abortTransaction()
    next(e)
  } finally {
    session.endSession()
  }
}

/**
 * GET /api/swap-requests
 * Returns { incoming: [], outgoing: [] } for current user
 */
export async function listSwapRequests(req, res, next) {
  try {
    const [incoming, outgoing] = await Promise.all([
      SwapRequest.find({ receiverId: req.user.id }).sort({ createdAt: -1 })
        .populate('mySlotId', 'title')
        .populate('theirSlotId', 'title'),
      SwapRequest.find({ requesterId: req.user.id }).sort({ createdAt: -1 })
        .populate('mySlotId', 'title')
        .populate('theirSlotId', 'title'),
    ])

    const shape = (arr, direction) => arr.map(r => ({
      _id: r._id,
      status: r.status,
      direction,
      mySlotTitle: r.mySlotId?.title,
      theirSlotTitle: r.theirSlotId?.title,
    }))

    res.json({ incoming: shape(incoming, 'INCOMING'), outgoing: shape(outgoing, 'OUTGOING') })
  } catch (e) { next(e) }
}

/**
 * POST /api/swap-response/:id
 * body: { accept: boolean }
 * If accept: swap owners (transaction). Else: unlock to SWAPPABLE & mark REJECTED.
 */
export async function respondSwapRequest(req, res, next) {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params
    const { accept } = req.body

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid swap request id' })
    }
    if (typeof accept !== 'boolean') {
      return res.status(400).json({ message: 'Body must include { accept: boolean }' })
    }

    const swap = await SwapRequest.findById(id).session(session)
    if (!swap) return res.status(404).json({ message: 'Swap not found' })
    if (String(swap.receiverId) !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized: this request is not addressed to you' })
    }
    if (swap.status !== SWAP_STATUS.PENDING) {
      return res.status(400).json({ message: 'Already resolved' })
    }

    const [mySlot, theirSlot] = await Promise.all([
      Event.findById(swap.mySlotId).session(session),
      Event.findById(swap.theirSlotId).session(session),
    ])
    if (!mySlot || !theirSlot) {
      return res.status(404).json({ message: 'One or both slots are missing' })
    }

    // Ensure both are locked
    if (mySlot.status !== EVENT_STATUS.SWAP_PENDING || theirSlot.status !== EVENT_STATUS.SWAP_PENDING) {
      return res.status(400).json({ message: 'Slots must be SWAP_PENDING to resolve' })
    }

    if (!accept) {
      swap.status = SWAP_STATUS.REJECTED
      mySlot.status = EVENT_STATUS.SWAPPABLE
      theirSlot.status = EVENT_STATUS.SWAPPABLE
      await Promise.all([swap.save({ session }), mySlot.save({ session }), theirSlot.save({ session })])
      await session.commitTransaction()
      return res.json({ ok: true })
    }

    // ACCEPT path — sanity check ownerships
    const requesterId = mySlot.userId
    const receiverId = theirSlot.userId
    if (String(requesterId) !== String(swap.requesterId) || String(receiverId) !== String(swap.receiverId)) {
      return res.status(400).json({ message: 'Ownership mismatch; cannot accept' })
    }

    // Exchange owners and mark BUSY
    mySlot.userId = receiverId
    theirSlot.userId = requesterId
    mySlot.status = EVENT_STATUS.BUSY
    theirSlot.status = EVENT_STATUS.BUSY
    swap.status = SWAP_STATUS.ACCEPTED

    await Promise.all([mySlot.save({ session }), theirSlot.save({ session }), swap.save({ session })])
    await session.commitTransaction()
    res.json({ ok: true })
  } catch (e) {
    await session.abortTransaction()
    // Normalize common Mongoose CastError to 400
    if (e?.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid id in request' })
    }
    next(e)
  } finally {
    session.endSession()
  }
}
