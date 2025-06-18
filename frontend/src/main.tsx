import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { ReactKeycloakProvider } from "@react-keycloak/web"
import Keycloak from "keycloak-js"

const client = new Keycloak({
    url: "https://keycloak.test",
    realm: "master",
    clientId: "frontend",
})

createRoot(document.getElementById("root")!).render(
    <>
        <ReactKeycloakProvider authClient={client}>
            <App />
        </ReactKeycloakProvider>
    </>
)
