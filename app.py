from flask import Flask, request, jsonify, render_template
import psycopg2
import os

app = Flask(__name__)  # 🔹 Definiendo Flask correctamente

# Obtener la URL de la base de datos desde las variables de entorno
DATABASE_URL = os.environ.get("DATABASE_URL")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL, sslmode="require")

# Inicializar base de datos
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

init_db()  # 🔹 Llamamos a la función para inicializar la base de datos

# Página principal
@app.route('/')
def index():
    return render_template('index.html')

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
    port = int(os.environ.get("PORT", 10000))  # Render asigna el puerto automáticamente
    app.run(host="0.0.0.0", port=port)
