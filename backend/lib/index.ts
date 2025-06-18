import express from "express"
import { createServer } from "http"
import Database from "./db"
import cors from "cors"
import morgan from "morgan"
import router from "./router"
;(async () => {
    await Database.init()

    const app = express()
    app.use(
        cors({
            origin: "*",
            credentials: true,
        })
    )
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(morgan("dev"))

    const server = createServer(app)

    app.use("/", router)

    const PORT = 3000
    server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})()
