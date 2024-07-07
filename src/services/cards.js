import { response } from './responseHandler.js'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { generateCreditCard } from '../utils/cardUtils.js'
import { coreProcessor } from '../../queue/index.js'

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
    try {
      const message = 'Card created'
      // await coreProcessor({
      //   processorConfig: { callBackUrl: '' },
      //   payload: [{ ...res.body }],
      // })
      response({ code: 200, message, res, success: true })
    } catch (error) {
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
