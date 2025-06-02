import { ReactKeycloakProvider } from "@react-keycloak/web"
import Keycloak from "keycloak-js"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./Login"

const keycloak = new Keycloak({
    url: "http://localhost:8081",
    realm: "master",
    clientId: "frontend",
})

export default function App() {
    return (
        <>
            <ReactKeycloakProvider authClient={keycloak}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Login />} />
                    </Routes>
                </BrowserRouter>
            </ReactKeycloakProvider>
        </>
    )
}
