import express from 'express'
import { AddMessage, getMessages } from '../Controllers/MessageController.js'

const router = express.Router()

router.post('/', AddMessage)
router.get('/:chatId', getMessages)

export default router