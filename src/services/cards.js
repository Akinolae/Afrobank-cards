import bcrypt from 'bcryptjs'
import KeyManager from './apiKeyManager.js'
import { response } from './responseHandler.js'
import { preparedCardData } from '../utils/cardUtils.js'
import { cardCreationValidation } from '../validator/index.js'
import { queries } from '../../model/queries.model.js'
import cardsModel from '../../model/cards.model.js'
import { ACTIONS } from '../../model/index.js'

class CardsImpl extends KeyManager {
  constructor() {
    super()
  }

  getCards = async (req, res) => {
    try {
      this.APIkeyDepricationValidator({
        user_id: res.user.user_id,
        API_KEY: res.user.APIKey,
        createdAt: res.user.createdAt,
      })

      const cards = await queries.getFromDb([], ACTIONS.FIND, cardsModel)

      console.log(cards, 'cards')
      response({
        code: 200,
        message: hash,
        res,
        success: true,
      })
    } catch (error) {
      response({ code: 500, message: error, res, success: false })
    }
  }

  createCard = async (req, res) => {
    const validate = cardCreationValidation.validate(req.body)

    try {
      this.APIkeyDepricationValidator({
        user_id: res.user.user_id,
        API_KEY: res.user.APIKey,
        createdAt: res.user.createdAt,
      })

      if (!!validate.error) {
        response({
          code: 404,
          message: `CARD_CREATION_ERROR: ${validate.error}`,
          res,
          success: false,
        })
        return
      }

      const _cardData = preparedCardData({ params: req.body })
      const hash = await bcrypt.hash(JSON.stringify(_cardData), 10)

      const resp = await queries.updateToDb(
        [{ cardToken: hash }],
        ACTIONS.CREATE,
        cardsModel
      )

      resp.save()
      const message = 'Card created'
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
