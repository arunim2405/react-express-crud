const express = require("express")
const bodyParser = require("body-parser")
const { Pool } = require("pg")

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const pool = new Pool({
  user: "your_database_user",
  host: "localhost",
  database: "your_database_name",
  password: "your_database_password",
  port: 5432
})

app.post("/candidates", async (req, res) => {
  const { name, email, phone, skills, status, expectedSalary } = req.body

  try {
    const result = await pool.query("INSERT INTO candidates (name, email, phone, skills, status, expected_salary) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [
      name,
      email,
      phone,
      skills,
      status,
      expectedSalary
    ])

    res.json(result.rows[0])
  } catch (err) {
    console.error("Error inserting candidate:", err)
    res.status(500).json({ error: "Server error" })
  }
})

app.patch("/candidates/:id", async (req, res) => {
  const { id } = req.params
  const { status, expectedSalary } = req.body

  try {
    const result = await pool.query("UPDATE candidates SET status = $1, expectedSalary = $2 WHERE id = $3 RETURNING *", [status, expectedSalary, id])

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
