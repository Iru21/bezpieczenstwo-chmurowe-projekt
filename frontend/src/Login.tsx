import { useKeycloak } from "@react-keycloak/web"
import { isAdmin } from "./util"

export default function Login() {
    const { keycloak } = useKeycloak()

    return (
        <div className="flex flex-col gap-2">
            {keycloak.authenticated ? (
                <>
                    <p>Welcome, {keycloak.tokenParsed?.preferred_username}!</p>
                    <p>Are you libary admin? {isAdmin(keycloak) ? "Yes" : "No"}</p>
                </>
            ) : (
                "Not logged in"
            )}
            <button onClick={() => keycloak.login()}>Login</button>
            <button onClick={() => keycloak.logout()}>Logout</button>
        </div>
    )
}
