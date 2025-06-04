import axios from "axios"
import { useAuthHeaders } from "./hooks"

function Home() {
    const authHeaders = useAuthHeaders()

    const testProtected = async () => {
        const response = await axios.get("/api/protected", authHeaders)
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
