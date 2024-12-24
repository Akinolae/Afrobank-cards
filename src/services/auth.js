import KeyManager from './apiKeyManager.js'
import { response } from './responseHandler.js'
import { StatusCodes } from 'http-status-codes'
import { getValueFromAttributes, getUserFromCognito } from '../../lib/aws.js'
import * as uuid from 'uuid'

class AuthImpl extends KeyManager {
  constructor() {
    super()
  }

  genAPIkey = async (req, res) => {
    try {
      const api_key = await this.createAPIKey()

      const { createdAt, key } = api_key

      const params = {
        APIKey: key,
        createdAt,
        user_id: uuid.v4(),
      }

      await this.putToDB(params)

      response({ message: params, success: true, code: StatusCodes.OK, res })
    } catch (error) {
      response({
        message: error.message,
        success: false,
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        res,
      })
    }
  }

  verifyUserAccessToken = async (req) => {
    const authToken = req.headers.authorization
    const token = !!authToken ? authToken.split(' ')[1] : ''

    try {
      const data = await getUserFromCognito(token)
      return data
    } catch (error) {
      throw error
    }
  }

  // two way authenticator for both x-api-key and authorization
  authenticator = async (req, res, next) => {
    let verify
    let user
    try {
      const apiKey = req.headers['x-api-key']
      const authToken = req.headers.authorization

      if (!!authToken) {
        verify = await this.verifyUserAccessToken(req)

        user = {
          user_id: getValueFromAttributes(
            verify.UserAttributes,
            'custom:user_id'
          ),
          email: getValueFromAttributes(verify.UserAttributes, 'email'),
        }
      }

      if (!!apiKey) {
        verify = await this.validateAPIkey(apiKey)

        user = {
          ...(verify?._doc ?? {}),
        }
      }

      !verify
        ? response({
            message: !apiKey ? 'Invalid API_KEY provided' : 'User not found',
            success: false,
            code: StatusCodes.UNPROCESSABLE_ENTITY,
            res,
          })
        : (res.user = user)
      !!verify && next()
    } catch (error) {
      console.log(error, 'err')

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
