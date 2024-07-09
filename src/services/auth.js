import KeyManager from './apiKeyManager.js'
import { response } from './responseHandler.js'

class AuthImpl extends KeyManager {
  constructor() {
    super()
  }

  genAPIkey = async (req, res) => {
    try {
      const api_key = await this.createAPIKey()
      const dep = this.deprecateAPIkey({ user_id: 1, key: '%jx^a6i605wkj1x' })

      console.log({ api_key, dep })
      response({ message: api_key, success: true, code: 200, res })
    } catch (error) {
      response({ message: error.message, success: false, code: 500, res })
    }
  }
}

const authImpl = new AuthImpl()
Object.freeze(authImpl)

export { authImpl }
