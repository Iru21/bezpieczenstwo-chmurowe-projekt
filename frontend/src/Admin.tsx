import axios from "axios"
import { useEffect, useState, type FormEvent } from "react"
import { useAuthHeaders, useIsAdmin } from "./hooks"

const AdminTab = {
    ManageBooks: "manage-books",
    AddBook: "add-book",
}

export default function Admin() {
    const authHeaders = useAuthHeaders()
    const isAdmin = useIsAdmin()
    const [tab, setTab] = useState(AdminTab.ManageBooks)
    const [books, setBooks] = useState<
        {
            id: number
            title: string
            description: string
            author: string
            coverImageUrl: string
        }[]
    >([])

    useEffect(() => {
        ;(async () => {
            if (!isAdmin) return
            const response = await axios.get("/api/books", authHeaders)

            if (response.status === 200) {
                setBooks(response.data)
            } else {
                console.error("Failed to fetch books:", response.statusText)
            }
        })()
    }, [])

    if (!isAdmin) {
        window.location.href = "/"
        return <></>
    }

    function ManageBooksTab() {
        return (
            <>
                <div className="flex flex-col gap-4">
                    {books.length === 0 ? (
                        <p className="text-neutral-400">No books available.</p>
                    ) : (
                        books.map((book) => (
                            <div key={book.id} className="bg-zinc-700 p-4 rounded-lg">
                                <h3 className="text-xl font-bold text-neutral-200">{book.title}</h3>
                                <p className="text-neutral-300">Author: {book.author}</p>
                                <p className="text-neutral-400">{book.description}</p>
                                {book.coverImageUrl && <img src={book.coverImageUrl} alt={`${book.title} cover`} className="mt-2 w-full h-auto rounded" />}
                            </div>
                        ))
                    )}
                </div>
            </>
        )
    }

    function AddBookTab() {
        async function addBook(event: FormEvent<HTMLFormElement>) {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const title = formData.get("title") as string
            const author = formData.get("author") as string
            const description = formData.get("description") as string
            const coverImageUrl = formData.get("coverImageUrl") as string

            if (!title || !author || !description || !coverImageUrl) {
                alert("All fields are required.")
                return
            }

            const response = await axios.post(
                "/api/books",
                {
                    title,
                    author,
                    description,
                    coverImageUrl,
                },
                authHeaders
            )

            if (response.status === 200) {
                alert("Book added successfully!")
                event.currentTarget.reset()
            } else {
                alert("Failed to add book. Please try again.")
            }
        }

        return (
            <>
                <form onSubmit={addBook}>
                    <label>
                        Title
                        <input type="text" name="title" className="input" placeholder="Book Title" />
                    </label>
                    <label>
                        Author
                        <input type="text" name="author" className="input" placeholder="Author Name" />
                    </label>
                    <label>
                        Description
                        <textarea name="description" className="input" placeholder="Book Description"></textarea>
                    </label>
                    <label>
                        Cover Image URL
                        <input type="text" name="coverImageUrl" className="input" placeholder="https://example.com/cover.jpg" />
                    </label>
                    <button type="submit" className="btn btn-yellow mt-4">
                        Add Book
                    </button>
                </form>
            </>
        )
    }

    function renderTabContent() {
        switch (tab) {
            case AdminTab.AddBook:
                return <AddBookTab />
            case AdminTab.ManageBooks:
            default:
                return <ManageBooksTab />
        }
    }

    function getTabName() {
        switch (tab) {
            case AdminTab.AddBook:
                return "Add Book"
            case AdminTab.ManageBooks:
            default:
                return "Manage Books"
        }
    }

    return (
        <>
            <div className="flex gap-6 max-lg:flex-wrap">
                <aside className="h-fit bg-zinc-800 lg:w-1/4 p-4">
                    <nav className="flex flex-col gap-2">
                        <button className="btn-yellow" onClick={() => setTab(AdminTab.ManageBooks)}>
                            Manage Books
                        </button>
                        <hr className="border-neutral-600" />
                        <button className="btn-yellow" onClick={() => setTab(AdminTab.AddBook)}>
                            Add Book
                        </button>
                    </nav>
                </aside>
                <main className="flex-1 flex flex-col gap-4">
                    <div className="flex-1 bg-zinc-800 p-4">
                        <h2 className="text-2xl font-bold text-neutral-200 mb-6">{getTabName()}</h2>
                        {renderTabContent()}
                    </div>
                </main>
            </div>
        </>
    )
}
