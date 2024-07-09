import express from 'express'
import { cardsImpl } from '../services/cards.js'
import { authImpl } from '../services/auth.js'

const router = express.Router()

router.get('/get-cards', cardsImpl.getCards)
router.post('/create-card', cardsImpl.createCard)
router.get('/get-api-key', authImpl.genAPIkey)

export { router }
