import Keycloak from "keycloak-js"

export function isAdmin(keycloak: Keycloak): boolean {
    if (!keycloak.authenticated) {
        return false
    }
    return keycloak.hasRealmRole("admin") || keycloak.hasResourceRole("library-admin", "frontend")
}
