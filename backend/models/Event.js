import mongoose from 'mongoose'
import { EVENT_STATUS } from '../utils/constants.js'

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: Object.values(EVENT_STATUS), default: EVENT_STATUS.BUSY },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

eventSchema.index({ userId: 1, startTime: 1 })

export default mongoose.model('Event', eventSchema)
