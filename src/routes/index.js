import express from 'express'
import { cardsImpl } from '../services/cards.js'
import { authImpl } from '../services/auth.js'

const router = express.Router()

router.get('/get-cards', authImpl.verifyUser, cardsImpl.getCards)
router.post('/create-card', authImpl.verifyUser, cardsImpl.createCard)
router.get('/get-api-key', authImpl.verifyUser, authImpl.genAPIkey)

export { router }
