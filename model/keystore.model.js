import mongoose from 'mongoose'

const APIKeySchema = new mongoose.Schema({
  user_id: {
    type: String,
    allowNull: false,
    required: true,
  },
  APIKey: {
    type: String,
    allowNull: false,
    required: true,
  },
  createdAt: {
    type: String,
    allowNull: false,
    required: true,
  },
})

export default mongoose.model('APIKeySchema', APIKeySchema)
