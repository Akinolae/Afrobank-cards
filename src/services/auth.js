import KeyManager from './apiKeyManager.js'
import { response } from './responseHandler.js'
import { StatusCodes } from 'http-status-codes'
import { getValueFromAttributes, getUserFromCognito } from '../../lib/aws.js'

class AuthImpl extends KeyManager {
  constructor() {
    super()
  }

  genAPIkey = async (req, res) => {
    try {
      const api_key = await this.createAPIKey()
      const dep = this.deprecateAPIkey({ user_id: 1, key: '%jx^a6i605wkj1x' })

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
    try {
      const authToken = req.headers.authorization

      const token = !!authToken ? authToken.split(' ')[1] : ''
      const verify = await this.verifyUserAccessToken(token)
      let user = {}
      user.user_id = getValueFromAttributes(
        verify.UserAttributes,
        'custom:user_id'
      )
      user.email = getValueFromAttributes(verify.UserAttributes, 'email')

      !verify
        ? response({
            message: 'user not found',
            success: false,
            code: StatusCodes.UNPROCESSABLE_ENTITY,
            res,
          })
        : (res.user = user)
      next()
    } catch (error) {
      const err = error.toString()
      console.log({ err })
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
