const express = require('express')
const router = express.Router()
const db = require('../database/database')

// Add a new transaction
router.post('/', (req, res) => {
  const {type, category, amount, date, description} = req.body
  const query = `INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?)`
  db.run(query, [type, category, amount, date, description], function (err) {
    if (err) {
      return res.status(500).json({error: err.message})
    }
    res.status(201).json({id: this.lastID})
  })
})

// Retrieve all transactions
router.get('/', (req, res) => {
  const query = `SELECT * FROM transactions`
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({error: err.message})
    }
    res.status(200).json(rows)
  })
})

// Retrieve a transaction by ID
router.get('/:id', (req, res) => {
  const query = `SELECT * FROM transactions WHERE id = ?`
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({error: err.message})
    }
    res.status(200).json(row || {message: 'Transaction not found'})
  })
})

// Update a transaction by ID
router.put('/:id', (req, res) => {
  const {type, category, amount, date, description} = req.body
  const query = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`
  db.run(
    query,
    [type, category, amount, date, description, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({error: err.message})
      }
      res.status(200).json({message: 'Transaction updated'})
    },
  )
})

// Delete a transaction by ID
router.delete('/:id', (req, res) => {
  const query = `DELETE FROM transactions WHERE id = ?`
  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({error: err.message})
    }
    res.status(200).json({message: 'Transaction deleted'})
  })
})

// Get transaction summary (total income, total expense, balance)
router.get('/summary', (req, res) => {
  const query = `
        SELECT
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
            (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) AS balance
        FROM transactions
    `
  db.get(query, [], (err, row) => {
    if (err) {
      return res.status(500).json({error: err.message})
    }
    res.status(200).json(row)
  })
})

module.exports = router
