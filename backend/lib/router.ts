import { Router, Request, Response } from "express"
import { KeycloakTokenPayload, verifyToken } from "./keycloak"
import User from "./user"

const router = Router()

router.get("/", (req, res) => {
    res.send("Hello, World!")
})

router.get("/health", (req, res) => {
    res.json({ status: "ok" })
})

router.get("/api/protected", verifyToken(), (req, res) => {
    const user: User = (req as any).user
    res.json({ message: "This is a protected route", user })
})

export default router
