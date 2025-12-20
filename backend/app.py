from flask import Flask, request, jsonify
import psycopg2

app = Flask(__name__)

# ---------- DB CONNECTION ----------
def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        port=5433,
        database="planner",   # ime baze
        user="postgres",      # tvoj postgres user
        password="superuser"   # tvoja šifra
    )

# ---------- LOGIN (GET) ----------
@app.route("/login", methods=["GET"])
def login():
    username = request.args.get("username")
    password = request.args.get("password")

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        'SELECT password FROM planner."user" WHERE username = %s',
        (username,)
    )

    row = cur.fetchone()
    cur.close()
    conn.close()

    if row and row[0] == password:
        return jsonify({"status": "ok"}), 200
    else:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401


# ---------- JOIN / REGISTER (POST) ----------
@app.route("/join", methods=["POST"])
def join():
    data = request.json
    username = data["username"]
    password = data["password"]

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            'INSERT INTO planner."user" (username, password) VALUES (%s, %s)',
            (username, password)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        cur.close()
        conn.close()

    return jsonify({"status": "user created"}), 201


# ---------- GET TASK (GET) ----------
@app.route("/task", methods=["GET"])
def get_task():
    username = request.args.get("username")
    datum = request.args.get("datum")  # format: YYYY-MM-DD

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT task2do
        FROM planner.task
        WHERE username = %s AND datum = %s
        """,
        (username, datum)
    )

    row = cur.fetchone()
    cur.close()
    conn.close()

    if row:
        return jsonify({"task": row[0]}), 200
    else:
        return jsonify({"task": None}), 404


# ---------- ADD / UPDATE TASK (POST) ----------
@app.route("/task", methods=["POST"])
def add_task():
    data = request.json
    username = data["username"]
    datum = data["datum"]
    task2do = data["task2do"]

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            INSERT INTO planner.task (username, datum, task2do)
            VALUES (%s, %s, %s)
            ON CONFLICT (username, datum)
            DO UPDATE SET task2do = EXCLUDED.task2do
            """,
            (username, datum, task2do)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400
    finally:
        cur.close()
        conn.close()

    return jsonify({"status": "task saved"}), 201


# ---------- START SERVER ----------
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8001)

