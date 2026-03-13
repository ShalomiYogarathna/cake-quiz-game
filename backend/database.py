import sqlite3

DB_NAME = "cake_shop.db"


def get_connection():
    return sqlite3.connect(DB_NAME)


def create_users_table():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
        """
    )

    conn.commit()
    conn.close()

def create_user(username, email, password):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
        """,
        (username, email, password),
    )

    conn.commit()
    conn.close()


def get_user_by_email(email):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, username, email, password
        FROM users
        WHERE email = ?
        """,
        (email,),
    )

    user = cursor.fetchone()
    conn.close()
    return user

