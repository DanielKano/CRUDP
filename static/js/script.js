document.addEventListener("DOMContentLoaded", cargarEnvios); // Cargar envíos al iniciar la página

// Función para agregar un nuevo envío
async function agregarEnvio() {
    const nombre = document.getElementById("nombre").value;
    const direccion = document.getElementById("direccion").value;
    const estado = document.getElementById("estado").value;
    const descripcion = document.getElementById("descripcion").value;

    if (!nombre || !direccion || !estado || !descripcion) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const respuesta = await fetch("/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, direccion, estado, descripcion })
    });

    if (respuesta.ok) {
        alert("Envío agregado correctamente");
        document.getElementById("nombre").value = "";
        document.getElementById("direccion").value = "";
        document.getElementById("estado").value = "";
        document.getElementById("descripcion").value = "";
        setTimeout(cargarEnvios, 500);  // Esperar 0.5 segundos antes de actualizar
    } else {
        alert("Error al agregar el envío");
    }
}

// Función para cargar los envíos en la tabla
async function cargarEnvios() {
    try {
        const respuesta = await fetch("/users");
        const envios = await respuesta.json();
        const tabla = document.getElementById("tablaEnvios");
        tabla.innerHTML = "<tr><th>ID</th><th>Nombre</th><th>Dirección</th><th>Estado</th><th>Descripción</th><th>Acciones</th></tr>";

        envios.forEach(([id, nombre, direccion, estado, descripcion]) => {
            const fila = `
                <tr>
                    <td>${id}</td>
                    <td><input type="text" class="form-control" value="${nombre}" onchange="actualizarEnvio(${id}, 'nombre', this.value)"></td>
                    <td><input type="text" class="form-control" value="${direccion}" onchange="actualizarEnvio(${id}, 'direccion', this.value)"></td>
                    <td><input type="text" class="form-control" value="${estado}" onchange="actualizarEnvio(${id}, 'estado', this.value)"></td>
                    <td><input type="text" class="form-control" value="${descripcion}" onchange="actualizarEnvio(${id}, 'descripcion', this.value)"></td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="eliminarEnvio(${id})">Eliminar</button>
                    </td>
                </tr>`;
            tabla.insertAdjacentHTML("beforeend", fila);
        });
    } catch (error) {
        console.error("Error al cargar envíos:", error);
    }
}

// Función para eliminar un envío
async function eliminarEnvio(id) {
    if (!confirm("¿Seguro que quieres eliminar este envío?")) return;

    const respuesta = await fetch(`/delete/${id}`, {
        method: "DELETE"
    });

    if (respuesta.ok) {
        alert("Envío eliminado");
        cargarEnvios();
    } else {
        alert("Error al eliminar el envío");
    }
}

// Función para actualizar un campo específico en la tabla
async function actualizarEnvio(id, columna, valor) {
    const datos = { [columna]: valor };

    const respuesta = await fetch(`/update/${id}`, {
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
