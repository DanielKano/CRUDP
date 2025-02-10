from flask import Flask, request, jsonify, render_template
import psycopg2
import os

DATABASE_URL = os.environ.get("postgresql://usuarios_zdqm_user:dL2v72UjL3tuLyzN3BQDRUlaTAbu4oLp@dpg-cul0dg2n91rc73b0v260-a/usuarios_zdqm")  # Render define esta variable automáticamente

def get_db_connection():
    return psycopg2.connect(DATABASE_URL, sslmode="require")

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            nombre TEXT NOT NULL
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()


# API para agregar usuario
@app.route('/add', methods=['POST'])
def add_user():
    nombre = request.json.get("nombre")
    if not nombre:
        return jsonify({"error": "El nombre es obligatorio"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO usuarios (nombre) VALUES (%s)", (nombre,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": f"Usuario {nombre} agregado"}), 201


# API para obtener usuarios
@app.route('/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios")
    users = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(users)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Render asigna un puerto automáticamente
    app.run(host="0.0.0.0", port=port)
