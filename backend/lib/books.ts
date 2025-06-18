import Database from "./db"

export class Book {
    constructor(public id: number, public title: string, public author: string, public description: string, public coverImageUrl: string) {}
}

export class BookManager {
    public static async getAllBooks(): Promise<Book[]> {
        const rows = await Database.query("SELECT * FROM books")
        if (!rows || rows.length === 0) {
            return []
        }
        return rows.map((row: any) => new Book(row.id, row.title, row.author, row.description, row.cover_image_url))
    }

    public static async createBook(title: string, author: string, description: string, coverImageUrl: string): Promise<void> {
        await Database.query("INSERT INTO books (title, author, description, cover_image_url) VALUES (?, ?, ?, ?)", [title, author, description, coverImageUrl])
    }

    public static async deleteBook(id: number): Promise<void> {
        await Database.query("DELETE FROM books WHERE id = ?", [id])
    }

    public static async favoriteBook(userId: string, bookId: number): Promise<void> {
        const exists = await Database.query("SELECT * FROM favorites WHERE user_id = ? AND book_id = ?", [userId, bookId])
        if (exists.length > 0) {
            await Database.query("DELETE FROM favorites WHERE user_id = ? AND book_id = ?", [userId, bookId])
            return
        }

        await Database.query("INSERT INTO favorites (user_id, book_id) VALUES (?, ?)", [userId, bookId])
    }

    public static async getFavoritedBooks(userId: string): Promise<Book[]> {
        const rows = await Database.query(
            `SELECT b.id, b.title, b.author, b.description, b.cover_image_url
            FROM books b
            JOIN favorites f ON b.id = f.book_id
            WHERE f.user_id = ?`,
            [userId]
        )
        return rows.map((row: any) => new Book(row.id, row.title, row.author, row.description, row.cover_image_url))
    }
}
