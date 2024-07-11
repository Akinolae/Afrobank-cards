import { generateUserAccessKey } from '../utils/userUtils.js'
import { dummyKeys } from '../../data/dummyData.js'

const MAX_MONTH = 6
class KeyManager {
  validateAPIkey = (key = '') => {
    return !!dummyKeys.filter(({ API_KEY }) => API_KEY === key).length
  }

  createAPIKey = async () => {
    let key

    do {
      key = generateUserAccessKey()
    } while (this.validateAPIkey(key))
    return {
      key,
      createdAt: new Date(),
    }
  }

  APIkeyDepricationValidator = (args) => {
    this.argsValidator(args, 3)

    const { user_id, API_KEY } = args
    const currentUserKey = dummyKeys.find(
      (key) => key.user_id === user_id && key.API_KEY === API_KEY
    )
    const getMonthDifference =
      new Date().getMonth() + 1 - new Date(currentUserKey.createdAt).getMonth()

    if (getMonthDifference >= MAX_MONTH) {
      throw new Error(
        'DEPRECATION_ERROR: provided API_KEY is deprecated, please generate another one.'
      )
    }
  }

  argsValidator = (args, length) => {
    const hasValuses = !args ? Object.keys({}) : Object.keys(args)

    if (!hasValuses.length) {
      throw new Error('VALIDATION_ERROR: args cannot be empty')
    }

    length = length ?? 1

    if (hasValuses.length !== length) {
      throw new Error(`VALIDATION_ERROR: validation failed`)
    }
  }

  deprecateAPIkey = (args) => {
    this.argsValidator(args, 2)
    const { user_id, key } = args
    const data = !!dummyKeys.length ? dummyKeys : []

    return data.map((currentKey) => {
      let updatedUserKey
      if (user_id === currentKey.user_id && currentKey.API_KEY === key) {
        updatedUserKey = {
          user_id: currentKey.user_id,
          API_KEY: '',
        }
      }

      return {
        ...currentKey,
        ...updatedUserKey,
      }
    })
  }

  getUserAPIkey = (args) => {
    this.argsValidator(args)
    const { user_id } = args
    return dummyKeys.find((keys) => keys.user_id === user_id)
  }
}

export default KeyManager
