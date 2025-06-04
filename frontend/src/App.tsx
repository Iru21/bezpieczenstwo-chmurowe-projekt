import { BrowserRouter, Route, Routes, Link } from "react-router-dom"
import Login from "./Login"
import { useKeycloak } from "@react-keycloak/web"
import { useEffect } from "react"
import Home from "./Home"
import { useIsAdmin } from "./hooks"
import Admin from "./Admin"

export default function App() {
    const { keycloak } = useKeycloak()
    const isAdmin = useIsAdmin()

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
                                {isAdmin && <Link to="/admin">Admin Panel</Link>}
                                <button className="btn-red" onClick={() => keycloak.logout({ redirectUri: window.location.origin })}>
                                    Logout
                                </button>
                            </>
                        )}
                    </nav>
                </header>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/saved" element={<></>} />
                </Routes>
            </BrowserRouter>
        </>
    ) : (
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg text-neutral-400">Loading...</p>
        </div>
    )
}
