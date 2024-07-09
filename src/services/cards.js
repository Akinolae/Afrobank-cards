import { response } from './responseHandler.js'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { generateCreditCard } from '../utils/cardUtils.js'
import { generateUserAccessKey } from '../utils/userUtils.js'
import { cardCreationValidation } from '../validator/index.js'
import KeyManager from './apiKeyManager.js'

class CardsImpl extends KeyManager {
  constructor() {
    super()
  }

  getCard = () => {}

  getCards = async (req, res) => {
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

  createCard = async (req, res) => {
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

    console.log({ API_KEY: generateUserAccessKey() })

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
