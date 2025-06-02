import { useKeycloak } from "@react-keycloak/web"
import { redirect } from "react-router-dom"

export default function Login() {
    const { keycloak } = useKeycloak()

    if (keycloak.authenticated) {
        redirect("/")
    } else {
        keycloak.login({
            redirectUri: window.location.origin + "/",
        })
    }

    return <></>
}
