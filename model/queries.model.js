import { ACTIONS, dbActionGenerator } from './index'
import usersModel from './users.model'

// Queries that act as the primary mode of communication with the database
// Written to ensure reusability and easy debugging and also maintain a single source of truth

const queries = {
  updateToDb: async (data, action, collection = usersModel) => {
    return await dbActionGenerator(!action ? ACTIONS.UPDATEONE : action, {
      collection,
      data: [...data],
    })
  },
  getFromDb: async (data, action, collection = usersModel) => {
    return await dbActionGenerator(!action ? ACTIONS.FIND : action, {
      collection,
      data,
    })
  },
}

module.exports = {
  queries,
}
