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

def create_scores_table():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            score INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """
    )

    conn.commit()
    conn.close()


def create_tokens_table():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS tokens (
            token TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

def save_token(token, email):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT OR REPLACE INTO tokens (token, email)
        VALUES (?, ?)
        """,
        (token, email),
    )

    conn.commit()
    conn.close()


def get_email_by_token(token):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT email
        FROM tokens
        WHERE token = ?
        """,
        (token,),
    )

    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    return row[0]


def delete_token(token):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        DELETE FROM tokens
        WHERE token = ?
        """,
        (token,),
    )

    conn.commit()
    conn.close()


def save_score(user_id, score, total_questions):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO scores (user_id, score, total_questions)
        VALUES (?, ?, ?)
        """,
        (user_id, score, total_questions),
    )

    conn.commit()
    conn.close()


def get_scores_by_user(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, score, total_questions, created_at
        FROM scores
        WHERE user_id = ?
        ORDER BY created_at DESC
        """,
        (user_id,),
    )

    scores = cursor.fetchall()
    conn.close()
    return scores


def get_score_summary_by_user(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            COUNT(*),
            COALESCE(MAX(score), 0),
            COALESCE(AVG(score), 0),
            COALESCE(SUM(score), 0)
        FROM scores
        WHERE user_id = ?
        """,
        (user_id,),
    )

    summary = cursor.fetchone()

    cursor.execute(
        """
        SELECT score, total_questions, created_at
        FROM scores
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (user_id,),
    )

    latest_score = cursor.fetchone()
    conn.close()

    return {
        "total_attempts": summary[0] or 0,
        "best_score": summary[1] or 0,
        "average_score": float(summary[2] or 0),
        "total_score": summary[3] or 0,
        "latest_score": latest_score,
    }
