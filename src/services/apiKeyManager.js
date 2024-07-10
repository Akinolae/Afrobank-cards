import { generateUserAccessKey } from '../utils/userUtils.js'

const dummyKeys = [
  {
    user_id: 1,
    API_KEY: 'j%osn4013vm7xq',
    createdAt: new Date(),
  },
  { user_id: 1, API_KEY: '2kb#uv%##cxnf@h', createdAt: new Date() },
  { user_id: 1, API_KEY: 'h2#k^3@36yj@5zi', createdAt: new Date() },
  { user_id: 1, API_KEY: 'm5yrt^ygw6mj^6r', createdAt: new Date() },
  { user_id: 1, API_KEY: 'c^ge0$h0imy^rw6', createdAt: new Date() },
  { user_id: 1, API_KEY: 'pi%eqsuox8ij7@7', createdAt: new Date() },
  { user_id: 1, API_KEY: 'dwqll$%fv6c48q6', createdAt: new Date() },
  { user_id: 1, API_KEY: '%jx^a6i605wkj1x', createdAt: new Date() },
]

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
    this.argsValidator(args)
    const { user_id } = args
    const currentUserKey = dummyKeys.find((key) => key.user_id === user_id)
    const getMonthDifference =
      new Date().getMonth() + 1 - currentUserKey.createdAt.getMonth()

    if (getMonthDifference >= MAX_MONTH) {
      throw new Error('provided token deprecated')
    }
  }

  argsValidator = (args, length) => {
    const keys = Object.keys(args)
    length = length ?? 1

    if (!keys.length || keys.length !== length) {
      throw new Error(`args is required`)
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
