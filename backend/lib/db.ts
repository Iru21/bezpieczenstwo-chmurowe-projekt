import mariadb from "mariadb"

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 3306,
}

export default class Database {
    private static instance: Database
    private static pool: mariadb.Pool | null = null
    public static isInitialized: boolean = false
    private constructor() {}

    public static async init() {
        if (Database.isInitialized) {
            console.log("Database is already initialized.")
            return
        }

        const database = process.env.DB_NAME
        const tempConnection = await mariadb.createConnection(config)
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`)
        await tempConnection.end()

        Database.pool = mariadb.createPool({
            ...config,
            database,
            connectionLimit: 5,
        })

        Database.assertTables()

        Database.isInitialized = true
        console.log("Database initialized successfully")
    }

    private static async assertTables() {
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `

        const createBooksTable = `
            CREATE TABLE IF NOT EXISTS books (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                published_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `

        const createFavoritesTable = `
            CREATE TABLE IF NOT EXISTS favorites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                book_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
            );
        `

        await Database.query(createUsersTable)
        await Database.query(createBooksTable)
        await Database.query(createFavoritesTable)
    }

    public get instance(): Database {
        if (Database.instance === null) {
            Database.instance = new Database()
        }
        return Database.instance
    }

    public static async query<T>(sql: string, params?: any[]): Promise<T[]> {
        if (!Database.pool) {
            throw new Error("Database pool is not initialized. Call init() first.")
        }
        const connection = await Database.pool.getConnection()
        try {
            const result = await connection.query(sql, params)
            return Array.isArray(result) ? result : [result]
        } catch (error) {
            console.error("Database query error:", error)
            throw error
        } finally {
            if (connection) {
                await connection.release()
            }
        }
    }
}
