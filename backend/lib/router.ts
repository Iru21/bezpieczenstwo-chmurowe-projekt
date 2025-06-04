import { Router, Request, Response } from "express"
import { KeycloakTokenPayload, verifyToken } from "./keycloak"
import { Book, BookManager } from "./books"

function adminOnly() {
    return verifyToken(["library-admin"])
}

const router = Router()

router.get("/", (req, res) => {
    res.send("Hello, World!")
})

router.get("/health", (req, res) => {
    res.json({ status: "ok" })
})

router.get("/api/books", async (req, res) => {
    try {
        const books = await BookManager.getAllBooks()
        res.json(books)
    } catch (error) {
        console.error("Error fetching books:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
})

router.post("/api/books", adminOnly(), (req, res) => {
    const { body } = req
    if (!body.title || !body.author || !body.description || !body.coverImageUrl) {
        res.status(400).json({ error: "Missing required fields" })
        return
    }
    if (typeof body.title !== "string" || typeof body.author !== "string" || typeof body.description !== "string" || typeof body.coverImageUrl !== "string") {
        res.status(400).json({ error: "Invalid field types" })
        return
    }
    BookManager.createBook(body.title, body.author, body.description, body.coverImageUrl)
    res.status(201).json({ message: "Book created successfully" })
})

router.delete("/api/books/:id", adminOnly(), async (req, res) => {
    const bookId = parseInt(req.params.id, 10)
    if (!bookId) {
        res.status(400).json({ error: "Book ID is required" })
        return
    }
    const books = await BookManager.getAllBooks()
    const book = books.find((b) => b.id === bookId)
    if (!book) {
        res.status(404).json({ error: "Book not found" })
        return
    }
    await BookManager.deleteBook(bookId)
    res.status(200).json({ message: "Book deleted successfully" })
})

export default router
