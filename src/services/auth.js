import KeyManager from './apiKeyManager.js'
import { response } from './responseHandler.js'
import { StatusCodes } from 'http-status-codes'
import { getValueFromAttributes, getUserFromCognito } from '../../lib/aws.js'
import { dummyKeys } from '../../data/dummyData.js'

class AuthImpl extends KeyManager {
  constructor() {
    super()
  }

  genAPIkey = async (req, res) => {
    try {
      const api_key = await this.createAPIKey()

      response({ message: api_key, success: true, code: 200, res })
    } catch (error) {
      response({ message: error.message, success: false, code: 500, res })
    }
  }

  verifyUserAccessToken = async (token) => {
    try {
      const data = await getUserFromCognito(token)
      return data
    } catch (error) {
      throw error
    }
  }

  verifyUser = async (req, res, next) => {
    let verify
    let user
    try {
      const apiKey = req.headers['x-api-key']
      const authToken = req.headers.authorization

      if (!!authToken) {
        const token = !!authToken ? authToken.split(' ')[1] : ''
        verify = await this.verifyUserAccessToken(token)
        user.user_id = getValueFromAttributes(
          verify.UserAttributes,
          'custom:user_id'
        )
        user.email = getValueFromAttributes(verify.UserAttributes, 'email')
      }

      if (!!apiKey) {
        verify = dummyKeys.find((keys) => keys.API_KEY === apiKey)
        user = {
          ...verify,
        }
      }

      !verify
        ? response({
            message: 'user not found',
            success: false,
            code: StatusCodes.UNPROCESSABLE_ENTITY,
            res,
          })
        : (res.user = user)
      !!verify && next()
    } catch (error) {
      const err = error.toString()
      const errMessage = err.includes('invalid')
        ? error
        : err.includes('expired')
        ? 'Token expired'
        : 'no token provided'
      response({
        message: errMessage,
        success: false,
        code: StatusCodes.UNAUTHORIZED,
        res,
      })
    }
  }
}

const authImpl = new AuthImpl()
Object.freeze(authImpl)

export { authImpl }
