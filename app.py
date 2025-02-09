from flask import Flask, request, jsonify, render_template
import sqlite3
import os

app = Flask(__name__)

# Crear la base de datos y la tabla
def init_db():
    conn = sqlite3.connect("test.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()  # Inicializamos la base de datos

# Página web
@app.route('/')
def index():
    return render_template('index.html')

# API para agregar usuario
@app.route('/add', methods=['POST'])
def add_user():
    nombre = request.json.get("nombre")
    if not nombre:
        return jsonify({"error": "El nombre es obligatorio"}), 400

    conn = sqlite3.connect("test.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO usuarios (nombre) VALUES (?)", (nombre,))
    conn.commit()
    conn.close()

    return jsonify({"message": f"Usuario {nombre} agregado"}), 201

# API para obtener usuarios
@app.route('/users', methods=['GET'])
def get_users():
    conn = sqlite3.connect("test.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios")
    users = cursor.fetchall()
    conn.close()

    return jsonify(users)

if __name__ == '__main__':
    app.run(debug=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Render asigna el puerto automáticamente
    app.run(host="0.0.0.0", port=port)
