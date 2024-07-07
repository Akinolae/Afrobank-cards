import { response } from './responseHandler.js'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { generateCreditCard } from '../utils/cardUtils.js'
import { cardCreationValidation } from '../validator/index.js'

class CardsImpl {
  async getCards(req, res) {
    try {
      const token = crypto.randomUUID()
      const hash = await bcrypt.hash(token, 10)

      const message = {
        hash,
        card: generateCreditCard(),
      }
      response({ code: 200, message, res, success: true })
    } catch (error) {
      response({ code: 500, message: error, res, success: false })
    }
  }

  async createCard(req, res) {
    const validate = cardCreationValidation.validate(req.body)

    if (!!validate.error) {
      response({
        code: 404,
        message: `CARD_CREATION_ERROR: ${validate.error}`,
        res,
        success: false,
      })
      return
    }

    try {
      const message = 'Card created'
      response({ code: 200, message, res, success: true })
    } catch (error) {
      console.log({ error })
      response({
        code: 500,
        message: `CARD_CREATION_ERROR: ${error.message}`,
        res,
        success: false,
      })
    }
  }
}

const cardsImpl = new CardsImpl()
export { cardsImpl }
