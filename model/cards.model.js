import mongoose from 'mongoose'

const cardSchema = new mongoose.Schema({
  cardToken: {
    type: String,
    allowNull: false,
    required: true,
  },
  user_id: {
    type: String,
    allowNull: false,
    required: true,
  },
})

export default mongoose.model('cards', cardSchema)
