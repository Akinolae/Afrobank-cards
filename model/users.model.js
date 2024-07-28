import mongoose from 'mongoose'

const user = new mongoose.Schema({
  cardToken: {
    type: String,
    allowNull: false,
    required: true,
  },
})

export default mongoose.model('users', user)
