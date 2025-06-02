import { BrowserRouter, Route, Routes, Link } from "react-router-dom"
import Login from "./Login"
import { useKeycloak } from "@react-keycloak/web"
import { isAdmin } from "./util"
import { useEffect } from "react"

export default function App() {
    const { keycloak } = useKeycloak()

    useEffect(() => {
        document.querySelectorAll("a, button").forEach((el) => {
            el.addEventListener("click", (e) => {
                ;(e.target as HTMLElement).blur()
            })
        })
    }, [])

    return keycloak.didInitialize ? (
        <>
            <BrowserRouter>
                <header className="flex justify-between items-center py-4 px-8 bg-zinc-800">
                    <h1 className="text-white text-2xl">Library App</h1>
                    <nav className="flex space-x-4">
                        {!keycloak.authenticated ? (
                            <Link to="/login">Login</Link>
                        ) : (
                            <>
                                <Link to="/">Home</Link>
                                <Link to="/saved">Saved Books</Link>
                                {isAdmin(keycloak) && <Link to="/admin">Admin Panel</Link>}
                            </>
                        )}
                    </nav>
                </header>
                <Routes>
                    <Route path="/" element={<></>} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </>
    ) : (
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg text-neutral-400">Loading...</p>
        </div>
    )
}
