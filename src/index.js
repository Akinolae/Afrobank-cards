import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { router } from './routes/index.js'
import { dbConfig } from '../lib/db.js'

const app = express()

app.use(morgan('combined'))
app.use(express.json())
app.use(cors())
app.use(router)
app.use('/Api/v1', router)

app.listen(3006, async (e) => {
  //   process.on('warning', (e) => console.warn(e.stack))
  dbConfig()
  console.log(`app is running`)
})
