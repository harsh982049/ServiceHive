import dotenv from 'dotenv'
dotenv.config()
import { createServer } from 'http'
import app from './app.js'
import connectDB from './config/db.js'

const PORT = process.env.PORT || 4000

await connectDB()

const server = createServer(app)
server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
