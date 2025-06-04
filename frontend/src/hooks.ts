import { useKeycloak } from "@react-keycloak/web"

export function useIsAdmin(): boolean {
    const { keycloak } = useKeycloak()
    if (!keycloak.authenticated) {
        return false
    }
    return keycloak.hasRealmRole("admin") || keycloak.hasResourceRole("library-admin", "frontend")
}

export function useAuthHeaders(): object | { headers: { Authorization: string } } {
    const { keycloak } = useKeycloak()
    if (keycloak.authenticated)
        return {
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
            },
        }
    else return {}
}
