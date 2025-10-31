import { Router } from 'express'
import auth from '../middleware/auth.js'
import { listSwappableSlots, createSwapRequest, listSwapRequests, respondSwapRequest } from '../controllers/swap.controller.js'

const router = Router()
router.use(auth)

router.get('/swappable-slots', listSwappableSlots)
router.post('/swap-request', createSwapRequest)
router.get('/swap-requests', listSwapRequests)
router.post('/swap-response/:id', respondSwapRequest)

export default router
