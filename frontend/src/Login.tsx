import { useKeycloak } from "@react-keycloak/web"
import { useEffect } from "react"
import { redirect } from "react-router-dom"

export default function Login() {
    const { keycloak } = useKeycloak()

    useEffect(() => {
        if (keycloak.authenticated) {
            redirect("/")
        } else {
            keycloak.login({
                redirectUri: window.location.origin + "/",
            })
        }
    }, [keycloak])

    return <></>
}
