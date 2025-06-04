import { Request, Response, NextFunction } from "express"
import jwt, { JwtHeader, SigningKeyCallback } from "jsonwebtoken"
import jwksRsa from "jwks-rsa"
import User from "./user"

const keycloakIssuer = "http://keycloak:8080/realms/master"
const clientId = ["master-realm", "frontend"]

const jwksClient = jwksRsa({
    jwksUri: `${keycloakIssuer}/protocol/openid-connect/certs`,
})

function getKey(header: JwtHeader, callback: SigningKeyCallback): void {
    if (!header.kid) {
        const err = new Error("Missing kid in JWT header")
        console.error(err)
        callback(err, undefined)
        return
    }

    jwksClient.getSigningKey(header.kid, (err, key) => {
        if (err) {
            console.error("Error getting signing key:", err)
            callback(err, undefined)
            return
        }
        if (!key) {
            const err = new Error("Signing key not found")
            console.error(err)
            callback(err, undefined)
            return
        }

        const signingKey = key.getPublicKey()
        if (!signingKey) {
            const err = new Error("Public key not available")
            console.error(err)
            callback(err, undefined)
            return
        }

        callback(null, signingKey)
    })
}

export interface KeycloakTokenPayload extends jwt.JwtPayload {
    preferred_username?: string
    realm_access?: {
        roles: string[]
    }
    resource_access?: {
        [key: string]: {
            roles: string[]
        }
    }
}

export const verifyToken = (requiredRoles: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization

        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({ message: "Missing or invalid Authorization header" })
            return
        }

        const token = authHeader.split(" ")[1]
        jwt.verify(
            token,
            getKey,
            {
                audience: clientId,
                issuer: "http://localhost:8081/realms/master",
                algorithms: ["RS256"],
            },
            (err, decoded) => {
                if (err || !decoded) {
                    res.status(401).json({ message: "Token verification failed", error: err?.message })
                    return
                }

                const payload = decoded as KeycloakTokenPayload
                const userRoles = payload.realm_access?.roles || []

                const hasRole = requiredRoles.length === 0 || requiredRoles.some((role) => userRoles.includes(role))

                if (!hasRole) {
                    res.status(403).json({ message: "Insufficient role" })
                    return
                }

                ;(req as any).user = {
                    username: payload.preferred_username,
                    realmRoles: payload.realm_access?.roles || [],
                    resourceRoles: payload.resource_access,
                } as User
                next()
            }
        )
    }
}
