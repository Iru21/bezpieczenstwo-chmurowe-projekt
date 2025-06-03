import express from "express"
import session from "express-session"
import Keycloak from "keycloak-connect"
import { createServer } from "http"
import Database from "./db"
import cors from "cors"
import morgan from "morgan"
;(async () => {
    await Database.init()

    const app = express()
    app.use(
        cors({
            origin: "http://localhost:8080",
            credentials: true,
        })
    )
    const memoryStore = new session.MemoryStore()
    app.use(
        session({
            secret: "secret-key",
            resave: false,
            saveUninitialized: true,
            store: memoryStore,
            cookie: {
                secure: false,
                httpOnly: true,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
            },
        })
    )
    const keycloak = new Keycloak(
        { store: memoryStore },
        {
            "bearer-only": true,
            "auth-server-url": "http://localhost:8081/auth",
            realm: "master",
            resource: "frontned",
            "ssl-required": "none",
            "confidential-port": 0,
        }
    )
    app.use(keycloak.middleware())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(morgan("dev"))

    const server = createServer(app)

    app.get("/", (req, res) => {
        res.send("Hello, World!")
    })

    app.get("/health", (req, res) => {
        res.json({ status: "ok" })
    })

    app.get("/api/protected", keycloak.protect(), (req, res) => {
        const { kauth } = req as any
        res.json({ message: "This is a protected route", user: kauth.grant.access_token.content })
    })

    const PORT = 3000
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})()
