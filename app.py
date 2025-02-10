from flask import Flask, request, jsonify, render_template
import psycopg2
import os

app = Flask(__name__)

DATABASE_URL = os.environ.get("DATABASE_URL")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL, sslmode="require")

# Inicializar base de datos
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS envios (
            id SERIAL PRIMARY KEY,
            nombre TEXT NOT NULL,
            direccion TEXT NOT NULL,
            estado TEXT NOT NULL,
            descripcion TEXT NOT NULL
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add', methods=['POST'])
def add_envio():
    data = request.json
    nombre = data.get("nombre")
    direccion = data.get("direccion")
    estado = data.get("estado")
    descripcion = data.get("descripcion")

    if not all([nombre, direccion, estado, descripcion]):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""INSERT INTO envios (nombre, direccion, estado, descripcion) 
                      VALUES (%s, %s, %s, %s)""", (nombre, direccion, estado, descripcion))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Envío agregado correctamente"}), 201

@app.route('/envios', methods=['GET'])
def get_envios():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM envios")
    envios = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(envios)

@app.route('/update/<int:id>', methods=['PUT'])
def update_envio(id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""UPDATE envios SET nombre=%s, direccion=%s, estado=%s, descripcion=%s 
                      WHERE id=%s""", (data["nombre"], data["direccion"], data["estado"], data["descripcion"], id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Envío actualizado correctamente"})

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_envio(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM envios WHERE id=%s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Envío eliminado correctamente"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
