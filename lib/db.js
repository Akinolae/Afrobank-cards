import mongoose from 'mongoose'

const URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.47qbkty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const dbConfig = async () => {
  try {
    await mongoose.connect(URL)
    console.log('==== Connection established ====')
    return true
  } catch (error) {
    throw error
  }
}

export { dbConfig }
