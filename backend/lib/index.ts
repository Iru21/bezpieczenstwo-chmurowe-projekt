import express from "express"
import { createServer } from "http"
import Database from "./db"

;(async () => {
    await Database.init()

    const app = express()
    const server = createServer(app)

    app.get("/", (req, res) => {
        res.send("Hello, World!")
    })

    const PORT = 3000
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})()
