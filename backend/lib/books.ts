import Database from "./db"

export class Book {
    constructor(public id: number, public title: string, public author: string, public description: string, public coverImageUrl: string) {}
}

export class BookManager {
    public static async getAllBooks(): Promise<Book[]> {
        const rows = await Database.query("SELECT * FROM books")
        return rows.map((row: any) => new Book(row.id, row.title, row.author, row.description, row.cover_image_url))
    }

    public static async createBook(title: string, author: string, description: string, coverImageUrl: string): Promise<void> {
        Database.query("INSERT INTO books (title, author, description, cover_image_url) VALUES (?, ?, ?, ?)", [title, author, description, coverImageUrl])
    }

    public static async deleteBook(id: number): Promise<void> {
        Database.query("DELETE FROM books WHERE id = ?", [id])
    }
}
