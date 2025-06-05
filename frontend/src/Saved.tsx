import { useEffect, useState } from "react"
import type Book from "./book"
import axios from "axios"
import { useAuthHeaders } from "./hooks"
import { useKeycloak } from "@react-keycloak/web"
import { Link } from "react-router-dom"

function Saved() {
    const [favoritedBooks, setFavoritedBooks] = useState<Book[]>([])
    const authHeaders = useAuthHeaders()
    const { keycloak } = useKeycloak()

    useEffect(() => {
        const loadFavoritedBooks = async () => {
            if (!keycloak.authenticated) {
                return
            }
            const userId = keycloak.tokenParsed?.sub
            const response = await axios.get("/api/favorited/" + userId, authHeaders)

            if (response.status === 200) {
                setFavoritedBooks(response.data)
            } else {
                console.error("Failed to fetch favorited books:", response.statusText)
            }
        }
        loadFavoritedBooks()
    }, [])

    async function favoriteBook(bookId: number) {
        const userId = keycloak.tokenParsed?.sub
        try {
            const response = await axios.post(
                `/api/favorited/${userId}`,
                {
                    bookId,
                },
                authHeaders
            )

            if (response.status === 200) {
                if (favoritedBooks.some((favBook) => favBook.id === bookId)) {
                    setFavoritedBooks(favoritedBooks.filter((favBook) => favBook.id !== bookId))
                } else {
                    setFavoritedBooks([...favoritedBooks, response.data])
                }
            } else {
                console.error("Failed to favorite book:", response.statusText)
            }
        } catch (error) {
            console.error("Error favoriting book:", error)
        }
    }

    return (
        <div className="grid grid-cols-4 gap-4">
            {favoritedBooks.length === 0 ? (
                <p className="text-neutral-400">
                    No favorited books found.
                    <Link to="/" className="btn-yellow ml-2">
                        Go add some!
                    </Link>
                </p>
            ) : (
                favoritedBooks.map((book) => (
                    <div key={book.id} className="bg-zinc-700 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-neutral-200">{book.title}</h3>
                            {keycloak.authenticated && (
                                <span className="cursor-pointer" onClick={() => favoriteBook(book.id)}>
                                    {favoritedBooks.some((favBook) => favBook.id === book.id) ? (
                                        <span className="text-yellow-400">★ Favorited</span>
                                    ) : (
                                        <span className="text-neutral-500 hover:text-yellow-300">☆ Not Favorited</span>
                                    )}
                                </span>
                            )}
                        </div>
                        <p className="text-neutral-300">
                            Author: <strong>{book.author}</strong>
                        </p>
                        <p className="text-neutral-400">{book.description}</p>
                        {book.coverImageUrl && <img src={book.coverImageUrl} alt={`${book.title} cover`} className="mt-2 w-full h-auto" />}
                    </div>
                ))
            )}
        </div>
    )
}

export default Saved
