import express from 'express'
import { cardsImpl } from '../services/cards.js'
import { authImpl } from '../services/auth.js'

const router = express.Router()

router.get('/get-cards', authImpl.authenticator, cardsImpl.getCards)
router.post('/create-card', authImpl.authenticator, cardsImpl.createCard)
router.get('/get-api-key', authImpl.authenticator, authImpl.genAPIkey)

export { router }
