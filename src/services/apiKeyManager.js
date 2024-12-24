import { generateUserAccessKey } from '../utils/userUtils.js'
import { dummyKeys } from '../../data/dummyData.js'
import { queries } from '../../model/queries.model.js'
import APIKey from '../../model/keystore.model.js'
import { ACTIONS } from '../../model/index.js'

const MAX_MONTH = 6
class KeyManager {
  validateAPIkey = async (key = '', userId = '') => {
    const keys = await this.getKeysFromDB()

    if (!!key) {
      const keyExists = keys.find(({ APIKey, user_id }) => {
        if (!!userId) {
          return APIKey === key && userId === user_id
        } else {
          return APIKey === key
        }
      })

      if (!!keyExists) {
        return {
          ...keyExists,
        }
      }
    }
  }

  getKeysFromDB = async () => {
    return await queries.getFromDb([], ACTIONS.FIND, APIKey)
  }

  putToDB = async (args) => {
    const APIkeys = await this.getKeysFromDB()
    const currentUserKey = APIkeys.filter(
      ({ user_id }) => user_id === args.user_id
    )
    if (!!currentUserKey.length) {
      throw new Error('API key exists already')
    }

    await queries.updateToDb({
      collection: APIKey,
      data: [args],
      action: ACTIONS.CREATE,
    })
  }

  createAPIKey = async () => {
    let key

    do {
      key = generateUserAccessKey()
    } while (!!(await this.validateAPIkey(key)))
    return {
      key,
      createdAt: new Date(),
    }
  }

  APIkeyDepricationValidator = async (args) => {
    this.argsValidator(args, 3)
    const { user_id, API_KEY } = args

    const currentUserKey = await this.validateAPIkey(API_KEY, user_id)

    if (!currentUserKey) {
      throw new Error('INVALID_KEY: Invalid key or user is provided')
    }

    const getMonthDifference =
      new Date().getMonth() + 1 - new Date(currentUserKey.createdAt).getMonth()

    if (getMonthDifference >= MAX_MONTH) {
      throw new Error(
        'DEPRECATION_ERROR: provided API_KEY is deprecated, please generate another one.'
      )
    }
  }

  argsValidator = (args, length) => {
    const hasValues = !args ? Object.keys({}) : Object.keys(args)

    if (!hasValues.length) {
      throw new Error('VALIDATION_ERROR: args cannot be empty')
    }

    length = length ?? 1

    if (hasValues.length !== length) {
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
