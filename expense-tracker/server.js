const express = require('express')
const bodyParser = require('body-parser')
const db = require('./database/database')
const app = express()

app.use(bodyParser.json()) // Middleware to parse JSON requests

// Import routes
const transactionRoutes = require('./routes/transactionRoutes')
app.use('/transactions', transactionRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({error: err.message})
})

// Server listening on port 3000
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
