import { Router } from 'express'
import auth from '../middleware/auth.js'
import { listEvents, createEvent, updateEvent, deleteEvent } from '../controllers/event.controller.js'

const router = Router()
router.use(auth)

router.get('/', listEvents)
router.post('/', createEvent)
router.patch('/:id', updateEvent)
router.delete('/:id', deleteEvent)

export default router
