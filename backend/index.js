const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

require("dotenv").config()

const { Pool } = require("pg")

const app = express()
const port = process.env.APP_PORT || 3002

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const pool = new Pool({
  //   user: process.env.DB_USER,
  //   host: process.env.DB_HOST,
  //   database: process.env.DB_NAME,
  //   password: process.env.DB_PASSWORD,
  //   port: process.env.DB_PORT,
  connectionString: process.env.DB_URL
})

app.use(cors())

app.post("/candidates", async (req, res) => {
  const { name, email, phone, skills, status, expected_salary } = req.body
  try {
    const result = await pool.query("INSERT INTO candidates (name, email, phone, skills, status, expected_salary) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [
      name,
      email,
      phone,
      JSON.stringify(skills),
      status,
      expected_salary
    ])

    res.json(result.rows[0])
  } catch (err) {
    console.error("Error inserting candidate:", err)
    res.status(500).json({ error: "Server error" })
  }
})

app.patch("/candidates/:id", async (req, res) => {
  const { id } = req.params
  const updates = req.body
  console.log("updates", updates)
  if (updates.skills) {
    updates.skills = JSON.stringify(updates.skills)
  }

  const fields = Object.keys(updates)
  const values = Object.values(updates)

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" })
  }

  const query = `UPDATE candidates SET ${fields.map((_, i) => `${fields[i]} = $${i + 1}`).join(", ")} WHERE id = $${fields.length + 1} RETURNING *`

  try {
    const result = await pool.query(query, [...values, id])

    if (result.rows.length > 0) {
      res.json(result.rows[0])
    } else {
      res.status(404).json({ error: "Candidate not found" })
    }
  } catch (err) {
    console.error("Error updating candidate:", err)
    res.status(500).json({ error: "Server error" })
  }
})

app.get("/candidates", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM candidates")
    res.json(result.rows)
  } catch (err) {
    console.error("Error fetching candidates:", err)
    res.status(500).json({ error: "Server error" })
  }
})

app.delete("/candidates/:id", async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query("DELETE FROM candidates WHERE id = $1 RETURNING *", [id])

    if (result.rows.length > 0) {
      res.json({ message: "Candidate deleted successfully" })
    } else {
      res.status(404).json({ error: "Candidate not found" })
    }
  } catch (err) {
    console.error("Error deleting candidate:", err)
    res.status(500).json({ error: "Server error" })
  }
})

app.listen(port, () => console.log(`Listening on port ${port}`))
