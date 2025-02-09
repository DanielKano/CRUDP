import sqlite3

# Conectar a la base de datos (si no existe, se crea automáticamente)
conn = sqlite3.connect("test.db")
cursor = conn.cursor()

# Crear la tabla si no existe
cursor.execute('''
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL
    )
''')

conn.commit()
conn.close()

print("Base de datos y tabla creadas correctamente.")
