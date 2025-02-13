const API_URL = "https://crudp-fg68.onrender.com";  // Reemplaza con tu URL real

document.addEventListener("DOMContentLoaded", cargarEnvios);

async function agregarEnvio() {
    const nombre = document.getElementById("nombre").value;
    const direccion = document.getElementById("direccion").value;
    const estado = document.getElementById("estado").value;
    const descripcion = document.getElementById("descripcion").value;

    if (!nombre || !direccion || !estado || !descripcion) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const respuesta = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, direccion, estado, descripcion })
    });

    if (respuesta.ok) {
        alert("Envío agregado correctamente");
        cargarEnvios();
    } else {
        alert("Error al agregar el envío");
    }
}

async function cargarEnvios() {
    try {
        const respuesta = await fetch("/envios");
        const envios = await respuesta.json();
        console.log("Datos recibidos:", envios);

        if (!Array.isArray(envios) || envios.length === 0) {
            console.warn("No hay datos disponibles.");
            return;
        }

        const tabla = document.getElementById("tabla-envios");
        tabla.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>Descripción</th>
                <th>Acciones</th>
            </tr>`;

        envios.forEach(([id, nombre, direccion, estado, descripcion]) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${id}</td>
                <td contenteditable="true" onblur="actualizarEnvio(${id}, 'nombre', this.innerText)">${nombre}</td>
                <td contenteditable="true" onblur="actualizarEnvio(${id}, 'direccion', this.innerText)">${direccion}</td>
                <td contenteditable="true" onblur="actualizarEnvio(${id}, 'estado', this.innerText)">${estado}</td>
                <td contenteditable="true" onblur="actualizarEnvio(${id}, 'descripcion', this.innerText)">${descripcion}</td>
                <td><button class="btn btn-danger" onclick="eliminarEnvio(${id})">Eliminar</button></td>
            `;
            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar los envíos:", error);
    }
}

async function eliminarEnvio(id) {
    if (!confirm("¿Seguro que quieres eliminar este envío?")) return;

    const respuesta = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE"
    });

    if (respuesta.ok) {
        alert("Envío eliminado");
        cargarEnvios();
    } else {
        alert("Error al eliminar el envío");
    }
}

async function actualizarEnvio(id, columna, valor) {
    const datos = { [columna]: valor };

    const respuesta = await fetch(`${API_URL}/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        alert("Error al actualizar");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript cargado correctamente!");
});
