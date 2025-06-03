import { useKeycloak } from "@react-keycloak/web"
import axios from "axios"

function Home() {
    const { keycloak } = useKeycloak()

    const testProtected = async () => {
        const response = await axios.get("/api/protected", {
            headers: {
                Authorization: `Bearer ${keycloak.token}`,
            },
        })

        console.log("Protected response:", response.data)
    }

    return (
        <>
            <button className="btn btn-yellow" onClick={testProtected}>
                Test Protected Endpoint
            </button>
        </>
    )
}

export default Home
