import mongoose from 'mongoose'
import { SWAP_STATUS } from '../utils/constants.js'

const swapRequestSchema = new mongoose.Schema(
  {
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who offered
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // owner of theirSlot
    mySlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },    // requester's slot
    theirSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // receiver's slot
    status: { type: String, enum: Object.values(SWAP_STATUS), default: SWAP_STATUS.PENDING },
  },
  { timestamps: true }
)

swapRequestSchema.index({ receiverId: 1, status: 1 })
swapRequestSchema.index({ requesterId: 1, status: 1 })

export default mongoose.model('SwapRequest', swapRequestSchema)
